package com.luzdiaria.versiculos;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.Calendar;

/**
 * Plugin Capacitor para agendar o versículo diário com AlarmManager
 * e iniciar o Foreground Service que mantém o app vivo em segundo plano.
 */
@CapacitorPlugin(name = "VerseAlarm")
public class VerseAlarmPlugin extends Plugin {

    private static final String ACTION_START_SERVICE = "com.luzdiaria.versiculos.START_SERVICE";

    // 1. Inicia o serviço em primeiro plano (notificação persistente na barra).
    //    Enquanto esse serviço roda, o Android NÃO mata o app em background.
    @PluginMethod
    public void startForegroundService(PluginCall call) {
        try {
            Context ctx = getContext();
            Intent intent = new Intent(ctx, VerseForegroundService.class);
            intent.setAction(ACTION_START_SERVICE);

            // Aceita o versículo atual para exibir na notificação fixa
            String verseText = call.getString("verseText", "");
            String verseRef = call.getString("verseRef", "");
            if (verseText != null && !verseText.isEmpty()) {
                intent.putExtra("verseText", verseText);
            }
            if (verseRef != null && !verseRef.isEmpty()) {
                intent.putExtra("verseRef", verseRef);
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                ctx.startForegroundService(intent);
            } else {
                ctx.startService(intent);
            }
            call.resolve();
        } catch (Exception e) {
            call.reject("Falha ao iniciar serviço", e);
        }
    }

    // 2. Para o serviço em primeiro plano.
    @PluginMethod
    public void stopForegroundService(PluginCall call) {
        try {
            Context ctx = getContext();
            ctx.stopService(new Intent(ctx, VerseForegroundService.class));
            call.resolve();
        } catch (Exception e) {
            call.reject("Falha ao parar serviço", e);
        }
    }

    // 3. Agenda o alarme do versículo com intervalo configurado.
    //    intervalMinutes: 1, 5, 15, 30, 60... 1440 = diário.
    //    Ex: scheduleDailyAlarm(8, 30, 60, "João 3:16", "Porque Deus amou...")
    @PluginMethod
    public void scheduleDailyAlarm(PluginCall call) {
        int hour = call.getInt("hour", 8);
        int minute = call.getInt("minute", 0);
        int intervalMinutes = call.getInt("intervalMinutes", 1440);
        String verseText = call.getString("verseText", "");
        String verseRef = call.getString("verseRef", "");
        boolean vibrate = call.getBoolean("vibrate", false);
        boolean flashLed = call.getBoolean("flashLed", false);
        boolean wakeDevice = call.getBoolean("wakeDevice", false);

        try {
            Context ctx = getContext();
            AlarmManager am = (AlarmManager) ctx.getSystemService(Context.ALARM_SERVICE);
            if (am == null) {
                call.reject("AlarmManager indisponível");
                return;
            }

            // Guarda o intervalo e as opções para o receiver reagendar/executar
            ctx.getSharedPreferences("luzdiaria_alarm", Context.MODE_PRIVATE)
                .edit()
                .putInt("intervalMinutes", intervalMinutes)
                .putString("verseText", verseText)
                .putString("verseRef", verseRef)
                .putBoolean("vibrate", vibrate)
                .putBoolean("flashLed", flashLed)
                .putBoolean("wakeDevice", wakeDevice)
                .putInt("startHour", hour)
                .putInt("startMinute", minute)
                .putInt("endHour", call.getInt("endHour", 22))
                .putInt("endMinute", call.getInt("endMinute", 0))
                .apply();

            // Calcula o próximo horário (agora + intervalo, ou diário no horário fixo)
            Calendar cal = Calendar.getInstance();
            if (intervalMinutes == 1440) {
                // Diário: dispara no horário configurado
                cal.set(Calendar.HOUR_OF_DAY, hour);
                cal.set(Calendar.MINUTE, minute);
                cal.set(Calendar.SECOND, 0);
                cal.set(Calendar.MILLISECOND, 0);
                if (cal.getTimeInMillis() <= System.currentTimeMillis()) {
                    cal.add(Calendar.DAY_OF_YEAR, 1);
                }
            } else {
                // Intervalo curto: dispara daqui a X minutos (teste rápido)
                cal.add(Calendar.MINUTE, intervalMinutes);
            }

            Intent intent = new Intent(ctx, VerseAlarmReceiver.class);
            intent.putExtra("verseText", verseText);
            intent.putExtra("verseRef", verseRef);
            intent.setAction("com.luzdiaria.versiculos.DAILY_VERSE_ALARM");

            PendingIntent pi = PendingIntent.getBroadcast(
                ctx,
                1001,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );

            // Alarme exato (desperta mesmo em Doze) — precisa de SCHEDULE_EXACT_ALARM
            boolean exactOk = true;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                exactOk = am.canScheduleExactAlarms();
            }

            if (exactOk) {
                am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, cal.getTimeInMillis(), pi);
            } else {
                // Fallback: alarme inexato (pode atrasar alguns minutos em Doze)
                am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, cal.getTimeInMillis(), pi);
            }

            JSObject result = new JSObject();
            result.put("scheduled", true);
            result.put("nextFire", cal.getTimeInMillis());
            result.put("exact", exactOk);
            result.put("intervalMinutes", intervalMinutes);
            call.resolve(result);
        } catch (Exception e) {
            call.reject("Falha ao agendar alarme", e);
        }
    }

    // 5. Salva o versículo atual e ATUALIZA todos os widgets da tela inicial.
    //    Chamado pelo app sempre que o versículo/frase muda.
    @PluginMethod
    public void updateWidgetVerse(PluginCall call) {
        try {
            Context ctx = getContext();
            String verseText = call.getString("verseText", "");
            String verseRef = call.getString("verseRef", "");

            // Salva o versículo atual nas preferências (o widget lê daqui)
            VerseWidgetProvider.saveVerse(ctx, verseText, verseRef);

            // Força a atualização de TODOS os widgets instalados na tela inicial
            android.appwidget.AppWidgetManager mgr =
                android.appwidget.AppWidgetManager.getInstance(ctx);
            int[] ids = mgr.getAppWidgetIds(
                new android.content.ComponentName(ctx, VerseWidgetProvider.class)
            );
            for (int id : ids) {
                VerseWidgetProvider provider = new VerseWidgetProvider();
                provider.updateWidgetPublic(ctx, mgr, id);
            }

            JSObject result = new JSObject();
            result.put("updated", ids.length);
            call.resolve(result);
        } catch (Exception e) {
            call.reject("Falha ao atualizar widget", e);
        }
    }

    // 4. Cancela o alarme diário.
    @PluginMethod
    public void cancelDailyAlarm(PluginCall call) {
        try {
            Context ctx = getContext();
            AlarmManager am = (AlarmManager) ctx.getSystemService(Context.ALARM_SERVICE);
            if (am == null) {
                call.resolve();
                return;
            }
            Intent intent = new Intent(ctx, VerseAlarmReceiver.class);
            intent.setAction("com.luzdiaria.versiculos.DAILY_VERSE_ALARM");
            PendingIntent pi = PendingIntent.getBroadcast(
                ctx,
                1001,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );
            am.cancel(pi);
            call.resolve();
        } catch (Exception e) {
            call.reject("Falha ao cancelar alarme", e);
        }
    }
}
