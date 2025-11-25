// ============================================================
// page-transitions.js - Manejo de transiciones entre páginas
// ============================================================

/**
 * Inicializa el sistema de transiciones de página
 * Debe ser llamado cuando se carga la página
 */
function initPageTransitions() {
    // Aplicar animación de entrada cuando carga la página
    document.documentElement.classList.add('page-loaded');
    
    // Interceptar todos los enlaces internos
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        
        if (!link) return;
        
        // Obtener el href del enlace
        const href = link.getAttribute('href');
        
        // Si es un enlace interno (no es externo, no es #, no es javascript:, etc.)
        if (href && 
            !href.startsWith('http') &&
            !href.startsWith('mailto:') &&
            !href.startsWith('tel:') &&
            !href.startsWith('javascript:') &&
            !href.startsWith('#') &&
            (href.includes('.html') || href.includes('../') || href.includes('./'))
        ) {
            // Prevenir el comportamiento por defecto
            e.preventDefault();
            
            // Ejecutar transición de salida
            transitionToPage(href);
        }
    });
}

/**
 * Ejecuta la transición hacia una nueva página
 * @param {string} href - URL de la página destino
 */
function transitionToPage(href) {
    // Añadir clase de salida
    document.documentElement.classList.add('page-exit');
    
    // Esperar a que termine la animación de salida
    setTimeout(() => {
        // Navegar a la nueva página
        window.location.href = href;
    }, 150); // Debe coincidir con la duración de la animación fadeOut
}

/**
 * Inicializa las transiciones cuando el DOM está listo
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageTransitions);
} else {
    initPageTransitions();
}
