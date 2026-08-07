import { registerPlugin, Capacitor } from '@capacitor/core';

/**
 * Interface do plugin nativo NativeSettings (Capacitor).
 * As funções abrem as telas de permissão do Android via Intents nativos.
 */
export interface NativeSettingsPlugin {
  requestBatteryOptimizationPermission(): Promise<void>;
  requestOverlayPermission(): Promise<void>;
  requestExactAlarmPermission(): Promise<void>;
  requestAccessibilityPermission(): Promise<void>;
  openNotificationSettings(): Promise<void>;
}

/**
 * Registra o plugin. Se não estiver disponível (ambiente web / navegador),
 * o Capacitor lança erro ao chamar — por isso o wrapper abaixo trata isso
 * com o mesmo comportamento de fallback da versão web (alert + console.log).
 */
const NativeSettings = registerPlugin<NativeSettingsPlugin>('NativeSettings');

/**
 * Wrapper com fallback para ambiente web.
 * Mantém a mesma interface do objeto window.Android anterior,
 * então o restante do app não precisa de mudanças.
 */
export const AndroidNative = {
  isAndroid: () => {
    return Capacitor.isNativePlatform() || /android/i.test(navigator.userAgent);
  },

  requestBatteryOptimizationPermission: async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        await NativeSettings.requestBatteryOptimizationPermission();
      } catch (e) {
        console.error('Erro ao abrir otimização de bateria:', e);
      }
    } else {
      console.log('Ambiente Web: Pedido de permissão para desativar otimização de bateria (ignorar economia de energia) disparado. Isso funcionará nativamente no APK.');
      alert('Funcionalidade nativa do Android: Desativar Otimização de Bateria.\n\nNo APK final, esta ação abrirá as configurações do Android para permitir que o app rode em segundo plano sem restrições.');
    }
  },

  requestOverlayPermission: async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        await NativeSettings.requestOverlayPermission();
      } catch (e) {
        console.error('Erro ao abrir sobreposição de tela:', e);
      }
    } else {
      console.log('Ambiente Web: Pedido de permissão para sobreposição de tela disparado. Isso funcionará nativamente no APK.');
      alert('Funcionalidade nativa do Android: Sobrepor outros apps.\n\nNo APK final, esta ação abrirá as configurações do Android para permitir que o app exiba pop-ups gigantes sobre outros aplicativos.');
    }
  },

  requestExactAlarmPermission: async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        await NativeSettings.requestExactAlarmPermission();
      } catch (e) {
        console.error('Erro ao abrir alarmes exatos:', e);
      }
    } else {
      console.log('Ambiente Web: Pedido de permissão para alarmes exatos disparado. Isso funcionará nativamente no APK.');
      alert('Funcionalidade nativa do Android: Alarmes Exatos.\n\nNo APK final, esta ação abrirá as configurações do Android para permitir que o app agende notificações precisas no horário exato.');
    }
  },

  requestAccessibilityPermission: async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        await NativeSettings.requestAccessibilityPermission();
      } catch (e) {
        console.error('Erro ao abrir acessibilidade:', e);
      }
    } else {
      console.log('Ambiente Web: Pedido de permissão de acessibilidade disparado. Isso funcionará nativamente no APK.');
      alert('Funcionalidade nativa do Android: Acessibilidade.\n\nNo APK final, esta ação abrirá as configurações do Android para permitir que o app tenha mais poder de notificação e atuação sobre o sistema.');
    }
  },

  openNotificationSettings: async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        await NativeSettings.openNotificationSettings();
      } catch (e) {
        console.error('Erro ao abrir configurações de notificação:', e);
      }
    } else {
      console.log('Ambiente Web: Abertura das configurações de notificação do Android.');
      alert('Funcionalidade nativa do Android: Configurações de Notificação.\n\nNo APK final, abrirá a tela de permissões de notificação do próprio sistema.');
    }
  }
};
