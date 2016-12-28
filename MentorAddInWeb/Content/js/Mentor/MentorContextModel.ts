
namespace mentor {

    export class MentorContextModel {

        contextHelper: spexecutor;
        contextLoaded = ko.observable(false);
        hostweburl = ko.observable();
        appweburl = ko.observable();
        clientContext: KnockoutObservable<SP.ClientContext>;
        hostWeb: KnockoutObservable<SP.Web>;
        appWeb: KnockoutObservable<SP.Web>;
        loadContext: KnockoutComputed<boolean>;

        constructor() {
            this.contextHelper = new spexecutor();
            
            this.loadContext = ko.computed(() => {
                let parent = this;

                let qryHostUrl = <string>parent.hostweburl();
                let qryAppUrl = <string>parent.appweburl();

                parent.clientContext = ko.observable( new SP.ClientContext(qryAppUrl));
                let factory = new SP.ProxyWebRequestExecutorFactory(qryAppUrl);
                parent.clientContext().set_webRequestExecutorFactory(factory);

                let appContextSite = new SP.AppContextSite(parent.clientContext(), qryHostUrl);
                parent.hostWeb = ko.observable(appContextSite.get_web());
                parent.appWeb = ko.observable(parent.clientContext().get_web());
                return true;
            }, this, { deferEvaluation: true });
        }

        // resources are in URLs in the form:
        // web_url/_layouts/15/resource
        scriptBaseUrl = ko.computed(function () {
            let parent = this;

            if (typeof parent.hostweburl() !== 'undefined') {
                if (parent.hostweburl().length > 0)
                    return parent.hostweburl() + "/_layouts/15/";
            }
            return null;
        }, this, { deferEvaluation: true });


      

        // Function to retrieve the Host Web Title
        getHostWebDetails() {
            let parent = this;

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
            function errorHandler(data: any, errorCode: SP.ClientRequestFailedEventArgs) {
                console.log("Could not complete cross-domain call: " + errorCode.get_message());
            }
        }

        load(successHandler, errorHandler): void {
            let parent = this;
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
        }

        listQuery(listName: string, camlQueryXml: string,
            lkupSuccessHandler: (e: any, args: SP.ClientRequestSucceededEventArgs, collListItem: SP.ListItemCollection) => void,
            lkupErrorHandler: (e: any, args: SP.ClientRequestFailedEventArgs) => void) {
            let parent = this;

            var oList = parent.clientContext().get_web().get_lists().getByTitle(listName);
            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml(camlQueryXml);
            var collListItem = oList.getItems(camlQuery);

            parent.clientContext().load(collListItem);
            parent.clientContext().executeQueryAsync(
                function (e: any, args: SP.ClientRequestSucceededEventArgs) {
                    lkupSuccessHandler(e, args, collListItem);
                },
                function (e: any, args: SP.ClientRequestFailedEventArgs) {
                    lkupErrorHandler(e, args);
                }
            );
        }

        /**
        * Get the User ID store locally
        */
        getCurrentUser(userSuccessHandler, userErrorHandler) {
            let parent = this;
            var userContext = parent.hostWeb().get_currentUser();
            parent.clientContext().load(userContext);
            parent.clientContext().executeQueryAsync(function (e: any, args: SP.ClientRequestSucceededEventArgs) {
                userSuccessHandler(e, args, userContext);
            },
                function (e: any, args: SP.ClientRequestFailedEventArgs) {
                    userErrorHandler(e, args);
                }
            );
        }

        saveMentor(mentormodel: MentorKnockoutModel,
            saveSuccessHandler: (sender: any, args: SP.ClientRequestSucceededEventArgs, mentormodel: MentorKnockoutModel) => void,
            saveErrorHandler: (e: any, args: SP.ClientRequestFailedEventArgs) => void) {
            let parent = this;

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

            var oWebsite = parent.clientContext().get_web();
            var oList = oWebsite.get_lists().getByTitle("Mentors");

            var listItemCreationInfo = new SP.ListItemCreationInformation();
            let oListItem = oList.addItem(listItemCreationInfo);
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
            parent.clientContext().executeQueryAsync(
                function (e: any, args: SP.ClientRequestSucceededEventArgs) {
                    saveSuccessHandler(e, args, mentormodel);
                },
                function (e: any, args: SP.ClientRequestFailedEventArgs) {
                    saveErrorHandler(e, args)
                }
            );

        }
    }


}