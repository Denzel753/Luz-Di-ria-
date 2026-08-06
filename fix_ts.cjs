const fs = require('fs');
let path = 'src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  /window\.AudioContext \|\| \(window\)\.webkitAudioContext/,
  'window.AudioContext || (window as any).webkitAudioContext'
);

fs.writeFileSync(path, code);
