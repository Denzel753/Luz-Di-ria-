package com.luzdiaria.versiculos;

import android.app.Activity;
import android.appwidget.AppWidgetManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.SeekBar;
import android.widget.TextView;

/**
 * Tela de configuração do widget — padrão Fossify Clock (app de relógio
 * de referência): prévia ao vivo no topo + SeekBar de transparência do
 * fundo + alternância de cores + botão OK. Cores do Luz Diária.
 */
public class VerseWidgetConfigActivity extends Activity {

    private int widgetId = AppWidgetManager.INVALID_APPWIDGET_ID;

    // Elementos da prévia ao vivo
    private ImageView previewBackground;
    private TextView previewVerse;
    private TextView previewRef;

    // Elementos de controle
    private ImageView btnBgColor;
    private ImageView btnTextColor;
    private TextView txtTextColor;
    private SeekBar seekBgAlpha;
    private SeekBar seekTextSize;
    private TextView txtSizeLabel;

    // Valores atuais
    private int bgColor = 0xFF1E293B;        // azul noite (sem alpha)
    private int textColor = Color.WHITE;
    private float textSize = 16f;
    private boolean useGoldBg = false;

    // Paletas (nossas cores)
    private static final int[] BG_PALETTE = { 0xFF1E293B, 0xFF451A03 }; // azul noite, dourado
    private static final int[] TEXT_PALETTE = { Color.WHITE, 0xFFFBBF24, 0xFF93C5FD, Color.BLACK };
    private static final String[] TEXT_NAMES = { "Branco", "Âmbar", "Azul claro", "Preto" };
    private int bgIndex = 0;
    private int textIndex = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Intent intent = getIntent();
        Bundle extras = intent.getExtras();
        if (extras != null) {
            widgetId = extras.getInt(AppWidgetManager.EXTRA_APPWIDGET_ID, AppWidgetManager.INVALID_APPWIDGET_ID);
        }
        if (widgetId == AppWidgetManager.INVALID_APPWIDGET_ID) {
            finish();
            return;
        }

        // CRÍTICO: o launcher só adiciona o widget se retornar RESULT_OK com o ID.
        setResult(RESULT_CANCELED, intent);

        setContentView(R.layout.widget_config);

        // Liga os elementos
        previewBackground = findViewById(R.id.preview_background);
        previewVerse = findViewById(R.id.preview_verse);
        previewRef = findViewById(R.id.preview_ref);
        btnBgColor = findViewById(R.id.btn_bg_color);
        btnTextColor = findViewById(R.id.btn_text_color);
        txtTextColor = findViewById(R.id.txt_text_color);
        seekBgAlpha = findViewById(R.id.seek_bg_alpha);
        seekTextSize = findViewById(R.id.seek_text_size);
        txtSizeLabel = findViewById(R.id.txt_size_label);
        Button btnOk = findViewById(R.id.btn_ok);

        // Carrega configuração anterior (se houver) para prévia coerente
        SharedPreferences prefs = getSharedPreferences(VerseWidgetProvider.PREFS_NAME, Context.MODE_MULTI_PROCESS);
        int savedTextColor = prefs.getInt("textColor_" + widgetId, -1);
        int savedBg = prefs.getInt("bgColor_" + widgetId, -1);
        float savedSize = prefs.getFloat("textSize_" + widgetId, 16f);
        if (savedTextColor != -1) textColor = savedTextColor;
        if (savedSize >= 10 && savedSize <= 30) textSize = savedSize;
        if (savedBg != -1) useGoldBg = (savedBg & 0xFFFFFF) == 0x451A03;
        bgIndex = useGoldBg ? 1 : 0;
        bgColor = BG_PALETTE[bgIndex];
        for (int i = 0; i < TEXT_PALETTE.length; i++) {
            if (TEXT_PALETTE[i] == textColor) textIndex = i;
        }

        applyPreview();

        // SeekBar de transparência do fundo (padrão Fossify)
        seekBgAlpha.setProgress(100);
        seekBgAlpha.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override public void onProgressChanged(SeekBar sb, int progress, boolean fromUser) { applyPreview(); }
            @Override public void onStartTrackingTouch(SeekBar sb) {}
            @Override public void onStopTrackingTouch(SeekBar sb) {}
        });

        // SeekBar de tamanho do texto (10-30)
        seekTextSize.setProgress(Math.round(textSize) - 10);
        seekTextSize.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override public void onProgressChanged(SeekBar sb, int progress, boolean fromUser) {
                textSize = 10 + progress;
                txtSizeLabel.setText("Tamanho do texto: " + Math.round(textSize));
                applyPreview();
            }
            @Override public void onStartTrackingTouch(SeekBar sb) {}
            @Override public void onStopTrackingTouch(SeekBar sb) {}
        });

        // Alterna cor de fundo (azul noite ↔ dourado)
        btnBgColor.setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
                bgIndex = (bgIndex + 1) % BG_PALETTE.length;
                bgColor = BG_PALETTE[bgIndex];
                useGoldBg = bgIndex == 1;
                applyPreview();
            }
        });

        // Alterna cor do texto (branco → âmbar → azul claro → preto)
        btnTextColor.setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
                textIndex = (textIndex + 1) % TEXT_PALETTE.length;
                textColor = TEXT_PALETTE[textIndex];
                txtTextColor.setText(TEXT_NAMES[textIndex]);
                applyPreview();
            }
        });

        // OK (padrão Fossify) — salva e retorna RESULT_OK
        btnOk.setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
                saveAndFinish();
            }
        });
    }

    // Aplica os valores atuais na prévia ao vivo (padrão Fossify)
    private void applyPreview() {
        int alpha = (int) (seekBgAlpha.getProgress() / 100f * 255);
        int bgWithAlpha = (alpha << 24) | (bgColor & 0xFFFFFF);

        // Fundo da prévia: cor sólida com alpha (setBackgroundColor com alpha)
        previewBackground.setImageResource(useGoldBg ? R.drawable.widget_bg_gold : R.drawable.widget_bg_dark);
        previewBackground.setImageAlpha(alpha);
        btnBgColor.setImageResource(useGoldBg ? R.drawable.widget_bg_gold : R.drawable.widget_bg_dark);

        previewVerse.setTextColor(textColor);
        previewVerse.setTextSize(textSize);
        previewRef.setTextColor(0xFFFBBF24); // referência sempre âmbar

        // Swatch da cor do texto
        btnTextColor.setBackgroundColor(textColor);
        txtTextColor.setText(TEXT_NAMES[textIndex]);
    }

    private void saveAndFinish() {
        int alpha = (int) (seekBgAlpha.getProgress() / 100f * 255);
        int bgWithAlpha = (alpha << 24) | (bgColor & 0xFFFFFF);

        SharedPreferences prefs = getSharedPreferences(VerseWidgetProvider.PREFS_NAME, Context.MODE_MULTI_PROCESS);
        prefs.edit()
            .putInt("textColor_" + widgetId, textColor)
            .putFloat("textSize_" + widgetId, textSize)
            .putInt("bgColor_" + widgetId, bgWithAlpha)
            .putBoolean("showIcon_" + widgetId, true)
            .putString("verse_" + widgetId,
                prefs.getString("lastVerse",
                    "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna."))
            .putString("ref_" + widgetId,
                prefs.getString("lastRef", "João 3:16"))
            .commit(); // síncrono: o widget (outro processo) lê na hora

        // Atualiza o widget imediatamente
        AppWidgetManager mgr = AppWidgetManager.getInstance(this);
        VerseWidgetProvider provider = new VerseWidgetProvider();
        provider.updateWidgetPublic(this, mgr, widgetId);

        // CRÍTICO: retorna RESULT_OK com o ID para o launcher adicionar o widget
        Intent result = new Intent();
        result.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, widgetId);
        setResult(RESULT_OK, result);
        finish();
    }
}
