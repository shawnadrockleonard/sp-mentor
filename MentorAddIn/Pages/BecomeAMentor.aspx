<%@ Page Language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <meta name="WebPartPageExpansion" content="full" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    <script type="text/javascript" src="../content/js/vendor/jquery/jquery.min.js"></script>
    <script type="text/javascript" src="../content/js/vendor/bootstrap/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="../content/js/vendor/knockout/knockout.js"></script>
    <script type="text/javascript" src="../content/js/vendor/knockout/knockout.validation.min.js"></script>

    <!-- Add your CSS styles to the following file -->
    <link rel="Stylesheet" type="text/css" href="../Content/js/vendor/bootstrap/css/bootstrap.min.css" />
    <link rel="stylesheet" type="text/css" href="../content/js/vendor/font-awesome/css/font-awesome.min.css"/>
    <link rel="Stylesheet" type="text/css" href="../Content/css/App.css" />

    <!-- Add your JavaScript to the following file -->
    <script type="text/javascript" src="../content/js/mentor/App-BecomeAMentor.js"></script>
</asp:Content>


<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Become a Mentor
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <SharePoint:ScriptLink Name="clienttemplates.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink Name="clientforms.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink Name="clientpeoplepicker.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink Name="autofill.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink Name="sp.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink Name="sp.runtime.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink Name="sp.core.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <div style="padding-top: 20px">&nbsp;</div>

    <div class="container-fluid">
        <div class="row">
            <div class="col-sm-2">&nbsp;</div>
            <div class="col-sm-8">
                <div class="row" id="divFormLoader" style="display: inline">
                    <div class="col-md-12">
                        <div class="message">
                            Retrieving your profile and dynamic content...
                        </div>
                        <i class="fa fa-spinner fa-2x fa-spin active"></i>
                    </div>
                </div>
                <div class="row" id="divFormExists" style="display: none">
                    <div class="col-md-12">
                        <div class="message">
                            It appears as though you have an existing profile.  Go <asp:HyperLink runat="server" NavigateUrl="JavaScript:window.location = _spPageContextInfo.webAbsoluteUrl + '/Lists/yMentors/AllItems.aspx';" Text="here" /> or lets search for your profile.
                        </div>
                    </div>
                </div>
                <div class="row" id="divFormCreated" style="display: none">
                    <div class="col-md-12">
                        <div class="message">
                            You have successfully created your profile.  Go <asp:HyperLink runat="server" NavigateUrl="JavaScript:window.location = _spPageContextInfo.webAbsoluteUrl + '/Lists/yMentors/AllItems.aspx';" Text="here" />.
                        </div>
                    </div>
                </div>
                <div class="row" id="divFormGroup" style="display: none">
                    <div class="form-group">
                        <label for="inputTitle" class="col-sm-2 control-label">Title <span id="inputTitleValidation" class="ms-accentText" title="This is a required field.">*</span></label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="inputTitle" placeholder="Mentor Title" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="chooseCareer" class="col-sm-2 control-label">Career</label>
                        <div class="col-sm-10">
                            <select id="chooseCareer" class="form-control input-lg">
                                <option>hello</option>
                            </select>
                            <span>Choose a Career or profession you would like to mentor</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="inputBio" class="col-sm-2 control-label">Your Bio</label>
                        <div class="col-sm-10">
                            <span id="inputBioValidation" class="ms-accentText" title="This is a required field.">*</span>
                            <textarea class="form-control" id="inputBio" rows="4"></textarea>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="optionCareer" class="col-sm-2 control-label">Career Mentor</label>
                        <div class="checkbox">
                            <label>
                                <input type="checkbox" name="optionCareer" id="optionCareer" value="True">
                                Choose if you would like to be a Career Mentor
                            </label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="optionTechnical" class="col-sm-2 control-label">Technical Mentor</label>
                        <div class="checkbox">
                            <label>
                                <input type="checkbox" name="optionTechnical" id="optionTechnical" value="True">
                                Choose if you would like to be a Technical Mentor
                            </label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="optionPresentation" class="col-sm-2 control-label">Presentation Mentor</label>
                        <div class="checkbox">
                            <label>
                                <input type="checkbox" name="optionPresentation" id="optionPresentation" value="True">
                                Check this box if you wish to mentor Presentation Skills
                            </label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="chooseCommunity" class="col-sm-2 control-label">Community Interest</label>
                        <div class="col-sm-10">
                            <select id="chooseCommunity" multiple class="form-control input-lg">
                                <option>hello</option>
                                <option>world</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="inputSkillsTechnical" class="col-sm-2 control-label">Technical Skills</label>
                        <div class="col-sm-10">
                            <textarea class="form-control" id="inputSkillsTechnical" rows="4"></textarea>
                            <span>List any technical skills (ex. SharePoint, CRM, PHP, MySQL, MongoDB)</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="inputSkillsProfessional" class="col-sm-2 control-label">Professional Skills</label>
                        <div class="col-sm-10">
                            <textarea class="form-control" id="inputSkillsProfessional" rows="4"></textarea>
                            <span>List additional professional skills</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="inputComments" class="col-sm-2 control-label">Comments</label>
                        <div class="col-sm-10">
                            <textarea class="form-control" id="inputComments" rows="4"></textarea>
                            <span>Enter information contact preference etc.</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="chooseCountry" class="col-sm-2 control-label">Country</label>
                        <div class="col-sm-10">
                            <select id="chooseCountry" class="form-control input-lg">
                                <option>USA</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="peoplePickerDiv" class="col-sm-2 control-label">Mentor</label>
                        <div id="peoplePickerDiv" class="col-sm-10"></div>
                        <div class="col-sm-2">&nbsp;</div>
                        <div class="col-sm-10">
                            <br />
                            <input type="button" value="Get User Info" onclick="getUserInfo()" />
                            <br />
                            <h1>User info:</h1>
                            <p id="resolvedUsers"></p>
                            <h1>User keys:</h1>
                            <p id="userKeys"></p>
                            <input type="hidden" id="userId" />
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-12">
                            <input type="button" value="Create Mentor Profile" onclick="submitUserInfo()" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-2">&nbsp;</div>
        </div>
    </div>
</asp:Content>
