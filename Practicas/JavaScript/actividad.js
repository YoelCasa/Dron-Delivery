// ============================================================
// actividad.js - Lógica de la página de actividad
// ============================================================

let currentFilter = 'Todo';

// Datos de actividad estática
const staticActivity = [
    {
        type: 'Pedidos',
        restaurant: 'Casa Pepe',
        title: 'Casa Pepe',
        date: 'Ahora',
        description: 'Ha confirmado tu pedido #12345.',
        icon: '../imagenes/casa-pepe.jpeg'
    },
    {
        type: 'Pedidos',
        restaurant: 'Dron',
        title: '¡En camino!',
        date: 'hace 5 min',
        description: 'Tu dron ya va de camino. ¡Prepara la mesa!',
        icon: '../imagenes/logo.png',
        iconBg: true
    },
    {
        type: 'Ofertas',
        restaurant: 'HSN Store',
        title: '¡Oferta para ti!',
        date: 'hace 1h',
        description: 'Envío gratis en tu próximo pedido en HSN Store.',
        icon: '../imagenes/hsn-store.jpg',
        iconBg: true
    },
    {
        type: 'Pedidos',
        restaurant: 'McDonald\'s',
        title: 'Pedido Entregado',
        date: 'Ayer',
        description: 'Tu pedido de Mc Donal\'s ha sido entregado.',
        icon: '../imagenes/icon_chech.png',
        iconBg: true
    },
    {
        type: 'Pedidos',
        restaurant: 'Pokémon Albacete',
        title: 'Valora tu pedido',
        date: 'Ayer',
        description: '¿Qué tal estuvo tu poke? ¡Tu opinión cuenta!',
        icon: '../imagenes/poke-albacete.jpg'
    }
];

/**
 * Obtiene toda la actividad combinada (estática + reseñas)
 */
function getAllActivity() {
    let allActivity = [...staticActivity];
    
    // Agregar reseñas del usuario si existen
    if (typeof userActivity !== 'undefined' && userActivity.length > 0) {
        const reviewsActivity = userActivity
            .filter(item => item.type === 'Reseña publicada')
            .map(review => ({
                type: 'Reseñas',
                restaurant: review.restaurant,
                title: 'Reseña publicada',
                date: review.date,
                description: `Compartiste tu experiencia en ${review.restaurant}. Calificación: ${review.rating} ⭐`,
                icon: getRestaurantIcon(review.restaurant),
                isReview: true
            }));
        
        allActivity = [...reviewsActivity, ...allActivity];
    }
    
    return allActivity;
}

/**
 * Obtiene el icono del restaurante según su nombre
 */
function getRestaurantIcon(restaurantName) {
    const icons = {
        'Casa Pepe': '../imagenes/casa-pepe.jpeg',
        'McDonald\'s': '../imagenes/mc-donals.jpg',
        'Pokémon Albacete': '../imagenes/poke-albacete.jpg',
        'HSN Store': '../imagenes/hsn-store.jpg',
        'Frutería': '../imagenes/logo.png'
    };
    return icons[restaurantName] || '../imagenes/logo.png';
}

/**
 * Filtra la actividad según el tipo seleccionado
 */
function filterActivity(filterType) {
    currentFilter = filterType;
    
    // Actualizar botones activos
    document.querySelectorAll('.filter-pills button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Renderizar actividad filtrada
    renderActivity();
}

/**
 * Renderiza la lista de actividad
 */
function renderActivity() {
    const activityFeed = document.getElementById('activity-feed');
    let activity = getAllActivity();
    
    // Filtrar según el tipo seleccionado
    if (currentFilter !== 'Todo') {
        activity = activity.filter(item => item.type === currentFilter);
    }
    
    // Si no hay actividad
    if (activity.length === 0) {
        activityFeed.innerHTML = `
            <div class="empty-activity">
                <i class='bx bx-inbox'></i>
                <p>No hay ${currentFilter.toLowerCase()} aún</p>
            </div>
        `;
        return;
    }
    
    // Renderizar cada item
    activityFeed.innerHTML = activity.map((item, index) => `
        <li class="activity-item ${item.isReview ? 'review-item' : ''}">
            ${item.type === 'Reseñas' ? '' : '<span class="notification-dot"></span>'}
            <img src="${item.icon}" alt="${item.restaurant}" class="activity-icon ${item.iconBg ? 'icon-bg' : ''}">
            <div class="activity-text">
                <p><strong>${item.title}</strong> <span>${item.date}</span></p>
                <p class="description">${item.description}</p>
            </div>
        </li>
    `).join('');
}

/**
 * Inicializa la página de actividad
 */
function initializeActivity() {
    // Cargar datos del usuario
    loadUserData();
    
    // Renderizar actividad inicial
    renderActivity();
    
    // Configurar listeners en botones de filtro
    document.querySelectorAll('.filter-pills button').forEach((btn, index) => {
        btn.addEventListener('click', function() {
            filterActivity(this.textContent);
        });
    });
}

/**
 * Carga datos del usuario desde localStorage
 */
function loadUserData() {
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
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeActivity);
} else {
    initializeActivity();
}

// Escuchar cambios en localStorage (de otras pestañas/ventanas)
window.addEventListener('storage', (e) => {
    if (e.key === 'userActivity' || e.key === 'userReviews') {
        loadUserData();
        renderActivity();
    }
});
