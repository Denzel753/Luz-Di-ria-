import { useState, useEffect } from 'react';
import { ArrowLeft, Network, Loader2, Book } from 'lucide-react';
import { getCrossReferences } from '../data';
import { getVerseByReference } from '../bibleService';
import { Verse } from '../types';

interface CrossReferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  verse: Verse;
  onSelectVerse: (verse: Verse) => void;
  bibleVersion: string;
}

let cachedExtensiveRefs: Record<string, string[]> | null = null;
let extensiveRefsFetchPromise: Promise<Record<string, string[]>> | null = null;

export function CrossReferencesModal({ isOpen, onClose, verse, onSelectVerse, bibleVersion }: CrossReferencesModalProps) {
  const [extensiveRefs, setExtensiveRefs] = useState<{reference: string, text: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const crossRefs = getCrossReferences(verse.reference, verse.text, bibleVersion);

  useEffect(() => {
    const fetchExtensiveRefs = async () => {
      try {
        setIsLoading(true);
        let refsToProcess: string[] = [];
        
        if (cachedExtensiveRefs) {
          refsToProcess = cachedExtensiveRefs[verse.reference] || [];
        } else {
          if (!extensiveRefsFetchPromise) {
            extensiveRefsFetchPromise = import('../../public/cross_references.json')
              .then(module => {
                const data = module.default || module;
                cachedExtensiveRefs = data;
                return data;
              });
          }
          try {
            const data = await extensiveRefsFetchPromise;
            cachedExtensiveRefs = data;
            refsToProcess = data[verse.reference] || [];
          } catch (err) {
            console.error('Failed to load extensive cross references', err);
            refsToProcess = [];
          }
        }
        
        if (refsToProcess.length > 0) {
          // Resolve texts for all references
          const resolved = await Promise.all(
            refsToProcess.slice(0, 30).map(async (ref) => { // Limit to 30 to prevent UI lag
              const text = await getVerseByReference(ref);
              return {
                reference: ref,
                text: text || "Texto não encontrado nesta versão da Bíblia."
              };
            })
          );
          setExtensiveRefs(resolved.filter(r => r.text !== "Texto não encontrado nesta versão da Bíblia."));
        } else {
          setExtensiveRefs([]);
        }
      } catch (error) {
        console.error("Failed to load extensive cross references", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExtensiveRefs();
  }, [verse.reference]);

  if (!isOpen) return null;

  // Filter out any overlap between extensive and basic cross-refs
  const extensiveRefStrings = new Set(extensiveRefs.map(r => r.reference));
  const filteredCrossRefs = crossRefs.filter(r => !extensiveRefStrings.has(r.reference));

  return (
    <div className="fixed inset-0 bg-[var(--color-duo-bg-sec)] z-50 flex flex-col">
      <header className="bg-[var(--color-duo-bg)] h-14 flex items-center px-4 border-b-2 border-[var(--color-duo-border)] gap-4 shadow-sm z-10 shrink-0">
        <button onClick={onClose} className="btn-ghost">
          <ArrowLeft className="w-5 h-5 text-[var(--color-duo-text)]" />
        </button>
        <h1 className="text-[19px] font-medium tracking-tight text-[var(--color-duo-text)]">Referências Cruzadas</h1>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6 p-5 bg-amber-50 dark:bg-amber-950/30 rounded-[20px] border border-amber-100 dark:border-amber-900/50">
          <p className="text-xs text-[var(--color-duo-orange)] font-bold uppercase tracking-widest mb-2">Versículo Atual</p>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-sm font-semibold text-[var(--color-duo-text)]">{verse.reference}</h2>
            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 rounded uppercase tracking-wider">NVI</span>
          </div>
          <p className="text-sm text-[var(--color-duo-text)] font-sans font-bold tracking-tight  line-clamp-3 custom-verse-text verse-size-sm">{verse.text}</p>
        </div>

        {/* Extensive Database References */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <Loader2 className="w-6 h-6 text-[var(--color-duo-orange)] animate-spin" />
            <p className="text-sm text-[var(--color-duo-text-light)]">Buscando referências na Bíblia...</p>
          </div>
        ) : (
          extensiveRefs.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-duo-text-light)] mb-4 flex items-center gap-2 px-2">
                <Book className="w-4 h-4" />
                Referências Diretas
              </h3>
              <div className="space-y-3">
                {extensiveRefs.map((v, i) => (
                  <div 
                    key={`ext-${i}`}
                    onClick={() => {
                      onSelectVerse({
                        id: `ext-${v.reference}`,
                        reference: v.reference,
                        text: v.text,
                        date: new Date().toISOString()
                      });
                      onClose();
                    }}
                    className="duo-card-interactive p-5 group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-xs text-[var(--color-duo-orange)] font-bold uppercase tracking-widest group-hover:text-amber-500">{v.reference}</p>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[var(--color-duo-border)] text-[var(--color-duo-text-light)] rounded uppercase tracking-wider">NVI</span>
                    </div>
                    <p className="text-sm text-[var(--color-duo-text)] font-sans font-bold tracking-tight leading-relaxed custom-verse-text verse-size-sm">{v.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {filteredCrossRefs.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-duo-text-light)] mb-4 flex items-center gap-2 px-2">
              <Network className="w-4 h-4" />
              Temas Semelhantes
            </h3>
            <div className="space-y-3">
              {filteredCrossRefs.map((v, i) => (
                <div 
                  key={`sim-${i}`}
                  onClick={() => {
                    onSelectVerse({
                      id: `sim-${v.reference}`,
                      reference: v.reference,
                      text: v.text,
                      date: new Date().toISOString()
                    });
                    onClose();
                  }}
                  className="duo-card-interactive p-5 group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-xs text-[var(--color-duo-orange)] font-bold uppercase tracking-widest group-hover:text-amber-500">{v.reference}</p>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[var(--color-duo-border)] text-[var(--color-duo-text-light)] rounded uppercase tracking-wider">NVI</span>
                  </div>
                  <p className="text-sm text-[var(--color-duo-text)] font-sans font-bold tracking-tight leading-relaxed custom-verse-text verse-size-sm">{v.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isLoading && extensiveRefs.length === 0 && filteredCrossRefs.length === 0 && (
          <div className="text-center text-[var(--color-duo-text-light)] py-12 text-sm px-4">
            Não encontramos referências para este versículo.
          </div>
        )}
      </div>
    </div>
  );
}
