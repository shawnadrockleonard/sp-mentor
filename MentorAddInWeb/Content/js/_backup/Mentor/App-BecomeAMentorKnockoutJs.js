"use strict";

ko.validation.init({
    messagesOnModified: false,
    insertMessages: false
});

var mentorProfile = function () {

    function mentorVM() {
        var self = this;
        self.mentorUserId = ko.observable();
        self.mentorTitle = ko.observable().extend({ required: true });
        self.mentorBio = ko.observable().extend({ required: true });
        self.mentorName = ko.observable().extend({ required: true });
        self.optionCareer = ko.observable(false);
        self.optionTechnical = ko.observable(false);
        self.optionPresentation = ko.observable(false);
        self.mentorSkillsTechnical = ko.observable();
        self.mentorSkillsProfessional = ko.observable();
        self.mentorComments = ko.observable();

        self.mentorCareer = ko.observable().extend({ required: true });
        self.mentorCareerAvailable = ko.observable([]);
        self.mentorCareerText = ko.observable();
        self.mentorCommunity = ko.observable([]);
        self.mentorCommunityAvailable = ko.observable([]);
        self.mentorCommunityText = ko.observable();
        self.mentorCountry = ko.observable();
        self.mentorCountryAvailable = ko.observable([]);
        self.mentorCountryText = ko.observable();
    };

    function mentorContextModel() {
        var self = this;

        self.contextLoaded = ko.observable(false);
        self.hostweburl = ko.observable();
        self.appweburl = ko.observable();
        self.clientContext = ko.observable();
        self.hostWeb = ko.observable();
        self.appWeb = ko.observable();

        // Function to retrieve a query string value.
        // For production purposes you may want to use
        //  a library to handle the query string.
        self.getQueryStringParameter = function (paramToRetrieve) {
            var params = document.URL.split("?")[1].split("&");
            var strParams = "";
            for (var i = 0; i < params.length; i = i + 1) {
                var singleParam = params[i].split("=");
                if (singleParam[0] == paramToRetrieve)
                    return singleParam[1];
            }
        };

        // resources are in URLs in the form:
        // web_url/_layouts/15/resource
        self.scriptBaseUrl = ko.computed(function () {
            if (typeof self.hostweburl() !== 'undefined') {
                if (self.hostweburl().length > 0)
                    return self.hostweburl() + "/_layouts/15/";
            }
            return null;
        }, this, { deferEvaluation: true });


        self.load = function (successHandler, errorHandler) {
            var contextLoaded = false;
            if (!self.contextLoaded()) {
                //Get the URI decoded URLs.
                var qryHostUrl = decodeURIComponent(self.getQueryStringParameter("SPHostUrl"));
                self.hostweburl(qryHostUrl);
                var qryAppUrl = decodeURIComponent(self.getQueryStringParameter("SPAppWebUrl"));
                self.appweburl(qryAppUrl);

                // Load the js files and continue to the successHandler
                jQuery.getScript(self.scriptBaseUrl() + "SP.Runtime.js",
                    function () {
                        jQuery.getScript(self.scriptBaseUrl() + "sp.core.js",
                            function () {
                                jQuery.getScript(self.scriptBaseUrl() + "SP.js",
                                    function () {
                                        jQuery.getScript(self.scriptBaseUrl() + "SP.RequestExecutor.js", function () {
                                            self.loadContext();
                                            self.contextLoaded(true);
                                            successHandler();
                                        });
                                    });
                            });
                    });
            }
            else {
                // load context
                self.loadContext();
                successHandler();
            }
        };

        self.loadContext = ko.computed(function () {
            var qryHostUrl = self.hostweburl();
            var qryAppUrl = self.appweburl();

            self.clientContext(new SP.ClientContext(qryAppUrl));
            var factory = new SP.ProxyWebRequestExecutorFactory(qryAppUrl);
            self.clientContext().set_webRequestExecutorFactory(factory);

            var appContextSite = new SP.AppContextSite(self.clientContext(), qryHostUrl);
            self.hostWeb(appContextSite.get_web());
            self.appWeb(self.clientContext().get_web());
            return true;
        }, this, { deferEvaluation: true });

        // Function to retrieve the Host Web Title
        self.getHostWebDetails = function execHostWebTitleQuery() {

            self.clientContext().load(self.hostWeb(), 'Title', 'Url');

            //Execute the query with all the previous 
            //  options and parameters
            self.clientContext().executeQueryAsync(
                Function.createDelegate(this, successHandler),
                Function.createDelegate(this, errorHandler)
            );

            // Function to handle the success event.
            // Prints the host web's title to the page.
            function successHandler() {
                console.log("<b>" + self.hostWeb().get_title() + "</b>");
            }

            // Function to handle the error event.
            // Prints the error message to the page.
            function errorHandler(data, errorCode, errorMessage) {
                console.log("Could not complete cross-domain call: " + errorMessage);
            }
        };

        self.listQuery = function (listName, camlQueryXml, lkupSuccessHandler, lkupErrorHandler) {

            var oList = self.clientContext().get_web().get_lists().getByTitle(listName);
            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml(camlQueryXml);
            var collListItem = oList.getItems(camlQuery);

            self.clientContext().load(collListItem);
            self.clientContext().executeQueryAsync(
                Function.createDelegate(this, function (e, args) {
                    lkupSuccessHandler(e, args, collListItem);
                }),
                Function.createDelegate(this, lkupErrorHandler)
            );
        };

        self.getCurrentUser = function (userSuccessHandler, userErrorHandler) {

            // Get the User ID store locally
            var userContext = self.hostWeb().get_currentUser();
            self.clientContext().load(userContext);
            self.clientContext().executeQueryAsync(
                 Function.createDelegate(null, function (e, args) {
                     userSuccessHandler(e, args, userContext);
                 }),
                 Function.createDelegate(null, userErrorHandler)
            );
        };

        self.saveMentor = function (mentormodel, saveSuccessHandler, saveErrorHandler) {

            var mTitle = mentormodel.mentorTitle();
            var mChooseCareer = mentormodel.mentorCareer();
            var mChooseCommunity = mentormodel.mentorCommunity();
            var mChooseCountry = mentormodel.mentorCountry();
            var mBio = mentormodel.mentorBio();
            var mOptionCareer = mentormodel.optionCareer();
            var mOptionTechnical = mentormodel.optionTechnical();
            var mOptionPresentation = mentormodel.optionPresentation();
            var mSkillsTechnical = mentormodel.mentorSkillsTechnical();
            var mSkillsProfessional = mentormodel.mentorSkillsProfessional();
            var mComments = mentormodel.mentorComments();
            var mPersonId = mentormodel.mentorUserId();

            var communityOptions = "";
            jQuery.each(mChooseCommunity, function (idx, option) {
                communityOptions += option.Value + ';#' + option.Text + ";#";
            });

            var loginName = new SP.FieldUserValue();
            if (mPersonId !== "") {
                loginName.set_lookupId(mPersonId);
            }

            //Make the list item and save

            var oWebsite = self.clientContext().get_web();
            var oList = oWebsite.get_lists().getByTitle("Mentors");

            var listItemCreationInfo = new SP.ListItemCreationInformation();
            this.oListItem = oList.addItem(listItemCreationInfo);
            this.oListItem.set_item("Title", mTitle);
            this.oListItem.set_item("MentorName", loginName);
            this.oListItem.set_item("MentorBio", mBio);
            this.oListItem.set_item("MentorCareer", mOptionCareer.toString().toUpperCase());
            this.oListItem.set_item("MentorTechnical", mOptionTechnical.toString().toUpperCase());
            this.oListItem.set_item("MentorPresentation", mOptionPresentation.toString().toUpperCase());
            this.oListItem.set_item("MentorSkillsTechnical", mSkillsTechnical);
            this.oListItem.set_item("MentorSkillsProfessional", mSkillsProfessional);
            this.oListItem.set_item("MentorComments", mComments);
            if (mChooseCareer !== undefined || mChooseCareer !== null) {
                var careerOptionsLookup = new SP.FieldLookupValue();
                careerOptionsLookup.set_lookupId(mChooseCareer.Value);
                this.oListItem.set_item("MentorLkupCareer", careerOptionsLookup);
            }
            if (communityOptions.length > 0) {
                this.oListItem.set_item("MentorLkupCommunity", communityOptions.substring(0, communityOptions.length - 2));
            }
            if (mChooseCountry.length !== undefined || mChooseCountry !== null) {
                var countryOptionsLookup = new SP.FieldLookupValue();
                countryOptionsLookup.set_lookupId(mChooseCountry.Value);
                this.oListItem.set_item("MentorLkupCountry", countryOptionsLookup);
            }
            this.oListItem.update();

            self.clientContext().load(this.oListItem);
            self.clientContext().executeQueryAsync(
                Function.createDelegate(this, saveSuccessHandler),
                Function.createDelegate(this, saveErrorHandler)
            );

        };
    };


    function mentorViewModel() {
        var self = this;

        self.mentor = new mentorVM();
        self.sharepointContext = new mentorContextModel();

        self.loading = ko.observable(true);
        self.mentorExists = ko.observable(false);
        self.updating = ko.observable(false);
        self.created = ko.observable(false);
        self.headerMessage = ko.observable();
        self.headerClass = ko.observable('alert-danger');
        self.notificationMessage = ko.observable();
        self.notificationClass = ko.observable();
        self.searchMentorName = ko.observable();
        self.showButton = ko.observable(true);
        self.showForm = ko.observable(false);
        self.mentorCollection = ko.observableArray([]);
        self.mentorCollectionLoading = ko.observable(false);
        self.mentorSearchColleciton = ko.observableArray([]);
        self.mentorSearchLoading = ko.observable(false);
        self.mentorSearchModifying = ko.observable(false);
        self.mentorCollectionExists = ko.computed(function () {
            if (typeof self.mentorCollection() !== 'undefined') {
                if (self.mentorCollection().length > 0)
                    return true;
            }
            return false;
        }, this, { deferEvaluation: true });

        self.showNotification = ko.computed(function () {
            if (typeof self.notificationMessage() !== 'undefined') {
                if (self.notificationMessage().length > 0 || self.updating())
                    return true;
            }
            return false;
        }, this, { deferEvaluation: true });

        self.parseErrorThrown = function (responseText) {
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

        self.load = function () {

            // Load the Context
            self.sharepointContext.load(Function.createDelegate(this, function (e, args) {

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
                                lkupCommunityText += lkup.get_lookupValue() + ","
                            });
                            self.mentor.mentorCommunityText(lkupCommunityText);
                            var lkupCountry = oListItem.get_item("MentorLkupCountry");
                            self.mentor.mentorCountryText(lkupCountry.get_lookupValue());
                            mentorExists = true;
                        }
                        self.mentorExists(mentorExists);
                        self.showForm(!mentorExists);

                        self.getUserRelationships();
                    },
                    function (e, args) {
                        console.log("Query mentor list failed: " + args.get_message());
                    });
                },
                function (e, args) {
                    console.log("User Query Failed: " + args.get_message());
                });

                var camlQueryXml = '<View><Query><OrderBy><FieldRef Name="SortOrder" Ascending="TRUE" /></OrderBy></Query><RowLimit>50</RowLimit></View>';
                self.sharepointContext.listQuery("Country", camlQueryXml, function (e, arg, listItems) {

                    var listItemEnumerator = listItems.getEnumerator();
                    var options = [];

                    while (listItemEnumerator.moveNext()) {
                        var oListItem = listItemEnumerator.get_current();
                        options.push({ Value: oListItem.get_id(), Text: oListItem.get_item("Title") });
                    }
                    self.mentor.mentorCountryAvailable(options);
                },
                function (e, args) {
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
                        options.push({ Value: oListItem.get_id(), Text: oListItem.get_item("Title") });
                    }
                    self.mentor.mentorCommunityAvailable(options);
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
                self.sharepointContext.listQuery("Career", camlQueryXml, function (e, arg, listItems) {

                    var listItemEnumerator = listItems.getEnumerator();
                    var options = [];

                    while (listItemEnumerator.moveNext()) {
                        var oListItem = listItemEnumerator.get_current();
                        options.push({ Value: oListItem.get_id(), Text: oListItem.get_item("Title") });
                    }
                    self.mentor.mentorCareerAvailable(options);
                },
                function (e, args) {
                    // Error Handler
                    console.log(args.get_message());
                });

                self.loading(false);
            }),
            Function.createDelegate(this, function (e, args) {
                // error result
            }));
        };

        self.getUserInfo = function () {

        };

        self.submitUserInfo = function () {
            self.notificationMessage('');
            if (self.mentor.errors().length > 0) {
                self.notificationClass("alert-danger");
                self.notificationMessage("Correct form fields, then try again");
            }
            else {
                // do something
                self.showForm(false);
                self.updating(true);
                self.sharepointContext.saveMentor(self.mentor,
                    function (e, arg) {
                        // success
                        console.log("Saving profile succeeded for: " + self.mentor.mentorName());
                        self.created(true);
                        self.updating(false);
                    },
                    function (e, args) {
                        // error  
                        self.notificationMessage('Error occurred while saving profile: ' + args.get_message());
                        self.updating(false);
                        self.showForm(true);
                    });
            }
        };

        self.editUserInfo = function () {
            // for show
        };

        self.getUserRelationships = function () {

            self.notificationMessage('');
            // Retrieve my relationships
            jQuery.get("/api/mentor/" + location.search)
             .done(function (result) {

                 self.mentorCollection(result);

             })
            .fail(function (e, args, msg) {
                self.notificationMessage(msg);
            })
            .complete(function (jqXhr, status) {

            });

        };

        self.searchUserRelationships = function () {

            self.notificationMessage('');
            self.mentorSearchLoading(true);

            // Search profiles via CSOM and DB
            jQuery.get("/api/mentor" + location.search + "&searchName=" + self.searchMentorName())
             .done(function (result) {

                 self.mentorSearchColleciton(result);
               })
            .fail(function (e, args, msg) {
                var nmsg = self.parseErrorThrown(e.responseText);
                self.notificationMessage(nmsg);
            })
            .complete(function (jqxhr, status) {
                self.mentorSearchLoading(false);
            });

        };

        self.addUserRelationships = function () {
            var thisResult = this;

            self.notificationMessage('');
            self.mentorSearchModifying(true);

            var jsonPost = { mentorId: thisResult.IdentityObjectId, comments: null }

            jQuery.ajax({
                type: 'POST',
                url: "/api/mentor/insert/" + location.search,
                data: ko.toJSON(jsonPost),
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            })
             .done(function (result) {

                 self.notificationMessage(result);
                 self.mentorSearchColleciton.removeAll();
                 self.getUserRelationships();
             })
            .fail(function (e, args, msg) {
                self.notificationMessage(msg);
            })
            .complete(function (jqxhr, status) {
                self.mentorSearchModifying(false);
            });

        };

        self.removeUserRelationships = function () {
            var thisResult = this;

            self.notificationMessage('');
            self.mentorSearchModifying(true);

            var jsonPost = { mentorId: thisResult.IdentityObjectId, comments: null }

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
            .complete(function (jqxhr, status) {
                self.mentorSearchModifying(false);
            });

        };

        self.saveUserRelationships = function () {

        };
    }

    return {
        vm: mentorViewModel
    }
}();


var vm = new mentorProfile.vm();
vm.mentor.errors = ko.validation.group(vm.mentor, { deep: true });
ko.applyBindings(vm);
vm.load();
