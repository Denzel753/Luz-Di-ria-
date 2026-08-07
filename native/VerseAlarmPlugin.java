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
                .putInt("endHour", call.getInt("endHour", 23))
                .putInt("endMinute", call.getInt("endMinute", 59))
                .apply();

            // Calcula o próximo horário com a MESMA lógica do reagendamento
            // (âncora no INÍCIO da janela — regra do usuário):
            // Ex: janela 08:00-22:00 + 4h → 08:00, 12:00, 16:00, 20:00.
            // Se o próximo slot cair fora da janela, recomeça amanhã no início.
            int endHour = call.getInt("endHour", 23);
            int endMinute = call.getInt("endMinute", 59);
            Calendar cal = Calendar.getInstance();
            if (intervalMinutes == 1440) {
                // Diário: dispara no horário configurado (início da janela)
                cal.set(Calendar.HOUR_OF_DAY, hour);
                cal.set(Calendar.MINUTE, minute);
                cal.set(Calendar.SECOND, 0);
                cal.set(Calendar.MILLISECOND, 0);
                if (cal.getTimeInMillis() <= System.currentTimeMillis()) {
                    cal.add(Calendar.DAY_OF_YEAR, 1);
                }
            } else {
                // Intervalo ANCORADO no início da janela (regra do usuário)
                long intervalMs = intervalMinutes * 60 * 1000L;

                // Âncora: início da janela de hoje
                Calendar anchor = Calendar.getInstance();
                anchor.set(Calendar.HOUR_OF_DAY, hour);
                anchor.set(Calendar.MINUTE, minute);
                anchor.set(Calendar.SECOND, 0);
                anchor.set(Calendar.MILLISECOND, 0);

                // Próximo slot: âncora + k*intervalo (k = próximo inteiro)
                long sinceAnchor = System.currentTimeMillis() - anchor.getTimeInMillis();
                long k = Math.max(0, (long) Math.ceil((double) sinceAnchor / intervalMs));
                cal.setTimeInMillis(anchor.getTimeInMillis() + k * intervalMs);

                // Fim da janela de hoje
                Calendar windowEnd = Calendar.getInstance();
                windowEnd.set(Calendar.HOUR_OF_DAY, endHour);
                windowEnd.set(Calendar.MINUTE, endMinute);
                windowEnd.set(Calendar.SECOND, 59);
                windowEnd.set(Calendar.MILLISECOND, 999);

                // Slot passou do fim da janela → recomeça AMANHÃ no início
                if (cal.getTimeInMillis() > windowEnd.getTimeInMillis()) {
                    cal.add(Calendar.DAY_OF_YEAR, 1);
                    cal.set(Calendar.HOUR_OF_DAY, hour);
                    cal.set(Calendar.MINUTE, minute);
                    cal.set(Calendar.SECOND, 0);
                    cal.set(Calendar.MILLISECOND, 0);
                }
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

            // ESTRATÉGIA AMdroid: setAlarmClock (alarme de relógio) — MESMA
            // do reagendamento. NÃO exige permissão SCHEDULE_EXACT_ALARM,
            // sobrevive ao Doze e aparece no painel do sistema.
            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    Intent showIntent = new Intent(ctx, MainActivity.class);
                    showIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
                    PendingIntent showPi = PendingIntent.getActivity(
                        ctx,
                        9001,
                        showIntent,
                        PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
                    );
                    AlarmManager.AlarmClockInfo clockInfo =
                        new AlarmManager.AlarmClockInfo(cal.getTimeInMillis(), showPi);
                    am.setAlarmClock(clockInfo, pi);
                } else {
                    am.setExact(AlarmManager.RTC_WAKEUP, cal.getTimeInMillis(), pi);
                }
            } catch (Exception e) {
                // Fallback: agendamento exato normal (requer permissão)
                boolean exactOk = true;
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                    exactOk = am.canScheduleExactAlarms();
                }
                if (exactOk) {
                    am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, cal.getTimeInMillis(), pi);
                } else {
                    am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, cal.getTimeInMillis(), pi);
                }
            }

            JSObject result = new JSObject();
            result.put("scheduled", true);
            result.put("nextFire", cal.getTimeInMillis());
            result.put("exact", true);
            result.put("intervalMinutes", intervalMinutes);
            call.resolve(result);
        } catch (Exception e) {
            call.reject("Falha ao agendar alarme", e);
        }
    }

    // 5. TESTE: vibra o dispositivo imediatamente (confirma a opção).
    // Mesmo padrão do alerta real: amplitude máxima (AMdroid/AlarmClock).
    @PluginMethod
    public void testVibrate(PluginCall call) {
        try {
            android.os.Vibrator vib =
                (android.os.Vibrator) getContext().getSystemService(Context.VIBRATOR_SERVICE);
            if (vib != null && vib.hasVibrator()) {
                long[] pattern = {0, 500, 500};
                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                    int[] amplitudes = {0, 255, 255};
                    // repeat -1: vibra UMA vez (repeat 0 = infinito, o
                    // sistema pode cortar e parece que não funciona)
                    vib.vibrate(
                        android.os.VibrationEffect.createWaveform(pattern, amplitudes, -1)
                    );
                } else {
                    vib.vibrate(pattern, -1);
                }
                VerseAlarmReceiver.logEvent(getContext(), "efeitos", "testar_vibrar", "",
                    "vibração forte 2×", true, "");
            } else {
                VerseAlarmReceiver.logEvent(getContext(), "efeitos", "testar_vibrar", "",
                    "vibração forte 2×", false, "aparelho sem vibrator");
            }
            call.resolve();
        } catch (Exception e) {
            VerseAlarmReceiver.logEvent(getContext(), "efeitos", "testar_vibrar", "",
                "vibração forte 2×", false, e.getMessage());
            call.reject("Falha ao vibrar", e);
        }
    }

    // 6. TESTE: acende a tela imediatamente (confirma a opção).
    // BUG CORRIGIDO: FULL_WAKE_LOCK é DESCONTINUADO desde o Android 10 —
    // não acende mais a tela. A forma que funciona (padrão AMdroid) é abrir
    // a GiantVerseActivity, que aplica os flags de acordar (TURN_SCREEN_ON,
    // SHOW_WHEN_LOCKED, ALLOW_LOCK_WHILE_SCREEN_ON) na tela de verdade.
    @PluginMethod
    public void testWakeDevice(PluginCall call) {
        try {
            Intent intent = new Intent(getContext(), GiantVerseActivity.class);
            intent.putExtra("verseText", "Teste: a tela acordou! Se você está vendo isto, o acordar do dispositivo funciona.");
            intent.putExtra("verseRef", "Diagnóstico • Acordar");
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            getContext().startActivity(intent);
            call.resolve();
        } catch (Exception e) {
            call.reject("Falha ao acordar", e);
        }
    }

    // 7. TESTE: pisca o flash LED imediatamente (confirma a opção)
    @PluginMethod
    public void testFlashLed(PluginCall call) {
        try {
            FlashLightUtil.blinkFlash(getContext(), 5);
            call.resolve();
        } catch (Exception e) {
            call.reject("Falha ao piscar flash", e);
        }
    }

    // DIAGNÓSTICO (Etapa 1 do plano): retorna o estado REAL de tudo para a
    // tela de Diagnóstico do app. A corrente do versículo tem 4 elos:
    // alarme agendado → receiver dispara → janela ok → notificação mostra.
    // Esta chamada mostra em qual elo está quebrando.
    @PluginMethod
    public void getDiagnostics(PluginCall call) {
        try {
            android.content.Context ctx = getContext();
            android.content.SharedPreferences alarmPrefs =
                ctx.getSharedPreferences("luzdiaria_alarm", Context.MODE_PRIVATE);
            android.content.SharedPreferences diagPrefs =
                ctx.getSharedPreferences("luzdiaria_diag", Context.MODE_PRIVATE);

            JSObject result = new JSObject();

            // 1. Serviço rodando?
            boolean serviceRunning = false;
            android.app.ActivityManager am =
                (android.app.ActivityManager) ctx.getSystemService(Context.ACTIVITY_SERVICE);
            if (am != null) {
                java.util.List<android.app.ActivityManager.RunningServiceInfo> services =
                    am.getRunningServices(100);
                if (services != null) {
                    for (android.app.ActivityManager.RunningServiceInfo s : services) {
                        if (VerseForegroundService.class.getName().equals(s.service.getClassName())) {
                            serviceRunning = true;
                            break;
                        }
                    }
                }
            }
            result.put("serviceRunning", serviceRunning);

            // 2. Configuração salva do alarme
            int intervalMinutes = alarmPrefs.getInt("intervalMinutes", 0);
            result.put("intervalMinutes", intervalMinutes);
            result.put("startHour", alarmPrefs.getInt("startHour", 8));
            result.put("startMinute", alarmPrefs.getInt("startMinute", 0));
            result.put("endHour", alarmPrefs.getInt("endHour", 23));
            result.put("endMinute", alarmPrefs.getInt("endMinute", 0));
            result.put("configured", intervalMinutes > 0);

            // 3. Próximo alarme agendado no sistema (via AlarmClockInfo)
            long nextAlarm = 0;
            try {
                AlarmManager am2 = (AlarmManager) ctx.getSystemService(Context.ALARM_SERVICE);
                if (am2 != null && android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
                    AlarmManager.AlarmClockInfo info = am2.getNextAlarmClock();
                    if (info != null) nextAlarm = info.getTriggerTime();
                }
            } catch (Exception e) { nextAlarm = 0; }
            result.put("nextAlarm", nextAlarm);

            // 4. Log de diagnóstico (últimos disparos)
            result.put("diagLog", diagPrefs.getString("log", ""));

            // 4b. Log de RASTREIO de eventos (plano teórico — interações do usuário)
            result.put("eventLog", VerseAlarmReceiver.getEventLog(ctx));

            // 4c. Dados do dispositivo (para análise remota)
            JSObject device = new JSObject();
            device.put("fabricante", android.os.Build.MANUFACTURER);
            device.put("modelo", android.os.Build.MODEL);
            device.put("android", android.os.Build.VERSION.RELEASE);
            device.put("sdk", android.os.Build.VERSION.SDK_INT);
            device.put("app", ctx.getPackageName());
            result.put("dispositivo", device);

            // 5. Estado do WIDGET: quantos instalados + último versículo salvo
            //    (o widget lê daqui — se o app salvou, o widget mostra).
            int widgetCount = 0;
            String widgetVerse = "";
            try {
                android.appwidget.AppWidgetManager wm =
                    android.appwidget.AppWidgetManager.getInstance(ctx);
                widgetCount = wm.getAppWidgetIds(
                    new android.content.ComponentName(ctx, VerseWidgetProvider.class)
                ).length;
                android.content.SharedPreferences wprefs =
                    ctx.getSharedPreferences("luzdiaria_widget", Context.MODE_MULTI_PROCESS);
                widgetVerse = wprefs.getString("lastVerse", "");
            } catch (Exception e) { /* diagnóstico não falha */ }
            result.put("widgetCount", widgetCount);
            result.put("widgetVerse", widgetVerse);

            call.resolve(result);
        } catch (Exception e) {
            call.reject("Erro ao obter diagnóstico", e);
        }
    }

    // TESTE ISOLADO (Etapa 3 do plano): agenda o alarme para 1 minuto a
    // partir de agora com forceShow=true (ignora a janela). Isola o problema:
    // se o teste disparar e o agendamento normal não, o problema é a JANELA.
    @PluginMethod
    public void testAlarmInOneMinute(PluginCall call) {
        try {
            android.content.Context ctx = getContext();
            AlarmManager am = (AlarmManager) ctx.getSystemService(Context.ALARM_SERVICE);
            if (am == null) { call.reject("AlarmManager indisponível"); return; }

            java.util.Calendar cal = java.util.Calendar.getInstance();
            cal.add(java.util.Calendar.MINUTE, 1);

            Intent intent = new Intent(ctx, VerseAlarmReceiver.class);
            intent.putExtra("verseText", "Teste de diagnóstico: se você está vendo isto, o alarme disparou corretamente!");
            intent.putExtra("verseRef", "Diagnóstico • 1 min");
            intent.putExtra("forceShow", true);
            intent.setAction("com.luzdiaria.versiculos.DAILY_VERSE_ALARM");

            PendingIntent pi = PendingIntent.getBroadcast(
                ctx, 1001, intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );

            try {
                Intent showIntent = new Intent(ctx, MainActivity.class);
                showIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
                PendingIntent showPi = PendingIntent.getActivity(
                    ctx, 9001, showIntent,
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
                );
                am.setAlarmClock(new AlarmManager.AlarmClockInfo(cal.getTimeInMillis(), showPi), pi);
            } catch (Exception e) {
                am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, cal.getTimeInMillis(), pi);
            }

            VerseAlarmReceiver.logDiagnostic(ctx, "teste_1min_agendado", true, true);

            JSObject result = new JSObject();
            result.put("scheduled", true);
            result.put("fireAt", cal.getTimeInMillis());
            call.resolve(result);
        } catch (Exception e) {
            call.reject("Falha ao agendar teste", e);
        }
    }

    // Verifica se o Foreground Service está rodando. Se o sistema/fabricante
    // matou o app, o serviço para — o app pode avisar o usuário.
    @PluginMethod
    public void isServiceRunning(PluginCall call) {
        try {
            boolean running = false;
            android.app.ActivityManager am =
                (android.app.ActivityManager) getContext().getSystemService(Context.ACTIVITY_SERVICE);
            if (am != null) {
                java.util.List<android.app.ActivityManager.RunningServiceInfo> services =
                    am.getRunningServices(100);
                if (services != null) {
                    for (android.app.ActivityManager.RunningServiceInfo s : services) {
                        if (VerseForegroundService.class.getName().equals(s.service.getClassName())) {
                            running = true;
                            break;
                        }
                    }
                }
            }
            JSObject result = new JSObject();
            result.put("running", running);
            call.resolve(result);
        } catch (Exception e) {
            JSObject result = new JSObject();
            result.put("running", false);
            call.resolve(result);
        }
    }

    // 8. Salva o versículo atual e ATUALIZA todos os widgets da tela inicial.
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
