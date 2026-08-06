export interface BibleBook {
  abbrev: string;
  name: string;
  chapters: string[][];
}

let bibleCache: BibleBook[] | null = null;
let bibleFetchPromise: Promise<BibleBook[]> | null = null;

export const fetchFullBible = async (): Promise<BibleBook[]> => {
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
};

export const getVerseByReference = async (reference: string): Promise<string | null> => {
  try {
    const bible = await fetchFullBible();
    if (!bible || !Array.isArray(bible) || !bible.length) return null;

    if (!reference || typeof reference !== 'string') return null;

    // More flexible regex to handle variations in spacing or punctuation
    const match = reference.match(/^(.+?)\s+(\d+)[:\s.-]+(\d+)(?:[:\s.-]+(\d+))?$/);
    if (!match) return null;

    const bookName = match[1].trim().toLowerCase();
    const chapter = parseInt(match[2], 10);
    const startVerse = parseInt(match[3], 10);
    const endVerse = match[4] ? parseInt(match[4], 10) : startVerse;

    // Normalizing book names and abbreviations for better matching
    const book = bible.find(b => {
      if (!b) return false;
      const name = b.name ? String(b.name).toLowerCase() : '';
      const abbrev = b.abbrev ? String(b.abbrev).toLowerCase() : '';
      return (name && (name === bookName || name.includes(bookName) || bookName.includes(name))) || 
             (abbrev && abbrev === bookName);
    });

    if (!book || !book.chapters || !Array.isArray(book.chapters) || !book.chapters[chapter - 1]) return null;

    let text = '';
    const chapterData = book.chapters[chapter - 1];
    if (!Array.isArray(chapterData)) return null;
    
    for (let v = startVerse; v <= endVerse; v++) {
      if (chapterData[v - 1]) {
        text += (text ? ' ' : '') + chapterData[v - 1];
      }
    }

    return text.trim() || null;
  } catch (error) {
    console.error("Error in getVerseByReference:", error);
    return null;
  }
};
