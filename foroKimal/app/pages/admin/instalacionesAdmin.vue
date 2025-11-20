<template>
  <div class="instalaciones-admin">
    <!-- Controles superiores -->
    <div class="controls-bar">
      <div class="search-section">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar instalaciones..."
          class="search-input"
        />
      </div>
      <button @click="openCreateModal" class="btn-create">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Nueva Instalación
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando instalaciones...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <p>Error al cargar instalaciones: {{ error }}</p>
    </div>

    <!-- Tabla de instalaciones -->
    <div v-else class="table-container">
      <table v-if="filteredInstalaciones.length > 0" class="data-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Comuna</th>
            <th>Región</th>
            <th>Coordenadas</th>
            <th class="actions-column">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="inst in filteredInstalaciones" :key="inst._id">
            <td class="font-semibold">{{ inst.nombre }}</td>
            <td>{{ inst.direccion }}</td>
            <td>{{ getComunaNombre(inst.comunaId) }}</td>
            <td>{{ getRegionNombre(inst.regionId) }}</td>
            <td class="coords-cell">
              <span class="coord-badge">
                {{ inst.location?.coordinates[1]?.toFixed(6) }}, 
                {{ inst.location?.coordinates[0]?.toFixed(6) }}
              </span>
            </td>
            <td class="actions-column">
              <button @click="openEditModal(inst)" class="btn-icon btn-edit" title="Editar">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button @click="openViewModal(inst)" class="btn-icon btn-view" title="Ver en mapa">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </button>
              <button @click="confirmDelete(inst)" class="btn-icon btn-delete" title="Eliminar">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">
        <svg width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <p>No se encontraron instalaciones</p>
        <button @click="openCreateModal" class="btn-create">Crear primera instalación</button>
      </div>
    </div>

    <!-- Modal para Crear/Editar -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content modal-large">
          <div class="modal-header">
            <h3>{{ modalMode === 'create' ? 'Nueva Instalación' : modalMode === 'edit' ? 'Editar Instalación' : 'Ver Instalación' }}</h3>
            <button @click="closeModal" class="btn-close">
              <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <form v-if="modalMode !== 'view'" @submit.prevent="handleSubmit" class="form-instalacion">
              <div class="form-grid">
                <div class="form-group">
                  <label for="nombre">Nombre de la Instalación *</label>
                  <input
                    id="nombre"
                    v-model="formData.nombre"
                    type="text"
                    placeholder="Ej: Centro de Salud Familiar"
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="direccion">Dirección *</label>
                  <input
                    id="direccion"
                    v-model="formData.direccion"
                    type="text"
                    placeholder="Ej: Av. Libertador 123"
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="region">Región *</label>
                  <select id="region" v-model="formData.regionId" @change="onRegionChange" required>
                    <option value="">Seleccionar región...</option>
                    <option v-for="region in regiones" :key="region._id" :value="region._id">
                      {{ region.nombre }}
                    </option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="comuna">Comuna *</label>
                  <select id="comuna" v-model="formData.comunaId" :disabled="!formData.regionId" required>
                    <option value="">Seleccionar comuna...</option>
                    <option v-for="comuna in comunasFiltradas" :key="comuna._id" :value="comuna._id">
                      {{ comuna.nombre }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="map-section">
                <h4>Ubicación en el Mapa</h4>
                <p class="map-instructions">Haz clic en el mapa para seleccionar la ubicación exacta de la instalación</p>
                <div id="map" ref="mapContainer" class="map-container"></div>
                
                <div class="coords-display">
                  <div class="coord-group">
                    <label>Latitud:</label>
                    <input
                      v-model="formData.location.coordinates[1]"
                      type="number"
                      step="any"
                      readonly
                      class="coord-input"
                    />
                  </div>
                  <div class="coord-group">
                    <label>Longitud:</label>
                    <input
                      v-model="formData.location.coordinates[0]"
                      type="number"
                      step="any"
                      readonly
                      class="coord-input"
                    />
                  </div>
                </div>
              </div>
            </form>

            <!-- Vista de solo lectura -->
            <div v-else class="view-mode">
              <div class="info-grid">
                <div class="info-item">
                  <label>Nombre:</label>
                  <p>{{ selectedInstalacion?.nombre }}</p>
                </div>
                <div class="info-item">
                  <label>Dirección:</label>
                  <p>{{ selectedInstalacion?.direccion }}</p>
                </div>
                <div class="info-item">
                  <label>Comuna:</label>
                  <p>{{ getComunaNombre(selectedInstalacion?.comunaId) }}</p>
                </div>
                <div class="info-item">
                  <label>Región:</label>
                  <p>{{ getRegionNombre(selectedInstalacion?.regionId) }}</p>
                </div>
              </div>

              <div class="map-section">
                <h4>Ubicación</h4>
                <div id="map-view" ref="mapViewContainer" class="map-container"></div>
                <div class="coords-display">
                  <div class="coord-group">
                    <label>Coordenadas:</label>
                    <p class="coord-value">
                      {{ selectedInstalacion?.location?.coordinates[1]?.toFixed(6) }}, 
                      {{ selectedInstalacion?.location?.coordinates[0]?.toFixed(6) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button v-if="modalMode === 'view'" @click="closeModal" type="button" class="btn-secondary">
              Cerrar
            </button>
            <template v-else>
              <button @click="closeModal" type="button" class="btn-secondary">
                Cancelar
              </button>
              <button @click="handleSubmit" type="submit" class="btn-primary">
                {{ modalMode === 'create' ? 'Crear Instalación' : 'Guardar Cambios' }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useAuth } from '../../../composables/useAuth'

definePageMeta({
  layout: 'admin'
})

const { accessToken } = useAuth()

// State
const instalaciones = ref<any[]>([])
const regiones = ref<any[]>([])
const comunas = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')

const showModal = ref(false)
const modalMode = ref<'create' | 'edit' | 'view'>('create')
const selectedInstalacion = ref<any>(null)

const formData = ref({
  _id: '',
  nombre: '',
  direccion: '',
  comunaId: '',
  regionId: '',
  location: {
    type: 'Point',
    coordinates: [-70.6693, -33.4489] // Santiago por defecto
  }
})

// Leaflet Map
const mapContainer = ref<HTMLElement | null>(null)
const mapViewContainer = ref<HTMLElement | null>(null)
let map: any = null
let viewMap: any = null
let marker: any = null
let viewMarker: any = null
let L: any = null

// Computed
const filteredInstalaciones = computed(() => {
  if (!searchQuery.value) return instalaciones.value
  const query = searchQuery.value.toLowerCase()
  return instalaciones.value.filter(inst =>
    inst.nombre.toLowerCase().includes(query) ||
    inst.direccion.toLowerCase().includes(query) ||
    getComunaNombre(inst.comunaId).toLowerCase().includes(query) ||
    getRegionNombre(inst.regionId).toLowerCase().includes(query)
  )
})

const comunasFiltradas = computed(() => {
  if (!formData.value.regionId) return []
  return comunas.value.filter(c => c.regionId === formData.value.regionId)
})

// Methods
const getComunaNombre = (comunaId: string) => {
  const comuna = comunas.value.find(c => c._id === comunaId)
  return comuna?.nombre || comunaId
}

const getRegionNombre = (regionId: string) => {
  const region = regiones.value.find(r => r._id === regionId)
  return region?.nombre || regionId
}

const onRegionChange = () => {
  formData.value.comunaId = ''
}

const API_URL = process.env.NUXT_PUBLIC_API_URL || 'http://localhost:5000';

const loadInstalaciones = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await fetch(`${API_URL}/admin/instalaciones`, {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })
    if (!response.ok) throw new Error('Error al cargar instalaciones')
    instalaciones.value = await response.json()
  } catch (err: any) {
    error.value = err.message
    console.error('Error cargando instalaciones:', err)
  } finally {
    loading.value = false
  }
}

const loadRegiones = async () => {
  try {
    const response = await fetch(`${API_URL}/regiones`)
    if (!response.ok) throw new Error('Error al cargar regiones')
    regiones.value = await response.json()
  } catch (err) {
    console.error('Error cargando regiones:', err)
  }
}

const loadComunas = async () => {
  try {
    const response = await fetch(`${API_URL}/comunas`)
    if (!response.ok) throw new Error('Error al cargar comunas')
    comunas.value = await response.json()
  } catch (err) {
    console.error('Error cargando comunas:', err)
  }
}

const loadLeaflet = async () => {
  if (typeof window === 'undefined') return
  
  // Cargar CSS de Leaflet
  if (!document.querySelector('link[href*="leaflet.css"]')) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)
  }

  // Cargar JS de Leaflet
  if (!window.L) {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = () => {
        L = window.L
        resolve(true)
      }
      document.head.appendChild(script)
    })
  } else {
    L = window.L
  }
}

const initMap = async () => {
  await nextTick()
  if (!mapContainer.value || !L) return

  // Destruir mapa anterior si existe
  if (map) {
    map.remove()
    map = null
  }

  // Crear nuevo mapa
  map = L.map(mapContainer.value).setView([formData.value.location.coordinates[1], formData.value.location.coordinates[0]], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  // Crear marcador arrastrable
  marker = L.marker([formData.value.location.coordinates[1], formData.value.location.coordinates[0]], {
    draggable: true
  }).addTo(map)

  // Evento al arrastrar el marcador
  marker.on('dragend', (e: any) => {
    const position = e.target.getLatLng()
    formData.value.location.coordinates = [position.lng, position.lat]
  })

  // Evento al hacer clic en el mapa
  map.on('click', (e: any) => {
    const { lat, lng } = e.latlng
    formData.value.location.coordinates = [lng, lat]
    marker.setLatLng([lat, lng])
  })
}

const initViewMap = async () => {
  await nextTick()
  if (!mapViewContainer.value || !L || !selectedInstalacion.value) return

  if (viewMap) {
    viewMap.remove()
    viewMap = null
  }

  const coords = selectedInstalacion.value.location.coordinates
  viewMap = L.map(mapViewContainer.value).setView([coords[1], coords[0]], 15)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(viewMap)

  viewMarker = L.marker([coords[1], coords[0]]).addTo(viewMap)
  viewMarker.bindPopup(`<b>${selectedInstalacion.value.nombre}</b><br>${selectedInstalacion.value.direccion}`).openPopup()
}

const openCreateModal = async () => {
  modalMode.value = 'create'
  formData.value = {
    _id: '',
    nombre: '',
    direccion: '',
    comunaId: '',
    regionId: '',
    location: {
      type: 'Point',
      coordinates: [-70.6693, -33.4489]
    }
  }
  showModal.value = true
  await loadLeaflet()
  await nextTick()
  await initMap()
}

const openEditModal = async (inst: any) => {
  modalMode.value = 'edit'
  selectedInstalacion.value = inst
  formData.value = {
    _id: inst._id,
    nombre: inst.nombre,
    direccion: inst.direccion,
    comunaId: inst.comunaId,
    regionId: inst.regionId,
    location: {
      type: 'Point',
      coordinates: [...inst.location.coordinates]
    }
  }
  showModal.value = true
  await loadLeaflet()
  await nextTick()
  await initMap()
}

const openViewModal = async (inst: any) => {
  modalMode.value = 'view'
  selectedInstalacion.value = inst
  showModal.value = true
  await loadLeaflet()
  await nextTick()
  await initViewMap()
}

const closeModal = () => {
  showModal.value = false
  if (map) {
    map.remove()
    map = null
  }
  if (viewMap) {
    viewMap.remove()
    viewMap = null
  }
  selectedInstalacion.value = null
}

const handleSubmit = async () => {
  try {
    const url = modalMode.value === 'create'
      ? `${API_URL}/admin/instalaciones`
      : `${API_URL}/admin/instalaciones/${formData.value._id}`
    
    const method = modalMode.value === 'create' ? 'POST' : 'PUT'

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken.value}`
      },
      body: JSON.stringify(formData.value)
    })

    if (!response.ok) throw new Error('Error al guardar instalación')

    await loadInstalaciones()
    closeModal()
  } catch (err: any) {
    alert('Error: ' + err.message)
    console.error('Error guardando instalación:', err)
  }
}

const confirmDelete = async (inst: any) => {
  if (!confirm(`¿Estás seguro de eliminar la instalación "${inst.nombre}"?`)) return

  try {
    const response = await fetch(`${API_URL}/admin/instalaciones/${inst._id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })

    if (!response.ok) throw new Error('Error al eliminar instalación')

    await loadInstalaciones()
  } catch (err: any) {
    alert('Error: ' + err.message)
    console.error('Error eliminando instalación:', err)
  }
}

onMounted(async () => {
  await loadInstalaciones()
  await loadRegiones()
  await loadComunas()
  await loadLeaflet()
})
</script>

<style scoped lang="scss">
.instalaciones-admin {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.controls-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
}

.search-section {
  flex: 1;
  max-width: 400px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--fondo-azul, #2196F3);
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
  }
}

.btn-create {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--fondo-oscuro, #8e24aa);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #7b1fa2;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(142, 36, 170, 0.3);
  }
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(142, 36, 170, 0.1);
  border-top-color: var(--fondo-oscuro, #8e24aa);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-container {
  padding: 2rem;
  background: #ffebee;
  border: 1px solid #ef5350;
  border-radius: 8px;
  color: #c62828;
  text-align: center;
}

.table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.data-table {
  width: 100%;
  border-collapse: collapse;

  thead {
    background: linear-gradient(135deg, var(--fondo-oscuro, #8e24aa), #7b1fa2);
    color: white;

    th {
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid #f0f0f0;
      transition: background 0.2s ease;

      &:hover {
        background: #f8f9fa;
      }

      td {
        padding: 1rem;
        font-size: 0.95rem;

        &.font-semibold {
          font-weight: 600;
          color: #333;
        }
      }
    }
  }
}

.coords-cell {
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
}

.coord-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 12px;
  font-size: 0.8rem;
}

.actions-column {
  width: 150px;
  text-align: center;

  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.btn-icon {
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &.btn-edit {
    background: #e3f2fd;
    color: #1976d2;

    &:hover {
      background: #1976d2;
      color: white;
    }
  }

  &.btn-view {
    background: #f3e5f5;
    color: #7b1fa2;

    &:hover {
      background: #7b1fa2;
      color: white;
    }
  }

  &.btn-delete {
    background: #ffebee;
    color: #d32f2f;

    &:hover {
      background: #d32f2f;
      color: white;
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #757575;

  svg {
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  p {
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
  }
}

// Modal Styles
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  overflow-y: auto;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  animation: modalSlideIn 0.3s ease;

  &.modal-large {
    max-width: 1000px;
  }
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e0e0e0;

  h3 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
  }
}

.btn-close {
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #757575;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f5f5;
    color: #333;
  }
}

.modal-body {
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
}

.form-instalacion {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-weight: 600;
    color: #333;
    font-size: 0.9rem;
  }

  input, select {
    padding: 0.75rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 0.95rem;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: var(--fondo-azul, #2196F3);
      box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
    }

    &:disabled {
      background: #f5f5f5;
      cursor: not-allowed;
    }
  }
}

.map-section {
  h4 {
    margin: 0 0 0.5rem 0;
    color: #333;
  }
}

.map-instructions {
  color: #757575;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.map-container {
  width: 100%;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-bottom: 1rem;
}

.coords-display {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.coord-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;

  label {
    font-weight: 600;
    color: #333;
    min-width: 80px;
  }

  .coord-input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    background: #f8f9fa;
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
  }
}

.view-mode {
  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin-bottom: 2rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .info-item {
    label {
      display: block;
      font-weight: 600;
      color: #757575;
      font-size: 0.85rem;
      margin-bottom: 0.25rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    p {
      margin: 0;
      font-size: 1rem;
      color: #333;
    }
  }

  .coord-value {
    font-family: 'Courier New', monospace;
    color: #1976d2;
    font-weight: 600;
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid #e0e0e0;
}

.btn-primary, .btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: var(--fondo-oscuro, #8e24aa);
  color: white;

  &:hover {
    background: #7b1fa2;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(142, 36, 170, 0.3);
  }
}

.btn-secondary {
  background: #f5f5f5;
  color: #333;

  &:hover {
    background: #e0e0e0;
  }
}
</style>