import { useRef, useState } from 'react';
import { Image as ImageIcon, X, Palette, Upload, Image } from 'lucide-react';
import { AppSettings } from '../types';
import { HexColorPicker } from "react-colorful";

interface BackgroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
}

export function BackgroundModal({ isOpen, onClose, settings, onSettingsChange }: BackgroundModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const [recentColors, setRecentColors] = useState<string[]>(() => {
    const saved = localStorage.getItem('recentBackgroundColors');
    if (saved) return JSON.parse(saved);
    return [
      'transparent',
      '#fafaf9',
      '#292524',
      '#0f172a',
      '#f0fdfa',
      '#fdf4ff',
      '#fefce8',
    ];
  });

  

  const saveRecentColor = () => {
    if (showColorPicker && settings.backgroundType === 'color') {
      const newColor = settings.backgroundColor || '#fafaf9';
      setRecentColors(prev => {
        const filtered = prev.filter(c => c.toLowerCase() !== newColor.toLowerCase());
        const updated = [newColor, ...filtered].slice(0, 6);
        localStorage.setItem('recentBackgroundColors', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const handleClose = () => {
    saveRecentColor();
    onClose();
  };

  const handleColorSelect = (color: string) => {
    onSettingsChange({ ...settings, backgroundType: 'color', backgroundColor: color });
    setShowColorPicker(false);
  };

  const handleCustomColorChange = (color: string) => {
    onSettingsChange({ ...settings, backgroundType: 'color', backgroundColor: color });
  };

  const handlePresetImage = (url: string) => {
    onSettingsChange({ ...settings, backgroundType: 'image', backgroundImageUrl: url });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onSettingsChange({
            ...settings,
            backgroundType: 'image',
            backgroundImageUrl: event.target.result as string
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const presetImages = [
    'https://images.unsplash.com/photo-1500964757637-c85e8a162699?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=800&q=80'
  ];

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      <div className="relative bg-[var(--color-duo-bg)] rounded-t-[24px] border-t-2 border-l-2 border-r-2 border-[var(--color-duo-border)] p-6 flex flex-col gap-6 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom-full duration-[320ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[var(--color-duo-text)]">
            <ImageIcon className="w-5 h-5" />
            <h2 className="text-xl font-sans font-bold tracking-tight font-bold">Plano de Fundo</h2>
          </div>
          <button onClick={handleClose} className="btn-ghost">
            <X className="w-5 h-5 text-[var(--color-duo-text-light)]" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-duo-text-light)] flex items-center justify-between">
            <span className="flex items-center gap-2"><Palette className="w-4 h-4" /> Cores Sólidas</span>
            <button 
              onClick={() => {
                if (showColorPicker) saveRecentColor();
                setShowColorPicker(!showColorPicker);
              }}
              className="text-[var(--color-duo-orange)] text-xs hover:text-amber-700 transition-colors"
            >
              {showColorPicker ? 'Ocultar Paleta' : 'Personalizar Cor'}
            </button>
          </h3>
          
          {showColorPicker && (
            <div className="flex flex-col items-center gap-4 bg-[var(--color-duo-bg-sec)] p-4 rounded-[20px] border border-[var(--color-duo-border)]">
              <HexColorPicker color={settings.backgroundColor || '#fafaf9'} onChange={handleCustomColorChange} style={{ width: '100%' }} />
              <div className="flex items-center gap-2 w-full">
                <span className="text-xs font-medium text-[var(--color-duo-text-light)] uppercase">HEX</span>
                <input 
                  type="text" 
                  value={settings.backgroundColor || '#fafaf9'}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  className="duo-input"
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 overflow-x-auto pb-2">
            {recentColors.map(color => (
              <button
                key={color}
                onClick={() => handleColorSelect(color)}
                className={`w-12 h-12 rounded-full shrink-0 border-2 transition-transform hover:scale-105 ${settings.backgroundType === 'color' && settings.backgroundColor === color ? 'border-amber-500 scale-110' : 'border-[var(--color-duo-border)]'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-duo-text-light)] flex items-center gap-2 mt-2">
            <Upload className="w-4 h-4" /> Sua Galeria
          </h3>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-outline w-full py-4 gap-2 border-dashed border-[var(--color-duo-border-dark)]"
          >
            <Upload className="w-5 h-5" />
            Escolher da Galeria
          </button>

          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-duo-text-light)] flex items-center gap-2 mt-2">
            <Image className="w-4 h-4" /> Paisagens
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {presetImages.map((url, i) => (
              <button
                key={i}
                onClick={() => handlePresetImage(url)}
                className={`aspect-[9/16] rounded-[20px] bg-cover bg-center border-2 transition-transform hover:scale-105 shadow-sm ${settings.backgroundType === 'image' && settings.backgroundImageUrl === url ? 'border-amber-500 scale-105' : 'border-transparent'}`}
                style={{ backgroundImage: `url(${url})` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
