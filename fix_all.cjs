const fs = require('fs');

// 1. Fix default background color and streak state in App.tsx
let pathApp = 'src/App.tsx';
let appCode = fs.readFileSync(pathApp, 'utf8');

// Fix streak state
appCode = appCode.replace(
  /const \[streakDays, setStreakDays\] = useState\(12\);/,
  `const [streakDays, setStreakDays] = useState(() => {
    try {
      const saved = localStorage.getItem("streakDaysData");
      if (saved) return parseInt(saved, 10) || 1;
    } catch (e) {}
    return 1;
  });`
);

// Save streakDays on change if it was dynamically updated somewhere (we'll just use a useEffect)
if (!appCode.includes('localStorage.setItem("streakDaysData"')) {
  appCode = appCode.replace(
    /const \[favoriteVerses, setFavoriteVerses\]/,
    `useEffect(() => { localStorage.setItem("streakDaysData", streakDays.toString()); }, [streakDays]);
  const [favoriteVerses, setFavoriteVerses]`
  );
}

// Fix handleOpenCrossReferences
appCode = appCode.replace(
  /const handleOpenCrossReferences = useCallback\(\(\) => setIsCrossReferencesOpen\(true\), \[\]\);/,
  `const handleOpenCrossReferences = useCallback(() => {
    if (currentVerse.id.startsWith('q')) {
      addToast('info', 'Essa função é apenas para versículos.');
      return;
    }
    setIsCrossReferencesOpen(true);
  }, [currentVerse, addToast]);`
);

// Fix default backgroundColor
appCode = appCode.replace(
  /backgroundColor: "#fafaf9",/g,
  'backgroundColor: "transparent",'
);

fs.writeFileSync(pathApp, appCode);

// 2. Fix VerseDisplay.tsx margin top
let pathVerse = 'src/components/VerseDisplay.tsx';
let verseCode = fs.readFileSync(pathVerse, 'utf8');
verseCode = verseCode.replace(
  /mt-32 mb-28/g,
  'mt-16 sm:mt-20 mb-28'
);

fs.writeFileSync(pathVerse, verseCode);

// 3. Fix BackgroundModal.tsx to have 'transparent' as default instead of '#fafaf9'
let pathBg = 'src/components/BackgroundModal.tsx';
let bgCode = fs.readFileSync(pathBg, 'utf8');
bgCode = bgCode.replace(
  /'#fafaf9',/g,
  "'transparent',\n      '#fafaf9',"
);
fs.writeFileSync(pathBg, bgCode);

