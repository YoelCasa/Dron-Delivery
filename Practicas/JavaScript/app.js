// --- COMIENZO DEL ARCHIVO app.js MODIFICADO PARA EL RETO 1 (VOZ) ---

// ============================================================
// INYECTAR CHAT EN TODAS LAS PÁGINAS
// ============================================================
(function() {
    // Solo inyectar si no existe el chat ya
    if (!document.getElementById('chat-fab')) {
        const chatHTML = `
            <div class="chat-fab" id="chat-fab" title="Abrir asistente">
                <i class='bx bxs-message-dots'></i>
            </div>
            <div class="chat-widget" id="chat-widget">
                <div class="chat-header">
                    <div class="chat-header-content">
                        <h3>Asistente Dron</h3>
                        <p>Disponible 24/7</p>
                    </div>
                    <button class="chat-minimize" id="chat-minimize"><i class='bx bx-minus'></i></button>
                </div>
                <div class="chat-messages-container" id="chat-messages">
                    <div class="chat-message bot">¡Hola! 👋 Soy tu asistente. Puedo mostrarte restaurantes, tomar tu pedido, responder preguntas y más. ¿Qué necesitas?</div>
                </div>
                <div class="chat-input-area">
                    <input type="text" id="chat-input" placeholder="Escribe aquí..." autocomplete="off">
                    <button class="chat-send-btn" id="chat-send"><i class='bx bx-send'></i></button>
                </div>
            </div>
        `;
        
        // Insertar dentro del mobile-frame si existe, si no al final del body
        const mobileFrame = document.querySelector('.mobile-frame');
        if (mobileFrame) {
            mobileFrame.insertAdjacentHTML('beforeend', chatHTML);
        } else {
            document.body.insertAdjacentHTML('beforeend', chatHTML);
        }
        
        // Cargar el CSS del chat si no está cargado
        if (!document.querySelector('link[href*="chat"]') && !document.querySelector('style[data-chat]')) {
            const chatCSS = `
                .chat-fab { position: absolute; bottom: 80px; right: 15px; width: 56px; height: 56px; background: linear-gradient(135deg, #FF6B35, #FF8C42); border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(255, 107, 53, 0.4); z-index: 999; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); animation: pulse-chat 2s infinite; }
                .chat-fab:hover { transform: scale(1.1); box-shadow: 0 6px 20px rgba(255, 107, 53, 0.5); }
                .chat-fab i { font-size: 28px; color: #fff; }
                @keyframes pulse-chat { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
                .chat-widget { position: absolute; bottom: 80px; right: 15px; width: 340px; height: 450px; background: #fff; border-radius: 16px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2); display: flex; flex-direction: column; z-index: 1000; opacity: 0; pointer-events: none; transform: translateY(20px) scale(0.95); transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
                .chat-widget.open { opacity: 1; pointer-events: auto; transform: translateY(0) scale(1); bottom: 90px; }
                .chat-header { background: linear-gradient(135deg, #FF6B35, #FF8C42); color: #fff; padding: 15px; border-radius: 16px 16px 0 0; display: flex; justify-content: space-between; align-items: center; }
                .chat-header-content h3 { font-size: 16px; font-weight: 600; margin: 0; }
                .chat-header-content p { font-size: 12px; opacity: 0.9; margin: 2px 0 0 0; }
                .chat-minimize { background: rgba(255, 255, 255, 0.2); border: none; color: #fff; cursor: pointer; width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
                .chat-minimize:hover { background: rgba(255, 255, 255, 0.3); }
                .chat-messages-container { flex: 1; overflow-y: auto; padding: 15px; display: flex; flex-direction: column; gap: 10px; }
                .chat-message { padding: 10px 14px; border-radius: 12px; word-wrap: break-word; max-width: 90%; font-size: 14px; line-height: 1.4; animation: slideInChat 0.3s ease-out; }
                .chat-message.user { background: linear-gradient(135deg, #FF6B35, #FF8C42); color: #fff; align-self: flex-end; border-bottom-right-radius: 2px; }
                .chat-message.bot { background: #f0f0f0; color: #333; align-self: flex-start; border-bottom-left-radius: 2px; }
                .chat-message.bot a { color: #FF6B35; font-weight: 600; cursor: pointer; text-decoration: none; }
                .chat-message.bot a:hover { text-decoration: underline; }
                @keyframes slideInChat { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .chat-input-area { display: flex; gap: 8px; padding: 12px; border-top: 1px solid #e0e0e0; background: #fff; border-radius: 0 0 16px 16px; }
                #chat-input { flex: 1; border: 1px solid #ddd; border-radius: 24px; padding: 8px 14px; font-size: 14px; outline: none; transition: all 0.2s; }
                #chat-input:focus { border-color: #FF6B35; box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1); }
                .chat-send-btn { background: linear-gradient(135deg, #FF6B35, #FF8C42); color: #fff; border: none; border-radius: 50%; width: 36px; height: 36px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
                .chat-send-btn:hover { transform: scale(1.05); }
                .chat-send-btn:active { transform: scale(0.95); }
                html.dark-mode .chat-widget { background: #222; }
                html.dark-mode .chat-messages-container { background: #1a1a1a; }
                html.dark-mode .chat-message.bot { background: #333; color: #f0f0f0; }
                html.dark-mode #chat-input { background: #333; color: #f0f0f0; border-color: #444; }
                html.dark-mode .chat-input-area { background: #222; border-top-color: #333; }
            `;
            
            const style = document.createElement('style');
            style.setAttribute('data-chat', 'true');
            style.textContent = chatCSS;
            document.head.appendChild(style);
        }
    }
})();

document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    // 1. CONFIGURACIÓN GLOBAL (Temas, Accesibilidad y VOZ)
    // ============================================================
    const rootHtml = document.documentElement;
    
    // --- Modo Oscuro ---
    const themeToggle = document.getElementById('dark-mode-toggle');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark') {
        rootHtml.classList.add('dark-mode');
        if (themeToggle) themeToggle.checked = true;
    }

    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            if (themeToggle.checked) {
                rootHtml.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
            } else {
                rootHtml.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // --- Accesibilidad Visual (Daltonismo) ---
    const accessibilityForm = document.getElementById('accessibility-form');
    const visionRadios = document.querySelectorAll('input[name="vision-mode"]');
    const currentAccessibility = localStorage.getItem('accessibility');
    const accessibilityModes = ['protanopia', 'deuteranopia', 'acromatopsia'];

    if (currentAccessibility && currentAccessibility !== 'normal') {
        rootHtml.classList.add(currentAccessibility);
    }

    if (accessibilityForm) {
        const radioToCheck = currentAccessibility || 'normal';
        const input = document.querySelector(`input[value="${radioToCheck}"]`);
        if (input) input.checked = true;

        visionRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const selectedMode = e.target.value;
                accessibilityModes.forEach(mode => rootHtml.classList.remove(mode));
                if (selectedMode !== 'normal') {
                    rootHtml.classList.add(selectedMode);
                }
                localStorage.setItem('accessibility', selectedMode);
            });
        });
    }

    // ============================================================
    // 1.5. LECTOR DE PANTALLA (ASISTENTE DE VOZ)
    // ============================================================
    
    let isVoiceActive = localStorage.getItem('voiceAssistant') === 'true';
    const voiceToggle = document.getElementById('voice-assistant-toggle');

    // Sincronizar el checkbox si estamos en la página de accesibilidad
    if (voiceToggle) {
        voiceToggle.checked = isVoiceActive;
        
        voiceToggle.addEventListener('change', (e) => {
            isVoiceActive = e.target.checked;
            localStorage.setItem('voiceAssistant', isVoiceActive);
            
            if (isVoiceActive) {
                speak("Lector de pantalla activado. Ahora te guiaré.");
                // ** [R1 - Nuevo] ** Iniciar reconocimiento de voz al activar el lector
                startVoiceCommandListener(); 
            } else {
                speak("Lector de pantalla desactivado.");
                // ** [R1 - Nuevo] ** Detener reconocimiento al desactivar
                stopVoiceCommandListener(); 
            }
        });
    }

    /**
     * Función principal para hablar (HECHA GLOBAL para uso del Agente en checkout.js)
     */
    window.speak = function(text) {
        // Si está desactivado o no hay texto, no hacer nada
        if (!isVoiceActive || !text) return;

        // Cancelar cualquier audio anterior para no solaparse
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES'; // Español de España
        utterance.rate = 1;       // Velocidad normal
        utterance.pitch = 1;      // Tono normal
        
        window.speechSynthesis.speak(utterance);
    }

    // A. ANUNCIAR DÓNDE ESTOY AL CARGAR LA PÁGINA
    setTimeout(() => {
        if (isVoiceActive) {
            const mainTitle = document.querySelector('h1')?.textContent || document.title;
            const cleanTitle = mainTitle.replace('Dron Delivery - ', '');
            speak(`Estás en ${cleanTitle}`);
        }
    }, 500);

    // B. LEER ELEMENTOS AL HACER CLIC (Delegación de eventos general)
    document.body.addEventListener('click', (e) => {
        if (!isVoiceActive) return;

        // Evitamos leer si es un botón de añadir o el botón de pagar (tienen lógica propia)
        if (e.target.closest('.add-btn') || 
            e.target.closest('.increase-btn') || 
            e.target.closest('.decrease-btn') || 
            e.target.closest('#btn-place-order')) {
            return;
        }

        const target = e.target;
        const element = target.closest('button, a, input, label, .card, .promo-card, h1, h2, h3, p');

        if (element) {
            let textToRead = "";

            if (element.getAttribute('aria-label')) {
                textToRead = element.getAttribute('aria-label');
            } 
            else if (element.tagName === 'IMG') {
                textToRead = element.alt ? `Imagen de ${element.alt}` : "Imagen decorativa";
            }
            else if (element.tagName === 'INPUT') {
                const type = element.type;
                if (type === 'radio' || type === 'checkbox') {
                    const id = element.id;
                    const label = document.querySelector(`label[for="${id}"]`);
                    const state = element.checked ? "marcado" : "desmarcado";
                    textToRead = label ? `${label.textContent}, casilla ${state}` : `Opción ${state}`;
                } else {
                    textToRead = element.placeholder || "Campo de texto";
                }
            }
            else {
                textToRead = element.innerText || element.textContent;
            }

            if (textToRead) {
                speak(textToRead.trim());
            }
        }
    });


    // ============================================================
    // ** [R1 - Nuevo] ** 1.6. COMANDOS DE VOZ (Speech-to-Text)
    // ============================================================
    
    // Determinar qué API de reconocimiento de voz usar
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    let productsList = []; // Lista de productos disponibles en la página

    // 1. Inicializa el objeto de reconocimiento
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.lang = 'es-ES';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        
        // 2. Manejo de resultados
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.trim();
            console.log('Comando de voz detectado:', transcript);
            processVoiceCommand(transcript);
        };

        // 3. Reiniciar reconocimiento (para mantenerlo activo)
        recognition.onend = () => {
            if (isVoiceActive) {
                // Volver a iniciar después de un breve descanso, si sigue activo
                setTimeout(startRecognition, 100); 
            }
        };

        recognition.onerror = (event) => {
            // Ignorar errores comunes para evitar spam en la consola
            if (event.error !== 'no-speech' && event.error !== 'audio-capture') {
                // console.error('Error de reconocimiento de voz:', event.error);
            }
        };
    }

    function startRecognition() {
        if (!recognition) return;
        try {
            recognition.start();
        } catch (e) {
            // Ignorar errores de "ya está en progreso"
            if (e.name !== 'InvalidStateError') {
                console.error("Error al iniciar reconocimiento:", e);
            }
        }
    }

    function stopRecognition() {
        if (recognition) {
            recognition.stop();
        }
    }

    // Activa la escucha de comandos si el lector está activo al cargar
    function startVoiceCommandListener() {
        if (isVoiceActive && recognition) {
            // Esperar 1 segundo para evitar solapamiento con el anuncio inicial
            setTimeout(() => {
                // Rellenar la lista de productos disponibles en esta página
                productsList = Array.from(document.querySelectorAll('.product-item'))
                    .map(card => card.dataset.name.toLowerCase());
                
                // Iniciar la escucha
                startRecognition();
            }, 1000); 
        }
    }

    function stopVoiceCommandListener() {
        stopRecognition();
    }
    
    // Iniciar al cargar si el modo de voz está activo
    if (isVoiceActive) startVoiceCommandListener();
    
    // Nombres de restaurantes disponibles para comandos de Reseñas
    const RESTAURANT_NAMES = {
        'pepe': 'Casa Pepe',
        'mcdonalds': 'McDonald\'s',
        'fruteria': 'Frutería',
        'poke': 'Pokémon Albacete',
        'hsn': 'HSN Store'
    };

    /**
     * Procesa la transcripción del comando de voz
     */
    function processVoiceCommand(command) {
        // Normalizar: convertir a minúsculas y remover espacios múltiples
        let normalizedCommand = command.toLowerCase().replace(/\s+/g, ' ').trim();
        let executed = false;
        
        console.log('📢 Comando normalizado:', normalizedCommand);
        
        // 1. COMANDO DE COMPRA: "Añadir [Producto]"
        if (normalizedCommand.startsWith('añadir ') || normalizedCommand.startsWith('agregar ') || normalizedCommand.startsWith('añadir') || normalizedCommand.startsWith('agregar')) {
            // Extraer la parte después de "Añadir" o "Agregar" - con o sin espacios
            const itemQuery = normalizedCommand
                .replace(/^(añadir|agregar)\s*/, '')
                .trim()
                .replace(/\s+/g, ''); // Remover TODOS los espacios para búsqueda sin espacios

            if (!productsList.length) {
                 speak("No hay productos disponibles en esta página.");
                 console.log('❌ No hay productos disponibles');
                 return;
            }

            let matchedProductName = null;
            let bestMatchScore = 0;

            // ** LÓGICA DE BÚSQUEDA ROBUSTA (Busca coincidencias parciales, con o sin espacios) **
            for (const productName of productsList) {
                // Versión sin espacios del nombre del producto
                const productNameNoSpaces = productName.replace(/\s+/g, '');
                
                // Si la consulta es directamente un producto (sin espacios), perfecto
                if (productNameNoSpaces === itemQuery) {
                    matchedProductName = productName;
                    bestMatchScore = 100;
                    console.log('✅ Coincidencia exacta sin espacios:', productName);
                    break;
                }
                
                // Si la consulta contiene el nombre del producto o viceversa, lo acepta
                if (productNameNoSpaces.includes(itemQuery) || itemQuery.includes(productNameNoSpaces)) {
                    const matchScore = productNameNoSpaces.length; // Mayor coincidencia = mejor
                    if (matchScore > bestMatchScore) {
                        bestMatchScore = matchScore;
                        matchedProductName = productName;
                        console.log('✅ Coincidencia parcial:', productName);
                    }
                }
                
                // También buscar por palabra individual (ej: "big" en "bigmac" o "big mac")
                const queryWords = itemQuery.split('');
                if (productNameNoSpaces.includes(itemQuery.charAt(0))) {
                    // Si empieza con la primera letra de lo que se busca
                    if (queryWords.some(word => productNameNoSpaces.includes(word))) {
                        const matchScore = productNameNoSpaces.length * 0.8;
                        if (matchScore > bestMatchScore && !matchedProductName) {
                            bestMatchScore = matchScore;
                            matchedProductName = productName;
                        }
                    }
                }
            }

            if (matchedProductName) {
                // Encontrar la tarjeta del producto usando el nombre coincidente
                const productCard = document.querySelector(`.product-item[data-name*="${matchedProductName.replace(/"/g, '\\"')}"]`);

                if (productCard) {
                    const productData = {
                        id: productCard.dataset.id,
                        name: productCard.dataset.name,
                        price: parseFloat(productCard.dataset.price),
                        img: productCard.dataset.img,
                        brand: productCard.querySelector('.product-details span')?.textContent || 'Restaurante'
                    };
                    
                    // Llama a la lógica de carrito existente
                    const qty = addToCart(productData); 
                    updateCardUI(productCard, qty);
                    showToast(`Añadido por voz: ${productData.name}`);
                    console.log('✅ Producto añadido:', productData.name);
                    return; 
                }
            }
            
            // Si no se encontró el producto o no se pudo añadir
            speak("Producto no reconocido. Intenta diciendo el nombre, por ejemplo: Big Mac.");
            console.log('❌ Producto no encontrado:', itemQuery, '| Lista:', productsList);
            return;
        }

        // 2. COMANDO DE NAVEGACIÓN: "Ir a [Página]" (MEJORADO)
        if (normalizedCommand.startsWith('ir a ') || normalizedCommand.startsWith('abrir ') || normalizedCommand.startsWith('navegar a ')) {
            // Extraer el nombre de la página después de "ir a", "abrir" o "navegar a"
            let pageName = normalizedCommand
                .replace(/^(ir a|abrir|navegar a)\s+/, '')
                .trim();
            
            console.log('🗺️ Navegando a:', pageName);
            
            let targetPage = null;

            if (pageName.includes('pagar') || pageName.includes('carrito')) {
                targetPage = 'pago.html';
            } else if (pageName.includes('inicio') || pageName.includes('casa') && !pageName.includes('casa pepe')) {
                targetPage = 'home.html';
            } else if (pageName.includes('perfil') || pageName.includes('cuenta')) {
                targetPage = 'perfil.html';
            } else if (pageName.includes('historial')) {
                targetPage = 'historial.html';
            } else if (pageName.includes('ubicación') || pageName.includes('localización')) {
                targetPage = 'ubicacion.html';
            } else if (pageName.includes('ayuda')) {
                targetPage = 'ayuda.html';
            } else if (pageName.includes('accesibilidad')) {
                targetPage = 'accesibilidad.html';
            } else if (pageName.includes('ofertas') || pageName.includes('promociones')) {
                targetPage = 'ofertas.html';
            } else if (pageName.includes('pepe') || pageName.includes('casa pepe')) {
                targetPage = 'casaPepe.html';
            } else if (pageName.includes('mcdonald') || pageName.includes('mcdonalds') || pageName.includes('mc')) {
                targetPage = 'mcdonalds.html';
            } else if (pageName.includes('poke') || pageName.includes('albacete')) {
                targetPage = 'poke-albacete.html';
            } else if (pageName.includes('frutería') || pageName.includes('frutas')) {
                targetPage = 'fruteria.html';
            } else if (pageName.includes('hsn')) {
                targetPage = 'hsn-store.html';
            } else if (pageName.includes('asistente')) {
                targetPage = 'asistente.html';
            }
            
            if (targetPage) {
                speak(`Navegando a ${pageName}`);
                console.log('✅ Redirigiendo a:', targetPage);
                document.location.href = targetPage;
                executed = true;
            } else {
                console.log('❌ Página no reconocida:', pageName);
            }
        }
        
        // --- NUEVOS COMANDOS DE VOZ ---

        // 3. COMANDO DE ACCESIBILIDAD: Activar/Desactivar Modo Oscuro
        if (normalizedCommand.includes('modo oscuro')) {
            const turnOn = normalizedCommand.includes('activar') || normalizedCommand.includes('poner');
            const turnOff = normalizedCommand.includes('desactivar') || normalizedCommand.includes('quitar');

            if (turnOn) {
                if (!rootHtml.classList.contains('dark-mode')) {
                    rootHtml.classList.add('dark-mode');
                    localStorage.setItem('theme', 'dark');
                    if (themeToggle) themeToggle.checked = true;
                    speak("Modo oscuro activado.");
                } else {
                    speak("El modo oscuro ya está activo.");
                }
                executed = true;
            } else if (turnOff) {
                if (rootHtml.classList.contains('dark-mode')) {
                    rootHtml.classList.remove('dark-mode');
                    localStorage.setItem('theme', 'light');
                    if (themeToggle) themeToggle.checked = false;
                    speak("Modo oscuro desactivado.");
                } else {
                    speak("El modo oscuro ya está desactivado.");
                }
                executed = true;
            }
        }
        
        // 4. COMANDO DE RESEÑAS: Abrir Reseñas de [Restaurante]
        if (normalizedCommand.includes('reseñas de')) {
            const query = normalizedCommand.replace('reseñas de', '').trim();
            const restaurantKey = Object.keys(RESTAURANT_NAMES).find(key => query.includes(key));
            
            if (restaurantKey) {
                const restaurantName = RESTAURANT_NAMES[restaurantKey];
                
                // Abrir modal de reseñas (depende de reviews.js)
                if (typeof openReviewsModal === 'function') {
                    openReviewsModal(restaurantName);
                    speak(`Abriendo reseñas de ${restaurantName}.`);
                    executed = true;
                } else {
                    speak(`La función de reseñas no está disponible en esta página.`);
                    executed = true;
                }
            }
        }
        
        // 5. COMANDO DE CARRITO: Vaciar Carrito
        if (normalizedCommand.includes('vaciar carrito') || normalizedCommand.includes('eliminar carrito')) {
            const currentCart = getCart();
            if (currentCart.length > 0) {
                localStorage.removeItem('shoppingCart');
                // Intentar recargar carrito si estamos en la página de pago
                if (window.location.pathname.includes('pago.html')) {
                    renderCartPage();
                }
                speak("Todos los productos han sido eliminados del carrito.");
            } else {
                speak("El carrito ya está vacío.");
            }
            executed = true;
        }
        
        // 6. COMANDO DE AGENTE: Ayuda/Preguntas (Reto 17 - Agente Activo)
        if (normalizedCommand.includes('ayuda') || normalizedCommand.includes('qué hacer') || normalizedCommand.includes('necesito ayuda')) {
             if (window.location.pathname.includes('pago.html') && typeof checkAssistantIntervention === 'function') {
                speak('Claro, te recuerdo los pasos pendientes para el pedido.');
                checkAssistantIntervention(); // Llama a la función del agente de checkout
            } else if (window.location.pathname.includes('home.html')) {
                speak('Estás en el inicio. Puedes decir "añadir" el nombre de un producto si estás en una tienda, o "ir a carrito" para pagar.');
            } else {
                speak('¿En qué puedo ayudarte? Dime un comando como "añadir producto" o "ir a carrito".');
            }
            executed = true;
        }

        // Si el comando no se reconoció y no fue una navegación
        if (!executed && normalizedCommand.length > 5) {
             // speak("Comando no reconocido. Puedes decir añadir un producto, o ir a otra página.");
             // Comentado para evitar repetición si el micrófono capta algo no intencionado
        }
    }


    // ============================================================
    // 2. LÓGICA DEL CARRITO DE COMPRAS
    // ============================================================

    function getCart() {
        //
        return JSON.parse(localStorage.getItem('shoppingCart')) || [];
    }

    function saveCart(cart) {
        //
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }

    function addToCart(product) {
        //
        let cart = getCart();
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            product.quantity = 1;
            cart.push(product);
        }
        saveCart(cart);
        
        // MENSAJE EXACTO SOLICITADO
        if (isVoiceActive) speak(`Se ha añadido el producto ${product.name}`);
        
        return existingItem ? existingItem.quantity : 1;
    }

    function decreaseFromCart(productId) {
        //
        let cart = getCart();
        const existingItemIndex = cart.findIndex(item => item.id === productId);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity -= 1;
            let newQty = cart[existingItemIndex].quantity;

            if (newQty <= 0) {
                cart.splice(existingItemIndex, 1);
                newQty = 0;
                if (isVoiceActive) speak("Producto eliminado del carrito");
            } else {
                if (isVoiceActive) speak("Cantidad reducida");
            }
            saveCart(cart);
            return newQty;
        }
        return 0;
    }

    function removeFromCart(productId) {
        //
        let cart = getCart();
        cart = cart.filter(item => item.id !== productId);
        saveCart(cart);
        if (isVoiceActive) speak("Elemento eliminado");
    }

    // ============================================================
    // 3. LÓGICA DE PÁGINAS DE TIENDA
    // ============================================================
    
    const productListSection = document.querySelector('.product-list');
    
    if (productListSection && !productListSection.dataset.listenerAttached) {
        productListSection.dataset.listenerAttached = 'true';
        updateAllProductCards();

        // Evento Hover (Mouseover) - Feedback previo al clic
        productListSection.addEventListener('mouseover', (e) => {
            if (!isVoiceActive) return;

            const btn = e.target.closest('.add-btn, .increase-btn');
            // Usamos dataset 'spoken' para evitar repeticiones constantes
            if (btn && !btn.dataset.spoken) {
                const productCard = btn.closest('.product-item');
                if (productCard) {
                    const name = productCard.dataset.name;
                    speak(`Añadir ${name}`);
                    
                    // Marcar como "hablado" temporalmente
                    btn.dataset.spoken = "true";
                    setTimeout(() => btn.dataset.spoken = "", 2000);
                }
            }
        });

        // Listener de click - Único e independiente
        const clickHandler = (e) => {
            const target = e.target;
            const productCard = target.closest('.product-item');
            
            if (!productCard) return;

            const productData = {
                id: productCard.dataset.id,
                name: productCard.dataset.name,
                price: parseFloat(productCard.dataset.price),
                img: productCard.dataset.img,
                brand: productCard.querySelector('.product-details span')?.textContent || 'Restaurante'
            };

            if (target.classList.contains('add-btn')) {
                e.stopPropagation();
                e.preventDefault();
                const qty = addToCart(productData);
                updateCardUI(productCard, qty);
                showToast(`Añadido: ${productData.name}`);
            } 
            else if (target.classList.contains('increase-btn')) {
                e.stopPropagation();
                e.preventDefault();
                const qty = addToCart(productData);
                updateCardUI(productCard, qty);
            }
            else if (target.classList.contains('decrease-btn')) {
                e.stopPropagation();
                e.preventDefault();
                const qty = decreaseFromCart(productData.id);
                updateCardUI(productCard, qty);
            }
        };

        productListSection.addEventListener('click', clickHandler);
    }

    function updateCardUI(card, quantity) {
        //
        const addBtn = card.querySelector('.add-btn');
        const selector = card.querySelector('.quantity-selector');
        const countSpan = card.querySelector('.quantity-count');

        if (quantity > 0) {
            addBtn.style.display = 'none';
            selector.style.display = 'flex';
            countSpan.textContent = quantity;
        } else {
            addBtn.style.display = 'inline-flex';
            selector.style.display = 'none';
            countSpan.textContent = '0';
        }
    }

    function updateAllProductCards() {
        //
        const cart = getCart();
        const cards = document.querySelectorAll('.product-item');
        
        cards.forEach(card => {
            const id = card.dataset.id;
            const itemInCart = cart.find(item => item.id === id);
            const quantity = itemInCart ? itemInCart.quantity : 0;
            updateCardUI(card, quantity);
        });
    }

    // ============================================================
    // 4. LÓGICA DE PÁGINA DE PAGO & FEEDBACK MULTIMODAL (RETO 8)
    // ============================================================
    
    const cartItemsContainer = document.getElementById('cart-items-container');
    const placeOrderBtn = document.getElementById('btn-place-order'); // NUEVO BOTÓN
    
    if (cartItemsContainer) {
        renderCartPage();
    }

    // --- LÓGICA DEL BOTÓN HACER PEDIDO ---
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', () => {
            
            // 1. FEEDBACK VISUAL: Estado de carga
            placeOrderBtn.disabled = true;
            const originalText = placeOrderBtn.textContent;
            placeOrderBtn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Procesando...";
            
            // 2. FEEDBACK HÁPTICO: Vibración corta al pulsar
            if (navigator.vibrate) navigator.vibrate(50);

            // 3. FEEDBACK AUDITIVO: Aviso de proceso
            if (isVoiceActive) speak("Procesando tu pedido, un momento por favor.");

            // Simulamos espera de red (2 segundos)
            setTimeout(() => {
                
                // 4. FEEDBACK VISUAL: Overlay de éxito
                const overlay = document.getElementById('success-overlay');
                if (overlay) {
                    overlay.classList.remove('hidden');
                    overlay.classList.add('visible');
                }

                // 5. FEEDBACK SONORO: Confirmación
                if (isVoiceActive) {
                    speak("¡Pedido confirmado! Tu dron ha despegado.");
                }

                // 6. FEEDBACK HÁPTICO: Patrón de éxito (dos pulsos)
                if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

                // 7. LIMPIEZA Y REDIRECCIÓN
                localStorage.removeItem('shoppingCart'); // Vaciar carrito
                
                // Esperar 2.5s para que el usuario vea la animación
                setTimeout(() => {
                    window.location.href = "ubicacion.html";
                }, 2500);

            }, 2000);
        });
    }

    function renderCartPage() {
        const cart = getCart();
        cartItemsContainer.innerHTML = '';

        let subtotal = 0;
        let itemCount = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div style="text-align: center; padding: 30px; color: #888;">
                    <i class='bx bx-cart' style="font-size: 40px; margin-bottom: 10px;"></i>
                    <p>Tu carrito está vacío</p>
                    <a href="home.html" style="color: #000; font-weight: 500; margin-top: 10px; display: block;">Ir a comprar</a>
                </div>`;
            
            // Deshabilitar botón si está vacío
            if (placeOrderBtn) {
                placeOrderBtn.disabled = true;
                placeOrderBtn.style.opacity = "0.5";
            }
            if (isVoiceActive) speak("Tu carrito está vacío");
        } else {
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                itemCount += item.quantity;

                const html = `
                <div class="item-card">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="item-details">
                        <p class="brand">${item.brand}</p>
                        <p class="name">${item.name}</p>
                        <p class="quantity">Cant: ${item.quantity}</p>
                    </div>
                    <span class="item-price">$${itemTotal.toFixed(2)}</span>
                    <button class="cart-delete-btn" data-id="${item.id}" aria-label="Eliminar ${item.name}">
                        <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
                    </button>
                </div>`;
                cartItemsContainer.innerHTML += html;
            });

            document.querySelectorAll('.cart-delete-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const button = e.target.closest('.cart-delete-btn'); 
                    removeFromCart(button.dataset.id);
                    renderCartPage(); 
                    showToast('Producto eliminado');
                });
            });
            
            // Habilitar botón si hay items
            if (placeOrderBtn) {
                placeOrderBtn.disabled = false;
                placeOrderBtn.style.opacity = "1";
            }
            
            if (isVoiceActive) speak(`Tienes ${itemCount} artículos en el carrito. Total ${subtotal.toFixed(2)} dólares`);
        }

        updateOrderSummary(subtotal, itemCount);
        
        // ** (Llamada a updateCartTotals en checkout.js para sincronizar totales) **
        if (typeof updateCartTotals === 'function') {
            updateCartTotals();
        }
    }

    function updateOrderSummary(subtotal, count) {
        const subtotalEl = document.getElementById('cart-subtotal');
        const countEl = document.getElementById('cart-item-count');
        const totalEl = document.getElementById('cart-total');
        
        const shipping = 2.99;
        const service = 3.00;
        const total = subtotal + shipping + service;

        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (countEl) countEl.textContent = count;
        if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    }

    // ============================================================
    // 5. UTILIDADES
    // ============================================================

    function showToast(msg) {
        //
        // Buscar dentro del mobile-frame primero
        let mobileFrame = document.querySelector('.mobile-frame');
        let toast = mobileFrame ? mobileFrame.querySelector('.toast') : document.querySelector('.toast');
        
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            if (mobileFrame) {
                mobileFrame.appendChild(toast);
            } else {
                document.body.appendChild(toast);
            }
        }
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    const scrolls = [
        { arrow: 'arrow-scroll-1', container: 'scroll-1' },
        { arrow: 'arrow-scroll-2', container: 'scroll-2' }
    ];

    scrolls.forEach(item => {
        const arrow = document.getElementById(item.arrow);
        const container = document.getElementById(item.container);
        if (arrow && container) {
            let isScrolledRight = false;
            
            arrow.addEventListener('click', (e) => {
                e.preventDefault();
                
                if (!isScrolledRight) {
                    // Scroll a la derecha
                    container.scrollBy({ left: 150, behavior: 'smooth' });
                    isScrolledRight = true;
                    arrow.style.transform = 'rotate(180deg)';
                } else {
                    // Scroll a la izquierda
                    container.scrollBy({ left: -150, behavior: 'smooth' });
                    isScrolledRight = false;
                    arrow.style.transform = 'rotate(0deg)';
                }
            });
            
            // Agregar transición suave a la flecha
            arrow.style.transition = 'transform 0.3s ease';
        }
    });

    const loginBtn = document.getElementById('continue-btn');
    const emailInput = document.getElementById('email-input');
    const emailError = document.getElementById('email-error');

    if (loginBtn && emailInput) {
        loginBtn.addEventListener('click', (e) => {
            const email = emailInput.value;
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!regex.test(email)) {
                e.preventDefault();
                const msg = "Por favor, ingresa un correo válido.";
                emailError.textContent = msg;
                emailError.style.display = 'block';
                emailInput.style.borderColor = 'red';
                if(isVoiceActive) speak(msg);
            } else {
                localStorage.setItem('userEmail', email);
            }
        });

        emailInput.addEventListener('input', () => {
            emailError.style.display = 'none';
            emailInput.style.borderColor = '#ddd';
        });
    }

    // ============================================================
    // INICIALIZAR FAVORITOS AL CARGAR LA PÁGINA
    // ============================================================
    initializeFavorites();
    loadFavoritesHome();

    // ============================================================
    // MANEJADOR DEL BOTÓN DE FAVORITOS EN LA BARRA DE FILTROS
    // ============================================================
    const favoritesBtn = document.querySelector('.filter-buttons button:first-child');
    if (favoritesBtn) {
        favoritesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showFavorites();
        });
    }
});

// ============================================================
// SISTEMA DE FAVORITOS (Funciones Globales)
// ============================================================

/**
 * Obtener lista de favoritos del localStorage
 */
function getFavorites() {
    try {
        const favorites = localStorage.getItem('favoritesRestaurants');
        if (!favorites) return [];
        const parsed = JSON.parse(favorites);
        return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
        console.error('Error leyendo favoritos desde localStorage:', err);
        return window.__favoritesCache || [];
    }
}

/**
 * Guardar lista de favoritos en localStorage
 */
function saveFavorites(favorites) {
    try {
        localStorage.setItem('favoritesRestaurants', JSON.stringify(favorites));
        // Guardar copia en memoria por si localStorage falla
        window.__favoritesCache = favorites;
    } catch (err) {
        console.error('Error guardando favoritos en localStorage:', err);
        window.__favoritesCache = favorites;
        try {
            showToast('No se pudo guardar favoritos en el navegador', false, true);
        } catch (e) {
            // ignore if showToast not available
        }
    }
}

/**
 * Alternar favorito de un restaurante
 */
function toggleFavorite(btn) {
    const restaurantName = btn.dataset.restaurant;
    try {
        let favorites = getFavorites();

        if (favorites.includes(restaurantName)) {
            // Remover de favoritos
            favorites = favorites.filter(fav => fav !== restaurantName);
            btn.classList.remove('active');
            btn.innerHTML = '<i class="bx bx-heart"></i>';
            showToast(`Removido de favoritos`, false, true);
        } else {
            // Agregar a favoritos
            favorites.push(restaurantName);
            btn.classList.add('active');
            btn.innerHTML = '<i class="bx bxs-heart"></i>';
            showToast(`Agregado a favoritos`, false, false, true);
        }

        saveFavorites(favorites);
        // Actualizar ambas vistas (home y modal)
        try { loadFavoritesHome(); } catch (e) { console.warn('loadFavoritesHome error', e); }
        try { loadFavoritesSection(); } catch (e) { /* no-op */ }
    } catch (err) {
        console.error('toggleFavorite error:', err);
        showToast('Error al gestionar favorito', false, true);
    }
}

/**
 * Inicializar estado visual de botones de favorito
 */
function initializeFavorites() {
    const favorites = getFavorites();
    const favBtns = document.querySelectorAll('.favorite-btn');
    
    favBtns.forEach(btn => {
        const restaurantName = btn.dataset.restaurant;
        if (favorites.includes(restaurantName)) {
            btn.classList.add('active');
            btn.innerHTML = '<i class="bx bxs-heart"></i>';
        } else {
            btn.innerHTML = '<i class="bx bx-heart"></i>';
        }
    });
}

/**
 * Mostrar página de favoritos
 */
function showFavorites() {
    const favorites = getFavorites();
    
    if (favorites.length === 0) {
        showToast('📍 No tienes restaurantes favoritos aún', false, true);
        return;
    }
    
    // Crear modal con favoritos
    const modal = document.createElement('div');
    modal.className = 'favorites-modal';
    modal.innerHTML = `
        <div class="favorites-content">
            <div class="favorites-header">
                <h2>❤️ Mis Favoritos (${favorites.length})</h2>
                <button class="close-favorites" onclick="this.closest('.favorites-modal').remove()">✕</button>
            </div>
            <div class="favorites-list">
                ${favorites.map(fav => `
                    <div class="favorite-item">
                        <span>${fav}</span>
                        <button onclick="removeFavorite('${fav}')" class="remove-btn" title="Remover">✕</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

/**
 * Remover un favorito de la lista
 */
function removeFavorite(restaurantName) {
    try {
        let favorites = getFavorites();
        favorites = favorites.filter(fav => fav !== restaurantName);
        saveFavorites(favorites);

        // Actualizar UI - botón en tarjeta
        const btn = document.querySelector(`.favorite-btn[data-restaurant="${restaurantName}"]`);
        if (btn) {
            btn.classList.remove('active');
            btn.innerHTML = '<i class="bx bx-heart"></i>';
        }

        // Actualizar sección de favoritos en página
        try { loadFavoritesHome(); } catch (e) { console.warn('loadFavoritesHome error', e); }
        // Recargar sección de favoritos modal
        try { loadFavoritesSection(); } catch (e) { /* ignore */ }
    } catch (err) {
        console.error('removeFavorite error:', err);
        showToast('Error al quitar favorito', false, true);
    }
}

// ============================================================
// FUNCIONES PARA MOSTRAR/OCULTAR SECCIÓN DE FAVORITOS
// ============================================================

/**
 * Mostrar la sección de restaurantes favoritos
 */
function showFavoritesSection() {
    const favoritesSection = document.getElementById('favorites-section');
    const categoriesSection = document.getElementById('categories-section');
    
    if (favoritesSection) {
        favoritesSection.style.display = 'flex';
        if (categoriesSection) {
            categoriesSection.style.display = 'none';
        }
        loadFavoritesSection();
    }
}

/**
 * Ocultar la sección de restaurantes favoritos
 */
function hideFavoritesSection() {
    const favoritesSection = document.getElementById('favorites-section');
    const categoriesSection = document.getElementById('categories-section');
    
    if (favoritesSection) {
        favoritesSection.style.display = 'none';
        if (categoriesSection) {
            categoriesSection.style.display = 'block';
        }
    }
}

/**
 * Cargar y mostrar los restaurantes favoritos
 */
function loadFavoritesSection() {
    const favorites = getFavorites();
    const favoritesGrid = document.getElementById('favorites-grid');
    const noFavorites = document.getElementById('no-favorites');
    
    if (!favoritesGrid) return;
    
    if (favorites.length === 0) {
        favoritesGrid.style.display = 'none';
        if (noFavorites) {
            noFavorites.style.display = 'flex';
        }
        return;
    }
    
    favoritesGrid.style.display = 'grid';
    if (noFavorites) {
        noFavorites.style.display = 'none';
    }
    
    // Limpiar grid anterior
    favoritesGrid.innerHTML = '';
    
    // Crear tarjetas para cada favorito
    favorites.forEach(restaurantName => {
        const card = document.createElement('div');
        card.className = 'favorite-restaurant-card';
        
        // Obtener imagen según el nombre del restaurante
        let imageSrc = '../imagenes/fruta.jpg';
        if (restaurantName === 'Casa Pepe') {
            imageSrc = '../imagenes/casa-pepe.jpeg';
        } else if (restaurantName === 'Mc Donal\'s') {
            imageSrc = '../imagenes/mc-donals.jpg';
        } else if (restaurantName === 'Poke albacete') {
            imageSrc = '../imagenes/poke-albacete.jpg';
        } else if (restaurantName === 'HSN Store') {
            imageSrc = '../imagenes/hsn-store.jpg';
        }
        
        card.innerHTML = `
            <img src="${imageSrc}" alt="${restaurantName}">
            <div class="favorite-restaurant-card-info">
                <div>
                    <h3>${restaurantName}</h3>
                    <p>⭐ Restaurante favorito</p>
                </div>
                <button class="favorite-restaurant-card-btn" onclick="removeFavorite('${restaurantName}')">
                    ❤️ Quitar de favoritos
                </button>
            </div>
        `;
        
        favoritesGrid.appendChild(card);
    });
}

// ============================================================
// FUNCIONES DE FILTRADO DE CATEGORÍAS
// ============================================================

function filterByCategory(category) {
    // Actualizar botones activos
    const filterBtns = document.querySelectorAll('.filter-btn:not(.icon-only)');
    filterBtns.forEach(btn => btn.classList.remove('active'));
    
    const activeBtn = document.querySelector(`.filter-btn[onclick="filterByCategory('${category}')"]`);
    if (activeBtn) activeBtn.classList.add('active');
    
    // Mostrar/ocultar secciones
    const categorySections = document.querySelectorAll('.category-section');
    
    if (category === 'all') {
        categorySections.forEach(section => section.style.display = 'block');
    } else if (category === 'comida-rapida') {
        // Primera sección (Elige que pedir)
        if (categorySections[0]) categorySections[0].style.display = 'block';
        if (categorySections[1]) categorySections[1].style.display = 'none';
    } else if (category === 'saludable') {
        // Segunda sección (¿Algo sano?)
        if (categorySections[0]) categorySections[0].style.display = 'none';
        if (categorySections[1]) categorySections[1].style.display = 'block';
    }
}

function toggleFilterPanel() {
    // Función para futuro panel de filtros avanzados
    console.log('Panel de filtros abierto');
}

// ============================================================
// FUNCIONES PARA CARGAR FAVORITOS EN LA PÁGINA
// ============================================================

function loadFavoritesHome() {
    const favorites = getFavorites();
    const favScroll = document.getElementById('favorites-home-scroll');
    const noFavMsg = document.getElementById('no-favorites-home');
    const favSection = document.getElementById('favorites-home-section');
    
    if (!favScroll) {
        console.warn('Element favorites-home-scroll not found');
        return;
    }
    
    favScroll.innerHTML = '';
    
    if (favorites.length === 0) {
        noFavMsg.style.display = 'block';
        favSection.style.opacity = '0.6';
        return;
    }
    
    noFavMsg.style.display = 'none';
    favSection.style.opacity = '1';
    
    favorites.forEach(restaurantName => {
        let imageSrc = '../imagenes/fruta.jpg';
        
        if (restaurantName === 'Casa Pepe') {
            imageSrc = '../imagenes/casa-pepe.jpeg';
        } else if (restaurantName === "Mc Donal's") {
            imageSrc = '../imagenes/mc-donals.jpg';
        } else if (restaurantName === 'Poke albacete') {
            imageSrc = '../imagenes/poke-albacete.jpg';
        } else if (restaurantName === 'HSN Store') {
            imageSrc = '../imagenes/hsn-store.jpg';
        }
        
        const card = document.createElement('a');
        card.className = 'favorites-home-card';
        card.href = '#';
        card.onclick = (e) => {
            e.preventDefault();
            // En futuro, redirigir a la página del restaurante
        };
        
        card.innerHTML = `
            <img src="${imageSrc}" alt="${restaurantName}">
            <div class="favorites-home-card-info">
                <h3>${restaurantName}</h3>
                <p>⭐ Favorito</p>
            </div>
        `;
        
        favScroll.appendChild(card);
    });
}

function viewAllFavorites() {
    const favSection = document.getElementById('favorites-section');
    if (favSection) {
        favSection.style.display = 'block';
        loadFavoritesSection();
    }
}