const fs = require('fs');

// App.tsx
let path = 'src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/const \[showSplash, setShowSplash\] = useState\(true\);/,
  'const [showSplash, setShowSplash] = useState(true);\n  const [copied, setCopied] = useState(false);');

fs.writeFileSync(path, code);

// VerseDisplay.tsx
path = 'src/components/VerseDisplay.tsx';
code = fs.readFileSync(path, 'utf8');

const handles = /const handleCopy = async \(\) => \{[\s\S]*?const handleOpenYoutube = \(\) => \{[\s\S]*?\}\n\s*window\.open[\s\S]*?\};\n/;
code = code.replace(handles, '');
// just to be safe, also replace them individually if regex misses
code = code.replace(/const handleCopy = async \(\) => \{[\s\S]*?catch \(err\) \{\s*console\.error\('Failed to copy', err\);\s*\}\s*\};\n/, '');
code = code.replace(/const handleOpenYoutube = \(\) => \{[\s\S]*?\}[\s\S]*?window\.open[\s\S]*?\};\n/, '');

fs.writeFileSync(path, code);
