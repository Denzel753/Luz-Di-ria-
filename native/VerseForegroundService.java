package com.luzdiaria.versiculos;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.os.Build;
import android.os.IBinder;

/**
 * Foreground Service: mantém o app vivo em segundo plano com uma notificação
 * PERMANENTE "Luz Diária" que NÃO pode ser deslizada nem some — usa
 * FLAG_ONGOING_EVENT | FLAG_NO_CLEAR (padrão oficial do Android para
 * notificações fixas de serviço em primeiro plano).
 *
 * Aceita o versículo via Intent (startForegroundService com extras) para
 * atualizar o texto exibido na notificação fixa.
 */
public class VerseForegroundService extends Service {

    private static final String CHANNEL_ID = "luz-diaria";
    private static final int NOTIFICATION_ID = 1002;
    private static final String EXTRA_VERSE_TEXT = "verseText";
    private static final String EXTRA_VERSE_REF = "verseRef";

    @Override
    public void onCreate() {
        super.onCreate();
        createChannel();
        startAsForeground(null, null);
    }

    private void createChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "Luz Diária",
                NotificationManager.IMPORTANCE_LOW // silenciosa, só fica na barra
            );
            channel.setDescription("Mantém o app ativo para os versículos diários");
            channel.setShowBadge(false);
            NotificationManager nm = getSystemService(NotificationManager.class);
            if (nm != null) nm.createNotificationChannel(channel);
        }
    }

    private void startAsForeground(String verseText, String verseRef) {
        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent contentIntent = PendingIntent.getActivity(
            this,
            0,
            notificationIntent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        Notification.Builder builder;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            builder = new Notification.Builder(this, CHANNEL_ID);
        } else {
            builder = new Notification.Builder(this);
        }

        // Se veio versículo do app, mostra ele; senão, texto padrão
        String title = (verseRef != null && !verseRef.isEmpty()) ? verseRef : "Luz Diária";
        String body = (verseText != null && !verseText.isEmpty())
            ? verseText
            : "Versículos diários ativos — toque para abrir o app";

        Notification notification = builder
            .setContentTitle(title)
            .setContentText(body)
            .setStyle(new Notification.BigTextStyle().bigText(body))
            .setSmallIcon(R.drawable.ic_stat_notification)
            .setContentIntent(contentIntent)
            // FLAGS FIXAS: não pode ser deslizada nem removida pelo usuário/sistema
            .setOngoing(true)
            .setAutoCancel(false)
            .setPriority(Notification.PRIORITY_LOW)
            .build();

        // Garantia extra de permanência (padrão Android para notificações fixas)
        notification.flags |= Notification.FLAG_ONGOING_EVENT | Notification.FLAG_NO_CLEAR;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_DATA_SYNC);
        } else {
            startForeground(NOTIFICATION_ID, notification);
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null) {
            String verseText = intent.getStringExtra(EXTRA_VERSE_TEXT);
            String verseRef = intent.getStringExtra(EXTRA_VERSE_REF);
            if (verseText != null || verseRef != null) {
                startAsForeground(verseText, verseRef);
            }
        }
        return START_STICKY; // se o sistema matar, tenta reiniciar
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
