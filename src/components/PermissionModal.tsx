import React from 'react';
import { useState, useEffect } from 'react';
import { Bell, Battery, AlertCircle } from 'lucide-react';

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGrant: () => void;
}

export const PermissionModal = React.memo(function PermissionModal({ isOpen, onClose, onGrant }: PermissionModalProps) {
  const [notifGranted, setNotifGranted] = useState(false);
  const [batteryGranted, setBatteryGranted] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setNotifGranted(Notification.permission === 'granted');
    }
  }, [isOpen]);

  

  const handleRequestNotif = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotifGranted(permission === 'granted');
    }
  };

  const handleRequestBattery = () => {
    // Mock for battery optimization since web can't do it directly
    setBatteryGranted(true);
  };

  const handleContinue = () => {
    onGrant();
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-[20px] w-full max-w-sm overflow-hidden shadow-2xl">
        <div className="p-6">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4 text-[var(--color-duo-orange)]">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[var(--color-duo-text)] mb-2">Permissões Necessárias</h2>
          <p className="text-sm text-[var(--color-duo-text-light)] mb-6">
            Para que o versículo fique sempre visível na sua barra de notificações e o aplicativo funcione em segundo plano, precisamos de algumas permissões.
          </p>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-4 bg-[var(--color-duo-bg-sec)] rounded-[20px] border border-[var(--color-duo-border)]">
              <div className="flex items-center gap-3">
                <Bell className={`w-5 h-5 ${notifGranted ? 'text-green-500' : 'text-stone-400 dark:text-zinc-500'}`} />
                <div className="text-left">
                  <p className="text-sm font-semibold text-[var(--color-duo-text)]">Notificações</p>
                  <p className="text-xs text-[var(--color-duo-text-light)]">Notificação persistente</p>
                </div>
              </div>
              <button 
                onClick={handleRequestNotif}
                disabled={notifGranted}
                className={`text-xs px-3 py-1.5 rounded-full font-medium ${notifGranted ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
              >
                {notifGranted ? 'Concedido' : 'Permitir'}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-[var(--color-duo-bg-sec)] rounded-[20px] border border-[var(--color-duo-border)]">
              <div className="flex items-center gap-3">
                <Battery className={`w-5 h-5 ${batteryGranted ? 'text-green-500' : 'text-stone-400 dark:text-zinc-500'}`} />
                <div className="text-left">
                  <p className="text-sm font-semibold text-[var(--color-duo-text)]">Bateria</p>
                  <p className="text-xs text-[var(--color-duo-text-light)]">Sem otimização</p>
                </div>
              </div>
              <button 
                onClick={handleRequestBattery}
                disabled={batteryGranted}
                className={`text-xs px-3 py-1.5 rounded-full font-medium ${batteryGranted ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
              >
                {batteryGranted ? 'Concedido' : 'Permitir'}
              </button>
            </div>
          </div>

          <button 
            onClick={handleContinue}
            className="btn-primary w-full py-4 text-sm"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
});
