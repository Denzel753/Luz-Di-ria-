const fs = require('fs');
let path = 'src/index.css';
let code = fs.readFileSync(path, 'utf8');

const newComponents = `
@layer components {
  .btn-ghost {
    @apply bg-transparent text-[var(--color-duo-text-light)] flex items-center justify-center transition-all outline-none select-none p-2 hover:bg-[var(--color-duo-bg-sec)];
    border-radius: 9999px;
  }
  .btn-ghost:active {
    transform: scale(0.95);
  }
  .btn-primary {
    @apply bg-[var(--color-duo-orange)] text-white font-bold flex items-center justify-center transition-all outline-none select-none shadow-md hover:shadow-lg hover:-translate-y-0.5;
    border-radius: 9999px;
  }
  .btn-primary:active {
    transform: translateY(1px);
    box-shadow: none;
  }
  .btn-primary:disabled {
    @apply bg-stone-300 dark:bg-zinc-700 text-stone-500 dark:text-zinc-500 cursor-not-allowed shadow-none transform-none;
  }
  .btn-secondary {
    @apply bg-transparent text-[var(--color-duo-orange)] font-bold flex items-center justify-center transition-all outline-none select-none border-2 border-[var(--color-duo-border)] hover:bg-[var(--color-duo-bg-sec)];
    border-radius: 9999px;
  }
  .btn-secondary:active {
    transform: translateY(1px);
  }
  .btn-outline {
    @apply bg-[var(--color-duo-bg)] text-[var(--color-duo-text)] font-bold flex items-center justify-center transition-all outline-none select-none border-2 border-[var(--color-duo-border)] hover:bg-[var(--color-duo-bg-sec)];
    border-radius: 9999px;
  }
  .btn-outline:active {
    transform: translateY(1px);
  }
  .btn-icon {
    @apply bg-[var(--color-duo-bg)] text-[var(--color-duo-text-light)] flex items-center justify-center transition-all outline-none select-none border border-[var(--color-duo-border)] shadow-sm hover:shadow-md hover:text-[var(--color-duo-orange)] hover:-translate-y-0.5;
    border-radius: 9999px;
  }
  .btn-icon:active {
    transform: translateY(1px);
    box-shadow: none;
  }
  .duo-card {
    @apply bg-[var(--color-duo-bg)] transition-all shadow-sm border border-[var(--color-duo-border)];
    border-radius: 24px;
  }
  .duo-card-interactive {
    @apply bg-[var(--color-duo-bg)] transition-all cursor-pointer select-none shadow-sm border border-[var(--color-duo-border)] hover:shadow-md hover:-translate-y-0.5 hover:border-[var(--color-duo-orange)]/30;
    border-radius: 24px;
  }
  .duo-card-interactive:active {
    transform: translateY(1px);
    box-shadow: none;
  }
  .duo-modal {
    @apply bg-white/95 dark:bg-[#111111]/95 backdrop-blur-xl shadow-2xl;
    border-radius: 32px;
    border: 1px solid var(--color-duo-border);
  }
  .duo-badge {
    @apply font-bold uppercase;
    border-radius: 12px;
    border: 1px solid var(--color-duo-border);
  }
  .duo-title {
    @apply font-black tracking-tight text-[var(--color-duo-text)];
  }
}
/* Custom progress bar styles */
.duo-progress-container {
  @apply w-full bg-[var(--color-duo-border)] rounded-full h-3 overflow-hidden relative;
}
.duo-progress-bar {
  @apply bg-[var(--color-duo-orange)] h-full rounded-full transition-all duration-300 ease-out;
}
.duo-progress-highlight {
  @apply absolute top-0 left-2 right-2 h-1 bg-white/30 rounded-full pointer-events-none;
}
/* Base input */
.duo-input {
  @apply bg-[var(--color-duo-bg-sec)] border border-[var(--color-duo-border)] rounded-full px-5 py-3 text-[var(--color-duo-text)] w-full outline-none transition-all;
}
.duo-input:focus {
  @apply border-[var(--color-duo-orange)] bg-[var(--color-duo-bg)] shadow-sm ring-2 ring-[var(--color-duo-orange)]/20;
}
`;

code = code.replace(/@layer components \{[\s\S]*\}\s*\/\* Custom progress bar styles \*\/[\s\S]*?\.duo-input:focus \{[\s\S]*?\}/, newComponents.trim());

fs.writeFileSync(path, code);
