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
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.TextView;

/**
 * Tela de configuração do widget — abre quando o usuário adiciona o widget
 * na tela inicial. Usa o layout XML (widget_config.xml) com design do app:
 * cards escuros, botões laranja, prévia ao vivo das cores.
 */
public class VerseWidgetConfigActivity extends Activity {

    private int widgetId = AppWidgetManager.INVALID_APPWIDGET_ID;
    private CheckBox chkIcon;
    private EditText edtSize;
    private TextView txtColorPreview;
    private TextView txtBgPreview;
    private int selectedTextColor = Color.WHITE;
    private int selectedBgColor = 0xE61E293B;

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

        // Liga os elementos do layout
        chkIcon = findViewById(R.id.chk_icon);
        edtSize = findViewById(R.id.edt_size);
        txtColorPreview = findViewById(R.id.txt_color_preview);
        txtBgPreview = findViewById(R.id.txt_bg_preview);
        Button btnColor = findViewById(R.id.btn_color);
        Button btnBg = findViewById(R.id.btn_bg);
        Button btnDone = findViewById(R.id.btn_done);
        Button btnCancel = findViewById(R.id.btn_cancel);

        updateColorPreview();
        updateBgPreview();

        btnColor.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                cycleTextColor();
            }
        });

        btnBg.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                cycleBgColor();
            }
        });

        btnDone.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                saveAndFinish();
            }
        });

        btnCancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish(); // RESULT_CANCELED — launcher não adiciona
            }
        });
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
        if (selectedBgColor == 0xE61E293B) {
            selectedBgColor = 0xE6451A03;
        } else if (selectedBgColor == 0xE6451A03) {
            selectedBgColor = 0xE61E293B;
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
            txtBgPreview.setBackgroundResource(
                selectedBgColor == 0xE6451A03 ? R.drawable.widget_bg_gold : R.drawable.widget_bg_dark);
            txtBgPreview.setText("Fundo: " + (selectedBgColor == 0xE6451A03 ? "Dourado" : "Azul noite"));
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
}
