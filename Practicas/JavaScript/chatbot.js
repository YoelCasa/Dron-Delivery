// ============================================================
// CHATBOT INTELIGENTE - DRON DELIVERY
// ============================================================

class ChatbotIA {
    constructor() {
        this.fab = document.getElementById('chat-fab');
        this.widget = document.getElementById('chat-widget');
        this.messagesContainer = document.getElementById('chat-messages');
        this.input = document.getElementById('chat-input');
        this.sendBtn = document.getElementById('chat-send');
        this.minimizeBtn = document.getElementById('chat-minimize');
        
        if (!this.fab || !this.widget) {
            console.warn('Chat elements not found');
            return;
        }
        
        this.isOpen = false;
        this.restaurants = [
            { name: 'Casa Pepe', type: 'Comida Casera', link: 'casaPepe.html' },
            { name: 'McDonald\'s', type: 'Comida Rápida', link: 'mcdonalds.html' },
            { name: 'Frutería', type: 'Frutas y Jugos', link: 'fruteria.html' },
            { name: 'Poke Albacete', type: 'Comida Saludable', link: 'poke-albacete.html' },
            { name: 'HSN Store', type: 'Saludable', link: 'hsn-store.html' }
        ];
        
        this.conversationContext = {
            lastIntent: null,
            userLocation: null
        };
        
        this.init();
    }
    
    init() {
        this.fab.addEventListener('click', () => this.toggle());
        this.sendBtn.addEventListener('click', () => this.handleSendMessage());
        this.minimizeBtn.addEventListener('click', () => this.toggle());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSendMessage();
        });
    }
    
    toggle() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.widget.classList.add('open');
            this.fab.style.opacity = '0.3';
            this.input.focus();
        } else {
            this.widget.classList.remove('open');
            this.fab.style.opacity = '1';
        }
    }
    
    handleSendMessage() {
        const message = this.input.value.trim();
        if (!message) return;
        
        this.addMessage(message, 'user');
        this.input.value = '';
        
        // Simular escritura del bot
        setTimeout(() => {
            const response = this.processUserInput(message);
            this.addMessage(response, 'bot');
        }, 500);
    }
    
    addMessage(text, sender = 'user') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        
        if (sender === 'bot' && typeof text === 'string' && text.includes('<')) {
            messageDiv.innerHTML = text;
            // Agregar event listeners a los enlaces en mensajes del bot
            const links = messageDiv.querySelectorAll('a');
            links.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const href = link.getAttribute('href');
                    if (href) {
                        window.location.href = href;
                    }
                });
            });
        } else {
            messageDiv.textContent = text;
        }
        
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    processUserInput(input) {
        const lower = input.toLowerCase();
        
        // DETECTAR INTENCIÓN DE NAVEGAR A RESTAURANTE (SIN REQUERIR "IR A")
        // Buscar cualquier mención de un restaurante
        for (let resto of this.restaurants) {
            const nombreLower = resto.name.toLowerCase();
            const palabras = nombreLower.split(' ');
            
            // Buscar el nombre completo o cualquiera de sus palabras
            const encontrado = palabras.some(palabra => lower.includes(palabra)) || lower.includes(nombreLower);
            
            if (encontrado) {
                // Si menciona palabras de navegación, navegar directamente
                const navegarPalabras = ['ir', 'llévame', 'voy', 'abre', 've', 'navega', 'quiero'];
                const tieneIntencionalidad = navegarPalabras.some(p => lower.includes(p));
                
                if (tieneIntencionalidad) {
                    // Navegar directamente sin setTimeout
                    const ruta = this.getRestaurantPath(resto.link);
                    console.log(`🎯 Navegando a: ${ruta}`);
                    document.location.href = ruta;
                    return `🎯 Te llevo a <strong>${resto.name}</strong>...`;
                }
            }
        }
        
        // SALUDOS Y BIENVENIDA
        if (this.matchesIntent(lower, ['hola', 'buenos', 'qué tal', 'hey', 'hi', 'hello', 'buenos días', 'buenas noches', 'buenas tardes'])) {
            return '¡Hola! 👋 Soy tu asistente inteligente de Dron Delivery. Estoy aquí para ayudarte 24/7. Puedo:\n\n🍽️ Mostrarte restaurantes\n🛒 Ayudarte con tu pedido\n💳 Responder sobre pagos\n📍 Rastrear entregas\n🎁 Contarte sobre promociones\n❓ Resolver cualquier pregunta\n\n¿Qué necesitas?';
        }
        
        // MOSTRAR RESTAURANTES
        if (this.matchesIntent(lower, ['restaurantes', 'ver restaurantes', 'tiendas', 'dónde comer', 'qué hay', 'menú', 'opciones', 'lista', 'ver todos'])) {
            return this.showRestaurants();
        }
        
        // CASA PEPE
        if (this.matchesIntent(lower, ['casa pepe', 'casapepe', 'pepe', 'jamón', 'comida casera', 'típica', 'platos', 'tortilla', 'paella', 'ir a casa', 'ir a pepe', 'casa pepe'])) {
            // Navegar si hay intención de ir
            if (this.matchesIntent(lower, ['ir', 'llévame', 'voy', 'abre', 've', 'navega', 'quiero'])) {
                console.log('🎯 Navegando a Casa Pepe');
                document.location.href = this.getRestaurantPath('casaPepe.html');
                return `🎯 Te llevo a <strong>Casa Pepe</strong>...`;
            }
            return `🏠 <strong>Casa Pepe</strong> - Comida Casera Tradicional\n\nEspecialidades:\n🍲 Paella Valenciana\n🥚 Tortilla Española\n🍖 Jamón Ibérico\n🍝 Fideuà\n🧅 Cebollitas al ajillo\n\n⏰ Horario: 10:00am - 10:00pm\n⭐ Valoración: 4.8/5\n💰 Rango: €€\n\n<a href="${this.getRestaurantPath('casaPepe.html')}">Ver menú completo →</a>`;
        }
        
        // McDONALD'S
        if (this.matchesIntent(lower, ['mcdonald', 'mcdonalds', 'mc', 'burger', 'hamburguesa', 'bigmac', 'nuggets', 'papas', 'patatas', 'refrescos', 'combo', 'ir a mcdonald', 'ir a mc', 'mcdonald\'s'])) {
            // Navegar si hay intención de ir
            if (this.matchesIntent(lower, ['ir', 'llévame', 'voy', 'abre', 've', 'navega', 'quiero'])) {
                console.log('🎯 Navegando a McDonald\'s');
                document.location.href = this.getRestaurantPath('mcdonalds.html');
                return `🎯 Te llevo a <strong>McDonald's</strong>...`;
            }
            return `🍔 <strong>McDonald's</strong> - Comida Rápida\n\nEspecialidades:\n🍔 Big Mac\n🍟 Papas Fritas\n🍗 Nuggets\n🥤 Refrescos\n🍰 Postres\n\n⏰ Horario: 8:00am - 11:00pm\n⭐ Valoración: 4.5/5\n💰 Rango: €\n🚀 Entrega: 15-25 min\n\n<a href="${this.getRestaurantPath('mcdonalds.html')}">Ver menú →</a>`;
        }
        
        // POKE ALBACETE
        if (this.matchesIntent(lower, ['poke', 'pokebowl', 'sushi', 'japonés', 'japonesa', 'asiático', 'tazón', 'salmon', 'atún', 'tempura', 'albacete', 'ir a poke', 'poke albacete'])) {
            // Navegar si hay intención de ir
            if (this.matchesIntent(lower, ['ir', 'llévame', 'voy', 'abre', 've', 'navega', 'quiero'])) {
                console.log('🎯 Navegando a Poke Albacete');
                document.location.href = this.getRestaurantPath('poke-albacete.html');
                return `🎯 Te llevo a <strong>Poke Albacete</strong>...`;
            }
            return `🍱 <strong>Poke Albacete</strong> - Comida Saludable Japonesa\n\nEspecialidades:\n🥗 Pokebowl Salmón\n🍙 Sushi Rolls\n🍜 Fideos Ramen\n🍡 Gyozas\n🥢 Tempura\n\n⏰ Horario: 11:00am - 10:00pm\n⭐ Valoración: 4.7/5\n💰 Rango: €€\n🥗 Sin gluten disponible\n\n<a href="${this.getRestaurantPath('poke-albacete.html')}">Ver menú →</a>`;
        }
        
        // HSN STORE
        if (this.matchesIntent(lower, ['hsn', 'hsn store', 'tienda', 'compras', 'productos', 'shopping', 'electrónica', 'ropa', 'suplementos', 'ir a hsn', 'ir a la tienda'])) {
            // Navegar si hay intención de ir
            if (this.matchesIntent(lower, ['ir', 'llévame', 'voy', 'abre', 've', 'navega', 'quiero'])) {
                console.log('🎯 Navegando a HSN Store');
                document.location.href = this.getRestaurantPath('hsn-store.html');
                return `🎯 Te llevo a <strong>HSN Store</strong>...`;
            }
            return `🛍️ <strong>HSN Store</strong> - Centro Comercial\n\nCategorías:\n👕 Ropa y Moda\n💻 Electrónica\n🏠 Hogar\n💪 Suplementos\n👜 Accesorios\n\n⏰ Horario: 9:00am - 9:00pm\n⭐ Valoración: 4.6/5\n💰 Envío: GRATIS\n📦 Variedad: 500+ productos\n\n<a href="${this.getRestaurantPath('hsn-store.html')}">Ver tienda →</a>`;
        }
        
        // FRUTERÍA
        if (this.matchesIntent(lower, ['frutería', 'frutas', 'fruta', 'verduras', 'verdura', 'orgánico', 'fresco', 'vegetales', 'manzana', 'naranja', 'plátano', 'ir a frutería', 'ir a fruta'])) {
            // Navegar si hay intención de ir
            if (this.matchesIntent(lower, ['ir', 'llévame', 'voy', 'abre', 've', 'navega', 'quiero'])) {
                console.log('🎯 Navegando a Frutería');
                document.location.href = this.getRestaurantPath('fruteria.html');
                return `🎯 Te llevo a <strong>Frutería</strong>...`;
            }
            return `🍎 <strong>Frutería</strong> - Frutas y Verduras Frescas\n\nProductos:\n🍎 Frutas de Temporada\n🥬 Verduras Orgánicas\n🥗 Ensaladas Preparadas\n🥤 Jugos Naturales\n🍋 Cítricos Premium\n\n⏰ Horario: 8:00am - 8:00pm\n⭐ Valoración: 4.9/5\n💰 Rango: €\n🌱 100% Orgánico\n\n<a href="${this.getRestaurantPath('fruteria.html')}">Ver tienda →</a>`;
        }
        
        // CÓMO FUNCIONA
        if (this.matchesIntent(lower, ['cómo', 'como', 'funciona', 'instrucciones', 'guía', 'pasos', 'proceso', 'empezar', 'primero'])) {
            return '📖 <strong>¿Cómo Funciona Dron Delivery?</strong>\n\n1️⃣ <strong>ELIGE</strong> → Selecciona tu restaurante favorito\n\n2️⃣ <strong>COMPRA</strong> → Añade productos al carrito\n\n3️⃣ <strong>PAGA</strong> → Elige tu método de pago seguro\n\n4️⃣ <strong>ESPERA</strong> → Rastrea tu dron en tiempo real\n\n5️⃣ <strong>RECIBE</strong> → Tu pedido en 20-45 minutos\n\n💡 ¡Tan fácil como 1, 2, 3!';
        }
        
        // HORARIOS
        if (this.matchesIntent(lower, ['horario', 'horarios', 'abierto', 'cerrado', 'qué hora', 'abre', 'cierra'])) {
            return '⏰ <strong>HORARIOS DE NUESTROS RESTAURANTES</strong>\n\n🏠 Casa Pepe: 10:00am - 10:00pm\n🍔 McDonald\'s: 8:00am - 11:00pm\n🍱 Poke Albacete: 11:00am - 10:00pm\n🛍️ HSN Store: 9:00am - 9:00pm\n🍎 Frutería: 8:00am - 8:00pm\n\n📱 Dron Delivery opera: 24/7\n📞 Soporte: Disponible siempre\n\n💡 Domingos: Horario reducido en algunos locales';
        }
        
        // TIEMPO DE ENTREGA
        if (this.matchesIntent(lower, ['entreg', 'tiempo', 'cuánto', 'minutos', 'rápido', 'dron', 'cuánto tarda', 'demora', 'espera'])) {
            return '⏱️ <strong>TIEMPO DE ENTREGA</strong>\n\n🚀 <strong>EXPRESS</strong>: 5-10 minutos (+$2)\n→ Zona céntrica solamente\n\n⚡ <strong>RÁPIDA</strong>: 15-25 minutos (+$1)\n→ Área urbana completa\n\n📦 <strong>NORMAL</strong>: 30-45 minutos (GRATIS)\n→ Todo nuestro área de cobertura\n\n🌙 <strong>NOCHE</strong>: 40-60 minutos\n→ Después de las 10pm\n\n✨ Los tiempos pueden variar según carga y ubicación';
        }
        
        // ZONA DE ENTREGA
        if (this.matchesIntent(lower, ['dónde', 'zona', 'cobertura', 'entregan', 'llega', 'servicio', 'mi dirección', 'puedo', 'disponible'])) {
            return '📍 <strong>ZONA DE COBERTURA</strong>\n\n✅ Centro histórico\n✅ Barrios residenciales\n✅ Zona comercial\n✅ Periferias (hasta 8km)\n✅ Polígonos industriales\n\n❓ ¿No estás seguro?\nIngresa tu dirección en el carrito y verificamos automáticamente si podemos entregarte.\n\n🌍 Cubrimos más zonas cada mes';
        }
        
        // MÉTODOS DE PAGO
        if (this.matchesIntent(lower, ['pago', 'pagar', 'tarjeta', 'efectivo', 'paypal', 'métodos', 'débito', 'crédito', 'billetera', 'apple', 'google'])) {
            return '💳 <strong>MÉTODOS DE PAGO DISPONIBLES</strong>\n\n💰 Efectivo en la puerta\n🏦 Tarjeta de Crédito\n🏦 Tarjeta de Débito\n📱 PayPal\n📱 Google Pay\n📱 Apple Pay\n💼 Mercado Pago\n🎁 Tarjetas de regalo\n\n🔒 <strong>SEGURIDAD</strong>: Todas las transacciones están encriptadas\n✅ Tu dinero es 100% seguro\n\n💡 Recibe cambio exacto si pagas con efectivo';
        }
        
        // RASTREO DE PEDIDOS
        if (this.matchesIntent(lower, ['rastrear', 'ubicación', 'estado', 'pedido', 'seguimiento', 'dónde está', 'llega', 'en vivo', 'ubicación del dron'])) {
            return '📍 <strong>RASTREO EN TIEMPO REAL</strong>\n\n📱 <strong>¿Cómo rastrear tu pedido?</strong>\n1. Ve a \"Mis Pedidos\"\n2. Selecciona un pedido activo\n3. Toca \"Rastrear\"\n\n🎯 <strong>Verás:</strong>\n📌 Ubicación exacta del dron\n⏱️ Tiempo estimado de llegada\n👤 Nombre del conductor\n📞 Número de contacto\n🗺️ Ruta completa\n\n🔄 Actualizamos la ubicación cada 5 segundos\n🔔 Recibirás notificaciones en cada paso';
        }
        
        // PROMOCIONES Y OFERTAS
        if (this.matchesIntent(lower, ['oferta', 'descuento', 'cupón', 'promo', 'promoción', 'código', 'regalo', 'bono', 'especial', 'rebaja'])) {
            return '🎉 <strong>PROMOCIONES VIGENTES</strong>\n\n🎁 <strong>PRIMERA COMPRA</strong>: 20% descuento (máx $20)\n👥 <strong>REFERIDOS</strong>: $500 crédito cada uno\n📅 <strong>MARTES</strong>: -15% en TODO\n🎓 <strong>ESTUDIANTES</strong>: 10% permanente\n👵 <strong>TERCERA EDAD</strong>: Envío GRATIS\n🎪 <strong>CUMPLEAÑOS</strong>: Regalo sorpresa\n\n📌 <strong>Código actual:</strong> BIENDRON2024\n⏰ Válido todo el mes\n\n💡 Revisa la app cada semana por nuevas ofertas';
        }
        
        // SOPORTE Y PROBLEMAS
        if (this.matchesIntent(lower, ['soporte', 'ayuda', 'problema', 'queja', 'error', 'no funciona', 'contacto', 'reclamación', 'reportar'])) {
            return '📞 <strong>SOPORTE AL CLIENTE 24/7</strong>\n\n📱 WhatsApp: +34 666 123 456\n☎️ Teléfono: +34 912 345 678\n📧 Email: soporte@dron.es\n💬 Chat en vivo: Aquí estoy\n🌐 Web: www.dron.es/help\n\n⏰ <strong>Tiempo de respuesta:</strong> Menos de 2 horas\n✅ <strong>Garantía:</strong> 100% satisfecho o te reembolsamos\n\n🤝 Tu satisfacción es nuestra prioridad';
        }
        
        // FAVORITOS
        if (this.matchesIntent(lower, ['favorito', 'guardado', 'me gusta', 'guardar', 'favorites', 'corazón', 'amar'])) {
            return '❤️ <strong>TUS RESTAURANTES FAVORITOS</strong>\n\n<strong>¿Cómo guardar favoritos?</strong>\n1️⃣ Toca el corazón ❤️ en cualquier restaurante\n2️⃣ Se guardará automáticamente\n3️⃣ Aparecerá en \"Tus Restaurantes Favoritos\"\n4️⃣ Acceso rápido desde la home\n\n💡 <strong>Ventajas:</strong>\n⚡ Pedidos más rápidos\n📌 Tus favs siempre a mano\n🔔 Notificaciones de ofertas\n⭐ Seguimiento de puntos\n\n❌ Toca el corazón de nuevo para eliminar';
        }
        
        // MI CUENTA Y PERFIL
        if (this.matchesIntent(lower, ['cuenta', 'perfil', 'usuario', 'datos', 'editar', 'cambiar', 'contraseña', 'email'])) {
            return '👤 <strong>MI CUENTA - GESTIONA TUS DATOS</strong>\n\n<strong>En tu perfil puedes:</strong>\n🔐 Cambiar contraseña\n📧 Actualizar email\n📱 Teléfono de contacto\n📍 Direcciones guardadas\n💳 Métodos de pago\n🎁 Mis cupones\n📜 Historial completo\n⭐ Mis reseñas\n🔔 Preferencias notificaciones\n\n🔒 Tus datos están 100% protegidos\n🛡️ Cumplimos GDPR';
        }
        
        // HISTORIAL DE PEDIDOS
        if (this.matchesIntent(lower, ['historial', 'pedidos', 'anteriores', 'mis pedidos', 'ver pedidos', 'pasados'])) {
            return '📜 <strong>TU HISTORIAL DE PEDIDOS</strong>\n\n<strong>Accede en:</strong> Perfil → Historial\n\n<strong>Verás:</strong>\n📅 Fecha y hora exacta\n🍽️ Qué pediste (detalle completo)\n💰 Precio total pagado\n💳 Método de pago usado\n⭐ Tu calificación\n📝 Tus comentarios\n\n<strong>Funciones rápidas:</strong>\n🔄 Repetir pedido con UN clic\n📍 Ver dirección de entrega\n⭐ Editar calificación\n📬 Reclamo/Devolución\n\n💡 Puedes descargar un PDF de cada pedido';
        }
        
        // CALIFICACIONES Y RESEÑAS
        if (this.matchesIntent(lower, ['calificación', 'reseña', 'review', 'opinión', 'valoración', 'crítica', 'rating', 'estrellas'])) {
            return '⭐ CALIFICACIONES Y RESEÑAS\n\n¿Por qué calificar?\n✅ Ayudas a otros usuarios\n✅ Ganas puntos de fidelización\n✅ Tus opiniones importan\n\nDespués de cada pedido:\n1️⃣ Abre tu pedido en historial\n2️⃣ Toca "Calificar"\n3️⃣ Selecciona 1-5 estrellas\n4️⃣ Escribe tu opinión\n\n🏆 Beneficios:\n⬆️ Los mejores aparecen primero\n🎁 Reseñas destacadas ganan premios\n💬 Los restaurantes responden\n📱 Comunidad activa';
        }
        
        // CANCELACIÓN Y DEVOLUCIONES
        if (this.matchesIntent(lower, ['cancelar', 'anular', 'devolución', 'refund', 'dinero', 'reembolso', 'cancelación'])) {
            return '❌ POLÍTICA DE CANCELACIÓN\n\n⏰ VENTANA: 5 minutos desde confirmación\n\n✅ Si cancelas a tiempo:\n💰 Reembolso 100%\n📲 En tu método de pago original\n⚡ En 24-48 horas\n\n❌ Después de 5 minutos:\nPueden aplicarse cargos por preparación\n\n💡 Alternativas:\n🔄 Cambiar dirección\n✏️ Modificar productos\n📞 Contacta soporte para excepciones';
        }
        
        // DESPEDIDAS
        if (this.matchesIntent(lower, ['gracias', 'thanks', 'ok', 'listo', 'vale', 'bye', 'adiós', 'chao', 'hasta'])) {
            return '¡Gracias por usar Dron Delivery! 👋\n\nSi necesitas algo más en cualquier momento, estaré aquí 24/7.\n\n🚀 ¡Que disfrutes tu pedido! 🍽️';
        }
        
        // RESPUESTA POR DEFECTO
        if (!input.trim()) {
            return '📝 Escribe algo para que pueda ayudarte...';
        }
        
        return `🤔 Pregunta interesante sobre "${input}"\n\nPuedo ayudarte con:\n\n🍽️ Restaurantes: Mostrar opciones, menús, horarios\n🛒 Pedidos: Cómo hacer, repetir, cancelar\n💳 Pagos: Métodos, seguridad, reembolsos\n📍 Entregas: Rastreo, zonas, tiempos\n🎁 Ofertas: Promociones, cupones, descuentos\n❤️ Favoritos: Guardar restaurantes\n📞 Soporte: Ayuda técnica\n\n¿Algo específico que necesites? 😊`;
    }
    
    matchesIntent(input, keywords) {
        return keywords.some(keyword => input.includes(keyword));
    }
    
    getRestaurantPath(filename) {
        // Obtener la URL actual
        const currentURL = new URL(window.location);
        // Cambiar el nombre del archivo
        currentURL.pathname = currentURL.pathname.replace(/[^/]*$/, filename);
        return currentURL.toString();
    }
    
    showRestaurants() {
        const restaurantHTML = this.restaurants
            .map(r => `<a href="${this.getRestaurantPath(r.link)}" style="display: block; margin: 5px 0; color: #FF6B35; font-weight: 600;">🍽️ ${r.name} - ${r.type}</a>`)
            .join('');
        
        return `<strong>Nuestros Restaurantes:</strong><br>${restaurantHTML}`;
    }
}

// Inicializar cuando el DOM esté listo
function initChatbot() {
    // Solo inicializar si no está ya inicializado
    if (!window.__chatbotInitialized) {
        try {
            new ChatbotIA();
            window.__chatbotInitialized = true;
        } catch (err) {
            console.error('Error initializing chatbot:', err);
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
} else {
    initChatbot();
}

