# Página Web del CEM - Centro de Estudiantes de Matemática

Página web oficial del Centro de Estudiantes de Matemática de la Facultad de Ciencias Matemáticas de la Universidad Nacional Mayor de San Marcos (CEM - FCM - UNMSM).

## Estructura del Proyecto

```
├── index.html                  # Página principal
├── nosotros.html               # Información sobre el CEM
├── eventos.html                # Calendario de actividades (carga dinámica desde JSON)
├── recursos.html               # Recursos académicos
├── contacto.html               # Información de contacto
├── DOCUMENTACION_EVENTOS.md    # Documentación del sistema de eventos
├── README.md                   # Este archivo
├── styles/                     # Estilos CSS
│   ├── variables.css          # Variables de diseño
│   ├── reset.css              # Reset CSS
│   ├── main.css               # Estilos principales
│   └── responsive.css         # Estilos responsive
├── scripts/                    # JavaScript
│   ├── main.js                # Funcionalidades principales
│   └── events.js              # Sistema de gestión de eventos (carga desde JSON)
├── data/                       # Datos en formato JSON
│   └── events.json            # Base de datos de eventos
└── assets/                     # Recursos multimedia
    └── images/                # Imágenes
```

## Características

- **Diseño moderno y profesional**: Utilizando una paleta de grises (blanco, negro y tonalidades de gris)
- **Totalmente responsive**: Diseño mobile-first que se adapta a todos los dispositivos
- **Navegación intuitiva**: Menú de navegación claro y fácil de usar
- **Contenido organizado**: Secciones bien estructuradas para cada tipo de información
- **Sistema de eventos dinámico**: Los eventos se cargan desde un archivo JSON y se renderizan dinámicamente
- **Sin dependencias externas**: Solo HTML, CSS y JavaScript vanilla
- **Optimizado para performance**: Carga rápida y eficiente

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos con variables CSS y Grid/Flexbox
- **JavaScript ES6**: Funcionalidades interactivas (incluyendo Fetch API para datos dinámicos)
- **JSON**: Almacenamiento de datos estructurados (eventos)
- **Git**: Control de versiones

## Contenido de las Páginas

### 1. Inicio (`index.html`)
- Presentación del CEM
- Noticias destacadas
- Próximos eventos
- Llamadas a la acción

### 2. Nosotros (`nosotros.html`)
- Misión y visión del CEM
- Historia
- Equipo directivo
- Comisiones de trabajo

### 3. Eventos (`eventos.html`)
- Próximos eventos
- Eventos recurrentes
- Eventos pasados
- Calendario de actividades
- **Carga dinámica**: Los eventos se obtienen desde `data/events.json` mediante `scripts/events.js`

### 4. Recursos (`recursos.html`)
- Material por cursos
- Herramientas y software
- Biblioteca virtual
- Tutorías y apoyo académico
- Investigación y publicaciones

### 5. Contacto (`contacto.html`)
- Información de contacto
- Ubicación
- Preguntas frecuentes
- Redes sociales

## Licencia

Este proyecto está disponible para uso del Centro de Estudiantes de Matemática de la FCM-UNMSM. Puede ser modificado y adaptado según las necesidades del CEM.

## Créditos

Desarrollado como una solución base para la página web del CEM. Estructura y diseño creados para ser fácilmente mantenibles y escalables.

---

**Centro de Estudiantes de Matemática**  
Facultad de Ciencias Matemáticas  
Universidad Nacional Mayor de San Marcos  
Lima, Perú