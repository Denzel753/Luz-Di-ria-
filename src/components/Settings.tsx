import { useState } from 'react';
import { ArrowLeft, Bell, Clock, Smartphone, Zap, Palette, RefreshCw, BookOpen, Download, Bug, ShieldCheck, Battery, Layers, Accessibility,  } from 'lucide-react';
import { AppSettings } from '../types';
import { AndroidNative } from '../AndroidNative';
import { playNotificationSound } from '../audio';
import { UpdateIntervalModal } from './UpdateIntervalModal';
import { logger } from '../utils/logger';
import {
  requestNotificationPermission,
  requestBatteryPermission,
  requestOverlayPermission,
  requestAccessibilityPermission,
  requestExactAlarmPermission,
} from '../capacitorCompat';

interface SettingsProps {
  onTestPopup?: () => void;
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSettingsChange: (newSettings: AppSettings) => void;
  onOpenAbout?: () => void;
  onShowToast?: (type: 'success' | 'info' | 'error', message: string) => void;
}

export function Settings({ isOpen, onClose, settings, onSettingsChange, onTestPopup, onShowToast }: SettingsProps) {
  const [isIntervalModalOpen, setIsIntervalModalOpen] = useState(false);

  const handleExportLogs = () => {
    const logs = logger.exportLogs();
    const body = `Aqui estão os logs de erro do app Luz Diária:\n\n${logs}`;
    window.location.href = `mailto:victorjuca@proton.me?subject=Luz Diária - Logs de Erro&body=${encodeURIComponent(body)}`;
  };

  

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-[var(--color-duo-bg-sec)] z-50 flex flex-col">
      <header className="bg-[var(--color-duo-bg)] h-16 flex items-center px-4 border-b-2 border-[var(--color-duo-border)] text-[var(--color-duo-text)] gap-4 shadow-sm z-10 shrink-0">
        <button onClick={onClose} className="btn-ghost">
          <ArrowLeft className="w-5 h-5 text-[var(--color-duo-text-light)]" />
        </button>
        <h1 className="text-[19px] font-medium tracking-tight text-[var(--color-duo-text)]">Configurações</h1>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-2xl mx-auto space-y-6 pb-12">
          
          
          {/* Versão da Bíblia */}
          <section className="duo-card overflow-hidden p-0 mb-6">
            <div className="px-5 py-3 bg-[var(--color-duo-bg-sec)] border-b-2 border-[var(--color-duo-border)] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[var(--color-duo-orange)]" />
              <h2 className="text-[var(--color-duo-orange)] text-xs font-bold uppercase tracking-wider">Tradução da Bíblia</h2>
            </div>
            <div className="px-5 py-4">
              <p className="text-[var(--color-duo-text)] text-[15px] font-medium mb-3">Selecione a versão</p>
              <select 
                className="duo-input cursor-pointer appearance-none"
                value={settings.bibleVersion || 'NVI'}
                onChange={(e) => onSettingsChange({...settings, bibleVersion: e.target.value})}
              >
                <option value="NVI">Nova Versão Internacional (NVI)</option>
                <option value="ARC">Almeida Revista e Corrigida (ARC)</option>
                <option value="NTLH">Nova Tradução na Linguagem de Hoje (NTLH)</option>
                <option value="NAA">Nova Almeida Atualizada (NAA)</option>
              </select>
            </div>
          </section>


          {/* Aparência e Leitura */}
          <section className="duo-card overflow-hidden p-0">
            <div className="px-5 py-3 bg-[var(--color-duo-bg-sec)] border-b-2 border-[var(--color-duo-border)] flex items-center gap-2">
              <Palette className="w-4 h-4 text-[var(--color-duo-orange)]" />
              <h2 className="text-[var(--color-duo-orange)] text-xs font-bold uppercase tracking-wider">Aparência e Leitura</h2>
            </div>
            
            <div className="px-5">

              <div className="py-4 border-b-2 border-[var(--color-duo-border)]">
                <p className="text-[var(--color-duo-text)] text-[15px] font-medium mb-3">Tema do Aplicativo</p>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio"
                      name="theme"
                      className="w-5 h-5 text-[var(--color-duo-orange)] focus:ring-amber-500 accent-amber-600 cursor-pointer"
                      checked={settings.theme === 'light'}
                      onChange={() => onSettingsChange({...settings, theme: 'light'})}
                    />
                    <span className="text-stone-700 dark:text-zinc-300 text-[15px] group-hover:text-stone-900 dark:group-hover:text-white transition-colors">Claro</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio"
                      name="theme"
                      className="w-5 h-5 text-[var(--color-duo-orange)] focus:ring-amber-500 accent-amber-600 cursor-pointer"
                      checked={settings.theme === 'dark'}
                      onChange={() => onSettingsChange({...settings, theme: 'dark'})}
                    />
                    <span className="text-stone-700 dark:text-zinc-300 text-[15px] group-hover:text-stone-900 dark:group-hover:text-white transition-colors">Escuro</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio"
                      name="theme"
                      className="w-5 h-5 text-[var(--color-duo-orange)] focus:ring-amber-500 accent-amber-600 cursor-pointer"
                      checked={settings.theme === 'system'}
                      onChange={() => onSettingsChange({...settings, theme: 'system'})}
                    />
                    <span className="text-stone-700 dark:text-zinc-300 text-[15px] group-hover:text-stone-900 dark:group-hover:text-white transition-colors">Padrão do sistema</span>
                  </label>
                </div>
              </div>

              <div className="py-4 border-b-2 border-[var(--color-duo-border)]">
                <p className="text-[var(--color-duo-text)] text-[15px] font-medium mb-3">Fonte Geral do Aplicativo</p>
                <select 
                  className="duo-input cursor-pointer appearance-none mb-4"
                  value={settings.appFontFamily || 'sans'}
                  onChange={(e) => onSettingsChange({...settings, appFontFamily: e.target.value})}
                >
                  <option value="sans">Sans Serif (Padrão)</option>
                  <option value="serif">Serif</option>
                  <option value="mono">Monospace</option>
                  <option value="inter">Inter</option>
                  <option value="roboto">Roboto</option>
                  <option value="lora">Lora</option>
                  <option value="merriweather">Merriweather</option>
                  <option value="playfair">Playfair Display</option>
                  <option value="montserrat">Montserrat</option>
                  <option value="oswald">Oswald</option>
                </select>

                <div className="flex items-center justify-between mb-4">
                  <p className="text-stone-700 dark:text-zinc-300 text-[14px]">Tamanho da Fonte (Geral): {settings.appFontSize || 100}%</p>
                </div>
                <input 
                  type="range" 
                  min="50" max="200" step="10"
                  value={settings.appFontSize || 100}
                  onChange={(e) => onSettingsChange({...settings, appFontSize: parseInt(e.target.value)})}
                  className="w-full accent-amber-600"
                />
                <p className="text-xs text-[var(--color-duo-text-light)] mt-2 leading-relaxed">
                  Esta opção afeta os botões, menus e textos descritivos, melhorando a acessibilidade.
                </p>
              </div>

              <div className="py-4 border-b-2 border-[var(--color-duo-border)]">
                <p className="text-[var(--color-duo-text)] text-[15px] font-medium mb-3">Fonte do Versículo</p>
                <select 
                  className="duo-input cursor-pointer appearance-none mb-4"
                  value={settings.verseFontFamily || 'sans'}
                  onChange={(e) => onSettingsChange({...settings, verseFontFamily: e.target.value})}
                >
                  <option value="sans">Sans Serif (Padrão)</option>
                  <option value="serif">Serif</option>
                  <option value="mono">Monospace</option>
                  <option value="inter">Inter</option>
                  <option value="roboto">Roboto</option>
                  <option value="lora">Lora</option>
                  <option value="merriweather">Merriweather</option>
                  <option value="playfair">Playfair Display</option>
                  <option value="montserrat">Montserrat</option>
                  <option value="oswald">Oswald</option>
                </select>

                <div className="flex items-center justify-between mb-4">
                  <p className="text-stone-700 dark:text-zinc-300 text-[14px]">Tamanho da Fonte: {settings.verseFontSize || 100}%</p>
                </div>
                <input 
                  type="range" 
                  min="50" max="200" step="10"
                  value={settings.verseFontSize || 100}
                  onChange={(e) => onSettingsChange({...settings, verseFontSize: parseInt(e.target.value)})}
                  className="w-full accent-amber-600 mb-6"
                />

                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox"
                      className="w-5 h-5 text-[var(--color-duo-orange)] rounded border-[var(--color-duo-border)] focus:ring-amber-500 accent-amber-600 cursor-pointer"
                      checked={settings.verseFontWeight === 'bold'}
                      onChange={(e) => onSettingsChange({...settings, verseFontWeight: e.target.checked ? 'bold' : 'normal'})}
                    />
                    <span className="text-stone-700 dark:text-zinc-300 text-[15px] font-bold group-hover:text-stone-900 dark:group-hover:text-white transition-colors">Negrito</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox"
                      className="w-5 h-5 text-[var(--color-duo-orange)] rounded border-[var(--color-duo-border)] focus:ring-amber-500 accent-amber-600 cursor-pointer"
                      checked={settings.verseFontStyle === 'italic'}
                      onChange={(e) => onSettingsChange({...settings, verseFontStyle: e.target.checked ? 'italic' : 'normal'})}
                    />
                    <span className="text-stone-700 dark:text-zinc-300 text-[15px]  group-hover:text-stone-900 dark:group-hover:text-white transition-colors">Itálico</span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Notificações */}
          <section className="duo-card overflow-hidden p-0">
            <div className="px-5 py-3 bg-[var(--color-duo-bg-sec)] border-b-2 border-[var(--color-duo-border)] flex items-center gap-2">
              <Bell className="w-4 h-4 text-[var(--color-duo-orange)]" />
              <h2 className="text-[var(--color-duo-orange)] text-xs font-bold uppercase tracking-wider">Notificações</h2>
            </div>
            
            <div className="px-5">

              <div className="py-4 flex flex-wrap items-center justify-between gap-4 border-b-2 border-[var(--color-duo-border)] cursor-pointer group" onClick={() => setIsIntervalModalOpen(true)}>
                <div className="flex items-center gap-3 flex-1">
                  <RefreshCw className="w-5 h-5 text-[var(--color-duo-text-light)]" />
                  <div>
                    <p className="text-[var(--color-duo-text)] text-[15px] font-medium group-hover:text-[var(--color-duo-orange)] transition-colors">Intervalo de atualização</p>
                    <p className="text-[var(--color-duo-text-light)] text-[13px] mt-0.5">
                      {settings.updateInterval === 1440 ? 'Diário' : 
                       settings.updateInterval === 60 ? 'De hora em hora' : 
                       settings.updateInterval === 240 ? 'A cada 4 horas' : 
                       settings.updateInterval === 360 ? 'A cada 6 horas' : 
                       settings.updateInterval === 720 ? 'A cada 12 horas' : 
                       settings.updateInterval % 1440 === 0 ? `A cada ${settings.updateInterval / 1440} dias` :
                       settings.updateInterval % 60 === 0 ? `A cada ${settings.updateInterval / 60} horas` :
                       `A cada ${settings.updateInterval || 1440} minutos`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="py-4 flex flex-col gap-3 border-b-2 border-[var(--color-duo-border)]">
                <div className="flex items-center gap-3 mb-1">
                  <Clock className="w-5 h-5 text-[var(--color-duo-text-light)] shrink-0" />
                  <div className="flex-1">
                    <p className="text-[var(--color-duo-text)] text-[15px] font-medium">Horário das notificações</p>
                    <p className="text-[var(--color-duo-text-light)] text-[13px] mt-0.5">Defina o período para receber versículos</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 pl-0 sm:pl-8 mt-1">
                  <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
                    <span className="text-xs font-medium text-[var(--color-duo-text-light)] uppercase tracking-wider">Início</span>
                    <input 
                      type="time" 
                      value={settings.notificationStartTime || '08:00'}
                      onChange={(e) => onSettingsChange({...settings, notificationStartTime: e.target.value})}
                      className="w-full bg-[var(--color-duo-bg-sec)] border border-[var(--color-duo-border)] text-[var(--color-duo-text)] rounded-[12px] px-3 py-1.5 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div className="text-stone-300 dark:text-zinc-600 font-medium mt-5 hidden sm:block">-</div>
                  <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
                    <span className="text-xs font-medium text-[var(--color-duo-text-light)] uppercase tracking-wider">Término</span>
                    <input 
                      type="time" 
                      value={settings.notificationEndTime || '22:00'}
                      onChange={(e) => onSettingsChange({...settings, notificationEndTime: e.target.value})}
                      className="w-full bg-[var(--color-duo-bg-sec)] border border-[var(--color-duo-border)] text-[var(--color-duo-text)] rounded-[12px] px-3 py-1.5 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div className="py-4 flex flex-col gap-3 border-b-2 border-[var(--color-duo-border)]">
                <div className="flex items-center justify-between gap-4 cursor-pointer" onClick={() => onSettingsChange({...settings, showPopup: !settings.showPopup})}>
                  <div className="flex-1 pr-2">
                    <p className="text-[var(--color-duo-text)] text-[15px] font-medium">Mostrar pop-up gigante na tela</p>
                    <p className="text-[var(--color-duo-text-light)] text-[13px] mt-0.5">A notificação padrão será recebida silenciosamente</p>
                  </div>
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 text-[var(--color-duo-orange)] rounded border-[var(--color-duo-border)] focus:ring-amber-500 accent-amber-600 cursor-pointer shrink-0"
                    checked={settings.showPopup}
                    onChange={(e) => onSettingsChange({...settings, showPopup: e.target.checked})}
                  />
                </div>
                {settings.showPopup && onTestPopup && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onTestPopup(); }}
                    className="btn-outline self-start text-sm py-2 px-3 gap-2 mt-2"
                  >
                    Testar Pop-up
                  </button>
                )}
              </div>

              <div className="py-4 flex flex-wrap items-center justify-between gap-4 border-b-2 border-[var(--color-duo-border)]">
                <div className="flex flex-col flex-1">
                  <p className="text-[var(--color-duo-text)] text-[15px] font-medium">Tocar um som</p>
                  <p className="text-[var(--color-duo-text-light)] text-[13px] mt-0.5">Som da notificação</p>
                </div>
                <select 
                  className="duo-input cursor-pointer appearance-none px-4 py-2 w-full sm:w-auto"
                  value={settings.sound}
                  onChange={(e) => {
                    const newSound = e.target.value;
                    onSettingsChange({...settings, sound: newSound});
                    if (newSound !== 'Silencioso') {
                      playNotificationSound(newSound);
                    }
                  }}
                >
                  <option value="Silencioso">Silencioso</option>
                  <option value="Sino">Sino</option>
                  <option value="Harpa">Harpa</option>
                  <option value="Celeste">Celeste</option>
                </select>
              </div>

              <div className="py-4 flex items-center justify-between gap-4 border-b-2 border-[var(--color-duo-border)] cursor-pointer transition-transform active:scale-[0.98]" onClick={() => onSettingsChange({...settings, vibrate: !settings.vibrate})}>
                <p className="text-[var(--color-duo-text)] text-[15px] font-medium flex-1">Vibrar o dispositivo</p>
                <input 
                  type="checkbox" 
                  className="w-5 h-5 text-[var(--color-duo-orange)] rounded border-[var(--color-duo-border)] focus:ring-amber-500 accent-amber-600 cursor-pointer shrink-0"
                  checked={settings.vibrate}
                  onChange={(e) => onSettingsChange({...settings, vibrate: e.target.checked})}
                />
              </div>

              <div className="py-4 flex items-center justify-between gap-4 border-b-2 border-[var(--color-duo-border)] cursor-pointer transition-transform active:scale-[0.98]" onClick={() => onSettingsChange({...settings, wakeDevice: !settings.wakeDevice})}>
                <div className="flex items-center gap-3 flex-1">
                  <Smartphone className="w-5 h-5 text-[var(--color-duo-text-light)] shrink-0" />
                  <p className="text-[var(--color-duo-text)] text-[15px] font-medium">Acorde o dispositivo</p>
                </div>
                <input 
                  type="checkbox" 
                  className="w-5 h-5 text-[var(--color-duo-orange)] rounded border-[var(--color-duo-border)] focus:ring-amber-500 accent-amber-600 cursor-pointer shrink-0"
                  checked={settings.wakeDevice}
                  onChange={(e) => onSettingsChange({...settings, wakeDevice: e.target.checked})}
                />
              </div>

              <div className="py-4 flex items-center justify-between gap-4 cursor-pointer transition-transform active:scale-[0.98]" onClick={() => onSettingsChange({...settings, flashLed: !settings.flashLed})}>
                <div className="flex items-center gap-3 flex-1">
                  <Zap className="w-5 h-5 text-[var(--color-duo-text-light)] shrink-0" />
                  <p className="text-[var(--color-duo-text)] text-[15px] font-medium">Flash o LED</p>
                </div>
                <input 
                  type="checkbox" 
                  className="w-5 h-5 text-[var(--color-duo-orange)] rounded border-[var(--color-duo-border)] focus:ring-amber-500 accent-amber-600 cursor-pointer shrink-0"
                  checked={settings.flashLed}
                  onChange={(e) => onSettingsChange({...settings, flashLed: e.target.checked})}
                />
              </div>

            {/* Permissões do Sistema */}
            <div className="px-5 py-3 bg-[var(--color-duo-bg-sec)] border-b-2 border-[var(--color-duo-border)] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--color-duo-orange)]" />
              <h2 className="text-[var(--color-duo-orange)] text-xs font-bold uppercase tracking-wider">Permissões do Sistema</h2>
            </div>
            <div className="px-5 pb-2">
              <p className="text-[13px] text-[var(--color-duo-text-light)] py-3 border-b-2 border-[var(--color-duo-border)]">
                Libere ou reabra cada permissão do Android quando quiser (aparece só na 1ª abertura, mas pode ajustar aqui).
              </p>
              {[
                { icon: Bell, label: 'Notificações', desc: 'Versículo na barra de notificações', action: () => requestNotificationPermission() },
                { icon: Battery, label: 'Otimização de Bateria', desc: 'App não morre em 2º plano', action: () => requestBatteryPermission() },
                { icon: Layers, label: 'Sobrepor outros apps', desc: 'Pop-up gigante por cima de tudo', action: () => requestOverlayPermission() },
                { icon: Zap, label: 'Alarmes exatos', desc: 'Disparo no horário certo', action: () => requestExactAlarmPermission() },
                { icon: Accessibility, label: 'Acessibilidade', desc: 'Controle extra do sistema', action: () => requestAccessibilityPermission() },
              ].map(({ icon: Icon, label, desc, action }) => (
                <div key={label} className="py-3 flex items-center justify-between gap-4 border-b-2 border-[var(--color-duo-border)]">
                  <div className="flex items-center gap-3 flex-1">
                    <Icon className="w-5 h-5 text-[var(--color-duo-text-light)] shrink-0" />
                    <div>
                      <p className="text-[var(--color-duo-text)] text-[14px] font-medium">{label}</p>
                      <p className="text-[var(--color-duo-text-light)] text-[12px]">{desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { action(); onShowToast(`Abrindo: ${label}`); }}
                    className="text-xs px-3 py-1.5 rounded-full font-medium bg-amber-100 text-amber-700 hover:bg-amber-200 shrink-0"
                  >
                    Abrir
                  </button>
                </div>
              ))}
            </div>
            </div>
          </section>
        </div>
      </div>
      <UpdateIntervalModal 
        isOpen={isIntervalModalOpen}
        onClose={() => setIsIntervalModalOpen(false)}
        settings={settings}
        onSettingsChange={onSettingsChange}
      />
    </div>
  );
}
