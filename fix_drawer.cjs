const fs = require('fs');
let pathDrawer = 'src/components/Drawer.tsx';
let drawerCode = fs.readFileSync(pathDrawer, 'utf8');

// 1. Fix header
drawerCode = drawerCode.replace(
  /className="bg-\[var\(--color-duo-bg-sec\)\] px-6 py-5 flex items-center gap-3 border-b-2 border-\[var\(--color-duo-border\)\]"/,
  'className="bg-[var(--color-duo-bg)]/90 backdrop-blur-2xl px-6 pt-10 pb-5 flex items-center gap-3 border-b-2 border-[var(--color-duo-border)]"'
);
drawerCode = drawerCode.replace(
  /<h2 className="text-sm font-bold tracking-widest uppercase text-\[var\(--color-duo-text-light\)\]">Favoritos<\/h2>/,
  '<h2 className="text-xl duo-title">Favoritos</h2>'
);

// 2. Fix the list styling (use duo cards instead of borders)
drawerCode = drawerCode.replace(
  /<div className="flex-1 overflow-y-auto">/g,
  '<div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--color-duo-bg-sec)]">'
);

// We need to replace the mapped item div
drawerCode = drawerCode.replace(
  /className="p-5 border-b border-\[var\(--color-duo-border\)\] hover:bg-\[var\(--color-duo-bg-sec\)\] transition-colors group relative"/g,
  'className="p-4 duo-card-interactive group relative"'
);

// Fix the close button for Drawer
// Drawer has a close button at the bottom or top? Let's check if there is an X button.
// Actually, let's just make the drawer items look like duo-cards!
fs.writeFileSync(pathDrawer, drawerCode);
