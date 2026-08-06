const fs = require('fs');

let path = 'src/components/RandomVerseSelector.tsx';
let code = fs.readFileSync(path, 'utf8');

// Replace everything inside the main div return
code = code.replace(
  /<header className="bg-\[var\(--color-duo-bg\)\] backdrop-blur px-4 py-3 flex items-center border-b-2 border-\[var\(--color-duo-border\)\] z-10 shrink-0 gap-3">[\s\S]*?<\/h1>\s*<\/header>\s*<div className="flex-1 overflow-y-auto">\s*<div>/,
  `<div className="flex-1 overflow-y-auto relative pb-28">
        <div className="sticky top-0 z-20 bg-[var(--color-duo-bg)]/90 backdrop-blur-xl border-b-2 border-[var(--color-duo-border)] rounded-b-[24px] shadow-sm mb-4">
          <div className="max-w-md mx-auto w-full px-4 py-4 flex items-center gap-3">
            <button onClick={onClose} className="btn-icon p-2 -ml-2 w-10 h-10">
              <ArrowLeft className="w-5 h-5 text-[var(--color-duo-text-light)]" />
            </button>
            <h1 className="text-xl font-bold tracking-tight text-[var(--color-duo-text)] duo-title">Versículos por Tema</h1>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 flex flex-col gap-3 pb-8">`
);

// Replace the topics map
code = code.replace(
  /<div \s*key=\{topic\.id\}\s*onClick=\{\(\) => setSelectedTopic\(topic\.id\)\}\s*className=\{`flex items-center px-4 py-4 cursor-pointer border-b-2 border-\[var\(--color-duo-border\)\] transition-colors \$\{selectedTopic === topic\.id \? 'bg-\[var\(--color-duo-bg-sec\)\] border-\[var\(--color-duo-orange\)\]' : 'hover:bg-\[var\(--color-duo-bg-sec\)\]'\} `\}\s*>\s*<div className="w-12 flex justify-center">\s*\{iconMap\[topic\.icon\]\}\s*<\/div>\s*<div className="ml-2 flex-1">\s*<p className=\{`text-\[17px\] font-semibold tracking-tight \$\{\s*selectedTopic === topic\.id \? 'text-\[var\(--color-duo-text\)\]' : 'text-\[var\(--color-duo-text\)\]'\s*\}`\}>\s*\{topic\.name\}\s*<\/p>\s*<\/div>\s*<\/div>/g,
  `<div 
              key={topic.id}
              onClick={() => setSelectedTopic(topic.id)}
              className={\`flex items-center px-4 py-4 cursor-pointer border-2 border-b-4 rounded-[20px] transition-all active:border-b-2 active:translate-y-[2px] \${
                selectedTopic === topic.id 
                  ? 'bg-[#1cb0f6]/10 border-[#1cb0f6]' 
                  : 'bg-[var(--color-duo-bg-sec)] border-[var(--color-duo-border)] hover:bg-stone-100 dark:hover:bg-zinc-800'
              }\`}
            >
              <div className="w-12 flex justify-center">
                 {iconMap[topic.icon]}
              </div>
              
              <div className="ml-2 flex-1">
                <p className={\`text-[17px] font-bold tracking-tight \${
                  selectedTopic === topic.id ? 'text-[#1cb0f6]' : 'text-[var(--color-duo-text)]'
                }\`}>
                  {topic.name}
                </p>
              </div>
            </div>`
);

// Replace the bottom bar
code = code.replace(
  /<\/div>\s*<\/div>\s*<div className="bg-\[var\(--color-duo-bg\)\] border-t-2 border-\[var\(--color-duo-border\)\] p-4 flex gap-3 shrink-0">\s*<button\s*onClick=\{\(\) => \{\s*onShowVerse\(selectedTopic\);\s*onClose\(\);\s*\}\}\s*className="btn-primary w-full py-4 px-4 gap-2 text-sm"\s*>\s*<Check className="w-5 h-5" \/>\s*Mostrar Verso\s*<\/button>\s*<\/div>/,
  `</div>
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
      </div>`
);

fs.writeFileSync(path, code);
