# Universal SSL Bypass Script for Flutter Apps

Two Frida scripts that bypass SSL validation on Flutter apps — covers Flutter's TLS layer and the Java/WebView layer simultaneously.

Full writeup: [I Wasted 3 Days Intercepting a Flutter App. Here's What Actually Works.](https://medium.com/@mdarbazpc/i-wasted-3-days-intercepting-a-flutter-app-heres-what-actually-works-d3e9a4816818)

---

## Usage

```bash
frida -U -f com.your.app.package -l ./disable-flutter-tls-v1.js -l ./universal_bypass.js
```

If the app freezes after launch, type `%resume` in the Frida REPL. Skip it if you attached to an already running process.

---

## What each script does

**disable-flutter-tls-v1.js** — patches `ssl_verify_peer_cert` in Flutter's BoringSSL via byte pattern matching. Supports arm64, arm, x64, x86 on Android and iOS.

**universal_bypass.js** — hooks X509TrustManager, SSLContext.init, HostnameVerifier, WebViewClient, and InAppWebViewClient in the Java layer.

---

For authorized security testing or your own apps only.
