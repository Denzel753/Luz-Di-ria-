package com.luzdiaria.versiculos;

import android.content.Context;
import android.os.Build;
import android.os.Process;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * CAPTURA DE CRASH (melhor prática — padrão Crashlytics/Sentry):
 * Qualquer exceção NÃO tratada (crash do app) é capturada aqui, o stack
 * trace completo + estado é gravado no log de eventos ANTES do app fechar.
 * Sem isso, um crash é invisível no log — o Android só fecha o app.
 *
 * Instalado no VerseAlarmPlugin (estático, na primeira chamada de qualquer
 * método) e no MainActivity.
 */
public class CrashHandler implements Thread.UncaughtExceptionHandler {

    private static volatile boolean installed = false;
    private final Context context;

    private CrashHandler(Context context) {
        this.context = context.getApplicationContext();
    }

    /** Instala o handler global de crash (idempotente — só uma vez). */
    public static synchronized void install(Context context) {
        if (installed) return;
        installed = true;
        final Context appContext = context.getApplicationContext();
        Thread.UncaughtExceptionHandler defaultHandler =
            Thread.getDefaultUncaughtExceptionHandler();
        Thread.setDefaultUncaughtExceptionHandler(
            new Thread.UncaughtExceptionHandler() {
                @Override
                public void uncaughtException(Thread thread, Throwable throwable) {
                    try {
                        writeCrash(appContext, thread, throwable);
                    } catch (Exception ignored) {}
                    // Delega ao handler padrão (fecha o app normalmente)
                    if (defaultHandler != null) {
                        defaultHandler.uncaughtException(thread, throwable);
                    } else {
                        Process.killProcess(Process.myPid());
                    }
                }
            }
        );
    }

    @Override
    public void uncaughtException(Thread thread, Throwable throwable) {
        try {
            writeCrash(context, thread, throwable);
        } catch (Exception ignored) {}
    }

    /** Grava o crash no log de eventos com stack trace + estado do app. */
    private static void writeCrash(Context ctx, Thread thread, Throwable throwable) {
        try {
            StringWriter sw = new StringWriter();
            PrintWriter pw = new PrintWriter(sw);
            throwable.printStackTrace(pw);
            String stack = sw.toString();

            String ts = new SimpleDateFormat("dd/MM HH:mm:ss", Locale.getDefault())
                .format(new Date());
            // Níveis de severidade: [ERRO] — stack trace com quebras de linha
            String entry = ts + " [ERRO] crash | NAO_TRATADO | " + thread.getName()
                + " | esperado:app continua | " + stack.replace("\n", "\\n");

            android.content.SharedPreferences prefs =
                ctx.getSharedPreferences("luzdiaria_eventos", Context.MODE_PRIVATE);
            String existing = prefs.getString("events", "");
            existing = entry + "\n" + existing;
            String[] lines = existing.split("\n");
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < Math.min(lines.length, 60); i++) {
                if (!lines[i].isEmpty()) sb.append(lines[i]).append("\n");
            }
            prefs.edit().putString("events", sb.toString()).apply();
        } catch (Exception ignored) {}
    }
}
