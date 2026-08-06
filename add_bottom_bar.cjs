const fs = require('fs');
let path = 'src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

// The main container ends before <Drawer ... />
// We need to add padding bottom to main container and the tab bar.

code = code.replace(/<div className="flex-1 flex flex-col h-full w-full max-w-7xl mx-auto overflow-hidden relative">/g, 
  '<div className="flex-1 flex flex-col h-full w-full max-w-7xl mx-auto overflow-hidden relative pb-[70px]">');

const tabBarHtml = `      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[var(--color-duo-bg)] border-t-2 border-[var(--color-duo-border)] flex items-center justify-around py-2 px-4 z-40" style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}>
        <button onClick={() => setIsDrawerOpen(true)} className="flex flex-col items-center gap-1 p-2 text-[var(--color-duo-text-light)] hover:text-[var(--color-duo-orange)] transition-colors group">
          <Book className="w-7 h-7 group-hover:scale-110 transition-transform duration-[180ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
          <span className="text-[11px] font-black uppercase tracking-wider">Bíblia</span>
        </button>
        <button onClick={() => setIsSearchOpen(true)} className="flex flex-col items-center gap-1 p-2 text-[var(--color-duo-text-light)] hover:text-[var(--color-duo-orange)] transition-colors group">
          <Search className="w-7 h-7 group-hover:scale-110 transition-transform duration-[180ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
          <span className="text-[11px] font-black uppercase tracking-wider">Buscar</span>
        </button>
        <button onClick={() => setIsRandomSelectorOpen(true)} className="flex flex-col items-center gap-1 p-2 text-[var(--color-duo-text-light)] hover:text-[var(--color-duo-orange)] transition-colors group">
          <Shuffle className="w-7 h-7 group-hover:scale-110 transition-transform duration-[180ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
          <span className="text-[11px] font-black uppercase tracking-wider">Sortear</span>
        </button>
        <button onClick={() => setIsEmotionsOpen(true)} className="flex flex-col items-center gap-1 p-2 text-[var(--color-duo-text-light)] hover:text-[var(--color-duo-orange)] transition-colors group">
          <Heart className="w-7 h-7 group-hover:scale-110 transition-transform duration-[180ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
          <span className="text-[11px] font-black uppercase tracking-wider">Emoções</span>
        </button>
        <button onClick={() => setIsSettingsOpen(true)} className="flex flex-col items-center gap-1 p-2 text-[var(--color-duo-text-light)] hover:text-[var(--color-duo-orange)] transition-colors group">
          <SettingsIcon className="w-7 h-7 group-hover:scale-110 transition-transform duration-[180ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
          <span className="text-[11px] font-black uppercase tracking-wider">Perfil</span>
        </button>
      </nav>

      <Drawer`;

code = code.replace(/<Drawer/g, tabBarHtml);

// And we need to add 'Heart' to lucide-react imports if not there
if (!code.includes('Heart,')) {
  code = code.replace(/import {/, 'import { Heart,');
}

fs.writeFileSync(path, code);
