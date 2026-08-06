const fs = require('fs');
let path = 'src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/const \[isSearchOpen, setIsSearchOpen\] = useState\(false\);/,
  'const [isSearchOpen, setIsSearchOpen] = useState(false);\n  const [copied, setCopied] = useState(false);');

fs.writeFileSync(path, code);
