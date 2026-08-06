const fs = require('fs');

let pathHeader = 'src/components/Header.tsx';
let headerCode = fs.readFileSync(pathHeader, 'utf8');

headerCode = headerCode.replace(
  /className="flex items-center gap-1\.5 px-3 py-1\.5 bg-\[var\(--color-duo-bg-sec\)\] rounded-full border-2 border-\[var\(--color-duo-border\)\] border-b-4 mr-2"/,
  'className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 dark:bg-zinc-800 rounded-full shadow-inner mr-2 border border-stone-200 dark:border-zinc-700"'
);

fs.writeFileSync(pathHeader, headerCode);

