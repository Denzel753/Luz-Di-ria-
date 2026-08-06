const fs = require('fs');
let content = fs.readFileSync('public/nvi.json', 'utf8');

// Strip BOM
if (content.charCodeAt(0) === 0xFEFF) {
  content = content.slice(1);
}

let openBraces = 0;
let openBrackets = 0;
let inString = false;
let escape = false;

for (let i = 0; i < content.length; i++) {
  const char = content[i];
  if (escape) {
    escape = false;
    continue;
  }
  if (char === '\\') {
    escape = true;
    continue;
  }
  if (char === '"') {
    inString = !inString;
    continue;
  }
  
  if (!inString) {
    if (char === '{') openBraces++;
    if (char === '}') openBraces--;
    if (char === '[') openBrackets++;
    if (char === ']') openBrackets--;
  }
}

// Simple fix for a truncated JSON array of objects
const lastValidObject = content.lastIndexOf('}}');
// This might be hard. Let's just use a simple regex to find the last valid string in the chapter array and close it.
// The structure is: [{"abbrev": "gn", "chapters": [ ["verse1", "verse2"], ["verse1", "verse2"] ]}, {"abbrev": ...}]
const lastBracket = content.lastIndexOf('],');
const lastBrace = content.lastIndexOf('},');

let safeCut = Math.max(lastBracket, lastBrace);
if (safeCut > 0) {
   let newContent = content.substring(0, safeCut);
   // Close it properly
   // Count open [ and {
   let opens = 0;
   // Let's just append "]]}]" to be safe. Actually, better: just parse with a relaxed parser.
}
