const fs = require('fs');
let path = 'src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  /const handleCopy = useCallback\(async \(\) => \{[\s\S]*?\} catch \(err\) \{\s*console\.error\('Failed to copy', err\);\s*\}\s*\};\s*/,
  `const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(\`\${currentVerse.text}\\n\\n— \${currentVerse.reference}\`);
      setCopied(true);
      addToast('success', 'Versículo copiado para a área de transferência!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  }, [currentVerse, addToast]);\n\n`
);

fs.writeFileSync(path, code);
