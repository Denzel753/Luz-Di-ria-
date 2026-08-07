import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Share } from '@capacitor/share';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { registerPlugin } from '@capacitor/core';

/**
 * Camada de compatibilidade: usa plugins nativos do Capacitor quando o app
 * roda no Android (APK) e cai para as APIs web no navegador.
 * Todas as funções têm fallback — nunca quebram em nenhum ambiente.
 */

const isNative = () => Capacitor.isNativePlatform();

// ============================================================
// ALARME DIÁRIO + FOREGROUND SERVICE (plugin nativo VerseAlarm)
// Mantém o app vivo e agenda o versículo no horário exato.
// ============================================================

export interface VerseAlarmPlugin {
  startForegroundService(): Promise<void>;
  stopForegroundService(): Promise<void>;
  scheduleDailyAlarm(options: {
    hour: number;
    minute: number;
    verseText: string;
    verseRef: string;
  }): Promise<{ scheduled: boolean; nextFire: number; exact: boolean }>;
  cancelDailyAlarm(): Promise<void>;
}

const VerseAlarm = registerPlugin<VerseAlarmPlugin>('VerseAlarm');

export async function startNativeService() {
  if (!isNative()) return;
  try {
    await VerseAlarm.startForegroundService();
  } catch (e) {
    console.error('Erro ao iniciar serviço nativo:', e);
  }
}

export async function stopNativeService() {
  if (!isNative()) return;
  try {
    await VerseAlarm.stopForegroundService();
  } catch (e) {
    console.error('Erro ao parar serviço nativo:', e);
  }
}

export async function scheduleDailyVerse(hour: number, minute: number, verseText: string, verseRef: string) {
  if (!isNative()) return { scheduled: false, exact: false };
  try {
    return await VerseAlarm.scheduleDailyAlarm({ hour, minute, verseText, verseRef });
  } catch (e) {
    console.error('Erro ao agendar alarme nativo:', e);
    return { scheduled: false, exact: false };
  }
}

export async function cancelDailyVerse() {
  if (!isNative()) return;
  try {
    await VerseAlarm.cancelDailyAlarm();
  } catch (e) {
    console.error('Erro ao cancelar alarme nativo:', e);
  }
}

// ============================================================
// NOTIFICAÇÕES (substitui new Notification() da web)
// ============================================================

export async function showPersistentNotification(title: string, body: string) {
  if (isNative()) {
    try {
      // Solicita permissão na primeira vez (Android 13+ exige)
      const perm = await LocalNotifications.requestPermissions();
      if (perm.display !== 'granted') return;

      await LocalNotifications.schedule({
        notifications: [
          {
            id: 999, // id fixo = substitui a notificação persistente anterior
            title,
            body,
            smallIcon: 'ic_stat_notification',
            iconColor: '#EA580C',
            channelId: 'luz-diaria',
            ongoing: true, // persistente, fica na barra
            autoCancel: false,
            sound: null,
          },
        ],
      });
    } catch (e) {
      console.error('Erro notificação nativa:', e);
    }
  } else {
    // Fallback web
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          tag: 'persistent-verse',
          icon: '/notification-icon.svg',
          requireInteraction: true,
          silent: true,
        });
      } catch (e) {
        console.error('Erro notificação web:', e);
      }
    }
  }
}

export async function clearPersistentNotification() {
  if (isNative()) {
    try {
      await LocalNotifications.cancel({ notifications: [{ id: 999 }] });
    } catch (e) {
      console.error('Erro cancelar notificação:', e);
    }
  }
}

// ============================================================
// COMPARTILHAR (substitui navigator.share)
// ============================================================

export async function shareText(title: string, text: string) {
  if (isNative()) {
    try {
      await Share.share({ title, text });
      return true;
    } catch (e: any) {
      // Usuário cancelou — comportamento normal
      if (e?.message?.includes('cancel') || e?.message?.includes('abort')) {
        return false;
      }
      console.error('Erro share nativo:', e);
      return false;
    }
  }
  // Web: usa navigator.share se existir, senão copia
  if (navigator.share) {
    try {
      await navigator.share({ title, text });
      return true;
    } catch (e: any) {
      if (e?.name !== 'AbortError' && !e?.message?.includes('cancel')) {
        console.error('Erro share web:', e);
      }
      return false;
    }
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    console.error('Erro copiar:', e);
    return false;
  }
}

export async function shareImage(title: string, text: string, file: File) {
  if (isNative()) {
    try {
      const base64 = await fileToBase64(file);
      await Share.share({
        title,
        text,
        files: [base64],
        dialogTitle: 'Compartilhar versículo',
      });
      return true;
    } catch (e: any) {
      if (e?.message?.includes('cancel') || e?.message?.includes('abort')) {
        return false;
      }
      console.error('Erro share imagem nativo:', e);
      return false;
    }
  }
  // Web
  if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title, text });
      return true;
    } catch (e: any) {
      if (e?.name !== 'AbortError' && !e?.message?.includes('cancel')) {
        console.error('Erro share imagem web:', e);
      }
      return false;
    }
  }
  return false;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ============================================================
// VIBRAÇÃO (substitui navigator.vibrate)
// ============================================================

export async function vibrate(pattern: number[] = [200, 100, 200]) {
  if (isNative()) {
    try {
      // Haptics não suporta pattern; vibra no primeiro intervalo
      await Haptics.vibrate({ duration: pattern[0] || 200 });
      // Opcional: impact style para feedback mais rico
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (e) {
      console.error('Erro haptics nativo:', e);
    }
  } else if (navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      console.error('Erro vibrate web:', e);
    }
  }
}

// ============================================================
// CLIPBOARD (helper)
// ============================================================

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    console.error('Erro clipboard:', e);
    return false;
  }
}
