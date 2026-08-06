const fs = require('fs');
let content = fs.readFileSync('src/components/Drawer.tsx', 'utf8');

const oldTag = `<span className="text-[9px] bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 px-1.5 py-0.5 rounded-sm">FRASE</span>`;
const newTag = `<span className="text-[9px] bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400 px-1.5 py-0.5 rounded-sm">FRASE</span>`;

content = content.replace(new RegExp(oldTag.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&'), 'g'), newTag);

fs.writeFileSync('src/components/Drawer.tsx', content);
console.log("Updated Drawer styles");
