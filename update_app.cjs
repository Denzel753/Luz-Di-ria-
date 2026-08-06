const fs = require('fs');
let path = 'src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

// Update imports
code = code.replace(/import { Heart, Search, Shuffle, Settings as SettingsIcon, BookOpen, Book, Check } from "lucide-react";/g,
  'import { Heart, Search, Shuffle, Settings as SettingsIcon, BookOpen, Book, Check, Star, Network, Youtube, Copy } from "lucide-react";');

// Add copied state
if (!code.includes('const [copied, setCopied] = useState(false);')) {
  code = code.replace(/const \[isReady, setIsReady\] = useState\(false\);/, 'const [isReady, setIsReady] = useState(false);\n  const [copied, setCopied] = useState(false);');
}

// Add handleCopy and handleOpenYoutube
const handles = `
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(\`\${currentVerse.text}\\n\\n— \${currentVerse.reference}\`);
      setCopied(true);
      showToast('success', 'Versículo copiado para a área de transferência!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleOpenYoutube = () => {
    if (!navigator.onLine) {
      showToast('error', 'Você está offline. Conecte-se à internet para buscar pregações no YouTube.');
      return;
    }
    window.open(\`https://www.youtube.com/results?search_query=\${encodeURIComponent(currentVerse.reference + ' pregação')}\`, '_blank');
  };
`;
if (!code.includes('const handleCopy = async () => {')) {
  code = code.replace(/const handleMenuClick = useCallback\(\(\) => setIsDrawerOpen\(true\), \[\]\);/, handles + '\n  const handleMenuClick = useCallback(() => setIsDrawerOpen(true), []);');
}

// Replace nav
const oldNavRegex = /<nav className="fixed bottom-0 left-0 right-0 bg-\[var\(--color-duo-bg\)\] border-t-2 border-\[var\(--color-duo-border\)\] flex items-center justify-around py-2 px-4 z-40" style=\{\{ paddingBottom: 'env\(safe-area-inset-bottom, 8px\)' \}\}>[\s\S]*?<\/nav>/;
const newNav = `<nav className="fixed bottom-0 left-0 right-0 bg-[var(--color-duo-bg)] border-t-2 border-[var(--color-duo-border)] flex items-center justify-around py-2 px-4 z-40" style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}>
        <button onClick={toggleFavorite} className="flex flex-col items-center gap-1 p-2 text-[var(--color-duo-text-light)] hover:text-[var(--color-duo-orange)] transition-colors group">
          <Star className={\`w-7 h-7 group-hover:scale-110 transition-all duration-[180ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] \${favoriteVerses.some((v) => v.id === currentVerse.id) ? 'fill-[var(--color-duo-orange)] text-[var(--color-duo-orange)]' : ''}\`} />
          <span className="text-[11px] font-black uppercase tracking-wider">Favorito</span>
        </button>
        <button onClick={handleSwapRandom} className="flex flex-col items-center gap-1 p-2 text-[var(--color-duo-text-light)] hover:text-[var(--color-duo-orange)] transition-colors group">
          <Shuffle className="w-7 h-7 group-hover:scale-110 transition-transform duration-[180ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
          <span className="text-[11px] font-black uppercase tracking-wider">Sortear</span>
        </button>
        <button onClick={handleOpenCrossReferences} className="flex flex-col items-center gap-1 p-2 text-[var(--color-duo-text-light)] hover:text-[var(--color-duo-orange)] transition-colors group">
          <Network className="w-7 h-7 group-hover:scale-110 transition-transform duration-[180ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
          <span className="text-[11px] font-black uppercase tracking-wider">Conexões</span>
        </button>
        <button onClick={handleOpenYoutube} className="flex flex-col items-center gap-1 p-2 text-[var(--color-duo-text-light)] hover:text-[var(--color-duo-orange)] transition-colors group">
          <Youtube className="w-7 h-7 group-hover:scale-110 transition-transform duration-[180ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
          <span className="text-[11px] font-black uppercase tracking-wider">Youtube</span>
        </button>
        <button onClick={handleCopy} className="flex flex-col items-center gap-1 p-2 text-[var(--color-duo-text-light)] hover:text-[var(--color-duo-orange)] transition-colors group">
          {copied ? <Check className="w-7 h-7 text-green-500" /> : <Copy className="w-7 h-7 group-hover:scale-110 transition-transform duration-[180ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" />}
          <span className="text-[11px] font-black uppercase tracking-wider">{copied ? 'Copiado' : 'Copiar'}</span>
        </button>
      </nav>`;

code = code.replace(oldNavRegex, newNav);

fs.writeFileSync(path, code);
