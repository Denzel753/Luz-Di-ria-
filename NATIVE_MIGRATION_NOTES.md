# Notas de Migração para APK (Android/iOS)

Este documento lista as funcionalidades que foram discutidas e configuradas no aplicativo, mas que **não funcionam 100% no ambiente Web/PWA** devido a restrições de segurança e otimização dos navegadores. 

Quando você for compilar este aplicativo para um APK nativo (usando Capacitor, Cordova, React Native ou similares), você precisará implementar os plugins nativos equivalentes para que as seguintes funções operem corretamente:

## 1. Notificações e Atualizações em Segundo Plano (Background)
* **O que acontece na Web:** O navegador pausa ou desacelera contadores (`setInterval`) quando o aplicativo está minimizado ou a tela do celular está desligada. As notificações podem não chegar no horário exato se o app estiver fechado.
* **O que fazer no APK:** Utilizar uma biblioteca de agendamento nativo em segundo plano (como *Background Tasks*, *WorkManager* ou *AlarmManager*) e plugins de Notificações Locais (ex: `@capacitor/local-notifications`) para garantir que os versículos cheguem no horário programado mesmo com o app fechado.

## 2. Ligar/Acender a Tela (Wake Device)
* **O que acontece na Web:** Navegadores web não têm permissão para acordar um dispositivo que está com a tela desligada (sleep mode).
* **O que fazer no APK:** Adicionar a permissão `WAKE_LOCK` no `AndroidManifest.xml` e utilizar um plugin que permita acordar o dispositivo quando uma notificação chegar (ex: plugins de *Keep Awake* ou recursos de notificações nativas que acendem a tela).

## 3. Piscar o LED (Flash da Câmera)
* **O que acontece na Web:** A API Web não permite piscar o LED do celular como forma de notificação de forma simples. A gambiarra visual (piscar a tela do app) só funciona se o app estiver aberto.
* **O que fazer no APK:** Adicionar a permissão `CAMERA` e `FLASHLIGHT` e utilizar um plugin nativo de vibração/LED acoplado ao canal de notificações do Android.

## 4. Vibração em Segundo Plano
* **O que acontece na Web:** A API `navigator.vibrate` geralmente só funciona se o usuário estiver ativamente interagindo com a página (com o app aberto na tela).
* **O que fazer no APK:** Ao criar canais de notificação nativos (Notification Channels no Android 8.0+), você deve configurar a vibração diretamente no canal da notificação local para que o celular vibre quando receber o versículo com a tela apagada.

## 5. Tocar Áudios em Segundo Plano
* **O que acontece na Web:** Navegadores bloqueiam a reprodução automática de áudio (Autoplay Policy) se o usuário não tiver interagido com a página recentemente.
* **O que fazer no APK:** Configurar o som personalizado diretamente no canal de notificação nativa (colocando o arquivo de áudio nas pastas `res/raw` do Android) para que o sistema operacional toque o som nativamente sem depender do WebView do aplicativo.

## 6. Permissões Especiais de Sistema (Android)
Quando o aplicativo for compilado para APK nativo, será necessário solicitar permissões avançadas diretamente ao sistema operacional que a Web não suporta. Você precisará implementar fluxos que peçam ao usuário para habilitar:

* **Sobreposição a outros aplicativos (Draw over other apps):** Essencial para o recurso do "Pop-up Gigante" aparecer mesmo que o usuário esteja usando outro aplicativo.
* **Ignorar Otimizações de Bateria (Disable Battery Optimization):** Crucial para garantir que o sistema (especialmente MIUI, Samsung, etc.) não mate o aplicativo em segundo plano, garantindo que os versículos cheguem sempre no horário correto.
* **Permissão de Notificações (Post Notifications):** Requisito do Android 13+ para exibir qualquer tipo de notificação push ou local.
* **Acessibilidade (Accessibility Services):** Se você quiser forçar a sobreposição ou capturar eventos muito específicos de sistema (opcional, usar com cuidado pois o Google Play é rígido com essa permissão).
* **Luz de Notificação Nativa:** Para o controle real do LED de notificação do aparelho, a permissão e a configuração do "Notification Channel" nativo deve ter a flag de luzes (Lights) habilitada junto com a cor desejada.
