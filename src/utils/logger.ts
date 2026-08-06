export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  stack?: string;
  context?: any;
}

const LOG_KEY = 'app_error_logs';
const MAX_LOGS = 50;

export type LogListener = (entry: LogEntry) => void;

class Logger {
  private logs: LogEntry[] = [];
  private listeners: LogListener[] = [];

  constructor() {
    this.loadLogs();
  }

  subscribe(listener: LogListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(entry: LogEntry) {
    this.listeners.forEach(listener => {
      try {
        listener(entry);
      } catch (e) {
        console.warn('Error in log listener', e);
      }
    });
  }

  private loadLogs() {
    try {
      const stored = localStorage.getItem(LOG_KEY);
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Failed to load logs", e);
    }
  }

  private saveLogs() {
    try {
      localStorage.setItem(LOG_KEY, JSON.stringify(this.logs));
    } catch (e) {
      console.warn("Failed to save logs", e);
    }
  }

  private addLog(entry: Omit<LogEntry, 'timestamp'>) {
    const newEntry: LogEntry = {
      ...entry,
      timestamp: new Date().toISOString()
    };
    
    this.logs.unshift(newEntry);
    
    if (this.logs.length > MAX_LOGS) {
      this.logs = this.logs.slice(0, MAX_LOGS);
    }
    this.saveLogs();
    
    this.notifyListeners(newEntry);
  }

  error(message: string, error?: any, context?: any) {
    console.error(message, error);
    this.addLog({
      level: 'error',
      message: message + (error?.message ? `: ${error.message}` : ''),
      stack: error?.stack || (error instanceof Error ? error.stack : undefined),
      context
    });
  }

  warn(message: string, context?: any) {
    console.warn(message);
    this.addLog({
      level: 'warn',
      message,
      context
    });
  }

  info(message: string, context?: any) {
    console.info(message);
    this.addLog({
      level: 'info',
      message,
      context
    });
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
    this.saveLogs();
  }

  exportLogs() {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new Logger();
