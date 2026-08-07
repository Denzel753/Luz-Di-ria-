package com.luzdiaria.versiculos;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.webkit.JavascriptInterface;

/**
 * Ponte nativa exposta ao JavaScript como window.Android.
 * Cada método abre a tela de permissão correspondente do Android.
 * Todos rodam na UI thread (runOnUiThread) e tratam exceções para
 * nunca travar o app quando a Intent não existe no dispositivo.
 */
public class NativeBridge {

    private final Activity activity;

    public NativeBridge(Activity activity) {
        this.activity = activity;
    }

    @JavascriptInterface
    public void requestBatteryOptimization() {
        runOnUi(new Runnable() {
            @Override
            public void run() {
                try {
                    Intent intent = new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
                    intent.setData(Uri.parse("package:" + activity.getPackageName()));
                    activity.startActivity(intent);
                } catch (ActivityNotFoundException e) {
                    openFallback();
                } catch (Exception e) {
                    // Nunca deixar o app travar
                }
            }
        });
    }

    @JavascriptInterface
    public void requestOverlayPermission() {
        runOnUi(new Runnable() {
            @Override
            public void run() {
                try {
                    Intent intent = new Intent(
                        Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                        Uri.parse("package:" + activity.getPackageName())
                    );
                    activity.startActivity(intent);
                } catch (ActivityNotFoundException e) {
                    openFallback();
                } catch (Exception e) {
                    // Nunca deixar o app travar
                }
            }
        });
    }

    @JavascriptInterface
    public void requestExactAlarmPermission() {
        runOnUi(new Runnable() {
            @Override
            public void run() {
                try {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                        // Android 12+: tela dedicada de alarmes exatos
                        Intent intent = new Intent(
                            Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM,
                            Uri.parse("package:" + activity.getPackageName())
                        );
                        activity.startActivity(intent);
                    } else {
                        // Android < 12: detalhes do app
                        openAppDetails();
                    }
                } catch (ActivityNotFoundException e) {
                    openFallback();
                } catch (Exception e) {
                    // Nunca deixar o app travar
                }
            }
        });
    }

    @JavascriptInterface
    public void requestAccessibilityPermission() {
        runOnUi(new Runnable() {
            @Override
            public void run() {
                try {
                    Intent intent = new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS);
                    activity.startActivity(intent);
                } catch (ActivityNotFoundException e) {
                    openFallback();
                } catch (Exception e) {
                    // Nunca deixar o app travar
                }
            }
        });
    }

    @JavascriptInterface
    public void openNotificationSettings() {
        runOnUi(new Runnable() {
            @Override
            public void run() {
                try {
                    Intent intent = new Intent();
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        // Android 8+: tela de notificações específica do app
                        intent.setAction(Settings.ACTION_APP_NOTIFICATION_SETTINGS);
                        intent.putExtra(Settings.EXTRA_APP_PACKAGE, activity.getPackageName());
                    } else {
                        // Android < 8: detalhes do app
                        intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                        intent.setData(Uri.parse("package:" + activity.getPackageName()));
                    }
                    activity.startActivity(intent);
                } catch (ActivityNotFoundException e) {
                    openFallback();
                } catch (Exception e) {
                    // Nunca deixar o app travar
                }
            }
        });
    }

    // --- Utilitários ---

    private void openAppDetails() {
        try {
            Intent intent = new Intent(
                Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
                Uri.parse("package:" + activity.getPackageName())
            );
            activity.startActivity(intent);
        } catch (Exception e) {
            // Nunca deixar o app travar
        }
    }

    private void openFallback() {
        openAppDetails();
    }

    private void runOnUi(Runnable r) {
        if (activity != null) {
            activity.runOnUiThread(r);
        }
    }
}
