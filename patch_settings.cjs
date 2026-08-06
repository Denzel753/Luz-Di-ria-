const fs = require('fs');
let code = fs.readFileSync('src/components/Settings.tsx', 'utf8');

const toggleCode = `
              <div className="py-4 flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 dark:border-zinc-800 cursor-pointer group" onClick={() => handleToggleNotification(!settings.dailyNotification)}>
                <div className="flex items-center gap-3 flex-1">
                  <Bell className="w-5 h-5 text-stone-400 dark:text-zinc-500 shrink-0" />
                  <div>
                    <p className="text-stone-900 dark:text-zinc-100 text-[15px] font-medium group-hover:text-amber-600 transition-colors">Notificações Diárias</p>
                    <p className="text-stone-500 dark:text-zinc-400 text-[13px] mt-0.5">Status: {permissionStatus === 'granted' ? 'Ativo' : permissionStatus === 'denied' ? 'Bloqueado' : 'Não Solicitado'}</p>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  className="w-5 h-5 text-amber-600 rounded border-stone-400 dark:border-zinc-600 focus:ring-amber-500 accent-amber-600 cursor-pointer shrink-0"
                  checked={settings.dailyNotification}
                  onChange={(e) => handleToggleNotification(e.target.checked)}
                />
              </div>
`;

code = code.replace('<div className="px-5">', '<div className="px-5">\n' + toggleCode);
fs.writeFileSync('src/components/Settings.tsx', code);
