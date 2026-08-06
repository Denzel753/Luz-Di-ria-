import { useState } from 'react';
import { ArrowLeft, Book, Sun, Star, HeartHandshake, Coins, Users, RefreshCw, Heart, Flame, Shield, User, BookOpen, BookText, ScrollText, TrendingUp, CloudRain, HandHeart, Eye, Check } from 'lucide-react';
import { TOPICS } from '../data';

const iconMap: Record<string, React.ReactNode> = {
  Book: <Book className="w-7 h-7 text-[var(--color-duo-text)] stroke-[1.5]" />,
  Sun: <Sun className="w-7 h-7 text-yellow-600 stroke-[1.5]" />,
  Star: <Star className="w-7 h-7 text-amber-500 stroke-[1.5]" />,
  HeartHandshake: <HeartHandshake className="w-7 h-7 text-[var(--color-duo-text)] stroke-[1.5]" />,
  Coins: <Coins className="w-7 h-7 text-green-600 stroke-[1.5]" />,
  Users: <Users className="w-7 h-7 text-green-500 stroke-[1.5]" />,
  RefreshCw: <RefreshCw className="w-7 h-7 text-[var(--color-duo-text)] stroke-[1.5]" />,
  Heart: <Heart className="w-7 h-7 text-red-500 stroke-[1.5]" />,
  Flame: <Flame className="w-7 h-7 text-red-600 stroke-[1.5]" />,
  Shield: <Shield className="w-7 h-7 text-[var(--color-duo-text)] stroke-[1.5]" />,
  User: <User className="w-7 h-7 text-[var(--color-duo-text)] stroke-[1.5]" />,
  BookOpen: <BookOpen className="w-7 h-7 text-orange-400 stroke-[1.5]" />,
  BookText: <BookText className="w-7 h-7 text-[var(--color-duo-orange)] stroke-[1.5]" />,
  ScrollText: <ScrollText className="w-7 h-7 text-[var(--color-duo-text)] stroke-[1.5]" />,
  TrendingUp: <TrendingUp className="w-7 h-7 text-green-600 stroke-[1.5]" />,
  CloudRain: <CloudRain className="w-7 h-7 text-[var(--color-duo-text)] stroke-[1.5]" />,
  HandHeart: <HandHeart className="w-7 h-7 text-blue-400 stroke-[1.5]" />,
  Eye: <Eye className="w-7 h-7 text-purple-400 stroke-[1.5]" />,
};

interface RandomVerseSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onShowVerse: (topicId: string) => void;
}

export function RandomVerseSelector({ isOpen, onClose, onShowVerse }: RandomVerseSelectorProps) {
  const [selectedTopic, setSelectedTopic] = useState('all');

  

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-[var(--color-duo-bg)] z-50 flex flex-col animate-in slide-in-from-bottom-full duration-[320ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]">
      <div className="flex-1 overflow-y-auto relative pb-28">
        <div className="sticky top-0 z-20 bg-[var(--color-duo-bg)]/90 backdrop-blur-xl border-b-2 border-[var(--color-duo-border)] rounded-b-[24px] shadow-sm mb-4">
          <div className="max-w-md mx-auto w-full px-4 py-4 flex items-center gap-3">
            <button onClick={onClose} className="btn-icon p-2 -ml-2 w-10 h-10">
              <ArrowLeft className="w-5 h-5 text-[var(--color-duo-text-light)]" />
            </button>
            <h1 className="text-xl font-bold tracking-tight text-[var(--color-duo-text)] duo-title">Versículos por Tema</h1>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 flex flex-col gap-3 pb-8">
          {TOPICS.map((topic) => (
            <div 
              key={topic.id}
              onClick={() => setSelectedTopic(topic.id)}
              className={`flex items-center px-4 py-4 cursor-pointer border-b-2 border-[var(--color-duo-border)] transition-colors ${selectedTopic === topic.id ? 'bg-[var(--color-duo-bg-sec)] border-[var(--color-duo-orange)]' : 'hover:bg-[var(--color-duo-bg-sec)]'}`}
            >
              <div className="w-12 flex justify-center">
                 {iconMap[topic.icon]}
              </div>
              
              <div className="ml-2 flex-1">
                <p className={`text-[17px] font-semibold tracking-tight ${
                  selectedTopic === topic.id ? 'text-[var(--color-duo-text)]' : 'text-[var(--color-duo-text)]'
                }`}>
                  {topic.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[var(--color-duo-bg)] via-[var(--color-duo-bg)] to-transparent pt-12 pb-6 px-4 z-10 pointer-events-none">
        <div className="max-w-md w-full mx-auto pointer-events-auto">
          <button 
            onClick={() => {
              onShowVerse(selectedTopic);
              onClose();
            }}
            className="w-full py-4 px-4 gap-2 text-lg bg-[#58cc02] hover:bg-[#46a302] text-white font-bold flex items-center justify-center transition-all outline-none select-none border-b-4 border-[#46a302] active:border-b-0 active:translate-y-[4px] rounded-full shadow-lg"
          >
            <Check className="w-6 h-6" />
            CONCLUIR
          </button>
        </div>
      </div>
    </div>
  );
}
