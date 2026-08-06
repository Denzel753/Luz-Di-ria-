const fs = require('fs');
let path = 'src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

if (!code.includes('const handleChangeBibleVersion = useCallback')) {
  code = code.replace(
    /const closeSearch = useCallback/,
    "const handleChangeBibleVersion = useCallback((version: string) => {\n    setSettings(prev => {\n      const newSettings = { ...prev, bibleVersion: version };\n      settingsRef.current = newSettings;\n      try { localStorage.setItem('bible-app-settings', JSON.stringify(newSettings)); } catch (e) {}\n      return newSettings;\n    });\n  }, []);\n  const closeSearch = useCallback"
  );
}

code = code.replace(
  /onChangeBibleVersion=\{\(version\) =>\s*setSettings\(\{ \.\.\.settings, bibleVersion: version \}\)\s*\}/,
  "onChangeBibleVersion={handleChangeBibleVersion}"
);

fs.writeFileSync(path, code);
