var hasUserExistRun = false;

// Run your custom code when the DOM is ready.
$(document).ready(function () {

    $('#aspnetForm').addClass('form-horizontal');
    setFormDisplay("divFormLoader", true);
    setFormDisplay("divFormExists", false);
    setFormDisplay("divFormGroup", false);

    // Specify the unique ID of the DOM element where the
    // picker will render.
    initializePeoplePicker('peoplePickerDiv');

    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
        getOptionsFromLists();
        getUserName();
        checkUserName();
    });

});

function setFormDisplay(formFieldName, isVisible) {
    if (isVisible) {
        $("#" + formFieldName).show();
    }
    else {
        $("#" + formFieldName).hide();
    }
}

// Render and initialize the client-side People Picker.
function initializePeoplePicker(peoplePickerElementId) {

    // Create a schema to store picker properties, and set the properties.
    var schema = {};
    schema['PrincipalAccountType'] = 'User,DL,SecGroup,SPGroup';
    schema['SearchPrincipalSource'] = 15;
    schema['ResolvePrincipalSource'] = 15;
    schema['AllowMultipleValues'] = true;
    schema['MaximumEntitySuggestions'] = 50;
    schema['Width'] = '280px';

    // Render and initialize the picker. 
    // Pass the ID of the DOM element that contains the picker, an array of initial
    // PickerEntity objects to set the picker value, and a schema that defines
    // picker properties.
    this.SPClientPeoplePicker_InitStandaloneControlWrapper(peoplePickerElementId, null, schema);
}

function getOptionsFromLists() {

    var clientContext = SP.ClientContext.get_current();
    var oWebsite = clientContext.get_web();

    // Get Countries from Local Lookup List
    var camlQueryXml = '<View><Query><OrderBy><FieldRef Name="SortOrder" Ascending="TRUE" /></OrderBy></Query><RowLimit>50</RowLimit></View>';
    getLkup("Country", "#chooseCountry", camlQueryXml);

    // Get Communities from Local Lookup List
    camlQueryXml = '<View><Query><OrderBy><FieldRef Name="Title" /></OrderBy></Query><RowLimit>50</RowLimit></View>';
    getLkup("Community", "#chooseCommunity", camlQueryXml);

    // Get Careers from Local Lookup List
    //camlQueryXml = '<View><Query><OrderBy><FieldRef Name="Title" /></OrderBy></Query><RowLimit>50</RowLimit></View>';
    camlQueryXml = '<View><Query>'
        + '<Where><Eq><FieldRef Name="IsDeprecated" /><Value Type="Boolean">0</Value></Eq></Where>'
        + '<OrderBy><FieldRef Name="Title" /></OrderBy>'
        + '</Query><RowLimit>50</RowLimit></View>'
    getLkup("Career", "#chooseCareer", camlQueryXml);


    function getLkup(listName, formFieldName, camlQueryXml) {

        var oList = oWebsite.get_lists().getByTitle(listName);
        var formFieldInput = $(formFieldName);
        formFieldInput.empty();
        var camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml(camlQueryXml);
        var collListItem = oList.getItems(camlQuery);

        clientContext.load(collListItem);
        clientContext.executeQueryAsync(
            Function.createDelegate(this, successHandler),
            Function.createDelegate(this, errorHandler)
        );

        function successHandler(e, args) {
            var listItemInfo = "";
            var listItemEnumerator = collListItem.getEnumerator();

            while (listItemEnumerator.moveNext()) {
                var oListItem;
                oListItem = listItemEnumerator.get_current();
                $("<option />", { val: oListItem.get_id(), text: oListItem.get_item("Title") }).appendTo(formFieldInput);
            }
        }

        function errorHandler(e, args) {
            console.log("Request failed: " + args.get_message());
        }
    }
}

// Query the picker for user information.
function getUserInfo() {

    // Get the people picker object from the page.
    var peoplePicker = this.SPClientPeoplePicker.SPClientPeoplePickerDict.peoplePickerDiv_TopSpan;

    // Get information about all users.
    var users = peoplePicker.GetAllUserInfo();
    var userInfo = '';
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        for (var userProperty in user) {
            userInfo += userProperty + ':  ' + user[userProperty] + '<br>';
        }
    }
    $('#resolvedUsers').html(userInfo);

    // Get user keys.
    var keys = peoplePicker.GetAllUserKeys();
    $('#userKeys').html(keys);

    // Get the first user's ID by using the login name.
    if (users.length > 0) {
        getUserId(users[0].Key);
    }
}

// Get the user ID.
function getUserId(loginName) {
    var context = new SP.ClientContext.get_current();
    this.user = context.get_web().ensureUser(loginName);
    context.load(this.user);
    context.executeQueryAsync(
         Function.createDelegate(null, ensureUserSuccess),
         Function.createDelegate(null, onFail)
    );
}

function ensureUserSuccess() {
    $('#userId').val(this.user.get_id());
}

function onFail(sender, args) {
    console.log('Query failed. Error: ' + args.get_message());
}

function checkUserName() {

    var context = SP.ClientContext.get_current();
    var user = context.get_web().get_currentUser();

    // This function is executed if the above call is successful
    // It replaces the contents of the 'message' element with the user name
    function onGetUserNameSuccess() {
        var myUserId = user.get_id();
        checkUserNameInList(myUserId);
    }

    // This function is executed if the above call fails
    function onGetUserNameFail(sender, args) {
        console.log('Failed to get user name. Error:' + args.get_message());
    }

    context.load(user);
    context.executeQueryAsync(onGetUserNameSuccess, onGetUserNameFail);
}

function checkUserNameInList(myUserId) {

    var clientContext = SP.ClientContext.get_current();
    var contextWeb = clientContext.get_web();
    var oList = contextWeb.get_lists().getByTitle("Mentors");
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

        while (listItemEnumerator.moveNext()) {
            var oListItem = listItemEnumerator.get_current();
            var oListName = oListItem.get_item("Title");
            
            setFormDisplay("divFormLoader", false);
            setFormDisplay("divFormExists", true);
            setFormDisplay("divFormGroup", false);
        }
    }

    function errorQueryMentor(e, args) {
        console.log("Request failed: " + args.get_message());
    }
}

// This function prepares, loads, and then executes a SharePoint query to get the current users information
function getUserName() {

    var context = SP.ClientContext.get_current();
    var user = context.get_web().get_currentUser();

    // This function is executed if the above call is successful
    // It replaces the contents of the 'message' element with the user name
    function onGetUserNameSuccess() {
        var myTitle = user.get_title();
        var myLogin = user.get_loginName();

        var _PeoplePickerObject = SPClientPeoplePicker.SPClientPeoplePickerDict;
        var _topSpanId = _PeoplePickerObject.peoplePickerDiv_TopSpan;
        var _editorId = _PeoplePickerObject.peoplePickerDiv_TopSpan.EditorElementId;
        $("input[Id='" + _editorId + "']").attr('value', myTitle);
        //_PeoplePickerObject.AddUserKeys(myTitle);
        _topSpanId.AddUnresolvedUserFromEditor(true);
        setFormDisplay("divFormLoader", false);
        setFormDisplay("divFormGroup", true);
    }

    // This function is executed if the above call fails
    function onGetUserNameFail(sender, args) {
        console.log('Failed to get user name. Error:' + args.get_message());
    }

    context.load(user);
    context.executeQueryAsync(onGetUserNameSuccess, onGetUserNameFail);
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
    var mPerson = $("#peoplePickerDiv_TopSpan_HiddenInput").val();

    var communityOptions = "";
    $.each(mChooseCommunityOptions, function (index, option) {
        optionTitle = $.grep(mChooseCommunity, function (valueId, valueIndex) {
            return (valueId == option.value);
        });

        if (optionTitle.length > 0) {
            communityOptions += option.value + ';#' + option.text + ";#";
        }
    });
    var careerOptions = $.grep(mChooseCareerOptions, function (value, i) {
        return (value.value == mChooseCareer);
    });
    var countryOptions = $.grep(mChooseCountryOptions, function (value, i) {
        return (value.value == mChooseCountry);
    });

    var loginName = new SP.FieldUserValue();
    if (mPerson !== undefined) {
        var objectStringArray = (new Function("return " + mPerson + ";")());
        var loginNameValue = objectStringArray[0].Key;

        loginName.set_lookupId(mPersonId);   //specify User Id 
        /*
            "Key": "i:0#.f|membership|sleonard@shawniq.onmicrosoft.com",
            "Description": "sleonard@shawniq.onmicrosoft.com",
            "DisplayText": "Shawn Leonard",
            "EntityType": "User",
            "ProviderDisplayName": "Tenant",
            "ProviderName": "Tenant",
            "IsResolved": true,
            "EntityData": { "Title": "", "MobilePhone": "+1 7039941805", "Department": "", "Email": "sleonard@shawniq.onmicrosoft.com" }, "MultipleMatches": [], "Resolved": true
        */
    }

    //Make the list item and save

    var clientContext = SP.ClientContext.get_current();
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
