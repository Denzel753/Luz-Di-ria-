const fs = require('fs');

let pathApp = 'src/App.tsx';
let appCode = fs.readFileSync(pathApp, 'utf8');

// We want to add a useEffect to handle daily streak logic.
// Find the existing streak state
appCode = appCode.replace(
  /const \[streakDays, setStreakDays\] = useState\(\(\) => \{[^}]*\} catch \(e\) \{\}\s*return 1;\s*\}\);/,
  `const [streakDays, setStreakDays] = useState(() => {
    try {
      const saved = localStorage.getItem("streakDaysData");
      return saved ? parseInt(saved, 10) : 1;
    } catch (e) {}
    return 1;
  });
  
  useEffect(() => {
    const today = new Date().toDateString();
    const lastOpened = localStorage.getItem("lastOpenedDate");
    
    if (lastOpened !== today) {
      if (lastOpened) {
        const lastDate = new Date(lastOpened);
        const currentDate = new Date(today);
        const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        if (diffDays === 1) {
          // Came back the next day!
          setStreakDays(prev => prev + 1);
        } else if (diffDays > 1) {
          // Missed a day
          setStreakDays(1);
        }
      }
      localStorage.setItem("lastOpenedDate", today);
    }
  }, []);
`
);

fs.writeFileSync(pathApp, appCode);
