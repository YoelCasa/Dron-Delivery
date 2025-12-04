// --- COMIENZO DEL ARCHIVO app.js MODIFICADO PARA EL RETO 1 (VOZ) ---

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
     * Función principal para hablar
     */
    function speak(text) {
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
        const normalizedCommand = command.toLowerCase();
        let executed = false;
        
        // 1. COMANDO DE COMPRA: "Añadir [Producto]"
        if (normalizedCommand.startsWith('añadir ') || normalizedCommand.startsWith('agregar ')) {
            const itemQuery = normalizedCommand.replace(/^(añadir|agregar)\s+/, '').trim();

            if (!productsList.length) {
                 speak("No hay productos disponibles en esta página.");
                 return;
            }

            let matchedProductName = null;
            let bestMatchLength = 0;

            // ** LÓGICA DE BÚSQUEDA ROBUSTA (Busca coincidencias parciales) **
            for (const productName of productsList) {
                // Si la consulta es directamente un producto, perfecto
                if (productName === itemQuery) {
                    matchedProductName = productName;
                    break;
                }
                
                // Si la consulta contiene el nombre del producto o viceversa, lo acepta (ej. "Añadir Big" -> "Big Mac")
                if (productName.includes(itemQuery) || itemQuery.includes(productName)) {
                     if (productName.length > bestMatchLength) {
                         bestMatchLength = productName.length;
                         matchedProductName = productName;
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
                    return; 
                }
            }
            
            // Si no se encontró el producto o no se pudo añadir
            speak("Producto no reconocido. Intenta decir solo el nombre, por ejemplo: Big Mac.");
            return;
        }

        // 2. COMANDO DE NAVEGACIÓN: "Ir a [Página]"
        if (normalizedCommand.startsWith('ir a ') || normalizedCommand.startsWith('abrir ')) {
            const pageName = normalizedCommand.replace(/^(ir a|abrir)\s+/, '').trim();
            let targetPage = null;

            if (pageName.includes('pagar') || pageName.includes('carrito')) {
                targetPage = 'pago.html';
            } else if (pageName.includes('inicio') || pageName.includes('casa')) {
                targetPage = 'home.html';
            } else if (pageName.includes('perfil') || pageName.includes('cuenta')) {
                targetPage = 'perfil.html';
            }
            
            if (targetPage) {
                speak(`Navegando a ${pageName}`);
                window.location.href = targetPage;
                executed = true;
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
    // 4. LÓGICA DE PÁGINA DE PAGO & FEEDBACK MULTIMODAL (RETO 9)
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
});