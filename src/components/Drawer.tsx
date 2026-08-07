import React from 'react';

import { Verse } from '../types';
import { Star, Clock, X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  recentVerses: Verse[];
  favoriteVerses: Verse[];
  onSelectVerse: (verse: Verse) => void;
  onRemoveFavorite?: (verseId: string) => void;
  bibleVersion: string;
}

export const Drawer = React.memo(function Drawer({ isOpen, onClose, recentVerses, favoriteVerses, onSelectVerse, onRemoveFavorite, bibleVersion }: DrawerProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div 
        className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-[var(--color-duo-bg-sec)] text-[var(--color-duo-text)] z-50 transform transition-transform duration-[320ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ease-in-out flex flex-col shadow-2xl border-r-2 border-[var(--color-duo-border)] rounded-r-[24px] overflow-hidden ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="bg-[var(--color-duo-bg)] px-6 pt-12 pb-6 flex items-center gap-3 border-b-2 border-[var(--color-duo-border)]">
          <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
          <h2 className="text-xl duo-title">Favoritos</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {favoriteVerses.length === 0 ? (
            <div className="px-6 py-12 flex flex-col items-center justify-center text-center text-[var(--color-duo-text-light)]">
              <div className="bg-[var(--color-duo-bg-sec)]/50 p-4 rounded-full mb-4">
                <Star className="w-6 h-6 text-stone-300 dark:text-zinc-600" />
              </div>
              <p className="text-sm font-medium">Nenhum item salvo ainda.</p>
              <p className="text-xs mt-1.5 opacity-80">Toque na estrela ao ler para salvar aqui.</p>
            </div>
          ) : (
             favoriteVerses.map((v, i) => (
               <div 
                 key={`${v.id}-fav-${i}`} 
                 className="p-4 bg-[var(--color-duo-bg)] border-2 border-[var(--color-duo-border)] border-b-2 rounded-[20px] active:translate-y-[1px] transition-all group relative cursor-pointer"
                 onClick={() => { onSelectVerse(v); onClose(); }}
               >
                 <div className="cursor-pointer pr-8" onClick={() => {
                   onSelectVerse(v);
                   onClose();
                 }}>
                   <p className="text-[15px] sm:text-base text-[var(--color-duo-text)] line-clamp-2 leading-relaxed font-sans font-bold tracking-tight  custom-verse-text verse-size-sm">{v.text}</p>
                   <p className="text-xs text-[var(--color-duo-orange)] dark:text-amber-500 mt-2 font-medium tracking-wide uppercase flex items-center gap-1.5 flex-wrap">
                     {v.reference} 
                     {v.id.startsWith('q') ? (
                       <span className="text-[9px] bg-[var(--color-duo-border)] text-[var(--color-duo-text-light)] px-1.5 py-0.5 rounded-sm">FRASE</span>
                     ) : (
                       <span className="text-[9px] bg-[#fff1e0] dark:bg-[#332000] text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-sm">{bibleVersion || 'NVI'}</span>
                     )}
                   </p>
                 </div>
                 {onRemoveFavorite && (
                   <button 
                     onClick={(e) => { e.stopPropagation(); onRemoveFavorite(v.id); }}
                     className="absolute top-5 right-4 p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-colors"
                     title="Remover dos favoritos"
                   >
                     <X className="w-4 h-4" />
                   </button>
                 )}
               </div>
             ))
          )}
          
          <div className="bg-[var(--color-duo-bg)] px-6 py-5 flex items-center gap-3 border-y-2 border-[var(--color-duo-border)] mt-4 mb-2">
            <Clock className="w-5 h-5 text-[var(--color-duo-text-light)]" />
            <h2 className="text-xl duo-title">Recentes</h2>
          </div>
          
          {recentVerses.length === 0 ? (
            <div className="px-6 py-12 flex flex-col items-center justify-center text-center text-[var(--color-duo-text-light)]">
              <div className="bg-[var(--color-duo-bg-sec)]/50 p-4 rounded-full mb-4">
                <Clock className="w-6 h-6 text-stone-300 dark:text-zinc-600" />
              </div>
              <p className="text-sm font-medium">Nenhum histórico recente.</p>
              <p className="text-xs mt-1.5 opacity-80">Seu histórico de leitura aparecerá aqui.</p>
            </div>
          ) : (
            recentVerses.map((v, i) => {
              const displayDate = new Date(v.date || new Date()).toLocaleDateString('pt-BR', { 
                day: '2-digit', month: 'short', year: 'numeric' 
              });
              
              return (
                <div 
                  key={`${v.id}-${i}`} 
                  className="p-4 bg-[var(--color-duo-bg)] border-2 border-[var(--color-duo-border)] border-b-2 rounded-[20px] active:translate-y-[1px] transition-all group relative cursor-pointer"
                  onClick={() => {
                    onSelectVerse(v);
                    onClose();
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-xs text-[var(--color-duo-orange)] dark:text-amber-500 font-medium tracking-wide uppercase flex items-center gap-1.5 flex-wrap">
                      {v.reference} 
                     {v.id.startsWith('q') ? (
                       <span className="text-[9px] bg-[var(--color-duo-border)] text-[var(--color-duo-text-light)] px-1.5 py-0.5 rounded-sm">FRASE</span>
                     ) : (
                       <span className="text-[9px] bg-[#fff1e0] dark:bg-[#332000] text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-sm">{bibleVersion || 'NVI'}</span>
                     )}
                    </p>
                    <p className="text-[10px] text-[var(--color-duo-text-light)] font-medium uppercase tracking-wider">{displayDate}</p>
                  </div>
                  <p className="text-[15px] sm:text-base text-[var(--color-duo-text)] line-clamp-2 leading-relaxed font-sans font-bold tracking-tight  custom-verse-text verse-size-sm">{v.text}</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
});
