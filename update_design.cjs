const fs = require('fs');

// 1. Update index.css colors
let pathCss = 'src/index.css';
let cssCode = fs.readFileSync(pathCss, 'utf8');

const newTheme = `@theme {
  --font-sans: "Nunito", sans-serif;
  --font-serif: "Nunito", sans-serif;
  
  --color-duo-orange: #FF6B00;
  --color-duo-orange-dark: #E56000;
  --color-duo-red: #FF3B3B;
  --color-duo-red-dark: #E53535;
  --color-duo-yellow: #FFB800;
  --color-duo-yellow-dark: #E5A600;
  --color-duo-text: #1C1C1E;
  --color-duo-text-light: #6E6E73;
  --color-duo-border: #E5E5EA;
  --color-duo-border-dark: #D1D1D6;
  --color-duo-bg: #FFFFFF;
  --color-duo-bg-sec: #F2F2F7;
}

html, body, #root {
  min-height: 100%;
  background-color: var(--color-duo-bg);
  color: var(--color-duo-text);
  font-family: var(--font-sans);
}

html.dark, html.dark body, html.dark #root {
  background-color: #000000;
  color: #F5F5F7;
  --color-duo-border: #2C2C2E;
  --color-duo-border-dark: #1C1C1E;
  --color-duo-text: #F5F5F7;
  --color-duo-text-light: #86868B;
  --color-duo-bg: #1C1C1E;
  --color-duo-bg-sec: #000000;
}`;

cssCode = cssCode.replace(/@theme \{[\s\S]*?html\.dark #root \{[\s\S]*?\}/, newTheme);
fs.writeFileSync(pathCss, cssCode);


// 2. Update Header.tsx
let pathHeader = 'src/components/Header.tsx';
let headerCode = fs.readFileSync(pathHeader, 'utf8');
headerCode = headerCode.replace(
  /className="absolute top-4 left-1\/2 -translate-x-1\/2 w-\[95%\] max-w-4xl h-16 bg-white\/90 dark:bg-black\/90 backdrop-blur-xl border border-stone-200\/50 dark:border-zinc-800\/50 rounded-\[32px\] shadow-lg flex items-center justify-between px-4 z-40"/,
  'className="absolute top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl h-16 bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[32px] shadow-sm flex items-center justify-between px-4 z-40"'
);
fs.writeFileSync(pathHeader, headerCode);

// 3. Update App.tsx bottom nav
let pathApp = 'src/App.tsx';
let appCode = fs.readFileSync(pathApp, 'utf8');
appCode = appCode.replace(
  /className="fixed bottom-6 left-1\/2 -translate-x-1\/2 w-\[95%\] max-w-md bg-white\/90 dark:bg-black\/90 backdrop-blur-xl border border-stone-200\/50 dark:border-zinc-800\/50 rounded-\[32px\] shadow-2xl flex items-center justify-around py-2 px-2 z-40"/,
  'className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-md bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[32px] shadow-xl flex items-center justify-around py-2 px-2 z-40"'
);
fs.writeFileSync(pathApp, appCode);

// 4. Update VerseDisplay.tsx
let pathVerse = 'src/components/VerseDisplay.tsx';
let verseCode = fs.readFileSync(pathVerse, 'utf8');
verseCode = verseCode.replace(
  /className=\{`flex-1 relative flex items-center justify-center p-4 sm:p-8 z-0 pointer-events-none w-full max-w-4xl mx-auto mt-24 mb-24 rounded-\[32px\] \$\{isDark \? "bg-black\/20 border-white\/10" : "bg-white\/40 border-black\/5"\} backdrop-blur-md shadow-2xl border`\}/,
  'className={`flex-1 relative flex items-center justify-center p-6 sm:p-12 z-0 pointer-events-none w-full max-w-4xl mx-auto mt-28 mb-28 rounded-[32px] ${isDark ? "bg-black/30 border-white/10" : "bg-white/60 border-black/5"} backdrop-blur-xl shadow-2xl border`}'
);
// make text stand out more
verseCode = verseCode.replace(/textStyle\} leading-snug/, 'textStyle} leading-snug drop-shadow-sm');
fs.writeFileSync(pathVerse, verseCode);

