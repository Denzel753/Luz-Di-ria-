import { useState, useEffect } from 'react';
import { AppSettings } from '../types';

interface UpdateIntervalModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSettingsChange: (newSettings: AppSettings) => void;
}

const OPTIONS = [
  { label: 'Diário (A cada 24 horas)', value: 1440 },
  { label: 'De hora em hora', value: 60 },
  { label: 'A cada 4 horas', value: 240 },
  { label: 'A cada 6 horas', value: 360 },
  { label: 'A cada 12 horas', value: 720 },
];

export function UpdateIntervalModal({ isOpen, onClose, settings, onSettingsChange }: UpdateIntervalModalProps) {
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState<number | string>('');
  const [customUnit, setCustomUnit] = useState<'minutes'|'hours'|'days'>('hours');

  useEffect(() => {
    if (isOpen) {
      const isPreset = OPTIONS.some(o => o.value === settings.updateInterval);
      if (!isPreset) {
        setIsCustom(true);
        if (settings.updateInterval % 1440 === 0) {
          setCustomValue(settings.updateInterval / 1440);
          setCustomUnit('days');
        } else if (settings.updateInterval % 60 === 0) {
          setCustomValue(settings.updateInterval / 60);
          setCustomUnit('hours');
        } else {
          setCustomValue(settings.updateInterval || '');
          setCustomUnit('minutes');
        }
      } else {
        setIsCustom(false);
        setCustomValue('');
      }
    }
  }, [isOpen, settings.updateInterval]);

  

  const handleSelect = (value: number) => {
    onSettingsChange({ 
      ...settings, 
      updateInterval: value,
      lastVerseUpdateTimestamp: Date.now() // Reset timer when changed
    });
    onClose();
  };

  const handleCustomSubmit = () => {
    let val = typeof customValue === 'number' ? customValue : parseInt(customValue as string);
    if (isNaN(val) || val <= 0) val = 1;
    let minutes = val;
    if (customUnit === 'hours') minutes *= 60;
    if (customUnit === 'days') minutes *= 1440;
    
    onSettingsChange({ 
      ...settings, 
      updateInterval: Math.max(1, minutes),
      lastVerseUpdateTimestamp: Date.now() // Reset timer when changed
    });
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="duo-modal w-full max-w-sm overflow-hidden flex flex-col animate-in zoom-in-95 duration-[320ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-stone-900 dark:text-zinc-100 mb-6">Intervalo de atualização</h2>
          
          <div className="space-y-4">
            {OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-4 cursor-pointer">
                <input 
                  type="radio" 
                  name="interval" 
                  className="w-5 h-5 text-amber-600 focus:ring-amber-500 accent-amber-600 cursor-pointer"
                  checked={settings.updateInterval === opt.value && !isCustom}
                  onChange={() => {
                    setIsCustom(false);
                    handleSelect(opt.value);
                  }}
                />
                <span className="text-[17px] text-stone-800 dark:text-zinc-200">{opt.label}</span>
              </label>
            ))}

            <label className="flex items-center gap-4 cursor-pointer">
              <input 
                type="radio" 
                name="interval" 
                className="w-5 h-5 text-amber-600 focus:ring-amber-500 accent-amber-600 cursor-pointer"
                checked={isCustom}
                onChange={() => setIsCustom(true)}
              />
              <span className="text-[17px] text-stone-800 dark:text-zinc-200">Personalizado</span>
            </label>

            {isCustom && (
              <div className="pl-9 pr-2 pt-2 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2">
                  <input 
                    type="number"
                    min="1"
                    className="duo-input w-20 py-2 px-3 text-center"
                    value={customValue}
                    onChange={(e) => setCustomValue(e.target.value === '' ? '' : parseInt(e.target.value) || '')}
                  />
                  <select 
                    className="duo-input flex-1 py-2 px-3"
                    value={customUnit}
                    onChange={(e) => setCustomUnit(e.target.value as 'minutes'|'hours'|'days')}
                  >
                    <option value="minutes">Minutos</option>
                    <option value="hours">Horas</option>
                    <option value="days">Dias</option>
                  </select>
                </div>
                <button 
                  onClick={handleCustomSubmit}
                  className="btn-primary w-full mt-4 py-3"
                >
                  Definir intervalo
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end px-6 py-4 border-t border-stone-100 dark:border-zinc-800">
          <button 
            onClick={onClose}
            className="text-amber-600 dark:text-amber-500 font-medium text-sm tracking-wide uppercase px-4 py-2 hover:bg-amber-50 dark:hover:bg-zinc-800 rounded-[12px] transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
