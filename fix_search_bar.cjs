const fs = require('fs');
let path = 'src/components/SearchModal.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  /className="duo-input pl-10 py-3"/g,
  'className="duo-input !pl-11 py-3"'
);

code = code.replace(
  /left-3/g,
  'left-4'
);

fs.writeFileSync(path, code);
