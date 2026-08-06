const fs = require('fs');
let pathDrawer = 'src/components/Drawer.tsx';
let drawerCode = fs.readFileSync(pathDrawer, 'utf8');

drawerCode = drawerCode.replace(
  /className="p-4 bg-\[var\(--color-duo-bg\)\] border-2 border-\[var\(--color-duo-border\)\] border-b-4 rounded-\[20px\] active:border-b-2 active:translate-y-\[2px\] transition-all group relative"/,
  'className="p-4 bg-[var(--color-duo-bg)] border-2 border-[var(--color-duo-border)] border-b-4 rounded-[20px] active:border-b-2 active:translate-y-[2px] transition-all group relative cursor-pointer"\n                 onClick={() => { onSelectVerse(v); onClose(); }}'
);
drawerCode = drawerCode.replace(
  /<div className="cursor-pointer pr-8" onClick=\{[^}]*\}\s*>/,
  '<div className="pr-8">'
);

fs.writeFileSync(pathDrawer, drawerCode);
