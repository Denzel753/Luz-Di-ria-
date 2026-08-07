package com.luzdiaria.versiculos;

import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.PowerManager;

import java.util.Calendar;

/**
 * Recebe o alarme diário do versículo, acorda a tela (se o usuário permitir)
 * e dispara a notificação com o versículo do dia.
 */
public class VerseAlarmReceiver extends BroadcastReceiver {

    private static final String CHANNEL_ID = "luz-diaria";
    private static final String CHANNEL_ID_ALERT = "luz-diaria-alerta";
    private static final int NOTIFICATION_ID = 1001;

    @Override
    public void onReceive(Context context, Intent intent) {
        String verseText = intent.getStringExtra("verseText");
        String verseRef = intent.getStringExtra("verseRef");
        if (verseText == null) verseText = "Buscando o versículo do dia...";
        if (verseRef == null) verseRef = "";

        // 1. Acorda a tela (requer WAKE_LOCK) — para o pop-up gigante aparecer
        android.content.SharedPreferences prefs =
            context.getSharedPreferences("luzdiaria_alarm", Context.MODE_PRIVATE);
        boolean wantWake = prefs.getBoolean("wakeDevice", true);
        boolean wantVibrate = prefs.getBoolean("vibrate", false);
        boolean wantFlash = prefs.getBoolean("flashLed", false);

        if (wantWake) {
            wakeScreen(context);
        }

        // 1a. Vibração (configurável pelo usuário)
        if (wantVibrate) {
            try {
                android.os.Vibrator vib =
                    (android.os.Vibrator) context.getSystemService(Context.VIBRATOR_SERVICE);
                if (vib != null && vib.hasVibrator()) {
                    long[] pattern = {0, 200, 100, 200};
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        vib.vibrate(pattern, -1);
                    } else {
                        vib.vibrate(pattern, -1);
                    }
                }
            } catch (Exception e) {
                // Falha silenciosa — não bloqueia a notificação
            }
        }

        // 1b. Flash LED (configurável pelo usuário)
        if (wantFlash) {
            FlashLightUtil.blinkFlash(context, 5);
        }

        // 1c. Pop-up Gigante NATIVO: Android 10+ BLOQUEIA abrir Activities em
        //     background via startActivity. A solução oficial é o
        //     FullScreenIntent: a notificação carrega a GiantVerseActivity e o
        //     sistema a abre na tela de bloqueio / por cima de outros apps
        //     (é como apps de alarme funcionam). Se o app está em primeiro
        //     plano, não precisa do pop-up — o usuário já vê o versículo.
        boolean foreground = isAppInForeground(context);
        showVerseNotification(context, verseText, verseRef, !foreground);

        // 1d. Atualiza o widget da tela inicial com o versículo do momento
        try {
            VerseWidgetProvider.saveVerse(context, verseText, verseRef);
            android.appwidget.AppWidgetManager mgr =
                android.appwidget.AppWidgetManager.getInstance(context);
            int[] ids = mgr.getAppWidgetIds(
                new android.content.ComponentName(context, VerseWidgetProvider.class)
            );
            for (int id : ids) {
                VerseWidgetProvider provider = new VerseWidgetProvider();
                provider.updateWidgetPublic(context, mgr, id);
            }
        } catch (Exception e) {
            // Falha silenciosa — o widget tenta de novo no próximo disparo
        }

        // 3. Reagenda o próximo disparo (repetição contínua com o intervalo salvo)
        rescheduleNext(context);
    }

    // Reagenda o próximo alarme usando o intervalo salvo nas preferências.
    // Assim o alarme repete: 1 min, 5 min, 1h... ou diário no horário fixo.
    private void rescheduleNext(Context context) {
        try {
            android.content.SharedPreferences prefs =
                context.getSharedPreferences("luzdiaria_alarm", Context.MODE_PRIVATE);
            int intervalMinutes = prefs.getInt("intervalMinutes", 1440);
            String verseText = prefs.getString("verseText", "");
            String verseRef = prefs.getString("verseRef", "");

            AlarmManager am = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
            if (am == null) return;

            Calendar cal = Calendar.getInstance();
            if (intervalMinutes == 1440) {
                // Diário: próximo dia no mesmo horário do primeiro agendamento
                cal.add(Calendar.DAY_OF_YEAR, 1);
            } else {
                cal.add(Calendar.MINUTE, intervalMinutes);
            }

            Intent intent = new Intent(context, VerseAlarmReceiver.class);
            intent.putExtra("verseText", verseText);
            intent.putExtra("verseRef", verseRef);
            intent.setAction("com.luzdiaria.versiculos.DAILY_VERSE_ALARM");

            PendingIntent pi = PendingIntent.getBroadcast(
                context,
                1001,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );

            boolean exactOk = true;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                exactOk = am.canScheduleExactAlarms();
            }
            if (exactOk) {
                am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, cal.getTimeInMillis(), pi);
            } else {
                am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, cal.getTimeInMillis(), pi);
            }
        } catch (Exception e) {
            // Falha silenciosa — o alarme principal ainda existe
        }
    }

    // Verifica se o app está em primeiro plano (visível na tela).
    // Se o usuário está dentro do app, não precisa do pop-up gigante.
    private boolean isAppInForeground(Context context) {
        try {
            android.app.ActivityManager am =
                (android.app.ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
            if (am == null) return false;
            java.util.List<android.app.ActivityManager.RunningAppProcessInfo> procs =
                am.getRunningAppProcesses();
            if (procs == null) return false;
            for (android.app.ActivityManager.RunningAppProcessInfo p : procs) {
                if (p.processName != null
                        && p.processName.equals(context.getPackageName())
                        && p.importance == android.app.ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND) {
                    return true;
                }
            }
        } catch (Exception e) {
            // Se não conseguir verificar, assume que NÃO está em primeiro plano
        }
        return false;
    }

    private void wakeScreen(Context context) {
        try {
            PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
            if (pm == null) return;
            PowerManager.WakeLock wl = pm.newWakeLock(
                PowerManager.FULL_WAKE_LOCK |
                PowerManager.ACQUIRE_CAUSES_WAKEUP |
                PowerManager.ON_AFTER_RELEASE,
                "luzdiaria:versealarm"
            );
            wl.acquire(5000); // segura a tela acesa por 5s
            // Nota: FULL_WAKE_LOCK é obsoleto em API 33+; em versões novas
            // a tela acende via notificação de alta prioridade (IMPORTANCE_HIGH)
            if (wl.isHeld()) wl.release();
        } catch (Exception e) {
            // Falha silenciosa — a notificação ainda dispara
        }
    }

    private void showVerseNotification(Context context, String verseText, String verseRef, boolean showPopup) {
        // CANAL SEPARADO de ALERTA (alta prioridade). O canal "luz-diaria"
        // já foi criado com IMPORTANCE_LOW pelo Foreground Service (notificação
        // fixa) e o Android NÃO permite mudar a importância de canal existente.
        // Sem canal próprio, o alerta do versículo ficava preso no canal
        // silencioso e o usuário NÃO era notificado de verdade.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID_ALERT,
                "Luz Diária • Versículos",
                NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription("Alertas do versículo no horário configurado");
            channel.setShowBadge(true);
            channel.enableVibration(true);
            channel.setSound(android.provider.Settings.System.DEFAULT_NOTIFICATION_URI, null);
            NotificationManager nm = context.getSystemService(NotificationManager.class);
            if (nm != null) nm.createNotificationChannel(channel);
        }

        Intent notificationIntent = new Intent(context, MainActivity.class);
        PendingIntent contentIntent = PendingIntent.getActivity(
            context,
            0,
            notificationIntent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        Notification.Builder builder;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            builder = new Notification.Builder(context, CHANNEL_ID_ALERT);
        } else {
            builder = new Notification.Builder(context);
        }

        builder
            .setContentTitle(verseRef)
            .setContentText(verseText)
            .setStyle(new Notification.BigTextStyle().bigText(verseText))
            .setSmallIcon(R.drawable.ic_stat_notification)
            .setContentIntent(contentIntent)
            .setAutoCancel(true)
            .setPriority(Notification.PRIORITY_HIGH)
            .setCategory(Notification.CATEGORY_ALARM);

        // Pop-up Gigante via FullScreenIntent (só quando o app NÃO está em
        // primeiro plano). É o mecanismo oficial do Android para acordar a
        // tela e mostrar a Activity por cima de tudo — funciona com a tela
        // bloqueada, desligada ou com outro app aberto.
        if (showPopup) {
            Intent popupIntent = new Intent(context, GiantVerseActivity.class);
            popupIntent.putExtra("verseText", verseText);
            popupIntent.putExtra("verseRef", verseRef);
            popupIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            PendingIntent fullScreenIntent = PendingIntent.getActivity(
                context,
                1,
                popupIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );
            builder.setFullScreenIntent(fullScreenIntent, true);
        }

        Notification notification = builder.build();

        NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm != null) {
            nm.notify(NOTIFICATION_ID, notification);
        }
    }
}
