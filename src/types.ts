export interface Verse {
  id: string;
  text: string;
  originalText?: string;
  reference: string;
  date: string; // YYYY-MM-DD
}

export interface AppSettings {
  // Notificações
  dailyNotification: boolean;
  notifyNewVerse: boolean;
  notificationStartTime: string;
  notificationEndTime: string;
  updateInterval: number; // In minutes
  lastVerseUpdateTimestamp?: number;
  showPopup: boolean;
  sound: string;
  vibrate: boolean;
  wakeDevice: boolean;
  flashLed: boolean;
  enableQuotes?: boolean;

  // Configurações de som
  playSoundOnLaunch: boolean;
  
  // Tema geral do App
  appFontFamily?: string;
  appFontSize?: number;
  // Tema
  bibleVersion: string;
  theme: 'light' | 'dark' | 'system';
  // Texto
  verseFontFamily: string;
  verseFontSize: number;
  verseFontWeight: 'normal' | 'bold';
  verseFontStyle: 'normal' | 'italic';

  // Fundo
  backgroundType: 'color' | 'image';
  backgroundColor: string;
  backgroundImageUrl: string;
}
