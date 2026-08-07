package com.luzdiaria.versiculos;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.appcompat.app.AppCompatActivity;

/**
 * MainActivity que carrega o app React (arquivos locais da pasta assets)
 * e injeta a ponte nativa como window.Android.
 *
 * Para o Capacitor, use BridgeActivity (gerenciado pelo CLI) — mas se
 * preferir WebView pura com JavascriptInterface, esta é a estrutura.
 */
public class MainActivity extends AppCompatActivity {

    private WebView webView;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        webView.setWebViewClient(new WebViewClient());

        // ============================================================
        // INJEÇÃO DA PONTE NATIVA:
        // expõe a classe NativeBridge como "Android" no JavaScript,
        // permitindo chamadas do tipo window.Android.requestBatteryOptimization()
        // ============================================================
        webView.addJavascriptInterface(new NativeBridge(this), "Android");

        setContentView(webView);

        // Carrega o app web local (build do Vite copiado para assets)
        webView.loadUrl("file:///android_asset/dist/index.html");
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
