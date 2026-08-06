const fs = require('fs');
let content = fs.readFileSync('src/quotes.ts', 'utf8');

content = content.replace(/\\n\];/g, "");
fs.writeFileSync('src/quotes.ts', content);
console.log("Fixed syntax error 2");
