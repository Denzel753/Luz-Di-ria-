const fs = require('fs');

const filesToProcess = [
  'src/components/Header.tsx',
  'src/components/Settings.tsx',
  'src/components/VerseDisplay.tsx',
  'src/components/Drawer.tsx',
  'src/components/SearchModal.tsx',
  'src/components/RandomVerseSelector.tsx',
  'src/components/EmotionsModal.tsx',
  'src/components/CrossReferencesModal.tsx',
  'src/components/BackgroundModal.tsx',
  'src/components/AboutModal.tsx',
  'src/components/ShareModal.tsx',
  'src/App.tsx'
];

// Helper to replace content globally
function replaceGlobally(code, replacements) {
  let newCode = code;
  for (const [regex, replacement] of replacements) {
    newCode = newCode.replace(regex, replacement);
  }
  return newCode;
}

const globalReplacements = [
  // Typography
  [/text-3xl md:text-4xl lg:text-\[44px\] font-serif font-medium italic/g, "text-[32px] md:text-[40px] font-black tracking-tight duo-title"],
  [/text-xl sm:text-2xl font-bold/g, "text-[24px] font-black tracking-tight duo-title"],
  [/text-lg font-semibold/g, "text-[18px] font-bold"],
  [/font-serif/g, "font-sans font-black tracking-tight"],
  [/italic/g, ""],

  // Backgrounds & Borders for elements
  [/bg-stone-50 dark:bg-zinc-800/g, "bg-[var(--color-duo-bg-sec)]"],
  [/bg-stone-100 dark:bg-zinc-800/g, "bg-[var(--color-duo-bg-sec)]"],
  [/border-stone-100 dark:border-zinc-800/g, "border-[var(--color-duo-border)]"],
  [/border-stone-200 dark:border-zinc-800/g, "border-[var(--color-duo-border)]"],
  [/border-stone-200 dark:border-zinc-700/g, "border-[var(--color-duo-border)]"],
  [/border-stone-300 dark:border-zinc-700/g, "border-[var(--color-duo-border)]"],
  [/border-stone-300 dark:border-zinc-600/g, "border-[var(--color-duo-border)]"],
  [/border-stone-400 dark:border-zinc-600/g, "border-[var(--color-duo-border)]"],

  // Padding & Margin multiples of 4px
  [/py-3\.5/g, "py-3"],
  [/p-2\.5/g, "p-3"],
  
  // Specific Duolingo fixes
  [/bg-white dark:bg-zinc-900 border-b-2/g, "bg-[var(--color-duo-bg)] border-b-2"],
  [/bg-white dark:bg-zinc-950 border-t-2/g, "bg-[var(--color-duo-bg)] border-t-2"],
  [/bg-\[#f5f5f4\] dark:bg-zinc-900/g, "bg-[var(--color-duo-bg-sec)]"],
  
  // Modals & Panels
  [/bg-white dark:bg-zinc-900 rounded-\[20px\]/g, "duo-modal"],
  [/bg-white dark:bg-zinc-900 rounded-2xl/g, "duo-modal"],
  [/bg-white dark:bg-zinc-900 rounded-3xl/g, "duo-modal"],
  
  // Text Colors
  [/text-stone-800 dark:text-zinc-100/g, "text-[var(--color-duo-text)]"],
  [/text-stone-700 dark:text-zinc-200/g, "text-[var(--color-duo-text)]"],
  [/text-stone-700 dark:text-zinc-100/g, "text-[var(--color-duo-text)]"],
  [/text-stone-600 dark:text-zinc-400/g, "text-[var(--color-duo-text-light)]"],
  [/text-stone-500 dark:text-zinc-400/g, "text-[var(--color-duo-text-light)]"],
  [/text-stone-400 dark:text-zinc-500/g, "text-[var(--color-duo-text-light)]"],
  
  // Replace old button classes with standard new classes
  // In Settings: Danger button
  [/className="btn-primary !bg-\[var\(--color-duo-red\)\] !border-\[var\(--color-duo-red\)\] w-full py-3" style={{boxShadow: "0 4px 0 #cc3c3c"}}/g, 'className="btn-primary w-full py-3 !bg-[var(--color-duo-red)] !border-[var(--color-duo-red)] !border-b-[var(--color-duo-red-dark)]"'],
  
  // Inputs
  [/className="w-full bg-\[var\(--color-duo-bg-sec\)\] border-2 border-\[var\(--color-duo-border\)\] rounded-full py-2\.5 pl-10 pr-4 text-\[var\(--color-duo-text\)\] placeholder-\[var\(--color-duo-text-light\)\] focus:border-\[var\(--color-duo-orange\)\] outline-none text-sm font-medium transition-colors"/g, 'className="duo-input pl-10 py-3"'],
  [/className="w-full bg-stone-100 dark:bg-zinc-800 text-\[var\(--color-duo-text\)\] placeholder-\[var\(--color-duo-text-light\)\] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-amber-500\/50"/g, 'className="duo-input"'],
  [/className="w-full bg-stone-100 dark:bg-zinc-800 border-none rounded-xl py-3 px-4 text-\[var\(--color-duo-text\)\] placeholder-\[var\(--color-duo-text-light\)\] focus:ring-2 focus:ring-amber-500\/50 outline-none text-sm"/g, 'className="duo-input"']
];

filesToProcess.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    content = replaceGlobally(content, globalReplacements);
    if (content !== original) {
      fs.writeFileSync(file, content);
      console.log('Updated ' + file);
    }
  }
});
