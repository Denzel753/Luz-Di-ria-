# Notas de Implementação: Widget Nativo para Android

Para a compilação final deste aplicativo em um APK nativo (usando Android Studio ou frameworks como React Native / Capacitor), é estritamente necessário implementar um **Widget de Tela Inicial Nativo do Android (AppWidgetProvider)**.

A funcionalidade que foi solicitada baseia-se em um widget customizável que os usuários podem fixar na tela inicial (homescreen) do celular, da mesma forma que aplicativos nativos de versículos operam. 

## Requisitos do Widget Nativo

1. **Configuração Inicial do Widget (Configuration Activity):**
   Ao adicionar o widget na tela inicial, o Android deve abrir uma tela de configuração contendo as seguintes opções (conforme as capturas de tela originais):
   - **Mostrar ícone:** Checkbox para exibir ou esconder o ícone do aplicativo (Bíblia) no próprio widget.
   - **Mostrar aleatória:** Checkbox para alternar se o versículo muda de forma aleatória.
   - **Cor do texto:** Botão para abrir um seletor de cor e alterar a cor da fonte do versículo.
   - **Tamanho do texto:** Opção para ajustar o tamanho da fonte.
   - **Use aplicativo cor de fundo:** Checkbox para decidir se o widget usará o fundo definido pelo aplicativo (translúcido/imagem) ou uma cor escolhida.
   - **Mostrar (Fundo):** Checkbox e botão para selecionar a cor/imagem de fundo do widget.
   - Botões "Receptar" e "Concluído" para salvar as personalizações.

2. **Exibição do Widget:**
   - O widget deve exibir o "Versículo do Dia".
   - Deve mostrar a referência do versículo (ex: *Romanos 11:6*).
   - O design do widget (margens, fonte, ícone da Bíblia) deve reagir às configurações definidas pelo usuário na Configuration Activity.
   - O widget deve ter proporções flexíveis (ex: 4x1, 3x1).

3. **Atualização do Widget:**
   - O widget deve consumir os mesmos dados locais/remotos do aplicativo web (o versículo de cada dia).
   - O widget precisará de um `AlarmManager` ou `WorkManager` para atualizar o texto do versículo diariamente, mantendo consistência com o que está no aplicativo.

*Nota aos desenvolvedores:* Como a plataforma atual é um PWA / ambiente Web (React em navegador), esta integração direta com o Launcher do Android não é possível através de código puramente HTML/JS. Por isso, nenhuma "gambiarra" web (como baixar imagem imitando um widget) foi mantida no projeto para não poluir o código-fonte, a pedido do cliente.

## Permissões e Acessibilidade (AndroidManifest.xml)

Ao compilar o aplicativo para APK, lembre-se de adicionar as seguintes permissões no arquivo `AndroidManifest.xml` para que as funcionalidades configuradas no menu "Integração Android (APK)" funcionem corretamente:

```xml
<!-- Permissão de Notificações (Android 13+) -->
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

<!-- Permissão para Ignorar Otimização de Bateria -->
<uses-permission android:name="android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS" />

<!-- Permissão para Alarmes Exatos (necessário para agendar o versículo no horário exato) -->
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
<uses-permission android:name="android.permission.USE_EXACT_ALARM" /> <!-- Use com cautela de acordo com a política do Google Play -->

<!-- Permissão para Sobrepor Outros Apps (Tela Gigante do Versículo) -->
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />

<!-- Serviço de Acessibilidade (Para maior poder de notificação e atuação sobre a tela) -->
<!-- Necessita de declaração de serviço no Manifest -->
<uses-permission android:name="android.permission.BIND_ACCESSIBILITY_SERVICE" />
```
