// JavaScript principal para la página web del CEM

document.addEventListener('DOMContentLoaded', function() {
    console.log('Página web del CEM cargada correctamente');
    
    // Inicializar funcionalidades
    initNavigation();
    initCurrentYear();
    initSmoothScrolling();
    setupEmailModal();
    
    // Mostrar mensaje de bienvenida en consola
    console.log('Bienvenido al Centro de Estudiantes de Matemática - FCM UNMSM');
});

/**
 * Inicializa la navegación activa
 */
function initNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Añadir evento de clic para menú móvil (si se implementa en el futuro)
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const mainNav = document.querySelector('.main-nav');
            mainNav.classList.toggle('active');
        });
    }
}

/**
 * Actualiza el año actual en el footer
 */
function initCurrentYear() {
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
}

/**
 * Inicializa el scroll suave para enlaces internos
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Ajustar para el header fijo
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Función para mostrar/ocultar contenido (para futuras expansiones)
 */
function toggleContent(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.toggle('hidden');
    }
}

/**
 * Validación básica de formularios (para futuras expansiones)
 */
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return true;
    
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = 'var(--color-error, #ff0000)';
            isValid = false;
        } else {
            field.style.borderColor = '';
        }
    });
    
    return isValid;
}

/**
 * Función para copiar texto al portapapeles
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Mostrar notificación de éxito (podría implementarse)
        console.log('Texto copiado al portapapeles:', text);
    }).catch(err => {
        console.error('Error al copiar texto:', err);
    });
}

/**
 * Manejo de errores global
 */
window.addEventListener('error', function(e) {
    console.error('Error en la aplicación:', e.error);
});

/**
 * Detectar si el usuario está en un dispositivo móvil
 */
function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Configura el modal para mostrar la dirección de correo
 */
function setupEmailModal() {
    const modal = document.getElementById('emailModal');
    const modalTriggers = document.querySelectorAll('.email-modal-trigger');
    const closeButtons = document.querySelectorAll('.modal-close, .btn-close');
    const copyButton = document.getElementById('copyEmailBtn');
    const emailAddressElement = document.getElementById('modalEmailAddress');
    
    if (!modal || modalTriggers.length === 0) return;
    
    // Función para mostrar el modal
    function showEmailModal(email) {
        if (emailAddressElement && email) {
            emailAddressElement.textContent = email;
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    }
    
    // Función para cerrar el modal
    function closeEmailModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar scroll del body
    }
    
    // Event listeners para los triggers
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const email = this.getAttribute('data-email');
            showEmailModal(email);
        });
    });
    
    // Event listeners para cerrar el modal
    closeButtons.forEach(button => {
        button.addEventListener('click', closeEmailModal);
    });
    
    // Cerrar modal al hacer clic fuera del contenido
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeEmailModal();
        }
    });
    
    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeEmailModal();
        }
    });
    
    // Copiar dirección de correo al portapapeles
    if (copyButton) {
        copyButton.addEventListener('click', function() {
            const email = emailAddressElement.textContent;
            copyToClipboard(email);
            
            // Feedback visual
            const originalText = this.innerHTML;
            this.innerHTML = '<svg class="copy-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/></svg>¡Copiado!';
            this.style.backgroundColor = 'var(--color-success, #28a745)';
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.backgroundColor = '';
            }, 2000);
        });
    }
}

// Exportar funciones para uso en otros archivos (si se necesitan)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initNavigation,
        initCurrentYear,
        initSmoothScrolling,
        toggleContent,
        validateForm,
        copyToClipboard,
        isMobileDevice,
        setupEmailModal
    };
}
