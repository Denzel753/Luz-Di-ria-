const fs = require('fs');
const path = require('path');

const components = [
  'EmotionsModal.tsx',
  'SearchModal.tsx',
  'CrossReferencesModal.tsx',
  'RandomVerseSelector.tsx',
  'BackgroundModal.tsx',
  'AboutModal.tsx',
  'ShareModal.tsx',
  'StreakModal.tsx',
  'Drawer.tsx',
  'PermissionModal.tsx'
];

components.forEach(file => {
  let filepath = path.join('src/components', file);
  if (!fs.existsSync(filepath)) return;
  
  let code = fs.readFileSync(filepath, 'utf8');
  
  // Check if it's already using React.memo
  if (code.includes('export const ') && code.includes(' = React.memo(')) return;
  
  // Replace export function ComponentName to export const ComponentName = React.memo(function ComponentName
  // Or handle export function
  const match = code.match(/export (?:default )?function ([A-Za-z0-9_]+)\s*\(([^)]*)\)/);
  if (match) {
    const name = match[1];
    
    // Add import React if missing
    if (!code.includes("import React") && !code.includes("import * as React")) {
      code = "import React from 'react';\n" + code;
    }
    
    code = code.replace(
      new RegExp(`export (?:default )?function ${name}\\s*\\(([^)]*)\\)\\s*(:\\s*[^{]+)?\\s*\\{`),
      `export const ${name} = React.memo(function ${name}($1)$2 {`
    );
    
    // add closing parenthesis for React.memo
    const lastClosingBrace = code.lastIndexOf('}');
    code = code.substring(0, lastClosingBrace + 1) + ');' + code.substring(lastClosingBrace + 1);
    
    fs.writeFileSync(filepath, code);
    console.log(`Memoized ${file}`);
  }
});
