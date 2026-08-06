import React from "react";
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, Share2, MoreVertical, 
  Shuffle, Search, Image as ImageIcon, 
  Settings as SettingsIcon, Info, Lightbulb,
  Heart, Quote, Flame
} from 'lucide-react';

interface HeaderProps {
  streak: number;
  onStreakClick: () => void;
  enableQuotes?: boolean;
  onToggleQuotes?: (enabled: boolean) => void;
  onMenuClick: () => void;
  onSettingsClick: () => void;
  onRandomClick: () => void;
  onShareClick: () => void;
  onSearchClick: () => void;
  onBackgroundClick: () => void;
  onEmotionsClick: () => void;
  onAboutClick: () => void;
}

export const Header = React.memo(function Header({ streak, onStreakClick, onMenuClick, onSettingsClick, onRandomClick, onShareClick, onSearchClick, onBackgroundClick, onEmotionsClick, onAboutClick, enableQuotes, onToggleQuotes }: HeaderProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative z-20">
      <header className="absolute top-0 left-0 right-0 h-[100px] bg-[var(--color-duo-bg)]/90 backdrop-blur-2xl border-b-2 border-[var(--color-duo-border)] rounded-b-[24px] shadow-sm flex items-center justify-between px-6 sm:px-8 pb-2 pt-8 z-40">
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={onMenuClick} className="btn-icon p-2 w-10 sm:w-12 h-10 sm:h-12">
            <Menu className="w-5 sm:w-6 h-5 sm:h-6 text-[var(--color-duo-text-light)]" />
          </button>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-[20px] sm:rounded-[24px] bg-gradient-to-br from-[#ffaf4d] to-[var(--color-duo-orange)] shadow-md flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-white/20 animate-pulse mix-blend-overlay"></div>
              <Lightbulb className="w-5 sm:w-6 h-5 sm:h-6 text-white relative z-10" strokeWidth={2.5} />
            </div>
            <h1 className="text-xl sm:text-2xl duo-title truncate">Luz Diária</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Streak indicator */}
          <button onClick={onStreakClick} className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-duo-bg-sec)] rounded-full border-2 border-[var(--color-duo-border)] border-b-4 mr-2 sm:mr-4 active:border-b-2 active:translate-y-[2px] transition-all cursor-pointer hover:bg-stone-100 dark:hover:bg-zinc-800">
            <Flame className="w-5 sm:w-6 h-5 sm:h-6 text-[var(--color-duo-orange)] fill-[var(--color-duo-orange)]" />
            <span className="text-lg font-bold text-[var(--color-duo-orange)]">{streak}</span>
          </button>
          
          <button className="btn-icon p-2 w-10 sm:w-12 h-10 sm:h-12" onClick={onShareClick}>
            <Share2 className="w-5 sm:w-6 h-5 sm:h-6 text-[var(--color-duo-text-light)]" />
          </button>
          <button 
            className="btn-icon p-2 w-10 sm:w-12 h-10 sm:h-12"
            onClick={() => setShowMenu(!showMenu)}
          >
            <MoreVertical className="w-5 sm:w-6 h-5 sm:h-6 text-[var(--color-duo-text-light)]" />
          </button>
        </div>
      </header>
      
      <AnimatePresence>
      {showMenu && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)} 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-24 right-4 md:right-[calc(50vw-28rem+1rem)] xl:right-[calc(50vw-28rem+1rem)] bg-[var(--color-duo-bg)] rounded-[24px] border-2 border-[var(--color-duo-border)] border-b-4 shadow-2xl p-2 w-64 z-50 overflow-hidden"
          >
            {[
              { icon: <Shuffle className="w-4 h-4"/>, text: "Versículos por Tema", action: onRandomClick },
              { icon: <Heart className="w-4 h-4"/>, text: "Como você está?", action: onEmotionsClick },
              { icon: <Search className="w-4 h-4"/>, text: "Buscar", action: onSearchClick },
              { isToggle: true, icon: <Quote className="w-4 h-4"/>, text: "Frases Cristãs", enabled: enableQuotes, action: () => onToggleQuotes?.(!enableQuotes) },
              { icon: <ImageIcon className="w-4 h-4"/>, text: "Fundo", action: onBackgroundClick },
              { icon: <SettingsIcon className="w-4 h-4"/>, text: "Configurações", action: onSettingsClick },
              { icon: <Info className="w-4 h-4"/>, text: "Sobre", action: onAboutClick }
            ].map((item, i) => {
              if (item.isToggle) {
                return (
                  <label key={i} className="w-full px-4 py-3 hover:bg-[var(--color-duo-bg-sec)] rounded-[16px] flex items-center justify-between transition-colors cursor-pointer">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-[var(--color-duo-orange)]">{item.icon}</span>
                      <span className="text-[var(--color-duo-text)] text-sm font-medium">{item.text}</span>
                    </div>
                    <div className="relative inline-flex items-center">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={item.enabled || false}
                        onChange={( ) => {
                          if (item.action) item.action();
                        }}
                      />
                      <div className="w-9 h-5 bg-stone-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-zinc-600 peer-checked:bg-[var(--color-duo-orange)]"></div>
                    </div>
                  </label>
                );
              }
              return (
                <button 
                  key={i}
                  className="w-full text-left px-4 py-3 hover:bg-[var(--color-duo-bg-sec)] rounded-[16px] flex items-center gap-2 sm:gap-3 text-[var(--color-duo-text)] text-sm font-medium transition-colors"
                  onClick={() => {
                    setShowMenu(false);
                    if(item.action) item.action();
                  }}
                >
                  <span className="text-[var(--color-duo-orange)]">{item.icon}</span>
                  {item.text}
                </button>
              );
            })}
          </motion.div>
        </>
      )}
      </AnimatePresence>
    </div>
  );
});
