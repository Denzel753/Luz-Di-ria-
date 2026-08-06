const fs = require('fs');

const files = [
  'src/components/ErrorBoundary.tsx',
  'src/components/Settings.tsx',
  'src/components/UpdateIntervalModal.tsx',
  'src/components/SearchModal.tsx',
  'src/components/AboutModal.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    code = code.replace(/rounded-lg/g, 'rounded-[12px]');
    code = code.replace(/rounded-xl/g, 'rounded-[16px]');
    code = code.replace(/rounded-2xl/g, 'rounded-[20px]');
    code = code.replace(/rounded-3xl/g, 'rounded-[24px]');
    code = code.replace(/rounded-md/g, 'rounded-[8px]');
    
    // In Settings.tsx, fix the button that is self-start text-sm bg-stone-100 hover:bg-stone-200 text-[var(--color-duo-text)] py-1.5 px-3 rounded-[12px] font-medium transition-colors border border-[var(--color-duo-border)] mt-1
    code = code.replace(/className="self-start text-sm bg-stone-100 hover:bg-stone-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-\[var\(--color-duo-text\)\] py-1\.5 px-3 rounded-\[12px\] font-medium transition-colors border border-\[var\(--color-duo-border\)\] mt-1"/g,
      'className="btn-outline self-start text-sm py-2 px-3 gap-2 mt-2"');
    
    // In UpdateIntervalModal.tsx
    code = code.replace(/className="w-20 bg-stone-100 dark:bg-zinc-800 border-none rounded-\[12px\] px-3 py-2\.5 text-stone-900 dark:text-zinc-100 focus:ring-2 focus:ring-amber-500 font-medium"/g,
      'className="duo-input w-20 py-2 px-3 text-center"');
    code = code.replace(/className="flex-1 bg-stone-100 dark:bg-zinc-800 border-none rounded-\[12px\] px-3 py-2\.5 text-stone-900 dark:text-zinc-100 focus:ring-2 focus:ring-amber-500 font-medium cursor-pointer"/g,
      'className="duo-input flex-1 py-2 px-3"');
    code = code.replace(/className="w-full mt-3 px-4 py-3 bg-amber-100 dark:bg-amber-900\/40 text-amber-700 dark:text-amber-400 font-bold rounded-\[16px\] text-sm uppercase tracking-wide hover:bg-amber-200 dark:hover:bg-amber-900\/60 transition-colors"/g,
      'className="btn-primary w-full mt-4 py-3"');
      
    // In SearchModal.tsx
    code = code.replace(/className="w-full relative flex items-center justify-between bg-\[var\(--color-duo-bg-sec\)\] border border-\[var\(--color-duo-border\)\] rounded-\[12px\] py-2 pl-3 pr-2 text-sm font-medium text-\[var\(--color-duo-text\)\] outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400\/20 transition-all disabled:opacity-50 text-left"/g,
      'className="duo-input px-3 py-2 text-left flex justify-between cursor-pointer"');
    
    fs.writeFileSync(file, code);
  }
});
