const fs = require('fs');
let content = fs.readFileSync('src/components/CrossReferencesModal.tsx', 'utf8');

content = content.replace(
  "fetch('/cross_references.json')",
  "fetch(window.location.origin + '/cross_references.json')"
);

fs.writeFileSync('src/components/CrossReferencesModal.tsx', content);
console.log('Patched cross refs fetch');
