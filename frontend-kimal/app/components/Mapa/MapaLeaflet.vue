<template>
  <div class="mapa-leaflet-wrapper">
    <!-- Controles del mapa -->
    <ControlesMapa 
      @toggle-linea="toggleLinea"
      @centrar-ubicacion="centrarEnMiUbicacion"
    />
    
    <!-- Filtro de instalaciones -->
    <div class="filtro-container">
      <FiltroInstalaciones 
        :data="data"
        @filtrar="aplicarFiltros" 
      />
    </div>
    
    <!-- Tarjeta de instalación -->
    <TarjetaInstalacion 
      :instalacion="instalacionSeleccionada"
      @cerrar="cerrarTarjeta"
      @ver-noticia="verNoticia"
      @ver-reporte="verReporte"
    />
    
    <div id="map"></div>
  </div>
</template>

<script setup>

import { onMounted, ref, defineEmits } from 'vue'
import axios from 'axios'
const emit = defineEmits(['seleccionar-instalacion'])
import FiltroInstalaciones from './filtroInstalaciones.vue'
import ControlesMapa from './controlesMapa.vue'
import TarjetaInstalacion from './tarjetaInstalacion.vue'

// Datos iniciales
const data = ref({ regiones: [], instalaciones: [] })

const instalacionesActuales = ref([])

const mapRef = ref(null)
const miUbicacionMarker = ref(null)
const marcadores = ref([])
const polylineRef = ref(null)
const mostrarLinea = ref(true)
const instalacionSeleccionada = ref(null)

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
      mapRef.value.setView([lat, lng], 13)
      if (miUbicacionMarker.value) {
        miUbicacionMarker.value.setLatLng([lat, lng])
      } else {
        miUbicacionMarker.value = window.L.marker([lat, lng], {
          icon: window.L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            shadowSize: [41, 41]
          })
        }).addTo(mapRef.value).bindPopup('¡Estás aquí!').openPopup()
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
}

function cerrarTarjeta() {
  instalacionSeleccionada.value = null
}

function verNoticia(noticia) {
  console.log('Ver noticia:', noticia)
  // Aquí puedes navegar a la página de la noticia o abrir un modal
}

function verReporte(reporte) {
  console.log('Ver reporte:', reporte)
  // Aquí puedes navegar a la página del reporte o abrir un modal
}

function aplicarFiltros(instalacionesFiltradas) {
  // Verificar que Leaflet esté disponible
  if (!window.L || !mapRef.value) {
    return
  }

  // Limpia marcadores y línea anterior
  marcadores.value.forEach(marker => marker.remove())
  marcadores.value = []
  if (polylineRef.value) {
    polylineRef.value.remove()
    polylineRef.value = null
  }

  // Actualiza instalaciones actuales
  instalacionesActuales.value = instalacionesFiltradas


  // Icono personalizado
  const customIcon = window.L.icon({
    iconUrl: '/images/logo-antena.svg',
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  })

  // Agrega marcadores filtrados y la línea
  const puntos = []
  instalacionesFiltradas.forEach(instalacion => {
    if (
      instalacion.location &&
      Array.isArray(instalacion.location.coordinates) &&
      instalacion.location.coordinates.length === 2
    ) {
      const [lng, lat] = instalacion.location.coordinates
      const marker = window.L.marker([lat, lng], { icon: customIcon })
        .addTo(mapRef.value)
        .bindPopup(instalacion.nombre)
      marker.on('click', () => {
        seleccionarInstalacion(instalacion.nombre)
      })
      marcadores.value.push(marker)
      puntos.push([lat, lng])
    }
  })

  if (puntos.length > 1 && mostrarLinea.value) {
    polylineRef.value = window.L.polyline(puntos, { color: 'blue', weight: 3 }).addTo(mapRef.value)
  }

  // Ajustar vista del mapa si hay instalaciones
  if (puntos.length > 0) {
    const group = new window.L.featureGroup(marcadores.value)
    mapRef.value.fitBounds(group.getBounds().pad(0.1))
  }
}

onMounted(async () => {


  // Cargar instalaciones, regiones y comunas desde el backend
  try {
    const [instRes, regRes, comRes] = await Promise.all([
      axios.get('http://localhost:5000/instalaciones'),
      axios.get('http://localhost:5000/regiones'),
      axios.get('http://localhost:5000/comunas')
    ])
    data.value.instalaciones = instRes.data
    data.value.regiones = regRes.data
    data.value.comunas = comRes.data
    instalacionesActuales.value = instRes.data
    aplicarFiltros(instRes.data)
  } catch (error) {
    console.error('Error cargando datos:', error)
  }

  const L = await import('leaflet')
  await import('leaflet/dist/leaflet.css')

  const map = L.map('map').setView([-29.9045, -71.2489], 6)
  mapRef.value = map
  window.L = L

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map)
})
</script>

<style>
.mapa-leaflet-wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  min-width: 100vw;
}

#map {
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  min-width: 100vw;
}

.filtro-container {
  position: absolute;
  z-index: 1000;
  top: 100px;
  left: 16px;
}

@media screen and (max-width: 768px) {
  .filtro-container {
    top: 90px;
    left: 10px;
    right: 10px;
  }
}

@media screen and (max-width: 480px) {
  .filtro-container {
    top: 80px;
    left: 8px;
    right: 8px;
  }
}
</style>