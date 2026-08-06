const fs = require('fs');
let path = 'src/components/VerseDisplay.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/import \{ Star, Network, Youtube, Copy, Check, Shuffle \} from 'lucide-react';/g, '');

fs.writeFileSync(path, code);
