const fs = require('fs');
let content = fs.readFileSync('src/components/CrossReferencesModal.tsx', 'utf8');

content = content.replace(/extensiveRefsFetchPromise = fetch\([^)]+\)\.then\(async res => \{[\s\S]*?\}\)\.catch\(err => \{[\s\S]*?\}\);/, `extensiveRefsFetchPromise = import('../../public/cross_references.json')
              .then(module => {
                const data = module.default || module;
                extensiveRefsCache = data;
                setExtensiveRefs(data[verse.reference] || []);
              })
              .catch(err => {
                console.error('Failed to load extensive cross references', err);
              });`);

fs.writeFileSync('src/components/CrossReferencesModal.tsx', content);
console.log('Patched cross refs to use dynamic import');
