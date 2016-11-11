
//spcontext.js must be loaded before this can run correctly
jQuery(document).ready(function () {

    spcontext.executor.ensureSPHasRedirectedToSharePointRemoved();
    spcontext.executor.ensureSPVariables();

    var layoutsRoot = spcontext.executor.getLayoutRoot();
    var thissettings = spcontext.settings;

    function RenderSPChrome() {
        //Set the chrome options for launching Help, Account, and Contact pages
        var params = '?' + spcontext.executor.getQueryString();
        var options = {
            //'appIconUrl': spHostLogoUrl,
            'appHelpPageUrl': spcontext.executor.spRemoteAppUrl + "Help/" + params,
            'appTitle': document.title,
            'appWebUrl':spcontext.executor.appWebUrl,
            'onCssLoaded': spcontext.executor.ChromeLoaded(),
            //'siteUrl': spHostUrl,
            //'siteTitle': 'Back to ' + spHostTitle,
            'settingsLinks': [
                {
                    'linkUrl': spRemoteAppUrl + "Mentor/" + params,
                    'displayName': 'Become a Mentor'
                },
                {
                    'linkUrl': spRemoteAppUrl + 'Mentor/Search/' + params,
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
    jQuery.getScript(layoutsRoot + 'SP.UI.Controls.js', RenderSPChrome)
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.log('Failed to load UI.Controls ' + textStatus);
        });

});

