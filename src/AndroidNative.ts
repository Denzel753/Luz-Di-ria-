export const AndroidNative = {
  isAndroid: () => {
    // Check if the Android bridge exists, or if the user agent is Android
    return typeof (window as any).Android !== 'undefined' || /android/i.test(navigator.userAgent);
  },
  
  requestBatteryOptimizationPermission: () => {
    if (typeof (window as any).Android !== 'undefined' && (window as any).Android.requestBatteryOptimization) {
      (window as any).Android.requestBatteryOptimization();
    } else {
      console.log('Ambiente Web: Pedido de permissão para desativar otimização de bateria (ignorar economia de energia) disparado. Isso funcionará nativamente no APK.');
      alert('Funcionalidade nativa do Android: Desativar Otimização de Bateria.\n\nNo APK final, esta ação abrirá as configurações do Android para permitir que o app rode em segundo plano sem restrições.');
    }
  },

  requestExactAlarmPermission: () => {
    if (typeof (window as any).Android !== 'undefined' && (window as any).Android.requestExactAlarmPermission) {
      (window as any).Android.requestExactAlarmPermission();
    } else {
      console.log('Ambiente Web: Pedido de permissão para alarmes exatos disparado. Isso funcionará nativamente no APK.');
      alert('Funcionalidade nativa do Android: Alarmes Exatos.\n\nNo APK final, esta ação abrirá as configurações do Android para permitir que o app agende notificações precisas no horário exato.');
    }
  },
  
  openNotificationSettings: () => {
    if (typeof (window as any).Android !== 'undefined' && (window as any).Android.openNotificationSettings) {
      (window as any).Android.openNotificationSettings();
    } else {
      console.log('Ambiente Web: Abertura das configurações de notificação do Android.');
      alert('Funcionalidade nativa do Android: Configurações de Notificação.\n\nNo APK final, abrirá a tela de permissões de notificação do próprio sistema.');
    }
  }
};
