const fs = require('fs');

let pathVerse = 'src/components/VerseDisplay.tsx';
let verseCode = fs.readFileSync(pathVerse, 'utf8');

// Change outer div to take full screen background
verseCode = verseCode.replace(
  /className="flex-1 flex flex-col relative overflow-hidden transition-colors duration-500"/,
  `className="flex-1 flex flex-col absolute inset-0 z-0 overflow-hidden transition-colors duration-500"
      style={{ 
        backgroundColor: bgType === 'color' ? bgColor : undefined,
        backgroundImage: isImage ? \`url(\${bgImg})\` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}`
);

// Add the overlay inside outer div
verseCode = verseCode.replace(
  /\{!isImage && \(/,
  `{isImage && <div className="absolute inset-0 bg-black/50 z-0 pointer-events-none" />}\n      {!isImage && (`
);

// Remove background and card styling from inner div
verseCode = verseCode.replace(
  /className="flex-1 relative flex items-center justify-center p-6 sm:p-12 z-0 pointer-events-none w-full max-w-4xl mx-auto mt-16 sm:mt-20 mb-28 rounded-\[32px\] duo-modal !border-2 shadow-2xl overflow-hidden"/,
  'className="flex-1 relative flex items-center justify-center p-6 sm:p-12 z-0 pointer-events-none w-full max-w-4xl mx-auto mt-24 mb-32"'
);

// Remove inline styles from inner div
verseCode = verseCode.replace(
  /style=\{\{\s*'--dynamic-scale': dynamicScale,\s*backgroundColor: bgType === 'color' \? bgColor : undefined,\s*backgroundImage: isImage \? `url\(\$\{bgImg\}\)` : 'none',\s*backgroundSize: 'cover',\s*backgroundPosition: 'center',\s*\}\} as React\.CSSProperties\}/,
  'style={{ \'--dynamic-scale\': dynamicScale } as React.CSSProperties}'
);

// Remove the overlay from inner div
verseCode = verseCode.replace(
  /\{isImage && <div className="absolute inset-0 bg-black\/50 z-0 pointer-events-none" \/>\}/,
  ''
);

fs.writeFileSync(pathVerse, verseCode);

// Fix App.tsx to make VerseDisplay background render properly behind navbar
let pathApp = 'src/App.tsx';
let appCode = fs.readFileSync(pathApp, 'utf8');
appCode = appCode.replace(
  /<VerseDisplay/,
  '<VerseDisplay'
);

fs.writeFileSync(pathApp, appCode);

