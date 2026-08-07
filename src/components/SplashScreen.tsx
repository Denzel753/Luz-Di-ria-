
import { motion } from 'motion/react';

export function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--color-duo-bg)]"
    >
      <div className="flex flex-col items-center gap-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.2,
            type: "spring",
            stiffness: 100 
          }}
          className="duo-card w-24 h-24 flex items-center justify-center p-5"
        >
          <img src="./icon.svg" alt="Luz Diária Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
        </motion.div>
        
        <div className="text-center">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-4xl duo-title"
          >
            Luz Diária
          </motion.h1>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-[var(--color-duo-text-light)] font-bold mt-2 uppercase tracking-widest text-sm"
          >
            Sua dose diária de inspiração
          </motion.p>
        </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-12 flex flex-col items-center gap-2"
      >
        <div className="w-1 h-1 rounded-full bg-[var(--color-duo-orange)] animate-bounce" />
      </motion.div>
    </motion.div>
  );
}
