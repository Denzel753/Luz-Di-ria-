package com.luzdiaria.versiculos;

import android.app.AlarmManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/**
 * Reagenda o serviço e o alarme em TODOS os eventos do sistema que podem
 * matar alarmes agendados (padrão do AMdroid/AlarmClock):
 * - Boot do celular
 * - Relógio mudado manualmente (ACTION_TIME_CHANGED)
 * - Fuso horário mudado (ACTION_TIMEZONE_CHANGED)
 * - App atualizado/reinstalado (ACTION_MY_PACKAGE_REPLACED) — CRÍTICO:
 *   instalar APK novo por cima mata os alarmes; este receiver os recria.
 * - Permissão de alarme exato concedida depois
 * Sem isso, o alarme morre silenciosamente e só volta ao abrir o app.
 */
public class BootReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent == null) return;
        String action = intent.getAction();
        if (action == null) return;

        boolean needsReschedule =
            Intent.ACTION_BOOT_COMPLETED.equals(action)
            || "android.intent.action.QUICKBOOT_POWERON".equals(action)
            || "com.htc.intent.action.QUICKBOOT_POWERON".equals(action)
            || Intent.ACTION_TIME_CHANGED.equals(action)
            || Intent.ACTION_TIMEZONE_CHANGED.equals(action)
            || Intent.ACTION_LOCALE_CHANGED.equals(action)
            || Intent.ACTION_MY_PACKAGE_REPLACED.equals(action)
            || AlarmManager.ACTION_SCHEDULE_EXACT_ALARM_PERMISSION_STATE_CHANGED.equals(action);

        if (!needsReschedule) return;

        // 1. Reinicia o Foreground Service (mantém o app vivo + notificação fixa)
        try {
            Intent serviceIntent = new Intent(context, VerseForegroundService.class);
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                context.startForegroundService(serviceIntent);
            } else {
                context.startService(serviceIntent);
            }
        } catch (Exception e) {
            // Falha silenciosa
        }

        // 2. Reagenda o alarme do versículo a partir das prefs salvas
        VerseAlarmReceiver.rescheduleFromPrefs(context);
    }
}
