"use strict";

var jQuery = $.noConflict();

var spHostUrlKey = "SPHostUrl";
var spHostUrl = "";
var appWebUrl = "";
var spLanguage = "";
var spRemoteAppUrl = "";

var spcontext = {};

spcontext.settings = function () {
    spHostUrlKey: "hello";
}

spcontext.executor = function () {

    var parameters = "";

    var getQueryString = function () {
        if (parameters === "" || parameters === undefined) {
            parameters = document.URL.split('?')[1];
        }
        return parameters;
    }

    // Appends SPHostUrl as query string to all the links which point to current domain.
    var appendSPHostUrlToLinks = function (spHostUrl, currentAuthority) {
        jQuery("a").filter(function () {
            var authority = getAuthorityFromUrl(this.href);
            if (!authority && /^#|:/.test(this.href)) {
                // Filters out anchors and urls with other unsupported protocols.
                return false;
            }
            return authority.toUpperCase() == currentAuthority;
        }).each(function () {
            if (!getSPHostUrlFromQueryString(this.search)) {
                if (this.search.length > 0) {
                    this.search += "&" + spHostUrlKey + "=" + spHostUrl;
                }
                else {
                    this.search = "?" + spHostUrlKey + "=" + spHostUrl;
                }
            }
        });
    }

    // Gets SPHostUrl from the given query string.
    var getSPHostUrlFromQueryString = function (queryString) {
        if (queryString) {
            if (queryString[0] === "?") {
                queryString = queryString.substring(1);
            }

            var keyValuePairArray = queryString.split("&");

            for (var i = 0; i < keyValuePairArray.length; i++) {
                var currentKeyValuePair = keyValuePairArray[i].split("=");

                if (currentKeyValuePair.length > 1 && currentKeyValuePair[0] == spHostUrlKey) {
                    return currentKeyValuePair[1];
                }
            }
        }

        return null;
    }

    // Get parameters from the query string.
    // For production purposes you may want to use a library to handle the query string.
    var getQueryStringParameter = function (paramToRetrieve) {
        var params = getQueryString().split("&");
        for (var i = 0; i < params.length; i = i + 1) {
            var singleParam = params[i].split("=");
            if (singleParam[0] == paramToRetrieve) return singleParam[1];
        }
    }

    var getAndDecodeQueryString = function (paramToRetrieve) {
        return decodeURIComponent(getQueryStringParameter(paramToRetrieve));
    }

    // Gets authority from the given url when it is an absolute url with http/https protocol or a protocol relative url.
    var getAuthorityFromUrl = function (url) {
        if (url) {
            var match = /^(?:https:\/\/|http:\/\/|\/\/)([^\/\?#]+)(?:\/|#|$|\?)/i.exec(url);
            if (match) {
                return match[1];
            }
        }
        return null;
    }

    // If SPHasRedirectedToSharePoint exists in the query string, remove it.
    // Hence, when user bookmarks the url, SPHasRedirectedToSharePoint will not be included.
    // Note that modifying window.location.search will cause an additional request to server.
    var ensureSPHasRedirectedToSharePointRemoved = function () {
        var SPHasRedirectedToSharePointParam = "&SPHasRedirectedToSharePoint=1";

        var queryString = window.location.search;

        if (queryString.indexOf(SPHasRedirectedToSharePointParam) >= 0) {
            window.location.search = queryString.replace(SPHasRedirectedToSharePointParam, "");
        }
    }


    var ensureSPVariables = function () {

        var currentAuthority = getAuthorityFromUrl(window.location.href).toUpperCase();

        spHostUrl = getSPHostUrlFromQueryString(window.location.search);
        if (spHostUrl && currentAuthority) {
            appendSPHostUrlToLinks(spHostUrl, currentAuthority);
        }

        //Get the URI decoded SharePoint site url from the SPHostUrl parameter.
        spHostUrl = getAndDecodeQueryString('SPHostUrl');
        appWebUrl = getAndDecodeQueryString('SPAppWebUrl');
        spLanguage = getAndDecodeQueryString('SPLanguage');
        spRemoteAppUrl = "https://localhost:44301/";
    }

    // Load the Chrome Header
    var ChromeLoaded = function () {
        jQuery('body').show();
        jQuery('body').css("overflow-y", "scroll");
    };

    var getLayoutRoot = function () {
        var layoutRoot = spHostUrl + '/_layouts/15/';
        return layoutRoot;
    }

    return {
        appendSPHostUrlToLinks: appendSPHostUrlToLinks,
        getSPHostUrlFromQueryString: getSPHostUrlFromQueryString,
        getAuthorityFromUrl: getAuthorityFromUrl,
        ensureSPHasRedirectedToSharePointRemoved: ensureSPHasRedirectedToSharePointRemoved,
        getQueryStringParameter: getQueryStringParameter,
        getAndDecodeQueryString: getAndDecodeQueryString,
        ensureSPVariables: ensureSPVariables,
        getLayoutRoot: getLayoutRoot,
        getQueryString: getQueryString,

        RenderSPChrome: function () {
            //Set the chrome options for launching Help, Account, and Contact pages
            var params = '?' + getQueryString();
            var options = {
                //'appIconUrl': spHostLogoUrl,
                'appHelpPageUrl': spRemoteAppUrl + "Help/" + params,
                'appTitle': document.title,
                'appWebUrl': appWebUrl,
                'onCssLoaded': ChromeLoaded(),
                //'siteUrl': spHostUrl,
                //'siteTitle': 'Back to ' + spHostTitle,
                'settingsLinks': [
                    {
                        'linkUrl': spRemoteAppUrl + "Home/About/" + params,
                        'displayName': 'About'
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
    };
}();


jQuery(document).ready(function () {

    spcontext.executor.ensureSPHasRedirectedToSharePointRemoved();

    spcontext.executor.ensureSPVariables();

    var layoutsRoot = spcontext.executor.getLayoutRoot();


    //Load the SP.UI.Controls.js file to render the App Chrome
    jQuery.getScript(layoutsRoot + 'SP.UI.Controls.js', spcontext.executor.RenderSPChrome)
        .fail(function (jqXHR, textStatus, errorThrown) {
            alert(textStatus);
        });

});
