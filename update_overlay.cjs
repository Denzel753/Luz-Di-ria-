const fs = require('fs');

let pathVerse = 'src/components/VerseDisplay.tsx';
let verse = fs.readFileSync(pathVerse, 'utf8');

// Update the overlay to be more subtle
verse = verse.replace(
  /bg-black\/40/g,
  'bg-black/20'
);

fs.writeFileSync(pathVerse, verse);
