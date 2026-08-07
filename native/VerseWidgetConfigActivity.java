package com.luzdiaria.versiculos;

import android.app.Activity;
import android.appwidget.AppWidgetManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.Typeface;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

/**
 * Tela de configuração do widget — abre quando o usuário adiciona o widget
 * na tela inicial. Personaliza: mostrar ícone, cor do texto, tamanho do texto,
 * cor de fundo. Tela cheia com scroll para garantir que o botão Concluído
 * seja sempre acessível (tela estreita antiga impedia a adição do widget).
 */
public class VerseWidgetConfigActivity extends Activity {

    private int widgetId = AppWidgetManager.INVALID_APPWIDGET_ID;
    private CheckBox chkIcon;
    private EditText edtSize;
    private TextView txtColorPreview;
    private TextView txtBgPreview;
    private int selectedTextColor = Color.WHITE;
    private int selectedBgColor = 0xE60F172A;

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
        // Começa como cancelado; muda para OK quando o usuário salvar.
        setResult(RESULT_CANCELED, intent);

        buildUi();
    }

    private void buildUi() {
        // Root com scroll (garante acesso ao botão Concluído em telas pequenas)
        ScrollView scroll = new ScrollView(this);
        scroll.setFillViewport(true);
        scroll.setBackgroundColor(Color.parseColor("#0F172A"));

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setPadding(dp(24), dp(24), dp(24), dp(32));
        root.setGravity(Gravity.CENTER_HORIZONTAL);
        scroll.addView(root, new ScrollView.LayoutParams(
            ScrollView.LayoutParams.MATCH_PARENT,
            ScrollView.LayoutParams.WRAP_CONTENT
        ));

        // Título
        TextView title = new TextView(this);
        title.setText("⚡ Personalizar Widget");
        title.setTextColor(Color.parseColor("#FBBF24"));
        title.setTextSize(22);
        title.setTypeface(Typeface.DEFAULT_BOLD);
        title.setGravity(Gravity.CENTER);
        title.setPadding(0, 0, 0, dp(8));
        root.addView(title, lpMatchWrap());

        TextView subtitle = new TextView(this);
        subtitle.setText("Configure como o versículo aparece na sua tela inicial");
        subtitle.setTextColor(Color.parseColor("#94A3B8"));
        subtitle.setTextSize(13);
        subtitle.setGravity(Gravity.CENTER);
        subtitle.setPadding(0, 0, 0, dp(24));
        root.addView(subtitle, lpMatchWrap());

        // Mostrar ícone
        chkIcon = new CheckBox(this);
        chkIcon.setText("Mostrar ícone do app");
        chkIcon.setTextColor(Color.WHITE);
        chkIcon.setTextSize(15);
        chkIcon.setChecked(true);
        root.addView(chkIcon, lpMatchWrap());

        // Espaço
        root.addView(spacer(dp(8)));

        // Tamanho do texto
        TextView lblSize = new TextView(this);
        lblSize.setText("Tamanho do texto (10 a 30):");
        lblSize.setTextColor(Color.WHITE);
        lblSize.setTextSize(14);
        lblSize.setPadding(0, dp(12), 0, dp(6));
        root.addView(lblSize, lpMatchWrap());

        edtSize = new EditText(this);
        edtSize.setText("14");
        edtSize.setTextColor(Color.WHITE);
        edtSize.setTextSize(16);
        edtSize.setHintTextColor(Color.GRAY);
        edtSize.setSingleLine(true);
        root.addView(edtSize, lpMatchWrap());

        // Espaço
        root.addView(spacer(dp(16)));

        // Cor do texto
        Button btnColor = new Button(this);
        btnColor.setText("Cor do texto");
        btnColor.setAllCaps(false);
        btnColor.setTextColor(Color.WHITE);
        btnColor.setTextSize(14);
        btnColor.setTypeface(Typeface.DEFAULT_BOLD);
        btnColor.setBackgroundColor(Color.parseColor("#EA580C"));
        btnColor.setPadding(0, dp(14), 0, dp(14));
        btnColor.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                cycleTextColor();
            }
        });
        root.addView(btnColor, lpMatchWrap());

        txtColorPreview = new TextView(this);
        txtColorPreview.setText("Exemplo de texto");
        txtColorPreview.setGravity(Gravity.CENTER);
        txtColorPreview.setTextSize(16);
        txtColorPreview.setTypeface(Typeface.DEFAULT_BOLD);
        txtColorPreview.setPadding(0, dp(8), 0, dp(4));
        updateColorPreview();
        root.addView(txtColorPreview, lpMatchWrap());

        // Espaço
        root.addView(spacer(dp(12)));

        // Cor de fundo
        Button btnBg = new Button(this);
        btnBg.setText("Cor de fundo");
        btnBg.setAllCaps(false);
        btnBg.setTextColor(Color.WHITE);
        btnBg.setTextSize(14);
        btnBg.setTypeface(Typeface.DEFAULT_BOLD);
        btnBg.setBackgroundColor(Color.parseColor("#334155"));
        btnBg.setPadding(0, dp(14), 0, dp(14));
        btnBg.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                cycleBgColor();
            }
        });
        root.addView(btnBg, lpMatchWrap());

        txtBgPreview = new TextView(this);
        txtBgPreview.setText("Fundo do widget");
        txtBgPreview.setGravity(Gravity.CENTER);
        txtBgPreview.setTextSize(13);
        txtBgPreview.setPadding(0, dp(10), 0, dp(4));
        updateBgPreview();
        root.addView(txtBgPreview, lpMatchWrap());

        // Espaço
        root.addView(spacer(dp(24)));

        // Botão Concluído (grande e sempre acessível)
        Button btnDone = new Button(this);
        btnDone.setText("✓ Concluído — Adicionar Widget");
        btnDone.setAllCaps(false);
        btnDone.setTextColor(Color.WHITE);
        btnDone.setTextSize(17);
        btnDone.setTypeface(Typeface.DEFAULT_BOLD);
        btnDone.setBackgroundColor(Color.parseColor("#EA580C"));
        btnDone.setPadding(0, dp(18), 0, dp(18));
        btnDone.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                saveAndFinish();
            }
        });
        root.addView(btnDone, lpMatchWrap());

        // Botão cancelar
        Button btnCancel = new Button(this);
        btnCancel.setText("Cancelar");
        btnCancel.setAllCaps(false);
        btnCancel.setTextColor(Color.parseColor("#CBD5E1"));
        btnCancel.setTextSize(14);
        btnCancel.setBackgroundColor(Color.TRANSPARENT);
        btnCancel.setPadding(0, dp(10), 0, dp(10));
        btnCancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish(); // RESULT_CANCELED — launcher não adiciona
            }
        });
        root.addView(btnCancel, lpMatchWrap());

        setContentView(scroll);
    }

    private void cycleTextColor() {
        if (selectedTextColor == Color.WHITE) {
            selectedTextColor = Color.parseColor("#FBBF24");
        } else if (selectedTextColor == Color.parseColor("#FBBF24")) {
            selectedTextColor = Color.parseColor("#93C5FD");
        } else if (selectedTextColor == Color.parseColor("#93C5FD")) {
            selectedTextColor = Color.BLACK;
        } else {
            selectedTextColor = Color.WHITE;
        }
        updateColorPreview();
    }

    private void cycleBgColor() {
        if (selectedBgColor == 0xE60F172A) {
            selectedBgColor = 0xE6334000;
        } else if (selectedBgColor == 0xE6334000) {
            selectedBgColor = 0xE60F172A;
        }
        updateBgPreview();
    }

    private void updateColorPreview() {
        if (txtColorPreview != null) {
            txtColorPreview.setTextColor(selectedTextColor);
            txtColorPreview.setText("Exemplo de texto (" + colorName(selectedTextColor) + ")");
        }
    }

    private void updateBgPreview() {
        if (txtBgPreview != null) {
            txtBgPreview.setBackgroundColor(selectedBgColor);
            txtBgPreview.setTextColor(selectedBgColor == 0xE6334000 ? Color.WHITE : Color.parseColor("#94A3B8"));
            txtBgPreview.setText("Fundo: " + (selectedBgColor == 0xE6334000 ? "Dourado escuro" : "Azul noite"));
        }
    }

    private String colorName(int c) {
        if (c == Color.WHITE) return "Branco";
        if (c == Color.parseColor("#FBBF24")) return "Âmbar";
        if (c == Color.parseColor("#93C5FD")) return "Azul claro";
        return "Preto";
    }

    private void saveAndFinish() {
        SharedPreferences prefs = getSharedPreferences(VerseWidgetProvider.PREFS_NAME, Context.MODE_PRIVATE);
        float size;
        try {
            size = Float.parseFloat(edtSize.getText().toString());
        } catch (Exception e) {
            size = 14f;
        }
        if (size < 10) size = 10;
        if (size > 30) size = 30;

        prefs.edit()
            .putInt("textColor_" + widgetId, selectedTextColor)
            .putFloat("textSize_" + widgetId, size)
            .putInt("bgColor_" + widgetId, selectedBgColor)
            .putBoolean("showIcon_" + widgetId, chkIcon.isChecked())
            .putString("verse_" + widgetId,
                prefs.getString("lastVerse",
                    "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna."))
            .putString("ref_" + widgetId,
                prefs.getString("lastRef", "João 3:16"))
            .apply();

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

    private int dp(int v) {
        return Math.round(v * getResources().getDisplayMetrics().density);
    }

    private LinearLayout.LayoutParams lpMatchWrap() {
        return new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
    }

    private View spacer(int h) {
        View v = new View(this);
        v.setLayoutParams(new LinearLayout.LayoutParams(1, dp(h)));
        return v;
    }
}
