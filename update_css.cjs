const fs = require('fs');

let path = 'src/index.css';
let code = fs.readFileSync(path, 'utf8');

// I'll make sure btn-secondary isn't too extreme for menus, but primary keeps uppercase
code = code.replace(/@apply bg-\[var\(--color-duo-bg\)\] text-\[var\(--color-duo-text\)\] font-bold uppercase tracking-widest flex items-center justify-center transition-all duration-\[180ms\] ease-\[cubic-bezier\(0\.34,1\.56,0\.64,1\)\];/g,
  '@apply bg-[var(--color-duo-bg)] text-[var(--color-duo-text)] font-bold flex items-center justify-center transition-all duration-[180ms] ease-[cubic-bezier(0.34,1.56,0.64,1)];');

code = code.replace(/@apply bg-\[var\(--color-duo-orange\)\] text-white font-bold uppercase tracking-widest flex items-center justify-center transition-all duration-\[180ms\] ease-\[cubic-bezier\(0\.34,1\.56,0\.64,1\)\];/g,
  '@apply bg-[var(--color-duo-orange)] text-white font-bold flex items-center justify-center transition-all duration-[180ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] uppercase tracking-wider;');

fs.writeFileSync(path, code);
