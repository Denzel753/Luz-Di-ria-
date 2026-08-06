const fs = require('fs');

let path = 'src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

if (!code.includes('import { BottomNav } from "./components/BottomNav";')) {
  code = code.replace(
    /import \{ Header \} from "\.\/components\/Header";/,
    'import { Header } from "./components/Header";\nimport { BottomNav } from "./components/BottomNav";'
  );
}

const navRegex = /<nav className="fixed bottom-6 left-1\/2 -translate-x-1\/2 w-\[95%\] max-w-md bg-white\/80 dark:bg-\[#1c1c1e\]\/80 backdrop-blur-2xl border border-white\/20 dark:border-white\/10 rounded-\[32px\] shadow-xl flex items-center justify-around py-2 px-2 z-40">[\s\S]*?<\/nav>/;

code = code.replace(navRegex, `
      <BottomNav 
        isFavorite={favoriteVerses.some((v) => v.id === currentVerse.id)}
        onToggleFavorite={toggleFavorite}
        onSwapRandom={handleSwapRandom}
        onOpenCrossReferences={handleOpenCrossReferences}
        onOpenYoutube={handleOpenYoutube}
        onCopy={handleCopy}
        copied={copied}
      />`);

fs.writeFileSync(path, code);
