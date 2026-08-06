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

function processFile(path) {
  if (!fs.existsSync(path)) return;
  let code = fs.readFileSync(path, 'utf8');
  let original = code;
  
  // Modals & popups base
  code = code.replace(/bg-white rounded-\[24px\] border-2 border-\[var\(--color-duo-border\)\] shadow-\[0_4px_0_var\(--color-duo-border\)\] w-full max-w-md overflow-hidden relative flex flex-col/g, 'duo-modal w-full max-w-md overflow-hidden relative flex flex-col');
  code = code.replace(/bg-white dark:bg-zinc-900 rounded-\[20px\] border-2 border-\[var\(--color-duo-border\)\] shadow-\[0_4px_0_var\(--color-duo-border\)\]/g, 'duo-modal');
  code = code.replace(/bg-\[var\(--color-duo-bg\)\] rounded-\[20px\] border-2 border-\[var\(--color-duo-border\)\] shadow-\[0_4px_0_var\(--color-duo-border\)\]/g, 'duo-modal');
  
  code = code.replace(/text-stone-800 dark:text-zinc-100/g, 'text-[var(--color-duo-text)]');
  code = code.replace(/text-stone-700 dark:text-zinc-100/g, 'text-[var(--color-duo-text)]');
  code = code.replace(/text-stone-700 dark:text-zinc-200/g, 'text-[var(--color-duo-text)]');
  code = code.replace(/text-stone-600 dark:text-zinc-400/g, 'text-[var(--color-duo-text-light)]');
  code = code.replace(/text-stone-500 dark:text-zinc-400/g, 'text-[var(--color-duo-text-light)]');
  
  code = code.replace(/bg-stone-50 dark:bg-zinc-800/g, 'bg-[var(--color-duo-bg-sec)]');
  code = code.replace(/bg-stone-100 dark:bg-zinc-800/g, 'bg-[var(--color-duo-bg-sec)]');
  
  code = code.replace(/border-stone-100 dark:border-zinc-800/g, 'border-[var(--color-duo-border)]');
  code = code.replace(/border-stone-200 dark:border-zinc-800/g, 'border-[var(--color-duo-border)]');
  code = code.replace(/border-stone-200 dark:border-zinc-700/g, 'border-[var(--color-duo-border)]');
  
  // Specific VerseDisplay
  if (path.includes('VerseDisplay.tsx')) {
    code = code.replace(/className="flex-1 relative flex items-center justify-center p-4 sm:p-8 z-0 pointer-events-none w-full max-w-4xl mx-auto my-4 bg-white dark:bg-\[#111111\] rounded-\[24px\] border-2 border-\[var\(--color-duo-border\)\] shadow-\[0_4px_0_var\(--color-duo-border\)\]"/g,
      'className="flex-1 relative flex items-center justify-center p-4 sm:p-8 z-0 pointer-events-none w-full max-w-4xl mx-auto my-4 duo-modal !border-2"');
  }

  // App.tsx
  if (path.includes('App.tsx')) {
    code = code.replace(/bg-\[var\(--color-duo-bg\)\] w-full max-w-md rounded-\[20px\] flex flex-col relative animate-in zoom-in-95 duration-\[320ms\] ease-\[cubic-bezier\(0\.34,1\.56,0\.64,1\)\] overflow-hidden border-2 border-\[var\(--color-duo-border\)\] shadow-\[0_4px_0_var\(--color-duo-border\)\]/g, 
      'duo-modal w-full max-w-md flex flex-col relative animate-in zoom-in-95 duration-[320ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden');
  }
  
  // Generic borders
  code = code.replace(/border-b border-\[var\(--color-duo-border\)\]/g, 'border-b-2 border-[var(--color-duo-border)]');
  code = code.replace(/border-t border-\[var\(--color-duo-border\)\]/g, 'border-t-2 border-[var(--color-duo-border)]');
  
  // Title fonts
  code = code.replace(/font-serif/g, 'font-sans font-bold tracking-tight');
  
  // Change rounded radii
  code = code.replace(/rounded-xl/g, 'rounded-2xl');

  if (code !== original) {
    fs.writeFileSync(path, code);
    console.log('Processed', path);
  }
}

filePaths.forEach(processFile);
