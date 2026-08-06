const fs = require('fs');

let pathVerse = 'src/components/VerseDisplay.tsx';
let verseCode = fs.readFileSync(pathVerse, 'utf8');

// Replace the outer div
verseCode = verseCode.replace(
  /<div \s*ref=\{ref\}\s*className="flex-1 flex flex-col relative overflow-hidden transition-colors duration-500 absolute inset-0 z-0"\s*>/,
  `<div 
      ref={ref}
      className="absolute inset-0 z-0 flex flex-col overflow-hidden transition-colors duration-500"
      style={{ 
        backgroundColor: bgType === 'color' ? bgColor : undefined,
        backgroundImage: isImage ? \`url(\${bgImg})\` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {isImage && <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />}
`
);

// Replace inner div
verseCode = verseCode.replace(
  /<div \s*ref=\{containerRef\}\s*id="verse-display-capture"\s*className="flex-1 relative flex items-center justify-center p-6 sm:p-12 z-0 pointer-events-none w-full max-w-4xl mx-auto mt-24 mb-32"\s*style=\{\{\s*'--dynamic-scale': dynamicScale,\s*backgroundColor: bgType === 'color' \? bgColor : undefined,\s*backgroundImage: isImage \? \`url\(\$\{bgImg\}\)\` : 'none',\s*backgroundSize: 'cover',\s*backgroundPosition: 'center',\s*\} as React\.CSSProperties\}\s*>\s*\{isImage && <div className="absolute inset-0 bg-black\/50 z-0 pointer-events-none" \/>\}/,
  `<div 
        ref={containerRef}
        id="verse-display-capture"
        className="flex-1 relative flex items-center justify-center p-6 sm:p-12 z-10 pointer-events-none w-full max-w-4xl mx-auto mt-16 sm:mt-20 mb-32"
        style={{ '--dynamic-scale': dynamicScale } as React.CSSProperties}
      >`
);

fs.writeFileSync(pathVerse, verseCode);
