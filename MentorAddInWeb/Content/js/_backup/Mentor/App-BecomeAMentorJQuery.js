"use strict";

var hostweburl;
var appweburl;
var userContext;

// Load the required SharePoint libraries
$(document).ready(function () {
    //Get the URI decoded URLs.
    hostweburl =
        decodeURIComponent(
            getQueryStringParameter("SPHostUrl")
    );
    appweburl =
        decodeURIComponent(
            getQueryStringParameter("SPAppWebUrl")
    );

    setFormDisplay("divFormLoader", true);
    setFormDisplay("divFormExists", false);
    setFormDisplay("divFormCreated", false);
    setFormDisplay("divFormGroup", false);

    // resources are in URLs in the form:
    // web_url/_layouts/15/resource
    var scriptbase = hostweburl + "/_layouts/15/";

    // Load the js files and continue to the successHandler
    jQuery.getScript(scriptbase + "SP.Runtime.js",
        function () {
            jQuery.getScript(scriptbase + "sp.core.js",
                function () {
                    jQuery.getScript(scriptbase + "SP.js",
                        function () {
                            jQuery.getScript(scriptbase + "SP.RequestExecutor.js", function () {


                                var clientContext = new SP.ClientContext(appweburl);
                                var factory = new SP.ProxyWebRequestExecutorFactory(appweburl);
                                clientContext.set_webRequestExecutorFactory(factory);
                                var appContextSite = new SP.AppContextSite(clientContext, hostweburl);
                                var hostWeb = appContextSite.get_web();
                                var appWeb = clientContext.get_web();

                                // Get Host Web Title
                                execHostWebTitleQuery(clientContext, hostWeb);

                                // Retrieve Lists for Drop Downs
                                execMentorQuery(clientContext, appWeb);

                                // Get the User ID store locally
                                userContext = hostWeb.get_currentUser();
                                clientContext.load(userContext);
                                clientContext.executeQueryAsync(
                                     Function.createDelegate(null, ensureUserSuccess),
                                     Function.createDelegate(null, onFail)
                                );

                            });
                        });
                });
        });
});

function execMentorQuery(clientContext, appWeb) {

    var camlQueryXml = '<View><Query><OrderBy><FieldRef Name="SortOrder" Ascending="TRUE" /></OrderBy></Query><RowLimit>50</RowLimit></View>';
    getLkup(clientContext, appWeb, "Country", "#chooseCountry", camlQueryXml);

    // Get Communities from Local Lookup List
    camlQueryXml = '<View><Query><OrderBy><FieldRef Name="Title" /></OrderBy></Query><RowLimit>50</RowLimit></View>';
    getLkup(clientContext, appWeb, "Community", "#chooseCommunity", camlQueryXml);

    // Get Careers from Local Lookup List
    camlQueryXml = '<View><Query>'
        + '<Where><Eq><FieldRef Name="IsDeprecated" /><Value Type="Boolean">0</Value></Eq></Where>'
        + '<OrderBy><FieldRef Name="Title" /></OrderBy>'
        + '</Query><RowLimit>50</RowLimit></View>'
    getLkup(clientContext, appWeb, "Career", "#chooseCareer", camlQueryXml);
}

function ensureUserSuccess(e, args) {

    var myId = userContext.get_id();
    var myTitle = userContext.get_title();
    var myLogin = userContext.get_loginName();
    $('#userId').val(myId);
    $('#peoplePickerDiv').html(myTitle);
    console.log(myId);
    checkUserNameInList(myId);
}

function onFail(sender, args) {
    console.log('Query failed. Error: ' + args.get_message());
}

// Get Countries from Local Lookup List
function getLkup(clientContext, hostWeb, listName, formFieldName, camlQueryXml) {

    var oList = clientContext.get_web().get_lists().getByTitle(listName);
    var formFieldInput = $(formFieldName);
    formFieldInput.empty();
    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml(camlQueryXml);
    var collListItem = oList.getItems(camlQuery);

    clientContext.load(collListItem);
    clientContext.executeQueryAsync(
        Function.createDelegate(this, lkupSuccessHandler),
        Function.createDelegate(this, lkupErrorHandler)
    );

    function lkupSuccessHandler(e, args) {
        var listItemInfo = "";
        var listItemEnumerator = collListItem.getEnumerator();

        while (listItemEnumerator.moveNext()) {
            var oListItem = listItemEnumerator.get_current();
            $("<option />", { val: oListItem.get_id(), text: oListItem.get_item("Title") }).appendTo(formFieldInput);
        }
    }

    function lkupErrorHandler(e, args) {
        console.log("Request failed: " + args.get_message());
    }
}

// Function to retrieve the Host Web Title
function execHostWebTitleQuery(clientContext, hostWeb) {
    // context: The ClientContext object provides access to
    //      the web and lists objects.
    // factory: Initialize the factory object with the
    //      app web URL.

    clientContext.load(hostWeb, 'Title','Url');

    //Execute the query with all the previous 
    //  options and parameters
    clientContext.executeQueryAsync(
        Function.createDelegate(this, successHandler),
        Function.createDelegate(this, errorHandler)
    );

    // Function to handle the success event.
    // Prints the host web's title to the page.
    function successHandler() {
        console.log("<b>" + hostWeb.get_title() + "</b>");
    }

    // Function to handle the error event.
    // Prints the error message to the page.
    function errorHandler(data, errorCode, errorMessage) {
        console.log("Could not complete cross-domain call: " + errorMessage);
    }
}

// Function to retrieve a query string value.
// For production purposes you may want to use
//  a library to handle the query string.
function getQueryStringParameter(paramToRetrieve) {
    var params =
        document.URL.split("?")[1].split("&");
    var strParams = "";
    for (var i = 0; i < params.length; i = i + 1) {
        var singleParam = params[i].split("=");
        if (singleParam[0] == paramToRetrieve)
            return singleParam[1];
    }
}

function setFormDisplay(formFieldName, isVisible) {
    if (isVisible) {
        $("#" + formFieldName).show();
    }
    else {
        $("#" + formFieldName).hide();
    }
}

function checkUserNameInList(myUserId) {

    var clientContext = new SP.ClientContext(appweburl);
    var factory = new SP.ProxyWebRequestExecutorFactory(appweburl);
    clientContext.set_webRequestExecutorFactory(factory);
    var appContextSite = new SP.AppContextSite(clientContext, hostweburl);
    var hostWeb = appContextSite.get_web();
    var appWeb = clientContext.get_web();


    var oList = appWeb.get_lists().getByTitle("Mentors");
    var camlQuery = new SP.CamlQuery();
    var camlQueryXml = '<View><Query><Where><Eq><FieldRef Name="MentorName" LookupId="TRUE" /><Value Type="User">'
        + myUserId + '</Value></Eq></Where>'
        + '<OrderBy><FieldRef Name="Title" /></OrderBy>'
        + '</Query>'
        + '<RowLimit>1</RowLimit></View>';
    camlQuery.set_viewXml(camlQueryXml);
    var collListItem = oList.getItems(camlQuery);

    clientContext.load(collListItem);
    clientContext.executeQueryAsync(
        Function.createDelegate(this, successQueryMentor),
        Function.createDelegate(this, errorQueryMentor)
    );

    function successQueryMentor(e, args) {
        var listItemInfo = "";
        var listItemEnumerator = collListItem.getEnumerator();

        var mentorExists = false;
        while (listItemEnumerator.moveNext()) {
            var oListItem = listItemEnumerator.get_current();
            $("#inputTitle").html(oListItem.get_item("Title"));
            var oName = oListItem.get_item("MentorName");
            $("#inputBio").html(oListItem.get_item("MentorBio"));
            var isCareer = oListItem.get_item("MentorCareer");
            if (isCareer) { $("#optionCareer").show(); } else { $("#optionCareer").hide(); }
            var isTechnical = oListItem.get_item("MentorTechnical");
            if (isTechnical) { $("#optionTechnical").show(); } else { $("#optionTechnical").hide(); }
            var isPresentation = oListItem.get_item("MentorPresentation");
            if (isPresentation) { $("#optionPresentation").show(); } else { $("#optionPresentation").hide(); }
            $("#inputSkillsTechnical").html(oListItem.get_item("MentorSkillsTechnical"));
            $("#inputSkillsProfessional").html(oListItem.get_item("MentorSkillsProfessional"));
            $("#inputComments").html(oListItem.get_item("MentorComments"));
            var lkupCareer = oListItem.get_item("MentorLkupCareer");
            $("#chooseCareer").html(lkupCareer.get_lookupValue());
            var lkupCommunity = oListItem.get_item("MentorLkupCommunity");
            var lkupCommunityText = "";
            jQuery.each(lkupCommunity, function (e, lkup) {
                lkupCommunityText += lkup.get_lookupValue() + ","
            });
            $("#chooseCommunity").html(lkupCommunityText);
            var lkupCountry = oListItem.get_item("MentorLkupCountry");
            $("#chooseCountry").html(lkupCountry.get_lookupValue());

            mentorExists = true;
        }

        setFormDisplay("divFormLoader", false);
        setFormDisplay("divFormExists", mentorExists);
        setFormDisplay("divFormCreated", false);
        setFormDisplay("divFormGroup", !mentorExists);
    }

    function errorQueryMentor(e, args) {
        setFormDisplay("divFormLoader", false);
        setFormDisplay("divFormExists", true);
        $("#formExistsMessage").html("<span class='error'>Request failed: " + args.get_message() + "</span>");
        console.log("Request failed: " + args.get_message());
    }
}

function submitUserInfo() {

    //Get the items we need
    var mTitle = $("#inputTitle").val();
    var mChooseCareer = $("#chooseCareer").val();
    var mChooseCareerOptions = $("#chooseCareer option");
    var mChooseCommunity = $("#chooseCommunity").val();
    var mChooseCommunityOptions = $("#chooseCommunity option");
    var mChooseCountry = $("#chooseCountry").val();
    var mChooseCountryOptions = $("#chooseCountry option");

    var mBio = $("#inputBio").val();
    var mOptionCareer = $("#optionCareer").prop('checked');
    var mOptionTechnical = $("#optionTechnical").prop('checked');
    var mOptionPresentation = $("#optionPresentation").prop('checked');
    var mSkillsTechnical = $("#inputSkillsTechnical").val();
    var mSkillsProfessional = $("#inputSkillsProfessional").val();
    var mComments = $("#inputComments").val();
    var mPersonId = $('#userId').val();

    var communityOptions = "";
    jQuery.each(mChooseCommunityOptions, function (index, option) {
        optionTitle = jQuery.grep(mChooseCommunity, function (valueId, valueIndex) {
            return (valueId == option.value);
        });

        if (optionTitle.length > 0) {
            communityOptions += option.value + ';#' + option.text + ";#";
        }
    });
    var careerOptions = jQuery.grep(mChooseCareerOptions, function (value, i) {
        return (value.value == mChooseCareer);
    });
    var countryOptions = jQuery.grep(mChooseCountryOptions, function (value, i) {
        return (value.value == mChooseCountry);
    });

    var loginName = new SP.FieldUserValue();
    if (mPersonId !== "") {
        loginName.set_lookupId(mPersonId);
    }

    //Make the list item and save
    var clientContext = new SP.ClientContext(appweburl);
    var factory = new SP.ProxyWebRequestExecutorFactory(appweburl);
    clientContext.set_webRequestExecutorFactory(factory);

    var oWebsite = clientContext.get_web();
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
    if (careerOptions.length > 0) {
        var careerOptionsLookup = new SP.FieldLookupValue();
        careerOptionsLookup.set_lookupId(careerOptions[0].value);
        this.oListItem.set_item("MentorLkupCareer", careerOptionsLookup);
    }
    if (communityOptions.length > 0) {
        this.oListItem.set_item("MentorLkupCommunity", communityOptions.substring(0, communityOptions.length - 2));
    }
    if (countryOptions.length > 0) {
        var countryOptionsLookup = new SP.FieldLookupValue();
        countryOptionsLookup.set_lookupId(countryOptions[0].value);
        this.oListItem.set_item("MentorLkupCountry", countryOptionsLookup);
    }
    this.oListItem.update();

    clientContext.load(this.oListItem);
    clientContext.executeQueryAsync(
        Function.createDelegate(this, SaveEmployeeSuccess),
        Function.createDelegate(this, SaveEmployeeFailure)
    );

    function SaveEmployeeSuccess(e, args) {
        console.log("Saving profile succeeded for: " + mTitle);
        setFormDisplay("divFormGroup", false);
        setFormDisplay("divFormCreated", true);
    }

    function SaveEmployeeFailure(e, args) {
        console.log("Saving profile failed: " + args.get_message());
    }
}