import React from 'react';
import { Star, Shuffle, Network, Youtube, Copy, Check } from 'lucide-react';

interface BottomNavProps {
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onSwapRandom: () => void;
  onOpenCrossReferences: () => void;
  onOpenYoutube: () => void;
  onCopy: () => void;
  copied: boolean;
}

export const BottomNav = React.memo(({
  isFavorite,
  onToggleFavorite,
  onSwapRandom,
  onOpenCrossReferences,
  onOpenYoutube,
  onCopy,
  copied
}: BottomNavProps) => {
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-md bg-[var(--color-duo-bg)]/80 backdrop-blur-2xl border border-[var(--color-duo-border)] rounded-[32px] shadow-xl flex items-center justify-around py-2 px-2 z-40">
      <button onClick={onToggleFavorite} className="flex flex-col items-center gap-1 p-2 text-[var(--color-duo-text)] opacity-70 hover:opacity-100 hover:text-[var(--color-duo-orange)] transition-colors group">
        <Star className={`w-7 h-7 group-hover:scale-110 transition-all duration-[180ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isFavorite ? 'fill-[var(--color-duo-orange)] text-[var(--color-duo-orange)] opacity-100' : ''}`} />
        <span className="text-[11px] font-bold tracking-wide">Favorito</span>
      </button>
      <button onClick={onSwapRandom} className="flex flex-col items-center gap-1 p-2 text-[var(--color-duo-text)] opacity-70 hover:opacity-100 hover:text-[var(--color-duo-orange)] transition-colors group">
        <Shuffle className="w-7 h-7 group-hover:scale-110 transition-transform duration-[180ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
        <span className="text-[11px] font-bold tracking-wide">Sortear</span>
      </button>
      <button onClick={onOpenCrossReferences} className="flex flex-col items-center gap-1 p-2 text-[var(--color-duo-text)] opacity-70 hover:opacity-100 hover:text-[var(--color-duo-orange)] transition-colors group">
        <Network className="w-7 h-7 group-hover:scale-110 transition-transform duration-[180ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
        <span className="text-[11px] font-bold tracking-wide">Conexões</span>
      </button>
      <button onClick={onOpenYoutube} className="flex flex-col items-center gap-1 p-2 text-[var(--color-duo-text)] opacity-70 hover:opacity-100 hover:text-[var(--color-duo-orange)] transition-colors group">
        <Youtube className="w-7 h-7 group-hover:scale-110 transition-transform duration-[180ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
        <span className="text-[11px] font-bold tracking-wide">Youtube</span>
      </button>
      <button onClick={onCopy} className="flex flex-col items-center gap-1 p-2 text-[var(--color-duo-text)] opacity-70 hover:opacity-100 hover:text-[var(--color-duo-orange)] transition-colors group">
        {copied ? <Check className="w-7 h-7 text-[var(--color-duo-orange)] opacity-100" /> : <Copy className="w-7 h-7 group-hover:scale-110 transition-transform duration-[180ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" />}
        <span className="text-[11px] font-bold tracking-wide">{copied ? 'Copiado' : 'Copiar'}</span>
      </button>
    </nav>
  );
});
