const fs = require('fs');

let path = 'src/components/CrossReferencesModal.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/bg-white dark:bg-zinc-900/g, 'bg-[var(--color-duo-bg)]');
code = code.replace(/className="bg-\[var\(--color-duo-bg\)\] p-5 rounded-\[20px\] border border-\[var\(--color-duo-border\)\] shadow-sm transition-all duration-\[180ms\] ease-\[cubic-bezier\(0\.34,1\.56,0\.64,1\)\] active:scale-\[0\.98\] cursor-pointer hover:border-amber-200 dark:hover:border-amber-900 group"/g,
  'className="duo-card-interactive p-5 group"');

fs.writeFileSync(path, code);
