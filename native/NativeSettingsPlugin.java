package com.luzdiaria.versiculos;

import android.content.ActivityNotFoundException;
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

    // Verifica o status REAL de TODAS as permissões do sistema.
    // Retorna um objeto com cada permissão e se está concedida.
    @PluginMethod
    public void getPermissionsStatus(PluginCall call) {
        try {
            android.content.Context ctx = getContext();

            // 1. Notificações (Android 13+)
            boolean notif = true;
            try {
                android.app.NotificationManager nm =
                    (android.app.NotificationManager) ctx.getSystemService(android.content.Context.NOTIFICATION_SERVICE);
                if (nm != null) notif = nm.areNotificationsEnabled();
            } catch (Exception e) { notif = true; }

            // 2. Otimização de bateria
            boolean battery = true;
            try {
                android.os.PowerManager pm =
                    (android.os.PowerManager) ctx.getSystemService(android.content.Context.POWER_SERVICE);
                if (pm != null) battery = pm.isIgnoringBatteryOptimizations(ctx.getPackageName());
            } catch (Exception e) { battery = true; }

            // 3. Alarmes exatos (Android 12+)
            boolean exactAlarm = true;
            try {
                android.app.AlarmManager am =
                    (android.app.AlarmManager) ctx.getSystemService(android.content.Context.ALARM_SERVICE);
                if (am != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                    exactAlarm = am.canScheduleExactAlarms();
                }
            } catch (Exception e) { exactAlarm = true; }

            JSObject result = new JSObject();
            result.put("notifications", notif);
            result.put("battery", battery);
            result.put("exactAlarm", exactAlarm);
            call.resolve(result);
        } catch (Exception e) {
            call.reject("Erro ao verificar permissões", e);
        }
    }

    // Abre a página de detalhes do app (onde o usuário desbloqueia permissões
    // restritas em Android 13+/fabricantes como Motorola)
    @PluginMethod
    public void openAppDetails(PluginCall call) {
        try {
            Intent details = new Intent(
                Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
                Uri.parse("package:" + getContext().getPackageName())
            );
            getActivity().startActivity(details);
            call.resolve();
        } catch (Exception e) {
            call.reject("Falha ao abrir detalhes do app", e);
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
