const fs = require('fs');

let path = 'src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

const regexMap = [
  { search: /onClose=\{\(\) => setShowStreakModal\(false\)\}/g, replace: "onClose={closeStreakModal}" },
  { search: /onClose=\{\(\) => setIsDrawerOpen\(false\)\}/g, replace: "onClose={closeDrawer}" },
  { search: /onClose=\{\(\) => setIsSettingsOpen\(false\)\}/g, replace: "onClose={closeSettings}" },
  { search: /onClose=\{\(\) => setIsBackgroundModalOpen\(false\)\}/g, replace: "onClose={closeBackgroundModal}" },
  { search: /onClose=\{\(\) => setIsAboutOpen\(false\)\}/g, replace: "onClose={closeAbout}" },
  { search: /onClose=\{\(\) => setIsCrossReferencesOpen\(false\)\}/g, replace: "onClose={closeCrossReferences}" },
  { search: /onClose=\{\(\) => setIsRandomSelectorOpen\(false\)\}/g, replace: "onClose={closeRandomSelector}" },
  { search: /onClose=\{\(\) => setIsSearchOpen\(false\)\}/g, replace: "onClose={closeSearch}" },
  { search: /onClose=\{\(\) => setIsEmotionsOpen\(false\)\}/g, replace: "onClose={closeEmotions}" },
  { search: /onClose=\{\(\) => setIsShareModalOpen\(false\)\}/g, replace: "onClose={closeShareModal}" },
  { search: /onClose=\{\(\) => setIsPermissionModalOpen\(false\)\}/g, replace: "onClose={closePermissionModal}" },
];

let declarations = `
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

// Insert declarations before the return statement of App
code = code.replace(
  /return \(\s*<div className=\{`min-h-screen/g,
  declarations + "\n  return (\n    <div className={`min-h-screen"
);

// Apply replacements
regexMap.forEach(({search, replace}) => {
  code = code.replace(search, replace);
});

// Update Header onToggleQuotes
code = code.replace(
  /onToggleQuotes=\{\(enabled\) => \{[\s\S]*?\}\}/,
  "onToggleQuotes={handleToggleQuotes}"
);

// Update Settings onOpenAbout
code = code.replace(
  /onOpenAbout=\{\(\) => \{\s*setIsSettingsOpen\(false\);\s*setIsAboutOpen\(true\);\s*\}\}/,
  "onOpenAbout={handleOpenAbout}"
);

fs.writeFileSync(path, code);
