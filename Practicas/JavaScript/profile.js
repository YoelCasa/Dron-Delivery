// ============================================================
// profile.js - Funcionalidades de la pantalla de perfil
// ============================================================

// Datos del usuario
const userProfile = {
    name: 'Daniel García',
    email: 'daniel.garcia@email.com',
    phone: '+34 612 345 678',
    address: 'Calle Principal 123, Apto 4B',
    profilePic: '../imagenes/perfil.jpg',
    joinDate: '15 de Febrero, 2023',
    totalOrders: 47,
    rating: 4.8
};

// Métodos de pago guardados
const savedPaymentMethods = [
    { id: 1, type: 'card', name: 'Visa', last4: '4242', isDefault: true },
    { id: 2, type: 'card', name: 'Mastercard', last4: '5555', isDefault: false }
];

/**
 * Inicializa todos los event listeners del perfil
 */
function initializeProfile() {
    const menuOptions = document.querySelectorAll('.menu-options li a');
    
    menuOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            const text = option.textContent.trim();
            
            // Manejo de opciones específicas
            if (text.startsWith('Tu cuenta')) {
                e.preventDefault();
                openAccountModal();
            } else if (text.startsWith('Privacidad')) {
                e.preventDefault();
                openPrivacyModal();
            } else if (text.startsWith('Seguridad')) {
                e.preventDefault();
                openSecurityModal();
            } else if (text.startsWith('Métodos de Pago') && !option.href.includes('.html')) {
                e.preventDefault();
                openPaymentMethodsModal();
            } else if (text.startsWith('Reseñas')) {
                e.preventDefault();
                openReviewsModal();
            }
        });
    });

    // Inicializar transiciones de página
    initPageTransitions();
}

/**
 * Abre el modal de la cuenta
 */
function openAccountModal() {
    const modal = createModal('Tu Cuenta', `
        <div class="modal-section">
            <div class="profile-info-grid">
                <div class="info-item">
                    <label>Nombre</label>
                    <p>${userProfile.name}</p>
                </div>
                <div class="info-item">
                    <label>Email</label>
                    <p>${userProfile.email}</p>
                </div>
                <div class="info-item">
                    <label>Teléfono</label>
                    <p>${userProfile.phone}</p>
                </div>
                <div class="info-item">
                    <label>Dirección</label>
                    <p>${userProfile.address}</p>
                </div>
                <div class="info-item">
                    <label>Miembro desde</label>
                    <p>${userProfile.joinDate}</p>
                </div>
                <div class="info-item">
                    <label>Total de pedidos</label>
                    <p>${userProfile.totalOrders}</p>
                </div>
            </div>
            <button class="btn-modal-primary" onclick="openEditAccountModal()">
                <i class='bx bx-edit'></i> Editar información
            </button>
        </div>
    `);
}

/**
 * Abre el modal para editar información de la cuenta
 */
function openEditAccountModal() {
    closeLastModal();
    const modal = createModal('Editar Información', `
        <div class="form-section">
            <div class="form-group">
                <label>Nombre</label>
                <input type="text" value="${userProfile.name}" class="form-input">
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" value="${userProfile.email}" class="form-input">
            </div>
            <div class="form-group">
                <label>Teléfono</label>
                <input type="tel" value="${userProfile.phone}" class="form-input">
            </div>
            <div class="form-group">
                <label>Dirección</label>
                <input type="text" value="${userProfile.address}" class="form-input">
            </div>
            <div class="form-buttons">
                <button class="btn-modal-secondary" onclick="closeLastModal()">Cancelar</button>
                <button class="btn-modal-primary" onclick="saveAccountChanges()">Guardar cambios</button>
            </div>
        </div>
    `);
}

/**
 * Guarda los cambios de la cuenta
 */
function saveAccountChanges() {
    showToast('✓ Información actualizada correctamente');
    closeLastModal();
}

/**
 * Abre el modal de privacidad
 */
function openPrivacyModal() {
    const modal = createModal('Privacidad', `
        <div class="modal-section">
            <div class="privacy-options">
                <div class="privacy-item">
                    <div class="privacy-header">
                        <h3>Perfil público</h3>
                        <label class="toggle-switch">
                            <input type="checkbox" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <p class="privacy-desc">Permite que otros usuarios vean tu perfil</p>
                </div>

                <div class="privacy-item">
                    <div class="privacy-header">
                        <h3>Mostrar reseñas</h3>
                        <label class="toggle-switch">
                            <input type="checkbox" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <p class="privacy-desc">Permite que otros vean tus calificaciones</p>
                </div>

                <div class="privacy-item">
                    <div class="privacy-header">
                        <h3>Recibir notificaciones</h3>
                        <label class="toggle-switch">
                            <input type="checkbox" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <p class="privacy-desc">Recibe notificaciones de nuevas ofertas</p>
                </div>

                <div class="privacy-item">
                    <div class="privacy-header">
                        <h3>Compartir datos de ubicación</h3>
                        <label class="toggle-switch">
                            <input type="checkbox" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <p class="privacy-desc">Permite mejorar recomendaciones</p>
                </div>
            </div>
        </div>
    `);
}

/**
 * Abre el modal de seguridad
 */
function openSecurityModal() {
    const modal = createModal('Seguridad', `
        <div class="modal-section">
            <div class="security-options">
                <button class="security-btn">
                    <div class="security-btn-header">
                        <i class='bx bx-lock'></i>
                        <h3>Cambiar contraseña</h3>
                    </div>
                    <p>Actualiza tu contraseña regularmente</p>
                    <i class='bx bx-chevron-right'></i>
                </button>

                <button class="security-btn" onclick="openTwoFactorModal()">
                    <div class="security-btn-header">
                        <i class='bx bx-shield'></i>
                        <h3>Autenticación de dos factores</h3>
                    </div>
                    <p>Añade una capa extra de seguridad</p>
                    <i class='bx bx-chevron-right'></i>
                </button>

                <button class="security-btn">
                    <div class="security-btn-header">
                        <i class='bx bx-history'></i>
                        <h3>Sesiones activas</h3>
                    </div>
                    <p>Gestiona tus dispositivos conectados</p>
                    <i class='bx bx-chevron-right'></i>
                </button>

                <button class="security-btn">
                    <div class="security-btn-header">
                        <i class='bx bx-error-circle'></i>
                        <h3>Actividad sospechosa</h3>
                    </div>
                    <p>Ningún acceso sospechoso detectado</p>
                    <i class='bx bx-check-circle'></i>
                </button>
            </div>
        </div>
    `);
}

/**
 * Abre el modal de dos factores
 */
function openTwoFactorModal() {
    closeLastModal();
    const modal = createModal('Autenticación de Dos Factores', `
        <div class="modal-section">
            <div class="two-factor-content">
                <div class="two-factor-option">
                    <div class="option-header">
                        <i class='bx bx-mobile-alt'></i>
                        <h3>Aplicación autenticadora</h3>
                    </div>
                    <p>Usar una app como Google Authenticator</p>
                    <button class="btn-modal-primary">Configurar</button>
                </div>

                <div class="two-factor-option">
                    <div class="option-header">
                        <i class='bx bx-message-square'></i>
                        <h3>SMS</h3>
                    </div>
                    <p>Recibe códigos por mensaje de texto</p>
                    <button class="btn-modal-primary">Configurar</button>
                </div>

                <div class="two-factor-option">
                    <div class="option-header">
                        <i class='bx bx-envelope'></i>
                        <h3>Email</h3>
                    </div>
                    <p>Recibe códigos a tu email</p>
                    <button class="btn-modal-primary">Configurar</button>
                </div>
            </div>
        </div>
    `);
}

/**
 * Abre el modal de métodos de pago
 */
function openPaymentMethodsModal() {
    const modal = createModal('Métodos de Pago', `
        <div class="modal-section">
            <div class="payment-methods-list">
                ${savedPaymentMethods.map(method => `
                    <div class="payment-method-item">
                        <div class="payment-method-info">
                            <i class='bx bx-credit-card'></i>
                            <div class="payment-info">
                                <p class="method-type">${method.name}</p>
                                <p class="method-number">•••• ${method.last4}</p>
                            </div>
                        </div>
                        <div class="payment-method-actions">
                            ${method.isDefault ? '<span class="badge-default">Predeterminado</span>' : ''}
                            <button class="btn-delete" onclick="deletePaymentMethod(${method.id})">
                                <i class='bx bx-trash'></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button class="btn-modal-primary" onclick="openAddPaymentModal()">
                <i class='bx bx-plus'></i> Añadir método de pago
            </button>
        </div>
    `);
}

/**
 * Abre el modal para añadir un método de pago
 */
function openAddPaymentModal() {
    closeLastModal();
    const modal = createModal('Añadir Método de Pago', `
        <div class="form-section">
            <div class="form-group">
                <label>Número de tarjeta</label>
                <input type="text" placeholder="1234 5678 9012 3456" class="form-input" maxlength="19">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Vencimiento</label>
                    <input type="text" placeholder="MM/YY" class="form-input" maxlength="5">
                </div>
                <div class="form-group">
                    <label>CVV</label>
                    <input type="text" placeholder="123" class="form-input" maxlength="3">
                </div>
            </div>
            <div class="form-group">
                <label>Nombre titular</label>
                <input type="text" placeholder="Juan García" class="form-input">
            </div>
            <div class="form-buttons">
                <button class="btn-modal-secondary" onclick="closeLastModal()">Cancelar</button>
                <button class="btn-modal-primary" onclick="savePaymentMethod()">Guardar tarjeta</button>
            </div>
        </div>
    `);
}

/**
 * Elimina un método de pago
 */
function deletePaymentMethod(id) {
    showToast('✓ Método de pago eliminado');
    openPaymentMethodsModal();
}

/**
 * Guarda un nuevo método de pago
 */
function savePaymentMethod() {
    showToast('✓ Método de pago guardado correctamente');
    closeLastModal();
    openPaymentMethodsModal();
}

/**
 * Abre el modal de reseñas
 */
function openReviewsModal() {
    const modal = createModal('Mis Reseñas', `
        <div class="modal-section">
            <div class="reviews-header">
                <div class="rating-display">
                    <div class="rating-number">${userProfile.rating}</div>
                    <div class="rating-stars">
                        ${'⭐'.repeat(Math.floor(userProfile.rating))}
                    </div>
                    <p>Basado en ${userProfile.totalOrders} pedidos</p>
                </div>
            </div>

            <div class="recent-reviews">
                <h3>Últimas reseñas</h3>
                <div class="review-item">
                    <div class="review-header">
                        <p class="restaurant">McDonald's</p>
                        <span class="review-rating">⭐⭐⭐⭐⭐</span>
                    </div>
                    <p class="review-date">Hace 2 días</p>
                    <p class="review-text">Excelente servicio, comida llegó caliente y rápido.</p>
                </div>

                <div class="review-item">
                    <div class="review-header">
                        <p class="restaurant">Pokémon Albacete</p>
                        <span class="review-rating">⭐⭐⭐⭐</span>
                    </div>
                    <p class="review-date">Hace 5 días</p>
                    <p class="review-text">Muy buena calidad, aunque tardó un poco más.</p>
                </div>
            </div>
        </div>
    `);
}

/**
 * Crea un modal genérico
 */
function createModal(title, content) {
    // Cerrar modal anterior si existe
    const existingModals = document.querySelectorAll('.profile-modal-overlay');
    existingModals.forEach(m => m.remove());

    const mobileFrame = document.querySelector('.mobile-frame');
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'profile-modal-overlay';
    modalOverlay.innerHTML = `
        <div class="profile-modal">
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="close-btn" onclick="closeLastModal()">
                    <i class='bx bx-x'></i>
                </button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;

    mobileFrame.appendChild(modalOverlay);

    // Cerrar al hacer click fuera
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeLastModal();
    });

    return modalOverlay;
}

/**
 * Cierra el último modal abierto
 */
function closeLastModal() {
    const modals = document.querySelectorAll('.profile-modal-overlay');
    if (modals.length > 0) {
        modals[modals.length - 1].remove();
    }
}

/**
 * Muestra una notificación tipo toast
 */
function showToast(message) {
    const container = document.getElementById('notifications-container') || 
                     document.createElement('div');
    
    if (!document.getElementById('notifications-container')) {
        container.id = 'notifications-container';
        container.className = 'notifications-container';
        document.querySelector('.mobile-frame').prepend(container);
    }

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    container.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

/**
 * Inicializa cuando el DOM está listo
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeProfile);
} else {
    initializeProfile();
}
