const fs = require('fs');
let path = 'src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/import { Heart, /g, 'import { ');
code = code.replace(/import { BookOpen, /g, 'import { Heart, BookOpen, ');

fs.writeFileSync(path, code);
