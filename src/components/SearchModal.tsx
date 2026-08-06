<<<<<<< HEAD
import React from 'react';
=======
>>>>>>> 7becaadd69e4e155ea267758c4f52deac4eb57c9
import { useState, useEffect, useMemo } from 'react';
import { Search as SearchIcon, ArrowLeft, BookOpen, Book, ChevronDown, Loader2 } from 'lucide-react';
import { Verse } from '../types';
import { fetchFullBible, BibleBook } from '../bibleService';
import { getVerseTextInVersion } from '../bibleVersions';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVerse: (verse: Verse) => void;
  bibleVersion: string;
  onChangeBibleVersion?: (version: string) => void;
}

// Helper to remove accents for searching
const removeAccents = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function CustomSelect({ 
  label, 
  value, 
  options, 
  onChange, 
  disabled = false,
  placeholder = "Todos"
}: { 
  label: string, 
  value: string, 
  options: string[], 
  onChange: (v: string) => void,
  disabled?: boolean,
  placeholder?: string
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="flex flex-col gap-1 relative">
      <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-duo-text-light)] px-1">{label}</label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="duo-input px-3 py-2 text-left flex justify-between cursor-pointer"
      >
        <span className="truncate pr-2">{value || placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-[var(--color-duo-text-light)] shrink-0 pointer-events-none transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && !disabled && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-1 duo-modal shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-[var(--color-duo-border)] z-[70] max-h-60 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="overflow-y-auto p-1.5 flex flex-col gap-0.5" style={{ scrollbarWidth: 'thin' }}>
              <button
                type="button"
                onClick={() => { onChange(''); setIsOpen(false); }}
                className={`text-left px-3 py-2.5 rounded-[12px] text-sm font-medium transition-colors ${value === '' ? 'bg-amber-50 text-amber-700' : 'hover:bg-[var(--color-duo-bg-sec)] text-[var(--color-duo-text)]'}`}
              >
                {placeholder}
              </button>
              {options.map(opt => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => { onChange(opt); setIsOpen(false); }}
                  className={`text-left px-3 py-2.5 rounded-[12px] text-sm font-medium transition-colors ${value === opt ? 'bg-amber-50 text-amber-700' : 'hover:bg-[var(--color-duo-bg-sec)] text-[var(--color-duo-text)]'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const HighlightedText = ({ text, query }: { text: string; query: string }) => {
  if (!query.trim()) return <>{text}</>;
  
  const normalizedQuery = removeAccents(query.toLowerCase());
  const terms = normalizedQuery.split(/\s+/).filter(t => t.length > 0);
  if (terms.length === 0) return <>{text}</>;

  const parts = text.split(/([\s.,;:!?()'"-]+)/);
  
  return (
    <>
      {parts.map((part, i) => {
        const normalizedPart = removeAccents(part.toLowerCase());
        const isMatch = terms.some(term => {
          if (term.length <= 2) {
            return normalizedPart === term;
          }
          return normalizedPart.includes(term);
        });
        
        if (isMatch && part.trim().length > 0) {
          return <span key={i} className="text-[var(--color-duo-orange)] dark:text-amber-500 font-bold bg-amber-100/50 dark:bg-amber-900/30 rounded px-0.5">{part}</span>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
};

<<<<<<< HEAD
export const SearchModal = React.memo(function SearchModal({ isOpen, onClose, onSelectVerse, bibleVersion, onChangeBibleVersion }: SearchModalProps) {
=======
export function SearchModal({ isOpen, onClose, onSelectVerse, bibleVersion, onChangeBibleVersion }: SearchModalProps) {
>>>>>>> 7becaadd69e4e155ea267758c4f52deac4eb57c9
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const [results, setResults] = useState<Verse[]>([]);
  const [suggested, setSuggested] = useState<Verse[]>([]);

  const [selectedBook, setSelectedBook] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [selectedVerse, setSelectedVerse] = useState<string>('');

  const [fullBible, setFullBible] = useState<BibleBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && fullBible.length === 0) {
      setIsLoading(true);
      fetchFullBible().then(data => {
        setFullBible(data);
        setIsLoading(false);
      });
    }
  }, [isOpen, fullBible.length]);

  const books = useMemo(() => fullBible.map(b => b.name), [fullBible]);
  
  const chapters = useMemo(() => {
    if (!selectedBook) return [];
    const book = fullBible.find(b => b.name === selectedBook);
    if (!book) return [];
    return book.chapters.map((_, i) => (i + 1).toString());
  }, [selectedBook, fullBible]);

  const versesNum = useMemo(() => {
    if (!selectedBook || !selectedChapter) return [];
    const book = fullBible.find(b => b.name === selectedBook);
    if (!book) return [];
    const chIndex = parseInt(selectedChapter) - 1;
    const chVerses = book.chapters[chIndex];
    if (!chVerses) return [];
    return chVerses.map((_, i) => (i + 1).toString());
  }, [selectedBook, selectedChapter, fullBible]);

  useEffect(() => {
    if (isOpen && fullBible.length > 0) {
      setQuery('');
      setSelectedBook('');
      setSelectedChapter('');
      setSelectedVerse('');
      
      // Get a few random verses for suggestions
      const randomSuggests: Verse[] = [];
      for (let i = 0; i < 3; i++) {
        const randomBook = fullBible[Math.floor(Math.random() * fullBible.length)];
        const randomChapterIndex = Math.floor(Math.random() * randomBook.chapters.length);
        const randomChapter = randomBook.chapters[randomChapterIndex];
        const randomVerseIndex = Math.floor(Math.random() * randomChapter.length);
        const randomVerseText = randomChapter[randomVerseIndex];
        
        randomSuggests.push({
          id: `suggest-${i}`,
          reference: `${randomBook.name} ${randomChapterIndex + 1}:${randomVerseIndex + 1}`,
          text: getVerseTextInVersion(`${randomBook.name} ${randomChapterIndex + 1}:${randomVerseIndex + 1}`, bibleVersion, randomVerseText),
          originalText: randomVerseText,
          date: new Date().toISOString()
        });
      }
      setSuggested(randomSuggests);
    }
  }, [isOpen, fullBible, bibleVersion]);

  useEffect(() => {
    if (!fullBible.length) return;

    if (debouncedQuery.trim() || selectedBook) {
      let filtered: Verse[] = [];
      
      if (selectedBook && selectedChapter && selectedVerse) {
         // Exact verse selected
         const book = fullBible.find(b => b.name === selectedBook);
         if (book) {
            const cIndex = parseInt(selectedChapter) - 1;
            const vIndex = parseInt(selectedVerse) - 1;
            const text = book.chapters[cIndex]?.[vIndex];
            if (text) {
               filtered = [{
                 id: `search-${selectedBook}-${selectedChapter}-${selectedVerse}`,
                 reference: `${selectedBook} ${selectedChapter}:${selectedVerse}`,
                 text: getVerseTextInVersion(`${selectedBook} ${selectedChapter}:${selectedVerse}`, bibleVersion, text),
                 originalText: text,
                 date: new Date().toISOString()
               }];
            }
         }
      } else if (selectedBook && selectedChapter) {
         // Whole chapter selected (we map first 20 verses or match query)
         const book = fullBible.find(b => b.name === selectedBook);
         if (book) {
            const cIndex = parseInt(selectedChapter) - 1;
            const chapterVerses = book.chapters[cIndex] || [];
            filtered = chapterVerses.map((text, vIndex) => ({
                 id: `search-${selectedBook}-${selectedChapter}-${vIndex+1}`,
                 reference: `${selectedBook} ${selectedChapter}:${vIndex+1}`,
                 text: getVerseTextInVersion(`${selectedBook} ${selectedChapter}:${vIndex+1}`, bibleVersion, text),
                 originalText: text,
                 date: new Date().toISOString()
            }));
         }
      } else if (selectedBook) {
         // Book selected, let's just get the first chapter as default results if no query
         const book = fullBible.find(b => b.name === selectedBook);
         if (book) {
            const chapterVerses = book.chapters[0] || [];
            filtered = chapterVerses.map((text, vIndex) => ({
                 id: `search-${selectedBook}-1-${vIndex+1}`,
                 reference: `${selectedBook} 1:${vIndex+1}`,
                 text: getVerseTextInVersion(`${selectedBook} 1:${vIndex+1}`, bibleVersion, text),
                 originalText: text,
                 date: new Date().toISOString()
            }));
         }
      } else {
         // Search across the whole bible (expensive, we'll slice early or just filter linearly)
      }

      const q = debouncedQuery.trim();
      if (q) {
         const normalizedQuery = removeAccents(q.toLowerCase());
         const terms = normalizedQuery.split(/\s+/).filter(t => t.length > 0);
         
         if (selectedBook) {
            // Filter the existing filtered array
            filtered = filtered.filter(v => {
              const normalizedText = removeAccents(v.text.toLowerCase());
              return terms.every(term => normalizedText.includes(term));
            });
         } else {
            // Search whole bible! (Limit to 50 results max to avoid lag)
            const globalResults: Verse[] = [];
            for (const book of fullBible) {
               if (globalResults.length >= 30) break;
               
               
               for (let c = 0; c < book.chapters.length; c++) {
                 if (globalResults.length >= 30) break;
                 
                 for (let v = 0; v < book.chapters[c].length; v++) {
                   if (globalResults.length >= 30) break;
                   
                   const text = book.chapters[c][v];
                   const reference = `${book.name} ${c+1}:${v+1}`;
                   
                   const normalizedRef = removeAccents(reference.toLowerCase());
                   const normalizedText = removeAccents(text.toLowerCase());
                   
                   const matches = terms.every(term => normalizedRef.includes(term) || normalizedText.includes(term));
                   if (matches) {
                     globalResults.push({
                       id: `global-${book.abbrev}-${c}-${v}`,
                       reference,
                       text: getVerseTextInVersion(reference, bibleVersion, text),
                       originalText: text,
                       date: new Date().toISOString()
                     });
                   }
                 }
               }
            }
            filtered = globalResults;
         }
      }

      setResults(filtered.slice(0, 30));
    } else {
      setResults([]);
    }
  }, [debouncedQuery, selectedBook, selectedChapter, selectedVerse, fullBible, bibleVersion]);

  

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-[var(--color-duo-bg-sec)] z-50 flex flex-col">
      <header className="bg-[var(--color-duo-bg)] h-16 flex items-center px-4 border-b-2 border-[var(--color-duo-border)] gap-4 shadow-sm shrink-0">
        <button onClick={onClose} className="btn-ghost">
          <ArrowLeft className="w-6 h-6 text-[var(--color-duo-text)]" />
        </button>
        <div className="flex-1 relative">
<<<<<<< HEAD
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-duo-text-light)]" />
=======
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-duo-text-light)]" />
>>>>>>> 7becaadd69e4e155ea267758c4f52deac4eb57c9
          <input
            autoFocus
            type="text"
            placeholder="Buscar palavra-chave..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
<<<<<<< HEAD
            className="duo-input !pl-12 py-3"
=======
            className="duo-input pl-10 py-3"
>>>>>>> 7becaadd69e4e155ea267758c4f52deac4eb57c9
          />
        </div>
      </header>

      <div className="flex flex-col gap-3 px-4 py-3 bg-[var(--color-duo-bg)] border-b-2 border-[var(--color-duo-border)] shadow-sm shrink-0">
        <section className="duo-modal border border-[var(--color-duo-border)] shadow-sm overflow-hidden mb-2">
          <div className="px-5 py-3 bg-stone-50/50 dark:bg-zinc-900/50 border-b-2 border-[var(--color-duo-border)] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[var(--color-duo-orange)]" />
            <h2 className="text-[var(--color-duo-orange)] text-xs font-bold uppercase tracking-wider">Tradução da Bíblia</h2>
          </div>
          <div className="px-5 py-4">
            <p className="text-stone-900 dark:text-zinc-100 text-[15px] font-medium mb-3">Selecione a versão</p>
            <select 
              className="duo-input cursor-pointer appearance-none"
              value={bibleVersion || 'NVI'}
              onChange={(e) => onChangeBibleVersion && onChangeBibleVersion(e.target.value)}
            >
              <option value="NVI">Nova Versão Internacional (NVI)</option>
              <option value="ARC">Almeida Revista e Corrigida (ARC)</option>
              <option value="NTLH">Nova Tradução na Linguagem de Hoje (NTLH)</option>
              <option value="NAA">Nova Almeida Atualizada (NAA)</option>
            </select>
          </div>
        </section>
        
        <div className="grid grid-cols-3 gap-2">
          <CustomSelect
            label="Livro"
            value={selectedBook}
            options={books}
            onChange={(val) => {
              setSelectedBook(val);
              setSelectedChapter('');
              setSelectedVerse('');
            }}
          />
          <CustomSelect
            label="Capítulo"
            value={selectedChapter}
            options={chapters}
            disabled={!selectedBook}
            onChange={(val) => {
              setSelectedChapter(val);
              setSelectedVerse('');
            }}
          />
          <CustomSelect
            label="Verso"
            value={selectedVerse}
            options={versesNum}
            disabled={!selectedChapter}
            onChange={setSelectedVerse}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--color-duo-text-light)] bg-[var(--color-duo-bg-sec)]/80 z-10">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-amber-500" />
            <p className="text-sm font-medium text-[var(--color-duo-text-light)]">Baixando Bíblia NVI Completa...</p>
          </div>
        ) : !query.trim() && !selectedBook ? (
          <div className="mt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-duo-text-light)] mb-4 px-2">
              Sugestões para você
            </h3>
            <div className="space-y-3">
              {suggested.map((v, i) => (
                <div 
                  key={i}
                  onClick={() => { onSelectVerse(v); onClose(); }}
                  className="bg-white dark:bg-zinc-900 p-5 rounded-[20px] border border-[var(--color-duo-border)] shadow-sm cursor-pointer hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-[180ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.98] group"
                >
                  <p className="text-xs text-[var(--color-duo-orange)] font-bold uppercase tracking-widest mb-2 group-hover:text-amber-500">{v.reference}</p>
<<<<<<< HEAD
                  <p className="text-[15px] sm:text-base text-[var(--color-duo-text)] font-sans font-bold tracking-tight leading-relaxed line-clamp-2 custom-verse-text verse-size-sm">{v.text}</p>
=======
                  <p className="text-sm text-[var(--color-duo-text)] font-sans font-bold tracking-tight leading-relaxed line-clamp-2 custom-verse-text verse-size-sm">{v.text}</p>
>>>>>>> 7becaadd69e4e155ea267758c4f52deac4eb57c9
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-duo-text-light)] mb-4 px-2">
              {results.length > 0 ? `Encontrados (${results.length})` : 'Nenhum resultado'}
            </h3>
            {results.length === 0 ? (
              <div className="text-center text-[var(--color-duo-text-light)] py-12 px-4 flex flex-col items-center">
                <Book className="w-12 h-12 text-stone-300 mb-4" />
                <p className="text-sm">Não encontramos versículos com esses critérios.</p>
                <p className="text-xs mt-2 text-[var(--color-duo-text-light)]">Verifique a ortografia ou mude os filtros.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((v, i) => (
                  <div 
                    key={i}
                    onClick={() => { onSelectVerse(v); onClose(); }}
                    className="bg-white dark:bg-zinc-900 p-5 rounded-[20px] border border-[var(--color-duo-border)] shadow-sm cursor-pointer hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-[180ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.98] group"
                  >
                    <p className="text-xs text-[var(--color-duo-orange)] font-bold uppercase tracking-widest mb-2 group-hover:text-amber-500">{v.reference}</p>
<<<<<<< HEAD
                    <p className="text-[15px] sm:text-base text-[var(--color-duo-text)] font-sans font-bold tracking-tight leading-relaxed custom-verse-text verse-size-sm">
=======
                    <p className="text-sm text-[var(--color-duo-text)] font-sans font-bold tracking-tight leading-relaxed custom-verse-text verse-size-sm">
>>>>>>> 7becaadd69e4e155ea267758c4f52deac4eb57c9
                      <HighlightedText text={v.text} query={query} />
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
<<<<<<< HEAD
});
=======
}
>>>>>>> 7becaadd69e4e155ea267758c4f52deac4eb57c9

