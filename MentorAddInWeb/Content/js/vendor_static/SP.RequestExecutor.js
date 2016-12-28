{
    if ("undefined" == typeof g_all_modules) {
        g_all_modules = {};
    }
    g_all_modules["sp.requestexecutor.js"] = {
        "version": {
            "rmj": 16,
            "rmm": 0,
            "rup": 5806,
            "rpr": 1206
        }
    };
}
if (typeof spWriteProfilerMark == 'function')
    spWriteProfilerMark("perfMarkBegin_" + "sp.requestexecutor.js");
if (window.Type && window.Type.registerNamespace) {
    Type.registerNamespace('SP');
}
else {
    if (typeof window['SP'] == 'undefined') {
        window['SP'] = new Object();
        window['SP'].__namespace = true;
    }
}
SP.PostMessageRequestInfo = function SP_PostMessageRequestInfo() {
};
SP.PostMessageResponseInfo = function SP_PostMessageResponseInfo() {
};
SP.RequestInfo = function SP_RequestInfo() {
};
SP.AppWebProxyRequestInfo = function SP_AppWebProxyRequestInfo() {
};
SP.ResponseInfo = function SP_ResponseInfo() {
};
SP.RequestExecutorOptions = function SP_RequestExecutorOptions() {
};
SP.RequestExecutorMessageProcessorFormDigestInfo = function SP_RequestExecutorMessageProcessorFormDigestInfo() {
};
SP.RequestExecutorMessageProcessorInitInfo = function SP_RequestExecutorMessageProcessorInitInfo() {
};
SP.PostMessageCommands = function SP_PostMessageCommands() {
};
SP.ProxyWebRequestExecutorInternal = function SP_ProxyWebRequestExecutorInternal() {
};
SP.ProxyWebRequestExecutorInternal.processSuccessCallback = function SP_ProxyWebRequestExecutorInternal$processSuccessCallback(executor, responseInfo) {
    executor.$1W_1(responseInfo);
};
SP.ProxyWebRequestExecutorInternal.processErrorCallback = function SP_ProxyWebRequestExecutorInternal$processErrorCallback(executor, responseInfo, errorCode, errorMessage) {
    executor.$1V_1(responseInfo, errorCode, errorMessage);
};
SP.ProxyWebRequestExecutor = function SP_ProxyWebRequestExecutor($p0, $p1) {
    SP.ProxyWebRequestExecutor.initializeBase(this);
    this.$A_1 = $p0;
    this.$7_1 = $p1;
};
SP.ProxyWebRequestExecutor.prototype = {
    $A_1: null,
    $7_1: null,
    $19_1: false,
    $1C_1: false,
    $1B_1: false,
    $8_1: null,
    get_aborted: function SP_ProxyWebRequestExecutor$get_aborted() {
        return this.$19_1;
    },
    get_responseAvailable: function SP_ProxyWebRequestExecutor$get_responseAvailable() {
        return !!this.$8_1 && this.$8_1.responseAvailable;
    },
    get_responseData: function SP_ProxyWebRequestExecutor$get_responseData() {
        if (!this.$8_1) {
            return null;
        }
        return this.$8_1.body;
    },
    get_started: function SP_ProxyWebRequestExecutor$get_started() {
        return this.$1B_1;
    },
    get_statusCode: function SP_ProxyWebRequestExecutor$get_statusCode() {
        if (!this.$8_1) {
            return 0;
        }
        return this.$8_1.statusCode;
    },
    get_statusText: function SP_ProxyWebRequestExecutor$get_statusText() {
        if (!this.$8_1) {
            return null;
        }
        return this.$8_1.statusText;
    },
    get_timedOut: function SP_ProxyWebRequestExecutor$get_timedOut() {
        return this.$1C_1;
    },
    get_xml: function SP_ProxyWebRequestExecutor$get_xml() {
        return null;
    },
    abort: function SP_ProxyWebRequestExecutor$abort() {
        this.$19_1 = true;
    },
    executeRequest: function SP_ProxyWebRequestExecutor$executeRequest() {
        var $v_0 = this.get_webRequest();
        var $v_1 = new SP.RequestExecutor(this.$A_1, this.$7_1);
        var $v_2 = new SP.RequestInfo();

        $v_2.body = $v_0.get_body();
        $v_2.headers = {};
        if ($v_0.get_headers()) {
            var $$dict_3 = $v_0.get_headers();

            for (var $$key_4 in $$dict_3) {
                var $v_3 = {
                    key: $$key_4,
                    value: $$dict_3[$$key_4]
                };
                var $v_4 = ($v_0.get_headers())[$v_3.key];

                if (typeof $v_4 !== 'function') {
                    $v_2.headers[$v_3.key] = ($v_0.get_headers())[$v_3.key];
                }
            }
        }
        $v_2.method = $v_0.get_httpVerb();
        $v_2.url = $v_0.get_url();
        $v_2.timeout = $v_0.get_timeout();
        $v_2.success = SP.RequestExecutorNative.getProxyWebRequestExecutorSuccessCallback(this);
        $v_2.error = SP.RequestExecutorNative.getProxyWebRequestExecutorErrorCallback(this);
        this.$1B_1 = true;
        $v_1.executeAsync($v_2);
    },
    $1W_1: function SP_ProxyWebRequestExecutor$$1W_1($p0) {
        this.$8_1 = $p0;
        (this.get_webRequest()).completed(Sys.EventArgs.Empty);
    },
    $1V_1: function SP_ProxyWebRequestExecutor$$1V_1($p0, $p1, $p2) {
        if ($p1 === SP.RequestExecutorErrors.requestAbortedOrTimedout) {
            this.$1C_1 = true;
        }
        this.$8_1 = $p0;
        this._SPError_ = $p2;
        this._SPErrorCode_ = $p1;
        (this.get_webRequest()).completed(Sys.EventArgs.Empty);
    },
    getAllResponseHeaders: function SP_ProxyWebRequestExecutor$getAllResponseHeaders() {
        if (!this.$8_1) {
            return null;
        }
        return this.$8_1.allResponseHeaders;
    },
    getResponseHeader: function SP_ProxyWebRequestExecutor$getResponseHeader($p0) {
        if (!this.$8_1 || !this.$8_1.headers) {
            return null;
        }
        if (!$p0) {
            return null;
        }
        return this.$8_1.headers[$p0.toUpperCase()];
    }
};
SP.ProxyWebRequestExecutorFactory = function SP_ProxyWebRequestExecutorFactory(url, options) {
    var $v_0;

    if (SP.RequestExecutorUtility.$0(options)) {
        options = new SP.RequestExecutorOptions();
        $v_0 = null;
    }
    else if (typeof options === 'string') {
        $v_0 = options;
        options = new SP.RequestExecutorOptions();
        options.viaUrl = $v_0;
    }
    else {
        SP.RequestExecutor.$1e(options);
        $v_0 = options.viaUrl;
    }
    SP.RequestExecutorUtility.$6(url, 'url', 'string', true);
    SP.RequestExecutorUtility.$6($v_0, 'viaUrl', 'string', false);
    SP.RequestExecutorUtility.$X(url, 'url');
    var $v_1 = url.indexOf('?');

    if ($v_1 >= 0) {
        throw SP.RequestExecutorUtility.$J('url');
    }
    this.$A_0 = url;
    this.$7_0 = options;
};
SP.ProxyWebRequestExecutorFactory.prototype = {
    $A_0: null,
    $7_0: null,
    createWebRequestExecutor: function SP_ProxyWebRequestExecutorFactory$createWebRequestExecutor() {
        return new SP.ProxyWebRequestExecutor(this.$A_0, this.$7_0);
    }
};
SP.RequestExecutor = function SP_RequestExecutor(url, options) {
    var $v_0;

    if (SP.RequestExecutorUtility.$0(options)) {
        options = new SP.RequestExecutorOptions();
        $v_0 = null;
    }
    else if (typeof options === 'string') {
        $v_0 = options;
        options = new SP.RequestExecutorOptions();
        options.viaUrl = $v_0;
    }
    else {
        SP.RequestExecutor.$1e(options);
        $v_0 = options.viaUrl;
    }
    SP.RequestExecutorUtility.$6(url, 'url', 'string', true);
    SP.RequestExecutorUtility.$6($v_0, 'viaUrl', 'string', false);
    if (SP.RequestExecutorUtility.$2($v_0)) {
        if (SP.RequestExecutorUtility.$2(url)) {
            throw SP.RequestExecutorUtility.$J('url');
        }
        var $v_1 = url.indexOf('?');

        if ($v_1 >= 0) {
            throw SP.RequestExecutorUtility.$J('url');
        }
        $v_1 = url.indexOf('#');
        if ($v_1 >= 0) {
            throw SP.RequestExecutorUtility.$J('url');
        }
        if (url.charAt(0) === '/') {
            url = SP.RequestExecutor.$b(window.location.href, url);
        }
        SP.RequestExecutorUtility.$X(url, 'url');
        if (url.charCodeAt(url.length - 1) === '/') {
            url = url.substr(0, url.length - 1);
        }
        this.$A_0 = url;
        if ((SP.RequestExecutorInternalSharedUtility.$U(url)).toLowerCase() === (SP.RequestExecutorInternalSharedUtility.$U(window.location.href)).toLowerCase()) {
            this.$O_0 = 1;
        }
        else {
            this.$O_0 = 2;
            if (url.charAt(url.length - 1) !== '/') {
                url = url + '/';
            }
            this.$1A_0 = url;
        }
    }
    else {
        SP.RequestExecutorUtility.$X(url, 'url');
        this.$O_0 = 3;
        this.$A_0 = url;
        this.$v_0 = $v_0;
    }
    this.$7_0 = options;
    this.formDigestHandlingEnabled = true;
    this.iFrameSourceUrl = '_layouts/15/AppWebProxy.aspx';
};
SP.RequestExecutor.getLoginUrl = function SP_RequestExecutor$getLoginUrl(returnUrl, appWebUrl, signInWebUrl) {
    SP.RequestExecutorUtility.$X(returnUrl, 'returnUrl');
    SP.RequestExecutorUtility.$X(appWebUrl, 'appWebUrl');
    SP.RequestExecutorUtility.$6(signInWebUrl, 'signInWebUrl', 'string', false);
    var $v_0 = SP.RequestExecutor.$b(appWebUrl, '_layouts/15/AppWebProxy.aspx');

    if (!SP.RequestExecutorUtility.$2(signInWebUrl)) {
        $v_0 = SP.RequestExecutorUtility.$G($v_0);
        $v_0 = $v_0 + 'SP.SignInWebUrl' + '=' + SP.RequestExecutorHttpUtility.$R(signInWebUrl, false, false);
    }
    $v_0 = SP.RequestExecutorUtility.$G($v_0);
    $v_0 = $v_0 + 'SP.ReturnUrl' + '=' + SP.RequestExecutorHttpUtility.$R(returnUrl, false, false);
    return $v_0;
};
SP.RequestExecutor.$b = function SP_RequestExecutor$$b($p0, $p1) {
    SP.RequestExecutorUtility.$X($p0, 'baseUrl');
    if (($p1.substr(0, 8)).toLowerCase() === 'https://' || ($p1.substr(0, 7)).toLowerCase() === 'http://') {
        return $p1;
    }
    else if ($p1.charAt(0) === '/') {
        var $v_0 = $p0.indexOf('://');

        $v_0 = $p0.indexOf('/', $v_0 + 3);
        if ($v_0 > 0) {
            $p0 = $p0.substr(0, $v_0);
        }
        return $p0 + $p1;
    }
    else {
        if ($p0.charAt($p0.length - 1) !== '/') {
            $p0 = $p0 + '/';
        }
        return $p0 + $p1;
    }
};
SP.RequestExecutor.$U = function SP_RequestExecutor$$U($p0) {
    SP.RequestExecutorUtility.$X($p0, 'url');
    return SP.RequestExecutorInternalSharedUtility.$U($p0);
};
SP.RequestExecutor.$t = function SP_RequestExecutor$$t($p0) {
    if (SP.RequestExecutor.$l[$p0]) {
        return document.getElementById('SPRequestExecutor' + $p0);
    }
    return null;
};
SP.RequestExecutor.$1h = function SP_RequestExecutor$$1h($p0, $p1, $p2) {
    var $v_0 = 'SPRequestExecutor' + $p0;
    var $v_1 = document.getElementById($v_0);

    if ($v_1 && $v_1.parentNode) {
        SP.RequestExecutor.$1('Remove the existing IFRAME for ' + $p0);
        $v_1.parentNode.removeChild($v_1);
    }
    var $v_2;

    $v_2 = document.createElement('IFRAME');
    var $v_3 = $p0;

    if (!SP.RequestExecutorUtility.$2($p1)) {
        $v_3 = SP.RequestExecutorUtility.$G($v_3);
        $v_3 = $v_3 + 'SP.SignInWebUrl' + '=' + SP.RequestExecutorHttpUtility.$R($p1, false, false);
    }
    if (!SP.RequestExecutorUtility.$2($p2)) {
        $v_3 = SP.RequestExecutorUtility.$G($v_3);
        $v_3 = $v_3 + 'SP.ClientTag' + '=' + SP.RequestExecutorHttpUtility.$R($p2, false, false);
    }
    var $v_4 = document.URL;
    var $v_5 = $v_4.indexOf('?');

    if ($v_5 > 0) {
        $v_4 = $v_4.substr(0, $v_5);
    }
    $v_5 = $v_4.indexOf('#');
    if ($v_5 > 0) {
        $v_4 = $v_4.substr(0, $v_5);
    }
    $v_3 = SP.RequestExecutorUtility.$G($v_3);
    $v_3 = $v_3 + 'SP.AppPageUrl' + '=' + SP.RequestExecutorHttpUtility.$R($v_4, false, false);
    $v_2.src = $v_3;
    $v_2.id = $v_0;
    $v_2.style.display = 'none';
    var $v_6 = SP.RequestExecutorNative.getIFrameOnloadCallback($p0);

    if ($v_2.addEventListener) {
        $v_2.addEventListener('load', $v_6, false);
    }
    else if ($v_2.attachEvent) {
        $v_2.attachEvent('onload', $v_6);
    }
    else {
        throw SP.RequestExecutorUtility.$10();
    }
    document.body.appendChild($v_2);
    SP.RequestExecutor.$l[$p0] = true;
    SP.RequestExecutor.$1('Created IFrame ' + $v_3);
    var $v_7 = window.setTimeout(function() {
        delete SP.RequestExecutor.$B[$p0];
        SP.RequestExecutor.$1('IFrameLoadTimeout, display failure');
        SP.RequestExecutor.$1Z($p0);
    }, 30000);

    SP.RequestExecutor.$1('Create IFrameLoadTimeout ' + $v_7);
    SP.RequestExecutor.$B[$p0] = $v_7;
    return $v_2;
};
SP.RequestExecutor.$1S = function SP_RequestExecutor$$1S($p0, $p1) {
    var $v_0 = SP.RequestExecutorUtility.$g($p0);

    $v_0 = SP.RequestExecutorUtility.$G($v_0);
    $v_0 = $v_0 + 'MS.SP.url' + '=' + encodeURIComponent($p1);
    return $v_0;
};
SP.RequestExecutor.$1N = function SP_RequestExecutor$$1N($p0, $p1, $p2, $p3, $p4) {
    if (!SP.RequestExecutor.$d) {
        SP.RequestExecutor.$d = {};
    }
    if (!SP.RequestExecutor.$k) {
        SP.RequestExecutor.$k = {};
    }
    var $v_0 = new Date();

    if (!$p2 || $p3.method.toUpperCase() === 'GET' || !SP.RequestExecutorUtility.$0(SP.RequestExecutor.$d[$p0]) && SP.RequestExecutor.$d[$p0] > $v_0.getTime()) {
        $p4(SP.RequestExecutor.$k[$p0], $p3);
    }
    else {
        var $v_1 = SP.RequestExecutor.$u();

        $v_1.open('POST', $p1);
        $v_1.setRequestHeader('accept', 'application/json;odata=verbose');
        var $v_2 = 0;

        if ($p3.timeout > 0) {
            $v_2 = window.setTimeout(function() {
                $v_1.onreadystatechange = SP.RequestExecutorNative.emptyCallback;
                try {
                    $v_1.abort();
                }
                catch ($$e_8) { }
                SP.RequestExecutor.$c($p3, SP.RequestExecutorErrors.requestAbortedOrTimedout, SP.RequestExecutorResources.getString('RE_RequestAbortedOrTimedout'));
            }, $p3.timeout);
        }
        $v_1.onreadystatechange = function() {
            if ($v_1.readyState === 4) {
                if ($v_2) {
                    window.clearTimeout($v_2);
                }
                $v_1.onreadystatechange = SP.RequestExecutorNative.emptyCallback;
                if ($v_1.status !== 200 || !$v_1.getResponseHeader('content-type') || (($v_1.getResponseHeader('content-type')).toLowerCase()).indexOf('application/json') < 0) {
                    var $v_3 = SP.RequestExecutorResources.getString('RE_RequestUnexpectedResponseWithContentTypeAndStatus');

                    $v_3 = SP.RequestExecutorUtility.$T($v_3, $v_1.getResponseHeader('content-type'), $v_1.status.toString());
                    SP.RequestExecutor.$c($p3, SP.RequestExecutorErrors.unexpectedResponse, $v_3);
                }
                else {
                    var $v_4 = JSON.parse($v_1.responseText);

                    if (SP.RequestExecutorUtility.$0($v_4)) {
                        SP.RequestExecutor.$c($p3, SP.RequestExecutorErrors.unexpectedResponse, SP.RequestExecutorResources.getString('RE_RequestUnexpectedResponse'));
                    }
                    else {
                        var $v_5 = $v_4.d.GetContextWebInformation.FormDigestValue;
                        var $v_6 = $v_4.d.GetContextWebInformation.FormDigestTimeoutSeconds;
                        var $v_7 = (new Date()).getTime() + $v_6 * 750;

                        SP.RequestExecutor.$k[$p0] = $v_5;
                        SP.RequestExecutor.$d[$p0] = $v_7;
                        $p4($v_5, $p3);
                    }
                }
            }
        };
        $v_1.send('');
    }
};
SP.RequestExecutor.$c = function SP_RequestExecutor$$c($p0, $p1, $p2) {
    if ($p0.error) {
        var $v_0 = new SP.ResponseInfo();

        $v_0.state = $p0.state;
        $v_0.body = '';
        $p0.error($v_0, $p1, $p2);
    }
};
SP.RequestExecutor.$q = function SP_RequestExecutor$$q() {
    var $v_0 = window.postMessage;

    if (SP.RequestExecutorUtility.$9($v_0)) {
        throw SP.RequestExecutorUtility.$10();
    }
    $v_0 = window.JSON;
    if (SP.RequestExecutorUtility.$9($v_0) || SP.RequestExecutorUtility.$9($v_0.stringify) || SP.RequestExecutorUtility.$9($v_0.parse)) {
        throw SP.RequestExecutorUtility.$10();
    }
};
SP.RequestExecutor.$1g = function SP_RequestExecutor$$1g() {
    var $v_0 = window.ArrayBuffer;

    if (SP.RequestExecutorUtility.$9($v_0)) {
        throw SP.RequestExecutorUtility.$12();
    }
    $v_0 = window.Uint8Array;
    if (SP.RequestExecutorUtility.$9($v_0)) {
        throw SP.RequestExecutorUtility.$12();
    }
    if (SP.RequestExecutorUtility.$9(window.BlobBuilder) && SP.RequestExecutorUtility.$9(window.MozBlobBuilder) && SP.RequestExecutorUtility.$9(window.Blob)) {
        throw SP.RequestExecutorUtility.$12();
    }
};
SP.RequestExecutor.$F = function SP_RequestExecutor$$F($p0) {
    SP.RequestExecutorUtility.$6($p0.postMessageId, 'requestInfo.postMessageId', 'string', true);
    SP.RequestExecutorUtility.$6($p0.appWebProxyUrl, 'requestInfo.appWebProxyUrl', 'string', true);
    var $v_0 = SP.RequestExecutor.$t($p0.appWebProxyUrl);

    if (!$v_0) {
        throw SP.RequestExecutorUtility.$11();
    }
    if (!SP.RequestExecutor.$4) {
        SP.RequestExecutor.$4 = {};
    }
    SP.RequestExecutor.$4[$p0.postMessageId] = $p0;
    var $v_1 = new SP.PostMessageRequestInfo();

    $v_1.command = $p0.command;
    $v_1.url = $p0.requestInfo.url;
    $v_1.method = $p0.requestInfo.method;
    $v_1.body = $p0.requestInfo.body;
    $v_1.headers = $p0.requestInfo.headers;
    $v_1.postMessageId = $p0.postMessageId;
    $v_1.timeout = $p0.requestInfo.timeout;
    $v_1.accessToken = $p0.requestInfo.$o_0;
    $v_1.binaryStringRequestBody = $p0.requestInfo.binaryStringRequestBody;
    $v_1.binaryStringResponseBody = $p0.requestInfo.binaryStringResponseBody;
    var $v_2 = JSON.stringify($v_1);
    var $v_3 = $p0.appWebProxyUrl;

    SP.RequestExecutor.$1('RequestExecutor.PostMessage.Message: ' + $v_2);
    SP.RequestExecutor.$1('RequestExecutor.PostMessage.Target: ' + $v_3);
    $v_0.contentWindow.postMessage($v_2, $v_3);
};
SP.RequestExecutor.internalProcessIFrameOnload = function SP_RequestExecutor$internalProcessIFrameOnload(appWebProxyUrl) {
    SP.RequestExecutor.$1('Processing IFRAME onload event');
    SP.RequestExecutor.$V[appWebProxyUrl] = true;
    if (!SP.RequestExecutorUtility.$0(SP.RequestExecutor.$B[appWebProxyUrl])) {
        SP.RequestExecutor.$1('Clear IFrameLoadTimeout ' + SP.RequestExecutor.$B[appWebProxyUrl]);
        window.clearTimeout(SP.RequestExecutor.$B[appWebProxyUrl]);
        delete SP.RequestExecutor.$B[appWebProxyUrl];
    }
    if (!SP.RequestExecutorUtility.$0(SP.RequestExecutor.$N[appWebProxyUrl])) {
        SP.RequestExecutor.$1('Clear IFramePingTimeout' + SP.RequestExecutor.$N[appWebProxyUrl]);
        window.clearTimeout(SP.RequestExecutor.$N[appWebProxyUrl]);
        delete SP.RequestExecutor.$N[appWebProxyUrl];
    }
    if (!SP.RequestExecutorUtility.$0(SP.RequestExecutor.$I[appWebProxyUrl])) {
        delete SP.RequestExecutor.$I[appWebProxyUrl];
    }
    SP.RequestExecutor.$1('Start to ping the IFRAME ' + appWebProxyUrl);
    SP.RequestExecutor.$1b(appWebProxyUrl);
};
SP.RequestExecutor.$1b = function SP_RequestExecutor$$1b($p0) {
    SP.RequestExecutor.$m++;
    var $v_0 = new SP.AppWebProxyRequestInfo();

    $v_0.command = 'Ping';
    $v_0.postMessageId = SP.RequestExecutorInternalSharedUtility.$j + SP.RequestExecutor.$m.toString();
    $v_0.appWebProxyUrl = $p0;
    var $v_1 = window.setTimeout(function() {
        SP.RequestExecutor.$1('Ping timeout');
        delete SP.RequestExecutor.$B[$p0];
        SP.RequestExecutor.$1x($v_0.postMessageId, $p0);
    }, 1000);

    SP.RequestExecutor.$1('Create IFramePingTimeout ' + $v_1);
    $v_0.timeoutId = $v_1;
    $v_0.requestInfo = new SP.RequestInfo();
    SP.RequestExecutor.$4[$v_0.postMessageId] = $v_0;
    SP.RequestExecutor.$N[$p0] = $v_1;
    SP.RequestExecutor.$F($v_0);
};
SP.RequestExecutor.$1x = function SP_RequestExecutor$$1x($p0, $p1) {
    var $v_0 = SP.RequestExecutor.$4[$p0];

    if (SP.RequestExecutorUtility.$0($v_0)) {
        return;
    }
    if (SP.RequestExecutor.$Q[$p1]) {
        return;
    }
    SP.RequestExecutor.$4[$p0] = null;
    delete SP.RequestExecutor.$4[$p0];
    if (SP.RequestExecutorUtility.$0(SP.RequestExecutor.$I[$p1])) {
        SP.RequestExecutor.$I[$p1] = 1;
    }
    else {
        SP.RequestExecutor.$I[$p1] = SP.RequestExecutor.$I[$p1] + 1;
    }
    SP.RequestExecutor.$1('Ping timeout count = ' + SP.RequestExecutor.$I[$p1]);
    if (SP.RequestExecutor.$I[$p1] > 25) {
        SP.RequestExecutor.$1('Ping timeout count for ' + $p1 + ' exceeds threshold, display failure');
        SP.RequestExecutor.$1Z($p1);
    }
    else {
        SP.RequestExecutor.$1('Send ping again for ' + $p1);
        SP.RequestExecutor.$1b($p1);
    }
};
SP.RequestExecutor.$1Z = function SP_RequestExecutor$$1Z($p0) {
    var $v_0 = SP.RequestExecutor.$P[$p0];

    if (!SP.RequestExecutorUtility.$0($v_0) && !$v_0.closed) {
        SP.RequestExecutor.$z($p0);
    }
    else {
        var $v_1 = false;
        var $v_2 = SP.RequestExecutor.$E[$p0];

        for (var $v_3 = 0; $v_3 < $v_2.length; $v_3++) {
            var $v_4 = $v_2[$v_3];

            if ($v_4.command === 'Query' && SP.RequestExecutorUtility.$17($v_4.requestInfo.url, $v_4.requestInfo.method)) {
                $v_1 = true;
            }
        }
        if (!$v_1 && (SP.RequestExecutorUtility.$0(SP.RequestExecutor.$H[$p0]) || SP.RequestExecutor.$H[$p0] < 1)) {
            SP.RequestExecutorNotificationPanel.$22($p0);
        }
        else {
            SP.RequestExecutor.$1F($p0, 'RE_CannotAccessSite');
        }
    }
};
SP.RequestExecutor.$1v = function SP_RequestExecutor$$1v($p0) {
    var $v_0 = $p0;

    $v_0 = SP.RequestExecutorUtility.$G($v_0);
    $v_0 = $v_0 + 'SP.CloseWindow' + '=true';
    var $v_1 = window.open($v_0);

    if (SP.RequestExecutorUtility.$0($v_1)) {
        SP.RequestExecutor.$1F($p0, 'RE_CannotAccessSiteOpenWindowFailed');
    }
    else {
        SP.RequestExecutor.$P[$p0] = $v_1;
        if (SP.RequestExecutorUtility.$0(SP.RequestExecutor.$H[$p0])) {
            SP.RequestExecutor.$H[$p0] = 1;
        }
        else {
            SP.RequestExecutor.$H[$p0] = SP.RequestExecutor.$H[$p0] + 1;
        }
        SP.RequestExecutor.$z($p0);
    }
};
SP.RequestExecutor.$1F = function SP_RequestExecutor$$1F($p0, $p1) {
    SP.RequestExecutor.$1('Failed to load IFRAME for ' + $p0);
    SP.RequestExecutor.$a[$p0] = true;
    var $v_0 = SP.RequestExecutor.$E[$p0];

    SP.RequestExecutor.$E[$p0] = [];
    if (!SP.RequestExecutorUtility.$0(SP.RequestExecutor.$B[$p0])) {
        window.clearTimeout(SP.RequestExecutor.$B[$p0]);
        delete SP.RequestExecutor.$B[$p0];
    }
    SP.RequestExecutor.$1z($p0);
    if ($v_0) {
        var $v_1 = SP.RequestExecutor.$1m($p0, $p1);

        for (var $v_2 = 0; $v_2 < $v_0.length; $v_2++) {
            var $v_3 = $v_0[$v_2];
            var $v_4 = $v_3.postMessageId;
            var $v_5 = SP.RequestExecutor.$4[$v_4];

            if (!SP.RequestExecutorUtility.$0($v_5)) {
                SP.RequestExecutor.$4[$v_4] = null;
                delete SP.RequestExecutor.$4[$v_4];
                if (!SP.RequestExecutorUtility.$0($v_3.timeoutId)) {
                    window.clearTimeout($v_3.timeoutId);
                }
                SP.RequestExecutor.$c($v_3.requestInfo, SP.RequestExecutorErrors.iFrameLoadError, $v_1);
            }
        }
    }
};
SP.RequestExecutor.$1z = function SP_RequestExecutor$$1z($p0) {
    var $v_0 = SP.RequestExecutor.$t($p0);

    if ($v_0 && $v_0.parentNode) {
        $v_0.parentNode.removeChild($v_0);
    }
    if (SP.RequestExecutor.$E) {
        delete SP.RequestExecutor.$E[$p0];
    }
    if (SP.RequestExecutor.$B) {
        delete SP.RequestExecutor.$B[$p0];
    }
    if (SP.RequestExecutor.$V) {
        delete SP.RequestExecutor.$V[$p0];
    }
    if (SP.RequestExecutor.$Q) {
        delete SP.RequestExecutor.$Q[$p0];
    }
    if (SP.RequestExecutor.$N) {
        delete SP.RequestExecutor.$N[$p0];
    }
    if (SP.RequestExecutor.$a) {
        delete SP.RequestExecutor.$a[$p0];
    }
    if (SP.RequestExecutor.$P) {
        delete SP.RequestExecutor.$P[$p0];
    }
    if (SP.RequestExecutor.$H) {
        delete SP.RequestExecutor.$H[$p0];
    }
};
SP.RequestExecutor.$z = function SP_RequestExecutor$$z($p0) {
    var $v_0 = SP.RequestExecutor.$P[$p0];

    if ($v_0) {
        if ($v_0.closed) {
            delete SP.RequestExecutor.$P[$p0];
            var $v_1 = SP.RequestExecutor.$t($p0);

            SP.RequestExecutor.$Q[$p0] = false;
            SP.RequestExecutor.$V[$p0] = false;
            SP.RequestExecutor.$a[$p0] = false;
            $p0 = SP.RequestExecutorUtility.$G($p0);
            var $v_2 = $p0;

            $v_2 = SP.RequestExecutorUtility.$G($v_2);
            $v_2 = $v_2 + 'SP.AppWebProxyUrl' + '=' + SP.RequestExecutorHttpUtility.$R($p0, false, false);
            $v_2 = $v_2 + '&ts=' + (Math.random()).toString();
            SP.RequestExecutor.$1('Reload IFRAME for ' + $p0 + '. Src=' + $v_2);
            $v_1.src = $v_2;
        }
        else {
            window.setTimeout(function() {
                SP.RequestExecutor.$z($p0);
            }, 500);
        }
    }
};
SP.RequestExecutor.$1w = function SP_RequestExecutor$$1w($p0) {
    SP.RequestExecutor.$1('Successfully load frame for ' + $p0);
    SP.RequestExecutor.$Q[$p0] = true;
    SP.RequestExecutorNotificationPanel.$1y($p0);
    var $v_0 = SP.RequestExecutor.$E[$p0];

    if ($v_0) {
        SP.RequestExecutor.$E[$p0] = [];
        for (var $v_1 = 0; $v_1 < $v_0.length; $v_1++) {
            var $v_2 = $v_0[$v_1];

            if (SP.RequestExecutor.$4[$v_2.postMessageId]) {
                if ($v_2.requestInfo.$r_0) {
                    SP.RequestExecutor.$1K($v_2);
                }
                else {
                    SP.RequestExecutor.$F($v_2);
                }
            }
        }
    }
};
SP.RequestExecutor.$1K = function SP_RequestExecutor$$1K($p0) {
    if (!SP.RequestExecutorUtility.$0($p0.timeoutId)) {
        window.clearTimeout($p0.timeoutId);
    }
    var $v_0 = new SP.ResponseInfo();

    $v_0.responseAvailable = false;
    $v_0.body = '';
    $v_0.state = $p0.requestInfo.state;
    if ($p0.requestInfo.success) {
        $p0.requestInfo.success($v_0);
    }
};
SP.RequestExecutor.internalProcessIFrameRequestTimeoutCallback = function SP_RequestExecutor$internalProcessIFrameRequestTimeoutCallback(postMessageId) {
    if (!SP.RequestExecutor.$4) {
        return;
    }
    var $v_0 = SP.RequestExecutor.$4[postMessageId];

    if (SP.RequestExecutorUtility.$0($v_0)) {
        return;
    }
    SP.RequestExecutor.$4[postMessageId] = null;
    delete SP.RequestExecutor.$4[postMessageId];
    SP.RequestExecutor.$c($v_0.requestInfo, SP.RequestExecutorErrors.requestAbortedOrTimedout, SP.RequestExecutorResources.getString('RE_RequestAbortedOrTimedout'));
};
SP.RequestExecutor.internalProcessXMLHttpRequestTimeoutCallback = function SP_RequestExecutor$internalProcessXMLHttpRequestTimeoutCallback(xhr, requestInfo) {
    xhr.onreadystatechange = SP.RequestExecutorNative.emptyCallback;
    try {
        xhr.abort();
    }
    catch ($$e_2) { }
    SP.RequestExecutor.$c(requestInfo, SP.RequestExecutorErrors.requestAbortedOrTimedout, SP.RequestExecutorResources.getString('RE_RequestAbortedOrTimedout'));
};
SP.RequestExecutor.internalProcessXMLHttpRequestOnreadystatechange = function SP_RequestExecutor$internalProcessXMLHttpRequestOnreadystatechange(xhr, requestInfo, timeoutId) {
    if (xhr.readyState === 4) {
        if (timeoutId) {
            window.clearTimeout(timeoutId);
        }
        xhr.onreadystatechange = SP.RequestExecutorNative.emptyCallback;
        var $v_0 = new SP.ResponseInfo();

        $v_0.state = requestInfo.state;
        $v_0.responseAvailable = true;
        if (requestInfo.binaryStringResponseBody) {
            $v_0.body = SP.RequestExecutorInternalSharedUtility.$1L(xhr.response);
        }
        else {
            $v_0.body = xhr.responseText;
        }
        $v_0.statusCode = xhr.status;
        $v_0.statusText = xhr.statusText;
        $v_0.contentType = xhr.getResponseHeader('content-type');
        $v_0.allResponseHeaders = xhr.getAllResponseHeaders();
        $v_0.headers = SP.RequestExecutor.$1X($v_0.allResponseHeaders);
        if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 1223) {
            if (requestInfo.success) {
                requestInfo.success($v_0);
            }
        }
        else {
            var $v_1 = SP.RequestExecutorErrors.httpError;
            var $v_2 = xhr.statusText;

            if (requestInfo.error) {
                requestInfo.error($v_0, $v_1, $v_2);
            }
        }
    }
};
SP.RequestExecutor.internalOnMessage = function SP_RequestExecutor$internalOnMessage(e) {
    SP.RequestExecutor.$1('RequestExecutor.OnMessage');
    if (SP.RequestExecutorUtility.$0(e)) {
        SP.RequestExecutor.$1('RequestExecutor.OnMessage: message is null');
        return;
    }
    var $v_0 = e.data;
    var $v_1 = e.origin;

    SP.RequestExecutor.$1('RequestExecutor.OnMessage: Message.data=' + $v_0);
    SP.RequestExecutor.$1('RequestExecutor.OnMessage: Message.origin=' + $v_1);
    if (SP.RequestExecutorUtility.$2($v_1) || SP.RequestExecutorUtility.$2($v_0)) {
        return;
    }
    if (!SP.RequestExecutor.$4) {
        return;
    }
    var $v_2 = JSON.parse($v_0);

    if (SP.RequestExecutorUtility.$0($v_2)) {
        return;
    }
    if (SP.RequestExecutorUtility.$2($v_2.postMessageId)) {
        return;
    }
    var $v_3 = SP.RequestExecutor.$4[$v_2.postMessageId];

    if (SP.RequestExecutorUtility.$0($v_3)) {
        return;
    }
    var $v_4 = SP.RequestExecutor.$U($v_1);
    var $v_5 = SP.RequestExecutor.$U($v_3.appWebProxyUrl);

    if ($v_4.toLowerCase() !== $v_5.toLowerCase()) {
        return;
    }
    var $v_6 = $v_2.postMessageId;

    delete SP.RequestExecutor.$4[$v_6];
    if (!SP.RequestExecutorUtility.$0($v_3.timeoutId)) {
        window.clearTimeout($v_3.timeoutId);
        $v_3.timeoutId = 0;
        delete $v_3.timeoutId;
    }
    if ($v_2.command === 'Ping') {
        var $v_7 = $v_3.appWebProxyUrl;

        SP.RequestExecutor.$1w($v_7);
    }
    else if ($v_2.command === 'Query') {
        var $v_8 = new SP.ResponseInfo();

        $v_8.responseAvailable = $v_2.responseAvailable;
        $v_8.body = $v_2.responseText;
        $v_8.statusCode = $v_2.statusCode;
        $v_8.statusText = $v_2.statusText;
        $v_8.contentType = $v_2.contentType;
        $v_8.state = $v_3.requestInfo.state;
        $v_8.allResponseHeaders = $v_2.allResponseHeaders;
        $v_8.headers = SP.RequestExecutor.$1X($v_2.allResponseHeaders);
        $v_8.binaryStringResponseBody = $v_2.binaryStringResponseBody;
        if (SP.RequestExecutorUtility.$0($v_8.body)) {
            $v_8.body = '';
        }
        var $v_9 = 0;
        var $v_A = null;

        if ($v_2.errorCode) {
            $v_9 = $v_2.errorCode;
            $v_A = $v_2.errorMessage;
        }
        else {
            if ($v_2.statusCode >= 200 && $v_2.statusCode < 300 || $v_2.statusCode === 1223) {
                $v_9 = 0;
                $v_A = null;
            }
            else if (!SP.RequestExecutorUtility.$17($v_3.requestInfo.url, $v_3.requestInfo.method)) {
                $v_9 = SP.RequestExecutorErrors.httpError;
                $v_A = $v_2.statusText;
            }
        }
        if (!$v_9) {
            if ($v_3.requestInfo.success) {
                $v_3.requestInfo.success($v_8);
            }
        }
        else {
            if ($v_3.requestInfo.error) {
                $v_3.requestInfo.error($v_8, $v_9, $v_A);
            }
        }
    }
};
SP.RequestExecutor.get_$y = function SP_RequestExecutor$get_$y() {
    return !!document.body || SP.RequestExecutor.$1H;
};
SP.RequestExecutor.$x = function SP_RequestExecutor$$x($p0, $p1) {
    if (!SP.RequestExecutor.$f) {
        SP.RequestExecutor.$f = [];
    }
    if (!SP.RequestExecutor.$e) {
        SP.RequestExecutor.$e = [];
    }
    SP.RequestExecutor.$1('Adding request to queue');
    SP.RequestExecutor.$f.push($p0);
    SP.RequestExecutor.$e.push($p1);
};
SP.RequestExecutor.internalProcessWindowLoad = function SP_RequestExecutor$internalProcessWindowLoad() {
    SP.RequestExecutor.$1H = true;
    var $v_0 = SP.RequestExecutor.$f;

    SP.RequestExecutor.$f = null;
    var $v_1 = SP.RequestExecutor.$e;

    SP.RequestExecutor.$e = null;
    if ($v_0) {
        for (var $v_2 = 0; $v_2 < $v_0.length; $v_2++) {
            var $v_3 = $v_0[$v_2];
            var $v_4 = $v_1[$v_2];

            $v_3.executeAsync($v_4);
        }
    }
};
SP.RequestExecutor.$u = function SP_RequestExecutor$$u() {
    var $v_0 = window.XMLHttpRequest;

    if (SP.RequestExecutorUtility.$9($v_0)) {
        throw SP.RequestExecutorUtility.$S(SP.RequestExecutorResources.getString('RE_BrowserNotSupported'), SP.RequestExecutorExceptions.browserNotSupported);
    }
    return new XMLHttpRequest();
};
SP.RequestExecutor.$1X = function SP_RequestExecutor$$1X($p0) {
    if (SP.RequestExecutorUtility.$2($p0)) {
        return null;
    }
    var $v_0 = {};
    var $v_1 = new RegExp('\r?\n');
    var $v_2 = $p0.split($v_1);

    for (var $v_3 = 0; $v_3 < $v_2.length; $v_3++) {
        var $v_4 = $v_2[$v_3];

        if (!SP.RequestExecutorUtility.$2($v_4)) {
            var $v_5 = $v_4.indexOf(':');

            if ($v_5 > 0) {
                var $v_6 = $v_4.substr(0, $v_5);
                var $v_7 = $v_4.substr($v_5 + 1);

                $v_6 = SP.RequestExecutorNative.trim($v_6);
                $v_7 = SP.RequestExecutorNative.trim($v_7);
                $v_0[$v_6.toUpperCase()] = $v_7;
            }
        }
    }
    return $v_0;
};
SP.RequestExecutor.$1e = function SP_RequestExecutor$$1e($p0) {
    if (SP.RequestExecutorUtility.$0($p0)) {
        throw SP.RequestExecutorUtility.$J('options');
    }
    SP.RequestExecutorUtility.$6($p0.clientId, 'options.clientId', 'string', false);
    SP.RequestExecutorUtility.$6($p0.accessToken, 'options.accessToken', 'string', !SP.RequestExecutorUtility.$2($p0.clientId));
    SP.RequestExecutorUtility.$6($p0.viaUrl, 'options.viaUrl', 'string', false);
    SP.RequestExecutorUtility.$6($p0.signInWebUrl, 'options.signInWebUrl', 'string', false);
};
SP.RequestExecutor.$23 = function SP_RequestExecutor$$23($p0) {
    if (SP.RequestExecutorUtility.$0($p0)) {
        throw SP.RequestExecutorUtility.$J('requestInfo');
    }
    SP.RequestExecutorUtility.$6($p0.url, 'requestInfo.url', 'string', true);
    SP.RequestExecutorUtility.$6($p0.body, 'requestInfo.body', 'string', false);
    SP.RequestExecutorUtility.$6($p0.success, 'requestInfo.success', 'function', false);
    SP.RequestExecutorUtility.$6($p0.error, 'requestInfo.error', 'function', false);
    SP.RequestExecutorUtility.$6($p0.timeout, 'requestInfo.timeout', 'number', false);
    SP.RequestExecutorUtility.$6($p0.method, 'requestInfo.method', 'string', false);
    SP.RequestExecutorUtility.$6($p0.binaryStringRequestBody, 'requestInfo.BinaryRequestBody', 'boolean', false);
    SP.RequestExecutorUtility.$6($p0.binaryStringResponseBody, 'requestInfo.BinaryResponseBody', 'boolean', false);
    if (SP.RequestExecutorUtility.$2($p0.method)) {
        $p0.method = 'GET';
    }
    else {
        $p0.method = $p0.method.toUpperCase();
    }
    if (SP.RequestExecutorUtility.$0($p0.timeout)) {
        $p0.timeout = 90000;
    }
    if ($p0.timeout < 0) {
        throw SP.RequestExecutorUtility.$J('requestInfo.timeout');
    }
    if (SP.RequestExecutorUtility.$2($p0.url)) {
        throw SP.RequestExecutorUtility.$J('requestInfo.url');
    }
};
SP.RequestExecutor.$1m = function SP_RequestExecutor$$1m($p0, $p1) {
    var $v_0 = $p0;
    var $v_1 = $v_0.indexOf('/_layouts');

    if ($v_1 > 0) {
        $v_0 = $v_0.substr(0, $v_1);
    }
    var $v_2 = SP.RequestExecutorResources.getString($p1);

    $v_2 = SP.RequestExecutorUtility.$T($v_2, $v_0);
    return $v_2;
};
SP.RequestExecutor.internalLoginButtonHandler = function SP_RequestExecutor$internalLoginButtonHandler(panelId) {
    var $v_0 = SP.RequestExecutorNotificationPanel.$1Q(panelId);

    if (!SP.RequestExecutorUtility.$2($v_0)) {
        var $v_1 = SP.RequestExecutorNotificationPanel.$1q($v_0);

        if (SP.RequestExecutorUtility.$2($v_1)) {
            SP.RequestExecutor.$1v($v_0);
        }
        else {
            var $v_2 = $v_0;

            $v_2 = SP.RequestExecutorUtility.$G($v_2);
            $v_2 = $v_2 + 'SP.ReturnUrl' + '=' + SP.RequestExecutorHttpUtility.$R($v_1, false, false);
            window.top.location.href = $v_2;
        }
    }
    SP.RequestExecutorNotificationPanel.$1E(panelId);
};
SP.RequestExecutor.internalCancelButtonHandler = function SP_RequestExecutor$internalCancelButtonHandler(panelId) {
    var $v_0 = SP.RequestExecutorNotificationPanel.$1Q(panelId);

    if (!SP.RequestExecutorUtility.$2($v_0)) {
        SP.RequestExecutor.$1F($v_0, 'RE_CannotAccessSiteCancelled');
    }
    SP.RequestExecutorNotificationPanel.$1E(panelId);
};
SP.RequestExecutor.$1 = function SP_RequestExecutor$$1($p0) {
    var $v_0 = new Date();

    if (window.console && window.console.log) {
        window.console.log($v_0.toString() + ':' + $p0);
    }
    if (SP.RequestExecutor.logPanelEnabled) {
        SP.RequestExecutor.$1u($v_0.toString() + ':' + $p0);
    }
    if (SP.RequestExecutor.logCallback) {
        SP.RequestExecutor.logCallback($v_0.toString() + ':' + $p0);
    }
};
SP.RequestExecutor.$1u = function SP_RequestExecutor$$1u($p0) {
    var $v_0 = document.createElement('DIV');

    $v_0.innerHTML = SP.RequestExecutorUtility.$i($p0);
    (SP.RequestExecutor.$1p()).appendChild($v_0);
};
SP.RequestExecutor.$1p = function SP_RequestExecutor$$1p() {
    var $v_0 = document.getElementById('SP.RequestExecutor.Log');

    if (!$v_0) {
        $v_0 = document.createElement('DIV');
        $v_0.id = 'SP.RequestExecutor.Log';
        $v_0.style.display = 'none';
        document.body.appendChild($v_0);
    }
    return $v_0;
};
SP.RequestExecutor.prototype = {
    $A_0: null,
    $v_0: null,
    $1A_0: null,
    $O_0: 0,
    $7_0: null,
    get_formDigestHandlingEnabled: function SP_RequestExecutor$get_formDigestHandlingEnabled() {
        return this.formDigestHandlingEnabled;
    },
    set_formDigestHandlingEnabled: function SP_RequestExecutor$set_formDigestHandlingEnabled(value) {
        this.formDigestHandlingEnabled = value;
        return value;
    },
    get_iFrameSourceUrl: function SP_RequestExecutor$get_iFrameSourceUrl() {
        return this.iFrameSourceUrl;
    },
    set_iFrameSourceUrl: function SP_RequestExecutor$set_iFrameSourceUrl(value) {
        this.iFrameSourceUrl = value;
        return value;
    },
    get_$p_0: function SP_RequestExecutor$get_$p_0() {
        var $v_0 = this.get_iFrameSourceUrl();

        if (!SP.RequestExecutorUtility.$2(this.$7_0.clientId)) {
            $v_0 = SP.RequestExecutorUtility.$G($v_0);
            $v_0 += 'client_id';
            $v_0 += '=';
            $v_0 += encodeURIComponent(this.$7_0.clientId);
        }
        return SP.RequestExecutor.$b(this.$1A_0, $v_0);
    },
    executeAsync: function SP_RequestExecutor$executeAsync(requestInfo) {
        SP.RequestExecutor.$23(requestInfo);
        if (SP.RequestExecutorUtility.$1T(requestInfo.url)) {
            if ((SP.RequestExecutor.$U(requestInfo.url)).toLowerCase() !== (SP.RequestExecutor.$U(this.$A_0)).toLowerCase()) {
                throw SP.RequestExecutorUtility.$J('requestInfo.url');
            }
        }
        else {
            requestInfo.url = SP.RequestExecutor.$b(this.$A_0, requestInfo.url);
        }
        requestInfo.$o_0 = this.$7_0.accessToken;
        if (!SP.RequestExecutorUtility.$2(this.$7_0.clientTag)) {
            if (!requestInfo.headers) {
                requestInfo.headers = {};
            }
            var $v_0 = SP.RequestExecutorUtility.$1R(requestInfo.headers, 'x-clientservice-clienttag');

            if (SP.RequestExecutorUtility.$0($v_0)) {
                requestInfo.headers['x-clientservice-clienttag'] = this.$7_0.clientTag;
            }
        }
        if (requestInfo.binaryStringRequestBody || requestInfo.binaryStringResponseBody) {
            SP.RequestExecutor.$1g();
        }
        if (this.$O_0 === 2) {
            SP.RequestExecutor.$q();
            this.$13_0();
            if (SP.RequestExecutor.get_$y()) {
                this.$14_0(this.get_$p_0(), requestInfo);
            }
            else {
                SP.RequestExecutor.$x(this, requestInfo);
            }
        }
        else if (this.$O_0 === 3) {
            this.$1i_0(requestInfo);
        }
        else {
            SP.RequestExecutor.$q();
            this.$1j_0(requestInfo);
        }
    },
    initializeAsync: function SP_RequestExecutor$initializeAsync(success, error) {
        SP.RequestExecutor.$q();
        var $v_0 = new SP.RequestInfo();

        $v_0.$o_0 = this.$7_0.accessToken;
        $v_0.headers = {};
        $v_0.success = success;
        $v_0.error = error;
        if (!SP.RequestExecutorUtility.$2(this.$7_0.clientTag)) {
            $v_0.headers['x-clientservice-clienttag'] = this.$7_0.clientTag;
        }
        if (this.$O_0 === 2) {
            this.$13_0();
            if (SP.RequestExecutor.get_$y()) {
                this.$14_0(this.get_$p_0(), $v_0);
            }
            else {
                SP.RequestExecutor.$x(this, $v_0);
            }
        }
        else {
            if (success) {
                var $v_1 = new SP.ResponseInfo();

                success($v_1);
            }
        }
    },
    attemptLogin: function SP_RequestExecutor$attemptLogin(returnUrl, success, error) {
        SP.RequestExecutorUtility.$X(returnUrl, 'returnUrl');
        SP.RequestExecutorUtility.$6(success, 'success', 'function', true);
        SP.RequestExecutorUtility.$6(error, 'error', 'function', false);
        if (this.$O_0 === 2) {
            SP.RequestExecutor.$q();
            this.$13_0();
            var $v_0 = this.get_$p_0();

            SP.RequestExecutorNotificationPanel.$1I($v_0, returnUrl);
            var $v_1 = new SP.RequestInfo();

            $v_1.$r_0 = true;
            var $$t_A = this;

            $v_1.success = function($p1_0) {
                SP.RequestExecutorNotificationPanel.$1I($v_0, null);
                success($p1_0);
            };
            var $$t_B = this;

            $v_1.error = function($p1_0, $p1_1, $p1_2) {
                SP.RequestExecutorNotificationPanel.$1I($v_0, null);
                if (error) {
                    error($p1_0, $p1_1, $p1_2);
                }
            };
            if (SP.RequestExecutor.get_$y()) {
                this.$14_0(this.get_$p_0(), $v_1);
            }
            else {
                SP.RequestExecutor.$x(this, $v_1);
            }
        }
        else {
            var $v_2 = new SP.ResponseInfo();

            $v_2.responseAvailable = true;
            $v_2.body = '';
            success($v_2);
        }
    },
    $14_0: function SP_RequestExecutor$$14_0($p0, $p1) {
        SP.RequestExecutor.$m++;
        var $v_0 = new SP.AppWebProxyRequestInfo();

        $v_0.command = 'Query';
        $v_0.postMessageId = SP.RequestExecutorInternalSharedUtility.$j + SP.RequestExecutor.$m.toString();
        $v_0.appWebProxyUrl = $p0;
        $v_0.requestInfo = $p1;
        if (!SP.RequestExecutor.$E) {
            SP.RequestExecutor.$E = {};
        }
        if (!SP.RequestExecutor.$B) {
            SP.RequestExecutor.$B = {};
        }
        if (!SP.RequestExecutor.$l) {
            SP.RequestExecutor.$l = {};
        }
        if (!SP.RequestExecutor.$V) {
            SP.RequestExecutor.$V = {};
        }
        if (!SP.RequestExecutor.$Q) {
            SP.RequestExecutor.$Q = {};
        }
        if (!SP.RequestExecutor.$N) {
            SP.RequestExecutor.$N = {};
        }
        if (!SP.RequestExecutor.$I) {
            SP.RequestExecutor.$I = {};
        }
        if (!SP.RequestExecutor.$a) {
            SP.RequestExecutor.$a = {};
        }
        if (!SP.RequestExecutor.$4) {
            SP.RequestExecutor.$4 = {};
        }
        if (!SP.RequestExecutor.$P) {
            SP.RequestExecutor.$P = {};
        }
        if (!SP.RequestExecutor.$H) {
            SP.RequestExecutor.$H = {};
        }
        var $v_1 = SP.RequestExecutor.$E[$p0];

        if (!$v_1) {
            $v_1 = [];
            SP.RequestExecutor.$E[$p0] = $v_1;
        }
        SP.RequestExecutor.$4[$v_0.postMessageId] = $v_0;
        if ($v_0.requestInfo.timeout > 0) {
            var $v_3 = SP.RequestExecutorNative.getIFrameRequestTimeoutCallback($v_0.postMessageId);

            $v_0.timeoutId = window.setTimeout($v_3, $v_0.requestInfo.timeout);
        }
        var $v_2 = SP.RequestExecutor.$t($p0);

        if ($v_2) {
            if (SP.RequestExecutor.$V[$p0] && SP.RequestExecutor.$Q[$p0]) {
                if ($v_0.requestInfo.$r_0) {
                    SP.RequestExecutor.$1K($v_0);
                }
                else {
                    SP.RequestExecutor.$F($v_0);
                }
            }
            else {
                SP.RequestExecutor.$1('The frame element is not loaded. Put request in queue');
                $v_1.push($v_0);
            }
        }
        else {
            SP.RequestExecutor.$1('The frame element does not exist. Put request in queue');
            $v_1.push($v_0);
            $v_2 = SP.RequestExecutor.$1h($p0, this.$7_0.signInWebUrl, this.$7_0.clientTag);
        }
    },
    $1i_0: function SP_RequestExecutor$$1i_0($p0) {
        var $v_0 = SP.RequestExecutor.$b(this.$A_0, '_api/contextinfo');

        $v_0 = SP.RequestExecutor.$1S(this.$v_0, $v_0);
        var $$t_4 = this;

        SP.RequestExecutor.$1N(this.$A_0, $v_0, this.get_formDigestHandlingEnabled(), $p0, function($p1_0, $p1_1) {
            $$t_4.$1O_0($p1_0, $p1_1);
        });
    },
    $1O_0: function SP_RequestExecutor$$1O_0($p0, $p1) {
        var $v_0 = SP.RequestExecutor.$u();
        var $v_1;

        if (this.$O_0 === 3) {
            $v_1 = SP.RequestExecutor.$1S(this.$v_0, $p1.url);
        }
        else {
            $v_1 = SP.RequestExecutorUtility.$g($p1.url);
        }
        $v_0.open($p1.method, $v_1);
        var $v_2 = false;

        if ($p1.headers) {
            var $$dict_5 = $p1.headers;

            for (var $$key_6 in $$dict_5) {
                var $v_5 = {
                    key: $$key_6,
                    value: $$dict_5[$$key_6]
                };

                if (!SP.RequestExecutorUtility.$2($v_5.key)) {
                    $v_0.setRequestHeader($v_5.key, $v_5.value);
                    if ($v_5.key.toLowerCase() === 'x-requestdigest') {
                        $v_2 = true;
                    }
                }
            }
        }
        if (!$v_2 && !SP.RequestExecutorUtility.$2($p0)) {
            $v_0.setRequestHeader('X-RequestDigest', $p0);
        }
        if ($p1.binaryStringResponseBody) {
            SP.RequestExecutorInternalSharedUtility.$1d($v_0);
        }
        var $v_3 = 0;

        if ($p1.timeout > 0) {
            $v_3 = window.setTimeout(SP.RequestExecutorNative.getXMLHttpRequestTimeoutCallback($v_0, $p1), $p1.timeout);
        }
        $v_0.onreadystatechange = SP.RequestExecutorNative.getXMLHttpRequestOnreadystatechangeCallback($v_0, $p1, $v_3);
        var $v_4 = $p1.body;

        if ($p1.binaryStringRequestBody) {
            $v_4 = SP.RequestExecutorInternalSharedUtility.$1M($p1.body);
        }
        if (SP.RequestExecutorUtility.$0($v_4)) {
            $v_4 = '';
        }
        $v_0.send($v_4);
    },
    $1j_0: function SP_RequestExecutor$$1j_0($p0) {
        var $v_0 = SP.RequestExecutor.$b(this.$A_0, '_api/contextinfo');

        $v_0 = SP.RequestExecutorUtility.$g($v_0);
        var $$t_4 = this;

        SP.RequestExecutor.$1N(this.$A_0, $v_0, this.get_formDigestHandlingEnabled(), $p0, function($p1_0, $p1_1) {
            $$t_4.$1O_0($p1_0, $p1_1);
        });
    },
    $13_0: function SP_RequestExecutor$$13_0() {
        if (SP.RequestExecutor.$W) {
            return;
        }
        var $v_0 = SP.RequestExecutor.internalOnMessage;

        if (!SP.RequestExecutorUtility.$9(window.addEventListener)) {
            window.addEventListener('message', $v_0, false);
            SP.RequestExecutor.$W = true;
        }
        else if (!SP.RequestExecutorUtility.$9(window.attachEvent)) {
            window.attachEvent('onmessage', $v_0);
            SP.RequestExecutor.$W = true;
        }
        else {
            throw SP.RequestExecutorUtility.$11();
        }
    }
};
SP.RequestExecutorXHR = function SP_RequestExecutorXHR(url, options) {
    this.$D_0 = new SP.RequestInfo();
    this.$D_0.headers = {};
    var $$t_6 = this;

    this.$D_0.success = function($p1_0) {
        $$t_6.$1W_0($p1_0);
    };
    var $$t_7 = this;

    this.$D_0.error = function($p1_0, $p1_1, $p1_2) {
        $$t_7.$1V_0($p1_0, $p1_1, $p1_2);
    };
    this.readyState = 0;
    this.status = 0;
    this.statusText = '';
    this.response = '';
    this.responseText = '';
    this.timeout = 0;
    this.$1D_0 = new SP.RequestExecutor(url, options);
};
SP.RequestExecutorXHR.prototype = {
    $1D_0: null,
    $D_0: null,
    $w_0: null,
    open: function SP_RequestExecutorXHR$open(method, url) {
        this.$D_0.method = method;
        this.$D_0.url = url;
    },
    setRequestHeader: function SP_RequestExecutorXHR$setRequestHeader(header, value) {
        if (SP.RequestExecutorUtility.$0(this.$D_0.headers[header])) {
            this.$D_0.headers[header] = value;
        }
        else {
            this.$D_0.headers[header] += ' ' + value;
        }
    },
    send: function SP_RequestExecutorXHR$send(body) {
        this.$D_0.body = body;
        if (this.timeout) {
            this.$D_0.timeout = this.timeout;
        }
        this.$1D_0.executeAsync(this.$D_0);
        this.readyState = 1;
        this.$1J_0();
    },
    getResponseHeader: function SP_RequestExecutorXHR$getResponseHeader(header) {
        if (!this.readyState || this.readyState === 1) {
            return null;
        }
        return this.$w_0.headers[header.toUpperCase()].toString();
    },
    getAllResponseHeaders: function SP_RequestExecutorXHR$getAllResponseHeaders() {
        if (!this.readyState || this.readyState === 1) {
            return null;
        }
        return this.$w_0.allResponseHeaders;
    },
    $1W_0: function SP_RequestExecutorXHR$$1W_0($p0) {
        this.$1U_0($p0);
    },
    $1V_0: function SP_RequestExecutorXHR$$1V_0($p0, $p1, $p2) {
        this.$1U_0($p0);
    },
    $1J_0: function SP_RequestExecutorXHR$$1J_0() {
        if (this.onreadystatechange) {
            this.onreadystatechange();
        }
    },
    $1U_0: function SP_RequestExecutorXHR$$1U_0($p0) {
        this.status = $p0.statusCode;
        this.statusText = $p0.statusText;
        this.response = $p0.body;
        this.responseText = $p0.body;
        this.$w_0 = $p0;
        this.readyState = 4;
        this.$1J_0();
    },
    readyState: 0,
    timeout: 0,
    status: 0,
    statusText: null,
    response: null,
    responseText: null,
    onreadystatechange: null
};
SP.RequestExecutorErrors = function SP_RequestExecutorErrors() {
};
SP.RequestExecutorExceptions = function SP_RequestExecutorExceptions() {
};
SP.RequestExecutorInternalSharedUtility = function SP_RequestExecutorInternalSharedUtility() {
};
SP.RequestExecutorInternalSharedUtility.$U = function SP_RequestExecutorInternalSharedUtility$$U($p0) {
    var $v_0 = $p0.indexOf('://');

    $v_0 = $p0.indexOf('/', $v_0 + 3);
    if ($v_0 > 0) {
        $p0 = $p0.substr(0, $v_0);
    }
    if (($p0.substr(0, 8)).toLowerCase() === 'https://' && $p0.substr($p0.length - 4, 4) === ':443') {
        $p0 = $p0.substr(0, $p0.length - 4);
    }
    else if (($p0.substr(0, 7)).toLowerCase() === 'http://' && $p0.substr($p0.length - 3, 3) === ':80') {
        $p0 = $p0.substr(0, $p0.length - 3);
    }
    return $p0;
};
SP.RequestExecutorInternalSharedUtility.$1r = function SP_RequestExecutorInternalSharedUtility$$1r($p0) {
    $p0 = SP.RequestExecutorInternalSharedUtility.$U($p0);
    if (($p0.substr(0, 8)).toLowerCase() === 'https://') {
        $p0 = $p0.substr(8);
    }
    else if (($p0.substr(0, 7)).toLowerCase() === 'http://') {
        $p0 = $p0.substr(7);
    }
    return $p0;
};
SP.RequestExecutorInternalSharedUtility.$1M = function SP_RequestExecutorInternalSharedUtility$$1M($p0) {
    var $v_0 = null;

    if (typeof $p0 == 'string') {
        var buffer = new ArrayBuffer($p0.length);
        var byteArray = new Uint8Array(buffer);

        for (var i = 0; i < $p0.length; i++) {
            byteArray[i] = $p0.charCodeAt(i) & 0xff;
        }
        var bb = null;

        if (window.BlobBuilder) {
            bb = new BlobBuilder();
        }
        else if (window.MozBlobBuilder) {
            bb = new MozBlobBuilder();
        }
        if (bb) {
            bb.append(buffer);
            $v_0 = bb.getBlob();
        }
        else {
            $v_0 = buffer;
        }
    }
    ;
    return $v_0;
};
SP.RequestExecutorInternalSharedUtility.$1L = function SP_RequestExecutorInternalSharedUtility$$1L($p0) {
    var $v_0 = '';

    if ($p0) {
        var byteArray = new Uint8Array($p0);

        for (var i = 0; i < $p0.byteLength; i++) {
            $v_0 = $v_0 + String.fromCharCode(byteArray[i]);
        }
    }
    ;
    return $v_0;
};
SP.RequestExecutorInternalSharedUtility.$1d = function SP_RequestExecutorInternalSharedUtility$$1d($p0) {
    $p0.responseType = 'arraybuffer';
};
SP.RequestExecutorMessageProcessor = function SP_RequestExecutorMessageProcessor($p0, $p1) {
    this.$K_0 = $p0;
    this.$3_0 = $p1;
    if (SP.RequestExecutorUtility.$2(this.$3_0.method)) {
        this.$3_0.method = 'GET';
    }
    else {
        this.$3_0.method = this.$3_0.method.toUpperCase();
    }
    this.$L_0 = 0;
};
SP.RequestExecutorMessageProcessor.$F = function SP_RequestExecutorMessageProcessor$$F($p0, $p1) {
    var $v_0 = JSON.stringify($p0);

    SP.RequestExecutor.$1('RequestExecutorMessageProcessor.PostMessage.Message: ' + $v_0);
    SP.RequestExecutor.$1('RequestExecutorMessageProcessor.PostMessage.Target: ' + $p1);
    window.parent.postMessage($v_0, $p1);
};
SP.RequestExecutorMessageProcessor.$1c = function SP_RequestExecutorMessageProcessor$$1c($p0, $p1) {
    if (SP.RequestExecutorMessageProcessor.$C) {
        if (SP.RequestExecutorMessageProcessor.$C.requestHeaders) {
            var $$dict_2 = SP.RequestExecutorMessageProcessor.$C.requestHeaders;

            for (var $$key_3 in $$dict_2) {
                var $v_0 = {
                    key: $$key_3,
                    value: $$dict_2[$$key_3]
                };

                $p0.setRequestHeader($v_0.key, $v_0.value);
            }
        }
        if (SP.RequestExecutorMessageProcessor.$C.requireAccessToken) {
            if (SP.RequestExecutorUtility.$0($p1)) {
                $p1 = '';
            }
            var $v_1 = 'Bearer ' + $p1;

            $p0.setRequestHeader('Authorization', $v_1);
            var $v_2 = 'access_token=' + SP.RequestExecutorHttpUtility.$R($p1, false, false);

            $p0.setRequestHeader('X-SP-Context', $v_2);
        }
    }
};
SP.RequestExecutorMessageProcessor.$1n = function SP_RequestExecutorMessageProcessor$$1n($p0) {
    if (!SP.RequestExecutorMessageProcessor.$Z) {
        SP.RequestExecutorMessageProcessor.$Z = {};
    }
    $p0 = SP.RequestExecutorMessageProcessor.$16($p0);
    var $v_0 = SP.RequestExecutorMessageProcessor.$Z[$p0];

    if (!$v_0) {
        return null;
    }
    var $v_1 = new Date();

    if ($v_0.expiration < $v_1.getTime()) {
        return null;
    }
    return $v_0.digestValue;
};
SP.RequestExecutorMessageProcessor.$16 = function SP_RequestExecutorMessageProcessor$$16($p0) {
    var $v_0 = $p0;
    var $v_1;

    $v_1 = $p0.indexOf('?');
    if ($v_1 > 0) {
        $p0 = $p0.substr(0, $v_1);
    }
    $v_1 = $p0.indexOf('#');
    if ($v_1 > 0) {
        $p0 = $p0.substr(0, $v_1);
    }
    $p0 = $p0.toLowerCase();
    $v_1 = $p0.indexOf('/_layouts');
    if ($v_1 > 0) {
        $p0 = $p0.substr(0, $v_1);
    }
    $v_1 = $p0.indexOf('/_vti_');
    if ($v_1 > 0) {
        $p0 = $p0.substr(0, $v_1);
    }
    $v_1 = $p0.indexOf('/_api');
    if ($v_1 > 0) {
        $p0 = $p0.substr(0, $v_1);
    }
    var $v_2 = $v_0.substr(0, $p0.length);

    if ($v_2.charAt($p0.length - 1) !== '/') {
        $v_2 = $v_2 + '/';
    }
    $v_2 += '_api/contextinfo';
    return $v_2;
};
SP.RequestExecutorMessageProcessor.init = function SP_RequestExecutorMessageProcessor$init(settings) {
    SP.RequestExecutor.$1('RequestExecutorMessageProcessor.Init');
    if (!settings) {
        settings = new SP.RequestExecutorMessageProcessorInitInfo();
    }
    SP.RequestExecutorMessageProcessor.$C = settings;
    if (SP.RequestExecutorUtility.$9(SP.RequestExecutorMessageProcessor.$C.formDigestHandlingEnabled)) {
        SP.RequestExecutorMessageProcessor.$C.formDigestHandlingEnabled = false;
    }
    if (SP.RequestExecutorUtility.$9(SP.RequestExecutorMessageProcessor.$C.initErrorCode)) {
        SP.RequestExecutorMessageProcessor.$C.initErrorCode = 0;
    }
    if (SP.RequestExecutorUtility.$9(SP.RequestExecutorMessageProcessor.$C.initErrorMessage)) {
        SP.RequestExecutorMessageProcessor.$C.initErrorMessage = '';
    }
    if (!SP.RequestExecutorMessageProcessor.$W) {
        var $v_0 = window.SP.RequestExecutorMessageProcessor.internalOnMessage;

        if (window.addEventListener) {
            window.addEventListener('message', $v_0, false);
            SP.RequestExecutorMessageProcessor.$W = true;
            SP.RequestExecutor.$1('RequestExecutorMessageProcessor.addEventListener');
        }
        else if (window.attachEvent) {
            window.attachEvent('onmessage', $v_0);
            SP.RequestExecutorMessageProcessor.$W = true;
            SP.RequestExecutor.$1('RequestExecutorMessageProcessor.attachEvent');
        }
    }
};
SP.RequestExecutorMessageProcessor.internalOnMessage = function SP_RequestExecutorMessageProcessor$internalOnMessage(e) {
    SP.RequestExecutor.$1('RequestExecutorMessageProcessor.OnMessage');
    if (SP.RequestExecutorUtility.$0(e)) {
        SP.RequestExecutor.$1('RequestExecutorMessageProcessor.OnMessage: Message is null.');
        return;
    }
    var $v_0 = SP.RequestExecutorMessageProcessor.$C;

    if (!$v_0) {
        SP.RequestExecutor.$1('RequestExecutorMessageProcessor.OnMessage: Setting is null.');
        return;
    }
    var $v_1 = e.data;
    var $v_2 = e.origin;

    SP.RequestExecutor.$1('RequestExecutorMessageProcessor.OnMessage: Message.data=' + $v_1);
    SP.RequestExecutor.$1('RequestExecutorMessageProcessor.OnMessage: Message.origin=' + $v_2);
    if (SP.RequestExecutorUtility.$2($v_2)) {
        SP.RequestExecutor.$1('RequestExecutorMessageProcessor.OnMessage: Message.origin is null');
        return;
    }
    if (SP.RequestExecutorUtility.$2($v_1)) {
        SP.RequestExecutor.$1('RequestExecutorMessageProcessor.OnMessage: Message.data is null');
        return;
    }
    var $v_3 = JSON.parse($v_1);

    if (SP.RequestExecutorUtility.$0($v_3)) {
        SP.RequestExecutor.$1('RequestExecutorMessageProcessor.OnMessage: Unable to parse data:' + $v_1);
        return;
    }
    if (SP.RequestExecutorUtility.$2($v_3.postMessageId)) {
        SP.RequestExecutor.$1('RequestExecutorMessageProcessor.OnMessage: There is no postMesageId property');
        return;
    }
    if ($v_3.postMessageId.substr(0, SP.RequestExecutorInternalSharedUtility.$j.length) !== SP.RequestExecutorInternalSharedUtility.$j) {
        SP.RequestExecutor.$1('RequestExecutorMessageProcessor.OnMessage: Unknown postMessageId');
        return;
    }
    if (SP.RequestExecutorUtility.$2($v_3.command)) {
        SP.RequestExecutor.$1('RequestExecutorMessageProcessor.OnMessage: command property is null');
        return;
    }
    if ($v_3.command === 'Ping') {
        SP.RequestExecutor.$1('RequestExecutorMessageProcessor.OnMessage: Processing ping command');
        SP.RequestExecutorMessageProcessor.$n($v_3, $v_0.initErrorCode, $v_0.initErrorMessage, $v_2);
        return;
    }
    if ($v_3.command !== 'Query') {
        SP.RequestExecutor.$1('RequestExecutorMessageProcessor.OnMessage: Unknown command');
        return;
    }
    if ($v_0.initErrorCode < 0) {
        SP.RequestExecutorMessageProcessor.$n($v_3, $v_0.initErrorCode, $v_0.initErrorMessage, $v_2);
        return;
    }
    if ((!$v_0.trustedOriginAuthorities || !$v_0.trustedOriginAuthorities.length) && !$v_0.originAuthorityValidator) {
        SP.RequestExecutorMessageProcessor.$n($v_3, SP.RequestExecutorErrors.noTrustedOrigins, SP.RequestExecutorResources.getString('RE_NoTrustedOrigins'), $v_2);
        return;
    }
    var $v_4 = false;
    var $v_5 = (SP.RequestExecutorInternalSharedUtility.$1r($v_2)).toLowerCase();

    if ($v_0.trustedOriginAuthorities) {
        for (var $v_8 = 0; $v_8 < $v_0.trustedOriginAuthorities.length; $v_8++) {
            var $v_9 = $v_0.trustedOriginAuthorities[$v_8].toLowerCase();

            if ($v_9 === $v_5) {
                $v_4 = true;
                break;
            }
        }
    }
    if (!$v_4 && $v_0.originAuthorityValidator) {
        $v_4 = $v_0.originAuthorityValidator($v_5);
    }
    if (!$v_4) {
        SP.RequestExecutorMessageProcessor.$n($v_3, SP.RequestExecutorErrors.domainDoesNotMatch, SP.RequestExecutorResources.getString('RE_DomainDoesNotMatch'), $v_2);
        return;
    }
    if (SP.RequestExecutorUtility.$17($v_3.url, $v_3.method)) {
        SP.RequestExecutor.$1('RequestExecutorMessageProcessor.OnMessage: Empty Url or Method');
        SP.RequestExecutorMessageProcessor.$n($v_3, $v_0.initErrorCode, $v_0.initErrorMessage, $v_2);
        return;
    }
    var $v_6 = new SP.RequestExecutorMessageProcessor($v_2, $v_3);
    var $v_7 = 0;

    if ($v_7 > 0) {
        window.setTimeout(function() {
            $v_6.$1Y_0();
        }, $v_7);
    }
    else {
        $v_6.$1Y_0();
    }
};
SP.RequestExecutorMessageProcessor.$n = function SP_RequestExecutorMessageProcessor$$n($p0, $p1, $p2, $p3) {
    var $v_0 = new SP.PostMessageResponseInfo();

    $v_0.command = $p0.command;
    $v_0.postMessageId = $p0.postMessageId;
    $v_0.responseAvailable = false;
    $v_0.errorCode = $p1;
    $v_0.errorMessage = $p2;
    SP.RequestExecutorMessageProcessor.$F($v_0, $p3);
};
SP.RequestExecutorMessageProcessor.prototype = {
    $K_0: null,
    $3_0: null,
    $L_0: 0,
    $5_0: null,
    $1Y_0: function SP_RequestExecutorMessageProcessor$$1Y_0() {
        if (this.$3_0.method === 'GET' || !SP.RequestExecutorMessageProcessor.$C.formDigestHandlingEnabled) {
            this.$18_0(null);
        }
        else {
            var $v_0 = SP.RequestExecutorMessageProcessor.$1n(this.$3_0.url);

            if (SP.RequestExecutorUtility.$2($v_0)) {
                this.$1k_0();
            }
            else {
                this.$18_0($v_0);
            }
        }
    },
    $1k_0: function SP_RequestExecutorMessageProcessor$$1k_0() {
        var $v_0 = SP.RequestExecutorMessageProcessor.$16(this.$3_0.url);

        $v_0 = SP.RequestExecutorUtility.$g($v_0);
        var $v_1 = SP.RequestExecutor.$u();

        $v_1.open('POST', $v_0);
        $v_1.setRequestHeader('ACCEPT', 'application/json;odata=verbose');
        var $v_2 = SP.RequestExecutorUtility.$1R(this.$3_0.headers, 'x-clientservice-clienttag');

        if (!SP.RequestExecutorUtility.$2($v_2)) {
            $v_1.setRequestHeader('x-clientservice-clienttag', $v_2);
        }
        SP.RequestExecutorMessageProcessor.$1c($v_1, this.$3_0.accessToken);
        if (this.$3_0.timeout > 0) {
            var $$t_4 = this;

            this.$L_0 = window.setTimeout(function() {
                $v_1.onreadystatechange = SP.RequestExecutorNative.emptyCallback;
                $v_1.abort();
                var $v_3 = new SP.PostMessageResponseInfo();

                $v_3.command = 'Query';
                $v_3.errorCode = SP.RequestExecutorErrors.requestAbortedOrTimedout;
                $v_3.errorMessage = SP.RequestExecutorResources.getString('RE_RequestAbortedOrTimedout');
                $v_3.postMessageId = $$t_4.$3_0.postMessageId;
                $v_3.responseAvailable = false;
                SP.RequestExecutorMessageProcessor.$F($v_3, $$t_4.$K_0);
            }, this.$3_0.timeout);
        }
        var $$t_5 = this;

        $v_1.onreadystatechange = function() {
            if ($v_1 && $v_1.readyState === 4) {
                if ($$t_5.$L_0) {
                    window.clearTimeout($$t_5.$L_0);
                    $$t_5.$L_0 = 0;
                }
                $v_1.onreadystatechange = SP.RequestExecutorNative.emptyCallback;
                $$t_5.$1l_0($v_1);
            }
        };
        $v_1.send('');
    },
    $1l_0: function SP_RequestExecutorMessageProcessor$$1l_0($p0) {
        if ($p0.status !== 200) {
            var $v_5 = this.$h_0($p0);

            $v_5.errorCode = SP.RequestExecutorErrors.httpError;
            var $v_6 = SP.RequestExecutorResources.getString('RE_RequestUnexpectedResponseWithContentTypeAndStatus');

            $v_5.errorMessage = SP.RequestExecutorUtility.$T($v_6, $p0.getResponseHeader('content-type'), $p0.status.toString());
            SP.RequestExecutorMessageProcessor.$F($v_5, this.$K_0);
            return;
        }
        var $v_0 = $p0.getResponseHeader('content-type');

        if (SP.RequestExecutorUtility.$2($v_0) || ($v_0.toLowerCase()).indexOf('json') < 0) {
            var $v_7 = this.$h_0($p0);

            $v_7.errorCode = SP.RequestExecutorErrors.unexpectedResponse;
            $v_7.errorMessage = SP.RequestExecutorResources.getString('RE_RequestUnexpectedResponse');
            SP.RequestExecutorMessageProcessor.$F($v_7, this.$K_0);
            return;
        }
        var $v_1 = $p0.getResponseHeader('SharePointError');

        if (!SP.RequestExecutorUtility.$2($v_1)) {
            var $v_8 = this.$h_0($p0);

            $v_8.errorCode = SP.RequestExecutorErrors.unexpectedResponse;
            $v_8.errorMessage = SP.RequestExecutorResources.getString('RE_RequestUnexpectedResponse');
            SP.RequestExecutorMessageProcessor.$F($v_8, this.$K_0);
            return;
        }
        var $v_2 = JSON.parse($p0.responseText);

        if (SP.RequestExecutorUtility.$0($v_2)) {
            var $v_9 = this.$h_0($p0);

            $v_9.errorCode = SP.RequestExecutorErrors.unexpectedResponse;
            $v_9.errorMessage = SP.RequestExecutorResources.getString('RE_RequestUnexpectedResponse');
            SP.RequestExecutorMessageProcessor.$F($v_9, this.$K_0);
            return;
        }
        var $v_3 = new SP.RequestExecutorMessageProcessorFormDigestInfo();

        try {
            $v_3.digestValue = $v_2.d.GetContextWebInformation.FormDigestValue;
            var $v_A = $v_2.d.GetContextWebInformation.FormDigestTimeoutSeconds;

            $v_3.expiration = (new Date()).getTime() + $v_A * 750;
        }
        catch ($$e_B) {
            var $v_B = this.$h_0($p0);

            $v_B.errorCode = SP.RequestExecutorErrors.unexpectedResponse;
            $v_B.errorMessage = SP.RequestExecutorResources.getString('RE_RequestUnexpectedResponse');
            SP.RequestExecutorMessageProcessor.$F($v_B, this.$K_0);
            return;
        }
        if (!SP.RequestExecutorMessageProcessor.$Z) {
            SP.RequestExecutorMessageProcessor.$Z = {};
        }
        var $v_4 = SP.RequestExecutorMessageProcessor.$16(this.$3_0.url);

        SP.RequestExecutorMessageProcessor.$Z[$v_4] = $v_3;
        this.$18_0($v_3.digestValue);
    },
    $h_0: function SP_RequestExecutorMessageProcessor$$h_0($p0) {
        var $v_0 = new SP.PostMessageResponseInfo();

        $v_0.command = 'Query';
        $v_0.errorCode = 0;
        $v_0.errorMessage = null;
        $v_0.postMessageId = this.$3_0.postMessageId;
        $v_0.responseAvailable = true;
        $v_0.statusText = $p0.statusText;
        $v_0.statusCode = $p0.status;
        $v_0.contentType = $p0.getResponseHeader('content-type');
        $v_0.allResponseHeaders = $p0.getAllResponseHeaders();
        $v_0.responseText = $p0.responseText;
        return $v_0;
    },
    $18_0: function SP_RequestExecutorMessageProcessor$$18_0($p0) {
        this.$5_0 = SP.RequestExecutor.$u();
        var $v_0 = this.$3_0.url;

        $v_0 = SP.RequestExecutorUtility.$g($v_0);
        this.$5_0.open(this.$3_0.method, $v_0);
        var $v_1 = false;

        if (this.$3_0.headers) {
            var $$dict_3 = this.$3_0.headers;

            for (var $$key_4 in $$dict_3) {
                var $v_3 = {
                    key: $$key_4,
                    value: $$dict_3[$$key_4]
                };

                if ($v_3.key.toLowerCase() === 'x-requestdigest') {
                    $v_1 = true;
                }
                this.$5_0.setRequestHeader($v_3.key, $v_3.value);
            }
        }
        if (!$v_1 && !SP.RequestExecutorUtility.$2($p0)) {
            this.$5_0.setRequestHeader('X-RequestDigest', $p0);
        }
        SP.RequestExecutorMessageProcessor.$1c(this.$5_0, this.$3_0.accessToken);
        if (this.$3_0.binaryStringResponseBody) {
            SP.RequestExecutorInternalSharedUtility.$1d(this.$5_0);
        }
        if (this.$3_0.timeout > 0) {
            var $$t_7 = this;

            this.$L_0 = window.setTimeout(function() {
                $$t_7.$21_0();
            }, this.$3_0.timeout);
        }
        var $$t_8 = this;

        this.$5_0.onreadystatechange = function() {
            $$t_8.$20_0();
        };
        var $v_2;

        if (this.$3_0.binaryStringRequestBody) {
            $v_2 = SP.RequestExecutorInternalSharedUtility.$1M(this.$3_0.body);
        }
        else {
            $v_2 = this.$3_0.body;
        }
        if (SP.RequestExecutorUtility.$0($v_2)) {
            $v_2 = '';
        }
        this.$5_0.send($v_2);
    },
    $21_0: function SP_RequestExecutorMessageProcessor$$21_0() {
        if (this.$5_0) {
            this.$5_0.onreadystatechange = SP.RequestExecutorNative.emptyCallback;
            this.$5_0.abort();
            var $v_0 = new SP.PostMessageResponseInfo();

            $v_0.command = 'Query';
            $v_0.errorCode = SP.RequestExecutorErrors.requestAbortedOrTimedout;
            $v_0.errorMessage = SP.RequestExecutorResources.getString('RE_RequestAbortedOrTimedout');
            $v_0.postMessageId = this.$3_0.postMessageId;
            $v_0.responseAvailable = false;
            SP.RequestExecutorMessageProcessor.$F($v_0, this.$K_0);
        }
    },
    $20_0: function SP_RequestExecutorMessageProcessor$$20_0() {
        if (this.$5_0 && this.$5_0.readyState === 4) {
            if (this.$L_0) {
                window.clearTimeout(this.$L_0);
                this.$L_0 = 0;
            }
            this.$5_0.onreadystatechange = SP.RequestExecutorNative.emptyCallback;
            var $v_0 = new SP.PostMessageResponseInfo();

            $v_0.command = 'Query';
            $v_0.errorCode = 0;
            $v_0.errorMessage = null;
            $v_0.postMessageId = this.$3_0.postMessageId;
            $v_0.responseAvailable = true;
            $v_0.statusText = this.$5_0.statusText;
            $v_0.statusCode = this.$5_0.status;
            $v_0.contentType = this.$5_0.getResponseHeader('content-type');
            $v_0.allResponseHeaders = this.$5_0.getAllResponseHeaders();
            $v_0.binaryStringResponseBody = this.$3_0.binaryStringResponseBody;
            if (this.$3_0.binaryStringResponseBody) {
                $v_0.responseText = SP.RequestExecutorInternalSharedUtility.$1L(this.$5_0.response);
            }
            else {
                $v_0.responseText = this.$5_0.responseText;
            }
            SP.RequestExecutorMessageProcessor.$F($v_0, this.$K_0);
        }
    }
};
SP.RequestExecutorNotificationPanel = function SP_RequestExecutorNotificationPanel() {
};
SP.RequestExecutorNotificationPanel.$22 = function SP_RequestExecutorNotificationPanel$$22($p0) {
    if (!SP.RequestExecutorNotificationPanel.$M) {
        SP.RequestExecutorNotificationPanel.$M = {};
    }
    if (SP.RequestExecutorUtility.$0(SP.RequestExecutorNotificationPanel.$M[$p0])) {
        SP.RequestExecutorNotificationPanel.$M[$p0] = SP.RequestExecutorNotificationPanel.$1G;
        SP.RequestExecutorNotificationPanel.$1G++;
    }
    var $v_0 = SP.RequestExecutorNotificationPanel.$M[$p0];
    var $v_1 = document.getElementById('SP_RequestExecutor_NotificationPanel' + $v_0.toString());

    if ($v_1) {
        return;
    }
    $v_1 = document.createElement('DIV');
    $v_1.id = 'SP_RequestExecutor_NotificationPanel' + $v_0.toString();
    $v_1.style.position = 'absolute';
    $v_1.style.width = '420px';
    $v_1.style.borderStyle = 'solid';
    $v_1.style.borderWidth = '1px';
    $v_1.style.padding = '5px';
    $v_1.className = 'ms-subtleEmphasis';
    var $v_2 = SP.RequestExecutorNotificationPanel.$1s() + 30;
    var $v_3 = SP.RequestExecutorNotificationPanel.$1o() + SP.RequestExecutorNotificationPanel.$1t() - 420 - 50;

    if ($v_3 < 0) {
        $v_3 = 0;
    }
    $v_1.style.left = $v_3.toString() + 'px';
    $v_1.style.top = $v_2.toString() + 'px';
    var $v_4 = SP.RequestExecutorUtility.$i(SP.RequestExecutorResources.getString('RE_OpenWindowMessage'));
    var $v_5 = '<input type=\'button\' onclick=\'SP.RequestExecutor.internalLoginButtonHandler(' + $v_0.toString() + ');return false;\' value=\'' + SP.RequestExecutorUtility.$i(SP.RequestExecutorResources.getString('RE_OpenWindowButtonText')) + '\' />';
    var $v_6 = '<a href=\'#\' onclick=\'SP.RequestExecutor.internalCancelButtonHandler(' + $v_0.toString() + ');return false;\'>' + SP.RequestExecutorUtility.$i(SP.RequestExecutorResources.getString('RE_DismissOpenWindowMessageLinkText')) + '</a>';
    var $v_7 = SP.RequestExecutorUtility.$i(SP.RequestExecutorResources.getString('RE_FixitHelpMessage'));

    $v_7 = SP.RequestExecutorUtility.$T($v_7, '<a href=\'http://go.microsoft.com/fwlink/?LinkId=255261\' target=\'_blank\'>', '</a>');
    $v_1.innerHTML = '<div class=\'ms-textXLarge ms-error\'>' + $v_4 + '</div><div style=\'padding-top:5px\'>' + $v_5 + '<span style=\'width:15px\'>&#160;&#160;&#160;</span>' + $v_6 + '</div>' + '<div style=\'padding-top:5px\'><span class=\'ms-metadata\'>' + $v_7 + '</span></div>';
    document.body.appendChild($v_1);
    if (!SP.RequestExecutorNotificationPanel.$1a) {
        window.setTimeout(function() {
            SP.RequestExecutor.internalCancelButtonHandler($v_0);
        }, 120000);
    }
};
SP.RequestExecutorNotificationPanel.$1Q = function SP_RequestExecutorNotificationPanel$$1Q($p0) {
    if (SP.RequestExecutorNotificationPanel.$M) {
        var $$dict_1 = SP.RequestExecutorNotificationPanel.$M;

        for (var $$key_2 in $$dict_1) {
            var $v_0 = {
                key: $$key_2,
                value: $$dict_1[$$key_2]
            };

            if ($v_0.value === $p0) {
                return $v_0.key;
            }
        }
    }
    return null;
};
SP.RequestExecutorNotificationPanel.$1E = function SP_RequestExecutorNotificationPanel$$1E($p0) {
    var $v_0 = document.getElementById('SP_RequestExecutor_NotificationPanel' + $p0.toString());

    if ($v_0) {
        $v_0.parentNode.removeChild($v_0);
    }
};
SP.RequestExecutorNotificationPanel.$1y = function SP_RequestExecutorNotificationPanel$$1y($p0) {
    if (SP.RequestExecutorNotificationPanel.$M) {
        var $v_0 = SP.RequestExecutorNotificationPanel.$M[$p0];

        if (!SP.RequestExecutorUtility.$0($v_0)) {
            SP.RequestExecutorNotificationPanel.$1E($v_0);
        }
    }
};
SP.RequestExecutorNotificationPanel.$1I = function SP_RequestExecutorNotificationPanel$$1I($p0, $p1) {
    if (!SP.RequestExecutorNotificationPanel.$Y) {
        SP.RequestExecutorNotificationPanel.$Y = {};
    }
    SP.RequestExecutorNotificationPanel.$Y[$p0] = $p1;
};
SP.RequestExecutorNotificationPanel.$1q = function SP_RequestExecutorNotificationPanel$$1q($p0) {
    if (!SP.RequestExecutorNotificationPanel.$Y) {
        SP.RequestExecutorNotificationPanel.$Y = {};
    }
    return SP.RequestExecutorNotificationPanel.$Y[$p0];
};
SP.RequestExecutorNotificationPanel.$1t = function SP_RequestExecutorNotificationPanel$$1t() {
    var $v_0 = window.innerWidth;

    if (SP.RequestExecutorUtility.$0($v_0)) {
        $v_0 = document.documentElement.clientWidth;
    }
    if (SP.RequestExecutorUtility.$0($v_0)) {
        $v_0 = document.body.clientWidth;
    }
    return $v_0;
};
SP.RequestExecutorNotificationPanel.$1o = function SP_RequestExecutorNotificationPanel$$1o() {
    var $v_0 = window.pageXOffset;

    if (!SP.RequestExecutorUtility.$0($v_0)) {
        return $v_0;
    }
    if (!SP.RequestExecutorUtility.$0(document.documentElement) && !SP.RequestExecutorUtility.$0(document.documentElement.scrollLeft)) {
        return document.documentElement.scrollLeft;
    }
    return document.body.scrollLeft;
};
SP.RequestExecutorNotificationPanel.$1s = function SP_RequestExecutorNotificationPanel$$1s() {
    var $v_0 = window.pageYOffset;

    if (!SP.RequestExecutorUtility.$0($v_0)) {
        return $v_0;
    }
    if (!SP.RequestExecutorUtility.$0(document.documentElement) && !SP.RequestExecutorUtility.$0(document.documentElement.scrollTop)) {
        return document.documentElement.scrollTop;
    }
    return document.body.scrollTop;
};
SP.RequestExecutorNative = function SP_RequestExecutorNative() {
};
SP.RequestExecutorNative.$$cctor = function SP_RequestExecutorNative$$$cctor() {
    SP.RequestExecutorNative.emptyCallback = function() {
    };
};
SP.RequestExecutorNative.getIFrameOnloadCallback = function SP_RequestExecutorNative$getIFrameOnloadCallback($p0) {
    return function() {
        SP.RequestExecutor.internalProcessIFrameOnload($p0);
    };
};
SP.RequestExecutorNative.getXMLHttpRequestOnreadystatechangeCallback = function SP_RequestExecutorNative$getXMLHttpRequestOnreadystatechangeCallback($p0, $p1, $p2) {
    return function() {
        SP.RequestExecutor.internalProcessXMLHttpRequestOnreadystatechange($p0, $p1, $p2);
    };
};
SP.RequestExecutorNative.getXMLHttpRequestTimeoutCallback = function SP_RequestExecutorNative$getXMLHttpRequestTimeoutCallback($p0, $p1) {
    return function() {
        SP.RequestExecutor.internalProcessXMLHttpRequestTimeoutCallback($p0, $p1);
    };
};
SP.RequestExecutorNative.getIFrameRequestTimeoutCallback = function SP_RequestExecutorNative$getIFrameRequestTimeoutCallback($p0) {
    return function() {
        SP.RequestExecutor.internalProcessIFrameRequestTimeoutCallback($p0);
    };
};
SP.RequestExecutorNative.getProxyWebRequestExecutorSuccessCallback = function SP_RequestExecutorNative$getProxyWebRequestExecutorSuccessCallback($p0) {
    return function($p1_0) {
        SP.ProxyWebRequestExecutorInternal.processSuccessCallback($p0, $p1_0);
    };
};
SP.RequestExecutorNative.getProxyWebRequestExecutorErrorCallback = function SP_RequestExecutorNative$getProxyWebRequestExecutorErrorCallback($p0) {
    return function($p1_0, $p1_1, $p1_2) {
        SP.ProxyWebRequestExecutorInternal.processErrorCallback($p0, $p1_0, $p1_1, $p1_2);
    };
};
SP.RequestExecutorNative.trim = function SP_RequestExecutorNative$trim($p0) {
    return $p0.replace(new RegExp('^\\s+|\\s+$', 'g'), '');
};
SP.RequestExecutorResources = function SP_RequestExecutorResources() {
};
SP.RequestExecutorResources.getString = function SP_RequestExecutorResources$getString($p0) {
    var $v_0 = null;
    var $v_1 = (($p0.charAt(0)).toString()).toLowerCase() + $p0.substr(1);
    var $v_2 = ($p0.substr(0, 2)).toLowerCase() + $p0.substr(2);

    if (!SP.RequestExecutorUtility.$0(SP.Res)) {
        $v_0 = SP.Res[$v_1];
        if (SP.RequestExecutorUtility.$2($v_0)) {
            $v_0 = SP.Res[$v_2];
        }
    }
    if (SP.RequestExecutorUtility.$2($v_0) && !SP.RequestExecutorUtility.$0(SP.RuntimeRes)) {
        $v_0 = SP.RuntimeRes[$v_1];
    }
    if (SP.RequestExecutorUtility.$2($v_0)) {
        $v_0 = SP.RequestExecutorRes[$v_1];
    }
    if (SP.RequestExecutorUtility.$2($v_0)) {
        $v_0 = $p0;
    }
    return $v_0;
};
SP.RequestExecutorUtility = function SP_RequestExecutorUtility() {
};
SP.RequestExecutorUtility.$2 = function SP_RequestExecutorUtility$$2($p0) {
    var $v_0 = null;

    return $p0 === $v_0 || typeof $p0 === 'undefined' || !$p0.length;
};
SP.RequestExecutorUtility.$0 = function SP_RequestExecutorUtility$$0($p0) {
    var $v_0 = null;

    return $p0 === $v_0 || typeof $p0 === 'undefined';
};
SP.RequestExecutorUtility.$9 = function SP_RequestExecutorUtility$$9($p0) {
    return typeof $p0 === 'undefined';
};
SP.RequestExecutorUtility.$T = function SP_RequestExecutorUtility$$T($p0) {
    var $p1 = [];

    for (var $$pai_8 = 1; $$pai_8 < arguments.length; ++$$pai_8) {
        $p1[$$pai_8 - 1] = arguments[$$pai_8];
    }
    var $v_0 = '';
    var $v_1 = 0;

    while ($v_1 < $p0.length) {
        var $v_2 = SP.RequestExecutorUtility.$1P($p0, $v_1, '{');

        if ($v_2 < 0) {
            $v_0 = $v_0 + $p0.substr($v_1);
            break;
        }
        else {
            var $v_3 = SP.RequestExecutorUtility.$1P($p0, $v_2, '}');

            if ($v_3 > $v_2) {
                $v_0 = $v_0 + $p0.substr($v_1, $v_2 - $v_1);
                var $v_4 = $p0.substr($v_2 + 1, $v_3 - $v_2 - 1);
                var $v_5 = parseInt($v_4);

                $v_0 = $v_0 + $p1[$v_5];
                $v_1 = $v_3 + 1;
            }
            else {
                throw SP.RequestExecutorUtility.$11();
            }
        }
    }
    return $v_0;
};
SP.RequestExecutorUtility.$1P = function SP_RequestExecutorUtility$$1P($p0, $p1, $p2) {
    var $v_0 = $p0.indexOf($p2, $p1);

    while ($v_0 >= 0 && $v_0 < $p0.length - 1 && $p0.charAt($v_0 + 1) === $p2) {
        $p1 = $v_0 + 2;
        $v_0 = $p0.indexOf($p2, $p1);
    }
    return $v_0;
};
SP.RequestExecutorUtility.$G = function SP_RequestExecutorUtility$$G($p0) {
    var $v_0;

    $v_0 = $p0.indexOf('#');
    if ($v_0 >= 0) {
        throw SP.RequestExecutorUtility.$S(SP.RequestExecutorUtility.$T(SP.RequestExecutorResources.getString('RE_InvalidArgumentOrField'), 'url'), SP.RequestExecutorExceptions.invalidArgumentOrField);
    }
    $v_0 = $p0.indexOf('?');
    if ($v_0 < 0) {
        $p0 = $p0 + '?';
    }
    else {
        if ($p0.charAt($p0.length - 1) !== '&') {
            $p0 = $p0 + '&';
        }
    }
    return $p0;
};
SP.RequestExecutorUtility.$X = function SP_RequestExecutorUtility$$X($p0, $p1) {
    if (!SP.RequestExecutorUtility.$1T($p0)) {
        throw SP.RequestExecutorUtility.$J($p1);
    }
};
SP.RequestExecutorUtility.$1T = function SP_RequestExecutorUtility$$1T($p0) {
    return ($p0.substr(0, 8)).toLowerCase() === 'https://' || ($p0.substr(0, 7)).toLowerCase() === 'http://';
};
SP.RequestExecutorUtility.$6 = function SP_RequestExecutorUtility$$6($p0, $p1, $p2, $p3) {
    if ($p3) {
        if (SP.RequestExecutorUtility.$0($p0) || typeof $p0 !== $p2) {
            throw SP.RequestExecutorUtility.$S(SP.RequestExecutorUtility.$T(SP.RequestExecutorResources.getString('RE_InvalidArgumentOrField'), $p1), SP.RequestExecutorExceptions.invalidArgumentOrField);
        }
    }
    else {
        if (!SP.RequestExecutorUtility.$0($p0) && typeof $p0 !== $p2) {
            throw SP.RequestExecutorUtility.$S(SP.RequestExecutorUtility.$T(SP.RequestExecutorResources.getString('RE_InvalidArgumentOrField'), $p1), SP.RequestExecutorExceptions.invalidArgumentOrField);
        }
    }
};
SP.RequestExecutorUtility.$S = function SP_RequestExecutorUtility$$S($p0, $p1) {
    var $v_0 = new Error($p0);

    $v_0.message = $p0;
    $v_0.errorCode = $p1;
    return $v_0;
};
SP.RequestExecutorUtility.$J = function SP_RequestExecutorUtility$$J($p0) {
    var $v_0 = SP.RequestExecutorUtility.$T(SP.RequestExecutorResources.getString('RE_InvalidArgumentOrField'), $p0);

    return SP.RequestExecutorUtility.$S($v_0, SP.RequestExecutorExceptions.invalidArgumentOrField);
};
SP.RequestExecutorUtility.$11 = function SP_RequestExecutorUtility$$11() {
    var $v_0 = SP.RequestExecutorResources.getString('RE_InvalidOperation');

    return SP.RequestExecutorUtility.$S($v_0, SP.RequestExecutorExceptions.invalidOperation);
};
SP.RequestExecutorUtility.$10 = function SP_RequestExecutorUtility$$10() {
    var $v_0 = SP.RequestExecutorResources.getString('RE_BrowserNotSupported');

    return SP.RequestExecutorUtility.$S($v_0, SP.RequestExecutorExceptions.browserNotSupported);
};
SP.RequestExecutorUtility.$12 = function SP_RequestExecutorUtility$$12() {
    var $v_0 = SP.RequestExecutorResources.getString('RE_BrowserBinaryDataNotSupported');

    return SP.RequestExecutorUtility.$S($v_0, SP.RequestExecutorExceptions.browserNotSupported);
};
SP.RequestExecutorUtility.$g = function SP_RequestExecutorUtility$$g($p0) {
    return SP.RequestExecutorHttpUtility.$R($p0, true, true);
};
SP.RequestExecutorUtility.$i = function SP_RequestExecutorUtility$$i($p0) {
    $p0 = $p0.replace(new RegExp('&', 'g'), '&amp;');
    $p0 = $p0.replace(new RegExp('\"', 'g'), '&quot;');
    $p0 = $p0.replace(new RegExp('\'', 'g'), '&#39;');
    $p0 = $p0.replace(new RegExp('<', 'g'), '&lt;');
    $p0 = $p0.replace(new RegExp('>', 'g'), '&gt;');
    return $p0;
};
SP.RequestExecutorUtility.$1R = function SP_RequestExecutorUtility$$1R($p0, $p1) {
    if (!$p0) {
        return null;
    }
    if (!$p1) {
        return null;
    }
    $p1 = $p1.toLowerCase();
    var $$dict_2 = $p0;

    for (var $$key_3 in $$dict_2) {
        var $v_0 = {
            key: $$key_3,
            value: $$dict_2[$$key_3]
        };

        if (!SP.RequestExecutorUtility.$2($v_0.key) && $v_0.key.toLowerCase() === $p1) {
            return $v_0.value;
        }
    }
    return null;
};
SP.RequestExecutorUtility.$17 = function SP_RequestExecutorUtility$$17($p0, $p1) {
    return SP.RequestExecutorUtility.$2($p0) && SP.RequestExecutorUtility.$2($p1);
};
SP.RequestExecutorRes = function SP_RequestExecutorRes() {
};
SP.RequestExecutorHttpUtility = function SP_RequestExecutorHttpUtility() {
};
SP.RequestExecutorHttpUtility.$R = function SP_RequestExecutorHttpUtility$$R($p0, $p1, $p2) {
    var $v_0 = '';
    var $v_1;
    var $v_2 = 0;
    var $v_3 = ' \"%<>\'&';
    var $v_4 = null;

    if ($p0 === $v_4 || typeof $p0 === 'undefined' || !$p0.length) {
        return '';
    }
    for ($v_2 = 0; $v_2 < $p0.length; $v_2++) {
        var $v_5 = $p0.charCodeAt($v_2);
        var $v_6 = $p0.charAt($v_2);

        if ($p1 && ($v_6 === '#' || $v_6 === '?')) {
            $v_0 += $p0.substr($v_2);
            break;
        }
        if ($v_5 <= 127) {
            if ($p2) {
                $v_0 += $v_6;
            }
            else {
                if ($v_5 >= 97 && $v_5 <= 122 || $v_5 >= 65 && $v_5 <= 90 || $v_5 >= 48 && $v_5 <= 57 || $v_5 >= 32 && $v_5 <= 95 && $v_3.indexOf($v_6) < 0) {
                    $v_0 += $v_6;
                }
                else if ($v_5 <= 15) {
                    $v_0 += '%0' + ($v_5.toString(16)).toUpperCase();
                }
                else if ($v_5 <= 127) {
                    $v_0 += '%' + ($v_5.toString(16)).toUpperCase();
                }
            }
        }
        else if ($v_5 <= 2047) {
            $v_1 = 192 | $v_5 >> 6;
            $v_0 += '%' + ($v_1.toString(16)).toUpperCase();
            $v_1 = 128 | $v_5 & 63;
            $v_0 += '%' + ($v_1.toString(16)).toUpperCase();
        }
        else if (($v_5 & 64512) !== 55296) {
            $v_1 = 224 | $v_5 >> 12;
            $v_0 += '%' + ($v_1.toString(16)).toUpperCase();
            $v_1 = 128 | ($v_5 & 4032) >> 6;
            $v_0 += '%' + ($v_1.toString(16)).toUpperCase();
            $v_1 = 128 | $v_5 & 63;
            $v_0 += '%' + ($v_1.toString(16)).toUpperCase();
        }
        else if ($v_2 < $p0.length - 1) {
            $v_5 = ($v_5 & 1023) << 10;
            $v_2++;
            var $v_7 = $p0.charCodeAt($v_2);

            $v_5 |= $v_7 & 1023;
            $v_5 += 65536;
            $v_1 = 240 | $v_5 >> 18;
            $v_0 += '%' + ($v_1.toString(16)).toUpperCase();
            $v_1 = 128 | ($v_5 & 258048) >> 12;
            $v_0 += '%' + ($v_1.toString(16)).toUpperCase();
            $v_1 = 128 | ($v_5 & 4032) >> 6;
            $v_0 += '%' + ($v_1.toString(16)).toUpperCase();
            $v_1 = 128 | $v_5 & 63;
            $v_0 += '%' + ($v_1.toString(16)).toUpperCase();
        }
    }
    return $v_0;
};
if (SP.PostMessageRequestInfo.registerClass)
    SP.PostMessageRequestInfo.registerClass('SP.PostMessageRequestInfo');
if (SP.PostMessageResponseInfo.registerClass)
    SP.PostMessageResponseInfo.registerClass('SP.PostMessageResponseInfo');
if (SP.RequestInfo.registerClass)
    SP.RequestInfo.registerClass('SP.RequestInfo');
if (SP.AppWebProxyRequestInfo.registerClass)
    SP.AppWebProxyRequestInfo.registerClass('SP.AppWebProxyRequestInfo');
if (SP.ResponseInfo.registerClass)
    SP.ResponseInfo.registerClass('SP.ResponseInfo');
if (SP.RequestExecutorOptions.registerClass)
    SP.RequestExecutorOptions.registerClass('SP.RequestExecutorOptions');
if (SP.RequestExecutorMessageProcessorFormDigestInfo.registerClass)
    SP.RequestExecutorMessageProcessorFormDigestInfo.registerClass('SP.RequestExecutorMessageProcessorFormDigestInfo');
if (SP.RequestExecutorMessageProcessorInitInfo.registerClass)
    SP.RequestExecutorMessageProcessorInitInfo.registerClass('SP.RequestExecutorMessageProcessorInitInfo');
if (SP.PostMessageCommands.registerClass)
    SP.PostMessageCommands.registerClass('SP.PostMessageCommands');
if (SP.ProxyWebRequestExecutorInternal.registerClass)
    SP.ProxyWebRequestExecutorInternal.registerClass('SP.ProxyWebRequestExecutorInternal');
if (SP.ProxyWebRequestExecutor.registerClass)
    SP.ProxyWebRequestExecutor.registerClass('SP.ProxyWebRequestExecutor', Sys.Net.WebRequestExecutor);
if (SP.ProxyWebRequestExecutorFactory.registerClass)
    SP.ProxyWebRequestExecutorFactory.registerClass('SP.ProxyWebRequestExecutorFactory');
if (SP.RequestExecutor.registerClass)
    SP.RequestExecutor.registerClass('SP.RequestExecutor');
if (SP.RequestExecutorXHR.registerClass)
    SP.RequestExecutorXHR.registerClass('SP.RequestExecutorXHR');
if (SP.RequestExecutorErrors.registerClass)
    SP.RequestExecutorErrors.registerClass('SP.RequestExecutorErrors');
if (SP.RequestExecutorExceptions.registerClass)
    SP.RequestExecutorExceptions.registerClass('SP.RequestExecutorExceptions');
if (SP.RequestExecutorInternalSharedUtility.registerClass)
    SP.RequestExecutorInternalSharedUtility.registerClass('SP.RequestExecutorInternalSharedUtility');
if (SP.RequestExecutorMessageProcessor.registerClass)
    SP.RequestExecutorMessageProcessor.registerClass('SP.RequestExecutorMessageProcessor');
if (SP.RequestExecutorNotificationPanel.registerClass)
    SP.RequestExecutorNotificationPanel.registerClass('SP.RequestExecutorNotificationPanel');
if (SP.RequestExecutorNative.registerClass)
    SP.RequestExecutorNative.registerClass('SP.RequestExecutorNative');
if (SP.RequestExecutorResources.registerClass)
    SP.RequestExecutorResources.registerClass('SP.RequestExecutorResources');
if (SP.RequestExecutorUtility.registerClass)
    SP.RequestExecutorUtility.registerClass('SP.RequestExecutorUtility');
if (SP.RequestExecutorRes.registerClass)
    SP.RequestExecutorRes.registerClass('SP.RequestExecutorRes');
if (SP.RequestExecutorHttpUtility.registerClass)
    SP.RequestExecutorHttpUtility.registerClass('SP.RequestExecutorHttpUtility');
function sp_requestexecutor_initialize() {
    SP.PostMessageCommands.ping = 'Ping';
    SP.PostMessageCommands.query = 'Query';
    SP.RequestExecutor.$E = null;
    SP.RequestExecutor.$l = null;
    SP.RequestExecutor.$V = null;
    SP.RequestExecutor.$Q = null;
    SP.RequestExecutor.$N = null;
    SP.RequestExecutor.$I = null;
    SP.RequestExecutor.$B = null;
    SP.RequestExecutor.$a = null;
    SP.RequestExecutor.$P = null;
    SP.RequestExecutor.$H = null;
    SP.RequestExecutor.$4 = null;
    SP.RequestExecutor.$m = 0;
    SP.RequestExecutor.$W = false;
    SP.RequestExecutor.logCallback = null;
    SP.RequestExecutor.$k = null;
    SP.RequestExecutor.$d = null;
    SP.RequestExecutor.$1H = false;
    SP.RequestExecutor.$f = null;
    SP.RequestExecutor.$e = null;
    SP.RequestExecutorXHR.UNSENT = 0;
    SP.RequestExecutorXHR.OPENED = 1;
    SP.RequestExecutorXHR.DONE = 4;
    SP.RequestExecutorErrors.requestAbortedOrTimedout = -1001;
    SP.RequestExecutorErrors.unexpectedResponse = -1002;
    SP.RequestExecutorErrors.httpError = -1002;
    SP.RequestExecutorErrors.noAppWeb = -1003;
    SP.RequestExecutorErrors.domainDoesNotMatch = -1004;
    SP.RequestExecutorErrors.noTrustedOrigins = -1005;
    SP.RequestExecutorErrors.iFrameLoadError = -1006;
    SP.RequestExecutorErrors.proxyPageLoadError = -1007;
    SP.RequestExecutorErrors.anonymousRequest = -1008;
    SP.RequestExecutorExceptions.invalidArgumentOrField = -2001;
    SP.RequestExecutorExceptions.invalidOperation = -2002;
    SP.RequestExecutorExceptions.browserNotSupported = -2003;
    SP.RequestExecutorInternalSharedUtility.$j = 'SP.RequestExecutor';
    SP.RequestExecutorMessageProcessor.$Z = null;
    SP.RequestExecutorMessageProcessor.$C = null;
    SP.RequestExecutorMessageProcessor.$W = false;
    SP.RequestExecutorNotificationPanel.$M = null;
    SP.RequestExecutorNotificationPanel.$1G = 0;
    SP.RequestExecutorNotificationPanel.$Y = null;
    SP.RequestExecutorNotificationPanel.$1a = false;
    SP.RequestExecutorNative.emptyCallback = null;
    SP.RequestExecutorNative.$$cctor();
    SP.RequestExecutorRes.rE_NoTrustedOrigins = 'There is no trusted URLs configured for the app deployment.';
    SP.RequestExecutorRes.rE_InvalidOperation = 'Invalid operation.';
    SP.RequestExecutorRes.rE_CannotAccessSiteOpenWindowFailed = 'This page cannot open a window to access the web site \"{0}\" or it cannot reference the opened window. Please browse to that web site, and then browse to this page again.';
    SP.RequestExecutorRes.rE_OpenWindowButtonText = 'Fix It';
    SP.RequestExecutorRes.rE_BrowserNotSupported = 'The required functionalities are not supported by your browser. Please make sure you are using IE 8 or above, or other modern browser. Please make sure the \'X-UA-Compatible\' meta tag is set to be \'IE=8\' or above.';
    SP.RequestExecutorRes.rE_RequestUnexpectedResponseWithContentTypeAndStatus = 'Unexpected response from the server. The content type of the response is \"{0}\". The status code is \"{1}\".';
    SP.RequestExecutorRes.rE_InvalidArgumentOrField = 'Invalid field or parameter {0}.';
    SP.RequestExecutorRes.rE_OpenWindowMessage = 'Sorry, we had some trouble accessing your site.';
    SP.RequestExecutorRes.rE_CannotAccessSite = 'This page cannot access the web site \"{0}\". Please browse to that web site, and then browse to this page again.';
    SP.RequestExecutorRes.rE_RequestAbortedOrTimedout = 'The request was aborted or timed out.';
    SP.RequestExecutorRes.rE_DismissOpenWindowMessageLinkText = 'Dismiss';
    SP.RequestExecutorRes.rE_BrowserBinaryDataNotSupported = 'Your browser doesn\'t support some HTML5 features like the File API operations. Please use a browser that does support these features.';
    SP.RequestExecutorRes.rE_CannotAccessSiteCancelled = 'This page cannot access the web site \"{0}\". The login is cancelled or timed out. Please browse to that web site, and then browse to this page again.';
    SP.RequestExecutorRes.rE_FixitHelpMessage = 'If the \"Fix it\" button doesn\'t solve the issue, {0}click here for more information{1}.';
    SP.RequestExecutorRes.rE_RequestUnexpectedResponse = 'Unexpected response from server.';
    SP.RequestExecutorRes.rE_DomainDoesNotMatch = 'Your domain doesn\'t match the expected domain for this app deployment.';
}
;
sp_requestexecutor_initialize();
function sp_requestexecutor_attachloadevent() {
    if (window.document.addEventListener) {
        window.addEventListener("load", SP.RequestExecutor.internalProcessWindowLoad, false);
    }
    else if (window.document.attachEvent) {
        window.attachEvent("onload", SP.RequestExecutor.internalProcessWindowLoad);
    }
}
sp_requestexecutor_attachloadevent();
function sp_requestexecutor_initialize2() {
    sp_requestexecutor_initialize();
    sp_requestexecutor_attachloadevent();
}
if (typeof RegisterModuleInit == "function") {
    RegisterModuleInit("sp.requestexecutor.js", sp_requestexecutor_initialize2);
}
if (typeof Sys != "undefined" && Sys && Sys.Application) {
    Sys.Application.notifyScriptLoaded();
}
if (typeof NotifyScriptLoadedAndExecuteWaitingJobs == "function") {
    NotifyScriptLoadedAndExecuteWaitingJobs("sp.requestexecutor.js");
}
if (typeof spWriteProfilerMark == 'function')
    spWriteProfilerMark("perfMarkEnd_" + "sp.requestexecutor.js");
