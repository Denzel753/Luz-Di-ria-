const fs = require('fs');

function replaceFile(path, replacer) {
  if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');
    const newContent = replacer(content);
    if (content !== newContent) {
       fs.writeFileSync(path, newContent);
       console.log("Updated", path);
    }
  }
}

// 1. App.tsx
replaceFile('src/App.tsx', code => {
  // Giant popup body
  code = code.replace(/bg-\[#f5f5f4\] dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-300 overflow-hidden border border-stone-200 dark:border-zinc-800/g, 
    'bg-[var(--color-duo-bg)] w-full max-w-md rounded-[20px] flex flex-col relative animate-in zoom-in-95 duration-300 overflow-hidden border-2 border-[var(--color-duo-border)] shadow-[0_4px_0_var(--color-duo-border)]');
  
  // Footer buttons in giant popup
  code = code.replace(/className="flex-1 py-3\.5 px-4 bg-white dark:bg-zinc-800 hover:bg-stone-50 dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-200 font-medium rounded-xl border border-stone-300 dark:border-zinc-700 transition-colors flex items-center justify-center gap-2 text-\[15px\]"/g, 
    'className="btn-secondary py-3 px-4 w-full"');
  code = code.replace(/className="flex-1 py-3\.5 px-4 bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-800 dark:text-zinc-100 font-semibold rounded-xl border border-stone-300 dark:border-zinc-600 transition-colors flex items-center justify-center gap-2 text-\[15px\]"/g,
    'className="btn-primary py-3 px-4 w-full"');
  
  return code;
});

// 2. VerseDisplay.tsx
replaceFile('src/components/VerseDisplay.tsx', code => {
  // Main container - let's make it look like a floating card
  code = code.replace(/<div className="flex-1 flex flex-col items-center justify-center w-full max-w-3xl mx-auto z-10">/g, 
    '<div className="flex-1 flex flex-col items-center justify-center w-full max-w-3xl mx-auto z-10 px-4 py-8">');
    
  code = code.replace(/<div\s+ref=\{containerRef\}\s+className="relative w-full text-center(.*?)">/g, 
    '<div ref={containerRef} className="relative w-full text-center bg-white dark:bg-[#111111] border-2 border-[var(--color-duo-border)] shadow-[0_4px_0_var(--color-duo-border)] rounded-[24px] p-6 sm:p-10 transition-all duration-300$1">');
    
  // Bottom Action Bar
  code = code.replace(/<div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-stone-50 via-stone-50\/80 to-transparent dark:from-zinc-950 dark:via-zinc-950\/80 z-20">/g,
    '<div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-[var(--color-duo-bg)] via-[var(--color-duo-bg)] to-transparent z-20">');
    
  // Replace buttons in the action bar
  code = code.replace(/className="flex-1 max-w-sm py-4 px-6 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-3 text-lg"/g,
    'className="btn-primary py-4 px-6 w-full max-w-sm text-lg"');
  
  code = code.replace(/className={`p-4 rounded-2xl transition-all duration-200 flex-1 max-w-\[80px\] flex items-center justify-center \$\{([^}]+)\}`}/g,
    'className={`btn-icon p-4 h-full flex-1 max-w-[80px] ${$1}`}');
    
  code = code.replace(/className="p-4 bg-white dark:bg-zinc-900 text-stone-700 dark:text-zinc-200 hover:bg-stone-50 dark:hover:bg-zinc-800 border border-stone-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 flex-1 max-w-\[80px\] flex items-center justify-center"/g,
    'className="btn-icon p-4 h-full flex-1 max-w-[80px]"');
    
  // The Favorite button when active:
  code = code.replace(/isFavorite \? 'bg-amber-100 text-amber-600 border-transparent dark:bg-amber-900\/30 dark:text-amber-500' : 'bg-white text-stone-700 border-stone-200 dark:bg-zinc-900 dark:text-zinc-200 dark:border-zinc-800'/g,
    "isFavorite ? '!bg-[var(--color-duo-orange)] !text-white !border-[var(--color-duo-orange-dark)]' : ''");
    
  return code;
});

// 3. SearchModal.tsx
replaceFile('src/components/SearchModal.tsx', code => {
  // Modal container
  code = code.replace(/bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md max-h-\[90vh\] flex flex-col shadow-2xl/g, 
    'bg-[var(--color-duo-bg)] rounded-[20px] border-2 border-[var(--color-duo-border)] shadow-[0_4px_0_var(--color-duo-border)] w-full max-w-md max-h-[90vh] flex flex-col');
  
  // Search input
  code = code.replace(/bg-stone-100 dark:bg-zinc-800 text-stone-800 dark:text-zinc-100 placeholder-stone-400 dark:placeholder-zinc-500 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500\/50/g,
    'bg-[var(--color-duo-bg-sec)] text-[var(--color-duo-text)] placeholder-[var(--color-duo-text-light)] rounded-full border-2 border-[var(--color-duo-border)] py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-[var(--color-duo-orange)]');
    
  // Search item card
  code = code.replace(/p-4 border-b border-stone-100 dark:border-zinc-800 hover:bg-stone-50 dark:hover:bg-zinc-800\/50 transition-colors text-left/g,
    'duo-card-interactive mb-3 text-left');
    
  return code;
});

// 4. Drawer.tsx
replaceFile('src/components/Drawer.tsx', code => {
  code = code.replace(/bg-white dark:bg-zinc-900 w-80 max-w-\[85vw\] h-full shadow-2xl flex flex-col/g,
    'bg-[var(--color-duo-bg)] w-80 max-w-[85vw] h-full shadow-2xl flex flex-col border-l-2 border-[var(--color-duo-border)]');
    
  code = code.replace(/className="p-3 bg-stone-50 dark:bg-zinc-800\/50 rounded-xl border border-stone-100 dark:border-zinc-800 hover:border-amber-200 dark:hover:border-amber-900\/50 transition-colors text-left group"/g,
    'className="duo-card-interactive p-3 text-left group"');
    
  return code;
});

// 5. Settings.tsx
replaceFile('src/components/Settings.tsx', code => {
  code = code.replace(/bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md max-h-\[90vh\] flex flex-col shadow-2xl/g,
    'bg-[var(--color-duo-bg)] rounded-[20px] border-2 border-[var(--color-duo-border)] shadow-[0_4px_0_var(--color-duo-border)] w-full max-w-md max-h-[90vh] flex flex-col');
    
  code = code.replace(/bg-white dark:bg-zinc-900 rounded-2xl border border-stone-200 dark:border-zinc-800 shadow-sm overflow-hidden/g,
    'duo-card overflow-hidden p-0 border-2'); // Note we'll adjust padding
    
  code = code.replace(/px-5 py-3\.5 bg-stone-50\/50 dark:bg-zinc-900\/50 border-b border-stone-100 dark:border-zinc-800 flex items-center gap-2/g,
    'px-5 py-3.5 bg-[var(--color-duo-bg-sec)] border-b-2 border-[var(--color-duo-border)] flex items-center gap-2');
    
  // The toggle switches
  code = code.replace(/className="w-11 h-6 bg-stone-200/g, 'className="w-11 h-6 bg-[var(--color-duo-border)]');
  code = code.replace(/peer-checked:bg-amber-600/g, 'peer-checked:bg-[var(--color-duo-orange)]');
  
  // Danger button
  code = code.replace(/className="w-full bg-red-50 hover:bg-red-100 dark:bg-red-900\/20 dark:hover:bg-red-900\/40 text-red-600 dark:text-red-400 py-3 rounded-xl font-bold transition-all duration-200 active:scale-\[0\.98\] border border-red-100 dark:border-red-900\/30"/g,
    'className="btn-primary !bg-[var(--color-duo-red)] !border-[var(--color-duo-red)] w-full py-3" style={{boxShadow: "0 4px 0 #cc3c3c"}}');
    
  return code;
});

// 6. Header.tsx
replaceFile('src/components/Header.tsx', code => {
  code = code.replace(/bg-white\/80 dark:bg-zinc-900\/80 backdrop-blur-md h-16 flex items-center justify-between px-6 shadow-sm border-b border-stone-100 dark:border-zinc-800/g,
    'bg-[var(--color-duo-bg)] h-16 flex items-center justify-between px-6 border-b-2 border-[var(--color-duo-border)]');
    
  code = code.replace(/className="p-2 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-full transition-all duration-200 active:scale-90"/g,
    'className="btn-icon p-2 w-10 h-10"');
    
  return code;
});

console.log("Done");
