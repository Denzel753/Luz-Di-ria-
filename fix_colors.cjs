const fs = require('fs');

let path = 'src/components/VerseDisplay.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/const textStyle = isDark \? 'text-white' : 'text-stone-800';/g, "const textStyle = isDark ? 'text-white' : 'text-[var(--color-duo-text)]';");
code = code.replace(/const subTextStyle = isDark \? 'text-white\/80' : 'text-amber-700';/g, "const subTextStyle = isDark ? 'text-white/80' : 'text-[var(--color-duo-text-light)]';");
code = code.replace(/const dividerStyle = isDark \? 'bg-white\/30' : 'bg-amber-500\/30';/g, "const dividerStyle = isDark ? 'bg-white/30' : 'bg-[var(--color-duo-border)]';");

fs.writeFileSync(path, code);
