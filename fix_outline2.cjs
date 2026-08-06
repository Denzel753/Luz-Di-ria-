const fs = require('fs');

let pathCss = 'src/index.css';
let css = fs.readFileSync(pathCss, 'utf8');

css = css.replace(
  /\.text-outline-dark \{[^}]+\}/,
  `.text-outline-dark {
  text-shadow: 0 1px 4px rgba(0,0,0,0.8), 0 2px 12px rgba(0,0,0,0.6), 0 0 30px rgba(0,0,0,0.5);
}`
);

css = css.replace(
  /\.text-outline-light \{[^}]+\}/,
  `.text-outline-light {
  text-shadow: 0 1px 4px rgba(255,255,255,1), 0 2px 12px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.6);
}`
);

fs.writeFileSync(pathCss, css);
