package com.luzdiaria.versiculos;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.PowerManager;

/**
 * Recebe o alarme diário do versículo, acorda a tela (se o usuário permitir)
 * e dispara a notificação com o versículo do dia.
 */
public class VerseAlarmReceiver extends BroadcastReceiver {

    private static final String CHANNEL_ID = "luz-diaria";
    private static final int NOTIFICATION_ID = 1001;

    @Override
    public void onReceive(Context context, Intent intent) {
        String verseText = intent.getStringExtra("verseText");
        String verseRef = intent.getStringExtra("verseRef");
        if (verseText == null) verseText = "Buscando o versículo do dia...";
        if (verseRef == null) verseRef = "";

        // 1. Acorda a tela (requer WAKE_LOCK) — para o pop-up gigante aparecer
        wakeScreen(context);

        // 2. Dispara a notificação do versículo
        showVerseNotification(context, verseText, verseRef);
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

    private void showVerseNotification(Context context, String verseText, String verseRef) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "Luz Diária",
                NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription("Versículos diários");
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
            builder = new Notification.Builder(context, CHANNEL_ID);
        } else {
            builder = new Notification.Builder(context);
        }

        Notification notification = builder
            .setContentTitle("Luz Diária • " + verseRef)
            .setContentText(verseText)
            .setStyle(new Notification.BigTextStyle().bigText(verseText))
            .setSmallIcon(R.drawable.ic_stat_notification)
            .setContentIntent(contentIntent)
            .setAutoCancel(true)
            .setPriority(Notification.PRIORITY_HIGH)
            .setCategory(Notification.CATEGORY_ALARM)
            .build();

        NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm != null) {
            nm.notify(NOTIFICATION_ID, notification);
        }
    }
}
