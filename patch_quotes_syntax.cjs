const fs = require('fs');
let content = fs.readFileSync('src/quotes.ts', 'utf8');

content = content.replace(
  "{ id: 'q70', text: 'Cristo é a luz do mundo.', author: 'Billy Graham' }",
  "{ id: 'q70', text: 'Cristo é a luz do mundo.', author: 'Billy Graham' },"
);

fs.writeFileSync('src/quotes.ts', content);
console.log("Fixed syntax error");
