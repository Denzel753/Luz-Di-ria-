const fs = require('fs');
let path = 'src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/text-\[11px\] font-black uppercase tracking-wider/g, 'text-[10px] font-bold tracking-wide');
code = code.replace(/w-7 h-7/g, 'w-6 h-6');

fs.writeFileSync(path, code);
