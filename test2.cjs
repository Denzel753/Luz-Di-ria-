const fs = require('fs');
let path = 'src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

const oldNav = /<nav className="fixed bottom-0 left-0 right-0 bg-\[var\(--color-duo-bg\)\] border-t-2 border-\[var\(--color-duo-border\)\] flex items-center justify-around py-2 px-4 z-40" style=\{\{ paddingBottom: 'env\(safe-area-inset-bottom, 8px\)' \}\}>/;

const newNav = `<nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-md bg-white/90 dark:bg-black/90 backdrop-blur-xl border border-stone-200/50 dark:border-zinc-800/50 rounded-[32px] shadow-2xl flex items-center justify-around py-2 px-2 z-40">`;

code = code.replace(oldNav, newNav);
fs.writeFileSync(path, code);
