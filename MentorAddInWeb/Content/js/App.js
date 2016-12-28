/// <reference path="sp-context.ts" />
var mentor;
(function (mentor) {
    var executor = new mentor.spexecutor();
    //spcontext.js must be loaded before this can run correctly
    jQuery(document).ready(function () {
        var parentdom = this;
        executor.ensureSPHasRedirectedToSharePointRemoved();
        executor.ensureSPVariables();
        var layoutsRoot = executor.getLayoutRoot();
        function RenderSPChrome(exectorfunc) {
            var parent = this;
            var appWebUrl = exectorfunc.appWebUrl;
            var remoteWebUrl = exectorfunc.spRemoteAppUrl;
            var params = '?' + exectorfunc.getQueryString();
            //Set the chrome options for launching Help, Account, and Contact pages
            var options = {
                //'appIconUrl': spHostLogoUrl,
                'appHelpPageUrl': remoteWebUrl + "Help/" + params,
                'appTitle': document.title,
                'appWebUrl': appWebUrl,
                'onCssLoaded': "jQuery('body').show(); jQuery('body').css('overflow-y', 'scroll');",
                //'siteUrl': spHostUrl,
                //'siteTitle': 'Back to ' + spHostTitle,
                'settingsLinks': [
                    {
                        'linkUrl': remoteWebUrl + "Mentor/" + params,
                        'displayName': 'Become a Mentor'
                    },
                    {
                        'linkUrl': remoteWebUrl + 'Mentor/Search/' + params,
                        'displayName': 'Search Mentors'
                    }
                ]
            };
            //Load the Chrome Control in the divSPChrome element of the page
            var chromeNavigation = new SP.UI.Controls.Navigation('divSPChrome', options);
            chromeNavigation.setVisible(true);
            chromeNavigation.setBottomHeaderVisible(false);
            jQuery('#chromeControl_stylesheet').on('load', function (event) {
                jQuery('body').show();
            });
        }
        RenderSPChrome(executor);
    });
})(mentor || (mentor = {}));
//# sourceMappingURL=App.js.map