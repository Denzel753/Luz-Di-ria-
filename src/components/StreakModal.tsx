<<<<<<< HEAD
import React from 'react';
=======
>>>>>>> 7becaadd69e4e155ea267758c4f52deac4eb57c9
import { motion, AnimatePresence } from 'motion/react';
import { Flame, X, Check, Calendar, Award } from 'lucide-react';

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  streak: number;
}

<<<<<<< HEAD
export const StreakModal = React.memo(function StreakModal({ isOpen, onClose, streak }: StreakModalProps) {
=======
export function StreakModal({ isOpen, onClose, streak }: StreakModalProps) {
>>>>>>> 7becaadd69e4e155ea267758c4f52deac4eb57c9
  // Generate a mock history for the last 7 days (today is the last one)
  const days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const todayIndex = new Date().getDay();
  
  // Create an array of 7 days ending in today
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const dayIndex = (todayIndex - 6 + i + 7) % 7;
    return {
      label: days[dayIndex],
      isActive: i >= 7 - Math.min(streak, 7), // Just a visual mock: last N days active
      isToday: i === 6
    };
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="duo-modal w-full max-w-md pointer-events-auto overflow-hidden bg-[var(--color-duo-bg)] relative flex flex-col"
            >
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-[var(--color-duo-bg-sec)] rounded-full text-[var(--color-duo-text-light)] hover:text-[var(--color-duo-text)] transition-colors z-10 border border-[var(--color-duo-border)]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8 pb-6 flex flex-col items-center text-center relative">
                {/* Background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-orange-500/20 blur-[60px] rounded-full pointer-events-none"></div>
                
                <motion.div 
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 10,
                    delay: 0.1
                  }}
                  className="w-24 h-24 rounded-full bg-gradient-to-b from-[#ffc800] to-[var(--color-duo-orange)] flex items-center justify-center shadow-xl mb-4 relative z-10 border-4 border-white dark:border-[#111111]"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [1, 0.8, 1]
                    }}
                    transition={{ 
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut"
                    }}
                  >
                    <Flame className="w-12 h-12 text-white fill-white" />
                  </motion.div>
                </motion.div>
                
                <h2 className="text-3xl duo-title mb-1 relative z-10">{streak} Dias Seguidos</h2>
                <p className="text-[var(--color-duo-text-light)] font-medium text-lg relative z-10">Você está em chamas! 🔥</p>
              </div>

              <div className="px-6 py-6 bg-[var(--color-duo-bg-sec)] border-t border-[var(--color-duo-border)]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-sm tracking-widest uppercase text-[var(--color-duo-text-light)] flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Esta Semana
                  </h3>
                </div>
                
                <div className="flex justify-between gap-2">
                  {last7Days.map((day, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + (i * 0.05) }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2
                        ${day.isActive 
                          ? 'bg-[var(--color-duo-orange)] border-[var(--color-duo-orange)] text-white shadow-md' 
                          : 'bg-[var(--color-duo-bg)] border-[var(--color-duo-border)] text-[var(--color-duo-text-light)]'
                        }
                        ${day.isToday ? 'ring-2 ring-offset-2 ring-[var(--color-duo-orange)] dark:ring-offset-[#1a1a1a]' : ''}
                      `}>
                        {day.isActive ? <Check className="w-5 h-5" strokeWidth={3} /> : <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-duo-border-dark)]" />}
                      </div>
                      <span className={`text-xs font-black ${day.isToday ? 'text-[var(--color-duo-text)]' : 'text-[var(--color-duo-text-light)]'}`}>
                        {day.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="p-6">
                <div className="duo-card p-4 flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0 border border-amber-200 dark:border-amber-800">
                    <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--color-duo-text)] text-sm mb-0.5">Próximo Marco: 14 Dias</h4>
                    <div className="duo-progress-container h-2 mt-2">
                      <div className="duo-progress-bar w-[85%] bg-amber-500" />
                    </div>
                    <p className="text-xs text-[var(--color-duo-text-light)] mt-1.5">Faltam apenas 2 dias!</p>
                  </div>
                </div>

                <button onClick={onClose} className="w-full py-4 text-base gap-2 bg-[#58cc02] hover:bg-[#46a302] text-white font-bold flex items-center justify-center transition-all outline-none select-none border-b-4 border-[#46a302] active:border-b-0 active:translate-y-[4px] rounded-full">
                  <Check className="w-6 h-6" />
                  CONCLUIR
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
<<<<<<< HEAD
});
=======
}
>>>>>>> 7becaadd69e4e155ea267758c4f52deac4eb57c9
