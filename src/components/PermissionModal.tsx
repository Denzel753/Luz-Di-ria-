import React from 'react';
import { useState, useEffect } from 'react';
import { Bell, Battery, AlertCircle, Check } from 'lucide-react';
import {
  requestNotificationPermission,
  requestBatteryPermission,
  getPermissionsStatus,
} from '../capacitorCompat';

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGrant: () => void;
  onShowToast?: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const PermissionModal = React.memo(function PermissionModal({ isOpen, onClose, onGrant }: PermissionModalProps) {
  const [notifGranted, setNotifGranted] = useState(false);
  const [batteryDone, setBatteryDone] = useState(false);

  useEffect(() => {
    if (isOpen && 'Notification' in window) {
      setNotifGranted(Notification.permission === 'granted');
      // Verifica o status real (bateria pode já estar liberada)
      getPermissionsStatus().then((s) => {
        if (s.battery) setBatteryDone(true);
      }).catch(() => {});
    }
  }, [isOpen]);

  // 1. Notificações — permissão do sistema (Android 13+ exige)
  const handleRequestNotif = async () => {
    const granted = await requestNotificationPermission();
    setNotifGranted(granted);
  };

  // 2. Bateria — abre a tela "Ignorar otimização de bateria" do sistema.
  // O pop-up gigante e a notificação fixa usam Activity + FullScreenIntent
  // (padrão AMdroid) — NÃO precisam de sobreposição nem acessibilidade.
  const handleRequestBattery = () => {
    requestBatteryPermission();
    setBatteryDone(true);
  };

  const handleContinue = () => {
    onGrant();
    onClose();
  };

  if (!isOpen) return null;

  const itemClass = "flex items-center justify-between p-4 bg-[var(--color-duo-bg-sec)] rounded-[20px] border border-[var(--color-duo-border)]";
  const iconColor = (done: boolean) => done ? 'text-green-500' : 'text-stone-400 dark:text-zinc-500';
  const btnClass = (done: boolean) =>
    `text-xs px-3 py-1.5 rounded-full font-medium shrink-0 ${
      done ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
    }`;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-[20px] w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-6">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4 text-[var(--color-duo-orange)]">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[var(--color-duo-text)] mb-2">Permissões Necessárias</h2>
          <p className="text-sm text-[var(--color-duo-text-light)] mb-6">
            Para o versículo chegar até você mesmo com o app fechado, libere estas permissões. Cada botão abre a tela do próprio Android — toque e confirme.
          </p>

          <div className="space-y-4 mb-6">
            {/* 1. Notificações */}
            <div className={itemClass}>
              <div className="flex items-center gap-3">
                <Bell className={`w-5 h-5 ${iconColor(notifGranted)}`} />
                <div className="text-left">
                  <p className="text-sm font-semibold text-[var(--color-duo-text)]">Notificações</p>
                  <p className="text-xs text-[var(--color-duo-text-light)]">Mostrar o versículo na barra</p>
                </div>
              </div>
              <button onClick={handleRequestNotif} disabled={notifGranted} className={btnClass(notifGranted)}>
                {notifGranted ? <><Check className="w-3 h-3 inline" /> Concedido</> : 'Permitir'}
              </button>
            </div>

            {/* 2. Bateria */}
            <div className={itemClass}>
              <div className="flex items-center gap-3">
                <Battery className={`w-5 h-5 ${iconColor(batteryDone)}`} />
                <div className="text-left">
                  <p className="text-sm font-semibold text-[var(--color-duo-text)]">Otimização de Bateria</p>
                  <p className="text-xs text-[var(--color-duo-text-light)]">Impedir que o app "morra" em 2º plano</p>
                </div>
              </div>
              <button onClick={handleRequestBattery} disabled={batteryDone} className={btnClass(batteryDone)}>
                {batteryDone ? <><Check className="w-3 h-3 inline" /> Feito</> : 'Abrir'}
              </button>
            </div>
          </div>

          <button onClick={handleContinue} className="btn-primary w-full py-4 text-sm">
            Continuar
          </button>
          <p className="text-[11px] text-center text-[var(--color-duo-text-light)] mt-3">
            Pode liberar depois em Configurações também.
          </p>
        </div>
      </div>
    </div>
  );
});
