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

    // AÇÃO DO WATCHDOG: alarme periódico que verifica a saúde do app.
    public static final String ACTION_WATCHDOG_CHECK = "com.luzdiaria.versiculos.WATCHDOG_CHECK";
    // Intervalo padrão do watchdog: 10 minutos (leve, econômico)
    private static final long WATCHDOG_INTERVAL_MS = 10 * 60 * 1000L;

    @Override
    public void onReceive(Context context, Intent intent) {
        // WATCHDOG: verificação periódica de saúde (sem notificar o usuário)
        if (intent != null && ACTION_WATCHDOG_CHECK.equals(intent.getAction())) {
            runWatchdog(context);
            return;
        }

        // A JANELA DE HORÁRIO é soberana: o usuário define início/fim e o
        // alerta só acontece DENTRO dela. Fora da janela, apenas reagenda
        // o próximo disparo sem notificar (o versículo não incomoda fora
        // do período que o usuário escolheu).
        // EXCEÇÃO: forceShow=true (teste manual de diagnóstico) ignora a janela.
        boolean forceShow = intent.getBooleanExtra("forceShow", false);
        boolean inWindow = isInTimeWindow(context);
        // LOG DE DIAGNÓSTICO (Etapa 2): grava cada disparo para a tela
        // de Diagnóstico do app mostrar onde a corrente quebra.
        logDiagnostic(context, "alarme_disparou", inWindow, forceShow);
        if (!inWindow && !forceShow) {
            logDiagnostic(context, "fora_da_janela_silencioso", false, false);
            logEvent(context, "motor", "horario_bateu", "fora_janela",
                "silêncio + reagenda", true, "janela soberana");
            rescheduleNext(context);
            return;
        }
        logEvent(context, "motor", "horario_bateu", "na_janela",
            "sorteia + notifica + popup + widget", true, "");

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
                        // repeat -1: vibra UMA vez (repeat 0 = infinito)
                        vib.vibrate(
                            android.os.VibrationEffect.createWaveform(pattern, amplitudes, -1)
                        );
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
        logDiagnostic(context, "notificacao_exibida", inWindow, forceShow);
        logEvent(context, "motor", "notificacao", "push+popup",
            "notificação exibida com som", true, foreground ? "app em 1º plano" : "com popup gigante");

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
                // Diário: AMANHÃ no horário configurado (início da janela),
                // zerando segundos/milissegundos — não soma 1 dia ao horário
                // atual (que carregava segundos e podia escorregar).
                int startH = prefs.getInt("startHour", 8);
                int startM = prefs.getInt("startMinute", 0);
                cal.set(Calendar.HOUR_OF_DAY, startH);
                cal.set(Calendar.MINUTE, startM);
                cal.set(Calendar.SECOND, 0);
                cal.set(Calendar.MILLISECOND, 0);
                cal.add(Calendar.DAY_OF_YEAR, 1);
            } else {
                // Intervalo ANCORADO no início da janela (regra do usuário):
                // a contagem começa no horário de INÍCIO definido. Ex:
                // janela 08:00-22:00 + 4h → 08:00, 12:00, 16:00, 20:00.
                // Se o próximo slot cair fora da janela, agenda para o
                // PRÓXIMO DIA no horário de início (recomeça o ciclo).
                int startH = prefs.getInt("startHour", 8);
                int startM = prefs.getInt("startMinute", 0);
                int endH = prefs.getInt("endHour", 23);
                int endM = prefs.getInt("endMinute", 59);
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

        // Inicia o WATCHDOG VIVO (monitora a saúde do app a cada 10 min)
        scheduleWatchdog(context);
    }

    // LOG DE DIAGNÓSTICO (Etapa 2 do plano): grava cada disparo do alarme
    // num arquivo de log persistente. Se o problema acontece com o app
    // fechado, a tela de Diagnóstico conta a história quando o app reabrir.
    private static final String DIAG_PREFS = "luzdiaria_diag";
    private static final int MAX_DIAG_ENTRIES = 30;

    public static void logDiagnostic(Context context, String event, boolean inWindow, boolean forceShow) {
        try {
            android.content.SharedPreferences prefs =
                context.getSharedPreferences(DIAG_PREFS, Context.MODE_PRIVATE);
            String timestamp = new java.text.SimpleDateFormat("dd/MM HH:mm:ss", java.util.Locale.getDefault())
                .format(new java.util.Date());
            String entry = timestamp + " | " + event
                + (inWindow ? " | na_janela" : " | fora_janela")
                + (forceShow ? " | forceShow" : "");
            String existing = prefs.getString("log", "");
            existing = entry + "\n" + existing;
            // limita a 30 entradas (as mais recentes)
            String[] lines = existing.split("\n");
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < Math.min(lines.length, MAX_DIAG_ENTRIES); i++) {
                if (!lines[i].isEmpty()) sb.append(lines[i]).append("\n");
            }
            prefs.edit().putString("log", sb.toString()).apply();
        } catch (Exception e) {
            // nunca quebra o fluxo por causa do log
        }
    }

    // LOG DE RASTREIO ESTRUTURADO (plano teórico): grava cada interação do
    // usuário com resultado esperado vs real. Formato JSON por linha:
    // {"ts":"...","opcao":"intervalo","acao":"definir","valor":"60",
    //  "esperado":"reagenda","resultado":"ok","detalhe":"..."}
    public static void logEvent(Context context, String opcao, String acao,
                                String valor, String esperado, boolean ok, String detalhe) {
        try {
            android.content.SharedPreferences prefs =
                context.getSharedPreferences("luzdiaria_eventos", Context.MODE_PRIVATE);
            String ts = new java.text.SimpleDateFormat("dd/MM HH:mm:ss", java.util.Locale.getDefault())
                .format(new java.util.Date());
            // NÍVEL DE SEVERIDADE: [OK] / [AVISO] / [ERRO] — facilita a leitura
            // do log e a busca por problemas no JSON exportado.
            String nivel = ok ? "OK" : "ERRO";
            String entry = ts + " [" + nivel + "] " + opcao + " | " + acao + " | " + valor
                + " | esperado:" + esperado
                + (detalhe.isEmpty() ? "" : " | " + detalhe);
            String existing = prefs.getString("events", "");
            existing = entry + "\n" + existing;
            String[] lines = existing.split("\n");
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < Math.min(lines.length, 60); i++) {
                if (!lines[i].isEmpty()) sb.append(lines[i]).append("\n");
            }
            prefs.edit().putString("events", sb.toString()).apply();
        } catch (Exception e) {
            // nunca quebra o fluxo por causa do log
        }
    }

    public static String getEventLog(Context context) {
        try {
            android.content.SharedPreferences prefs =
                context.getSharedPreferences("luzdiaria_eventos", Context.MODE_PRIVATE);
            return prefs.getString("events", "");
        } catch (Exception e) {
            return "";
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
            int endH = prefs.getInt("endHour", 23);
            int endM = prefs.getInt("endMinute", 59);

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

    // ============================================================
    // WATCHDOG VIVO — monitora o app SEM PARAR (a cada 10 min).
    // Compara o estado REAL com o ESPERADO (mapa do funcionamento).
    // Fora da rota = grava [ERRO] no log de eventos + tenta corrigir.
    // ============================================================

    /** Agenda o próximo check do watchdog (10 min, alarme inexato/econômico). */
    public static void scheduleWatchdog(Context context) {
        try {
            AlarmManager am = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
            if (am == null) return;
            Intent intent = new Intent(context, VerseAlarmReceiver.class);
            intent.setAction(ACTION_WATCHDOG_CHECK);
            PendingIntent pi = PendingIntent.getBroadcast(
                context,
                777,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );
            long next = System.currentTimeMillis() + WATCHDOG_INTERVAL_MS;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, next, pi);
            } else {
                am.set(AlarmManager.RTC_WAKEUP, next, pi);
            }
        } catch (Exception e) {
            // nunca quebra por causa do watchdog
        }
    }

    /** Executa a verificação de saúde completa (chamado pelo alarme periódico). */
    private void runWatchdog(Context context) {
        try {
            android.content.SharedPreferences alarmPrefs =
                context.getSharedPreferences("luzdiaria_alarm", Context.MODE_PRIVATE);
            int intervalMinutes = alarmPrefs.getInt("intervalMinutes", 0);
            boolean configured = intervalMinutes > 0;

            // Sem configuração = app nunca foi configurado — sem erros a reportar
            if (!configured) {
                logEvent(context, "watchdog", "verificacao", "sem_config",
                    "app ainda não configurado", true, "nada a monitorar");
                scheduleWatchdog(context);
                return;
            }

            // CHECK 1: Serviço em primeiro plano rodando?
            boolean serviceRunning = false;
            try {
                android.app.ActivityManager am = (android.app.ActivityManager)
                    context.getSystemService(Context.ACTIVITY_SERVICE);
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
            } catch (Exception ignored) {}

            if (serviceRunning) {
                logEvent(context, "watchdog", "servico", "rodando",
                    "serviço fixo ativo", true, "");
            } else {
                logEvent(context, "watchdog", "servico", "MORTO",
                    "serviço fixo ativo", false, "tentando reiniciar...");
                // AUTO-CORREÇÃO: reinicia o serviço (o log registra o que fez)
                try {
                    Intent si = new Intent(context, VerseForegroundService.class);
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        context.startForegroundService(si);
                    } else {
                        context.startService(si);
                    }
                } catch (Exception e) {
                    logEvent(context, "watchdog", "servico", "MORTO",
                        "reiniciar serviço", false, "falha ao reiniciar: " + e.getMessage());
                }
            }

            // CHECK 2: Alarme do versículo agendado no sistema?
            long nextAlarm = 0;
            try {
                AlarmManager am2 = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
                if (am2 != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    AlarmManager.AlarmClockInfo info = am2.getNextAlarmClock();
                    if (info != null) nextAlarm = info.getTriggerTime();
                }
            } catch (Exception ignored) {}

            if (nextAlarm > 0) {
                logEvent(context, "watchdog", "alarme", "agendado",
                    "alarme no sistema", true, "");
            } else {
                logEvent(context, "watchdog", "alarme", "PERDIDO",
                    "alarme no sistema", false, "reagendando a partir das prefs...");
                // AUTO-CORREÇÃO: reagenda com a âncora salva
                try {
                    rescheduleFromPrefs(context);
                } catch (Exception e) {
                    logEvent(context, "watchdog", "alarme", "PERDIDO",
                        "reagendar", false, "falha: " + e.getMessage());
                }
            }

            // CHECK 3: Notificação fixa (id 999) presente na barra?
            boolean notifPresent = false;
            try {
                NotificationManager nm = (NotificationManager)
                    context.getSystemService(Context.NOTIFICATION_SERVICE);
                if (nm != null) {
                    android.service.notification.StatusBarNotification[] active =
                        nm.getActiveNotifications();
                    if (active != null) {
                        for (android.service.notification.StatusBarNotification n : active) {
                            if (n.getId() == 999) { notifPresent = true; break; }
                        }
                    }
                }
            } catch (Exception ignored) {}

            if (notifPresent) {
                logEvent(context, "watchdog", "notificacao_fixa", "presente",
                    "notificação 999 na barra", true, "");
            } else {
                logEvent(context, "watchdog", "notificacao_fixa", "SUMIDA",
                    "notificação 999 na barra", false,
                    serviceRunning ? "serviço ativo mas notificação ausente" : "serviço morto");
            }

            // CHECK 4: Versículo salvo para o widget existe? (dessincronização)
            try {
                android.content.SharedPreferences wprefs =
                    context.getSharedPreferences("luzdiaria_widget", Context.MODE_MULTI_PROCESS);
                String widgetVerse = wprefs.getString("lastVerse", "");
                if (widgetVerse == null || widgetVerse.isEmpty()) {
                    logEvent(context, "watchdog", "widget", "SEM_versiculo",
                        "widget com versículo salvo", false, "widget pode mostrar texto padrão");
                }
            } catch (Exception ignored) {}

            logEvent(context, "watchdog", "verificacao", "concluida",
                "ciclo completo monitorado", true, "");
            scheduleWatchdog(context);
        } catch (Exception e) {
            logEvent(context, "watchdog", "verificacao", "FALHA",
                "executar watchdog", false, e.getMessage());
            scheduleWatchdog(context);
        }
    }
}
