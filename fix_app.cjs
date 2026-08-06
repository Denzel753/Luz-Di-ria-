const fs = require('fs');

let path = 'src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

<<<<<<< HEAD
let declarations = `
  const openStreakModal = useCallback(() => setShowStreakModal(true), []);
  const closeStreakModal = useCallback(() => setShowStreakModal(false), []);
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

  const handleOpenAbout = useCallback(() => {
    setIsSettingsOpen(false);
    setIsAboutOpen(true);
  }, []);
`;

if (!code.includes('const closeSettings = useCallback')) {
  code = code.replace(
    /return \(\s*<div className="h-screen w-full/,
    declarations + '\n  return (\n    <div className="h-screen w-full'
  );
}
=======
// The popup modal container
code = code.replace(/<div className="bg-\[#f5f5f4\] dark:bg-zinc-900 w-full max-w-md rounded-\[20px\] shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-\[320ms\] ease-\[cubic-bezier\(0\.34,1\.56,0\.64,1\)\] overflow-hidden border border-\[var\(--color-duo-border\)\]">/g, 
  '<div className="duo-modal w-full max-w-md flex flex-col relative animate-in zoom-in-95 duration-[320ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden">');
  
// Header
code = code.replace(/<div className="flex items-center gap-4 p-5 border-b-2 border-\[var\(--color-duo-border\)\] bg-white dark:bg-zinc-900">/g,
  '<div className="flex items-center gap-4 p-5 border-b-2 border-[var(--color-duo-border)] bg-[var(--color-duo-bg)]">');

// Body
code = code.replace(/<div className="p-8 flex flex-col items-center justify-center text-center bg-\[#f5f5f4\] dark:bg-zinc-900">/g,
  '<div className="p-8 flex flex-col items-center justify-center text-center bg-[var(--color-duo-bg-sec)]">');
  
// Footer
code = code.replace(/<div className="p-4 bg-white dark:bg-zinc-950 border-t-2 border-\[var\(--color-duo-border\)\] flex gap-3">/g,
  '<div className="p-4 bg-[var(--color-duo-bg)] border-t-2 border-[var(--color-duo-border)] flex gap-3">');

// Buttons inside footer
code = code.replace(/className="flex-1 py-3\.5 px-4 bg-white dark:bg-zinc-800 hover:bg-stone-50 dark:hover:bg-zinc-700 text-\[var\(--color-duo-text\)\] font-medium rounded-\[20px\] border border-stone-300 dark:border-zinc-700 transition-colors flex items-center justify-center gap-2 text-\[15px\]"/g,
  'className="btn-secondary flex-1 py-4 px-4 gap-2"');
  
code = code.replace(/className="flex-1 py-3\.5 px-4 bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 text-\[var\(--color-duo-text\)\] font-semibold rounded-\[20px\] border border-stone-300 dark:border-zinc-600 transition-colors flex items-center justify-center gap-2 text-\[15px\]"/g,
  'className="btn-primary flex-1 py-4 px-4 gap-2"');
>>>>>>> 7becaadd69e4e155ea267758c4f52deac4eb57c9

fs.writeFileSync(path, code);
