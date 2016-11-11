
namespace mentor {

    export class spexecutor {

        parameters: string;
        spHostUrlKey: string;
        spHostUrl: string;
        appWebUrl: string;
        spLanguage: string;
        spRemoteAppUrl: string;

        constructor() {
            this.parameters = "";
            this.spHostUrlKey = "SPHostUrl";
            this.spHostUrl = "";
            this.parameters = "";
            this.appWebUrl = "";
            this.spLanguage = "";
            this.spRemoteAppUrl = "";
        }

        /**
        * Get querystring and split into array
        */
        getQueryString() : string {
            if (this.parameters === "" || this.parameters === undefined) {
                let urlarray = document.URL.split('?');
                this.parameters = urlarray[1];
            }
            return this.parameters;
        }

        /**
        * Get parameters from the query string.
        * For production purposes you may want to use a library to handle the query string.
        */
        getQueryStringParameter = function (paramToRetrieve) {
            var params = this.getQueryString().split("&");
            for (var i = 0; i < params.length; i = i + 1) {
                var singleParam = params[i].split("=");
                if (singleParam[0] == paramToRetrieve)
                    return singleParam[1];
            }
        }

        /**
        * Appends SPHostUrl as query string to all the links which point to current domain.
        */
        appendSPHostUrlToLinks = function (spHostUrl, currentAuthority) {
            let parent = this;

            jQuery("a").filter(function () {
                var authority = parent.getAuthorityFromUrl(this.href);
                if (!authority && /^#|:/.test(this.href)) {
                    // Filters out anchors and urls with other unsupported protocols.
                    return false;
                }
                return authority.toUpperCase() == currentAuthority;
            }).each(function () {
                if (!parent.getSPHostUrlFromQueryString(this.search)) {
                    if (parent.search.length > 0) {
                        parent.search += "&" + parent.spHostUrlKey + "=" + spHostUrl;
                    }
                    else {
                        parent.search = "?" + parent.spHostUrlKey + "=" + spHostUrl;
                    }
                }
            });
        }

        /**
            * Gets SPHostUrl from the given query string.
            */
        getSPHostUrlFromQueryString = function (queryString) {
            if (queryString) {
                if (queryString[0] === "?") {
                    queryString = queryString.substring(1);
                }

                var keyValuePairArray = queryString.split("&");

                for (var i = 0; i < keyValuePairArray.length; i++) {
                    var currentKeyValuePair = keyValuePairArray[i].split("=");

                    if (currentKeyValuePair.length > 1 && currentKeyValuePair[0] == this.spHostUrlKey) {
                        return decodeURIComponent(currentKeyValuePair[1]);
                    }
                }
            }

            return null;
        }

        getAndDecodeQueryString = function (paramToRetrieve) {
            return decodeURIComponent(this.getQueryStringParameter(paramToRetrieve));
        }

        /**
        * Gets authority from the given url when it is an absolute url with http/https protocol or a protocol relative url.
        */
        getAuthorityFromUrl = function (url) {
            if (url) {
                var match = /^(?:https:\/\/|http:\/\/|\/\/)([^\/\?#]+)(?:\/|#|$|\?)/i.exec(url);
                if (match) {
                    return match[1];
                }
            }
            return null;
        }

        /**
        * If SPHasRedirectedToSharePoint exists in the query string, remove it.
        * Hence, when user bookmarks the url, SPHasRedirectedToSharePoint will not be included.
        * Note that modifying window.location.search will cause an additional request to server.
        */
        ensureSPHasRedirectedToSharePointRemoved = function () {
            var SPHasRedirectedToSharePointParam = "&SPHasRedirectedToSharePoint=1";

            var queryString = window.location.search;

            if (queryString.indexOf(SPHasRedirectedToSharePointParam) >= 0) {
                window.location.search = queryString.replace(SPHasRedirectedToSharePointParam, "");
            }
        }


        ensureSPVariables = function () {

            var currentAuthority = this.getAuthorityFromUrl(window.location.href).toUpperCase();

            this.spHostUrl = this.getSPHostUrlFromQueryString(window.location.search);
            if (this.spHostUrl && currentAuthority) {
                this.appendSPHostUrlToLinks(this.spHostUrl, currentAuthority);
            }

            //Get the URI decoded SharePoint site url from the SPHostUrl parameter.
            this.spHostUrl = this.getAndDecodeQueryString('SPHostUrl');
            this.appWebUrl = this.getAndDecodeQueryString('SPAppWebUrl');
            this.spLanguage = this.getAndDecodeQueryString('SPLanguage');
            this.spRemoteAppUrl = "https://localhost:44301/";
        }

        getLayoutRoot = function () {
            var layoutRoot = this.spHostUrl + '/_layouts/15/';
            return layoutRoot;
        }
    }

    class spcontext {


        executor: spexecutor;

        constructor() {
            this.executor = new spexecutor();
        }

        voidTest() {
            let query = this.executor.getQueryString();
            console.log(query);
        }

    }
}