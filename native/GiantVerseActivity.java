package com.luzdiaria.versiculos;

import android.app.Activity;
import android.graphics.Color;
import android.graphics.Typeface;
import android.os.Build;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

/**
 * Pop-up Gigante NATIVO: acorda a tela e mostra o versículo em tela cheia,
 * mesmo com o app fechado ou o celular bloqueado.
 *
 * Lançado pelo VerseAlarmReceiver no horário agendado.
 * Requer permissão SYSTEM_ALERT_WINDOW (sobrepor outros apps) para
 * aparecer por cima de outros aplicativos em versões antigas; no Android
 * 10+ uma Activity com showWhenLocked/turnScreenOn já aparece na tela de
 * bloqueio por cima do que estiver ativo.
 */
public class GiantVerseActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 1. Acorda o dispositivo e mostra sobre a tela de bloqueio.
        // Padrão do AMdroid/AlarmClock (app de alarme de referência):
        // setShowWhenLocked/setTurnScreenOn para API 27+, MAS também adiciona
        // TODOS os flags deprecated em QUALQUER API — em alguns aparelhos
        // (Motorola!) os métodos novos não bastam, os flags antigos são
        // necessários. FLAG_ALLOW_LOCK_WHILE_SCREEN_ON mantém a tela acesa
        // mesmo com o lock ativo.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true);
            setTurnScreenOn(true);
        }
        Window win = getWindow();
        win.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        win.addFlags(WindowManager.LayoutParams.FLAG_ALLOW_LOCK_WHILE_SCREEN_ON);
        win.addFlags(WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED);
        win.addFlags(WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON);
        win.addFlags(WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD);

        // 2. Recebe o versículo vindo do alarme
        String verseText = getIntent().getStringExtra("verseText");
        String verseRef = getIntent().getStringExtra("verseRef");
        if (verseText == null) verseText = "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito...";
        if (verseRef == null) verseRef = "João 3:16";

        // 3. Monta a tela (design simples: fundo escuro, texto claro, botão laranja)
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setGravity(Gravity.CENTER);
        root.setBackgroundColor(Color.parseColor("#0F172A"));
        root.setPadding(dp(32), dp(48), dp(32), dp(48));

        // Título
        TextView title = new TextView(this);
        title.setText("Versículo do Dia");
        title.setTextColor(Color.parseColor("#FBBF24"));
        title.setTextSize(18);
        title.setTypeface(Typeface.DEFAULT_BOLD);
        title.setGravity(Gravity.CENTER);
        root.addView(title, lpWrap());

        // Espaço
        root.addView(spacer(24));

        // Texto do versículo
        TextView verse = new TextView(this);
        verse.setText("\u201C" + verseText + "\u201D");
        verse.setTextColor(Color.WHITE);
        verse.setTextSize(26);
        verse.setTypeface(Typeface.DEFAULT_BOLD);
        verse.setGravity(Gravity.CENTER);
        verse.setLineSpacing(dp(6), 1.0f);
        root.addView(verse, lpWrap());

        // Espaço
        root.addView(spacer(16));

        // Referência
        TextView ref = new TextView(this);
        ref.setText(verseRef);
        ref.setTextColor(Color.parseColor("#CBD5E1"));
        ref.setTextSize(16);
        ref.setGravity(Gravity.CENTER);
        root.addView(ref, lpWrap());

        // Espaço
        root.addView(spacer(40));

        // Botão Concluído (laranja, padrão do app)
        Button btn = new Button(this);
        btn.setText("Concluído");
        btn.setTextColor(Color.WHITE);
        btn.setTextSize(16);
        btn.setAllCaps(false);
        btn.setTypeface(Typeface.DEFAULT_BOLD);
        btn.setBackgroundColor(Color.parseColor("#EA580C"));
        btn.setPadding(dp(40), dp(16), dp(40), dp(16));
        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        LinearLayout btnWrap = new LinearLayout(this);
        btnWrap.setGravity(Gravity.CENTER);
        btnWrap.addView(btn, lpWrap());
        root.addView(btnWrap);

        setContentView(root);

        // AUTO-FECHAR: se ninguém tocar, fecha sozinho após 60s — evita a
        // tela ficar acesa para sempre (padrão de auto-silêncio do AMdroid).
        // Se o usuário tocar em qualquer lugar, o timer é cancelado.
        final android.os.Handler autoCloseHandler = new android.os.Handler(
            android.os.Looper.getMainLooper());
        final Runnable autoCloseRunnable = new Runnable() {
            @Override
            public void run() {
                finish();
            }
        };
        autoCloseHandler.postDelayed(autoCloseRunnable, 60 * 1000L);

        View.OnTouchListener cancelAutoClose = new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, android.view.MotionEvent event) {
                autoCloseHandler.removeCallbacks(autoCloseRunnable);
                return false;
            }
        };
        root.setOnTouchListener(cancelAutoClose);
    }

    private int dp(int v) {
        return Math.round(v * getResources().getDisplayMetrics().density);
    }

    private LinearLayout.LayoutParams lpWrap() {
        return new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
    }

    private View spacer(int h) {
        View v = new View(this);
        v.setLayoutParams(new LinearLayout.LayoutParams(1, dp(h)));
        return v;
    }
}
