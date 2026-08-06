const fs = require('fs');
let path = 'src/components/SplashScreen.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/bg-stone-50 dark:bg-zinc-950/g, 'bg-[var(--color-duo-bg)]');
code = code.replace(/text-3xl font-bold tracking-tight text-stone-800 dark:text-zinc-100/g, 'text-4xl duo-title');
code = code.replace(/text-stone-500 dark:text-zinc-400 font-medium mt-1/g, 'text-[var(--color-duo-text-light)] font-bold mt-2 uppercase tracking-widest text-sm');
code = code.replace(/bg-amber-500/g, 'bg-[var(--color-duo-orange)]');

fs.writeFileSync(path, code);
