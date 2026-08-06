const fs = require('fs');
let path = 'src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

const regex = /onTestPopup=\{\(\) => \{[\s\S]*?clearInterval\(flashInterval\);\s*\}\s*\}, 100\);\s*\} else \{\s*setIsFlashing\(true\);\s*setTimeout\(\(\) => setIsFlashing\(false\), 150\);\s*\}\s*\}\}/;

if (!code.includes('const handleTestPopup = useCallback')) {
  code = code.replace(
    /const handleOpenAbout = useCallback/,
    "const handleTestPopup = useCallback(() => {\n    setIsSettingsOpen(false);\n    setGiantPopupVerse(getNextRandomVerse('all', settingsRef.current));\n    if (settingsRef.current.flashLed) {\n      let count = 0;\n      const flashInterval = setInterval(() => {\n        setIsFlashing(prev => !prev);\n        count++;\n        if (count > 4) clearInterval(flashInterval);\n      }, 100);\n    } else {\n      setIsFlashing(true);\n      setTimeout(() => setIsFlashing(false), 150);\n    }\n  }, []);\n\n  const handleOpenAbout = useCallback"
  );
}

code = code.replace(regex, 'onTestPopup={handleTestPopup}');

fs.writeFileSync(path, code);
