const fs = require('fs');
let pathHeader = 'src/components/Header.tsx';
let headerCode = fs.readFileSync(pathHeader, 'utf8');

// Add onStreakClick to props interface
headerCode = headerCode.replace(
  /interface HeaderProps \{/,
  'interface HeaderProps {\n  onStreakClick: () => void;'
);

// Add onStreakClick to component signature
headerCode = headerCode.replace(
  /export function Header\(\{/,
  'export function Header({\n  onStreakClick,'
);

// Make streak indicator clickable
headerCode = headerCode.replace(
  /<div className="flex items-center gap-1\.5 px-3 py-1\.5 bg-\[var\(--color-duo-bg-sec\)\] rounded-full border-2 border-\[var\(--color-duo-border\)\] border-b-4 mr-2 sm:mr-4">/,
  '<button onClick={onStreakClick} className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-duo-bg-sec)] rounded-full border-2 border-[var(--color-duo-border)] border-b-4 mr-2 sm:mr-4 active:border-b-2 active:translate-y-[2px] transition-all cursor-pointer hover:bg-stone-100 dark:hover:bg-zinc-800">'
);
headerCode = headerCode.replace(
  /<span className="text-lg font-bold text-\[var\(--color-duo-orange\)\]">12<\/span>\s*<\/div>/,
  '<span className="text-lg font-bold text-[var(--color-duo-orange)]">12</span>\n          </button>'
);

fs.writeFileSync(pathHeader, headerCode);
