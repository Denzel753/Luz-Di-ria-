const fs = require('fs');

const files = [
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

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Modals & Panels
    content = content.replace(/bg-\[var\(--color-duo-bg\)\] w-full max-w-md rounded-\[20px\] flex flex-col relative animate-in zoom-in-95 duration-300 overflow-hidden border-2 border-\[var\(--color-duo-border\)\] shadow-\[0_4px_0_var\(--color-duo-border\)\]/g, 
      'bg-white rounded-[24px] border-2 border-[var(--color-duo-border)] shadow-[0_4px_0_var(--color-duo-border)] w-full max-w-md overflow-hidden relative flex flex-col');
    
    // Convert common buttons to btn-primary / btn-secondary if not done yet
    content = content.replace(/className="w-full bg-stone-800 text-white py-3\.5 rounded-xl font-medium text-sm hover:bg-stone-900 transition-colors"/g,
      'className="btn-primary w-full py-4 text-sm"');
      
    content = content.replace(/className="w-full py-3 px-4 bg-\[var\(--color-duo-orange\)\] hover:bg-amber-700 text-white font-medium rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 text-sm shadow-sm"/g,
      'className="btn-primary w-full py-3 text-sm"');
      
    content = content.replace(/className="flex-1 py-2 px-3 bg-\[var\(--color-duo-orange\)\] hover:bg-amber-700 text-white rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-1\.5"/g,
      'className="btn-primary w-full py-2 px-3 text-xs"');
      
    // Drawer buttons
    content = content.replace(/className="duo-card-interactive p-3 text-left group"/g,
      'className="btn-secondary w-full p-3 text-left group mb-2"');
      
    // Random verse cards
    content = content.replace(/className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-stone-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer flex flex-col items-center justify-center gap-3 text-center"/g,
      'className="duo-card-interactive flex flex-col items-center justify-center gap-3 text-center"');
      
    // Emotions cards
    content = content.replace(/className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-stone-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer flex flex-col items-center justify-center gap-3 text-center border-b-4 hover:border-b-amber-500"/g,
      'className="duo-card-interactive flex flex-col items-center justify-center gap-3 text-center border-b-4 hover:border-[var(--color-duo-orange)]"');

    // General replacements for remaining old styles
    content = content.replace(/rounded-xl/g, 'rounded-2xl');
    content = content.replace(/rounded-2xl/g, 'rounded-[20px]');
    content = content.replace(/rounded-[20px]/g, 'rounded-[24px]');
    
    // For specific padding/shadows on main elements, we should ensure the bounce easing is used
    content = content.replace(/transition-all duration-200/g, 'transition-all duration-[180ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]');
    content = content.replace(/duration-300/g, 'duration-[320ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]');
    
    if (content !== original) {
      fs.writeFileSync(file, content);
      console.log('Updated classes in', file);
    }
  }
});
