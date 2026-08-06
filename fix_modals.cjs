const fs = require('fs');

const modalFiles = [
  'src/components/AboutModal.tsx',
  'src/components/ShareModal.tsx',
  'src/components/UpdateIntervalModal.tsx',
  'src/components/PermissionModal.tsx',
  'src/components/ErrorPopup.tsx'
];

modalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    
    // Backdrop
    code = code.replace(/className="fixed inset-0 bg-black\/60 z-\[60\] flex items-center justify-center p-4 md:p-6 backdrop-blur-sm"/g,
      'className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 md:p-6 backdrop-blur-sm animate-in fade-in duration-[320ms] ease-out"');
      
    code = code.replace(/className="fixed inset-0 z-\[60\] flex items-center justify-center bg-black\/60 backdrop-blur-sm p-4"/g,
      'className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-[320ms] ease-out"');

    // Modal Content
    code = code.replace(/className="duo-modal w-full max-w-md flex flex-col transform transition-all"/g,
      'className="duo-modal w-full max-w-md flex flex-col animate-in zoom-in-95 duration-[320ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"');
      
    code = code.replace(/className="duo-modal w-full max-w-sm overflow-hidden relative flex flex-col"/g,
      'className="duo-modal w-full max-w-sm overflow-hidden relative flex flex-col animate-in zoom-in-95 duration-[320ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"');
      
    code = code.replace(/className="duo-modal w-full max-w-sm overflow-hidden flex flex-col"/g,
      'className="duo-modal w-full max-w-sm overflow-hidden flex flex-col animate-in zoom-in-95 duration-[320ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"');
      
    fs.writeFileSync(file, code);
  }
});
