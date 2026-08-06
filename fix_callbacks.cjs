const fs = require('fs');

let path = 'src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  /const handleOpenYoutube = \(\) => \{/,
  'const handleOpenYoutube = useCallback(() => {'
);
code = code.replace(
  /window\.open\(`https:\/\/www\.youtube\.com\/results\?search_query=\$\{encodeURIComponent\(currentVerse\.reference \+ ' pregação'\)\}`, '_blank'\);\s*\};/,
  "window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(currentVerse.reference + ' pregação')}`, '_blank');\n  }, [currentVerse.reference, addToast]);"
);

code = code.replace(
  /const handleCopy = async \(\) => \{/,
  'const handleCopy = useCallback(async () => {'
);

code = code.replace(
  /setTimeout\(\(\) => setCopied\(false\), 2000\);\s*\} catch \(err\) \{\s*console\.error\('Failed to copy', err\);\s*addToast\('error', 'Erro ao copiar versículo\.'\);\s*\}\s*\};/,
  `setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
      addToast('error', 'Erro ao copiar versículo.');
    }
  }, [currentVerse, addToast]);`
);

fs.writeFileSync(path, code);
