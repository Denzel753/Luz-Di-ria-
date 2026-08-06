const fs = require('fs');
let pathApp = 'src/App.tsx';
let appCode = fs.readFileSync(pathApp, 'utf8');

// Add import
appCode = appCode.replace(
  /import \{ Header \} from '\.\/components\/Header';/,
  'import { Header } from \'./components/Header\';\nimport { StreakModal } from \'./components/StreakModal\';'
);

// Add state
appCode = appCode.replace(
  /const \[isFlashing, setIsFlashing\] = useState\(false\);/,
  'const [isFlashing, setIsFlashing] = useState(false);\n  const [showStreakModal, setShowStreakModal] = useState(false);\n  const [streakDays, setStreakDays] = useState(12);'
);

// Pass prop to Header
appCode = appCode.replace(
  /<Header/,
  '<Header\n        onStreakClick={() => setShowStreakModal(true)}'
);

// Add StreakModal below Header or near it
appCode = appCode.replace(
  /<Drawer/,
  '<StreakModal\n        isOpen={showStreakModal}\n        onClose={() => setShowStreakModal(false)}\n        streak={streakDays}\n      />\n      <Drawer'
);

fs.writeFileSync(pathApp, appCode);
