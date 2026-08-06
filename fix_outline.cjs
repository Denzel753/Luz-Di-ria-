const fs = require('fs');

let pathCss = 'src/index.css';
let css = fs.readFileSync(pathCss, 'utf8');
if(!css.includes('.text-outline-dark')) {
  css += `\n
.text-outline-dark {
  text-shadow: 0 2px 12px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.7);
}
.text-outline-light {
  text-shadow: 0 2px 12px rgba(255,255,255,0.7), 0 1px 4px rgba(255,255,255,0.9);
}
`;
  fs.writeFileSync(pathCss, css);
}

let pathVerse = 'src/components/VerseDisplay.tsx';
let verse = fs.readFileSync(pathVerse, 'utf8');

verse = verse.replace(
  /const textStyle = isDark \? 'text-white' : 'text-\[var\(--color-duo-text\)\]';/,
  'const textStyle = isDark ? "text-white text-outline-dark" : "text-[var(--color-duo-text)] text-outline-light";'
);

verse = verse.replace(
  /const subTextStyle = isDark \? 'text-white\/80' : 'text-\[var\(--color-duo-text-light\)\]';/,
  'const subTextStyle = isDark ? "text-white/90 text-outline-dark" : "text-[var(--color-duo-text-light)] text-outline-light";'
);

fs.writeFileSync(pathVerse, verse);
