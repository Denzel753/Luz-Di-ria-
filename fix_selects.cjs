const fs = require('fs');
const files = [
  'src/components/Settings.tsx',
  'src/components/UpdateIntervalModal.tsx',
  'src/components/SearchModal.tsx',
  'src/components/BackgroundModal.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    
    // Selects
    code = code.replace(/className="w-full bg-\[var\(--color-duo-bg-sec\)\] border border-\[var\(--color-duo-border\)\] text-\[var\(--color-duo-text\)\] rounded-\[20px\] px-4 py-3 text-\[15px\] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 cursor-pointer"/g,
      'className="duo-input cursor-pointer appearance-none"');
      
    code = code.replace(/className="w-full bg-\[var\(--color-duo-bg-sec\)\] border border-\[var\(--color-duo-border\)\] text-\[var\(--color-duo-text\)\] rounded-\[20px\] px-4 py-3 text-\[15px\] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 cursor-pointer mb-4"/g,
      'className="duo-input cursor-pointer appearance-none mb-4"');
      
    code = code.replace(/className="bg-\[var\(--color-duo-bg-sec\)\] border border-\[var\(--color-duo-border\)\] text-\[var\(--color-duo-text\)\] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 cursor-pointer w-full sm:w-auto"/g,
      'className="duo-input cursor-pointer appearance-none px-4 py-2 w-full sm:w-auto"');
      
    code = code.replace(/className="bg-\[var\(--color-duo-bg-sec\)\] border border-\[var\(--color-duo-border\)\] text-\[var\(--color-duo-text\)\] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500 cursor-pointer w-full"/g,
      'className="duo-input cursor-pointer appearance-none w-full"');
      
    // Additional generic inputs
    code = code.replace(/className="flex-1 bg-\[var\(--color-duo-bg-sec\)\] border-2 border-\[var\(--color-duo-border\)\] rounded-\[12px\] px-3 py-2 text-sm outline-none focus:border-\[var\(--color-duo-orange\)\]"/g,
      'className="duo-input"');
      
    fs.writeFileSync(file, code);
  }
});
