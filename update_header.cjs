const fs = require('fs');
let path = 'src/components/Header.tsx';
let code = fs.readFileSync(path, 'utf8');

if (!code.includes('Flame')) {
  code = code.replace(/import { /, 'import { Flame, ');
}

// Add streak UI before Share icon
const headerButtons = `<div className="flex items-center gap-2">
          {/* Streak indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-duo-bg-sec)] rounded-full border-2 border-[var(--color-duo-border)] border-b-4 mr-2">
            <Flame className="w-5 h-5 text-[var(--color-duo-orange)] fill-[var(--color-duo-orange)]" />
            <span className="font-bold text-[var(--color-duo-orange)]">12</span>
          </div>
          
          <button className="btn-icon p-2 w-10 h-10" onClick={onShareClick}>`;

code = code.replace(/<div className="flex items-center gap-1">\s*<button className="btn-icon p-2 w-10 h-10" onClick={onShareClick}>/, headerButtons);

code = code.replace(/bg-white\/80 dark:bg-zinc-900\/80 backdrop-blur-md/g, 'bg-[var(--color-duo-bg)]');
code = code.replace(/hover:bg-stone-50 dark:hover:bg-zinc-800/g, 'hover:bg-[var(--color-duo-bg-sec)]');
code = code.replace(/text-stone-700 dark:text-zinc-300/g, 'text-[var(--color-duo-text)]');
code = code.replace(/bg-white dark:bg-zinc-900 shadow-xl border border-\[var\(--color-duo-border\)\] rounded-\[20px\]/g, 'duo-modal shadow-2xl');

fs.writeFileSync(path, code);
