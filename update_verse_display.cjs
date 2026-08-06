const fs = require('fs');
let path = 'src/components/VerseDisplay.tsx';
let code = fs.readFileSync(path, 'utf8');

// Remove handleCopy, handleOpenYoutube, copied state
code = code.replace(/const \[copied, setCopied\] = useState\(false\);/g, '');
const handles = /const handleCopy = async \(\) => \{[\s\S]*?\};\n\n  const handleOpenYoutube = \(\) => \{[\s\S]*?\};\n/;
code = code.replace(handles, '');

// Remove the Sub-toolbar entirely!
const subToolbarRegex = /\{\/\* Sub-toolbar \*\/\}\n\s*<div className="flex items-center justify-between px-6 py-4 bg-transparent z-10 capture-ignore">[\s\S]*?<\/div>/;
code = code.replace(subToolbarRegex, '');

fs.writeFileSync(path, code);
