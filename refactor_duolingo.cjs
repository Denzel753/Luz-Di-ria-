const fs = require('fs');

const filePaths = [
  'src/components/Header.tsx',
  'src/components/VerseDisplay.tsx',
  'src/components/Settings.tsx',
  'src/components/Drawer.tsx',
  'src/components/ShareModal.tsx',
  'src/components/SearchModal.tsx',
  'src/components/AboutModal.tsx',
  'src/components/RandomVerseSelector.tsx',
  'src/components/CrossReferencesModal.tsx',
  'src/components/BackgroundModal.tsx',
  'src/components/EmotionsModal.tsx',
  'src/components/PermissionModal.tsx',
  'src/components/ErrorPopup.tsx',
  'src/components/Toast.tsx',
  'src/App.tsx'
];

function replaceClasses(code) {
  // Replace orange/amber colors with the new orange var (where it makes sense)
  // Duolingo style uses clear rounded borders and shadows.
  
  // Let's replace button classes with our new btn classes where possible
  // We'll use regex to target specific elements.
  
  // Modals / Cards generic
  code = code.replace(/bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl/g, 'bg-white dark:bg-[#111111] rounded-[20px] w-full max-w-md overflow-hidden border-2 border-[var(--color-duo-border)] shadow-[0_4px_0_var(--color-duo-border)]');
  code = code.replace(/bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md max-h-\[90vh\] flex flex-col shadow-2xl/g, 'bg-white dark:bg-[#111111] rounded-[20px] w-full max-w-md max-h-[90vh] flex flex-col border-2 border-[var(--color-duo-border)] shadow-[0_4px_0_var(--color-duo-border)]');
  
  code = code.replace(/text-amber-600/g, 'text-[var(--color-duo-orange)]');
  code = code.replace(/bg-amber-600/g, 'bg-[var(--color-duo-orange)]');
  code = code.replace(/border-amber-600/g, 'border-[var(--color-duo-orange)]');
  code = code.replace(/from-amber-400 to-orange-600/g, 'from-[#ffaf4d] to-[var(--color-duo-orange)]');
  code = code.replace(/text-amber-700 dark:text-amber-500/g, 'text-[var(--color-duo-orange)]');
  code = code.replace(/bg-amber-100 dark:bg-amber-900\/40/g, 'bg-[#fff1e0] dark:bg-[#332000]');
  code = code.replace(/text-stone-800 dark:text-zinc-100/g, 'text-[var(--color-duo-text)]');
  code = code.replace(/text-stone-700 dark:text-zinc-200/g, 'text-[var(--color-duo-text)]');
  code = code.replace(/text-stone-600 dark:text-zinc-400/g, 'text-[var(--color-duo-text-light)]');
  code = code.replace(/text-stone-500 dark:text-zinc-400/g, 'text-[var(--color-duo-text-light)]');
  code = code.replace(/border-stone-100 dark:border-zinc-800/g, 'border-[var(--color-duo-border)]');
  code = code.replace(/border-stone-200 dark:border-zinc-800/g, 'border-[var(--color-duo-border)]');
  code = code.replace(/border-stone-200 dark:border-zinc-700/g, 'border-[var(--color-duo-border)]');
  code = code.replace(/border-stone-300 dark:border-zinc-600/g, 'border-[var(--color-duo-border)]');
  code = code.replace(/bg-stone-50 dark:bg-zinc-900/g, 'bg-[var(--color-duo-bg-sec)]');
  code = code.replace(/bg-stone-50 dark:bg-zinc-950/g, 'bg-[var(--color-duo-bg-sec)]');
  code = code.replace(/bg-stone-100 dark:bg-zinc-800/g, 'bg-[var(--color-duo-border)]');
  
  // Specific Button replacements
  code = code.replace(/py-3.5 px-4 bg-white dark:bg-zinc-800 hover:bg-stone-50 dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-200 font-medium rounded-xl border border-stone-300 dark:border-zinc-700 transition-colors flex items-center justify-center gap-2 text-\[15px\]/g, 'btn-secondary py-3 px-4');
  code = code.replace(/py-3.5 px-4 bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-800 dark:text-zinc-100 font-semibold rounded-xl border border-stone-300 dark:border-zinc-600 transition-colors flex items-center justify-center gap-2 text-\[15px\]/g, 'btn-secondary py-3 px-4');
  
  return code;
}

filePaths.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = replaceClasses(content);
    fs.writeFileSync(file, content);
  }
});
console.log("Refactored styles.");
