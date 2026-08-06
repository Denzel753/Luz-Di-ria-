const fs = require('fs');
let path = 'src/components/Header.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/className="absolute top-14 right-4 duo-modal shadow-2xl py-2 w-64 z-50 overflow-hidden"/,
  'className="fixed top-24 right-4 md:right-[calc(50vw-28rem+1rem)] xl:right-[calc(50vw-28rem+1rem)] bg-white dark:bg-[#1a1a1a] rounded-[24px] border border-stone-200 dark:border-zinc-800 shadow-2xl py-2 w-64 z-50 overflow-hidden"');

fs.writeFileSync(path, code);
