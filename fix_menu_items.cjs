const fs = require('fs');

let path = 'src/components/Header.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  /className="w-full px-5 py-3 hover:bg-\[var\(--color-duo-bg-sec\)\] flex items-center justify-between transition-colors cursor-pointer"/,
  'className="w-full px-4 py-3 hover:bg-[var(--color-duo-bg-sec)] rounded-[16px] flex items-center justify-between transition-colors cursor-pointer"'
);

code = code.replace(
  /className="w-full text-left px-5 py-3 hover:bg-\[var\(--color-duo-bg-sec\)\] flex items-center gap-2 sm:gap-3 text-\[var\(--color-duo-text\)\] text-sm font-medium transition-colors"/,
  'className="w-full text-left px-4 py-3 hover:bg-[var(--color-duo-bg-sec)] rounded-[16px] flex items-center gap-2 sm:gap-3 text-[var(--color-duo-text)] text-sm font-medium transition-colors"'
);

code = code.replace(
  /shadow-2xl py-2 w-64/,
  'shadow-2xl p-2 w-64' // Add p-2 instead of py-2 so we have padding on sides too for the rounded hover effect
);

fs.writeFileSync(path, code);
