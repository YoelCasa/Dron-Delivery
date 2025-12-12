// ============================================================
// historial.js - Gestión del historial de pedidos
// ============================================================

class OrderHistory {
    constructor() {
        this.storageKey = 'userOrders';
        this.loadOrders();
        this.init();
    }

    // Inicializar la página de historial
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            // Solo renderizar en historial.html
            if (window.location.pathname.includes('historial.html')) {
                this.renderOrderHistory();
                this.setupEventListeners();
            }
        });
    }

    // Cargar pedidos del localStorage
    loadOrders() {
        const stored = localStorage.getItem(this.storageKey);
        this.orders = stored ? JSON.parse(stored) : [];
    }

    // Guardar pedidos en localStorage
    saveOrders() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.orders));
    }

    // Añadir un nuevo pedido al historial
    addOrder(orderData) {
        const order = {
            id: 'ORDER-' + Date.now(),
            date: new Date().toISOString(),
            items: orderData.items || [],
            subtotal: orderData.subtotal || 0,
            shipping: orderData.shipping || 2.99,
            service: orderData.service || 3.00,
            total: orderData.total || 0,
            address: orderData.address || {},
            promotion: orderData.promotion || null,
            paymentMethod: orderData.paymentMethod || 'card',
            status: 'pending',
            deliveryToken: 'DRON-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
            estimatedDelivery: new Date(Date.now() + 30 * 60000).toISOString()
        };

        this.orders.unshift(order);
        this.saveOrders();
        
        // Guardar datos para el QR - datos simplificados y validados
        try {
            const qrData = {
                deliveryToken: order.deliveryToken,
                orderId: order.id,
                items: order.items.map(item => ({ 
                    name: item.name || 'Producto', 
                    quantity: item.quantity || 1,
                    price: item.price || 0
                })),
                total: order.total || 0,
                subtotal: order.subtotal || 0,
                address: (order.address && order.address.address) ? order.address.address : 'Dirección a confirmar',
                paymentMethod: order.paymentMethod || 'card',
                estimatedDelivery: order.estimatedDelivery || new Date().toISOString(),
                timestamp: order.timestamp || new Date().toISOString()
            };
            
            console.log('💾 Guardando datos QR:', qrData);
            localStorage.setItem('lastOrderDetailsForQR', JSON.stringify(qrData));
        } catch (error) {
            console.error('Error guardando datos para QR:', error);
        }
        
        return order;
    }

    // Renderizar el historial
    renderOrderHistory() {
        const historySection = document.querySelector('.history-section');
        const appContent = document.querySelector('.app-content');

        if (!appContent) return;

        // Limpiar contenido anterior
        const existingHistory = appContent.querySelector('.orders-history-container');
        if (existingHistory) {
            existingHistory.remove();
        }

        // Si no hay pedidos, mostrar estado vacío
        if (this.orders.length === 0) {
            this.renderEmptyState(appContent);
        } else {
            this.renderOrdersList(appContent);
        }
    }

    // Mostrar estado vacío
    renderEmptyState(container) {
        const emptyHTML = `
            <div class="orders-history-container empty-state">
                <div class="empty-icon">
                    <i class='bx bx-inbox'></i>
                </div>
                <h2>Sin pedidos aún</h2>
                <p>Cuando hagas tu primer pedido, aparecerá aquí.</p>
                <a href="home.html" class="btn-empty-cta">Explorar restaurantes</a>
            </div>
        `;

        const wrapper = document.createElement('div');
        wrapper.innerHTML = emptyHTML;
        container.appendChild(wrapper.firstElementChild);
    }

    // Mostrar lista de pedidos
    renderOrdersList(container) {
        const ordersHTML = `
            <div class="orders-history-container">
                <h1>Mis Pedidos</h1>
                <div class="orders-list">
                    ${this.orders.map(order => this.createOrderCard(order)).join('')}
                </div>
            </div>
        `;

        const wrapper = document.createElement('div');
        wrapper.innerHTML = ordersHTML;
        container.appendChild(wrapper.firstElementChild);

        // Agregar event listeners a cada tarjeta
        this.orders.forEach((order, index) => {
            const card = document.querySelector(`[data-order-id="${order.id}"]`);
            if (card) {
                card.addEventListener('click', () => this.showOrderDetails(order));
            }
        });
    }

    // Crear tarjeta de pedido
    createOrderCard(order) {
        const date = new Date(order.date);
        const dateStr = date.toLocaleDateString('es-ES', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const itemCount = order.items.length;
        const itemsText = itemCount === 1 ? '1 item' : `${itemCount} items`;

        return `
            <div class="order-card" data-order-id="${order.id}">
                <div class="order-card-header">
                    <div class="order-info">
                        <p class="order-id">${order.id}</p>
                        <p class="order-date">${dateStr}</p>
                    </div>
                    <div class="order-status ${order.status}">
                        ${this.getStatusText(order.status)}
                    </div>
                </div>

                <div class="order-card-details">
                    <p class="order-items">${itemsText}</p>
                    <p class="order-total">$${order.total.toFixed(2)}</p>
                </div>

                <div class="order-card-footer">
                    <p class="order-address">
                        <i class='bx bx-map-pin'></i>
                        ${order.address.label || 'Dirección'} - ${order.address.address || 'No especificada'}
                    </p>
                </div>
            </div>
        `;
    }

    // Obtener texto de estado
    getStatusText(status) {
        const statuses = {
            'completed': '✓ Entregado',
            'pending': '⏳ Pendiente',
            'cancelled': '✗ Cancelado'
        };
        return statuses[status] || status;
    }

    // Mostrar detalles del pedido en modal
    showOrderDetails(order) {
        const modal = document.createElement('div');
        modal.className = 'order-details-modal-overlay';
        modal.innerHTML = `
            <div class="order-details-modal">
                <div class="modal-header">
                    <h2>Detalles del Pedido</h2>
                    <i class='bx bx-x close-modal'></i>
                </div>

                <div class="modal-content">
                    <div class="detail-section">
                        <div class="section-title">Información del Pedido</div>
                        <div class="detail-row">
                            <span class="label">Número de Pedido</span>
                            <span class="value">${order.id}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Fecha</span>
                            <span class="value">${new Date(order.date).toLocaleDateString('es-ES', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Estado</span>
                            <span class="value status ${order.status}">${this.getStatusText(order.status)}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Token de Entrega (QR)</span>
                            <span class="value">${order.deliveryToken || 'N/A'}</span>
                        </div>
                    </div>

                    <div class="detail-section">
                        <div class="section-title">Items del Pedido</div>
                        <div class="items-list">
                            ${order.items.map(item => `
                                <div class="item-row">
                                    <div class="item-name">${item.name}</div>
                                    <div class="item-price">
                                        <span class="qty">x${item.quantity}</span>
                                        <span class="price">$${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="detail-section">
                        <div class="section-title">Dirección de Entrega</div>
                        <div class="address-detail">
                            <p class="label-detail">${order.address.label || 'Dirección'}</p>
                            <p class="address-text">${order.address.address || 'No especificada'}</p>
                            ${order.address.latitude ? `
                                <p class="coordinates">
                                    ${order.address.latitude.toFixed(4)}°, ${order.address.longitude.toFixed(4)}°
                                </p>
                            ` : ''}
                        </div>
                    </div>

                    <div class="detail-section">
                        <div class="section-title">Resumen</div>
                        <div class="cost-summary">
                            <div class="cost-row">
                                <span>Subtotal</span>
                                <span>$${order.subtotal.toFixed(2)}</span>
                            </div>
                            <div class="cost-row">
                                <span>Envío</span>
                                <span>$${order.shipping.toFixed(2)}</span>
                            </div>
                            <div class="cost-row">
                                <span>Servicio</span>
                                <span>$${order.service.toFixed(2)}</span>
                            </div>
                            ${order.promotion ? `
                                <div class="cost-row discount">
                                    <span>${order.promotion.title}</span>
                                    <span>-$${order.promotion.discount.toFixed(2)}</span>
                                </div>
                            ` : ''}
                            <div class="cost-row total">
                                <span>Total</span>
                                <span>$${order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div class="detail-section">
                        <div class="section-title">Información Adicional</div>
                        <div class="detail-row">
                            <span class="label">Método de Pago</span>
                            <span class="value">${this.getPaymentMethodText(order.paymentMethod)}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Entrega Estimada</span>
                            <span class="value">${new Date(order.estimatedDelivery).toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</span>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn-secondary close-modal">Cerrar</button>
                    <button class="btn-primary repeat-order">Repetir Pedido</button>
                </div>
            </div>
        `;

        const mobileFrame = document.querySelector('.mobile-frame');
        if (mobileFrame) {
            mobileFrame.appendChild(modal);

            // Event listeners
            modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
            modal.querySelector('.order-details-modal').addEventListener('click', (e) => {
                if (e.target === modal) modal.remove();
            });

            // Botón repetir pedido
            modal.querySelector('.repeat-order').addEventListener('click', () => {
                this.repeatOrder(order);
                modal.remove();
            });

            // Cerrar al hacer clic fuera
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.remove();
            });
        }
    }

    // Obtener texto del método de pago
    getPaymentMethodText(method) {
        const methods = {
            'card': '💳 Tarjeta',
            'paypal': '🅿️ PayPal',
            'cash': '💵 Efectivo',
            'wallet': '👛 Billetera Digital'
        };
        return methods[method] || method;
    }

    // Repetir un pedido anterior
    repeatOrder(order) {
        // Guardar los items del pedido anterior en el carrito
        localStorage.setItem('tempCart', JSON.stringify(order.items));
        
        // Navegar a home para que seleccione de nuevo
        window.location.href = 'home.html';
    }

    // Setup event listeners
    setupEventListeners() {
        // Cerrar modales
        document.addEventListener('click', (e) => {
            const closeBtn = e.target.closest('.close-modal');
            if (closeBtn) {
                const modal = closeBtn.closest('.order-details-modal-overlay');
                if (modal) modal.remove();
            }
        });
    }
}

// Inicializar historial cuando cargue la página
const orderHistory = new OrderHistory();