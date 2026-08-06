
import { X, Lightbulb, Mail, Code, Info } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 md:p-6 backdrop-blur-sm animate-in fade-in duration-[320ms] ease-out">
      <div className="duo-modal w-full max-w-md flex flex-col animate-in zoom-in-95 duration-[320ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]">
        {/* Header */}
        <div className="bg-[var(--color-duo-bg-sec)]/80 px-4 py-3 flex items-center justify-between border-b-2 border-[var(--color-duo-border)]">
          <div className="flex items-center gap-2 text-[var(--color-duo-text-light)]">
            <Info className="w-5 h-5" />
            <h2 className="font-semibold uppercase tracking-wider text-sm">Sobre o Aplicativo</h2>
          </div>
          <button 
            onClick={onClose}
            className="btn-ghost"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center text-center overflow-y-auto max-h-[80vh]">
          <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-[#ffaf4d] to-[var(--color-duo-orange)] shadow-lg flex items-center justify-center relative overflow-hidden mb-4">
            <div className="absolute inset-0 bg-white/20 animate-pulse mix-blend-overlay"></div>
            <Lightbulb className="w-8 h-8 text-white relative z-10" strokeWidth={2.5} />
          </div>
          
          <h3 className="text-xl font-bold text-[var(--color-duo-text)] font-sans font-bold tracking-tight mb-1">Luz Diária</h3>
          <p className="text-xs font-medium text-[var(--color-duo-text-light)] uppercase tracking-widest mb-6">Versão 1.0.0</p>

          <p className="text-sm text-[var(--color-duo-text-light)]  mb-6 px-4 leading-relaxed font-sans font-bold tracking-tight">
            "Lâmpada para os meus pés é tua palavra, e luz para o meu caminho."<br/>
            <span className="text-[var(--color-duo-orange)] dark:text-amber-500 font-semibold not- text-xs mt-2 inline-block">— Salmos 119:105</span>
          </p>
          
          <div className="bg-[var(--color-duo-bg-sec)]/50 rounded-[20px] p-4 mb-8 border border-2 border-[var(--color-duo-border)] text-left">
            <p className="text-sm text-[var(--color-duo-text-light)] leading-relaxed">
              Esse aplicativo foi desenvolvido para aproximar mais ainda as pessoas de Jesus, nosso Criador e Salvador. Qualquer erro, dúvida ou sugestão, não hesite em mandar um e-mail para o desenvolvedor. Agradeço desde já e aproveite o aplicativo!
            </p>
          </div>

          <div className="w-full space-y-4">
            <div className="flex items-center justify-between p-4 bg-[var(--color-duo-bg-sec)]/50 rounded-[20px] border border-2 border-[var(--color-duo-border)]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-stone-200 dark:bg-zinc-700 rounded-[12px] text-[var(--color-duo-text-light)]">
                  <Code className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-medium text-stone-500 dark:text-zinc-500 uppercase tracking-wider">Desenvolvedor</p>
                  <p className="text-sm font-semibold text-stone-800 dark:text-zinc-200">Victor Jucá</p>
                </div>
              </div>
            </div>

            <a href="mailto:victorjuca@proton.me?subject=Contato%20-%20Luz%20Di%C3%A1ria" className="flex items-center justify-between p-4 bg-[var(--color-duo-bg-sec)]/50 rounded-[20px] border border-2 border-[var(--color-duo-border)] hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer w-full group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-stone-200 dark:bg-zinc-700 group-hover:bg-stone-300 dark:group-hover:bg-zinc-600 rounded-[12px] text-stone-600 dark:text-zinc-300 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-medium text-stone-500 dark:text-zinc-500 uppercase tracking-wider">Contato</p>
                  <p className="text-sm font-semibold text-stone-800 dark:text-zinc-200 break-all">victorjuca@proton.me</p>
                </div>
              </div>
            </a>
          </div>

          <div className="mt-8 pt-6 border-t-2 border-[var(--color-duo-border)] w-full text-xs text-[var(--color-duo-text-light)]">
            <p className="mb-2">Textos bíblicos utilizados das versões NVI, ARC, NAA e NTLH.</p>
            <p>© 2026. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
