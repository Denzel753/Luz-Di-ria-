import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Loader2, AlertCircle } from 'lucide-react';
import { Verse } from '../types';
import { emotionsVerses } from '../data/emotions';
import { getVerseTextInVersion } from '../bibleVersions';
import { getVerseByReference, fetchFullBible } from '../bibleService';

interface EmotionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVerse: (verse: Verse) => void;
  bibleVersion: string;
}

const emotionFallbacks: Record<string, { ref: string; text: string }> = {
  "Ansioso": { ref: "Filipenses 4:6", text: "Não andem ansiosos por coisa alguma, mas em tudo, pela oração e súplicas, e com ação de graças, apresentem seus pedidos a Deus." },
  "Triste": { ref: "Salmos 34:18", text: "O Senhor está perto dos que têm o coração quebrantado e salva os de espírito abatido." },
  "Alegre": { ref: "Salmos 118:24", text: "Este é o dia em que o Senhor agiu; alegremo-nos e exultemos neste dia." },
  "Buscando Paz": { ref: "João 14:27", text: "Deixo-lhes a paz; a minha paz lhes dou. Não a dou como o mundo a dá. Não se perturbem os seus corações, nem tenham medo." },
  "Fé": { ref: "Hebreus 11:1", text: "Ora, a fé é a certeza daquilo que esperamos e a prova das coisas que não vemos." },
  "Cansado": { ref: "Mateus 11:28", text: "Venham a mim, todos os que estão cansados e sobrecarregados, e eu lhes darei descanso." },
  "Grato": { ref: "1 Tessalonicenses 5:18", text: "Deem graças em todas as circunstâncias, pois esta é a vontade de Deus para vocês em Cristo Jesus." },
  "Medo": { ref: "Isaías 41:10", text: "Por isso não tema, pois estou com você; não tenha medo, pois sou o seu Deus. Eu o fortalecerei e o ajudarei; eu o segurarei com a minha mão direita vitoriosa." },
  "Amor": { ref: "1 João 4:8", text: "Quem não ama não conhece a Deus, porque Deus é amor." },
  "Sozinho": { ref: "Josué 1:9", text: "Não fui eu que ordenei a você? Seja forte e corajoso! Não se apavore nem desanime, pois o Senhor, o seu Deus, estará com você por onde você andar." }
};

export function EmotionsModal({ isOpen, onClose, onSelectVerse, bibleVersion }: EmotionsModalProps) {
  const [loadingEmotion, setLoadingEmotion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Pre-fetch Bible softly
  useEffect(() => {
    if (isOpen) {
      // Delay pre-fetch slightly to allow the entry animation to finish smoothly
      const timer = setTimeout(() => {
        fetchFullBible().catch(err => {
          console.warn("Soft pre-fetch failed, will retry on click:", err);
        });
      }, 400);
      setError(null);
      return () => clearTimeout(timer);
    } else {
      setLoadingEmotion(null);
      setError(null);
    }
  }, [isOpen]);

  const handleSelectEmotion = useCallback(async (emotionName: string) => {
    if (loadingEmotion) return; // Prevent multiple clicks

    const emotionData = emotionsVerses.find(e => e.emotion === emotionName);
    if (!emotionData) return;

    setLoadingEmotion(emotionName);
    setError(null);

    try {
      const references = emotionData.references;
      // Get a random reference
      const randomRef = references[Math.floor(Math.random() * references.length)];
      
      let originalText = await getVerseByReference(randomRef);
      let finalRef = randomRef;

      // Fallback logic
      if (!originalText) {
        const secondRef = references[Math.floor(Math.random() * references.length)];
        originalText = await getVerseByReference(secondRef);
        finalRef = secondRef;

        if (!originalText) {
          const fallback = emotionFallbacks[emotionName] || { ref: 'Salmos 23:1', text: 'O Senhor é o meu pastor; de nada terei falta.' };
          originalText = fallback.text;
          finalRef = fallback.ref;
        }
      }

      const newVerse: Verse = {
        id: `emo-${Date.now()}`,
        text: getVerseTextInVersion(finalRef, bibleVersion, originalText),
        originalText: originalText,
        reference: finalRef,
        date: new Date().toISOString()
      };

      // Add a slight delay for smoother UX
      setTimeout(() => {
        onSelectVerse(newVerse);
        onClose();
        setLoadingEmotion(null);
      }, 400);

    } catch (err) {
      console.error("Error processing emotion verse:", err);
      setError("Não conseguimos carregar o versículo. Tente novamente.");
      setLoadingEmotion(null);
    }
  }, [loadingEmotion, bibleVersion, onClose, onSelectVerse]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-stone-900/60 transition-opacity"
            onClick={() => !loadingEmotion && onClose()}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="duo-modal w-full max-w-md max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-5 border-b-2 border-[var(--color-duo-border)] flex justify-between items-center bg-[var(--color-duo-bg)] sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center shadow-sm">
                  <Heart className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[var(--color-duo-text)]">Como você está?</h2>
                  <p className="text-xs text-[var(--color-duo-text-light)]">Versículos para o seu momento</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                disabled={loadingEmotion !== null}
                className="btn-ghost disabled:opacity-50"
                aria-label="Fechar"
              >
                <X className="w-5 h-5 text-[var(--color-duo-text-light)]" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 overflow-y-auto">
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-[20px] flex items-center gap-3 text-red-600 dark:text-red-400"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-2 gap-3">
                {emotionsVerses.map((emotion) => {
                  const isLoading = loadingEmotion === emotion.emotion;
                  const isDisabled = loadingEmotion !== null && !isLoading;

                  return (
                    <motion.button
                      key={emotion.emotion}
                      whileHover={!isDisabled ? { scale: 1.02 } : {}}
                      whileTap={!isDisabled ? { scale: 0.98 } : {}}
                      onClick={() => handleSelectEmotion(emotion.emotion)}
                      disabled={loadingEmotion !== null}
                      className={`
                        relative flex flex-col items-center justify-center p-4 rounded-[20px] border border-transparent 
                        transition-all duration-[320ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]
                        ${emotion.color} 
                        ${isDisabled ? 'opacity-40 grayscale-[50%]' : 'hover:shadow-md'}
                        ${isLoading ? 'ring-2 ring-current ring-offset-2 dark:ring-offset-zinc-900' : ''}
                      `}
                    >
                      <AnimatePresence mode="wait">
                        {isLoading ? (
                          <motion.div
                            key="loading"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Loader2 className="w-8 h-8 mb-2 animate-spin opacity-80" />
                          </motion.div>
                        ) : (
                          <motion.span 
                            key="emoji"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-3xl mb-2 block"
                          >
                            {emotion.emoji}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      <span className="text-sm font-semibold whitespace-nowrap">{emotion.emotion}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-4 bg-[var(--color-duo-bg-sec)]/50 border-t-2 border-[var(--color-duo-border)] text-center sticky bottom-0">
              <p className="text-xs text-[var(--color-duo-text-light)]">
                Selecione uma emoção para receber uma palavra de conforto e inspiração.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
