const fs = require('fs');
let path = 'src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

if (!code.includes('const handleShowRandomVerse = useCallback')) {
  code = code.replace(
    /const closeRandomSelector = useCallback/,
    "const handleShowRandomVerse = useCallback((topicId: string) => {\n    handleSetCurrentVerse(getNextRandomVerse(topicId, settingsRef.current));\n  }, [handleSetCurrentVerse]);\n  const closeRandomSelector = useCallback"
  );
}

code = code.replace(
  /onShowVerse=\{\(topicId\) =>\s*handleSetCurrentVerse\(getNextRandomVerse\(topicId, settings\)\)\s*\}/,
  "onShowVerse={handleShowRandomVerse}"
);

fs.writeFileSync(path, code);
