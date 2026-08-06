const fs = require('fs');
let path = 'src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

if (!code.includes('const handleTestPopup = useCallback')) {
  code = code.replace(
    /const handleOpenAbout = useCallback/,
    "const handleTestPopup = useCallback(() => {\n    setIsSettingsOpen(false);\n    setGiantPopupVerse(getNextRandomVerse('all', settingsRef.current));\n    setIsFlashing(true);\n    setTimeout(() => setIsFlashing(false), 150);\n  }, []);\n\n  const handleOpenAbout = useCallback"
  );
}

code = code.replace(
  /onTestPopup=\{\(\) => \{\s*setIsSettingsOpen\(false\);\s*setGiantPopupVerse\(\s*getNextRandomVerse\("all", settings\),\s*\);\s*\/\/\s*Test flash\s*setIsFlashing\(true\);\s*setTimeout\(\(\) => setIsFlashing\(false\), 150\);\s*\}\}/g,
  "onTestPopup={handleTestPopup}"
);

// What is that onClick? Let's find it.
fs.writeFileSync(path, code);
