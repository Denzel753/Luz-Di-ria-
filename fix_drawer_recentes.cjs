const fs = require('fs');
let pathDrawer = 'src/components/Drawer.tsx';
let drawerCode = fs.readFileSync(pathDrawer, 'utf8');

// Fix the recentes section header
drawerCode = drawerCode.replace(
  /className="bg-\[var\(--color-duo-bg-sec\)\] px-6 py-5 flex items-center gap-3 border-y border-\[var\(--color-duo-border\)\] mt-2"/,
  'className="bg-[var(--color-duo-bg)]/90 backdrop-blur-2xl px-6 py-5 flex items-center gap-3 border-y-2 border-[var(--color-duo-border)] mt-4 mb-2"'
);
drawerCode = drawerCode.replace(
  /<h2 className="text-sm font-bold tracking-widest uppercase text-\[var\(--color-duo-text-light\)\]">Recentes<\/h2>/,
  '<h2 className="text-xl duo-title">Recentes</h2>'
);

// Fix recent items
drawerCode = drawerCode.replace(
  /className="px-6 py-4 border-b border-\[var\(--color-duo-border\)\] hover:bg-\[var\(--color-duo-bg-sec\)\] transition-colors cursor-pointer"/g,
  'className="p-4 duo-card-interactive group relative cursor-pointer"'
);

fs.writeFileSync(pathDrawer, drawerCode);
