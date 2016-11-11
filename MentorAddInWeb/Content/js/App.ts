/// <reference path="sp-context.ts" />

namespace mentor {
    let executor = new spexecutor();

    //spcontext.js must be loaded before this can run correctly
    jQuery(document).ready(function () {

        let parentdom = this;

        executor.ensureSPHasRedirectedToSharePointRemoved();
        executor.ensureSPVariables();

        var layoutsRoot = executor.getLayoutRoot();


        function RenderSPChrome(exectorfunc: spexecutor) {
            let parent = this;
            let appWebUrl = exectorfunc.appWebUrl;
            let remoteWebUrl = exectorfunc.spRemoteAppUrl;
            let params = '?' + exectorfunc.getQueryString();
      

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
            })
        }

        //Load the SP.UI.Controls.js file to render the App Chrome
        jQuery.getScript(layoutsRoot + 'SP.UI.Controls.js', function () {

            RenderSPChrome(executor);
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.log('Failed to load UI.Controls ' + textStatus);
        });

    });

}