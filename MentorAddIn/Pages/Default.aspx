<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>

<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <script type="text/javascript" src="../Scripts/jquery-1.12.0.min.js"></script>
    <SharePoint:ScriptLink Name="sp.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />
    <meta name="WebPartPageExpansion" content="full" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />

    <!-- Add your CSS styles to the following file -->
    <link rel="Stylesheet" type="text/css" href="../Content/bootstrap.css" />
    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />

    <!-- Add your JavaScript to the following file -->
    <script type="text/javascript" src="../Scripts/bootstrap.js"></script>
    <script type="text/javascript" src="../Scripts/App.js"></script>
</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Mentor Application v2.0 SharePoint Hosted App
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <div style="padding-top: 20px">&nbsp;</div>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-2">
                <p id="message">
                    <!-- The following content will be replaced with the user name when you run the app - see App.js -->
                    initializing...
                </p>
                <p>
                    <asp:HyperLink runat="server" NavigateUrl="JavaScript:window.location = _spPageContextInfo.webAbsoluteUrl + '/Lists/yMentors/AllItems.aspx';" Text="New Mentors" />
                </p>
            </div>
            <div class="col-md-10">
                <div class="row">
                    <div class="col-md-12">
                        Mentorship is a personal developmental relationship in which a more experienced or more knowledgeable person helps to guide a less experienced or less knowledgeable person. However, true mentoring is more than just answering occasional questions or providing ad hoc help. It is about an ongoing relationship of learning, dialog, and challenge. 
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">Get Started:</div>
                </div>
                <div class="row">
                    <div class="col-md-8">
                        <div class="row">
                            <div class="col-md-6">
                                <asp:HyperLink runat="server" NavigateUrl="JavaScript:window.location = _spPageContextInfo.webAbsoluteUrl + '/Pages/BecomeAMentor.aspx';" Text="Become a Mentor">
                                    <img src="../Images/becomementor.jpg" />
                                </asp:HyperLink>
                            </div>
                            <div class="col-md-6">
                                <img src="../Images/SearchMentee.jpg" />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <img src="../Images/becomeamentee.jpg" />
                            </div>
                            <div class="col-md-6">
                                <img src="../Images/SearchMentor.jpg" />
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <img src="../Images/Createrelationship.jpg" />
                    </div>
                </div>
            </div>
        </div>

    </div>

</asp:Content>
