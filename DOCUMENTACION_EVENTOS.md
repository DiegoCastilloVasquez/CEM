# Documentación: Sistema de Eventos del CEM

## 📋 Introducción

Este documento explica cómo actualizar los eventos en la página web del Centro de Estudiantes de Matemática. El sistema es completamente estático y fácil de usar.

## 🚀 Cómo Funciona

1. **Archivo de datos**: `data/events.json` contiene todos los eventos
2. **Carga automática**: La página `eventos.html` carga los eventos dinámicamente
3. **Filtrado inteligente**: Los eventos se dividen automáticamente en:
   - **Próximos**: Eventos con fecha futura
   - **Pasados**: Eventos con fecha pasada

## 📝 Cómo Añadir un Nuevo Evento

### Paso 1: Preparar la imagen del evento
1. Subir la imagen a: `assets/images/events/`
2. Formato recomendado: JPG o PNG
3. Tamaño recomendado: 800x450 píxeles
4. Nombre descriptivo: Ej: `taller-python-2025.jpg`

### Paso 2: Editar el archivo `data/events.json`

1. Abrir el archivo `data/events.json` en el hosting
2. Buscar el array `"events": [ ... ]`
3. Añadir el nuevo evento al PRINCIPIO del array (antes de los eventos existentes)

### Paso 3: Formato del Nuevo Evento

```json
{
  "id": 7,  // Número único (siguiente número disponible)
  "title": "Título del Evento",
  "date": "2025-01-20",  // Formato: AAAA-MM-DD
  "time": "15:00",       // Formato: HH:MM (24 horas)
  "endTime": "18:00",    // Hora de finalización (opcional)
  "location": "Lugar del evento",
  "category": "taller",  // Ver categorías disponibles abajo
  "description": "Descripción detallada del evento...",
  "images": [
    "assets/images/events/nombre-imagen.jpg"
  ],
  "registrationUrl": "#",  // Enlace de inscripción o "#" si no hay
  "createdBy": "Tu Nombre"
}
```

**Nota sobre imágenes**: 
- **Formato antiguo**: `"imageUrl": "ruta/a/imagen.jpg"` (soporte para compatibilidad)
- **Formato nuevo**: `"images": ["ruta/a/imagen1.jpg", "ruta/a/imagen2.jpg"]` (recomendado)
- **Múltiples imágenes**: Para eventos con varias imágenes, agrega todas las rutas en el array
- **Imagen única**: Para eventos con una sola imagen, usa un array con un solo elemento

## 🏷️ Categorías Disponibles

| Categoría | Descripción | Color en la web |
|-----------|-------------|-----------------|
| `taller` | Talleres prácticos | Azul |
| `charla` | Charlas y conferencias | Verde |
| `asamblea` | Reuniones de asamblea | Amarillo |
| `academico` | Eventos académicos | Púrpura |
| `tutoria` | Sesiones de tutoría | Celeste |
| `social` | Eventos sociales | Rosa |
| `deporte` | Actividades deportivas | Naranja |

## 📅 Formato de Fechas

- **Fecha del evento**: `"2025-01-20"` (AAAA-MM-DD)
- **Hora de inicio**: `"15:00"` (HH:MM en formato 24 horas)
- **Hora de finalización (opcional)**: `"18:00"` (HH:MM en formato 24 horas)

## 🔍 Ejemplo Completo

### Ejemplo con una sola imagen:
```json
{
  "id": 7,
  "title": "Taller de Machine Learning",
  "date": "2025-02-15",
  "time": "14:00",
  "endTime": "17:00",
  "location": "Laboratorio de Computación FCM",
  "category": "taller",
  "description": "Introducción a Machine Learning aplicado a problemas matemáticos. Aprenderás los conceptos básicos y realizarás ejercicios prácticos con Python.",
  "images": [
    "assets/images/events/taller-ml-2025.jpg"
  ],
  "registrationUrl": "https://forms.google.com/...",
  "createdBy": "Comité Académico CEM"
}
```

### Ejemplo con múltiples imágenes:
```json
{
  "id": 8,
  "title": "Talleres Introductorios",
  "date": "2026-01-19",
  "time": "09:00",
  "endTime": "18:00",
  "location": "Facultad de Ciencias Matemáticas",
  "category": "taller",
  "description": "Talleres introductorios para nuevos ingresantes.",
  "images": [
    "assets/images/events/talleres_introductorios_1.jpg",
    "assets/images/events/talleres_introductorios_2.jpg",
    "assets/images/events/talleres_introductorios_3.jpg",
    "assets/images/events/talleres_introductorios_4.jpg"
  ],
  "registrationUrl": "https://forms.gle/...",
  "createdBy": "CEM, CECC"
}
```

## 🛠️ Características Automáticas

### 1. **Filtrado por Fecha**
- Los eventos con fecha pasada se mueven automáticamente a "Eventos Pasados"
- Los eventos futuros aparecen en "Próximos Eventos"
- El sistema determina automáticamente si un evento es pasado o futuro basándose en la fecha

### 2. **Ordenamiento**
- Próximos eventos: Ordenados por fecha (más cercano primero)
- Eventos pasados: Ordenados por fecha (más reciente primero)

### 3. **Galería de Imágenes**
- **Eventos con una imagen**: Se muestra la imagen individualmente
- **Eventos con múltiples imágenes**: Se muestra una galería con navegación
- **Navegación**: Flechas izquierda/derecha, puntos indicadores y contador
- **Auto-avance**: Las imágenes cambian automáticamente cada 5 segundos
- **Interacción**: Pausa al pasar el mouse, navegación por teclado (flechas)

## ❓ Preguntas Frecuentes

### ¿Qué pasa si no tengo imagen para el evento?
El sistema mostrará una imagen por defecto. Es recomendable siempre incluir una imagen personalizada.

### ¿Puedo editar un evento existente?
Sí, solo edita los campos necesarios en el archivo `data/events.json`.

### ¿Cómo elimino un evento?
Elimina el objeto completo del evento del array `"events"`.

### ¿Los cambios son inmediatos?
Sí, al guardar el archivo JSON y recargar la página `eventos.html`.

## 📱 Responsive Design

La página de eventos es completamente responsive:
- **Desktop**: 3 columnas
- **Tablet**: 2 columnas  
- **Mobile**: 1 columna

## 🎨 Personalización Avanzada

### Cambiar colores de categorías
Los colores se definen en `styles/main.css` en la sección "Colores para categorías".

### Modificar diseño de tarjetas
Los estilos están en `styles/main.css` en la sección "ESTILOS PARA EL SISTEMA DE EVENTOS".

## 🔒 Consideraciones de Seguridad

- El sistema es completamente estático
- No hay base de datos ni backend
- Los datos solo son accesibles vía el archivo JSON
- Recomendado: Hacer backup regular del archivo `data/events.json`

---

**Mantenido por**: Centro de Estudiantes de Matemática - FCM UNMSM