const fs = require('fs');
let path = 'src/components/Settings.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/bg-white dark:bg-zinc-900 w-full max-w-sm rounded-\[20px\]/g, 'duo-modal w-full max-w-sm');
code = code.replace(/className="flex-1 py-3 px-4 bg-\[var\(--color-duo-border\)\] hover:bg-stone-200 dark:hover:bg-zinc-700 text-\[var\(--color-duo-text\)\] font-medium rounded-\[20px\] transition-colors"/g, 'className="btn-outline flex-1 py-4 px-4 gap-2"');
code = code.replace(/className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-\[20px\] transition-colors shadow-lg shadow-red-500\/20"/g, 'className="btn-primary !bg-[var(--color-duo-red)] !border-[var(--color-duo-red)] !border-b-[var(--color-duo-red-dark)] flex-1 py-4 px-4 gap-2"');
code = code.replace(/bg-white dark:bg-zinc-900 h-16 flex/g, 'bg-[var(--color-duo-bg)] h-16 flex');
code = code.replace(/bg-stone-50\/50 dark:bg-zinc-900\/50/g, 'bg-[var(--color-duo-bg-sec)]');
code = code.replace(/text-stone-900 dark:text-zinc-100/g, 'text-[var(--color-duo-text)]');
code = code.replace(/text-stone-800 dark:text-zinc-200/g, 'text-[var(--color-duo-text)]');

fs.writeFileSync(path, code);
