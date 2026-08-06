const fs = require('fs');

// 1. Fix CSS colors (revert to the stronger ones)
let pathCss = 'src/index.css';
let cssCode = fs.readFileSync(pathCss, 'utf8');

const newTheme = `@theme {
  --font-sans: "Nunito", sans-serif;
  --font-serif: "Nunito", sans-serif;
  
  --color-duo-orange: #ff8900;
  --color-duo-orange-dark: #cc6d00;
  --color-duo-red: #ff4b4b;
  --color-duo-red-dark: #cc3c3c;
  --color-duo-yellow: #ffc800;
  --color-duo-yellow-dark: #cca000;
  --color-duo-text: #3c3c3c;
  --color-duo-text-light: #777777;
  --color-duo-border: #e5e5e5;
  --color-duo-border-dark: #d7d7d7;
  --color-duo-bg: #ffffff;
  --color-duo-bg-sec: #f7f7f7;
}

html, body, #root {
  min-height: 100%;
  background-color: var(--color-duo-bg);
  color: var(--color-duo-text);
  font-family: var(--font-sans);
}

html.dark, html.dark body, html.dark #root {
  background-color: #111111;
  color: #eeeeee;
  --color-duo-border: #333333;
  --color-duo-border-dark: #222222;
  --color-duo-text: #eeeeee;
  --color-duo-text-light: #aaaaaa;
  --color-duo-bg: #111111;
  --color-duo-bg-sec: #1a1a1a;
}`;

cssCode = cssCode.replace(/@theme \{[\s\S]*?html\.dark #root \{[\s\S]*?\}/, newTheme);
fs.writeFileSync(pathCss, cssCode);


// 2. Fix Header.tsx (make it top full width but slightly rounded bottom)
let pathHeader = 'src/components/Header.tsx';
let headerCode = fs.readFileSync(pathHeader, 'utf8');
headerCode = headerCode.replace(
  /className="absolute top-4 left-1\/2 -translate-x-1\/2 w-\[95%\] max-w-4xl h-16 bg-white\/80 dark:bg-\[#1c1c1e\]\/80 backdrop-blur-2xl border border-white\/20 dark:border-white\/10 rounded-\[32px\] shadow-sm flex items-center justify-between px-4 z-40"/,
  'className="absolute top-0 left-0 right-0 h-16 bg-white/95 dark:bg-[#111111]/95 backdrop-blur-xl border-b border-stone-200 dark:border-zinc-800 rounded-b-[24px] shadow-sm flex items-center justify-between px-6 z-40"'
);
fs.writeFileSync(pathHeader, headerCode);

// 3. Fix App.tsx (icons bolder and larger)
let pathApp = 'src/App.tsx';
let appCode = fs.readFileSync(pathApp, 'utf8');
appCode = appCode.replace(/w-6 h-6/g, 'w-7 h-7');
appCode = appCode.replace(/text-\[10px\] font-bold tracking-wide/g, 'text-[11px] font-black uppercase tracking-wider');
// ensure nav is readable (icons using text-duo-text instead of text-light maybe)
appCode = appCode.replace(/text-\[var\(--color-duo-text-light\)\]/g, 'text-[var(--color-duo-text)] opacity-70');
fs.writeFileSync(pathApp, appCode);

// 4. Fix VerseDisplay.tsx (remove drop-shadow on text, fix readability)
let pathVerse = 'src/components/VerseDisplay.tsx';
let verseCode = fs.readFileSync(pathVerse, 'utf8');
verseCode = verseCode.replace(/drop-shadow-sm/g, '');
// Revert the background of the verse display modal to normal card so it doesn't look washed out
verseCode = verseCode.replace(
  /rounded-\[32px\] \$\{isDark \? "bg-black\/30 border-white\/10" : "bg-white\/60 border-black\/5"\} backdrop-blur-xl shadow-2xl border/g,
  'rounded-[32px] duo-modal !border-2 shadow-xl'
);
fs.writeFileSync(pathVerse, verseCode);

