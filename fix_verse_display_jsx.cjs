const fs = require('fs');
let path = 'src/components/VerseDisplay.tsx';
let code = fs.readFileSync(path, 'utf8');

// I accidentally left `</div>` at line 131. The sub-toolbar was deleted but there was no extra </div> needed to be left. Wait, the original was:
/*
      )}
      
      {/* Sub-toolbar * /}
      <div className="flex items-center justify-between px-6 py-4 bg-transparent z-10 capture-ignore">
        ...
      </div>
      
      {/* Verse Content * /}
*/
// The replace regex was:
// const subToolbarRegex = /\{\/\* Sub-toolbar \*\/\}\n\s*<div className="flex items-center justify-between px-6 py-4 bg-transparent z-10 capture-ignore">[\s\S]*?<\/div>/;
// This removed the sub-toolbar completely. So where did `</div>` at 131 come from?
