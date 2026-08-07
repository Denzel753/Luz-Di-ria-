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
        // A JANELA DE HORÁRIO é soberana: o usuário define início/fim e o
        // alerta só acontece DENTRO dela. Fora da janela, apenas reagenda
        // o próximo disparo sem notificar (o versículo não incomoda fora
        // do período que o usuário escolheu).
        if (!isInTimeWindow(context)) {
            rescheduleNext(context);
            return;
        }

        String verseText = intent.getStringExtra("verseText");
        String verseRef = intent.getStringExtra("verseRef");
        if (verseText == null) verseText = "Buscando o versículo do dia...";
        if (verseRef == null) verseRef = "";

        // Se o alarme veio do reagendamento nativo (app fechado), ele carrega
        // o MESMO versículo fixo — o widget nunca trocaria. Para garantir que
        // o widget SEMPRE troque no horário, sorteia um versículo novo da
        // lista embutida quando o texto veio vazio/placeholder.
        if (verseText.startsWith("Buscando") || verseText.isEmpty()) {
            String[] pick = pickRandomVerse();
            verseText = pick[0];
            verseRef = pick[1];
        }

        // 0. WAKE LOCK DE TRANSIÇÃO (padrão AMdroid/AlarmClock): segura a CPU
        // acordada por 60s quando o alarme dispara — garante que o pop-up,
        // a notificação e o widget executem mesmo com o aparelho dormindo,
        // antes do sistema voltar ao Doze. Sem isso, em alguns aparelhos
        // (Motorola) o processo morre antes de mostrar o alerta.
        try {
            android.os.PowerManager pm =
                (android.os.PowerManager) context.getSystemService(Context.POWER_SERVICE);
            if (pm != null) {
                android.os.PowerManager.WakeLock transitionLock = pm.newWakeLock(
                    android.os.PowerManager.PARTIAL_WAKE_LOCK,
                    "luzdiaria:transition"
                );
                transitionLock.acquire(60 * 1000L); // 60 segundos
                // Será liberado automaticamente pelo timeout de 60s
            }
        } catch (Exception e) {
            // Falha silenciosa — o alerta segue mesmo assim
        }

        // 1. Acorda a tela (requer WAKE_LOCK) — para o pop-up gigante aparecer
        android.content.SharedPreferences prefs =
            context.getSharedPreferences("luzdiaria_alarm", Context.MODE_PRIVATE);
        boolean wantWake = prefs.getBoolean("wakeDevice", true);
        boolean wantVibrate = prefs.getBoolean("vibrate", false);
        boolean wantFlash = prefs.getBoolean("flashLed", false);

        if (wantWake) {
            wakeScreen(context);
        }

        // 1a. Vibração (configurável pelo usuário) — padrão AMdroid/AlarmClock:
        // VibrationEffect.createWaveform com AMPLITUDE máxima (255), padrão
        // 500ms ligado / 500ms desligado. Vibração forte e perceptível, mesmo
        // no Motorola (a vibração padrão é fraca e passa despercebida).
        if (wantVibrate) {
            try {
                android.os.Vibrator vib =
                    (android.os.Vibrator) context.getSystemService(Context.VIBRATOR_SERVICE);
                if (vib != null && vib.hasVibrator()) {
                    long[] pattern = {0, 500, 500};
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        // Android 8+: vibração com amplitude de força máxima
                        int[] amplitudes = {0, 255, 255};
                        vib.vibrate(
                            android.os.VibrationEffect.createWaveform(pattern, amplitudes, 0)
                        );
                    } else {
                        vib.vibrate(pattern, 0);
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
                // Intervalo ANCORADO no início da janela (regra do usuário):
                // a contagem começa no horário de INÍCIO definido. Ex:
                // janela 08:00-22:00 + 4h → 08:00, 12:00, 16:00, 20:00.
                // Se o próximo slot cair fora da janela, agenda para o
                // PRÓXIMO DIA no horário de início (recomeça o ciclo).
                int startH = prefs.getInt("startHour", 8);
                int startM = prefs.getInt("startMinute", 0);
                int endH = prefs.getInt("endHour", 22);
                int endM = prefs.getInt("endMinute", 0);
                long intervalMs = intervalMinutes * 60 * 1000L;

                // Âncora: início da janela de hoje
                Calendar anchor = Calendar.getInstance();
                anchor.set(Calendar.HOUR_OF_DAY, startH);
                anchor.set(Calendar.MINUTE, startM);
                anchor.set(Calendar.SECOND, 0);
                anchor.set(Calendar.MILLISECOND, 0);

                // Próximo slot: âncora + k*intervalo (k = próximo inteiro)
                long sinceAnchor = System.currentTimeMillis() - anchor.getTimeInMillis();
                long k = Math.max(0, (long) Math.ceil((double) sinceAnchor / intervalMs));
                cal.setTimeInMillis(anchor.getTimeInMillis() + k * intervalMs);

                // Fim da janela de hoje
                Calendar windowEnd = Calendar.getInstance();
                windowEnd.set(Calendar.HOUR_OF_DAY, endH);
                windowEnd.set(Calendar.MINUTE, endM);
                windowEnd.set(Calendar.SECOND, 59);
                windowEnd.set(Calendar.MILLISECOND, 999);

                // Slot passou do fim da janela → recomeça AMANHÃ no início
                if (cal.getTimeInMillis() > windowEnd.getTimeInMillis()) {
                    cal.add(Calendar.DAY_OF_YEAR, 1);
                    cal.set(Calendar.HOUR_OF_DAY, startH);
                    cal.set(Calendar.MINUTE, startM);
                    cal.set(Calendar.SECOND, 0);
                    cal.set(Calendar.MILLISECOND, 0);
                }
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

            // ESTRATÉGIA DE AGENDAMENTO (padrão AMdroid/AlarmClock):
            // setAlarmClock() é o mecanismo de alarme de RELÓGIO do Android:
            // 1) NÃO exige a permissão SCHEDULE_EXACT_ALARM (dispara no
            //    minuto exato mesmo sem ela — apps de alarme usam isso)
            // 2) Sobrevive ao Doze de verdade (o sistema libera SEMPRE)
            // 3) Mostra o próximo alarme no painel do sistema (transparência)
            // Fallback: setExactAndAllowWhileIdle se setAlarmClock falhar.
            try {
                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
                    Intent showIntent = new Intent(context, MainActivity.class);
                    showIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
                    PendingIntent showPi = PendingIntent.getActivity(
                        context,
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
        } catch (Exception e) {
            // Falha silenciosa — o alarme principal ainda existe
        }
    }

    // Reagenda o alarme a partir das preferências salvas. Chamado pelo
    // BootReceiver em eventos do sistema (boot, hora/fuso mudou, app
    // atualizado, permissão de alarme exato concedida). Sem isso, o alarme
    // morre silenciosamente e só volta quando o usuário abre o app.
    public static void rescheduleFromPrefs(Context context) {
        try {
            android.content.SharedPreferences prefs =
                context.getSharedPreferences("luzdiaria_alarm", Context.MODE_PRIVATE);
            int intervalMinutes = prefs.getInt("intervalMinutes", 0);
            if (intervalMinutes <= 0) return; // nunca foi agendado

            int startH = prefs.getInt("startHour", 8);
            int startM = prefs.getInt("startMinute", 0);
            String verseText = prefs.getString("verseText", "");
            String verseRef = prefs.getString("verseRef", "");

            // Recalcula o próximo disparo (mesma lógica de agendamento)
            AlarmManager am = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
            if (am == null) return;

            Calendar cal = Calendar.getInstance();
            if (intervalMinutes == 1440) {
                cal.set(Calendar.HOUR_OF_DAY, startH);
                cal.set(Calendar.MINUTE, startM);
                cal.set(Calendar.SECOND, 0);
                cal.set(Calendar.MILLISECOND, 0);
                if (cal.getTimeInMillis() <= System.currentTimeMillis()) {
                    cal.add(Calendar.DAY_OF_YEAR, 1);
                }
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

            // ESTRATÉGIA AMdroid: setAlarmClock (alarme de relógio — sem
            // exigir permissão de alarme exato, sobrevive ao Doze).
            try {
                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
                    Intent showIntent = new Intent(context, MainActivity.class);
                    showIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
                    PendingIntent showPi = PendingIntent.getActivity(
                        context,
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
        } catch (Exception e) {
            // Falha silenciosa — o app re-agenda ao abrir
        }
    }

    // Sorteia um versículo da lista embutida (usado quando o alarme dispara
    // com o app fechado — garante que widget/notificação SEMPRE trocam no
    // horário, mesmo sem o app gerar um versículo novo).
    private String[] pickRandomVerse() {
        String[][] verses = {
            {"Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.", "João 3:16"},
            {"Tudo posso naquele que me fortalece.", "Filipenses 4:13"},
            {"O Senhor é o meu pastor; nada me faltará.", "Salmos 23:1"},
            {"Entrega o teu caminho ao Senhor; confia nele, e ele tudo fará.", "Salmos 37:5"},
            {"Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus.", "Isaías 41:10"},
            {"Buscai primeiro o reino de Deus e a sua justiça, e todas estas coisas vos serão acrescentadas.", "Mateus 6:33"},
            {"Ora, a fé é o firme fundamento das coisas que se esperam, e a prova das coisas que se não veem.", "Hebreus 11:1"},
            {"E conhecereis a verdade, e a verdade vos libertará.", "João 8:32"},
            {"Em paz também me deitarei e dormirei, porque só tu, Senhor, me fazes habitar em segurança.", "Salmos 4:8"},
            {"Todas as coisas contribuem juntamente para o bem daqueles que amam a Deus.", "Romanos 8:28"},
        };
        int i = (int) (Math.random() * verses.length);
        return verses[i];
    }

    // Verifica se o horário atual está DENTRO da janela configurada pelo
    // usuário (início/fim). A janela é soberana — fora dela, sem alertas.
    private boolean isInTimeWindow(Context context) {
        try {
            android.content.SharedPreferences prefs =
                context.getSharedPreferences("luzdiaria_alarm", Context.MODE_PRIVATE);
            int startH = prefs.getInt("startHour", 8);
            int startM = prefs.getInt("startMinute", 0);
            int endH = prefs.getInt("endHour", 22);
            int endM = prefs.getInt("endMinute", 0);

            java.util.Calendar now = java.util.Calendar.getInstance();
            int mins = now.get(java.util.Calendar.HOUR_OF_DAY) * 60
                     + now.get(java.util.Calendar.MINUTE);
            int startMins = startH * 60 + startM;
            int endMins = endH * 60 + endM;

            if (startMins <= endMins) {
                return mins >= startMins && mins <= endMins;
            } else {
                // Janela vira a meia-noite (ex: 22:00 -> 06:00)
                return mins >= startMins || mins <= endMins;
            }
        } catch (Exception e) {
            return true; // se falhar, permite (não bloqueia o alerta)
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
            .setCategory(Notification.CATEGORY_ALARM)
            // VISIBILITY_PUBLIC: permite o conteúdo aparecer na tela de
            // bloqueio (padrão do AMdroid/AlarmClock para o alerta cheio)
            .setVisibility(Notification.VISIBILITY_PUBLIC)
            .setLocalOnly(true);

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

        // AÇÃO na notificação: botão "Abrir" que leva ao app (padrão do
        // AMdroid/AlarmClock — o alarme tem ações Soneca/Parar; aqui temos
        // a ação de abrir o versículo completo).
        try {
            Intent openIntent = new Intent(context, MainActivity.class);
            openIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            PendingIntent openPi = PendingIntent.getActivity(
                context,
                2,
                openIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );
            builder.addAction(
                R.drawable.ic_stat_notification,
                "Abrir",
                openPi
            );
        } catch (Exception e) {
            // Falha silenciosa — a notificação funciona sem a ação
        }

        Notification notification = builder.build();

        NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm != null) {
            nm.notify(NOTIFICATION_ID, notification);
        }
    }
}
