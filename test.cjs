const fs = require('fs');
let path = 'src/components/VerseDisplay.tsx';
let code = fs.readFileSync(path, 'utf8');
code = code.replace(/duo-modal !border-2/, "rounded-[32px] ${isDark ? 'bg-black/20 border-white/10' : 'bg-white/40 border-black/5'} backdrop-blur-md shadow-2xl border");
fs.writeFileSync(path, code);
