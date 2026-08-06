const fs = require('fs');

let path = 'src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

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

fs.writeFileSync(path, code);
