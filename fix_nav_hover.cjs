const fs = require('fs');
let pathApp = 'src/App.tsx';
let appCode = fs.readFileSync(pathApp, 'utf8');

// The class currently: className="flex flex-col items-center gap-1 p-2 text-[var(--color-duo-text)] opacity-70 hover:text-[var(--color-duo-orange)] transition-colors group"
// Make opacity-70 group-hover:opacity-100
appCode = appCode.replace(/opacity-70 hover:text/g, 'opacity-70 group-hover:opacity-100 hover:text');

fs.writeFileSync(pathApp, appCode);
