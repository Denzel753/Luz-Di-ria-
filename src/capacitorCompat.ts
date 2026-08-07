import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Share } from '@capacitor/share';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
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
  startForegroundService(options?: { verseText?: string; verseRef?: string }): Promise<void>;
  stopForegroundService(): Promise<void>;
  scheduleDailyAlarm(options: {
    hour: number;
    minute: number;
    endHour: number;
    endMinute: number;
    intervalMinutes: number;
    verseText: string;
    verseRef: string;
    vibrate: boolean;
    flashLed: boolean;
    wakeDevice: boolean;
  }): Promise<{ scheduled: boolean; nextFire: number; exact: boolean; intervalMinutes: number }>;
  cancelDailyAlarm(): Promise<void>;
  isServiceRunning(): Promise<{ running: boolean }>;
  getDiagnostics(): Promise<{
    serviceRunning: boolean;
    intervalMinutes: number;
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
    configured: boolean;
    nextAlarm: number;
    diagLog: string;
    widgetCount: number;
    widgetVerse: string;
    eventLog: string;
    dispositivo: { fabricante: string; modelo: string; android: string; sdk: number; app: string };
  }>;
  testAlarmInOneMinute(): Promise<{ scheduled: boolean; fireAt: number }>;
  updateWidgetVerse(options: { verseText: string; verseRef: string }): Promise<{ updated: number }>;
  getCurrentVerse(): Promise<{ verseText: string; verseRef: string }>;
  logEvent(options: { opcao: string; acao: string; valor: string; esperado: string; ok: boolean; detalhe: string }): Promise<void>;
  testVibrate(): Promise<void>;
  testWakeDevice(): Promise<void>;
  testFlashLed(): Promise<void>;
}

const VerseAlarm = registerPlugin<VerseAlarmPlugin>('VerseAlarm');

// ============================================================
// PERMISSÕES NATIVAS (plugin NativeSettings)
// Abre as telas do sistema para o usuário conceder permissão.
// ============================================================

export interface NativeSettingsPlugin {
  requestBatteryOptimizationPermission(): Promise<void>;
  requestExactAlarmPermission(): Promise<void>;
  openNotificationSettings(): Promise<void>;
  getPermissionsStatus(): Promise<{
    notifications: boolean;
    battery: boolean;
    exactAlarm: boolean;
  }>;
}

const NativeSettings = registerPlugin<NativeSettingsPlugin>('NativeSettings');

export async function requestBatteryPermission() {
  if (!isNative()) return;
  // Se já está ignorando otimização, não abre a tela de novo
  try {
    const status = await getPermissionsStatus();
    if (status.battery) return;
  } catch (e) { /* segue */ }
  try { await NativeSettings.requestBatteryOptimizationPermission(); }
  catch (e) { console.error('Erro bateria:', e); }
}

// Status REAL de todas as permissões (para exibir verde quando habilitada)
export async function getPermissionsStatus() {
  if (!isNative()) {
    return {
      notifications: typeof Notification !== 'undefined' && Notification.permission === 'granted',
      battery: false,
      exactAlarm: false,
    };
  }
  try {
    return await NativeSettings.getPermissionsStatus();
  } catch (e) {
    console.error('Erro ao verificar permissões:', e);
    return { notifications: false, battery: false, exactAlarm: false };
  }
}

export async function requestExactAlarmPermission() {
  if (!isNative()) return;
  try { await NativeSettings.requestExactAlarmPermission(); }
  catch (e) { console.error('Erro alarme exato:', e); }
}

// Abre as Configurações do app no Android (para o caso de permissão
// negada permanentemente — depois de 2 recusas o diálogo não volta).
export async function openNotificationSettings() {
  if (!isNative()) return;
  try { await NativeSettings.openNotificationSettings(); }
  catch (e) { console.error('Erro abrir configs:', e); }
}

export async function requestNotificationPermission() {
  if (!isNative()) {
    if ('Notification' in window) {
      return (await Notification.requestPermission()) === 'granted';
    }
    return false;
  }
  try {
    // Se já concedida (Android 13+), NÃO reabre o diálogo do sistema —
    // evita a tela/faixa estranha que aparecia ao clicar de novo
    const status = await getPermissionsStatus();
    if (status.notifications) return true;
    const perm = await LocalNotifications.requestPermissions();
    return perm.display === 'granted';
  } catch (e) {
    console.error('Erro notificação:', e);
    return false;
  }
}

export async function startNativeService(verseText?: string, verseRef?: string) {
  if (!isNative()) return;
  try {
    await VerseAlarm.startForegroundService({ verseText, verseRef });
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

export async function scheduleDailyVerse(hour: number, minute: number, endHour: number, endMinute: number, intervalMinutes: number, verseText: string, verseRef: string, vibrate: boolean, flashLed: boolean, wakeDevice: boolean) {
  if (!isNative()) return { scheduled: false, exact: false, intervalMinutes };
  try {
    return await VerseAlarm.scheduleDailyAlarm({ hour, minute, endHour, endMinute, intervalMinutes, verseText, verseRef, vibrate, flashLed, wakeDevice });
  } catch (e) {
    console.error('Erro ao agendar alarme nativo:', e);
    return { scheduled: false, exact: false, intervalMinutes };
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

// Atualiza o widget da tela inicial com o versículo/frase do momento.
// Chamado sempre que o versículo muda (sortear, alarme, horário).
export async function updateWidgetVerse(verseText: string, verseRef: string) {
  if (!isNative()) return;
  try {
    await VerseAlarm.updateWidgetVerse({ verseText, verseRef });
  } catch (e) {
    console.error('Erro ao atualizar widget:', e);
  }
}

// LÊ o versículo que o NATIVO escolheu (fonte única de verdade).
// O motor JS usa este valor para a tela — sem sortear um segundo.
export async function getCurrentVerse() {
  if (!isNative()) return { verseText: '', verseRef: '' };
  try {
    return await VerseAlarm.getCurrentVerse();
  } catch (e) {
    console.error('Erro ao ler versículo nativo:', e);
    return { verseText: '', verseRef: '' };
  }
}

// TESTE imediato: vibra o dispositivo (confirma a opção "Vibrar")
export async function testVibrate() {
  if (!isNative()) return;
  try { await VerseAlarm.testVibrate(); }
  catch (e) { console.error('Erro teste vibrar:', e); }
}

// TESTE imediato: acende a tela (confirma a opção "Acorde o dispositivo")
export async function testWakeDevice() {
  if (!isNative()) return;
  try { await VerseAlarm.testWakeDevice(); }
  catch (e) { console.error('Erro teste acordar:', e); }
}

// TESTE imediato: pisca o flash LED (confirma a opção "Flash o LED")
export async function testFlashLed() {
  if (!isNative()) return;
  try { await VerseAlarm.testFlashLed(); }
  catch (e) { console.error('Erro teste flash:', e); }
}

// Verifica se o Foreground Service está rodando (detecta app morto pelo sistema)
export async function isServiceRunning(): Promise<boolean> {
  if (!isNative()) return false;
  try {
    const res = await VerseAlarm.isServiceRunning();
    return res.running;
  } catch (e) {
    console.error('Erro verificar serviço:', e);
    return false;
  }
}

// DIAGNÓSTICO (Etapa 1): estado REAL de tudo — alarme agendado, janela,
// serviço, log de disparos. Mostra em qual elo da corrente está quebrando.
export async function getDiagnostics() {
  if (!isNative()) {
    return {
      serviceRunning: false, intervalMinutes: 0, startHour: 8, startMinute: 0,
      endHour: 23, endMinute: 59, configured: false, nextAlarm: 0, diagLog: '',
      widgetCount: 0, widgetVerse: '', eventLog: '',
      dispositivo: { fabricante: '', modelo: '', android: '', sdk: 0, app: '' }, 
    };
  }
  try {
    return await VerseAlarm.getDiagnostics();
  } catch (e) {
    console.error('Erro ao obter diagnóstico:', e);
    return {
      serviceRunning: false, intervalMinutes: 0, startHour: 8, startMinute: 0,
      endHour: 23, endMinute: 59, configured: false, nextAlarm: 0, diagLog: '',
      widgetCount: 0, widgetVerse: '', eventLog: '',
      dispositivo: { fabricante: '', modelo: '', android: '', sdk: 0, app: '' }, 
    };
  }
}

// TESTE ISOLADO (Etapa 3): agenda o alarme para 1 min com forceShow
// (ignora a janela). Se disparar e o normal não, o problema é a janela.
export async function testAlarmInOneMinute() {
  if (!isNative()) return { scheduled: false, fireAt: 0 };
  try {
    return await VerseAlarm.testAlarmInOneMinute();
  } catch (e) {
    console.error('Erro ao agendar teste:', e);
    return { scheduled: false, fireAt: 0 };
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

      // 1. Notificação FIXA via plugin — aparece IMEDIATAMENTE na barra,
      //    com ongoing=true (FLAG_ONGOING_EVENT | FLAG_NO_CLEAR: não some
      //    nem pode ser deslizada). Id fixo 999 = sempre substitui a mesma.
      await LocalNotifications.schedule({
        notifications: [
          {
            id: 999,
            title,
            body,
            ongoing: true,
            autoCancel: false,
            smallIcon: 'ic_stat_notification',
            channelId: 'luz-diaria',
            sound: null,
            silent: true,
          },
        ],
      });

      // 2. Foreground Service em paralelo — mantém o app vivo e reforça a
      //    permanência (se o serviço iniciar bem, ele também posta a fixa).
      await startNativeService(body, title);
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

// ============================================================
// LOG DE RASTREIO (JS) — mesma língua do nativo
// ============================================================

// Exporta o JSON de diagnóstico como ARQUIVO REAL no Android:
// 1. Grava o JSON em arquivo (Filesystem, diretório Cache)
// 2. Abre o share sheet com o arquivo (Drive, Downloads, WhatsApp...)
// Retorna true se conseguiu exportar/compartilhar.
export async function exportDiagnosticoJson(dados: unknown): Promise<boolean> {
  if (isNative()) {
    try {
      const json = JSON.stringify(dados, null, 2);
      const nome = `diagnostico_luz_diaria_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.json`;
      // 1. Grava em arquivo no diretório Cache do app
      const result = await Filesystem.writeFile({
        path: nome,
        data: json,
        directory: Directory.Cache,
        encoding: Encoding.UTF8,
      });
      const uri = result.uri;
      // 2. Abre o share sheet com o arquivo — o usuário salva onde quiser
      //    (Drive, Downloads, Telegram, WhatsApp...) ou toca em "Salvar".
      await Share.share({
        title: 'Diagnóstico Luz Diária',
        text: 'Arquivo de diagnóstico do app Luz Diária',
        url: uri,
        dialogTitle: 'Salvar / compartilhar diagnóstico',
      });
      return true;
    } catch (e) {
      console.error('Erro exportar JSON nativo:', e);
      // Fallback: compartilha o texto puro
      try {
        await Share.share({
          title: 'Diagnóstico Luz Diária',
          text: JSON.stringify(dados, null, 2),
          dialogTitle: 'Compartilhar diagnóstico',
        });
        return true;
      } catch (e2) {
        console.error('Erro fallback share:', e2);
        return false;
      }
    }
  } else {
    // Web: download via blob (funciona em navegador)
    try {
      const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `diagnostico_luz_diaria_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return true;
    } catch (e) {
      console.error('Erro exportar JSON web:', e);
      return false;
    }
  }
}

// Grava um evento de rastreio no MESMO formato do nativo (prefs
// luzdiaria_eventos, via plugin). Assim o Exportar JSON tem TUDO
// junto: eventos do motor nativo + interações/erros do JS.
export async function logEventJs(opcao: string, acao: string, valor: string,
                                 esperado: string, ok: boolean, detalhe: string = '') {
  if (!isNative()) return;
  try {
    await VerseAlarm.logEvent({ opcao, acao, valor, esperado, ok, detalhe });
  } catch (e) {
    console.error('Erro logEvent:', e);
  }
}

// CAPTURA DE ERROS JS (melhor prática): window.onerror + unhandledrejection
// gravam QUALQUER erro de JavaScript no log de eventos — sem isso, erros
// do React (render, handlers, async) são invisíveis no diagnóstico.
let jsErrorHooksInstalled = false;
export function installJsErrorHooks() {
  if (jsErrorHooksInstalled) return;
  jsErrorHooksInstalled = true;

  if (typeof window !== 'undefined') {
    // Erros síncronos e de handler (window.onerror)
    window.addEventListener('error', (event) => {
      const msg = event.message || 'erro desconhecido';
      const loc = event.filename || '';
      const line = event.lineno || 0;
      logEventJs('js', 'erro_nao_tratado', `${msg} @ ${loc}:${line}`,
        'app continua', false, 'window.onerror').catch(() => {});
    });

    // Promises rejeitadas não tratadas (erros async)
    window.addEventListener('unhandledrejection', (event) => {
      const reason = event.reason?.message || String(event.reason || 'promise rejeitada');
      logEventJs('js', 'promise_rejeitada', reason,
        'app continua', false, 'unhandledrejection').catch(() => {});
    });
  }
}
