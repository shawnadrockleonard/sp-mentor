ko.validation.init({
    messagesOnModified: false,
    insertMessages: false
});
var mentor;
(function (mentor) {
    var MentorContextViewModel = (function () {
        function MentorContextViewModel() {
            this.loading = ko.observable(true);
            this.mentorExists = ko.observable(false);
            this.updating = ko.observable(false);
            this.created = ko.observable(false);
            this.headerMessage = ko.observable();
            this.headerClass = ko.observable('alert-danger');
            this.notificationMessage = ko.observable('');
            this.notificationClass = ko.observable();
            this.searchMentorName = ko.observable();
            this.showButton = ko.observable(true);
            this.showForm = ko.observable(false);
            this.mentorCollection = ko.observableArray([]);
            this.mentorCollectionLoading = ko.observable(false);
            this.mentorSearchCollection = ko.observableArray(new Array());
            this.mentorSearchLoading = ko.observable(false);
            this.mentorSearchModifying = ko.observable(false);
            this.mentorCollectionExists = ko.computed(function () {
                if (typeof this.mentorCollection() !== typeof undefined) {
                    if (this.mentorCollection().length > 0)
                        return true;
                }
                return false;
            }, this, { deferEvaluation: true });
            this.showNotification = ko.computed(function () {
                if (typeof this.notificationMessage() !== 'undefined') {
                    if (this.notificationMessage().length > 0 || this.updating())
                        return true;
                }
                return false;
            }, this, { deferEvaluation: true });
            this.parseErrorThrown = function (responseText) {
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
            this.load = function () {
                var self = this;
                // Load the Context
                this.sharepointContext.load(Function.createDelegate(this, function (e, args) {
                    // Loaded
                    // Get Host Web Details
                    self.sharepointContext.getHostWebDetails();
                    // Get Current User and Query Mentor List
                    self.sharepointContext.getCurrentUser(function (e, args, userContext) {
                        var myId = userContext.get_id();
                        var myTitle = userContext.get_title();
                        var myLogin = userContext.get_loginName();
                        self.mentor.mentorUserId(myId);
                        self.mentor.mentorName(myTitle);
                        console.log("User ID: " + myId);
                        // query list for mentor
                        var userQueryXml = '<View><Query><Where><Eq><FieldRef Name="MentorName" LookupId="TRUE" /><Value Type="User">'
                            + myId + '</Value></Eq></Where>'
                            + '<OrderBy><FieldRef Name="Title" /></OrderBy>'
                            + '</Query>'
                            + '<RowLimit>1</RowLimit></View>';
                        self.sharepointContext.listQuery("Mentors", userQueryXml, function (e, args, listItems) {
                            var mentorExists = false;
                            var listItemEnumerator = listItems.getEnumerator();
                            while (listItemEnumerator.moveNext()) {
                                var oListItem = listItemEnumerator.get_current();
                                self.mentor.mentorTitle(oListItem.get_item("Title"));
                                var mentorUser = oListItem.get_item("MentorName");
                                self.mentor.mentorName(mentorUser.get_lookupValue());
                                self.mentor.mentorBio(oListItem.get_item("MentorBio"));
                                self.mentor.optionCareer(oListItem.get_item("MentorCareer"));
                                self.mentor.optionTechnical(oListItem.get_item("MentorTechnical"));
                                self.mentor.optionPresentation(oListItem.get_item("MentorPresentation"));
                                self.mentor.mentorSkillsTechnical(oListItem.get_item("MentorSkillsTechnical"));
                                self.mentor.mentorSkillsProfessional(oListItem.get_item("MentorSkillsProfessional"));
                                self.mentor.mentorComments(oListItem.get_item("MentorComments"));
                                var lkupCareer = oListItem.get_item("MentorLkupCareer");
                                //self.mentor.mentorCareer({ Value: lkupCareer.get_lookupId(), Text: lkupCareer.get_lookupValue() });
                                self.mentor.mentorCareerText(lkupCareer.get_lookupValue());
                                var lkupCommunity = oListItem.get_item("MentorLkupCommunity");
                                var lkupCommunityText = "";
                                jQuery.each(lkupCommunity, function (e, lkup) {
                                    lkupCommunityText += lkup.get_lookupValue() + ",";
                                });
                                self.mentor.mentorCommunityText(lkupCommunityText);
                                var lkupCountry = oListItem.get_item("MentorLkupCountry");
                                self.mentor.mentorCountryText(lkupCountry.get_lookupValue());
                                mentorExists = true;
                            }
                            self.mentorExists(mentorExists);
                            self.showForm(!mentorExists);
                            self.getUserRelationships();
                        }, function (e, args) {
                            console.log("Query mentor list failed: " + args.get_message());
                        });
                    }, function (e, args) {
                        console.log("User Query Failed: " + args.get_message());
                    });
                    var camlQueryXml = '<View><Query><OrderBy><FieldRef Name="SortOrder" Ascending="TRUE" /></OrderBy></Query><RowLimit>50</RowLimit></View>';
                    self.sharepointContext.listQuery("Country", camlQueryXml, function (e, arg, listItems) {
                        var listItemEnumerator = listItems.getEnumerator();
                        var options = [];
                        while (listItemEnumerator.moveNext()) {
                            var oListItem = listItemEnumerator.get_current();
                            options.push({
                                Value: oListItem.get_id(),
                                Text: oListItem.get_item("Title")
                            });
                        }
                        self.mentor.mentorCountryAvailable(options);
                    }, function (e, args) {
                        // Error Handler
                        console.log(args.get_message());
                    });
                    // Get Communities from Local Lookup List
                    camlQueryXml = '<View><Query><OrderBy><FieldRef Name="Title" /></OrderBy></Query><RowLimit>50</RowLimit></View>';
                    self.sharepointContext.listQuery("Community", camlQueryXml, function (e, arg, listItems) {
                        var listItemEnumerator = listItems.getEnumerator();
                        var options = [];
                        while (listItemEnumerator.moveNext()) {
                            var oListItem = listItemEnumerator.get_current();
                            options.push({
                                Value: oListItem.get_id(),
                                Text: oListItem.get_item("Title")
                            });
                        }
                        self.mentor.mentorCommunityAvailable(options);
                    }, function (e, args) {
                        // Error Handler
                        console.log(args.get_message());
                    });
                    // Get Careers from Local Lookup List
                    camlQueryXml = '<View><Query>'
                        + '<Where><Eq><FieldRef Name="IsDeprecated" /><Value Type="Boolean">0</Value></Eq></Where>'
                        + '<OrderBy><FieldRef Name="Title" /></OrderBy>'
                        + '</Query><RowLimit>50</RowLimit></View>';
                    self.sharepointContext.listQuery("Career", camlQueryXml, function (e, arg, listItems) {
                        var listItemEnumerator = listItems.getEnumerator();
                        var options = [];
                        while (listItemEnumerator.moveNext()) {
                            var oListItem = listItemEnumerator.get_current();
                            options.push({
                                Value: oListItem.get_id(),
                                Text: oListItem.get_item("Title")
                            });
                        }
                        self.mentor.mentorCareerAvailable(options);
                    }, function (e, args) {
                        // Error Handler
                        console.log(args.get_message());
                    });
                    self.loading(false);
                }), Function.createDelegate(this, function (e, args) {
                    // error result
                }));
            };
            this.getUserInfo = function () {
            };
            this.submitUserInfo = function (vmmodel, event) {
                var self = this;
                self.notificationMessage('');
                if (self.mentor.errors().length > 0) {
                    self.notificationClass("alert-danger");
                    self.notificationMessage("Correct form fields, then try again");
                }
                else {
                    // do something
                    self.showForm(false);
                    self.updating(true);
                    self.sharepointContext.saveMentor(self.mentor, function (e, arg) {
                        // success
                        console.log("Saving profile succeeded for: " + self.mentor.mentorName());
                        self.created(true);
                        self.updating(false);
                    }, function (e, args) {
                        // error  
                        self.notificationMessage('Error occurred while saving profile: ' + args.get_message());
                        self.updating(false);
                        self.showForm(true);
                    });
                }
            };
            this.editUserInfo = function () {
                // for show
            };
            this.getUserRelationships = function () {
                var self = this;
                self.notificationMessage('');
                // Retrieve my relationships
                jQuery.get("/api/mentor/" + location.search)
                    .done(function (result) {
                    self.mentorCollection(result);
                })
                    .fail(function (e, args, msg) {
                    self.notificationMessage(msg);
                })
                    .always(function (jqXhr, status) {
                });
            };
            this.searchUserRelationships = function () {
                var self = this;
                self.notificationMessage('');
                self.mentorSearchLoading(true);
                // Search profiles via CSOM and DB
                jQuery.get("/api/mentor" + location.search + "&searchName=" + self.searchMentorName())
                    .done(function (result) {
                    self.mentorSearchCollection(result);
                })
                    .fail(function (e, args, msg) {
                    var nmsg = self.parseErrorThrown(e.responseText);
                    self.notificationMessage(nmsg);
                })
                    .always(function (jqxhr, status) {
                    self.mentorSearchLoading(false);
                });
            };
            this.addUserRelationships = function (thisResult, event) {
                var self = this;
                self.notificationMessage('');
                self.mentorSearchModifying(true);
                var jsonPost = {
                    mentorId: thisResult.IdentityObjectId,
                    comments: null
                };
                jQuery.ajax({
                    type: 'POST',
                    url: "/api/mentor/insert/" + location.search,
                    data: ko.toJSON(jsonPost),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                })
                    .done(function (result) {
                    self.notificationMessage(result);
                    self.mentorSearchCollection.removeAll();
                    self.getUserRelationships();
                })
                    .fail(function (e, args, msg) {
                    self.notificationMessage(msg);
                })
                    .always(function (jqxhr, status) {
                    self.mentorSearchModifying(false);
                });
            };
            this.removeUserRelationships = function (thisResult, event) {
                var self = this;
                self.notificationMessage('');
                self.mentorSearchModifying(true);
                var jsonPost = {
                    mentorId: thisResult.IdentityObjectId,
                    comments: null
                };
                jQuery.ajax({
                    type: 'POST',
                    url: "/api/mentor/remove/" + location.search,
                    data: ko.toJSON(jsonPost),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                })
                    .done(function (result) {
                    self.notificationMessage(result);
                    self.getUserRelationships();
                })
                    .fail(function (e, args, msg) {
                    self.notificationMessage(msg);
                })
                    .always(function (jqxhr, status) {
                    self.mentorSearchModifying(false);
                });
            };
            this.saveUserRelationships = function () {
            };
            this.mentor = new mentor.MentorKnockoutModel();
            this.sharepointContext = new mentor.MentorContextModel();
        }
        return MentorContextViewModel;
    }());
    mentor.MentorContextViewModel = MentorContextViewModel;
})(mentor || (mentor = {}));
var vm = new mentor.MentorContextViewModel();
vm.mentor.errors = ko.validation.group(vm.mentor, { deep: true });
ko.applyBindings(vm);
vm.load();
//# sourceMappingURL=MentorContextViewModel.js.map