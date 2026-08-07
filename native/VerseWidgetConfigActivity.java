package com.luzdiaria.versiculos;

import android.app.Activity;
import android.appwidget.AppWidgetManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

/**
 * Tela de configuração do widget — abre quando o usuário adiciona o widget
 * na tela inicial. Personaliza: mostrar ícone, cor do texto, tamanho do texto,
 * cor de fundo.
 */
public class VerseWidgetConfigActivity extends Activity {

    private int widgetId = AppWidgetManager.INVALID_APPWIDGET_ID;
    private CheckBox chkIcon;
    private EditText edtSize;
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

        setResult(RESULT_CANCELED, intent); // padrão: cancelado até salvar

        buildUi();
    }

    private void buildUi() {
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setPadding(dp(24), dp(24), dp(24), dp(24));
        root.setBackgroundColor(Color.parseColor("#0F172A"));

        TextView title = new TextView(this);
        title.setText("Personalizar Widget");
        title.setTextColor(Color.parseColor("#FBBF24"));
        title.setTextSize(20);
        title.setGravity(Gravity.CENTER);
        title.setPadding(0, 0, 0, dp(20));
        root.addView(title);

        // Mostrar ícone
        chkIcon = new CheckBox(this);
        chkIcon.setText("Mostrar ícone");
        chkIcon.setTextColor(Color.WHITE);
        chkIcon.setChecked(true);
        root.addView(chkIcon);

        // Tamanho do texto
        TextView lblSize = new TextView(this);
        lblSize.setText("Tamanho do texto (ex: 14)");
        lblSize.setTextColor(Color.WHITE);
        lblSize.setPadding(0, dp(12), 0, dp(4));
        root.addView(lblSize);

        edtSize = new EditText(this);
        edtSize.setText("14");
        edtSize.setTextColor(Color.WHITE);
        edtSize.setHintTextColor(Color.GRAY);
        root.addView(edtSize);

        // Cor do texto
        Button btnColor = new Button(this);
        btnColor.setText("Cor do texto");
        btnColor.setAllCaps(false);
        btnColor.setTextColor(Color.WHITE);
        btnColor.setBackgroundColor(Color.parseColor("#EA580C"));
        btnColor.setPadding(0, dp(10), 0, dp(10));
        btnColor.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Ciclo simples de cores: branco -> âmbar -> azul claro -> preto
                if (selectedTextColor == Color.WHITE) {
                    selectedTextColor = Color.parseColor("#FBBF24");
                } else if (selectedTextColor == Color.parseColor("#FBBF24")) {
                    selectedTextColor = Color.parseColor("#93C5FD");
                } else if (selectedTextColor == Color.parseColor("#93C5FD")) {
                    selectedTextColor = Color.BLACK;
                } else {
                    selectedTextColor = Color.WHITE;
                }
            }
        });
        root.addView(btnColor);

        // Cor de fundo
        Button btnBg = new Button(this);
        btnBg.setText("Cor de fundo");
        btnBg.setAllCaps(false);
        btnBg.setTextColor(Color.WHITE);
        btnBg.setBackgroundColor(Color.parseColor("#334155"));
        btnBg.setPadding(0, dp(10), 0, dp(10));
        btnBg.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (selectedBgColor == 0xE60F172A) {
                    selectedBgColor = 0xE6334000;
                } else if (selectedBgColor == 0xE6334000) {
                    selectedBgColor = 0xE60F172A;
                }
            }
        });
        root.addView(btnBg);

        // Espaço
        root.addView(spacer(dp(20)));

        // Botão Concluído
        Button btnDone = new Button(this);
        btnDone.setText("Concluído");
        btnDone.setAllCaps(false);
        btnDone.setTextColor(Color.WHITE);
        btnDone.setTextSize(16);
        btnDone.setBackgroundColor(Color.parseColor("#EA580C"));
        btnDone.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                saveAndFinish();
            }
        });
        root.addView(btnDone);

        setContentView(root);
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

        AppWidgetManager mgr = AppWidgetManager.getInstance(this);
        VerseWidgetProvider provider = new VerseWidgetProvider();
        provider.updateWidgetPublic(this, mgr, widgetId);

        Intent result = new Intent();
        result.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, widgetId);
        setResult(RESULT_OK, result);
        finish();
    }

    private int dp(int v) {
        return Math.round(v * getResources().getDisplayMetrics().density);
    }

    private View spacer(int h) {
        View v = new View(this);
        v.setLayoutParams(new LinearLayout.LayoutParams(1, h));
        return v;
    }
}
