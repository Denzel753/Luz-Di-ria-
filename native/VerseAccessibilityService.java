package com.luzdiaria.versiculos;

import android.accessibilityservice.AccessibilityService;
import android.view.accessibility.AccessibilityEvent;

/**
 * Serviço de Acessibilidade "Luz Diária".
 *
 * Ao ser habilitado nas Configurações de Acessibilidade, dá ao app poder
 * de observação do sistema (ex: detectar quando o telefone está desbloqueado
 * ou quando outros apps estão abertos), usado para melhorar a entrega do
 * versículo diário.
 *
 * IMPORTANTE: este serviço NÃO coleta nem transmite nenhum dado. Ele existe
 * apenas para que o app apareça na lista de serviços de acessibilidade e o
 * usuário possa conceder o poder extra que quiser.
 */
public class VerseAccessibilityService extends AccessibilityService {

    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {
        // Atualmente sem handlers — o serviço existe para habilitar a permissão.
        // Aqui poderiam ser detectados eventos como TYPE_WINDOW_STATE_CHANGED
        // para saber quando o app deve ou não mostrar o pop-up gigante.
    }

    @Override
    public void onInterrupt() {
        // Chamado quando o serviço é interrompido — nada a fazer
    }
}
