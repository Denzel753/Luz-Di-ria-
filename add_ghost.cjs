const fs = require('fs');
let path = 'src/index.css';
let code = fs.readFileSync(path, 'utf8');

const ghostCss = `  .btn-ghost {
    @apply bg-transparent text-[var(--color-duo-text-light)] flex items-center justify-center transition-all outline-none select-none p-2;
    border-radius: 9999px;
    transition-duration: 180ms;
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .btn-ghost:hover {
    @apply bg-[var(--color-duo-bg-sec)];
  }
  .btn-ghost:active {
    transform: scale(0.9);
  }
`;

code = code.replace(/@layer components {/g, '@layer components {\n' + ghostCss);

fs.writeFileSync(path, code);

// Now apply btn-ghost to various close buttons
const files = [
  'src/components/AboutModal.tsx',
  'src/components/BackgroundModal.tsx',
  'src/components/CrossReferencesModal.tsx',
  'src/components/EmotionsModal.tsx',
  'src/components/ErrorPopup.tsx',
  'src/components/PermissionModal.tsx',
  'src/components/RandomVerseSelector.tsx',
  'src/components/SearchModal.tsx',
  'src/components/Settings.tsx',
  'src/components/ShareModal.tsx',
  'src/components/UpdateIntervalModal.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    code = code.replace(/className="p-2 text-stone-400 hover:text-stone-700 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-stone-200 dark:hover:bg-zinc-700\/50 rounded-full transition-colors"/g, 'className="btn-ghost"');
    code = code.replace(/className="p-2 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-full transition-colors"/g, 'className="btn-ghost"');
    code = code.replace(/className="p-2 hover:bg-stone-100 rounded-full transition-colors"/g, 'className="btn-ghost"');
    code = code.replace(/className="p-2 rounded-full hover:bg-stone-100 transition-colors"/g, 'className="btn-ghost"');
    code = code.replace(/className="p-2 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-full transition-all duration-\[180ms\] ease-\[cubic-bezier\(0\.34,1\.56,0\.64,1\)\] active:scale-90 -ml-2"/g, 'className="btn-ghost -ml-2"');
    code = code.replace(/className="text-stone-400 hover:text-stone-600 dark:hover:text-zinc-300 p-1"/g, 'className="btn-ghost"');
    fs.writeFileSync(file, code);
  }
});
