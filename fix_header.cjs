const fs = require('fs');
let pathHeader = 'src/components/Header.tsx';
let headerCode = fs.readFileSync(pathHeader, 'utf8');

// 1. Taller header, more padding
headerCode = headerCode.replace(
  /h-\[84px\] bg-\[var\(--color-duo-bg\)\]\/90 backdrop-blur-2xl border-b-2 border-\[var\(--color-duo-border\)\] rounded-b-\[16px\] shadow-sm flex items-center justify-between px-6 pb-2 pt-6/,
  'h-[100px] bg-[var(--color-duo-bg)]/90 backdrop-blur-2xl border-b-2 border-[var(--color-duo-border)] rounded-b-[24px] shadow-sm flex items-center justify-between px-6 sm:px-8 pb-2 pt-8'
);

// 2. Hide title on mobile to prevent overlapping
headerCode = headerCode.replace(
  /<h1 className="text-2xl duo-title">Luz Diária<\/h1>/,
  '<h1 className="text-2xl duo-title hidden sm:block">Luz Diária</h1>'
);

// 3. Restore streak indicator style
headerCode = headerCode.replace(
  /bg-stone-100 dark:bg-zinc-800 rounded-full shadow-inner mr-2 border border-stone-200 dark:border-zinc-700/,
  'bg-[var(--color-duo-bg-sec)] rounded-full border-2 border-[var(--color-duo-border)] border-b-4 mr-2 sm:mr-4'
);

// 4. Enlarge icons
// For Menu, Share, MoreVertical
headerCode = headerCode.replace(/btn-icon p-2 w-10 h-10/g, 'btn-icon p-2 w-12 h-12');
headerCode = headerCode.replace(/w-5 h-5 text-\[var\(--color-duo-text-light\)\]/g, 'w-6 h-6 text-[var(--color-duo-text-light)]');

// For Flame
headerCode = headerCode.replace(/<Flame className="w-5 h-5/g, '<Flame className="w-6 h-6');
headerCode = headerCode.replace(/<span className="font-bold text-\[var\(--color-duo-orange\)\]">/g, '<span className="text-lg font-bold text-[var(--color-duo-orange)]">');

// For Lightbulb app logo
headerCode = headerCode.replace(/w-10 h-10 rounded-\[20px\]/g, 'w-12 h-12 rounded-[24px]');
headerCode = headerCode.replace(/<Lightbulb className="w-5 h-5/g, '<Lightbulb className="w-6 h-6');

fs.writeFileSync(pathHeader, headerCode);
