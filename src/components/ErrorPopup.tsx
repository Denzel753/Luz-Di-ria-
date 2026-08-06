import { useEffect, useState } from 'react';
import { AlertTriangle, X, Send } from 'lucide-react';
import { logger, LogEntry } from '../utils/logger';

export function ErrorPopup() {
  const [errorEntry, setErrorEntry] = useState<LogEntry | null>(null);

  useEffect(() => {
    const unsubscribe = logger.subscribe((entry) => {
      if (entry.level === 'error') {
        setErrorEntry(entry);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!errorEntry) return null;

  const handleSendEmail = () => {
    const logs = logger.exportLogs();
    const body = `Aqui estão os logs de erro:\n\n${logs}`;
    window.location.href = `mailto:victorjuca@proton.me?subject=Luz Diária - Relatório de Erro&body=${encodeURIComponent(body)}`;
    setErrorEntry(null);
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4">
      <div className="bg-[var(--color-duo-bg)] border-2 border-l-4 border-[var(--color-duo-border)] border-l-amber-500 rounded-[16px] shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-4">
        <div className="p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-bold text-[var(--color-duo-text)] mb-1">
              Ops! Um erro ocorreu
            </h3>
            <p className="text-xs text-[var(--color-duo-text-light)] mb-3 leading-relaxed">
              Encontramos um problema. Por favor, envie o log para o desenvolvedor para ajudar a corrigir.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSendEmail}
                className="btn-primary w-full py-2 px-3 text-xs"
              >
                <Send className="w-3 h-3" />
                Enviar Relatório
              </button>
            </div>
          </div>
          <button
            onClick={() => setErrorEntry(null)}
            className="btn-ghost"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
