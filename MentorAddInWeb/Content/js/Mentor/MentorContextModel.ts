
namespace mentor {

    export class MentorContextModel {

        contextHelper: spexecutor;
        contextLoaded = ko.observable(false);
        hostweburl = ko.observable();
        appweburl = ko.observable();
        clientContext = ko.observable();
        hostWeb = ko.observable();
        appWeb = ko.observable();

        constructor() {
            this.contextHelper = new spexecutor();
        }

        // resources are in URLs in the form:
        // web_url/_layouts/15/resource
        scriptBaseUrl = ko.computed(function () {
            let self = this;

            if (typeof self.hostweburl() !== 'undefined') {
                if (self.hostweburl().length > 0)
                    return self.hostweburl() + "/_layouts/15/";
            }
            return null;
        }, this, { deferEvaluation: true });


        loadContext = ko.computed(function () {
            let self = this;

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
        getHostWebDetails = function execHostWebTitleQuery() {
            let self = this;

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
        }

        load = function (successHandler, errorHandler) {
            let self = this;
            var contextLoaded = false;
            if (!self.contextLoaded()) {
                //Get the URI decoded URLs.
                var qryHostUrl = decodeURIComponent(self.contextHelper.getQueryStringParameter("SPHostUrl"));
                self.hostweburl(qryHostUrl);
                var qryAppUrl = decodeURIComponent(self.contextHelper.getQueryStringParameter("SPAppWebUrl"));
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
        }

        listQuery = function (listName: string, camlQueryXml: string, lkupSuccessHandler: Function, lkupErrorHandler) {
            let self = this;

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
        }

        /**
        * Get the User ID store locally
        */
        getCurrentUser = function (userSuccessHandler, userErrorHandler) {
            let self = this;
            var userContext = self.hostWeb().get_currentUser();
            self.clientContext().load(userContext);
            self.clientContext().executeQueryAsync(
                Function.createDelegate(null, function (e, args) {
                    userSuccessHandler(e, args, userContext);
                }),
                Function.createDelegate(null, userErrorHandler)
            );
        }

        saveMentor = function (mentormodel: MentorKnockoutModel, saveSuccessHandler, saveErrorHandler) {
            let self = this;

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
            jQuery.each(mChooseCommunity, function (idx: number, option: OptionVM) {
                communityOptions += option.Value + ';#' + option.Text + ";#";
            });

            var loginName = new SP.FieldUserValue();
            if (mPersonId !== 0 && typeof mPersonId !== typeof undefined) {
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
            if (typeof mChooseCareer !== typeof undefined || mChooseCareer !== null) {
                var careerOptionsLookup = new SP.FieldLookupValue();
                careerOptionsLookup.set_lookupId(mChooseCareer.Value);
                this.oListItem.set_item("MentorLkupCareer", careerOptionsLookup);
            }
            if (typeof communityOptions !== typeof undefined && communityOptions.length > 0) {
                this.oListItem.set_item("MentorLkupCommunity", communityOptions.substring(0, communityOptions.length - 2));
            }
            if (typeof mChooseCountry !== typeof undefined || mChooseCountry !== null) {
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

        }
    }


}