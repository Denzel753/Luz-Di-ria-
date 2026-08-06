
import { motion, AnimatePresence } from 'motion/react';
import { Check, Info, AlertTriangle } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 left-0 right-0 z-[100] flex flex-col items-center gap-2 pointer-events-none px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`
              pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-[20px] shadow-lg border backdrop-blur-md max-w-sm w-full
              ${toast.type === 'success' ? 'bg-emerald-50/90 dark:bg-emerald-950/90 border-emerald-200/50 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-200' : ''}
              ${toast.type === 'info' ? 'bg-stone-50/90 dark:bg-zinc-900/90 border-stone-200/50 dark:border-zinc-800/50 text-stone-800 dark:text-zinc-200' : ''}
              ${toast.type === 'error' ? 'bg-red-50/90 dark:bg-red-950/90 border-red-200/50 dark:border-red-800/50 text-red-800 dark:text-red-200' : ''}
            `}
            onClick={() => onRemove(toast.id)}
          >
            {toast.type === 'success' && <Check className="w-5 h-5 shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 shrink-0" />}
            {toast.type === 'error' && <AlertTriangle className="w-5 h-5 shrink-0" />}
            <p className="text-sm font-medium">{toast.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
