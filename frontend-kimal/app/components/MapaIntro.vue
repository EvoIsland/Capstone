<template>
  <div class="mapa-intro-wrapper">
    <button class="btn-ubicacion-intro" @click="centrarEnMiUbicacion">
      📍
    </button>
    <div id="map-intro"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

interface Instalacion {
  _id: string
  nombre: string
  location: {
    type: 'Point'
    coordinates: [number, number] // [longitud, latitud]
  }
  regionId: string
  comunaId: string
  direccion: string
}

const instalaciones = ref<Instalacion[]>([])
const mapRef = ref(null)
const miUbicacionMarker = ref(null)

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

onMounted(async () => {
  // 1. Obtén las instalaciones desde el backend
  const { data } = await axios.get('http://localhost:5000/instalaciones')
  instalaciones.value = data

  const L = await import('leaflet')
  await import('leaflet/dist/leaflet.css')

  const map = L.map('map-intro').setView([-29.9045, -71.2489], 6)
  mapRef.value = map
  window.L = L

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map)

  // Icono personalizado para las torres
  const customIcon = window.L.icon({
    iconUrl: '/images/logo-antena.svg',
    iconSize: [30, 30],
    iconAnchor: [15, 30]
  })

  // 2. Agrega los marcadores usando las coordenadas de la BD
  instalaciones.value.forEach(instalacion => {
    if (
      instalacion.location &&
      Array.isArray(instalacion.location.coordinates) &&
      instalacion.location.coordinates.length === 2
    ) {
      const [lng, lat] = instalacion.location.coordinates
      window.L.marker([lat, lng], { icon: customIcon })
        .addTo(mapRef.value)
        .bindPopup(instalacion.nombre)
    }
  })
})
</script>

<style scoped>
.mapa-intro-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 1.2rem;
  overflow: hidden;
}

#map-intro {
  width: 100%;
  height: 100%;
  min-height: 300px;
}

.btn-ubicacion-intro {
  position: absolute;
  z-index: 1000;
  top: 10px;
  right: 10px;
  background: #d32f2f;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.btn-ubicacion-intro:hover {
  background: #b71c1c;
}
</style>