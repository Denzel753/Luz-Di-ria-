const fs = require('fs');

let path = 'src/components/StreakModal.tsx';
let code = fs.readFileSync(path, 'utf8');

// Change the share button to Concluir
code = code.replace(
  /<button className="btn-primary w-full py-4 text-base gap-2">/,
  '<button onClick={onClose} className="w-full py-4 text-base gap-2 bg-[#58cc02] hover:bg-[#46a302] text-white font-bold flex items-center justify-center transition-all outline-none select-none border-b-4 border-[#46a302] active:border-b-0 active:translate-y-[4px] rounded-full">'
);
code = code.replace(
  /<Share2 className="w-5 h-5" \/>\s*Compartilhar Conquista/,
  '<Check className="w-6 h-6" />\n                  Concluir'
);
fs.writeFileSync(path, code);
