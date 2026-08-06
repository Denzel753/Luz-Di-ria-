const fs = require('fs');
let content = fs.readFileSync('src/bibleService.ts', 'utf8');

content = content.replace(
  "const localRes = await fetch('./nvi.json');",
  "const baseUrl = window.location.origin;\n      const localRes = await fetch(baseUrl + '/nvi.json');"
);

content = content.replace(
  "const localRes = await fetch('/nvi.json');",
  "const baseUrl = window.location.origin;\n      const localRes = await fetch(baseUrl + '/nvi.json');"
);

fs.writeFileSync('src/bibleService.ts', content);
console.log('Patched local fetch');
