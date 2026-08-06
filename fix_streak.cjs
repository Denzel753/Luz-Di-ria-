const fs = require('fs');

let pathHeader = 'src/components/Header.tsx';
let headerCode = fs.readFileSync(pathHeader, 'utf8');

headerCode = headerCode.replace(
  /interface HeaderProps \{/,
  'interface HeaderProps {\n  streak: number;'
);
headerCode = headerCode.replace(
  /export const Header = React\.memo\(function Header\(\{ onStreakClick/,
  'export const Header = React.memo(function Header({ streak, onStreakClick'
);
headerCode = headerCode.replace(
  /<span className="text-lg font-bold text-\[var\(--color-duo-orange\)\]">12<\/span>/,
  '<span className="text-lg font-bold text-[var(--color-duo-orange)]">{streak}</span>'
);
fs.writeFileSync(pathHeader, headerCode);

let pathApp = 'src/App.tsx';
let appCode = fs.readFileSync(pathApp, 'utf8');
appCode = appCode.replace(
  /<Header\n        onStreakClick=\{/,
  '<Header\n        streak={streakDays}\n        onStreakClick={'
);
fs.writeFileSync(pathApp, appCode);

