const fs = require('fs');

let path = 'src/components/EmotionsModal.tsx';
let code = fs.readFileSync(path, 'utf8');

// Delay the fetchFullBible so it doesn't block the animation
code = code.replace(
  /if \(isOpen\) \{\s*fetchFullBible\(\)\.catch\(err => \{\s*console\.warn\("Soft pre-fetch failed, will retry on click:", err\);\s*\}\);\s*setError\(null\);\s*\}/,
  `if (isOpen) {
      // Delay pre-fetch slightly to allow the entry animation to finish smoothly
      const timer = setTimeout(() => {
        fetchFullBible().catch(err => {
          console.warn("Soft pre-fetch failed, will retry on click:", err);
        });
      }, 400);
      setError(null);
      return () => clearTimeout(timer);
    }`
);

// Remove backdrop-blur-sm from the overlay to improve performance
code = code.replace(
  /className="absolute inset-0 bg-stone-900\/40 backdrop-blur-sm"/,
  'className="absolute inset-0 bg-stone-900/60 transition-opacity"'
);

// Optimize the inner modal
code = code.replace(
  /className="p-5 border-b-2 border-\[var\(--color-duo-border\)\] flex justify-between items-center bg-stone-50\/80 dark:bg-zinc-900\/80 backdrop-blur-md sticky top-0 z-10"/,
  'className="p-5 border-b-2 border-[var(--color-duo-border)] flex justify-between items-center bg-[var(--color-duo-bg)] sticky top-0 z-10"'
);

fs.writeFileSync(path, code);
