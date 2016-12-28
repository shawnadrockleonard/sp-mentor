
ko.validation.init({
    messagesOnModified: false,
    insertMessages: false
});


namespace mentor {

    export class MentorContextViewModel {

        mentor: MentorKnockoutModel;
        sharepointContext: MentorContextModel;

        loading = ko.observable(true);
        mentorExists = ko.observable(false);
        updating = ko.observable(false);
        created = ko.observable(false);
        headerMessage = ko.observable();
        headerClass = ko.observable('alert-danger');
        notificationMessage = ko.observable('');
        notificationClass = ko.observable();
        searchMentorName = ko.observable();
        showButton = ko.observable(true);
        showForm = ko.observable(false);
        mentorCollection = ko.observableArray([]);
        mentorCollectionLoading = ko.observable(false);
        mentorSearchCollection = ko.observableArray(new Array<UserWithSkillsModel>());
        mentorSearchLoading = ko.observable(false);
        mentorSearchModifying = ko.observable(false);

        constructor() {
            this.mentor = new MentorKnockoutModel();
            this.sharepointContext = new MentorContextModel();
        }


        mentorCollectionExists = ko.computed(function () {
            if (typeof this.mentorCollection() !== typeof undefined) {
                if (this.mentorCollection().length > 0)
                    return true;
            }
            return false;
        }, this, { deferEvaluation: true });

        showNotification = ko.computed(function () {
            if (typeof this.notificationMessage() !== 'undefined') {
                if (this.notificationMessage().length > 0 || this.updating())
                    return true;
            }
            return false;
        }, this, { deferEvaluation: true });


        parseErrorThrown(responseText) {
            var msg = responseText;
            try {
                var parsed = jQuery.parseJSON(responseText);
                msg = parsed.Message;

                if (typeof parsed.ModelState !== 'undefined') {
                    var errArray = jQuery.map(parsed.ModelState, function (value, idx) {
                        return [value];
                    });
                    msg = msg.concat('<br />');
                    jQuery.each(errArray, function (idx, error) {
                        if (error.length > 0)
                            msg = msg.concat(error[0] + '<br />');
                    });
                }
            }
            catch (err) {
            }
            return msg;
        };

        load() {
            let parent = this;

            // Load the Context
            parent.sharepointContext.load(function (e: any, args: SP.ClientRequestSucceededEventArgs) {

                // Loaded
                // Get Host Web Details
                parent.sharepointContext.getHostWebDetails();

                // Get Current User and Query Mentor List
                parent.sharepointContext.getCurrentUser(function (e, args, userContext) {

                    var myId = userContext.get_id();
                    var myTitle = userContext.get_title();
                    var myLogin = userContext.get_loginName();
                    parent.mentor.mentorUserId(myId);
                    parent.mentor.mentorName(myTitle);
                    console.log("User ID: " + myId);

                    // query list for mentor
                    var userQueryXml = '<View><Query><Where><Eq><FieldRef Name="MentorName" LookupId="TRUE" /><Value Type="User">'
                        + myId + '</Value></Eq></Where>'
                        + '<OrderBy><FieldRef Name="Title" /></OrderBy>'
                        + '</Query>'
                        + '<RowLimit>1</RowLimit></View>';
                    parent.sharepointContext.listQuery("Mentors", userQueryXml, function (e, args, listItems) {
                        var mentorExists = false;
                        var listItemEnumerator = listItems.getEnumerator();
                        while (listItemEnumerator.moveNext()) {
                            var oListItem = listItemEnumerator.get_current();
                            parent.mentor.mentorTitle(oListItem.get_item("Title"));
                            var mentorUser = oListItem.get_item("MentorName");
                            parent.mentor.mentorName(mentorUser.get_lookupValue());
                            parent.mentor.mentorBio(oListItem.get_item("MentorBio"));
                            parent.mentor.optionCareer(oListItem.get_item("MentorCareer"));
                            parent.mentor.optionTechnical(oListItem.get_item("MentorTechnical"));
                            parent.mentor.optionPresentation(oListItem.get_item("MentorPresentation"));
                            parent.mentor.mentorSkillsTechnical(oListItem.get_item("MentorSkillsTechnical"));
                            parent.mentor.mentorSkillsProfessional(oListItem.get_item("MentorSkillsProfessional"));
                            parent.mentor.mentorComments(oListItem.get_item("MentorComments"));
                            var lkupCareer = oListItem.get_item("MentorLkupCareer");
                            //parent.mentor.mentorCareer({ Value: lkupCareer.get_lookupId(), Text: lkupCareer.get_lookupValue() });
                            parent.mentor.mentorCareerText(lkupCareer.get_lookupValue());
                            var lkupCommunity = oListItem.get_item("MentorLkupCommunity");
                            var lkupCommunityText = "";
                            jQuery.each(lkupCommunity, function (e, lkup) {
                                lkupCommunityText += lkup.get_lookupValue() + ","
                            });
                            parent.mentor.mentorCommunityText(lkupCommunityText);
                            var lkupCountry = oListItem.get_item("MentorLkupCountry");
                            parent.mentor.mentorCountryText(lkupCountry.get_lookupValue());
                            mentorExists = true;
                        }
                        parent.mentorExists(mentorExists);
                        parent.showForm(!mentorExists);

                        parent.getUserRelationships();
                    },
                        function (e, args) {
                            console.log("Query mentor list failed: " + args.get_message());
                        });
                },
                    function (e, args) {
                        console.log("User Query Failed: " + args.get_message());
                    });

                var camlQueryXml = '<View><Query><OrderBy><FieldRef Name="SortOrder" Ascending="TRUE" /></OrderBy></Query><RowLimit>50</RowLimit></View>';
                parent.sharepointContext.listQuery("Country", camlQueryXml, function (e, arg, listItems) {

                    var listItemEnumerator = listItems.getEnumerator();
                    var options = [];

                    while (listItemEnumerator.moveNext()) {
                        var oListItem = listItemEnumerator.get_current();
                        options.push(<OptionVM>{
                            Value: oListItem.get_id(),
                            Text: oListItem.get_item("Title")
                        });
                    }
                    parent.mentor.mentorCountryAvailable(options);
                },
                    function (e, args) {
                        // Error Handler
                        console.log(args.get_message());
                    });

                // Get Communities from Local Lookup List
                camlQueryXml = '<View><Query><OrderBy><FieldRef Name="Title" /></OrderBy></Query><RowLimit>50</RowLimit></View>';
                parent.sharepointContext.listQuery("Community", camlQueryXml, function (e, arg, listItems) {

                    var listItemEnumerator = listItems.getEnumerator();
                    var options = [];

                    while (listItemEnumerator.moveNext()) {
                        var oListItem = listItemEnumerator.get_current();
                        options.push(<OptionVM>{
                            Value: oListItem.get_id(),
                            Text: oListItem.get_item("Title")
                        });
                    }
                    parent.mentor.mentorCommunityAvailable(options);
                },
                    function (e, args) {
                        // Error Handler
                        console.log(args.get_message());
                    });

                // Get Careers from Local Lookup List
                camlQueryXml = '<View><Query>'
                    + '<Where><Eq><FieldRef Name="IsDeprecated" /><Value Type="Boolean">0</Value></Eq></Where>'
                    + '<OrderBy><FieldRef Name="Title" /></OrderBy>'
                    + '</Query><RowLimit>50</RowLimit></View>'
                parent.sharepointContext.listQuery("Career", camlQueryXml, function (e, arg, listItems) {

                    var listItemEnumerator = listItems.getEnumerator();
                    var options = [];

                    while (listItemEnumerator.moveNext()) {
                        var oListItem = listItemEnumerator.get_current();
                        options.push(<OptionVM>{
                            Value: oListItem.get_id(),
                            Text: oListItem.get_item("Title")
                        });
                    }
                    parent.mentor.mentorCareerAvailable(options);
                },
                    function (e, args) {
                        // Error Handler
                        console.log(args.get_message());
                    });

                parent.loading(false);
            },
            function (e: any, args: SP.ClientRequestFailedEventArgs) {
                // error result
            });
        };

        getUserInfo() {

        };

        submitUserInfo(vmmodel: MentorKnockoutModel, event: Event) {
            let parent = this;

            parent.notificationMessage('');
            if (parent.mentor.errors().length > 0) {
                parent.notificationClass("alert-danger");
                parent.notificationMessage("Correct form fields, then try again");
            }
            else {
                // do something
                parent.showForm(false);
                parent.updating(true);
                parent.sharepointContext.saveMentor(parent.mentor,
                    function (e: any, arg: SP.ClientRequestSucceededEventArgs, mentor: MentorKnockoutModel) {
                        // success
                        console.log("Saving profile succeeded for: " + mentor.mentorName());
                        parent.created(true);
                        parent.updating(false);
                    },
                    function (e: any, args: SP.ClientRequestFailedEventArgs) {
                        // error  
                        parent.notificationMessage('Error occurred while saving profile: ' + args.get_message());
                        parent.updating(false);
                        parent.showForm(true);
                    });
            }
        };

        editUserInfo() {
            // for show
        };

        getUserRelationships() {
            let parent = this;

            parent.notificationMessage('');
            // Retrieve my relationships
            jQuery.get("/api/mentor/" + location.search)
                .done(function (result) {

                    parent.mentorCollection(result);

                })
                .fail(function (e, args, msg) {
                    parent.notificationMessage(msg);
                })
                .always(function (jqXhr, status) {

                });

        };

        searchUserRelationships() {
            let parent = this;

            parent.notificationMessage('');
            parent.mentorSearchLoading(true);

            // Search profiles via CSOM and DB
            jQuery.get("/api/mentor" + location.search + "&searchName=" + parent.searchMentorName())
                .done(function (result) {

                    parent.mentorSearchCollection(result);
                })
                .fail(function (e, args, msg) {
                    var nmsg = parent.parseErrorThrown(e.responseText);
                    parent.notificationMessage(nmsg);
                })
                .always(function (jqxhr, status) {
                    parent.mentorSearchLoading(false);
                });

        };

        addUserRelationships(thisResult: UserWithSkillsModel, event: Event) {
            let parent = this;

            parent.notificationMessage('');
            parent.mentorSearchModifying(true);

            var jsonPost = {
                mentorId: thisResult.IdentityObjectId,
                comments: null
            }

            jQuery.ajax({
                type: 'POST',
                url: "/api/mentor/insert/" + location.search,
                data: ko.toJSON(jsonPost),
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            })
                .done(function (result) {
                    parent.notificationMessage(result);
                    parent.mentorSearchCollection.removeAll();
                    parent.getUserRelationships();
                })
                .fail(function (e, args, msg) {
                    parent.notificationMessage(msg);
                })
                .always(function (jqxhr, status) {
                    parent.mentorSearchModifying(false);
                });

        };

        removeUserRelationships(thisResult: UserWithSkillsModel, event: Event) {
            let parent = this;

            parent.notificationMessage('');
            parent.mentorSearchModifying(true);

            var jsonPost = {
                mentorId: thisResult.IdentityObjectId,
                comments: null
            }

            jQuery.ajax({
                type: 'POST',
                url: "/api/mentor/remove/" + location.search,
                data: ko.toJSON(jsonPost),
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            })
                .done(function (result) {

                    parent.notificationMessage(result);
                    parent.getUserRelationships();
                })
                .fail(function (e, args, msg) {
                    parent.notificationMessage(msg);
                })
                .always(function (jqxhr, status) {
                    parent.mentorSearchModifying(false);
                });

        };

        saveUserRelationships() {

        };
    }
}


var vm = new mentor.MentorContextViewModel();
vm.mentor.errors = ko.validation.group(vm.mentor, { deep: true });
ko.applyBindings(vm);
vm.load();
