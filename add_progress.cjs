const fs = require('fs');
let path = 'src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

// We'll add a progress bar under Header and before VerseDisplay
const progressHtml = `
      {/* Daily Progress */}
      <div className="w-full max-w-4xl mx-auto px-6 pt-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-bold text-[var(--color-duo-text-light)] uppercase tracking-widest">Meta Diária</span>
          <span className="text-[13px] font-black text-[var(--color-duo-orange)]">3 / 5</span>
        </div>
        <div className="duo-progress-container">
          <div className="duo-progress-bar" style={{ width: '60%' }}></div>
          <div className="duo-progress-highlight"></div>
        </div>
      </div>
      
      <VerseDisplay`;

code = code.replace(/<VerseDisplay/g, progressHtml);

fs.writeFileSync(path, code);
