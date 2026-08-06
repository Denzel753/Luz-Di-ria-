import React, { ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle, Download } from 'lucide-react';
import { logger } from '../utils/logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Uncaught error caught by ErrorBoundary', error, { errorInfo });
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleExportLogs = () => {
    const logs = logger.exportLogs();
    const blob = new Blob([logs], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `luz_diaria_error_logs_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-[20px] p-6 max-w-sm w-full shadow-lg flex flex-col items-center gap-4">
            <div className="bg-amber-100 dark:bg-amber-950/60 p-3.5 rounded-full text-amber-700 dark:text-amber-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <h2 className="text-xl font-bold text-stone-800 dark:text-zinc-100">
              Ops! Algo deu errado
            </h2>
            
            <p className="text-xs text-stone-600 dark:text-zinc-400 leading-relaxed">
              O aplicativo encontrou um problema inesperado. Você pode exportar os logs para ajudar o desenvolvedor a corrigir.
            </p>

            <div className="w-full flex flex-col gap-2 mt-2">
              <button
                onClick={this.handleReload}
                className="btn-primary w-full py-4 gap-2 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Recarregar Aplicativo
              </button>
              
              <button
                onClick={this.handleExportLogs}
                className="w-full py-3 px-4 bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-300 font-medium rounded-[16px] transition-all active:scale-95 flex items-center justify-center gap-2 text-sm border border-stone-200 dark:border-zinc-700"
              >
                <Download className="w-4 h-4" />
                Exportar Logs de Erro
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

