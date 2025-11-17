document.addEventListener('DOMContentLoaded', () => {

    // --- Seleccion de Elementos ---
    const rootHtml = document.documentElement; // Selecciona el <html>
    
    // 1. Elementos del Modo Oscuro
    const themeToggle = document.getElementById('dark-mode-toggle');
    const currentTheme = localStorage.getItem('theme');

    // 2. Elementos de Accesibilidad
    const accessibilityForm = document.getElementById('accessibility-form');
    const visionRadios = document.querySelectorAll('input[name="vision-mode"]');
    const currentAccessibility = localStorage.getItem('accessibility');
    const accessibilityModes = ['protanopia', 'deuteranopia', 'acromatopsia', 'normal'];

    
    // --- LÓGICA AL CARGAR CUALQUIER PÁGINA ---

    // 1. Aplicar Tema Oscuro guardado
    if (currentTheme === 'dark') {
        rootHtml.classList.add('dark-mode');
        if (themeToggle) { // Si estamos en perfil.html
            themeToggle.checked = true;
        }
    }

    // 2. Aplicar Modo Accesibilidad guardado
    if (currentAccessibility && currentAccessibility !== 'normal') {
        rootHtml.classList.add(currentAccessibility);
    }
    
    // 3. Marcar la opción de accesibilidad guardada (si estamos en accesibilidad.html)
    if (accessibilityForm) {
        let radioToCheck = currentAccessibility || 'normal';
        const checkedRadio = document.querySelector(`input[value="${radioToCheck}"]`);
        if (checkedRadio) {
            checkedRadio.checked = true;
        }
    }


    // --- LÓGICA DE LOS INTERRUPTORES (Listeners) ---

    // 1. Listener para el Modo Oscuro (solo en perfil.html)
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

    // 2. Listener para el Modo Accesibilidad (solo en accesibilidad.html)
    if (accessibilityForm) {
        // ... (tu código de accesibilidad)
    }

    // --- LÓGICA DE VALIDACIÓN DE INICIO DE SESIÓN ---
    const emailInput = document.getElementById('email-input');
    // ... (tu código de validación)

    // --- LÓGICA DE SCROLL HORIZONTAL CON FLECHAS EN HOME ---
    const arrowScroll1 = document.getElementById('arrow-scroll-1');
    // ... (tu código de scroll)


    // ----------------------------------------------
    // --- LÓGICA DEL CARRITO DE COMPRAS (ACTUALIZADA) ---
    // ----------------------------------------------

    // --- Funciones base del carrito ---

    function getCart() {
        return JSON.parse(localStorage.getItem('shoppingCart')) || [];
    }

    function saveCart(cart) {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }

    function addToCart(itemToAdd) {
        let cart = getCart();
        if (!itemToAdd.id || !itemToAdd.name) {
            console.error("Se intentó añadir un item inválido:", itemToAdd);
            return; 
        }
        const existingItemIndex = cart.findIndex(item => item.id === itemToAdd.id);
        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            itemToAdd.quantity = 1;
            cart.push(itemToAdd);
        }
        saveCart(cart);
        // Devolvemos la nueva cantidad
        return cart.find(item => item.id === itemToAdd.id).quantity;
    }

    /**
     * Resta un item del carrito.
     * Si la cantidad llega a 0, elimina el item.
     * @param {string} itemId - El ID del item a restar.
     * @returns {number} - La nueva cantidad (0 si se eliminó).
     */
    function decreaseCartItem(itemId) {
        let cart = getCart();
        const existingItemIndex = cart.findIndex(item => item.id === itemId);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity -= 1;
            // Si la cantidad es 0, eliminamos el item del array
            if (cart[existingItemIndex].quantity === 0) {
                cart.splice(existingItemIndex, 1);
                saveCart(cart);
                return 0; // Se eliminó
            } else {
                // Si no es 0, solo guardamos
                saveCart(cart);
                return cart[existingItemIndex].quantity; // Devolvemos nueva cantidad
            }
        }
        return 0; // No se encontró
    }

    function removeFromCart(itemId) {
        let cart = getCart();
        cart = cart.filter(item => item.id !== itemId);
        saveCart(cart);
    }

    function showQuickAlert(message) {
        // ... (tu código de alerta)
    }


    // --- LÓGICA PARA LA PÁGINA DE 'casaPepe.html' (ACTUALIZADA) ---

    const productList = document.querySelector('.product-list');
    
    if (productList) {
        
        /**
         * Actualiza la vista de UN producto (botón + o selector - 1 +)
         * @param {string} itemId - El ID del producto a actualizar
         * @param {number} quantity - La cantidad actual (0 si no está en el carrito)
         */
        function updateProductView(itemId, quantity) {
            const productItem = document.querySelector(`.product-item[data-id="${itemId}"]`);
            if (!productItem) return;

            const addBtn = productItem.querySelector('.add-btn');
            const quantitySelector = productItem.querySelector('.quantity-selector');
            const quantityCount = productItem.querySelector('.quantity-count');

            if (quantity > 0) {
                // Mostrar selector, ocultar botón '+'
                addBtn.style.display = 'none';
                quantitySelector.style.display = 'flex';
                quantityCount.textContent = quantity;
            } else {
                // Mostrar botón '+', ocultar selector
                addBtn.style.display = 'inline-flex';
                quantitySelector.style.display = 'none';
                quantityCount.textContent = 0;
            }
        }

        /**
         * Revisa el carrito al cargar la página y actualiza
         * la vista de TODOS los productos.
         */
        function updateAllProductViews() {
            const cart = getCart();
            const allProducts = document.querySelectorAll('.product-item');
            
            allProducts.forEach(product => {
                const itemId = product.dataset.id;
                const itemInCart = cart.find(item => item.id === itemId);
                
                if (itemInCart) {
                    updateProductView(itemId, itemInCart.quantity);
                } else {
                    updateProductView(itemId, 0);
                }
            });
        }

        /**
         * Obtiene los datos de un item desde el DOM.
         * @param {EventTarget} target - El botón que fue clickeado.
         * @returns {Object} - El objeto del item.
         */
        function getItemDataFromEvent(target) {
            const productItem = target.closest('.product-item');
            if (!productItem) return null;

            return {
                id: productItem.dataset.id,
                name: productItem.dataset.name,
                price: parseFloat(productItem.dataset.price),
                img: productItem.dataset.img,
                brand: productItem.querySelector('.product-details span').textContent
            };
        }

        // --- LISTENERS PARA LA PÁGINA DE PRODUCTOS ---
        
        // 1. Listener para los botones '+' iniciales
        const addButtons = document.querySelectorAll('.add-btn');
        addButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const item = getItemDataFromEvent(e.currentTarget);
                if (item) {
                    const newQuantity = addToCart(item);
                    updateProductView(item.id, newQuantity);
                    if (newQuantity === 1) { // Solo mostrar alerta la primera vez
                        showQuickAlert(`"${item.name}" añadido al carrito!`);
                    }
                }
            });
        });

        // 2. Listener para los botones '+' del selector
        const increaseButtons = document.querySelectorAll('.increase-btn');
        increaseButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const item = getItemDataFromEvent(e.currentTarget);
                if (item) {
                    const newQuantity = addToCart(item); // La función ya maneja el incremento
                    updateProductView(item.id, newQuantity);
                }
            });
        });

        // 3. Listener para los botones '-' del selector
        const decreaseButtons = document.querySelectorAll('.decrease-btn');
        decreaseButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const item = getItemDataFromEvent(e.currentTarget);
                if (item) {
                    const newQuantity = decreaseCartItem(item.id);
                    updateProductView(item.id, newQuantity);
                }
            });
        });

        // --- EJECUCIÓN INICIAL AL CARGAR LA PÁGINA ---
        updateAllProductViews();
    }


    // --- LÓGICA PARA LA PÁGINA DE 'pago.html' (ACTUALIZADA) ---

    const cartContainer = document.getElementById('cart-items-container');

    if (cartContainer) {
        renderCartPage();
    }

    function renderCartPage() {
        const cart = getCart();
        const cartContainer = document.getElementById('cart-items-container');
        
        const subtotalEl = document.getElementById('cart-subtotal');
        const itemCountEl = document.getElementById('cart-item-count');
        const shippingEl = document.getElementById('cart-shipping');
        const serviceEl = document.getElementById('cart-service');
        const totalEl = document.getElementById('cart-total');
        
        cartContainer.innerHTML = '';
        
        let subtotal = 0;
        let totalItems = 0;

        const validCart = cart.filter(item => item.id && item.name);
        if(validCart.length < cart.length) {
             saveCart(validCart);
        }

        if (validCart.length === 0) {
            cartContainer.innerHTML = '<p style="text-align: center; padding: 20px 0; color: #888;">Tu carrito está vacío.</p>';
        } else {
            validCart.forEach(item => {
                const itemSubtotal = item.price * item.quantity;
                subtotal += itemSubtotal;
                totalItems += item.quantity;

                const itemHtml = `
                    <div class="item-card">
                        <img src="${item.img}" alt="${item.name}">
                        <div class="item-details">
                            <p class="brand">${item.brand}</p>
                            <p class="name">${item.name}</p>
                            <p class="quantity">Cantidad: ${item.quantity}</p>
                        </div>
                        <span class="item-price">$${itemSubtotal.toFixed(2)}</span>
                        
                        <!-- Botón de Papelera con SVG -->
                        <button class="cart-delete-btn" data-id="${item.id}">
                            <svg viewBox="0 0 24 24">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
                            </svg>
                        </button>
                    </div>
                `;
                cartContainer.innerHTML += itemHtml;
            });
        }

        // --- CÁLCULO DE TOTALES ---
        const shippingFeeText = (shippingEl ? shippingEl.textContent : '$2,99').replace('$', '').replace(',', '.');
        const serviceFeeText = (serviceEl ? serviceEl.textContent : '$3,00').replace('$', '').replace(',', '.');
        const shippingFee = parseFloat(shippingFeeText) || 2.99;
        const serviceFee = parseFloat(serviceFeeText) || 3.00;
        const total = subtotal + shippingFee + serviceFee;

        if (itemCountEl) itemCountEl.textContent = totalItems;
        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

        // --- Añadir Listeners a los botones de eliminar ---
        addDeleteListeners();
    }

    function addDeleteListeners() {
        const deleteButtons = document.querySelectorAll('.cart-delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const idToDelete = e.currentTarget.dataset.id;
                removeFromCart(idToDelete);
                renderCartPage(); // Volver a dibujar
            });
        });
    }

});