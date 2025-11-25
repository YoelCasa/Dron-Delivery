// ============================================================
// search.js - Funcionalidad de búsqueda de restaurantes
// ============================================================

const RESTAURANTS = [
    {
        id: 'casa-pepe',
        name: 'Casa Pepe',
        url: 'casaPepe.html',
        image: '../imagenes/casa-pepe.jpeg',
        category: 'Española',
        rating: 4.5
    },
    {
        id: 'mcdonalds',
        name: 'Mc Donal\'s',
        url: 'mcdonalds.html',
        image: '../imagenes/mc-donals.jpg',
        category: 'Comida Rápida',
        rating: 4.3
    },
    {
        id: 'fruteria',
        name: 'Frutería',
        url: 'fruteria.html',
        image: '../imagenes/fruta.jpg',
        category: 'Frutas y Verduras',
        rating: 4.7
    },
    {
        id: 'poke-albacete',
        name: 'Poke Albacete',
        url: 'poke-albacete.html',
        image: '../imagenes/poke-albacete.jpg',
        category: 'Comida Saludable',
        rating: 4.6
    },
    {
        id: 'hsn-store',
        name: 'HSN Store',
        url: 'hsn-store.html',
        image: '../imagenes/hsn-store.jpg',
        category: 'Suplementos',
        rating: 4.4
    }
];

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-container input');
    const appContent = document.querySelector('.app-content');
    
    if (!searchInput || !appContent) return;

    // Crear contenedor de resultados
    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'search-results-dropdown';
    resultsContainer.className = 'search-results-dropdown hidden';
    
    // Insertar después del search container
    searchInput.parentElement.parentElement.insertBefore(resultsContainer, searchInput.parentElement.nextSibling);

    // Buscar mientras escribe
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length === 0) {
            resultsContainer.classList.add('hidden');
            searchInput.value = '';
            return;
        }

        const results = RESTAURANTS.filter(restaurant => 
            restaurant.name.toLowerCase().includes(query) ||
            restaurant.category.toLowerCase().includes(query)
        );

        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="search-no-results">
                    <i class='bx bx-search-alt-2'></i>
                    <p>No se encontraron restaurantes</p>
                </div>
            `;
        } else {
            displayResults(results, resultsContainer);
        }
        
        resultsContainer.classList.remove('hidden');
    });

    // Cerrar resultados al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container') && !e.target.closest('.search-results-dropdown')) {
            resultsContainer.classList.add('hidden');
            searchInput.value = '';
        }
    });

    // Mostrar resultados al hacer focus si hay texto
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim()) {
            resultsContainer.classList.remove('hidden');
        }
    });

    // Limpiar al presionar Escape
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            resultsContainer.classList.add('hidden');
            searchInput.value = '';
        }
    });
});

function displayResults(results, container) {
    container.innerHTML = '';

    results.forEach(restaurant => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.innerHTML = `
            <img src="${restaurant.image}" alt="${restaurant.name}">
            <div class="result-info">
                <h3>${restaurant.name}</h3>
                <p class="result-category">${restaurant.category}</p>
                <div class="result-rating">
                    <i class='bx bxs-star'></i>
                    <span>${restaurant.rating}</span>
                </div>
            </div>
            <i class='bx bx-chevron-right'></i>
        `;

        resultItem.addEventListener('click', () => {
            window.location.href = restaurant.url;
        });

        container.appendChild(resultItem);
    });
}
