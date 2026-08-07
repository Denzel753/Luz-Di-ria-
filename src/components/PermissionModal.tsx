import React from 'react';
import { useState, useEffect } from 'react';
import { Bell, Battery, Layers, Accessibility, AlertCircle, Check } from 'lucide-react';
import {
  requestNotificationPermission,
  requestBatteryPermission,
  requestOverlayPermission,
  requestAccessibilityPermission,
  checkOverlayPermission,
  openAppDetails,
  getPermissionsStatus,
} from '../capacitorCompat';

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGrant: () => void;
}

export const PermissionModal = React.memo(function PermissionModal({ isOpen, onClose, onGrant }: PermissionModalProps) {
  const [notifGranted, setNotifGranted] = useState(false);
  const [batteryDone, setBatteryDone] = useState(false);
  const [overlayDone, setOverlayDone] = useState(false);
  const [accessDone, setAccessDone] = useState(false);

  useEffect(() => {
    if (isOpen && 'Notification' in window) {
      setNotifGranted(Notification.permission === 'granted');
    }
  }, [isOpen]);

  // 1. Notificações — permissão do sistema (Android 13+ exige)
  const handleRequestNotif = async () => {
    const granted = await requestNotificationPermission();
    setNotifGranted(granted);
  };

  // 2. Bateria — abre a tela "Ignorar otimização de bateria" do sistema
  const handleRequestBattery = () => {
    requestBatteryPermission();
    setBatteryDone(true); // o usuário volta do sistema e confirma
  };

  // 3. Sobrepor outros apps — abre a tela SYSTEM_ALERT_WINDOW.
  // Em Android 13+/Motorola o app pode estar BLOQUEADO (aviso de
  // "informações pessoais") — nesse caso abrimos os detalhes do app.
  const [overlayBlocked, setOverlayBlocked] = useState(false);
  const handleRequestOverlay = async () => {
    await requestOverlayPermission();
    // Verifica o status real após abrir a tela
    setTimeout(async () => {
      const can = await checkOverlayPermission();
      if (can) {
        setOverlayDone(true);
        setOverlayBlocked(false);
      } else {
        setOverlayBlocked(true); // mostra instruções + botão de detalhes
      }
    }, 1500);
  };

  const handleOpenAppDetails = async () => {
    await openAppDetails();
    setTimeout(async () => {
      const can = await checkOverlayPermission();
      if (can) setOverlayDone(true);
    }, 2000);
  };

  // 4. Acessibilidade — abre as configurações de acessibilidade.
  // Android 13+ BLOQUEIA apps instalados via APK (Restricted Settings) —
  // o usuário precisa permitir em Apps → Luz Diária → menu ⋮ →
  // "Permitir configurações restritas" antes de ativar a acessibilidade.
  const [accessBlocked, setAccessBlocked] = useState(false);
  const handleRequestAccess = () => {
    requestAccessibilityPermission();
    setAccessDone(true);
    // Verifica depois se realmente foi habilitada
    setTimeout(async () => {
      const status = await getPermissionsStatus();
      if (status.accessibility) {
        setAccessDone(true);
        setAccessBlocked(false);
      } else {
        setAccessBlocked(true); // mostra instruções de desbloqueio
      }
    }, 2500);
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

            {/* 3. Sobrepor outros apps */}
            <div>
              <div className={itemClass}>
                <div className="flex items-center gap-3">
                  <Layers className={`w-5 h-5 ${iconColor(overlayDone)}`} />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-[var(--color-duo-text)]">Sobrepor outros apps</p>
                    <p className="text-xs text-[var(--color-duo-text-light)]">Pop-up do versículo por cima de tudo</p>
                  </div>
                </div>
                <button onClick={handleRequestOverlay} disabled={overlayDone} className={btnClass(overlayDone)}>
                  {overlayDone ? <><Check className="w-3 h-3 inline" /> Feito</> : 'Abrir'}
                </button>
              </div>
              {overlayBlocked && !overlayDone && (
                <div className="mt-2 p-3 bg-red-50 dark:bg-red-950/40 rounded-[16px] border border-red-200 dark:border-red-800">
                  <p className="text-xs text-red-700 dark:text-red-300 font-medium mb-2">
                    ⚠️ Alguns celulares (Motorola, Android 13+) bloqueiam apps instalados por APK. 
                    Na tela que abriu, procure "Permitir sobrepor outros apps" ou use o botão abaixo:
                  </p>
                  <button
                    onClick={handleOpenAppDetails}
                    className="text-xs px-3 py-2 rounded-full font-medium bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    Abrir detalhes do app
                  </button>
                </div>
              )}
            </div>

            {/* 4. Acessibilidade */}
            <div>
              <div className={itemClass}>
                <div className="flex items-center gap-3">
                  <Accessibility className={`w-5 h-5 ${iconColor(accessDone)}`} />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-[var(--color-duo-text)]">Acessibilidade</p>
                    <p className="text-xs text-[var(--color-duo-text-light)]">Controle ainda maior do sistema</p>
                  </div>
                </div>
                <button onClick={handleRequestAccess} disabled={accessDone} className={btnClass(accessDone)}>
                  {accessDone ? <><Check className="w-3 h-3 inline" /> Feito</> : 'Abrir'}
                </button>
              </div>
              {accessBlocked && !accessDone && (
                <div className="mt-2 p-3 bg-red-50 dark:bg-red-950/40 rounded-[16px] border border-red-200 dark:border-red-800">
                  <p className="text-xs text-red-700 dark:text-red-300 font-medium mb-1">
                    ⚠️ Android bloqueia acessibilidade em apps instalados por APK (proteção do sistema).
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-400 mb-2">
                    Para liberar: Configurações → Apps → Luz Diária → menu ⋮ (3 pontinhos) → 
                    "Permitir configurações restritas" → confirme → volte e ative o serviço.
                  </p>
                  <button
                    onClick={handleOpenAppDetails}
                    className="text-xs px-3 py-2 rounded-full font-medium bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    Abrir detalhes do app
                  </button>
                </div>
              )}
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
