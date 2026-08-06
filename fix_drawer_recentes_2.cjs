const fs = require('fs');
let pathDrawer = 'src/components/Drawer.tsx';
let drawerCode = fs.readFileSync(pathDrawer, 'utf8');

drawerCode = drawerCode.replace(
  /className="p-5 border-b border-\[var\(--color-duo-border\)\] hover:bg-\[var\(--color-duo-bg-sec\)\] cursor-pointer transition-colors group"/g,
  'className="p-4 duo-card-interactive group relative cursor-pointer"'
);

fs.writeFileSync(pathDrawer, drawerCode);
