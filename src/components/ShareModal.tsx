import { motion, AnimatePresence } from 'motion/react';
import { X, Type, Image as Share2, Download, Check } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShareText: () => void;
  onShareImage: () => void;
  onDownloadImage: () => void;
  isGenerating: boolean;
  hasDownloaded: boolean;
}

export function ShareModal({ 
  isOpen, 
  onClose, 
  onShareText, 
  onShareImage, 
  onDownloadImage,
  isGenerating,
  hasDownloaded
}: ShareModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="duo-modal w-full max-w-sm overflow-hidden relative flex flex-col animate-in zoom-in-95 duration-[320ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          >
            <div className="flex items-center justify-between p-5 border-b-2 border-[var(--color-duo-border)]">
              <h2 className="text-lg font-bold text-[var(--color-duo-text)]">Compartilhar Versículo</h2>
              <button 
                onClick={onClose}
                className="btn-ghost"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 flex flex-col gap-3">
              <button
                onClick={onShareText}
                className="duo-card-interactive w-full flex items-center gap-4 p-4"
              >
                <div className="w-10 h-10 rounded-full bg-amber-100 text-[var(--color-duo-orange)] flex items-center justify-center flex-shrink-0">
                  <Type className="w-5 h-5 text-[var(--color-duo-orange)]" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-semibold text-[var(--color-duo-text)]">Compartilhar como Texto</h3>
                  <p className="text-xs text-[var(--color-duo-text-light)] mt-0.5">Copia ou envia apenas as palavras do versículo</p>
                </div>
              </button>
              
              <button
                onClick={onShareImage}
                disabled={isGenerating}
                className="duo-card-interactive w-full flex items-center gap-4 p-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                  {isGenerating ? (
                    <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Share2 className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                  )}
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-semibold text-[var(--color-duo-text)]">Compartilhar como Imagem</h3>
                  <p className="text-xs text-[var(--color-duo-text-light)] mt-0.5">Gera uma imagem com o visual da tela atual</p>
                </div>
              </button>

              <button
                onClick={onDownloadImage}
                disabled={isGenerating || hasDownloaded}
                className="duo-card-interactive w-full flex items-center gap-4 p-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  {hasDownloaded ? (
                    <Check className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                  ) : isGenerating ? (
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Download className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                  )}
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-semibold text-[var(--color-duo-text)]">Salvar na Galeria</h3>
                  <p className="text-xs text-[var(--color-duo-text-light)] mt-0.5">Baixa a imagem no seu dispositivo</p>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
