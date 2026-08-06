const fs = require('fs');
let path = 'src/components/RandomVerseSelector.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/#1cb0f6/g, 'var(--color-duo-orange)');
fs.writeFileSync(path, code);
