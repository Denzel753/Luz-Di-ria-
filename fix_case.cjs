const fs = require('fs');
let p = 'src/components/StreakModal.tsx';
let c = fs.readFileSync(p, 'utf8');
c = c.replace(/Concluir\s*<\/button>/, 'CONCLUIR\n                </button>');
fs.writeFileSync(p, c);
