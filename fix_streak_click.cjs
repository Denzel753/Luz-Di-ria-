const fs = require('fs');
let path = 'src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

if (!code.includes('const openStreakModal = useCallback')) {
  code = code.replace(
    /const closeStreakModal = useCallback/,
    "const openStreakModal = useCallback(() => setShowStreakModal(true), []);\n  const closeStreakModal = useCallback"
  );
}

code = code.replace(
  /onStreakClick=\{\(\) => setShowStreakModal\(true\)\}/,
  "onStreakClick={openStreakModal}"
);

fs.writeFileSync(path, code);
