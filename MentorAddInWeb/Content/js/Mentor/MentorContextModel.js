var mentor;
(function (mentor) {
    var MentorContextModel = (function () {
        function MentorContextModel() {
            var _this = this;
            this.contextLoaded = ko.observable(false);
            this.hostweburl = ko.observable();
            this.appweburl = ko.observable();
            // resources are in URLs in the form:
            // web_url/_layouts/15/resource
            this.scriptBaseUrl = ko.computed(function () {
                var parent = this;
                if (typeof parent.hostweburl() !== 'undefined') {
                    if (parent.hostweburl().length > 0)
                        return parent.hostweburl() + "/_layouts/15/";
                }
                return null;
            }, this, { deferEvaluation: true });
            this.contextHelper = new mentor.spexecutor();
            this.loadContext = ko.computed(function () {
                var parent = _this;
                var qryHostUrl = parent.hostweburl();
                var qryAppUrl = parent.appweburl();
                parent.clientContext = ko.observable(new SP.ClientContext(qryAppUrl));
                var factory = new SP.ProxyWebRequestExecutorFactory(qryAppUrl);
                parent.clientContext().set_webRequestExecutorFactory(factory);
                var appContextSite = new SP.AppContextSite(parent.clientContext(), qryHostUrl);
                parent.hostWeb = ko.observable(appContextSite.get_web());
                parent.appWeb = ko.observable(parent.clientContext().get_web());
                return true;
            }, this, { deferEvaluation: true });
        }
        // Function to retrieve the Host Web Title
        MentorContextModel.prototype.getHostWebDetails = function () {
            var parent = this;
            parent.clientContext().load(parent.hostWeb(), 'Title', 'Url');
            //Execute the query with all the previous 
            //  options and parameters
            parent.clientContext().executeQueryAsync(successHandler, errorHandler);
            // Function to handle the success event.
            // Prints the host web's title to the page.
            function successHandler() {
                console.log("<b>" + parent.hostWeb().get_title() + "</b>");
            }
            // Function to handle the error event.
            // Prints the error message to the page.
            function errorHandler(data, errorCode) {
                console.log("Could not complete cross-domain call: " + errorCode.get_message());
            }
        };
        MentorContextModel.prototype.load = function (successHandler, errorHandler) {
            var parent = this;
            var contextLoaded = false;
            if (!parent.contextLoaded()) {
                //Get the URI decoded URLs.
                var qryHostUrl = decodeURIComponent(parent.contextHelper.getQueryStringParameter("SPHostUrl"));
                parent.hostweburl(qryHostUrl);
                var qryAppUrl = decodeURIComponent(parent.contextHelper.getQueryStringParameter("SPAppWebUrl"));
                parent.appweburl(qryAppUrl);
                // Load the js files and continue to the successHandler
                parent.loadContext();
                parent.contextLoaded(true);
                successHandler();
            }
            else {
                // load context
                parent.loadContext();
                successHandler();
            }
        };
        MentorContextModel.prototype.listQuery = function (listName, camlQueryXml, lkupSuccessHandler, lkupErrorHandler) {
            var parent = this;
            var oList = parent.clientContext().get_web().get_lists().getByTitle(listName);
            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml(camlQueryXml);
            var collListItem = oList.getItems(camlQuery);
            parent.clientContext().load(collListItem);
            parent.clientContext().executeQueryAsync(function (e, args) {
                lkupSuccessHandler(e, args, collListItem);
            }, function (e, args) {
                lkupErrorHandler(e, args);
            });
        };
        /**
        * Get the User ID store locally
        */
        MentorContextModel.prototype.getCurrentUser = function (userSuccessHandler, userErrorHandler) {
            var parent = this;
            var userContext = parent.hostWeb().get_currentUser();
            parent.clientContext().load(userContext);
            parent.clientContext().executeQueryAsync(function (e, args) {
                userSuccessHandler(e, args, userContext);
            }, function (e, args) {
                userErrorHandler(e, args);
            });
        };
        MentorContextModel.prototype.saveMentor = function (mentormodel, saveSuccessHandler, saveErrorHandler) {
            var parent = this;
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
            if (mPersonId !== 0 && typeof mPersonId !== typeof undefined) {
                loginName.set_lookupId(mPersonId);
            }
            //Make the list item and save
            var oWebsite = parent.clientContext().get_web();
            var oList = oWebsite.get_lists().getByTitle("Mentors");
            var listItemCreationInfo = new SP.ListItemCreationInformation();
            var oListItem = oList.addItem(listItemCreationInfo);
            oListItem.set_item("Title", mTitle);
            oListItem.set_item("MentorName", loginName);
            oListItem.set_item("MentorBio", mBio);
            oListItem.set_item("MentorCareer", mOptionCareer.toString().toUpperCase());
            oListItem.set_item("MentorTechnical", mOptionTechnical.toString().toUpperCase());
            oListItem.set_item("MentorPresentation", mOptionPresentation.toString().toUpperCase());
            oListItem.set_item("MentorSkillsTechnical", mSkillsTechnical);
            oListItem.set_item("MentorSkillsProfessional", mSkillsProfessional);
            oListItem.set_item("MentorComments", mComments);
            if (typeof mChooseCareer !== typeof undefined || mChooseCareer !== null) {
                var careerOptionsLookup = new SP.FieldLookupValue();
                careerOptionsLookup.set_lookupId(mChooseCareer.Value);
                oListItem.set_item("MentorLkupCareer", careerOptionsLookup);
            }
            if (typeof communityOptions !== typeof undefined && communityOptions.length > 0) {
                oListItem.set_item("MentorLkupCommunity", communityOptions.substring(0, communityOptions.length - 2));
            }
            if (typeof mChooseCountry !== typeof undefined || mChooseCountry !== null) {
                var countryOptionsLookup = new SP.FieldLookupValue();
                countryOptionsLookup.set_lookupId(mChooseCountry.Value);
                oListItem.set_item("MentorLkupCountry", countryOptionsLookup);
            }
            oListItem.update();
            parent.clientContext().load(oListItem);
            parent.clientContext().executeQueryAsync(function (e, args) {
                saveSuccessHandler(e, args, mentormodel);
            }, function (e, args) {
                saveErrorHandler(e, args);
            });
        };
        return MentorContextModel;
    }());
    mentor.MentorContextModel = MentorContextModel;
})(mentor || (mentor = {}));
//# sourceMappingURL=MentorContextModel.js.map