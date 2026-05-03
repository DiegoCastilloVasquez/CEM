// Sistema de gestión de eventos para el CEM
// Carga eventos desde data/events.json y los muestra dinámicamente

document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de eventos del CEM cargado');
    loadEvents();
});

/**
 * Carga los eventos desde el archivo JSON
 */
async function loadEvents() {
    try {
        const response = await fetch('data/events.json');
        if (!response.ok) {
            throw new Error(`Error al cargar eventos: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Eventos cargados: ${data.events.length} eventos encontrados`);
        
        // Procesar y mostrar eventos
        processAndDisplayEvents(data.events);
        
    } catch (error) {
        console.error('Error cargando eventos:', error);
        showErrorMessage('No se pudieron cargar los eventos. Por favor, intenta más tarde.');
    }
}

/**
 * Procesa y muestra los eventos en la página
 */
function processAndDisplayEvents(events) {
    // Función auxiliar para crear fechas consistentemente (hora local)
    const createLocalDate = (dateString) => new Date(dateString + 'T00:00:00');
    
    // Ordenar eventos por fecha (más reciente primero)
    events.sort((a, b) => createLocalDate(b.date) - createLocalDate(a.date));
    
    // Separar eventos en próximos y pasados
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcomingEvents = [];
    const pastEvents = [];
    
    events.forEach(event => {
        const eventDate = createLocalDate(event.date);
        eventDate.setHours(0, 0, 0, 0);
        
        // Determinar si el evento es pasado o futuro
        if (eventDate >= today) {
            upcomingEvents.push(event);
        } else {
            pastEvents.push(event);
        }
    });
    
    // Ordenar próximos eventos: más cercano primero
    upcomingEvents.sort((a, b) => createLocalDate(a.date) - createLocalDate(b.date));
    
    // Ordenar eventos pasados: más reciente primero
    pastEvents.sort((a, b) => createLocalDate(b.date) - createLocalDate(a.date));
    
    // Mostrar eventos
    displayEventsSection('upcoming-events-container', upcomingEvents, 'Próximos Eventos');
    displayEventsSection('past-events-container', pastEvents, 'Eventos Pasados');
    
    // Ocultar la sección de próximos eventos si no hay eventos futuros
    const upcomingSection = document.getElementById('upcoming-events-container')
        ?.closest('.section');
    if (upcomingSection && upcomingEvents.length === 0) {
        upcomingSection.style.display = 'none';
    }
    
    // Actualizar contadores
    updateEventCounters(upcomingEvents.length, pastEvents.length);
}

/**
 * Muestra una sección de eventos
 */
function displayEventsSection(containerId, events, sectionTitle) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Contenedor no encontrado: ${containerId}`);
        return;
    }
    
    // Limpiar contenedor
    container.innerHTML = '';
    
    // Si no hay eventos, no mostrar nada (la sección se ocultará externamente)
    if (events.length === 0) {
        return;
    }
    
    // Crear grid de eventos
    const grid = document.createElement('div');
    grid.className = 'card-grid';
    
    events.forEach(event => {
        const eventCard = createEventCard(event);
        grid.appendChild(eventCard);
    });
    
    container.appendChild(grid);
}

/**
 * Obtiene la URL de la imagen principal de un evento (compatibilidad con formato antiguo y nuevo)
 */
function getEventMainImage(event) {
    // Compatibilidad con formato antiguo (imageUrl) y nuevo (images)
    if (event.images && event.images.length > 0) {
        return event.images[0];
    } else if (event.imageUrl) {
        return event.imageUrl;
    }
    return 'assets/images/events/default-event.jpg';
}

/**
 * Obtiene todas las imágenes de un evento (compatibilidad con formato antiguo y nuevo)
 */
function getEventAllImages(event) {
    // Compatibilidad con formato antiguo (imageUrl) y nuevo (images)
    if (event.images && event.images.length > 0) {
        return event.images;
    } else if (event.imageUrl) {
        return [event.imageUrl];
    }
    return ['assets/images/events/default-event.jpg'];
}

/**
 * Crea una tarjeta de evento
 */
function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'card event-card';
    card.dataset.eventId = event.id;
    card.dataset.category = event.category;
    
    // Formatear fecha para mostrar
    const formattedDate = formatEventDate(event.date);
    // Usar la misma función auxiliar para crear fechas consistentemente
    const createLocalDate = (dateString) => new Date(dateString + 'T00:00:00');
    const isPastEvent = createLocalDate(event.date) < new Date();
    
    // Determinar clase CSS basada en si es evento pasado
    const dateClass = isPastEvent ? 'event-date past' : 'event-date upcoming';
    
    // Obtener imagen principal
    const mainImage = getEventMainImage(event);
    
    // Crear contenido de la tarjeta
    card.innerHTML = `
        ${mainImage ? `
        <div class="event-image-container">
            <img src="${mainImage}" alt="${event.title}" class="event-image" 
                 onerror="this.src='assets/images/events/default-event.jpg'">
        </div>
        ` : ''}
        
        <div class="event-content">
            <div class="${dateClass}">
                <span class="date-day">${formattedDate.day}</span>
                <span class="date-month">${formattedDate.month}</span>
                <span class="date-year">${formattedDate.year}</span>
            </div>
            
            <h3 class="card-title">${event.title}</h3>
            
            <div class="event-meta">
                <div class="meta-item">
                    <svg class="meta-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="currentColor"/>
                    </svg>
                    <span>${event.time}${event.endTime ? ` - ${event.endTime}` : ''}</span>
                </div>
                
                <div class="meta-item">
                    <svg class="meta-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                    </svg>
                    <span>${event.location}</span>
                </div>
                
                <div class="meta-item">
                    <svg class="meta-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="currentColor"/>
                    </svg>
                    <span class="event-category">${getCategoryLabel(event.category)}</span>
                </div>
            </div>
            
            <div class="event-actions">
                <button class="btn btn-outline view-details-btn" data-event-id="${event.id}">
                    Ver detalles
                </button>
                
                ${!isPastEvent && event.registrationUrl && event.registrationUrl.trim() !== '' ? `
                <a href="${event.registrationUrl}" class="btn btn-outline" target="_blank">
                    Inscribirse
                </a>
                ` : ''}
            </div>
            
            ${isPastEvent ? `
            <div class="event-status past-badge">
                <svg class="status-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
                </svg>
                Evento realizado
            </div>
            ` : `
            <div class="event-status upcoming-badge">
                <svg class="status-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="currentColor"/>
                </svg>
                Próximamente
            </div>
            `}
        </div>
    `;
    
    // Agregar event listener al botón de ver detalles
    const viewDetailsBtn = card.querySelector('.view-details-btn');
    if (viewDetailsBtn) {
        viewDetailsBtn.addEventListener('click', () => {
            showEventModal(event);
        });
    }
    
    return card;
}

/**
 * Formatea la fecha del evento para mostrar
 */
function formatEventDate(dateString) {
    // Asegurar que la fecha se interprete como hora local, no UTC
    // Añadimos 'T00:00:00' para que JavaScript la interprete como medianoche en hora local
    const date = new Date(dateString + 'T00:00:00');
    const options = { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
    };
    
    const formatted = date.toLocaleDateString('es-ES', options);
    const parts = formatted.split(' ');
    
    return {
        day: parts[0],
        month: parts[1],
        year: parts[2],
        full: formatted
    };
}

/**
 * Obtiene la etiqueta legible para una categoría
 */
function getCategoryLabel(category) {
    const categories = {
        'taller': 'Taller',
        'charla': 'Charla',
        'asamblea': 'Asamblea',
        'tutoria': 'Tutoría',
        'social': 'Social',
        'deporte': 'Deporte',
        'academico': 'Académico'
    };
    
    return categories[category] || category;
}

/**
 * Actualiza los contadores de eventos
 */
function updateEventCounters(upcomingCount, pastCount) {
    const upcomingCounter = document.getElementById('upcoming-events-counter');
    const pastCounter = document.getElementById('past-events-counter');
    
    if (upcomingCounter) {
        upcomingCounter.textContent = `(${upcomingCount})`;
    }
    
    if (pastCounter) {
        pastCounter.textContent = `(${pastCount})`;
    }
}

/**
 * Crea una galería de imágenes para el modal
 */
function createImageGallery(images, title) {
    if (!images || images.length === 0) {
        return '';
    }
    
    // Si solo hay una imagen, mostrar solo esa imagen
    if (images.length === 1) {
        return `
        <div class="event-modal-image-container">
            <img src="${images[0]}" alt="${title}" class="event-modal-image" 
                 onerror="this.src='assets/images/events/default-event.jpg'">
        </div>
        `;
    }
    
    // Si hay múltiples imágenes, crear galería
    const imageItems = images.map((image, index) => `
        <div class="gallery-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
            <img src="${image}" alt="${title} - Imagen ${index + 1}" class="gallery-image"
                 onerror="this.src='assets/images/events/default-event.jpg'">
        </div>
    `).join('');
    
    const dots = images.map((_, index) => `
        <button class="gallery-dot ${index === 0 ? 'active' : ''}" data-index="${index}" aria-label="Ver imagen ${index + 1}"></button>
    `).join('');
    
    return `
    <div class="event-gallery-container">
        <div class="event-gallery">
            <div class="gallery-slides">
                ${imageItems}
            </div>
            
            ${images.length > 1 ? `
            <button class="gallery-nav gallery-prev" aria-label="Imagen anterior">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" fill="currentColor"/>
                </svg>
            </button>
            <button class="gallery-nav gallery-next" aria-label="Imagen siguiente">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill="currentColor"/>
                </svg>
            </button>
            
            <div class="gallery-dots">
                ${dots}
            </div>
            ` : ''}
        </div>
        
        ${images.length > 1 ? `
        <div class="gallery-counter">
            <span class="current-slide">1</span> / <span class="total-slides">${images.length}</span>
        </div>
        ` : ''}
    </div>
    `;
}

/**
 * Inicializa la funcionalidad de la galería
 */
function initGallery(galleryContainer) {
    if (!galleryContainer) return;
    
    const slides = galleryContainer.querySelectorAll('.gallery-slide');
    const dots = galleryContainer.querySelectorAll('.gallery-dot');
    const prevBtn = galleryContainer.querySelector('.gallery-prev');
    const nextBtn = galleryContainer.querySelector('.gallery-next');
    const currentSlideSpan = galleryContainer.querySelector('.current-slide');
    const totalSlidesSpan = galleryContainer.querySelector('.total-slides');
    
    if (slides.length <= 1) return;
    
    let currentSlide = 0;
    let autoSlideInterval;
    
    // Configurar auto-avance (5 segundos)
    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(() => {
            nextSlide();
        }, 5000);
    }
    
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }
    
    function goToSlide(index) {
        // Validar índice
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        // Ocultar slide actual
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        // Mostrar nuevo slide
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        // Actualizar contador
        currentSlide = index;
        if (currentSlideSpan) {
            currentSlideSpan.textContent = (currentSlide + 1).toString();
        }
        
        // Reiniciar auto-avance
        startAutoSlide();
    }
    
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            prevSlide();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            nextSlide();
        });
    }
    
    // Navegación por puntos
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(dot.getAttribute('data-index'));
            goToSlide(index);
        });
    });
    
    // Navegación por teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Pausar auto-avance al interactuar
    galleryContainer.addEventListener('mouseenter', stopAutoSlide);
    galleryContainer.addEventListener('mouseleave', startAutoSlide);
    
    // Iniciar auto-avance
    startAutoSlide();
    
    // Limpiar intervalo cuando se cierre el modal
    const modal = galleryContainer.closest('.event-modal-overlay');
    if (modal) {
        const closeBtn = modal.querySelector('.event-modal-close');
        if (closeBtn) {
            const originalCloseHandler = closeBtn.onclick;
            closeBtn.onclick = function() {
                stopAutoSlide();
                if (originalCloseHandler) originalCloseHandler();
            };
        }
    }
}

/**
 * Muestra un modal con los detalles completos del evento
 */
function showEventModal(event) {
    // Formatear fecha para mostrar
    const formattedDate = formatEventDate(event.date);
    const createLocalDate = (dateString) => new Date(dateString + 'T00:00:00');
    const isPastEvent = createLocalDate(event.date) < new Date();
    
    // Obtener todas las imágenes del evento
    const eventImages = getEventAllImages(event);
    
    // Crear o reutilizar el modal
    let modal = document.getElementById('event-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'event-modal';
        modal.className = 'modal-overlay event-modal-overlay';
        modal.innerHTML = `
            <div class="modal-content event-modal-content">
                <div class="modal-header">
                    <h3>Detalles del Evento</h3>
                    <button class="modal-close event-modal-close" aria-label="Cerrar">
                        &times;
                    </button>
                </div>
                <div class="modal-body event-modal-body">
                    <!-- El contenido se llenará dinámicamente -->
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Agregar event listeners para cerrar el modal
        const closeBtn = modal.querySelector('.event-modal-close');
        closeBtn.addEventListener('click', closeEventModal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeEventModal();
            }
        });
        
        // Cerrar con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeEventModal();
            }
        });
    }
    
    // Llenar el contenido del modal
    const modalBody = modal.querySelector('.event-modal-body');
    modalBody.innerHTML = `
        ${createImageGallery(eventImages, event.title)}
        
        <div class="event-modal-details">
            <div class="event-modal-header">
                <div class="event-modal-date ${isPastEvent ? 'past' : 'upcoming'}">
                    <span class="date-day">${formattedDate.day}</span>
                    <span class="date-month">${formattedDate.month}</span>
                    <span class="date-year">${formattedDate.year}</span>
                </div>
                <h2 class="event-modal-title">${event.title}</h2>
            </div>
            
            <div class="event-modal-meta">
                <div class="meta-item">
                    <svg class="meta-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="currentColor"/>
                    </svg>
                    <span><strong>Hora:</strong> ${event.time}${event.endTime ? ` - ${event.endTime}` : ''}</span>
                </div>
                
                <div class="meta-item">
                    <svg class="meta-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                    </svg>
                    <span><strong>Ubicación:</strong> ${event.location}</span>
                </div>
                
                <div class="meta-item">
                    <svg class="meta-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="currentColor"/>
                    </svg>
                    <span><strong>Categoría:</strong> ${getCategoryLabel(event.category)}</span>
                </div>
                
                <div class="meta-item">
                    <svg class="meta-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM12 4c4.41 0 8 3.59 8 8s-3.59 8-8 8-8-3.59-8-8 3.59-8 8-8zm-1 12h2v-6h-2v6zm0-8h2V6h-2v2z" fill="currentColor"/>
                    </svg>
                    <span><strong>Organizado por:</strong> ${event.createdBy}</span>
                </div>
            </div>
            
            <div class="description-content">${event.description}</div>
            
            <div class="event-modal-actions">
                ${!isPastEvent && event.registrationUrl && event.registrationUrl.trim() !== '' ? `
                <a href="${event.registrationUrl}" class="btn" target="_blank">
                    Inscribirse en este evento
                </a>
                ` : ''}
                
                <button class="btn btn-outline close-modal-btn">
                    Cerrar
                </button>
            </div>
        </div>
    `;
    
    // Inicializar la galería si hay múltiples imágenes
    const galleryContainer = modalBody.querySelector('.event-gallery-container');
    if (galleryContainer && eventImages.length > 1) {
        initGallery(galleryContainer);
    }
    
    // Agregar event listener al botón de cerrar dentro del modal
    const closeModalBtn = modalBody.querySelector('.close-modal-btn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeEventModal);
    }
    
    // Mostrar el modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
}

/**
 * Cierra el modal de evento
 */
function closeEventModal() {
    const modal = document.getElementById('event-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar scroll del body
    }
}

/**
 * Muestra un mensaje de error y oculta las secciones de eventos
 */
function showErrorMessage(message) {
    // Ocultar las secciones de eventos
    const eventSections = document.querySelectorAll('.section');
    eventSections.forEach(section => {
        // Verificar si la sección contiene eventos (próximos o pasados)
        const hasEvents = section.querySelector('#upcoming-events-container, #past-events-container');
        if (hasEvents) {
            section.style.display = 'none';
        }
        
        // También verificar si es la sección de suscripción (forma compatible)
        const cardTitle = section.querySelector('.card.text-center h3.card-title');
        if (cardTitle && cardTitle.textContent.includes('¿Quieres recibir notificaciones de eventos?')) {
            section.style.display = 'none';
        }
    });
    
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-message';
    errorContainer.innerHTML = `
        <div class="card text-center" style="border: 2px solid var(--color-error); background-color: rgba(220, 53, 69, 0.05);">
            <h3 class="card-title" style="color: var(--color-error); margin-bottom: var(--spacing-md);">Error</h3>
            <p class="card-content" style="color: var(--color-gray-dark); font-size: var(--font-size-lg); margin-bottom: var(--spacing-lg);">
                ${message}
            </p>
            <button onclick="location.reload()" class="btn" style="background-color: var(--color-error); color: white; border: none; padding: var(--spacing-sm) var(--spacing-xl);">
                Reintentar
            </button>
        </div>
    `;
    
    // Insertar después del hero section (no al principio)
    const mainContent = document.querySelector('.main-content .content-container');
    if (mainContent) {
        // Encontrar el hero section
        const heroSection = mainContent.querySelector('.hero');
        if (heroSection) {
            // Insertar después del hero section
            heroSection.parentNode.insertBefore(errorContainer, heroSection.nextSibling);
        } else {
            // Fallback: insertar al principio si no se encuentra el hero section
            mainContent.insertBefore(errorContainer, mainContent.firstChild);
        }
    }
}

// Exportar funciones para uso global
window.EventSystem = {
    loadEvents,
    createEventCard,
    formatEventDate,
    getCategoryLabel,
    getEventMainImage,
    getEventAllImages,
    showEventModal,
    closeEventModal
};