// ============================================================
// checkout.js - Funcionalidades de la pantalla de pago
// ============================================================

// Datos de promociones disponibles
const PROMOTIONS = [
    {
        id: 'PROMO10',
        title: '10% de descuento',
        description: 'En tu primer pedido',
        code: 'PROMO10',
        discount: 0.10,
        minAmount: 15,
        icon: '🎉'
    },
    {
        id: 'GRATIS5',
        title: 'Envío gratis',
        description: 'En pedidos mayores a $30',
        code: 'GRATIS5',
        discount: 0,
        freeShipping: true,
        minAmount: 30,
        icon: '🚚'
    },
    {
        id: 'DRON20',
        title: '20% en drones',
        description: 'Código exclusivo para drones',
        code: 'DRON20',
        discount: 0.20,
        minAmount: 25,
        icon: '🚁'
    }
];

// Direcciones guardadas del usuario
const SAVED_ADDRESSES = [
    {
        id: 1,
        label: 'Casa',
        address: 'Calle Principal 123, Apto 4B',
        latitude: 40.7128,
        longitude: -74.0060
    },
    {
        id: 2,
        label: 'Trabajo',
        address: 'Av. Comercial 456, Oficina 200',
        latitude: 40.7580,
        longitude: -73.9855
    }
];

let selectedPromotion = null;
let selectedAddress = null;
let selectedPaymentMethod = 'card';

// ============================================================
// Inicialización
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    initializePromotions();
    initializeAddressSection();
    initializePaymentMethods();
    setupEventListeners();
    updatePlaceOrderButtonState();
});

// ============================================================
// Gestión de Promociones
// ============================================================
function initializePromotions() {
    const promosContainer = document.getElementById('promos-container');
    
    if (!promosContainer) return;
    
    promosContainer.innerHTML = '';
    
    PROMOTIONS.forEach(promo => {
        const promoCard = createPromoCard(promo);
        promosContainer.appendChild(promoCard);
    });
}

function createPromoCard(promo) {
    const card = document.createElement('div');
    card.className = 'promo-card';
    card.innerHTML = `
        <div class="promo-info">
            <p class="promo-title">${promo.icon} ${promo.title}</p>
            <p class="promo-desc">${promo.description}</p>
        </div>
        <div class="promo-code-badge">${promo.code}</div>
    `;
    
    card.addEventListener('click', () => selectPromotion(promo, card));
    
    return card;
}

function selectPromotion(promo, cardElement) {
    // Verificar si ya está seleccionada la misma promoción
    if (selectedPromotion && selectedPromotion.id === promo.id) {
        showToast('⚠️ Esta promoción ya está seleccionada', false, true);
        return;
    }
    
    // Remover clase active de todas las tarjetas
    document.querySelectorAll('.promo-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Añadir clase active a la tarjeta seleccionada
    cardElement.classList.add('active');
    selectedPromotion = promo;
    
    // Rellenar automáticamente el código de promoción
    const promoInput = document.getElementById('promo-code');
    if (promoInput) {
        promoInput.value = promo.code;
    }
    
    showToast(`${promo.icon} ${promo.title} seleccionada`);
    updateCartTotals();
}

function applyPromoCode() {
    const promoInput = document.getElementById('promo-code');
    const code = promoInput.value.trim().toUpperCase();
    
    if (!code) {
        showToast('Por favor ingresa un código de promoción');
        return;
    }
    
    const promo = PROMOTIONS.find(p => p.code === code);
    
    if (promo) {
        const promoCard = Array.from(document.querySelectorAll('.promo-card'))
            .find(card => card.querySelector('.promo-code-badge').textContent === code);
        
        if (promoCard) {
            selectPromotion(promo, promoCard);
            showToast(`✓ Código "${code}" aplicado exitosamente`);
        }
    } else {
        showToast('❌ Código de promoción inválido', true);
        promoInput.style.borderColor = '#d32f2f';
        setTimeout(() => {
            promoInput.style.borderColor = '#e0e0e0';
        }, 1500);
    }
}

// ============================================================
// Gestión de Dirección
// ============================================================
function initializeAddressSection() {
    const deliveryInfo = document.querySelector('.delivery-info');
    
    if (!deliveryInfo) return;
    
    deliveryInfo.addEventListener('click', openAddressSelector);
}

function openAddressSelector() {
    // Crear modal de selección de dirección
    const modal = document.createElement('div');
    modal.className = 'address-modal-overlay';
    modal.innerHTML = `
        <div class="address-modal">
            <div class="modal-header">
                <h2>Seleccionar ubicación</h2>
                <i class='bx bx-x close-modal'></i>
            </div>
            
            <div class="modal-content">
                <div class="saved-addresses">
                    ${SAVED_ADDRESSES.map(addr => `
                        <div class="address-option" data-id="${addr.id}">
                            <i class='bx bx-map-pin'></i>
                            <div class="address-option-info">
                                <p class="address-label">${addr.label}</p>
                                <p class="address-text">${addr.address}</p>
                            </div>
                            <i class='bx bx-chevron-right'></i>
                        </div>
                    `).join('')}
                </div>
                
                <div class="modal-divider">o</div>
                
                <button class="add-new-address-btn">
                    <i class='bx bx-plus'></i> Añadir nueva dirección
                </button>
            </div>
        </div>
    `;
    
    // Agregar el modal dentro del mobile-frame
    const mobileFrame = document.querySelector('.mobile-frame');
    mobileFrame.appendChild(modal);
    
    // Event listeners
    modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    document.querySelectorAll('.address-option').forEach(option => {
        option.addEventListener('click', () => {
            const id = option.dataset.id;
            const address = SAVED_ADDRESSES.find(a => a.id == id);
            selectAddress(address);
            modal.remove();
        });
    });
    
    modal.querySelector('.add-new-address-btn').addEventListener('click', () => {
        openAddressForm(modal);
    });
}

function selectAddress(address) {
    selectedAddress = address;
    const addressElement = document.getElementById('selected-address');
    
    if (addressElement) {
        addressElement.textContent = address.address;
    }
    
    showToast(`📍 Dirección actualizada: ${address.label}`);
    updatePlaceOrderButtonState();
    updateCartTotals();
}

function updatePlaceOrderButtonState() {
    const placeOrderBtn = document.getElementById('btn-place-order');
    if (placeOrderBtn) {
        if (selectedAddress) {
            placeOrderBtn.disabled = false;
            placeOrderBtn.style.opacity = '1';
            placeOrderBtn.style.cursor = 'pointer';
        } else {
            placeOrderBtn.disabled = true;
            placeOrderBtn.style.opacity = '0.5';
            placeOrderBtn.style.cursor = 'not-allowed';
        }
    }
}

function openAddressForm(modal) {
    const formOverlay = document.createElement('div');
    formOverlay.className = 'address-form-overlay';
    formOverlay.innerHTML = `
        <div class="address-form">
            <div class="modal-header">
                <h2>Nueva dirección</h2>
                <i class='bx bx-x close-form'></i>
            </div>
            
            <div class="modal-content">
                <div class="form-group">
                    <label for="label-input">Etiqueta (Casa, Trabajo, etc.)</label>
                    <input type="text" id="label-input" placeholder="Ej: Casa" class="form-input">
                </div>
                
                <div class="form-group">
                    <label for="address-input">Dirección completa</label>
                    <input type="text" id="address-input" placeholder="Ej: Calle Principal 123, Apto 4B" class="form-input">
                </div>
                
                <div class="form-group">
                    <label for="reference-input">Referencia (opcional)</label>
                    <input type="text" id="reference-input" placeholder="Ej: Edificio azul, puerta roja" class="form-input">
                </div>
                
                <div class="form-buttons">
                    <button class="btn-cancel close-form">Cancelar</button>
                    <button class="btn-save save-address-btn">Guardar dirección</button>
                </div>
            </div>
        </div>
    `;
    
    // Agregar el formulario dentro del mobile-frame
    const mobileFrame = document.querySelector('.mobile-frame');
    mobileFrame.appendChild(formOverlay);
    
    formOverlay.querySelector('.close-form').addEventListener('click', () => {
        formOverlay.remove();
        modal.remove();
    });
    
    formOverlay.addEventListener('click', (e) => {
        if (e.target === formOverlay) {
            formOverlay.remove();
            modal.remove();
        }
    });
    
    formOverlay.querySelector('.save-address-btn').addEventListener('click', () => {
        const label = document.getElementById('label-input').value.trim();
        const address = document.getElementById('address-input').value.trim();
        const reference = document.getElementById('reference-input').value.trim();
        
        if (!label || !address) {
            showToast('Por favor completa los campos requeridos', true);
            return;
        }
        
        const newAddress = {
            id: SAVED_ADDRESSES.length + 1,
            label: label,
            address: address,
            reference: reference,
            latitude: 0,
            longitude: 0
        };
        
        SAVED_ADDRESSES.push(newAddress);
        selectAddress(newAddress);
        formOverlay.remove();
    });
}

// ============================================================
// Gestión de Métodos de Pago
// ============================================================
function initializePaymentMethods() {
    const paymentOptions = document.querySelectorAll('.payment-option input[type="radio"]');
    
    paymentOptions.forEach(option => {
        option.addEventListener('change', (e) => {
            selectedPaymentMethod = e.target.value;
        });
    });
}

// ============================================================
// Actualizar Totales del Carrito
// ============================================================
function updateCartTotals() {
    const subtotalEl = document.getElementById('cart-subtotal');
    const shippingEl = document.getElementById('cart-shipping');
    const serviceEl = document.getElementById('cart-service');
    const totalEl = document.getElementById('cart-total');
    
    if (!subtotalEl) return;
    
    // Obtener subtotal (hardcodeado para demo, en producción vendría del carrito real)
    let subtotal = 35.99;
    let shipping = 2.99;
    let service = 3.00;
    
    // Aplicar promoción de descuento
    if (selectedPromotion) {
        if (selectedPromotion.discount > 0) {
            const discount = subtotal * selectedPromotion.discount;
            subtotal -= discount;
        }
        if (selectedPromotion.freeShipping) {
            shipping = 0;
        }
    }
    
    const total = subtotal + shipping + service;
    
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    shippingEl.textContent = `$${shipping.toFixed(2)}`;
    serviceEl.textContent = `$${service.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
}

// ============================================================
// Event Listeners
// ============================================================
function setupEventListeners() {
    const applyPromoBtn = document.getElementById('apply-promo-btn');
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', applyPromoCode);
    }
    
    const promoInput = document.getElementById('promo-code');
    if (promoInput) {
        promoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                applyPromoCode();
            }
        });
    }

    // Botón de hacer pedido
    const placeOrderBtn = document.getElementById('btn-place-order');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', (e) => {
            e.preventDefault();
            confirmOrder();
        });
    }

    // Escuchar cambios en método de pago
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    paymentOptions.forEach(option => {
        option.addEventListener('change', (e) => {
            selectedPaymentMethod = e.target.value;
        });
    });
}

// ============================================================
// Confirmación y Guardado de Pedido
// ============================================================
function confirmOrder() {
    console.log('confirmOrder() llamado. selectedAddress:', selectedAddress);
    
    // Validar que haya dirección
    if (!selectedAddress) {
        console.error('ERROR: No hay dirección seleccionada');
        showToast('Por favor selecciona una dirección de entrega', true);
        return;
    }

    // Validar que haya items en el carrito
    const cart = getCartFromStorage();
    if (!cart || cart.length === 0) {
        console.error('ERROR: Carrito vacío');
        showToast('Tu carrito está vacío', true);
        return;
    }

    console.log('Validaciones pasadas. Procesando pedido...');

    // Mostrar botón en estado de carga
    const placeOrderBtn = document.getElementById('btn-place-order');
    const originalText = placeOrderBtn.textContent;
    placeOrderBtn.disabled = true;
    placeOrderBtn.innerHTML = '<i class="bx bx-loader-alt" style="animation: spin 1s linear infinite;"></i> Procesando...';

    // Simular proceso de 1.5 segundos
    setTimeout(() => {
        // Obtener datos del pedido
        const subtotal = calculateSubtotal(cart);
        const shipping = selectedPromotion?.freeShipping ? 0 : 2.99;
        const service = 3.00;
        const discountAmount = selectedPromotion ? (subtotal * selectedPromotion.discount) : 0;
        const total = subtotal + shipping + service - discountAmount;

        // Crear objeto de pedido
        const orderData = {
            items: cart,
            subtotal: subtotal,
            shipping: shipping,
            service: service,
            total: total,
            address: selectedAddress,
            promotion: selectedPromotion ? {
                title: selectedPromotion.title,
                discount: discountAmount
            } : null,
            paymentMethod: selectedPaymentMethod
        };

        // Guardar el pedido en localStorage usando historial.js
        if (typeof orderHistory !== 'undefined') {
            const savedOrder = orderHistory.addOrder(orderData);
            console.log('Pedido guardado exitosamente:', savedOrder);
        } else {
            console.warn('orderHistory no está definido');
        }

        // Mostrar overlay de éxito
        showSuccessOverlay();

        // Limpiar carrito
        localStorage.removeItem('shoppingCart');

        // Redirigir después de 3.5 segundos para que vea la animación
        setTimeout(() => {
            window.location.href = 'historial.html';
        }, 3500);
    }, 1500);
}

// Obtener carrito del localStorage
function getCartFromStorage() {
    // Buscar en ambas posibles keys
    let cart = localStorage.getItem('shoppingCart');
    if (!cart) {
        cart = localStorage.getItem('cart');
    }
    return cart ? JSON.parse(cart) : [];
}

// Calcular subtotal del carrito
function calculateSubtotal(cart) {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Mostrar overlay de éxito
function showSuccessOverlay() {
    const overlay = document.getElementById('success-overlay');
    if (overlay) {
        overlay.classList.add('visible');
        overlay.classList.remove('hidden');
    }
    showToast('¡Pedido confirmado exitosamente!');
}

// ============================================================
function showToast(message, isError = false, isWarning = false) {
    const container = document.getElementById('notifications-container');
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    if (isError) {
        notification.classList.add('error');
        notification.innerHTML = `<span class="icon">❌</span><span>${message}</span>`;
    } else if (isWarning) {
        notification.classList.add('warning');
        notification.innerHTML = `<span class="icon">⚠️</span><span>${message}</span>`;
    } else {
        notification.classList.add('info');
        notification.innerHTML = `<span class="icon">✓</span><span>${message}</span>`;
    }
    
    container.appendChild(notification);
    
    // Auto-eliminar después de 3 segundos
    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
