package com.luzdiaria.versiculos;

import android.content.ActivityNotFoundException;
import android.content.ComponentName;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Plugin Capacitor para abrir telas de permissão do Android.
 * Substitui o objeto window.Android usado na versão web.
 */
@CapacitorPlugin(name = "NativeSettings")
public class NativeSettingsPlugin extends Plugin {

    @PluginMethod
    public void requestBatteryOptimizationPermission(PluginCall call) {
        try {
            Intent intent = new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
            intent.setData(Uri.parse("package:" + getContext().getPackageName()));
            getActivity().startActivity(intent);
            call.resolve();
        } catch (ActivityNotFoundException e) {
            // Dispositivo não suporta a tela — tenta a lista geral de otimização
            try {
                Intent fallback = new Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS);
                getActivity().startActivity(fallback);
                call.resolve();
            } catch (Exception ex) {
                call.reject("Battery optimization settings not available", ex);
            }
        } catch (Exception e) {
            call.reject("Failed to open battery optimization settings", e);
        }
    }

    @PluginMethod
    public void requestOverlayPermission(PluginCall call) {
        try {
            Intent intent = new Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:" + getContext().getPackageName())
            );
            getActivity().startActivity(intent);
            call.resolve();
        } catch (ActivityNotFoundException e) {
            try {
                Intent fallback = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION);
                getActivity().startActivity(fallback);
                call.resolve();
            } catch (Exception ex) {
                call.reject("Overlay permission settings not available", ex);
            }
        } catch (Exception e) {
            call.reject("Failed to open overlay permission settings", e);
        }
    }

    @PluginMethod
    public void requestExactAlarmPermission(PluginCall call) {
        try {
            // API 31+ (Android 12+): SCHEDULE_EXACT_ALARM vai direto para as configurações do app
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                Intent intent = new Intent(
                    Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM,
                    Uri.parse("package:" + getContext().getPackageName())
                );
                getActivity().startActivity(intent);
            } else {
                // Versões antigas: abre as configurações do app (aba "Alarmes e lembretes" em alguns)
                Intent intent = new Intent(
                    Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
                    Uri.parse("package:" + getContext().getPackageName())
                );
                getActivity().startActivity(intent);
            }
            call.resolve();
        } catch (ActivityNotFoundException e) {
            try {
                Intent fallback = new Intent(
                    Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
                    Uri.parse("package:" + getContext().getPackageName())
                );
                getActivity().startActivity(fallback);
                call.resolve();
            } catch (Exception ex) {
                call.reject("Exact alarm settings not available", ex);
            }
        } catch (Exception e) {
            call.reject("Failed to open exact alarm settings", e);
        }
    }

    @PluginMethod
    public void requestAccessibilityPermission(PluginCall call) {
        try {
            Intent intent = new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS);
            getActivity().startActivity(intent);
            call.resolve();
        } catch (ActivityNotFoundException e) {
            // Fallback: configurações gerais do app
            try {
                Intent fallback = new Intent(
                    Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
                    Uri.parse("package:" + getContext().getPackageName())
                );
                getActivity().startActivity(fallback);
                call.resolve();
            } catch (Exception ex) {
                call.reject("Accessibility settings not available", ex);
            }
        } catch (Exception e) {
            call.reject("Failed to open accessibility settings", e);
        }
    }

    @PluginMethod
    public void openNotificationSettings(PluginCall call) {
        try {
            Intent intent = new Intent();
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                // Android 8+: tela de notificações do app
                intent.setAction(Settings.ACTION_APP_NOTIFICATION_SETTINGS);
                intent.putExtra(Settings.EXTRA_APP_PACKAGE, getContext().getPackageName());
            } else {
                // Versões antigas: detalhes do app
                intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                intent.setData(Uri.parse("package:" + getContext().getPackageName()));
            }
            getActivity().startActivity(intent);
            call.resolve();
        } catch (ActivityNotFoundException e) {
            try {
                Intent fallback = new Intent(
                    Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
                    Uri.parse("package:" + getContext().getPackageName())
                );
                getActivity().startActivity(fallback);
                call.resolve();
            } catch (Exception ex) {
                call.reject("Notification settings not available", ex);
            }
        } catch (Exception e) {
            call.reject("Failed to open notification settings", e);
        }
    }
}
