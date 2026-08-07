import { AnimatePresence } from "motion/react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Shuffle, Star, Network, Youtube, Copy, Check, Book, BookOpen } from "lucide-react";
import { Header } from "./components/Header";
import { BottomNav } from "./components/BottomNav";
import { Drawer } from "./components/Drawer";
import { Settings } from "./components/Settings";
import { VerseDisplay } from "./components/VerseDisplay";
import { RandomVerseSelector } from "./components/RandomVerseSelector";
import { PermissionModal } from "./components/PermissionModal";
import { CrossReferencesModal } from "./components/CrossReferencesModal";
import { SearchModal } from "./components/SearchModal";
import { EmotionsModal } from "./components/EmotionsModal";
import { BackgroundModal } from "./components/BackgroundModal";
import { AboutModal } from "./components/AboutModal";
import { ShareModal } from "./components/ShareModal";
import { SplashScreen } from "./components/SplashScreen";
import { ErrorPopup } from "./components/ErrorPopup";
import { ToastContainer, ToastMessage } from "./components/Toast";
import { toBlob } from "html-to-image";
import {
  getVerseOfTheDay,
  getRandomVerseByTopic,
} from "./data";
import { getRandomQuote } from "./quotes";
import { getVerseTextInVersion } from "./bibleVersions";
import { AppSettings, Verse } from "./types";
import { playNotificationSound } from "./audio";
import {
  showPersistentNotification,
  shareText,
  shareImage,
  vibrate,
  copyToClipboard,
  startNativeService,
  scheduleDailyVerse,
} from "./capacitorCompat";

function useSessionState<T>(
  key: string,
  initialValue: T,
): [T, (val: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setSessionState = (value: T | ((prev: T) => T)) => {
    setState((prev) => {
      const nextVal =
        typeof value === "function" ? (value as Function)(prev) : value;
      try {
        localStorage.setItem(key, JSON.stringify(nextVal));
      } catch (e) {}
      return nextVal;
    });
  };

  return [state, setSessionState];
}

export default function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useSessionState(
    "isDrawerOpen",
    false,
  );
  const [isSettingsOpen, setIsSettingsOpen] = useSessionState(
    "isSettingsOpen",
    false,
  );
  const [isRandomSelectorOpen, setIsRandomSelectorOpen] = useSessionState(
    "isRandomSelectorOpen",
    false,
  );
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [isCrossReferencesOpen, setIsCrossReferencesOpen] = useSessionState(
    "isCrossReferencesOpen",
    false,
  );
  const [isSearchOpen, setIsSearchOpen] = useSessionState(
    "isSearchOpen",
    false,
  );
  const [isEmotionsOpen, setIsEmotionsOpen] = useSessionState(
    "isEmotionsOpen",
    false,
  );
  const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useSessionState(
    "isBackgroundModalOpen",
    false,
  );
  const [isAboutOpen, setIsAboutOpen] = useSessionState("isAboutOpen", false);
  const [isShareModalOpen, setIsShareModalOpen] = useSessionState(
    "isShareModalOpen",
    false,
  );
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  const isStartupRef = useRef(true);
  const [currentVerse, setCurrentVerse] = useState<Verse>(() => {
    try {
      const saved = localStorage.getItem("currentVerse");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          if (parsed.text && parsed.text.includes("não disponível offline")) {
            return getVerseOfTheDay();
          }
          return parsed;
        }
      }
    } catch (e) {}
    return getVerseOfTheDay();
  });
  const [giantPopupVerse, setGiantPopupVerse] = useState<Verse | null>(null);
  const verseSinceLastQuoteRef = useRef<number>(0);

  const getNextRandomVerse = useCallback((topicId: string, currentSettings: AppSettings) => {
    if (currentSettings.enableQuotes) {
      // Create a slight randomness between 1 and 2 verses before a quote
      const maxVerses = Math.floor(Math.random() * 2) + 1; // 1 or 2
      if (verseSinceLastQuoteRef.current >= maxVerses) {
        verseSinceLastQuoteRef.current = 0;
        return getRandomQuote();
      } else {
        verseSinceLastQuoteRef.current++;
        return getRandomVerseByTopic(topicId, currentSettings.bibleVersion);
      }
    }
    return getRandomVerseByTopic(topicId, currentSettings.bibleVersion);
  }, []);

  // Toast State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = useCallback((type: "success" | "info" | "error", message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);
  const [isFlashing, setIsFlashing] = useState(false);

  const [favoriteVerses, setFavoriteVerses] = useState<Verse[]>(() => {
    try {
      const savedFavs = localStorage.getItem("favoriteVersesData");
      if (savedFavs) {
        const parsed = JSON.parse(savedFavs);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
      }
    } catch (e) {}
    return [];
  });
  const [recentVerses, setRecentVerses] = useState<Verse[]>(() => {
    try {
      const savedRecents = localStorage.getItem("recentVerses");
      if (savedRecents) {
        const parsed = JSON.parse(savedRecents);
        if (Array.isArray(parsed)) {
          return parsed
            .filter(Boolean)
            .map((v) => {
              if (v.text && v.text.includes("não disponível offline")) {
                return { ...v, text: "Texto não encontrado." };
              }
              return v;
            })
            .filter((v) => v.text !== "Texto não encontrado.");
        }
      }
    } catch (e) {}
    return [];
  });
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const savedSettings = localStorage.getItem("appSettings");
      if (savedSettings) return JSON.parse(savedSettings);
    } catch (e) {}
    return {
      dailyNotification: false,
      notifyNewVerse: true,
      notificationStartTime: "08:00",
      notificationEndTime: "22:00",
      updateInterval: 1440,
      showPopup: false,
      sound: "Celeste",
      vibrate: false,
      wakeDevice: false,
      flashLed: false,

      playSoundOnLaunch: false,
      bibleVersion: "NVI",
      theme: "system",
      appFontFamily: "sans",
      appFontSize: 100,
      verseFontFamily: "sans",
      verseFontSize: 100,
      verseFontWeight: "normal",
      verseFontStyle: "normal",
      backgroundType: "color",
      backgroundColor: "transparent",
      backgroundImageUrl: "",
    };
  });

  const [showSplash, setShowSplash] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Always keep settingsRef in sync synchronously
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    // Apply global font family
    const html = document.documentElement;

    // Reset any previous root font-size scaling to default (so layout doesn't scale)
    html.style.fontSize = "";

    // Font family
    const family = settings.appFontFamily || "sans";
    let fontFamilyStr = "";
    switch (family) {
      case "sans":
        fontFamilyStr =
          'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
        break;
      case "serif":
        fontFamilyStr =
          'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';
        break;
      case "mono":
        fontFamilyStr =
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
        break;
      case "inter":
        fontFamilyStr = '"Inter", sans-serif';
        break;
      case "roboto":
        fontFamilyStr = '"Roboto", sans-serif';
        break;
      case "lora":
        fontFamilyStr = '"Lora", serif';
        break;
      case "merriweather":
        fontFamilyStr = '"Merriweather", serif';
        break;
      case "playfair":
        fontFamilyStr = '"Playfair Display", serif';
        break;
      case "montserrat":
        fontFamilyStr = '"Montserrat", sans-serif';
        break;
      case "oswald":
        fontFamilyStr = '"Oswald", sans-serif';
        break;
    }

    if (fontFamilyStr) {
      html.style.setProperty("--font-sans", fontFamilyStr);
      html.style.setProperty("font-family", fontFamilyStr);
    }
  }, [settings.appFontSize, settings.appFontFamily]);

  // Theme check

  // Check permissions on mount
  useEffect(() => {
    const permissionsDone = localStorage.getItem("permissionsDone");
    if (!permissionsDone) {
      setIsPermissionModalOpen(true);
    } else {
      // Trigger persistent notification if granted
      updatePersistentNotification(currentVerse);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      if (settings.theme === "dark") {
        root.classList.add("dark");
      } else if (settings.theme === "light") {
        root.classList.remove("dark");
      } else {
        if (mediaQuery.matches) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    };

    applyTheme();

    const listener = () => applyTheme();
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, [settings.theme]);

  // Screen Wake Lock
  useEffect(() => {
    let wakeLock: { release: () => void } | null = null;

    const requestWakeLock = async () => {
      if ("wakeLock" in navigator && settings.wakeDevice) {
        try {
          wakeLock = await (navigator as any).wakeLock.request("screen");
        } catch (err) {
          console.warn(`Wake Lock error: ${err}`);
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && settings.wakeDevice) {
        requestWakeLock();
      }
    };

    if (settings.wakeDevice) {
      requestWakeLock();
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      if (wakeLock !== null) {
        try {
          wakeLock.release();
        } catch (e) {}
        wakeLock = null;
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [settings.wakeDevice]);

  // Update recent verses chronologically when currentVerse changes
  useEffect(() => {
    setRecentVerses((prev) => {
      // Keep previous occurrences on different days, but remove it from today if it already exists to avoid same-day duplicates
      const todayStr = new Date().toLocaleDateString();
      const filtered = prev.filter(
        (v) =>
          v &&
          !(
            v.id === currentVerse.id &&
            v.date &&
            new Date(v.date).toLocaleDateString() === todayStr
          ),
      );
      const newVerse = { ...currentVerse, date: new Date().toISOString() };
      const updated = [newVerse, ...filtered].slice(0, 300); // limit to 300
      return updated;
    });

    // Update persistent notification
    if (localStorage.getItem("permissionsDone")) {
      updatePersistentNotification(currentVerse);
    }
  }, [currentVerse]);

  const updatePersistentNotification = (verse: Verse) => {
    try {
      showPersistentNotification(
        `Luz Diária • ${verse.reference}`,
        verse.text,
      );
    } catch (e) {
      console.log("Error creating notification", e);
    }
  };

  const handlePermissionsGranted = () => {
    localStorage.setItem("permissionsDone", "true");
    setSettings((prev) => ({ ...prev, dailyNotification: true }));
    updatePersistentNotification(currentVerse);
    // No Android: inicia o serviço em primeiro plano (app não morre em background)
    // e agenda o alarme com o intervalo configurado
    startNativeService();
    scheduleWithCurrentSettings();
  };

  // Agenda (ou reagenda) o alarme nativo conforme as configurações atuais.
  // Usa versículo OU frase aleatória se o usuário habilitou frases.
  const scheduleWithCurrentSettings = () => {
    const s = settingsRef.current;
    const startTime = s.notificationStartTime || "08:00";
    const [h, m] = startTime.split(":").map(Number);
    const interval = s.updateInterval || 1440;
    // Versículo ou frase aleatória (frase usa o autor como referência)
    const randomVerse = getNextRandomVerse("all", s);
    const useQuote = s.enableQuotes && Math.random() < 0.5;
    const content = useQuote ? getRandomQuote() : randomVerse;
    const ref = useQuote ? (content as any).author || "Luz Diária" : content.reference;
    scheduleDailyVerse(h || 8, m || 0, interval, content.text, ref);
  };

  // Reagenda quando o usuário muda intervalo/horário/status nas configurações
  useEffect(() => {
    if (localStorage.getItem("permissionsDone") && settings.dailyNotification) {
      scheduleWithCurrentSettings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.updateInterval, settings.notificationStartTime, settings.enableQuotes, settings.dailyNotification]);

  // Save states to local storage individually to prevent unnecessary re-stringifying
  useEffect(() => {
    try {
      localStorage.setItem("appSettings", JSON.stringify(settings));
    } catch (e) {
      console.error("Storage error saving settings:", e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem("favoriteVersesData", JSON.stringify(favoriteVerses));
    } catch (e) {
      console.error("Storage error saving favoriteVerses:", e);
    }
  }, [favoriteVerses]);

  useEffect(() => {
    try {
      localStorage.setItem("currentVerse", JSON.stringify(currentVerse));
    } catch (e) {
      console.error("Storage error saving currentVerse:", e);
    }
  }, [currentVerse]);

  useEffect(() => {
    try {
      localStorage.setItem("recentVerses", JSON.stringify(recentVerses));
    } catch (e) {
      console.error("Storage error saving recentVerses:", e);
    }
  }, [recentVerses]);
  // Translate verses when bibleVersion changes
  useEffect(() => {
    const v = settings.bibleVersion || "NVI";
    setCurrentVerse((prev) => ({
      ...prev,
      originalText: prev.originalText || prev.text,
      text: getVerseTextInVersion(
        prev.reference,
        v,
        prev.originalText || prev.text,
      ),
    }));
    if (giantPopupVerse) {
      setGiantPopupVerse((prev) =>
        prev
          ? {
              ...prev,
              originalText: prev.originalText || prev.text,
              text: getVerseTextInVersion(
                prev.reference,
                v,
                prev.originalText || prev.text,
              ),
            }
          : null,
      );
    }
    setFavoriteVerses((prev) =>
      prev.map((item) => ({
        ...item,
        originalText: item.originalText || item.text,
        text: getVerseTextInVersion(
          item.reference,
          v,
          item.originalText || item.text,
        ),
      })),
    );
    setRecentVerses((prev) =>
      prev.map((item) => ({
        ...item,
        originalText: item.originalText || item.text,
        text: getVerseTextInVersion(
          item.reference,
          v,
          item.originalText || item.text,
        ),
      })),
    );
  }, [settings.bibleVersion]);

  // Periodic updates
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    const triggerVibration = (shouldVibrate: boolean) => {
      if (shouldVibrate) {
        vibrate([200, 100, 200]);
      }
    };


    const triggerUpdate = (isStartup: boolean = false) => {
      const currentSettings = settingsRef.current;
      const newVerse = getNextRandomVerse("all", currentSettings); //

      setCurrentVerse(newVerse);

      const now = Date.now();
      const updatedSettings = {
        ...currentSettings,
        lastVerseUpdateTimestamp: now,
      };
      settingsRef.current = updatedSettings;
      setSettings(updatedSettings);

      if (isStartup) return;

      // Se o usuário está DENTRO do aplicativo (aba visível), não dispara
      // pop-up nem notificação — ele já está vendo o versículo na tela.
      // Somente quando o app está em segundo plano o alerta é necessário.
      const appVisible = typeof document !== 'undefined' && document.visibilityState === 'visible';
      if (appVisible) return;

      if (currentSettings.flashLed) {
        let count = 0;
        const flashInterval = setInterval(() => {
          setIsFlashing((prev) => !prev);
          count++;
          if (count > 5) {
            clearInterval(flashInterval);
            setIsFlashing(false);
          }
        }, 150);
      }

      playNotificationSound(currentSettings.sound);
      triggerVibration(currentSettings.vibrate);

      if (currentSettings.showPopup) {
        setGiantPopupVerse(newVerse);
      }

      showPersistentNotification(
        `Novo Versículo • ${newVerse.reference}`,
        newVerse.text,
      );
    };

    const checkAndSchedule = () => {
      try {
        const now = new Date();
        const currentSettings = settingsRef.current;
        const isStartup = isStartupRef.current;

        const startStr = currentSettings.notificationStartTime || "08:00";
        const endStr = currentSettings.notificationEndTime || "22:00";

        const [startH, startM] = startStr.split(":").map(Number);
        const [endH, endM] = endStr.split(":").map(Number);

        const isTimeInWindow = (date: Date) => {
          const m = date.getHours() * 60 + date.getMinutes();
          const startMins = startH * 60 + startM;
          const endMins = endH * 60 + endM;
          if (startMins <= endMins) {
            return m >= startMins && m <= endMins;
          } else {
            return m >= startMins || m <= endMins;
          }
        };

        if (!isTimeInWindow(now)) return;

        if (!currentSettings.lastVerseUpdateTimestamp) {
          const updated = {
            ...currentSettings,
            lastVerseUpdateTimestamp: now.getTime(),
          };
          settingsRef.current = updated;
          setSettings(updated);
          if (isStartup) isStartupRef.current = false;
          return;
        }

        if (currentSettings.updateInterval === 1440) {
          // Daily
          const nextTime = new Date(now);
          nextTime.setHours(startH, startM, 0, 0);
          if (now.getTime() >= nextTime.getTime()) {
            const last = new Date(currentSettings.lastVerseUpdateTimestamp);
            if (last.getTime() < nextTime.getTime()) {
              if (isStartup) {
                const updated = {
                  ...currentSettings,
                  lastVerseUpdateTimestamp: now.getTime(),
                };
                settingsRef.current = updated;
                setSettings(updated);
              } else {
                triggerUpdate(false);
              }
            }
          }
        } else {
          // Custom interval
          const intervalMs = (currentSettings.updateInterval || 60) * 60 * 1000;
          const timeSinceLast =
            now.getTime() - currentSettings.lastVerseUpdateTimestamp;

          if (timeSinceLast >= intervalMs) {
            if (isStartup) {
              const updated = {
                ...currentSettings,
                lastVerseUpdateTimestamp: now.getTime(),
              };
              settingsRef.current = updated;
              setSettings(updated);
            } else {
              triggerUpdate(false);
            }
          }
        }
        if (isStartup) isStartupRef.current = false;
      } catch (e) {
        console.error("Error in checkAndSchedule:", e);
      }
    };

    // Check immediately
    checkAndSchedule();
    // Checa com frequência o suficiente para o menor intervalo (1 min)
    timer = setInterval(checkAndSchedule, 30 * 1000); // 30 segundos

    return () => {
      clearInterval(timer);
    };
  }, []);

  const toggleFavorite = useCallback(() => {
    setFavoriteVerses((prev) =>
      prev.some((v) => v && v.id === currentVerse.id)
        ? prev.filter((v) => v && v.id !== currentVerse.id)
        : [...prev, currentVerse],
    );
  }, [currentVerse]);

  const removeFavorite = useCallback((id: string) => {
    setFavoriteVerses((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const handleSetCurrentVerse = useCallback((verse: Verse) => {
    if (!verse) return;
    setCurrentVerse(verse);
  }, []);

  const handleShareText = async () => {
    const shareContent = `"${currentVerse.text}"\n\n— ${currentVerse.reference}`;
    const shared = await shareText("Luz Diária", shareContent);
    if (!shared) {
      const copied = await copyToClipboard(shareContent);
      if (copied) {
        addToast("success", "Versículo copiado para a área de transferência!");
      }
    }
  };

  const generateImageBlob = async (): Promise<Blob | null> => {
    if (!captureRef.current) return null;
    setIsGeneratingImage(true);
    try {
      const blob = await toBlob(captureRef.current, {
        cacheBust: true,
        pixelRatio: 1.5, // Reduced from 3 to 1.5 to aggressively prevent OOM background kills on mobile
        quality: 1,
        filter: (node) => {
          return !(
            node instanceof HTMLElement &&
            node.classList.contains("capture-ignore")
          );
        },
      });
      return blob;
    } catch (error) {
      console.error("Failed to generate image", error);
      addToast("error", "Erro ao gerar a imagem. Tente novamente.");
      return null;
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleShareImage = async () => {
    const blob = await generateImageBlob();
    if (!blob) return;

    try {
      const file = new File(
        [blob],
        `versiculo-${currentVerse.reference.replace(/\s/g, "-")}.png`,
        { type: "image/png" },
      );

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Luz Diária",
          text: "Olha que versículo lindo que eu vi hoje no app Luz Diária!",
        });
      } else {
        const shared = await shareImage(
          "Luz Diária",
          "Olha que versículo lindo que eu vi hoje no app Luz Diária!",
          file,
        );
        if (!shared) {
          handleDownloadImage(blob);
        }
      }
    } catch (error: any) {
      if (
        error.name !== "AbortError" &&
        !error.message?.includes("Share canceled") &&
        !error.message?.includes("cancel")
      ) {
        console.error("Error sharing image", error);
      } else {
        console.log("Share canceled by user");
      }
    }
  };

  const handleDownloadImage = async (preGeneratedBlob?: Blob | null) => {
    let blob = preGeneratedBlob instanceof Blob ? preGeneratedBlob : null;
    if (!blob) {
      blob = await generateImageBlob();
    }

    if (!blob) return;

    try {
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `versiculo-${currentVerse.reference.replace(/\s/g, "-")}.png`;
      link.href = blobUrl;
      link.click();

      // Cleanup URL object to free memory
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

      setHasDownloaded(true);
      setTimeout(() => setHasDownloaded(false), 3000);
    } catch (error) {
      console.error("Failed to download image", error);
    }
  };

  const appFontScale = (settings.appFontSize || 100) / 100;

  const customAppStyle = `
    .app-custom-font {
      font-family: ${
        settings.appFontFamily === "sans"
          ? 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
          : settings.appFontFamily === "serif"
            ? 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'
            : settings.appFontFamily === "mono"
              ? 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
              : settings.appFontFamily === "inter"
                ? '"Inter", sans-serif'
                : settings.appFontFamily === "roboto"
                  ? '"Roboto", sans-serif'
                  : settings.appFontFamily === "lora"
                    ? '"Lora", serif'
                    : settings.appFontFamily === "merriweather"
                      ? '"Merriweather", serif'
                      : settings.appFontFamily === "playfair"
                        ? '"Playfair Display", serif'
                        : settings.appFontFamily === "montserrat"
                          ? '"Montserrat", sans-serif'
                          : settings.appFontFamily === "oswald"
                            ? '"Oswald", sans-serif'
                            : "inherit"
      };
      font-size: calc(1.05rem * ${appFontScale});
    }
    .app-custom-font .text-xs { font-size: calc(0.75rem * ${appFontScale}) !important; }
    .app-custom-font .text-sm { font-size: calc(1.05rem * ${appFontScale}) !important; }
    .app-custom-font .text-base { font-size: calc(1.05rem * ${appFontScale}) !important; }
    .app-custom-font .text-lg { font-size: calc(1.125rem * ${appFontScale}) !important; }
    .app-custom-font .text-xl { font-size: calc(1.25rem * ${appFontScale}) !important; }
    .app-custom-font .text-2xl { font-size: calc(1.5rem * ${appFontScale}) !important; }
    .app-custom-font .text-3xl { font-size: calc(1.875rem * ${appFontScale}) !important; }
    .app-custom-font .text-4xl { font-size: calc(2.25rem * ${appFontScale}) !important; }
    .app-custom-font .text-\\[9px\\] { font-size: calc(9px * ${appFontScale}) !important; }
    .app-custom-font .text-\\[10px\\] { font-size: calc(10px * ${appFontScale}) !important; }
    .app-custom-font .text-\\[11px\\] { font-size: calc(11px * ${appFontScale}) !important; }
    .app-custom-font .text-\\[12px\\] { font-size: calc(12px * ${appFontScale}) !important; }
    .app-custom-font .text-\\[13px\\] { font-size: calc(13px * ${appFontScale}) !important; }
    .app-custom-font .text-\\[14px\\] { font-size: calc(14px * ${appFontScale}) !important; }
    .app-custom-font .text-\\[15px\\] { font-size: calc(15px * ${appFontScale}) !important; }
    .app-custom-font .text-\\[17px\\] { font-size: calc(17px * ${appFontScale}) !important; }
    .app-custom-font .text-\\[19px\\] { font-size: calc(19px * ${appFontScale}) !important; }
    .app-custom-font .text-\\[44px\\] { font-size: calc(44px * ${appFontScale}) !important; }
  `;

  const customVerseStyle = `
    .custom-verse-text {
      font-family: ${
        settings.verseFontFamily === "sans"
          ? 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
          : settings.verseFontFamily === "serif"
            ? 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'
            : settings.verseFontFamily === "mono"
              ? 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
              : settings.verseFontFamily === "inter"
                ? '"Inter", sans-serif'
                : settings.verseFontFamily === "roboto"
                  ? '"Roboto", sans-serif'
                  : settings.verseFontFamily === "lora"
                    ? '"Lora", serif'
                    : settings.verseFontFamily === "merriweather"
                      ? '"Merriweather", serif'
                      : settings.verseFontFamily === "playfair"
                        ? '"Playfair Display", serif'
                        : settings.verseFontFamily === "montserrat"
                          ? '"Montserrat", sans-serif'
                          : settings.verseFontFamily === "oswald"
                            ? '"Oswald", sans-serif'
                            : "inherit"
      };
      font-weight: ${settings.verseFontWeight || "normal"};
      font-style: ${settings.verseFontStyle || "normal"};
    }
    
    #root .app-custom-font .verse-size-display {
      font-size: calc(1.875rem * ${settings.verseFontSize ? settings.verseFontSize / 100 : 1} * var(--dynamic-scale, 1)) !important;
      line-height: 1.4 !important;
    }
    @media (min-width: 768px) {
      #root .app-custom-font .verse-size-display { font-size: calc(2.25rem * ${settings.verseFontSize ? settings.verseFontSize / 100 : 1} * var(--dynamic-scale, 1)) !important; }
    }
    @media (min-width: 1024px) {
      #root .app-custom-font .verse-size-display { font-size: calc(44px * ${settings.verseFontSize ? settings.verseFontSize / 100 : 1} * var(--dynamic-scale, 1)) !important; }
    }

    .verse-size-popup {
      font-size: calc(1.25rem * ${appFontScale}) !important;
      line-height: 1.625 !important;
    }
    @media (min-width: 640px) {
      .verse-size-popup { font-size: calc(1.5rem * ${appFontScale}) !important; }
    }

    .verse-size-sm {
      font-size: calc(1.05rem * ${appFontScale}) !important;
      line-height: 1.625 !important;
    }

    .verse-size-sm-md-base {
      font-size: calc(1.05rem * ${appFontScale}) !important;
      line-height: 1.625 !important;
    }
    @media (min-width: 768px) {
      .verse-size-sm-md-base { font-size: calc(1.05rem * ${appFontScale}) !important; }
    }
  `;

  const handleOpenCrossReferences = useCallback(() => {
    if (currentVerse.id.startsWith('q')) {
      addToast('info', 'Essa função é apenas para versículos.');
      return;
    }
    setIsCrossReferencesOpen(true);
  }, [currentVerse, addToast]);
  const handleSwapRandom = useCallback(() => handleSetCurrentVerse(getNextRandomVerse('all', settings)), [settings, handleSetCurrentVerse, getNextRandomVerse]);
  
  const handleCopy = useCallback(async () => {
    try {
      const ok = await copyToClipboard(`${currentVerse.text}\n\n— ${currentVerse.reference}`);
      if (ok) {
        setCopied(true);
        addToast('success', 'Versículo copiado para a área de transferência!');
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy', err);
    }
  }, [currentVerse, addToast]);

const handleOpenYoutube = useCallback(() => {
    if (!navigator.onLine) {
      addToast('error', 'Você está offline. Conecte-se à internet para buscar pregações no YouTube.');
      return;
    }
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(currentVerse.reference + ' pregação')}`, '_blank');
  }, [currentVerse.reference, addToast]);

  const handleMenuClick = useCallback(() => setIsDrawerOpen(true), []);
  const handleSettingsClick = useCallback(() => setIsSettingsOpen(true), []);
  const handleRandomClick = useCallback(() => setIsRandomSelectorOpen(true), []);
  const handleShareClick = useCallback(() => setIsShareModalOpen(true), []);
  const handleSearchClick = useCallback(() => setIsSearchOpen(true), []);
  const handleBackgroundClick = useCallback(() => setIsBackgroundModalOpen(true), []);
  const handleEmotionsClick = useCallback(() => setIsEmotionsOpen(true), []);
  const handleAboutClick = useCallback(() => setIsAboutOpen(true), []);

  
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const closeSettings = useCallback(() => setIsSettingsOpen(false), []);
  const closeBackgroundModal = useCallback(() => setIsBackgroundModalOpen(false), []);
  const closeAbout = useCallback(() => setIsAboutOpen(false), []);
  const closeCrossReferences = useCallback(() => setIsCrossReferencesOpen(false), []);
  const closeRandomSelector = useCallback(() => setIsRandomSelectorOpen(false), []);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);
  const closeEmotions = useCallback(() => setIsEmotionsOpen(false), []);
  const closeShareModal = useCallback(() => setIsShareModalOpen(false), []);
  const closePermissionModal = useCallback(() => setIsPermissionModalOpen(false), []);
  
  const handleToggleQuotes = useCallback((enabled: boolean) => {
    setSettings((prev) => {
      const newSettings = { ...prev, enableQuotes: enabled };
      settingsRef.current = newSettings;
      try {
        localStorage.setItem('bible-app-settings', JSON.stringify(newSettings));
      } catch (e) {
        console.error("Storage error saving settings:", e);
      }
      return newSettings;
    });
  }, []);

  
  const handleTestPopup = useCallback(() => {
    setIsSettingsOpen(false);
    setGiantPopupVerse(getNextRandomVerse("all", settingsRef.current));
    // Test flash
    if (settingsRef.current.flashLed) {
      let count = 0;
      const flashInterval = setInterval(() => {
        setIsFlashing((prev) => !prev);
        count++;
        if (count > 5) {
          clearInterval(flashInterval);
          setIsFlashing(false);
        }
      }, 150);
    }
    // Test sound and vibration
    try {
      const soundType = settingsRef.current.sound;
      if (soundType && soundType !== "Silencioso") {
        const AudioContext =
          window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          const playTone = (
            freq: number,
            type: OscillatorType,
            duration: number,
            startTime: number,
          ) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(
              freq,
              ctx.currentTime + startTime,
            );
            osc.connect(gain);
            gain.connect(ctx.destination);
            gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
            gain.gain.linearRampToValueAtTime(
              0.5,
              ctx.currentTime + startTime + 0.05,
            );
            gain.gain.exponentialRampToValueAtTime(
              0.01,
              ctx.currentTime + startTime + duration,
            );
            osc.start(ctx.currentTime + startTime);
            osc.stop(ctx.currentTime + startTime + duration);
          };
          if (soundType === "Sino") {
            playTone(880, "sine", 1, 0);
            playTone(1108.73, "sine", 1, 0.2);
          } else if (soundType === "Harpa") {
            playTone(523.25, "triangle", 0.5, 0);
            playTone(659.25, "triangle", 0.5, 0.1);
            playTone(783.99, "triangle", 0.5, 0.2);
            playTone(1046.5, "triangle", 1, 0.3);
          } else if (soundType === "Celeste") {
            playTone(1046.5, "sine", 0.8, 0);
            playTone(1318.51, "sine", 0.8, 0.15);
            playTone(1567.98, "sine", 1.5, 0.3);
          } else {
            playTone(880, "sine", 0.5, 0);
          }
        }
      }
    } catch (e) {}
    if (settingsRef.current.vibrate && navigator.vibrate) {
      try {
        navigator.vibrate([200, 100, 200]);
      } catch (e) {}
    }
  }, []);

  const handleShowRandomVerse = useCallback((topicId: string) => {
    handleSetCurrentVerse(getNextRandomVerse(topicId, settingsRef.current));
  }, [handleSetCurrentVerse]);

  const handleChangeBibleVersion = useCallback((version: string) => {
    setSettings((prev) => {
      const newSettings = { ...prev, bibleVersion: version };
      settingsRef.current = newSettings;
      try { localStorage.setItem('bible-app-settings', JSON.stringify(newSettings)); } catch (e) {}
      return newSettings;
    });
  }, []);

  const handleOpenAbout = useCallback(() => {
    setIsSettingsOpen(false);
    setIsAboutOpen(true);
  }, []);

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden font-sans select-none bg-[var(--color-duo-bg-sec)] app-custom-font">
      <AnimatePresence>
        {showSplash && <SplashScreen key="splash" />}
      </AnimatePresence>
      <style>{customVerseStyle}</style>
      <style>{customAppStyle}</style>
      {isFlashing && (
        <div className="fixed inset-0 z-[9999] bg-white transition-opacity duration-75 pointer-events-none" />
      )}
      <Header
        onMenuClick={handleMenuClick}
        onSettingsClick={handleSettingsClick}
        onRandomClick={handleRandomClick}
        onShareClick={handleShareClick}
        onSearchClick={handleSearchClick}
        onBackgroundClick={handleBackgroundClick}
        onEmotionsClick={handleEmotionsClick}
        onAboutClick={handleAboutClick}
        enableQuotes={settings.enableQuotes}
        onToggleQuotes={handleToggleQuotes}
      />

            {/* Bottom Tab Bar */}
      
      <BottomNav 
        isFavorite={favoriteVerses.some((v) => v.id === currentVerse.id)}
        onToggleFavorite={toggleFavorite}
        onSwapRandom={handleSwapRandom}
        onOpenCrossReferences={handleOpenCrossReferences}
        onOpenYoutube={handleOpenYoutube}
        onCopy={handleCopy}
        copied={copied}
      />

      <Drawer
        bibleVersion={settings.bibleVersion}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        recentVerses={recentVerses}
        favoriteVerses={favoriteVerses}
        onSelectVerse={handleSetCurrentVerse}
        onRemoveFavorite={removeFavorite}
      />

      

      
      <VerseDisplay
        ref={captureRef}
        verse={currentVerse}
        settings={settings}
      />

      <Settings
        isOpen={isSettingsOpen}
        onClose={closeSettings}
        settings={settings}
        onSettingsChange={setSettings}
        onOpenAbout={handleOpenAbout}
        onShowToast={addToast}
        onTestPopup={handleTestPopup}
      />
      <BackgroundModal
        isOpen={isBackgroundModalOpen}
        onClose={closeBackgroundModal}
        settings={settings}
        onSettingsChange={setSettings}
      />
      <AboutModal isOpen={isAboutOpen} onClose={closeAbout} />

      <CrossReferencesModal
        isOpen={isCrossReferencesOpen}
        onClose={closeCrossReferences}
        verse={currentVerse}
        onSelectVerse={handleSetCurrentVerse}
        bibleVersion={settings.bibleVersion}
      />

      <RandomVerseSelector
        isOpen={isRandomSelectorOpen}
        onClose={closeRandomSelector}
        onShowVerse={handleShowRandomVerse}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={closeSearch}
        onSelectVerse={handleSetCurrentVerse}
        bibleVersion={settings.bibleVersion}
        onChangeBibleVersion={handleChangeBibleVersion}
      />

      <EmotionsModal
        isOpen={isEmotionsOpen}
        onClose={closeEmotions}
        onSelectVerse={handleSetCurrentVerse}
        bibleVersion={settings.bibleVersion}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={closeShareModal}
        onShareText={handleShareText}
        onShareImage={handleShareImage}
        onDownloadImage={handleDownloadImage}
        isGenerating={isGeneratingImage}
        hasDownloaded={hasDownloaded}
      />

      <PermissionModal
        isOpen={isPermissionModalOpen}
        onClose={closePermissionModal}
        onGrant={handlePermissionsGranted}
      />

      <ErrorPopup />

      <ToastContainer
        toasts={toasts}
        onRemove={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />

      {giantPopupVerse && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-[320ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]">
          <div className="duo-modal w-full max-w-md flex flex-col relative animate-in zoom-in-95 duration-[320ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-4 p-5 border-b-2 border-[var(--color-duo-border)] bg-[var(--color-duo-bg)]">
              <div className="bg-[#fff1e0] dark:bg-[#332000] p-3 rounded-[20px] shrink-0">
                <Book className="w-7 h-7 text-[var(--color-duo-orange)]" />
              </div>
              <h2 className="text-[24px] font-black tracking-tight duo-title text-[var(--color-duo-text)] leading-tight">
                Versículo do Dia
              </h2>
            </div>

            {/* Body */}
            <div className="p-8 flex flex-col items-center justify-center text-center bg-[var(--color-duo-bg-sec)]">
              <p className="text-xl sm:text-2xl text-[var(--color-duo-text)] font-sans font-bold tracking-tight  leading-relaxed mb-6 custom-verse-text verse-size-popup">
                "{giantPopupVerse.text}"
              </p>
              <p className="text-[18px] font-bold text-[var(--color-duo-text)] opacity-70 tracking-wide">
                {giantPopupVerse.reference}
              </p>
            </div>

            {/* Footer */}
            <div className="p-4 bg-[var(--color-duo-bg)] border-t-2 border-[var(--color-duo-border)] flex gap-3">
              <button
                onClick={() => {
                  handleSetCurrentVerse(giantPopupVerse);
                  setGiantPopupVerse(null);
                }}
                className="btn-secondary flex-1 py-4 px-4 gap-2"
              >
                <BookOpen className="w-5 h-5" />
                Abrir App
              </button>
              <button
                onClick={() => setGiantPopupVerse(null)}
                className="btn-primary flex-1 py-3 px-4 gap-2 !bg-[var(--color-duo-orange)] !border-[var(--color-duo-orange)] !border-b-[var(--color-duo-orange-dark)]"
              >
                <Check className="w-5 h-5" />
                Concluído
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
