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
    private static final String ACTION_RESTART = "com.luzdiaria.versiculos.RESTART_SERVICE";

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

            // Canal de ALERTA (alta prioridade) — usado pelo VerseAlarmReceiver
            // para o versículo do horário. Precisa ser criado ANTES de qualquer
            // notificação usá-lo, com IMPORTANCE_HIGH, para o alerta realmente
            // aparecer (som, pop-up) mesmo com a notificação fixa ativa.
            NotificationChannel alertChannel = new NotificationChannel(
                "luz-diaria-alerta",
                "Luz Diária • Versículos",
                NotificationManager.IMPORTANCE_HIGH
            );
            alertChannel.setDescription("Alertas do versículo no horário configurado");
            alertChannel.setShowBadge(true);
            alertChannel.enableVibration(true);
            alertChannel.setSound(android.provider.Settings.System.DEFAULT_NOTIFICATION_URI, null);
            if (nm != null) nm.createNotificationChannel(alertChannel);
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

        // CHAVE DA SOLUÇÃO (Motorola/Android): posta a MESMA notificação via
        // NotificationManager.notify(). Notificações normais postadas
        // SOBREVIVEM à morte do processo/serviço — quando o Motorola mata o
        // serviço, a notificação fixa continua na barra. A do startForeground
        // (que o sistema remove ao matar o serviço) é reposta por esta aqui.
        NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        if (nm != null) {
            nm.notify(NOTIFICATION_ID, notification);
        }

        // Agenda o HEARTBEAT: reinicia o serviço periodicamente se o sistema
        // matou (Motorola/Samsung/Xiaomi são agressivos). Usa AlarmManager
        // com alarme inexato (econômico) a cada 15 min.
        scheduleHeartbeat();
    }

    // Heartbeat: alarme que re-inicia o serviço se o sistema o matou.
    // Sem isso, fabricantes agressivas (Motorola, Xiaomi, Samsung) matam o
    // serviço e a notificação fixa perde o "dono" que a mantém viva.
    private void scheduleHeartbeat() {
        try {
            android.app.AlarmManager am =
                (android.app.AlarmManager) getSystemService(ALARM_SERVICE);
            if (am == null) return;

            Intent intent = new Intent(this, VerseForegroundService.class);
            intent.setAction(ACTION_RESTART);
            android.app.PendingIntent pi = android.app.PendingIntent.getService(
                this,
                77,
                intent,
                android.app.PendingIntent.FLAG_UPDATE_CURRENT | android.app.PendingIntent.FLAG_IMMUTABLE
            );

            long interval = 15 * 60 * 1000L; // 15 minutos
            long first = System.currentTimeMillis() + interval;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                am.setAndAllowWhileIdle(android.app.AlarmManager.RTC, first, pi);
            } else {
                am.set(android.app.AlarmManager.RTC, first, pi);
            }
        } catch (Exception e) {
            // Falha silenciosa — o START_STICKY ainda ajuda
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null) {
            // Heartbeat: re-inicia o serviço (já estava rodando, só garante)
            if (ACTION_RESTART.equals(intent.getAction())) {
                // Garante que a notificação fixa está postada
                startAsForeground(null, null);
                return START_STICKY;
            }
            String verseText = intent.getStringExtra(EXTRA_VERSE_TEXT);
            String verseRef = intent.getStringExtra(EXTRA_VERSE_REF);
            if (verseText != null || verseRef != null) {
                startAsForeground(verseText, verseRef);
            }
        }
        return START_STICKY; // se o sistema matar, tenta reiniciar
    }

    // Quando o usuário desliza o app dos recentes (swipe), o Android tende a
    // matar o serviço em seguida — relança imediatamente para a notificação
    // fixa não sumir (comportamento de apps de música/relógio).
    @Override
    public void onTaskRemoved(Intent rootIntent) {
        super.onTaskRemoved(rootIntent);
        try {
            Intent restart = new Intent(getApplicationContext(), VerseForegroundService.class);
            restart.setAction(ACTION_RESTART);
            android.app.PendingIntent pi = android.app.PendingIntent.getService(
                this,
                78,
                restart,
                android.app.PendingIntent.FLAG_ONE_SHOT | android.app.PendingIntent.FLAG_IMMUTABLE
            );
            android.app.AlarmManager am =
                (android.app.AlarmManager) getSystemService(ALARM_SERVICE);
            if (am != null) {
                // Relança ~1s depois do swipe
                am.set(android.app.AlarmManager.RTC,
                    System.currentTimeMillis() + 1000, pi);
            }
        } catch (Exception e) {
            // Falha silenciosa
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
