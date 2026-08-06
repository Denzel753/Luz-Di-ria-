const fs = require('fs');

let path = 'src/components/VerseDisplay.tsx';
let code = fs.readFileSync(path, 'utf8');

// Remove the blurred blobs
code = code.replace(/<div className="absolute top-\[-20%\] right-\[-10%\] w-\[600px\] h-\[600px\] bg-amber-100\/30 dark:bg-amber-950\/20 rounded-full blur-3xl pointer-events-none" \/>/g, '');
code = code.replace(/<div className="absolute bottom-\[-10%\] left-\[-10%\] w-\[400px\] h-\[400px\] bg-stone-200\/40 dark:bg-zinc-900\/40 rounded-full blur-3xl pointer-events-none" \/>/g, '');

// The quote mark span
code = code.replace(/<span className={`\$\{quoteStyle\} text-8xl md:text-9xl font-sans font-bold tracking-tight leading-none h-12 md:h-16 select-none transition-colors opacity-80 bg-gradient-to-b from-current to-transparent bg-clip-text`}>"<\/span>/g,
  '<span className={`text-[var(--color-duo-orange)] opacity-20 text-8xl md:text-9xl font-sans font-black leading-none h-12 md:h-16 select-none transition-colors`}>"</span>');

fs.writeFileSync(path, code);
console.log('Cleaned VerseDisplay');
