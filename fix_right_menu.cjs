const fs = require('fs');

let path = 'src/components/Header.tsx';
let code = fs.readFileSync(path, 'utf8');

// The popup menu container:
code = code.replace(
  /className="fixed top-24 right-4 md:right-\[calc\(50vw-28rem\+1rem\)\] xl:right-\[calc\(50vw-28rem\+1rem\)\] bg-white dark:bg-\[#1a1a1a\] rounded-\[24px\] border border-stone-200 dark:border-zinc-800 shadow-2xl py-2 w-64 z-50 overflow-hidden"/,
  'className="fixed top-24 right-4 md:right-[calc(50vw-28rem+1rem)] xl:right-[calc(50vw-28rem+1rem)] bg-[var(--color-duo-bg)] rounded-[24px] border-2 border-[var(--color-duo-border)] border-b-4 shadow-2xl py-2 w-64 z-50 overflow-hidden"'
);

fs.writeFileSync(path, code);
