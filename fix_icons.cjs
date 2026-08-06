const fs = require('fs');
let path = 'src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/import { Heart, BookOpen, /g, 'import { Heart, Search, Shuffle, Settings as SettingsIcon, BookOpen, ');

fs.writeFileSync(path, code);
