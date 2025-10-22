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

const instalaciones = [
  { nombre: 'Lampa', coords: [-33.2857, -70.8756], region: 'Región Metropolitana' },
  { nombre: 'Pudahuel', coords: [-33.4333, -70.7667], region: 'Región Metropolitana' },
  { nombre: 'Til Til', coords: [-33.0833, -70.9333], region: 'Región Metropolitana' },
  { nombre: 'Cabildo', coords: [-32.4333, -71.0167], region: 'Región de Valparaíso' },
  { nombre: 'Catemu', coords: [-32.7833, -70.9667], region: 'Región de Valparaíso' },
  { nombre: 'La Ligua', coords: [-32.4500, -71.2333], region: 'Región de Valparaíso' },
  { nombre: 'LlayLlay', coords: [-32.8167, -70.9667], region: 'Región de Valparaíso' },
  { nombre: 'Panquehue', coords: [-32.8000, -70.8333], region: 'Región de Valparaíso' },
  { nombre: 'Petorca', coords: [-32.2500, -70.9333], region: 'Región de Valparaíso' },
  { nombre: 'Andacollo', coords: [-29.6167, -71.1833], region: 'Región de Coquimbo' },
  { nombre: 'Combarbalá', coords: [-31.1792, -71.0583], region: 'Región de Coquimbo' },
  { nombre: 'Canela', coords: [-31.4000, -71.4500], region: 'Región de Coquimbo' },
  { nombre: 'Illapel', coords: [-31.6333, -71.1667], region: 'Región de Coquimbo' },
  { nombre: 'La Higuera', coords: [-29.5000, -71.2500], region: 'Región de Coquimbo' },
  { nombre: 'La Serena', coords: [-29.9045, -71.2489], region: 'Región de Coquimbo' },
  { nombre: 'Los Vilos', coords: [-31.9097, -71.5072], region: 'Región de Coquimbo' },
  { nombre: 'Ovalle', coords: [-30.6016, -71.2000], region: 'Región de Coquimbo' },
  { nombre: 'Punitaqui', coords: [-31.0500, -71.2500], region: 'Región de Coquimbo' },
  { nombre: 'Río Hurtado', coords: [-30.2667, -71.0833], region: 'Región de Coquimbo' },
  { nombre: 'Vicuña', coords: [-30.0333, -70.7083], region: 'Región de Coquimbo' },
  { nombre: 'Diego de Almagro', coords: [-26.3922, -70.0456], region: 'Atacama' },
  { nombre: 'Tierra Amarilla', coords: [-27.9833, -70.2500], region: 'Atacama' },
  { nombre: 'Vallenar', coords: [-28.5750, -70.7583], region: 'Atacama' },
  { nombre: 'Copiapó', coords: [-27.3667, -70.3333], region: 'Atacama' },
  { nombre: 'Antofagasta', coords: [-23.6500, -70.4000], region: 'Antofagasta' },
  { nombre: 'María Elena', coords: [-22.3500, -69.6667], region: 'Antofagasta' },
  { nombre: 'Sierra Gorda', coords: [-22.9500, -69.3167], region: 'Antofagasta' },
  { nombre: 'Taltal', coords: [-25.4000, -70.4833], region: 'Antofagasta' }
]

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

  // Agregar marcadores de instalaciones
  instalaciones.forEach(instalacion => {
    window.L.marker(instalacion.coords, { icon: customIcon })
      .addTo(mapRef.value)
      .bindPopup(instalacion.nombre)
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