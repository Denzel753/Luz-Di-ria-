const fs = require('fs');
let content = fs.readFileSync('src/bibleService.ts', 'utf8');

// replace the fetchFullBible function
content = content.replace(/export const fetchFullBible = async[\s\S]*?return bibleFetchPromise;\n\};/, `export const fetchFullBible = async (retryCount = 0): Promise<BibleBook[]> => {
  if (bibleCache) return bibleCache;
  if (bibleFetchPromise) return bibleFetchPromise;
  
  bibleFetchPromise = (async () => {
    try {
      const module = await import('../public/nvi.json');
      bibleCache = module.default || module;
      return bibleCache;
    } catch (err) {
      console.error("Local import failed:", err);
      // Fallback
      return [];
    }
  })();
  return bibleFetchPromise;
};`);

fs.writeFileSync('src/bibleService.ts', content);
console.log('Patched bibleService to use dynamic import');
