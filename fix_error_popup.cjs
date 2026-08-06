const fs = require('fs');
let path = 'src/components/ErrorPopup.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/bg-white dark:bg-zinc-900 border-l-4 border-amber-500 rounded-lg shadow-xl/g, 'bg-[var(--color-duo-bg)] border-2 border-l-4 border-[var(--color-duo-border)] border-l-amber-500 rounded-[16px] shadow-xl');

fs.writeFileSync(path, code);
