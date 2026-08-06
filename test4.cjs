const fs = require('fs');
let path = 'src/components/VerseDisplay.tsx';
let code = fs.readFileSync(path, 'utf8');

const oldClass = /className="flex-1 relative flex items-center justify-center p-4 sm:p-8 z-0 pointer-events-none w-full max-w-4xl mx-auto my-4 rounded-\[32px\] \$\{isDark \? 'bg-black\/20 border-white\/10' : 'bg-white\/40 border-black\/5'\} backdrop-blur-md shadow-2xl border"/;
const newClass = 'className={`flex-1 relative flex items-center justify-center p-4 sm:p-8 z-0 pointer-events-none w-full max-w-4xl mx-auto mt-24 mb-24 rounded-[32px] ${isDark ? "bg-black/20 border-white/10" : "bg-white/40 border-black/5"} backdrop-blur-md shadow-2xl border`}';

code = code.replace(oldClass, newClass);
fs.writeFileSync(path, code);
