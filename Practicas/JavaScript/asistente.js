// ============================================================
// asistente.js - Lógica del Asistente Virtual (Chat) MEJORADA
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const userName = localStorage.getItem('userEmail') ? localStorage.getItem('userEmail').split('@')[0] : 'Daniel';
    
    // --- LÓGICA DE DATOS DE LA APLICACIÓN ---
    
    // Obtiene el carrito actual
    function getCart() {
        return JSON.parse(localStorage.getItem('shoppingCart')) || [];
    }

    // Obtiene el último pedido (si existe)
    function getLastOrder() {
        const orders = JSON.parse(localStorage.getItem('userOrders')) || [];
        return orders.length > 0 ? orders[0] : null;
    }
    
    // --- FUNCIÓN DE GENERACIÓN DE RESPUESTA ---
    
    function generateAssistantResponse(text) {
        const normalizedText = text.toLowerCase().trim();
        const cart = getCart();
        const lastOrder = getLastOrder();
        
        let responses = []; // Array para mensajes múltiples
        let actions = [];   // Array para botones de acción (HTML)

        // 1. CONSULTAS DE ESTADO Y CONTEXTO (IA Lógica)
        if (normalizedText.includes('carrito') || normalizedText.includes('cesta')) {
            if (cart.length === 0) {
                responses.push('Tu carrito está vacío. ¡Te sugiero que visites Casa Pepe para unas bravas!');
                actions.push({ text: 'Ir a Comprar', link: 'home.html' });
            } else {
                const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
                const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
                responses.push(`Ahora mismo tienes ${totalItems} artículos en el carrito, con un subtotal de $${subtotal}.`);
                responses.push('¿Quieres finalizar el pago?');
                actions.push({ text: 'Pagar Ahora', link: 'pago.html' });
                actions.push({ text: 'Vaciar Carrito', action: 'vaciar' });
            }
        }
        else if (normalizedText.includes('dónde') || normalizedText.includes('estado') || normalizedText.includes('pedido')) {
            if (lastOrder) {
                const statusText = lastOrder.status === 'pending' ? 'en preparación' : 'entregado';
                const deliveryTime = new Date(lastOrder.estimatedDelivery).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                responses.push(`¡Tengo tu último pedido! Es el ${lastOrder.id}.`);
                responses.push(`El estado es "${statusText}". La entrega está estimada para las ${deliveryTime}.`);
                actions.push({ text: 'Ver Seguimiento', link: 'ubicacion.html' });
                actions.push({ text: 'Repetir Pedido', action: 'repetir' });
            } else {
                responses.push('Aún no has realizado ningún pedido. ¡Es un buen momento para probar Dron Delivery!');
                actions.push({ text: 'Ir a Tiendas', link: 'home.html' });
            }
        }
        
        // 2. COMANDOS DE COMPRA DIRECTA EN CHAT (Guía de Navegación)
        else if (normalizedText.includes('añadir') || normalizedText.includes('comprar')) {
            responses.push('¡Excelente iniciativa! Pero soy solo un asistente de chat.');
            responses.push('Para añadir productos, debes ir a la tienda específica.');
            actions.push({ text: 'Ir a Tiendas', link: 'home.html' });
        }

        // 3. COMANDOS CONVERSACIONALES
        else if (normalizedText.includes('hola')) {
            responses.push(`¡Hola, ${userName}! Soy tu asistente Dron. ¿Quieres saber el estado de tu pedido o qué tienes en el carrito?`);
            actions.push({ text: 'Estado Pedido', action: 'simulate_status' });
            actions.push({ text: 'Ver Carrito', action: 'simulate_cart' });
        }
        else if (normalizedText.includes('adios') || normalizedText.includes('hasta luego')) {
            responses.push('¡Adiós! Vuelve pronto. Si me necesitas en la próxima pantalla, solo di "Ayuda".');
        }
        else if (normalizedText.includes('gracias')) {
            responses.push('De nada, estoy para servirte.');
        }
        else if (normalizedText.includes('tiendas')) {
             responses.push('Puedes encontrar comida rápida, tradicional y saludable.');
             actions.push({ text: 'Ver Todas', link: 'home.html' });
        }
        else if (normalizedText.includes('promociones')) {
            responses.push('Actualmente tenemos Envío Gratis en pedidos mayores a $30. Revisa el checkout.');
            actions.push({ text: 'Ir a Pago', link: 'pago.html' });
        }
        
        // 4. RESPUESTA POR DEFECTO
        else {
            responses.push('Lo siento, aún estoy aprendiendo. Intenta preguntar sobre "pedido", "carrito", o simplemente di "hola".');
            actions.push({ text: '¿Qué puedo preguntar?', action: 'simulate_help' });
        }

        return { responses, actions };
    }

    // --- LÓGICA DE CHAT Y VISUALIZACIÓN ---
    
    /**
     * Añade un mensaje al chat, incluyendo botones de acción si los hay.
     * @param {string} text 
     * @param {string} sender 
     * @param {Array<Object>} actions 
     */
    function addMessage(text, sender, actions = []) {
        const messageContainer = document.createElement('div');
        messageContainer.className = `message-bubble ${sender}`;
        
        let bubbleContent = `<div class="bubble">${text}</div>`;
        
        if (actions.length > 0) {
            bubbleContent += '<div class="action-buttons">';
            actions.forEach(action => {
                const isLink = action.link;
                const isAction = action.action;
                
                if (isLink) {
                    bubbleContent += `<button class="btn-chat-action link" data-link="${action.link}">${action.text}</button>`;
                } else if (isAction) {
                    bubbleContent += `<button class="btn-chat-action action" data-action="${action.action}">${action.text}</button>`;
                }
            });
            bubbleContent += '</div>';
        }

        messageContainer.innerHTML = bubbleContent;
        chatMessages.appendChild(messageContainer);
        
        // Agregar listeners a los nuevos botones
        if (actions.length > 0) {
            setupActionListeners(messageContainer);
        }
        
        // Scroll automático al último mensaje
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Si el Lector de Voz está activo, que lea el mensaje del asistente
        if (sender === 'assistant' && typeof window.speak === 'function' && localStorage.getItem('voiceAssistant') === 'true') {
            setTimeout(() => {
                 window.speak(text);
            }, 300);
        }
    }

    /**
     * Configura los listeners para los botones de acción dinámicos.
     * @param {HTMLElement} container 
     */
    function setupActionListeners(container) {
        container.querySelectorAll('.btn-chat-action').forEach(button => {
            button.addEventListener('click', () => {
                const link = button.dataset.link;
                const action = button.dataset.action;
                
                if (link) {
                    window.location.href = link;
                } else if (action) {
                    handleSimulatedAction(action);
                }
            });
        });
    }

    /**
     * Maneja las acciones simuladas (vaciar, repetir, ayuda).
     * @param {string} actionType 
     */
    function handleSimulatedAction(actionType) {
        if (actionType === 'vaciar') {
            localStorage.removeItem('shoppingCart');
            addMessage('❌ Carrito vaciado. Puedes empezar a añadir productos desde la página de inicio.', 'assistant');
        } else if (actionType === 'repetir') {
            const lastOrder = getLastOrder();
            if (lastOrder) {
                localStorage.setItem('tempCart', JSON.stringify(lastOrder.items));
                addMessage('✅ Listo para repetir. Te llevaré a la página principal para que revises y compres de nuevo.', 'assistant');
                setTimeout(() => window.location.href = 'home.html', 1500);
            } else {
                addMessage('No tienes pedidos recientes para repetir.', 'assistant');
            }
        } else if (actionType === 'simulate_status') {
            // Simula la entrada de texto "Estado pedido" para reciclar la lógica
            handleUserInput('estado de mi pedido');
        } else if (actionType === 'simulate_cart') {
            // Simula la entrada de texto "Ver carrito"
            handleUserInput('qué hay en mi carrito');
        } else if (actionType === 'simulate_help') {
             addMessage('Puedes preguntar por: "Estado de mi pedido", "Qué tengo en el carrito", "Promociones", "Tiendas", o usar los botones de abajo.', 'assistant');
        }
    }

    /**
     * Función unificada para manejar la entrada de texto del usuario.
     * @param {string} text - El texto a procesar (puede ser texto real o simulado por un botón).
     */
    function handleUserInput(text = chatInput.value.trim()) {
        if (text === '') return;

        // Si es una entrada real (no simulada por botón), mostrar burbuja de usuario
        if (text === chatInput.value.trim()) {
            addMessage(text, 'user');
            chatInput.value = '';
        }

        // Generar respuesta simulada
        const { responses, actions } = generateAssistantResponse(text);
        
        // Simular tiempo de respuesta de la "API"
        const delay = Math.floor(Math.random() * 500) + 500; 
        
        setTimeout(() => {
            if (responses.length > 0) {
                responses.forEach((msg, index) => {
                    // Solo el último mensaje puede llevar los botones de acción
                    const currentActions = (index === responses.length - 1) ? actions : [];
                    
                    setTimeout(() => addMessage(msg, 'assistant', currentActions), index * 600);
                });
            } else {
                // Esto no debería suceder si generateAssistantResponse es robusto, pero como fallback:
                addMessage('Lo siento, algo salió mal al generar la respuesta.', 'assistant');
            }
        }, delay);
    }


    // --- INICIALIZACIÓN Y LISTENERS ---
    
    // Event Listeners para el botón y Enter
    if (sendBtn) {
        sendBtn.addEventListener('click', () => handleUserInput());
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleUserInput();
            }
        });
    }

    // Mensaje de bienvenida inicial
    setTimeout(() => {
        addMessage(`¡Hola, ${userName}! Soy tu asistente Dron. ¿En qué puedo ayudarte hoy?`, 'assistant', [
            { text: 'Estado Pedido', action: 'simulate_status' },
            { text: 'Ver Carrito', action: 'simulate_cart' }
        ]);
    }, 500);
});