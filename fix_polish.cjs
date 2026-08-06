const fs = require('fs');

// 1. Fix CSS Colors
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


// 2. Fix Header.tsx
let pathHeader = 'src/components/Header.tsx';
let headerCode = fs.readFileSync(pathHeader, 'utf8');
headerCode = headerCode.replace(
  /className="absolute top-0 left-0 right-0 h-16 bg-white\/95 dark:bg-\[#111111\]\/95 backdrop-blur-xl border-b border-stone-200 dark:border-zinc-800 rounded-b-\[24px\] shadow-sm flex items-center justify-between px-6 z-40"/,
  'className="absolute top-0 left-0 right-0 h-[84px] bg-[var(--color-duo-bg)]/90 backdrop-blur-2xl border-b-2 border-[var(--color-duo-border)] rounded-b-[16px] shadow-sm flex items-center justify-between px-6 pb-2 pt-6 z-40"'
);
fs.writeFileSync(pathHeader, headerCode);

// 3. Fix Drawer.tsx
let pathDrawer = 'src/components/Drawer.tsx';
let drawerCode = fs.readFileSync(pathDrawer, 'utf8');
drawerCode = drawerCode.replace(
  /className=\{`fixed top-0 left-0 h-full w-4\/5 max-w-sm bg-\[var\(--color-duo-bg\)\] text-\[var\(--color-duo-text\)\] z-50 transform transition-transform duration-\[320ms\] ease-\[cubic-bezier\(0\.34,1\.56,0\.64,1\)\] ease-in-out flex flex-col shadow-2xl border-r-2 border-\[var\(--color-duo-border\)\] \$\{isOpen \? 'translate-x-0' : '-translate-x-full'\}`\}/,
  'className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-[var(--color-duo-bg)]/95 backdrop-blur-3xl text-[var(--color-duo-text)] z-50 transform transition-transform duration-[320ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ease-in-out flex flex-col shadow-2xl border-r-2 border-[var(--color-duo-border)] rounded-r-[24px] overflow-hidden ${isOpen ? "translate-x-0" : "-translate-x-full"}`}'
);
fs.writeFileSync(pathDrawer, drawerCode);

// 4. Fix VerseDisplay.tsx
let pathVerse = 'src/components/VerseDisplay.tsx';
let verseCode = fs.readFileSync(pathVerse, 'utf8');
// Replace the container className to be transparent when there's an image
// We'll pass isImage to the className or just use inline styles or template literal
verseCode = verseCode.replace(
  /className=\{`flex-1 relative flex items-center justify-center p-6 sm:p-12 z-0 pointer-events-none w-full max-w-4xl mx-auto mt-28 mb-28 rounded-\[32px\] duo-modal !border-2 shadow-xl`\}/,
  'className={`flex-1 relative flex items-center justify-center p-6 sm:p-12 z-0 pointer-events-none w-full max-w-4xl mx-auto mt-32 mb-28 rounded-[32px] ${isImage ? (isDark ? "bg-black/40 border border-white/10 backdrop-blur-sm" : "bg-white/40 border border-black/10 backdrop-blur-sm") : "duo-modal !border-2"} shadow-xl`}'
);
fs.writeFileSync(pathVerse, verseCode);

