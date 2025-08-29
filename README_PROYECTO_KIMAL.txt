# Proyecto: Mapa Interactivo en Tiempo Real para Conexiones Kimal

## Problema
La empresa Conexiones Kimal necesita informar a la comunidad sobre las instalaciones eléctricas y construcciones que realiza en diferentes sectores. Actualmente, los vecinos cercanos a estas obras no cuentan con información clara y actualizada sobre el estado, ubicación y detalles de las intervenciones en terreno. Esto genera incertidumbre y falta de comunicación entre la empresa y la comunidad.

## Objetivo
Desarrollar una aplicación web con un mapa interactivo en tiempo real que muestre:
- Ubicación de cada instalación eléctrica o construcción.
- Estado de cada obra (en construcción, en mantención, completada).
- Información relevante sobre cada intervención (nombre, descripción, detalles técnicos, etc.).
- Acceso fácil y visual para los usuarios cercanos a las obras.

## Tecnologías Utilizadas
### Backend
- Node.js
- Express
- TypeScript

### Frontend
- Nuxt.js (Vue 3)
- Mapas: Leaflet o Mapbox

## Pasos Realizados
1. Inicio del proyecto Nuxt:
   - `npx nuxi init frontend-kimal`
   - `cd frontend-kimal`
   - `npm install`
2. Inicio del proyecto backend:
   - Estructura en `backend-kimal` con Node.js, Express y TypeScript.
3. Documentación y planificación inicial en este archivo.

## Próximos Pasos
- Implementar el mapa interactivo en el frontend.
- Conectar el frontend con el backend para obtener datos en tiempo real.
- Agregar detalles y estados de cada instalación en el mapa.
- Mejorar la visualización y experiencia de usuario.
