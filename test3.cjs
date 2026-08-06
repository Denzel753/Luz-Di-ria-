const fs = require('fs');
let path = 'src/components/Header.tsx';
let code = fs.readFileSync(path, 'utf8');

const oldHeader = /<header className="bg-\[var\(--color-duo-bg\)\] h-16 flex items-center justify-between px-6 shadow-sm border-b-2 border-\[var\(--color-duo-border\)\]">/;
const newHeader = `<header className="absolute top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl h-16 bg-white/90 dark:bg-black/90 backdrop-blur-xl border border-stone-200/50 dark:border-zinc-800/50 rounded-[32px] shadow-lg flex items-center justify-between px-4 z-40">`;

code = code.replace(oldHeader, newHeader);
fs.writeFileSync(path, code);
