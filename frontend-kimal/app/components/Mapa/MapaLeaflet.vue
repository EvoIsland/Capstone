<template>
  <div class="mapa-leaflet-wrapper">
    
    <!-- 1. CAPA DEL MAPA -->
    <div id="map"></div>

    <!-- 2. CAPA DE INTERFAZ (UI) -->
    <div class="ui-layer">
        
      <!-- Header Flotante -->
      <!-- <header class="top-bar">
        <div class="glass-panel brand-pill">
          <div class="logo-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div class="brand-info">
            <h1>Conexión</h1>
            <p>Línea Kimal - Lo Aguirre</p>
          </div>
        </div>
        
        <div class="glass-panel user-pill pointer-events-auto">
          <div class="user-text">
            <div class="user-name">Biron L.</div>
            <div class="user-status">Online</div>
          </div>
          <div class="user-avatar">
            <!-- Placeholder o imagen de usuario real -->
            <!-- <div class="avatar-placeholder">B</div>
          </div>
        </div>
      </header> --> 

      <!-- Panel Izquierdo (Stack de Tarjetas: Filtros y Detalles) -->
      <div class="left-panel-container">
          
        <!-- Filtro de instalaciones -->
        <!-- Envolvemos el componente en el estilo de tarjeta -->
        <div class="glass-panel filter-card" v-show="!instalacionSeleccionada">
          <FiltroInstalaciones 
            :data="data"
            @filtrar="aplicarFiltros" 
          />
        </div>

        <!-- Tarjeta de instalación (Detalle) -->
        <!-- Se muestra cuando hay una seleccionada -->
        <div class="glass-panel detail-card" :class="{ active: instalacionSeleccionada }">
          <TarjetaInstalacion 
            v-if="instalacionSeleccionada"
            :instalacion="instalacionSeleccionada"
            @cerrar="cerrarTarjeta"
            @ver-noticia="verNoticia"
            @ver-reporte="verReporte"
          />
        </div>

      </div>

      <!-- Controles Derecha -->
      <div class="right-controls">
        <!-- Pasamos estilos o clases si el componente lo permite, o dejamos que el componente maneje sus botones internos -->
        <ControlesMapa 
          @toggle-linea="toggleLinea"
          @centrar-ubicacion="centrarEnMiUbicacion"
        />
      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, defineEmits } from 'vue'
import axios from 'axios'

// Importar componentes hijos
import FiltroInstalaciones from './filtroInstalaciones.vue'
import ControlesMapa from './controlesMapa.vue'
import TarjetaInstalacion from './tarjetaInstalacion.vue'

const emit = defineEmits(['seleccionar-instalacion'])

// Datos iniciales
const data = ref({ regiones: [], instalaciones: [] })
const instalacionesActuales = ref([])

// Refs del mapa
const mapRef = ref(null)
const miUbicacionMarker = ref(null)
const marcadores = ref([])
const polylineRef = ref(null)
const mostrarLinea = ref(true)
const instalacionSeleccionada = ref(null)

// --- LÓGICA DEL MAPA ---

function centrarEnMiUbicacion() {
  if (!mapRef.value) return
  if (!navigator.geolocation) {
    alert('La geolocalización no está soportada en este navegador.')
    return
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude
      const lng = pos.coords.longitude
      
      mapRef.value.flyTo([lat, lng], 14, { duration: 1.5 }) // Usamos flyTo para animación suave
      
      // Marcador de "Yo" personalizado
      if (miUbicacionMarker.value) {
        miUbicacionMarker.value.setLatLng([lat, lng])
      } else {
        const meIcon = window.L.divIcon({
            html: '<div style="width:16px; height:16px; background:#3b82f6; border:3px solid white; border-radius:50%; box-shadow:0 2px 5px rgba(0,0,0,0.2);"></div>',
            className: 'me-marker',
            iconSize: [16, 16]
        });
        
        miUbicacionMarker.value = window.L.marker([lat, lng], { icon: meIcon })
          .addTo(mapRef.value)
          .bindPopup('¡Estás aquí!')
          .openPopup()
      }
    },
    () => {
      alert('No se pudo obtener tu ubicación.')
    }
  )
}

function toggleLinea(mostrar) {
  mostrarLinea.value = mostrar
  if (polylineRef.value) {
    if (mostrar) {
      polylineRef.value.addTo(mapRef.value)
    } else {
      polylineRef.value.remove()
    }
  }
}

function seleccionarInstalacion(nombre) {
  const instalacion = instalacionesActuales.value.find(inst => inst.nombre === nombre)
  instalacionSeleccionada.value = instalacion
  emit('seleccionar-instalacion', nombre)
  
  // Centrar mapa suavemente
  if (instalacion && instalacion.location) {
     const [lng, lat] = instalacion.location.coordinates
     mapRef.value.flyTo([lat, lng], 13, { duration: 1.2 })
  }
}

function cerrarTarjeta() {
  instalacionSeleccionada.value = null
  // Opcional: Resetear zoom
  // mapRef.value.flyTo(initialCoords, 11); 
}

function verNoticia(noticia) {
  console.log('Ver noticia:', noticia)
}

function verReporte(reporte) {
  console.log('Ver reporte:', reporte)
}

function aplicarFiltros(instalacionesFiltradas) {
  if (!window.L || !mapRef.value) return

  // Limpiar mapa
  marcadores.value.forEach(marker => marker.remove())
  marcadores.value = []
  if (polylineRef.value) {
    polylineRef.value.remove()
    polylineRef.value = null
  }

  instalacionesActuales.value = instalacionesFiltradas

  // --- ICONO PERSONALIZADO (CSS/HTML) ---
  // Reemplaza la imagen SVG por el DivIcon verde del diseño nuevo
  const customIcon = window.L.divIcon({
    className: 'custom-marker',
    html: `<div style="
        background-color: #10b981;
        width: 36px; height: 36px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 10px rgba(16, 185, 129, 0.4);
        display: flex; align-items: center; justify-content: center;
        color: white;
        transition: transform 0.2s;
        cursor: pointer;
    ">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  })

  const puntos = []
  
  instalacionesFiltradas.forEach(instalacion => {
    if (instalacion.location?.coordinates?.length === 2) {
      const [lng, lat] = instalacion.location.coordinates
      
      const marker = window.L.marker([lat, lng], { icon: customIcon })
        .addTo(mapRef.value)
      
      // Tooltip simple al hover
      marker.bindTooltip(instalacion.nombre, { offset: [0, -20], direction: 'top' });

      marker.on('click', () => {
        seleccionarInstalacion(instalacion.nombre)
      })
      
      marcadores.value.push(marker)
      puntos.push([lat, lng])
    }
  })

  // Dibujar Línea con estilo moderno
  if (puntos.length > 1 && mostrarLinea.value) {
    polylineRef.value = window.L.polyline(puntos, { 
        color: '#7c3aed', // Morado Kimal
        weight: 4,
        opacity: 0.8,
        lineCap: 'round',
        dashArray: '10, 10', 
        dashOffset: '0'
    }).addTo(mapRef.value)
  }

  if (puntos.length > 0) {
    const group = new window.L.featureGroup(marcadores.value)
    mapRef.value.fitBounds(group.getBounds().pad(0.1))
  }
}

onMounted(async () => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.apiUrl
  
  // Cargar datos
  try {
    const [instRes, regRes, comRes] = await Promise.all([
      axios.get(`${apiUrl}/instalaciones`),
      axios.get(`${apiUrl}/regiones`),
      axios.get(`${apiUrl}/comunas`)
    ])
    data.value.instalaciones = instRes.data
    data.value.regiones = regRes.data
    data.value.comunas = comRes.data
    instalacionesActuales.value = instRes.data
  } catch (error) {
    console.error('Error cargando datos:', error)
  }

  const L = await import('leaflet')
  await import('leaflet/dist/leaflet.css')
  window.L = L

  // Inicializar Mapa
  // Usamos zoomControl: false para usar nuestros propios controles si los tuvieras en ControlesMapa
  const map = L.map('map', { zoomControl: false }).setView([-29.9045, -71.2489], 6)
  mapRef.value = map

  // --- TILE LAYER MODERNO (CartoDB Light) ---
  // Este estilo gris claro hace que los marcadores verdes resalten más
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    subdomains: 'abcd',
    attribution: '&copy; OpenStreetMap &copy; CARTO'
  }).addTo(map)

  aplicarFiltros(instalacionesActuales.value)
})
</script>

<style scoped>
/* --- VARIABLES DE DISEÑO --- */
.mapa-leaflet-wrapper {
  --primary: #7c3aed;
  --primary-light: #8b5cf6;
  --primary-soft: #f3e8ff;
  --success: #10b981;
  --success-dark: #059669;
  --success-soft: #d1fae5;
  --text-main: #1f2937;
  --text-light: #6b7280;
  --bg-glass: rgba(255, 255, 255, 0.92);
  
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  color: var(--text-main);
}

#map {
  position: absolute;
  inset: 0;
  z-index: 0;
  background-color: #e5e7eb;
}

/* --- CAPA UI (FLOTANTE) --- */
.ui-layer {
  position: absolute;
  inset: 0;
  pointer-events: none; /* Permite clics en el mapa a través de áreas vacías */
  z-index: 10;
  display: flex;
  flex-direction: column;
}

/* Estilos Glassmorphism Reutilizables */
.glass-panel {
  background: var(--bg-glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  pointer-events: auto; /* Reactivar clics en los paneles */
  transition: all 0.3s ease;
}

/* --- TOP BAR --- */
.top-bar {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand-pill {
  padding: 8px 20px 8px 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-box {
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  color: white;
  width: 40px; height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
}

.brand-info h1 { margin: 0; font-size: 18px; font-weight: 700; letter-spacing: -0.5px; line-height: 1.2; }
.brand-info p { margin: 0; font-size: 12px; color: var(--text-light); font-weight: 500; }

.user-pill {
  padding: 6px 12px 6px 6px;
  display: flex; align-items: center; gap: 10px;
}
.user-text { text-align: right; margin-right: 4px; }
.user-name { font-size: 12px; font-weight: 700; }
.user-status { font-size: 10px; color: var(--success); }
.user-avatar {
  width: 36px; height: 36px; border-radius: 50%; background-color: #f3f4f6;
  border: 2px solid white; overflow: hidden;
}
.avatar-placeholder {
    width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
    background: #64748B; color: white; font-weight: bold;
}


/* --- LEFT PANEL CONTAINER (Filtros y Detalle) --- */
.left-panel-container {
  position: absolute;
  top: 100px;
  left: 20px;
  bottom: 30px;
  width: 340px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  pointer-events: none;
}

/* El componente FiltroInstalaciones debe ser flexible */
.filter-card {
  padding: 20px;
  transform-origin: top left;
  /* Asegúrate de que tu componente hijo ocupe el espacio bien */
}

/* El componente TarjetaInstalacion (Detalle) */
.detail-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  opacity: 0; 
  pointer-events: none; 
  transform: translateY(20px);
  max-height: 0; /* Para no ocupar espacio cuando está oculto */
}

.detail-card.active {
  opacity: 1; 
  pointer-events: auto; 
  transform: translateY(0);
  max-height: 100%; /* Restaurar altura */
}

/* --- RIGHT CONTROLS --- */
.right-controls {
  position: absolute;
  top: 100px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}
/* Asumiendo que ControlesMapa tiene pointer-events: auto en sus botones */

/* --- MEDIA QUERIES --- */
@media screen and (max-width: 768px) {
  .left-panel-container {
    width: auto;
    right: 20px; /* Full width minus padding */
    top: 80px;
    bottom: 20px;
  }
  .brand-info p { display: none; } /* Simplificar header en móvil */
  .right-controls { top: auto; bottom: 100px; right: 20px; } /* Controles abajo en móvil */
}
</style>