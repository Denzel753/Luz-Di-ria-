const fs = require('fs');
let path = 'src/components/ErrorBoundary.tsx';
if (fs.existsSync(path)) {
  let code = fs.readFileSync(path, 'utf8');
  code = code.replace(/className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 text-sm shadow-sm"/g,
    'className="btn-primary w-full py-4 gap-2 text-sm"');
  code = code.replace(/bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md p-6 shadow-2xl border border-stone-200 dark:border-zinc-800 text-center relative overflow-hidden/g,
    'duo-modal w-full max-w-md p-6 text-center relative overflow-hidden');
  fs.writeFileSync(path, code);
}
