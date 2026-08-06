const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/line-height: 1\.6 !important;/g, 'line-height: 1.4 !important;');

fs.writeFileSync('src/App.tsx', content);
console.log("Updated line-height in App.tsx");
