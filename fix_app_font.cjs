const fs = require('fs');

let pathApp = 'src/App.tsx';
let appCode = fs.readFileSync(pathApp, 'utf8');

appCode = appCode.replace(/text-\[11px\] font-black uppercase tracking-wider/g, 'text-[11px] font-bold tracking-wide');

fs.writeFileSync(pathApp, appCode);
