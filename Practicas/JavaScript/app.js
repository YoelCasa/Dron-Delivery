// app.js

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
        let radioToCheck = currentAccessibility || 'normal'; // Si no hay nada guardado, marca 'normal'
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
        const saveBtn = document.getElementById('save-accessibility-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', (e) => {
                e.preventDefault(); 
                
                const newMode = document.querySelector('input[name="vision-mode"]:checked').value;
                
                accessibilityModes.forEach(mode => rootHtml.classList.remove(mode));
                
                if (newMode !== 'normal') {
                    rootHtml.classList.add(newMode);
                }
                
                localStorage.setItem('accessibility', newMode);
                window.location.href = 'home.html';
            });
        }
    }

    // --- LÓGICA DE VALIDACIÓN DE INICIO DE SESIÓN ---
    const emailInput = document.getElementById('email-input');
    const continueBtn = document.getElementById('continue-btn');
    const errorP = document.getElementById('email-error');
    // Seleccionamos el contenedor
    const appContent = document.querySelector('.app-content'); 

    // Solo se ejecutará si estamos en la página de inicio de sesión
    if (emailInput && continueBtn && errorP && appContent) {

        continueBtn.addEventListener('click', (e) => {
            
            const email = emailInput.value.trim(); // Obtener el valor del correo

            // 1. Prevenir que el enlace navegue
            e.preventDefault(); 
            
            // 2. Resetear errores
            errorP.style.display = 'none';
            emailInput.classList.remove('input-error');
            appContent.classList.remove('form-has-error'); // <-- LIMPIA LA CLASE

            // 3. Validar
            if (email === '') {
                // Error: Vacío
                errorP.textContent = 'Por favor, ingresa tu correo electrónico.';
                errorP.style.display = 'block';
                emailInput.classList.add('input-error');
                appContent.classList.add('form-has-error'); // <-- AÑADE LA CLASE
            } else if (!email.includes('@')) {
                // Error: No contiene @
                errorP.textContent = 'Por favor, ingresa un correo válido (debe incluir "@").';
                errorP.style.display = 'block';
                emailInput.classList.add('input-error');
                appContent.classList.add('form-has-error'); // <-- AÑADE LA CLASE
            } else {
                // Éxito: Navegar a la página
                window.location.href = continueBtn.href;
            }
        });
    }

});