// Layer 1: Flutter TLS (your existing patch)
// Run this script alongside your disable-flutter-tls-v1.js, or merge them

// Layer 2: Java SSL
Java.perform(function() {
    console.log("[*] Java SSL bypass starting...");
    
    // Hook X509TrustManager
    var X509TrustManager = Java.use('javax.net.ssl.X509TrustManager');
    var TrustManager = Java.registerClass({
        name: 'com.burp.bypass.TrustManager',
        implements: [X509TrustManager],
        methods: {
            checkClientTrusted: function(chain, authType) {},
            checkServerTrusted: function(chain, authType) {},
            getAcceptedIssuers: function() { return []; }
        }
    });
    
    var SSLContext = Java.use('javax.net.ssl.SSLContext');
    SSLContext.init.overload(
        '[Ljavax.net.ssl.KeyManager;', 
        '[Ljavax.net.ssl.TrustManager;', 
        'java.security.SecureRandom'
    ).implementation = function(km, tm, random) {
        console.log("[+] SSLContext.init() hooked");
        this.init(km, [TrustManager.$new()], random);
    };
    
    // Hook HostnameVerifier
    var HostnameVerifier = Java.use('javax.net.ssl.HostnameVerifier');
    var BypassVerifier = Java.registerClass({
        name: 'com.burp.bypass.Verifier',
        implements: [HostnameVerifier],
        methods: {
            verify: function(hostname, session) {
                console.log("[+] HostnameVerifier: " + hostname);
                return true;
            }
        }
    });
    
    // Hook WebView SSL
    var WebViewClient = Java.use('android.webkit.WebViewClient');
    WebViewClient.onReceivedSslError.implementation = function(view, handler, error) {
        console.log("[+] WebView SSL error, proceeding...");
        handler.proceed();
    };
    
    // Hook InAppWebView (the specific plugin your app uses)
    try {
        var InAppWebViewClient = Java.use('com.pichillilorenzo.flutter_inappwebview_android.webview.in_app_webview.InAppWebViewClient');
        InAppWebViewClient.onReceivedSslError.implementation = function(view, handler, error) {
            console.log("[+] InAppWebView SSL error, proceeding...");
            handler.proceed();
        };
    } catch(e) {
        console.log("[-] InAppWebView hook failed (may not be loaded yet): " + e);
    }
    
    console.log("[+] Java SSL bypass active");
});

