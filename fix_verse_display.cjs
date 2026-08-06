const fs = require('fs');
let pathVerse = 'src/components/VerseDisplay.tsx';
let verseCode = fs.readFileSync(pathVerse, 'utf8');

// 1. Remove background from root div
verseCode = verseCode.replace(
  /className="flex-1 flex flex-col relative overflow-hidden transition-colors duration-500"\s*style=\{\{\s*backgroundColor: bgType === 'color' \? bgColor : '#000',\s*backgroundImage: isImage \? `url\(\$\{bgImg\}\)` : 'none',\s*backgroundSize: 'cover',\s*backgroundPosition: 'center',\s*\}\}/,
  'className="flex-1 flex flex-col relative overflow-hidden transition-colors duration-500"'
);

// 2. Remove the overlay from root div
verseCode = verseCode.replace(/\{isImage && <div className="absolute inset-0 bg-black\/40 z-0 pointer-events-none" \/>\}/, '');

// 3. Move id="verse-display-capture" from root div to inner container
verseCode = verseCode.replace(/id="verse-display-capture"/, ''); // remove from root

// 4. Update the inner container
verseCode = verseCode.replace(
  /className=\{`flex-1 relative flex items-center justify-center p-6 sm:p-12 z-0 pointer-events-none w-full max-w-4xl mx-auto mt-32 mb-28 rounded-\[32px\] \$\{isImage \? \(isDark \? "bg-black\/40 border border-white\/10 backdrop-blur-sm" : "bg-white\/40 border border-black\/10 backdrop-blur-sm"\) : "duo-modal !border-2"\} shadow-xl`\}\s*style=\{\{ '--dynamic-scale': dynamicScale \} as React\.CSSProperties\}/,
  `id="verse-display-capture"
        className="flex-1 relative flex items-center justify-center p-6 sm:p-12 z-0 pointer-events-none w-full max-w-4xl mx-auto mt-32 mb-28 rounded-[32px] duo-modal !border-2 shadow-2xl overflow-hidden"
        style={{ 
          '--dynamic-scale': dynamicScale,
          backgroundColor: bgType === 'color' ? bgColor : undefined,
          backgroundImage: isImage ? \`url(\${bgImg})\` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } as React.CSSProperties}`
);

// 5. Add overlay inside the inner container if it's an image
verseCode = verseCode.replace(
  /<AnimatePresence mode="wait" initial=\{false\}>/,
  `{isImage && <div className="absolute inset-0 bg-black/50 z-0 pointer-events-none" />}
        <AnimatePresence mode="wait" initial={false}>`
);

fs.writeFileSync(pathVerse, verseCode);
