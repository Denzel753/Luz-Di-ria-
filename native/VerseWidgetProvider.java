package com.luzdiaria.versiculos;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.widget.RemoteViews;

import java.util.Calendar;

/**
 * Widget de Tela Inicial "Luz Diária": mostra o Versículo do Dia com
 * personalizações (ícone, cor do texto, tamanho, fundo) configuradas
 * pelo usuário na VerseWidgetConfigActivity.
 *
 * Atualiza o versículo diariamente via AlarmManager (mesmo app fechado).
 */
public class VerseWidgetProvider extends AppWidgetProvider {

    public static final String PREFS_NAME = "luzdiaria_widget";
    public static final String ACTION_UPDATE = "com.luzdiaria.versiculos.WIDGET_UPDATE";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int id : appWidgetIds) {
            updateWidget(context, appWidgetManager, id);
        }
        scheduleDailyRefresh(context);
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);
        if (ACTION_UPDATE.equals(intent.getAction())) {
            AppWidgetManager mgr = AppWidgetManager.getInstance(context);
            int[] ids = mgr.getAppWidgetIds(
                new android.content.ComponentName(context, VerseWidgetProvider.class)
            );
            for (int id : ids) {
                updateWidget(context, mgr, id);
            }
        }
    }

    @Override
    public void onDeleted(Context context, int[] appWidgetIds) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor ed = prefs.edit();
        for (int id : appWidgetIds) {
            ed.remove("textColor_" + id);
            ed.remove("textSize_" + id);
            ed.remove("bgColor_" + id);
            ed.remove("showIcon_" + id);
        }
        ed.apply();
    }

    // Método público para a Configuration Activity atualizar o widget
    public void updateWidgetPublic(Context context, AppWidgetManager mgr, int widgetId) {
        updateWidget(context, mgr, widgetId);
        scheduleDailyRefresh(context);
    }

    private void updateWidget(Context context, AppWidgetManager mgr, int widgetId) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        int textColor = prefs.getInt("textColor_" + widgetId, 0xFFFFFFFF);
        float textSize = prefs.getFloat("textSize_" + widgetId, 14f);
        int bgColor = prefs.getInt("bgColor_" + widgetId, 0xE60F172A);
        boolean showIcon = prefs.getBoolean("showIcon_" + widgetId, true);

        // Versículo do momento: prioriza o último salvo pelo app (lastVerse),
        // que é atualizado a cada versículo novo; fallback para o específico
        // do widget (configuração) e depois texto padrão.
        String lastVerse = prefs.getString("lastVerse", "");
        String lastRef = prefs.getString("lastRef", "");
        String verse = lastVerse.isEmpty()
            ? prefs.getString("verse_" + widgetId,
                "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.")
            : lastVerse;
        String ref = lastRef.isEmpty()
            ? prefs.getString("ref_" + widgetId, "João 3:16")
            : lastRef;

        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_verse);
        views.setTextViewText(R.id.widget_verse_text, "\u201C" + verse + "\u201D");
        views.setTextViewText(R.id.widget_verse_ref, ref);
        views.setTextColor(R.id.widget_verse_text, textColor);
        views.setTextColor(R.id.widget_verse_ref, textColor & 0x99FFFFFF);
        views.setFloat(R.id.widget_verse_text, "setTextSize", textSize);
        // Fundo em card arredondado: dark (azul noite) ou gold (dourado escuro)
        int bgRes = (bgColor == 0xE6334000)
            ? R.drawable.widget_bg_gold
            : R.drawable.widget_bg_dark;
        views.setInt(R.id.widget_root, "setBackgroundResource", bgRes);
        views.setViewVisibility(R.id.widget_icon, showIcon ? android.view.View.VISIBLE : android.view.View.GONE);

        // Toque abre o app
        Intent openApp = new Intent(context, MainActivity.class);
        PendingIntent pi = PendingIntent.getActivity(
            context, widgetId, openApp,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.widget_root, pi);

        mgr.updateAppWidget(widgetId, views);
    }

    // Agenda atualização diária (meia-noite) via AlarmManager
    public static void scheduleDailyRefresh(Context context) {
        AlarmManager am = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (am == null) return;

        Intent intent = new Intent(context, VerseWidgetProvider.class);
        intent.setAction(ACTION_UPDATE);
        PendingIntent pi = PendingIntent.getBroadcast(
            context, 2002, intent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 1);
        cal.set(Calendar.SECOND, 0);
        if (cal.getTimeInMillis() <= System.currentTimeMillis()) {
            cal.add(Calendar.DAY_OF_YEAR, 1);
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            am.setExactAndAllowWhileIdle(AlarmManager.RTC, cal.getTimeInMillis(), pi);
        } else {
            am.set(AlarmManager.RTC, cal.getTimeInMillis(), pi);
        }
    }

    // Salva o versículo atual para o widget (chamado pelo app quando troca o versículo)
    public static void saveVerse(Context context, String verse, String ref) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit().putString("lastVerse", verse).putString("lastRef", ref).apply();
    }
}
