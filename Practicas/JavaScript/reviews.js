// ============================================================
// reviews.js - Sistema de reseñas para restaurantes
// ============================================================

// Almacenar reseñas (en una aplicación real sería en una BD)
let restaurantReviews = {
    'Casa Pepe': [
        { id: 1, rating: 5, title: 'Excelente comida', text: 'La mejor experiencia gastronómica', author: 'Juan García', date: 'Hace 2 días', verified: true },
        { id: 2, rating: 4, title: 'Muy bueno', text: 'Buen servicio y comida deliciosa', author: 'María López', date: 'Hace 1 semana', verified: true }
    ],
    'McDonald\'s': [
        { id: 3, rating: 4, title: 'Rápido y bueno', text: 'Llegó rápido y todo correcto', author: 'Carlos Ruiz', date: 'Ayer', verified: true },
        { id: 4, rating: 5, title: 'Perfecto', text: 'Las hamburguesas están deliciosas', author: 'Ana Torres', date: 'Hace 3 días', verified: true }
    ],
    'Pokémon Albacete': [
        { id: 5, rating: 5, title: 'Increíble', text: 'Los mejores bowls de la ciudad', author: 'Ana García', date: 'Hace 3 días', verified: true },
        { id: 6, rating: 4, title: 'Muy fresco', text: 'La comida está siempre fresca y deliciosa', author: 'Luis Martín', date: 'Hace 5 días', verified: true }
    ],
    'Frutería': [
        { id: 7, rating: 5, title: 'Frutas frescas', text: 'Las frutas son de excelente calidad', author: 'Rosa Giménez', date: 'Hace 1 día', verified: true },
        { id: 8, rating: 4, title: 'Buen servicio', text: 'Personal muy amable y atento', author: 'Pedro López', date: 'Hace 2 días', verified: true }
    ],
    'HSN Store': [
        { id: 9, rating: 4, title: 'Buena selección', text: 'Tienen de todo y muy bien presentado', author: 'Sofía Ruiz', date: 'Hace 1 semana', verified: true },
        { id: 10, rating: 5, title: 'Recomendado', text: 'Excelente calidad en los productos', author: 'Manuel García', date: 'Hace 4 días', verified: true }
    ]
};

// Reseñas del usuario actual (limitado a una por restaurante)
let userReviews = {};

// Actividad del usuario (reseñas publicadas)
let userActivity = [];

// Inicializar datos al cargar el script
(function() {
    const savedReviews = localStorage.getItem('userReviews');
    const savedActivity = localStorage.getItem('userActivity');
    
    if (savedReviews) {
        try {
            userReviews = JSON.parse(savedReviews);
        } catch (e) {
            console.error('Error al cargar reseñas:', e);
            userReviews = {};
        }
    }
    if (savedActivity) {
        try {
            userActivity = JSON.parse(savedActivity);
        } catch (e) {
            console.error('Error al cargar actividad:', e);
            userActivity = [];
        }
    }
})();

/**
 * Abre el modal de reseñas del restaurante
 */
function openReviewsModal(restaurantName) {
    // Crear entrada en el diccionario si no existe
    if (!restaurantReviews[restaurantName]) {
        restaurantReviews[restaurantName] = [];
    }
    
    const reviews = restaurantReviews[restaurantName] || [];
    const mobileFrame = document.querySelector('.mobile-frame');
    
    if (!mobileFrame) {
        console.error('Mobile frame no encontrado');
        return;
    }

    // Cerrar modal anterior si existe
    const existingModals = document.querySelectorAll('.reviews-modal-overlay');
    existingModals.forEach(m => m.remove());

    // Verificar si el usuario ya dejó una reseña
    const userReview = userReviews[restaurantName];

    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'reviews-modal-overlay';
    
    let reviewContent = '';
    if (!userReview) {
        reviewContent = `
            <button class="btn-write-review" onclick="openWriteReviewModal('${restaurantName}')">
                <i class='bx bx-edit'></i> Escribir reseña
            </button>
        `;
    } else {
        reviewContent = `
            <div class="user-review-section">
                <div class="user-review-header">
                    <h3>Tu reseña</h3>
                    <div class="user-review-actions">
                        <button class="btn-edit-review" onclick="openEditReviewModal('${restaurantName}')">
                            <i class='bx bx-edit-alt'></i> Editar
                        </button>
                        <button class="btn-delete-review" onclick="deleteUserReview('${restaurantName}')">
                            <i class='bx bx-trash'></i> Eliminar
                        </button>
                    </div>
                </div>
                <div class="review-item user-review-item">
                    <div class="review-header">
                        <div class="review-author-info">
                            <strong>${userReview.author}</strong>
                            <span class="verified-badge">✓ Tu reseña</span>
                        </div>
                        <span class="review-date">${userReview.date}</span>
                    </div>
                    <div class="review-rating">
                        ${generateStars(userReview.rating)}
                    </div>
                    <h4 class="review-title">${userReview.title}</h4>
                    <p class="review-text">${userReview.text}</p>
                </div>
            </div>
        `;
    }

    const reviewsHTML = reviews.map((review, index) => `
        <div class="review-item">
            <div class="review-header">
                <div class="review-author-info">
                    <strong>${review.author}</strong>
                    ${review.verified ? '<span class="verified-badge">✓ Compra verificada</span>' : ''}
                </div>
                <span class="review-date">${review.date}</span>
            </div>
            <div class="review-rating">
                ${generateStars(review.rating)}
            </div>
            <h4 class="review-title">${review.title}</h4>
            <p class="review-text">${review.text}</p>
            <div class="review-actions">
                <button class="btn-helpful" onclick="markHelpful(${index}, '${restaurantName}')">
                    <i class='bx bx-thumbs-up'></i> Útil
                </button>
                <button class="btn-report" onclick="reportReview(${index}, '${restaurantName}')">
                    <i class='bx bx-flag'></i> Reportar
                </button>
            </div>
        </div>
    `).join('');

    modalOverlay.innerHTML = `
        <div class="reviews-modal">
            <div class="modal-header">
                <h2>Reseñas - ${restaurantName}</h2>
                <button class="close-btn" onclick="closeReviewsModal()">
                    <i class='bx bx-x'></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="reviews-stats">
                    <div class="rating-summary">
                        <div class="rating-average">${calculateAverageRating(reviews).toFixed(1)}</div>
                        <div class="rating-stars">${generateStars(calculateAverageRating(reviews))}</div>
                        <p class="total-reviews">${reviews.length} reseñas</p>
                    </div>
                </div>

                ${reviewContent}

                <div class="reviews-list">
                    <h3 class="other-reviews-title">Otras reseñas</h3>
                    ${reviews.length > 0 ? reviewsHTML : '<p class="no-reviews">No hay otras reseñas aún.</p>'}
                </div>
            </div>
        </div>
    `;

    mobileFrame.appendChild(modalOverlay);

    // Cerrar al hacer click fuera
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeReviewsModal();
    });

    // Event listener para el botón "Escribir reseña"
    const writeReviewBtn = modalOverlay.querySelector('.btn-write-review');
    if (writeReviewBtn) {
        writeReviewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openWriteReviewModal(restaurantName);
        });
    }
}

/**
 * Abre el modal para escribir una reseña
 */
function openWriteReviewModal(restaurantName) {
    let mobileFrame = document.querySelector('.mobile-frame');
    
    // Si no hay mobile-frame, usar body como fallback
    if (!mobileFrame) {
        mobileFrame = document.body;
    }
    
    // Cerrar modal anterior
    const existingModals = document.querySelectorAll('.reviews-modal-overlay');
    existingModals.forEach(m => m.remove());

    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'reviews-modal-overlay';
    modalOverlay.innerHTML = `
        <div class="reviews-modal write-review-modal">
            <div class="modal-header">
                <h2>Escribir reseña</h2>
                <button class="close-btn" onclick="closeReviewsModal()">
                    <i class='bx bx-x'></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="write-review-form">
                    <div class="form-group">
                        <label>Tu calificación</label>
                        <div class="rating-selector">
                            <button class="star-btn" data-rating="1" onclick="selectRating(1)"><i class='bx bxs-star'></i></button>
                            <button class="star-btn" data-rating="2" onclick="selectRating(2)"><i class='bx bxs-star'></i></button>
                            <button class="star-btn" data-rating="3" onclick="selectRating(3)"><i class='bx bxs-star'></i></button>
                            <button class="star-btn" data-rating="4" onclick="selectRating(4)"><i class='bx bxs-star'></i></button>
                            <button class="star-btn" data-rating="5" onclick="selectRating(5)"><i class='bx bxs-star'></i></button>
                        </div>
                        <div class="selected-rating">Selecciona una calificación</div>
                    </div>

                    <div class="form-group">
                        <label>Título de la reseña</label>
                        <input type="text" id="review-title" placeholder="Ej: Excelente comida" class="form-input" maxlength="100">
                    </div>

                    <div class="form-group">
                        <label>Tu reseña</label>
                        <textarea id="review-text" placeholder="Comparte tu experiencia..." class="form-textarea" maxlength="500" rows="5"></textarea>
                        <p class="char-count"><span id="char-count">0</span>/500</p>
                    </div>

                    <div class="review-tips">
                        <h4>Consejos para una buena reseña:</h4>
                        <ul>
                            <li>Sé honesto y justo</li>
                            <li>Describe tu experiencia real</li>
                            <li>Evita lenguaje ofensivo</li>
                            <li>Proporciona detalles útiles</li>
                        </ul>
                    </div>

                    <div class="form-buttons">
                        <button class="btn-cancel" onclick="openReviewsModal('${restaurantName}')">Cancelar</button>
                        <button class="btn-submit" onclick="submitReview('${restaurantName}')">Enviar reseña</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    if (!mobileFrame) {
        console.error('Mobile frame no encontrado en openWriteReviewModal');
        return;
    }

    mobileFrame.appendChild(modalOverlay);

    // Event listeners - con pequeño delay para asegurar que el DOM está listo
    setTimeout(() => {
        const starBtns = document.querySelectorAll('.star-btn');
        starBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const rating = parseInt(this.dataset.rating);
                selectRating(rating);
                const ratingText = document.querySelector('.selected-rating');
                if (ratingText) {
                    ratingText.textContent = rating + (rating == 1 ? ' estrella' : ' estrellas');
                }
            });
        });

        const reviewText = document.getElementById('review-text');
        if (reviewText) {
            reviewText.addEventListener('input', function() {
                const charCount = document.getElementById('char-count');
                if (charCount) {
                    charCount.textContent = this.value.length;
                }
            });
        }

        // Botón Cancelar
        const cancelBtn = modalOverlay.querySelector('.btn-cancel');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                openReviewsModal(restaurantName);
            });
        }

        // Botón Enviar reseña
        const submitBtn = modalOverlay.querySelector('.btn-submit');
        if (submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                submitReview(restaurantName);
            });
        }

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) openReviewsModal(restaurantName);
        });
    }, 0);
}

/**
 * Abre el modal para editar una reseña
 */
function openEditReviewModal(restaurantName) {
    const userReview = userReviews[restaurantName];
    if (!userReview) return;

    const mobileFrame = document.querySelector('.mobile-frame');
    
    // Cerrar modal anterior
    const existingModals = document.querySelectorAll('.reviews-modal-overlay');
    existingModals.forEach(m => m.remove());

    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'reviews-modal-overlay';
    modalOverlay.innerHTML = `
        <div class="reviews-modal write-review-modal">
            <div class="modal-header">
                <h2>Editar reseña</h2>
                <button class="close-btn" onclick="closeReviewsModal()">
                    <i class='bx bx-x'></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="write-review-form">
                    <div class="form-group">
                        <label>Tu calificación</label>
                        <div class="rating-selector">
                            <button class="star-btn ${userReview.rating === 1 ? 'active' : ''}" data-rating="1" onclick="selectRating(1)"><i class='bx bxs-star'></i></button>
                            <button class="star-btn ${userReview.rating === 2 ? 'active' : ''}" data-rating="2" onclick="selectRating(2)"><i class='bx bxs-star'></i></button>
                            <button class="star-btn ${userReview.rating === 3 ? 'active' : ''}" data-rating="3" onclick="selectRating(3)"><i class='bx bxs-star'></i></button>
                            <button class="star-btn ${userReview.rating === 4 ? 'active' : ''}" data-rating="4" onclick="selectRating(4)"><i class='bx bxs-star'></i></button>
                            <button class="star-btn ${userReview.rating === 5 ? 'active' : ''}" data-rating="5" onclick="selectRating(5)"><i class='bx bxs-star'></i></button>
                        </div>
                        <div class="selected-rating">${userReview.rating} ${userReview.rating == 1 ? 'estrella' : 'estrellas'}</div>
                    </div>

                    <div class="form-group">
                        <label>Título de la reseña</label>
                        <input type="text" id="review-title" placeholder="Ej: Excelente comida" class="form-input" maxlength="100" value="${userReview.title}">
                    </div>

                    <div class="form-group">
                        <label>Tu reseña</label>
                        <textarea id="review-text" placeholder="Comparte tu experiencia..." class="form-textarea" maxlength="500" rows="5">${userReview.text}</textarea>
                        <p class="char-count"><span id="char-count">${userReview.text.length}</span>/500</p>
                    </div>

                    <div class="form-buttons">
                        <button class="btn-cancel" onclick="openReviewsModal('${restaurantName}')">Cancelar</button>
                        <button class="btn-submit" onclick="updateReview('${restaurantName}')">Guardar cambios</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    mobileFrame.appendChild(modalOverlay);

    // Event listeners
    document.querySelectorAll('.star-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);
            selectRating(rating);
            document.querySelector('.selected-rating').textContent = rating + (rating == 1 ? ' estrella' : ' estrellas');
        });
    });

    document.getElementById('review-text').addEventListener('input', function() {
        document.getElementById('char-count').textContent = this.value.length;
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) openReviewsModal(restaurantName);
    });
}

/**
 * Selecciona la calificación
 */
function selectRating(rating) {
    document.querySelectorAll('.star-btn').forEach((btn, index) => {
        const btnRating = parseInt(btn.dataset.rating);
        if (btnRating <= rating) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

/**
 * Envía la reseña
 */
function submitReview(restaurantName) {
    const title = document.getElementById('review-title').value.trim();
    const text = document.getElementById('review-text').value.trim();
    const ratingBtn = document.querySelector('.star-btn.active');
    const rating = ratingBtn ? parseInt(ratingBtn.dataset.rating) : null;

    // Validaciones
    if (!rating) {
        showToast('Por favor selecciona una calificación', true);
        return;
    }

    if (!title) {
        showToast('Por favor escribe un título', true);
        return;
    }

    if (!text) {
        showToast('Por favor escribe tu reseña', true);
        return;
    }

    // Crear la nueva reseña
    const newReview = {
        rating: rating,
        title: title,
        text: text,
        author: 'Tú',
        date: 'Ahora',
        verified: true
    };

    // Guardar reseña del usuario
    userReviews[restaurantName] = newReview;

    // Agregar a la actividad del usuario
    const activityItem = {
        type: 'Reseña publicada',
        restaurant: restaurantName,
        rating: rating,
        title: title,
        date: 'Ahora',
        timestamp: new Date()
    };
    userActivity.unshift(activityItem);

    // Actualizar localStorage para persistencia
    localStorage.setItem('userReviews', JSON.stringify(userReviews));
    localStorage.setItem('userActivity', JSON.stringify(userActivity));

    showToast('✓ Reseña publicada exitosamente');
    
    // Cerrar modal actual y reabrir después de que desaparezca la notificación
    closeReviewsModal();
    setTimeout(() => {
        openReviewsModal(restaurantName);
    }, 3500);
}

/**
 * Actualiza una reseña existente
 */
function updateReview(restaurantName) {
    const title = document.getElementById('review-title').value.trim();
    const text = document.getElementById('review-text').value.trim();
    const ratingBtn = document.querySelector('.star-btn.active');
    const rating = ratingBtn ? parseInt(ratingBtn.dataset.rating) : null;

    // Validaciones
    if (!rating) {
        showToast('Por favor selecciona una calificación', true);
        return;
    }

    if (!title) {
        showToast('Por favor escribe un título', true);
        return;
    }

    if (!text) {
        showToast('Por favor escribe tu reseña', true);
        return;
    }

    // Actualizar reseña del usuario
    userReviews[restaurantName] = {
        rating: rating,
        title: title,
        text: text,
        author: 'Tú',
        date: 'Editado',
        verified: true
    };

    // Actualizar localStorage
    localStorage.setItem('userReviews', JSON.stringify(userReviews));

    showToast('✓ Reseña actualizada exitosamente');
    
    // Cerrar modal actual y reabrir después de que desaparezca la notificación
    closeReviewsModal();
    setTimeout(() => {
        openReviewsModal(restaurantName);
    }, 3500);
}

/**
 * Elimina la reseña del usuario
 */
function deleteUserReview(restaurantName) {
    showDeleteConfirmation(restaurantName);
}

/**
 * Muestra modal flotante de confirmación para eliminar
 */
function showDeleteConfirmation(restaurantName) {
    const mobileFrame = document.querySelector('.mobile-frame');
    
    const confirmOverlay = document.createElement('div');
    confirmOverlay.className = 'delete-confirm-overlay';
    confirmOverlay.innerHTML = `
        <div class="delete-confirm-modal">
            <i class='bx bx-trash'></i>
            <h3>¿Eliminar reseña?</h3>
            <p>Esta acción no se puede deshacer</p>
            <div class="confirm-buttons">
                <button class="btn-cancel-confirm" onclick="closeDeleteConfirmation()">Cancelar</button>
                <button class="btn-confirm-delete" onclick="confirmDeleteReview('${restaurantName}')">Eliminar</button>
            </div>
        </div>
    `;
    
    mobileFrame.appendChild(confirmOverlay);
    
    // Cerrar al hacer click fuera
    confirmOverlay.addEventListener('click', (e) => {
        if (e.target === confirmOverlay) closeDeleteConfirmation();
    });
}

/**
 * Cierra el modal de confirmación
 */
function closeDeleteConfirmation() {
    const modal = document.querySelector('.delete-confirm-overlay');
    if (modal) {
        modal.remove();
    }
}

/**
 * Confirma la eliminación de la reseña
 */
function confirmDeleteReview(restaurantName) {
    // Eliminar reseña del usuario
    delete userReviews[restaurantName];

    // Eliminar de la actividad
    userActivity = userActivity.filter(item => 
        !(item.type === 'Reseña publicada' && item.restaurant === restaurantName)
    );

    // Actualizar localStorage
    localStorage.setItem('userReviews', JSON.stringify(userReviews));
    localStorage.setItem('userActivity', JSON.stringify(userActivity));

    closeDeleteConfirmation();
    showToast('✓ Reseña eliminada');
    
    // Cerrar modal actual y reabrir después de que desaparezca la notificación
    setTimeout(() => {
        closeReviewsModal();
        openReviewsModal(restaurantName);
    }, 3500);
}

/**
 * Marca una reseña como útil
 */
function markHelpful(index, restaurantName) {
    showToast('✓ Gracias por tu valoración');
}

/**
 * Reporta una reseña
 */
function reportReview(index, restaurantName) {
    showToast('⚠️ Reseña reportada. Será revisada por nuestro equipo');
}

/**
 * Cierra el modal de reseñas
 */
function closeReviewsModal() {
    const modals = document.querySelectorAll('.reviews-modal-overlay');
    if (modals.length > 0) {
        modals[modals.length - 1].remove();
    }
}

/**
 * Calcula la calificación promedio
 */
function calculateAverageRating(reviews) {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
}

/**
 * Genera estrellas basadas en la calificación
 */
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '⭐'.repeat(fullStars);
    if (hasHalfStar) stars += '✨';
    return stars;
}

/**
 * Muestra notificaciones
 */
function showToast(message, isError) {
    let container = document.getElementById('notifications-container');
    
    if (!container) {
        container = document.createElement('div');
        container.id = 'notifications-container';
        container.className = 'notifications-container';
        document.querySelector('.mobile-frame').appendChild(container);
    }

    const notification = document.createElement('div');
    notification.className = 'notification';
    
    // Agregar ícono según el tipo
    if (message.includes('✓')) {
        notification.classList.add('success');
    } else if (message.includes('⚠️')) {
        notification.classList.add('warning');
    } else if (isError) {
        notification.classList.add('error');
    } else {
        notification.classList.add('info');
    }
    
    notification.textContent = message;
    container.appendChild(notification);

    // Auto-remover después de 3 segundos
    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/**
 * Obtiene la actividad del usuario (filtrada por tipo)
 */
function getUserActivityByType(type) {
    return userActivity.filter(item => item.type === type);
}

/**
 * Carga datos del localStorage al iniciar
 */
function loadUserData() {
    const savedReviews = localStorage.getItem('userReviews');
    const savedActivity = localStorage.getItem('userActivity');
    
    if (savedReviews) {
        try {
            userReviews = JSON.parse(savedReviews);
        } catch (e) {
            console.error('Error al cargar reseñas guardadas:', e);
            userReviews = {};
        }
    }
    if (savedActivity) {
        try {
            userActivity = JSON.parse(savedActivity);
        } catch (e) {
            console.error('Error al cargar actividad guardada:', e);
            userActivity = [];
        }
    }
}

/**
 * Inicializa el sistema de reseñas
 */
function initializeReviews() {
    // Cargar datos guardados
    loadUserData();
    
    // Buscar botones de reseña
    const reviewButtons = document.querySelectorAll('[data-reviews-button]');
    reviewButtons.forEach(btn => {
        const restaurantName = btn.dataset.restaurantName;
        btn.addEventListener('click', () => openReviewsModal(restaurantName));
    });
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeReviews);
} else {
    initializeReviews();
}
