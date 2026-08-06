const fs = require('fs');
let path = 'src/components/ShareModal.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/className="p-2 bg-\[var\(--color-duo-border\)\] rounded-full text-stone-500 hover:text-stone-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"/g, 'className="btn-ghost"');

code = code.replace(/className="w-full flex items-center gap-4 p-4 rounded-\[20px\] bg-\[var\(--color-duo-bg-sec\)\]\/50 hover:bg-stone-100 dark:hover:bg-zinc-800 border border-\[var\(--color-duo-border\)\] transition-colors"/g, 'className="duo-card-interactive w-full flex items-center gap-4 p-4"');

code = code.replace(/className="w-full flex items-center gap-4 p-4 rounded-\[20px\] bg-\[var\(--color-duo-bg-sec\)\]\/50 hover:bg-stone-100 dark:hover:bg-zinc-800 border border-\[var\(--color-duo-border\)\] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"/g, 'className="duo-card-interactive w-full flex items-center gap-4 p-4 disabled:opacity-50 disabled:cursor-not-allowed"');

code = code.replace(/bg-amber-100 dark:bg-amber-900\/30/g, 'bg-amber-100 text-[var(--color-duo-orange)]');
code = code.replace(/text-\[var\(--color-duo-orange\)\] dark:text-amber-500/g, 'text-[var(--color-duo-orange)]');

fs.writeFileSync(path, code);
