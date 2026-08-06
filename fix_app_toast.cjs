const fs = require('fs');
let path = 'src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/showToast\(/g, 'addToast(');

fs.writeFileSync(path, code);
