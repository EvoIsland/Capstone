<template>
  <div class="admin-noticias-page">
    <!-- Barra de acciones superior -->
    <div class="actions-bar">
      <div class="filters-section">
        <select v-model="filtros.regionId" class="filter-select" @change="aplicarFiltros">
          <option value="">Todas las Regiones</option>
          <option v-for="r in regiones" :key="r._id" :value="r._id">{{ r.nombre }}</option>
        </select>
        <select v-model="filtros.comunaId" class="filter-select" @change="aplicarFiltros" :disabled="!filtros.regionId">
          <option value="">Todas las Comunas</option>
          <option v-for="c in comunasFiltradas" :key="c._id" :value="c._id">{{ c.nombre }}</option>
        </select>
        <select v-model="filtros.instalacionId" class="filter-select" @change="aplicarFiltros" :disabled="!filtros.comunaId">
          <option value="">Todas las Instalaciones</option>
          <option v-for="i in instalacionesFiltradas" :key="i._id" :value="i._id">{{ i.nombre }}</option>
        </select>
        <button @click="limpiarFiltros" class="btn-secondary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          Limpiar
        </button>
      </div>
      <button @click="$router.push('/admin/crear-noticia')" class="btn-primary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Nueva Noticia
      </button>
    </div>

    <!-- Estado de carga -->
    <div v-if="cargando" class="loading-state">
      <div class="loader"></div>
      <p>Cargando noticias...</p>
    </div>

    <!-- Estado de error -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
    </div>

    <!-- Tabla de noticias -->
    <div v-else class="table-container">
      <div v-if="noticiasFiltradas.length === 0" class="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
        <p>No hay noticias que coincidan con los filtros</p>
      </div>

      <table v-else class="noticias-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Fecha</th>
            <th>Ubicación</th>
            <th>Elementos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="noticia in noticiasFiltradas" :key="noticia._id">
            <td>
              <div class="noticia-titulo-cell">
                <strong>{{ noticia.titulo }}</strong>
                <span class="noticia-excerpt">{{ noticia.texto }}</span>
              </div>
            </td>
            <td>{{ formatDate(noticia.fecha) }}</td>
            <td>
              <div class="ubicacion-tags">
                <span v-if="noticia.regionId" class="tag">📍 Región</span>
                <span v-if="noticia.comunaId" class="tag">🏘️ Comuna</span>
                <span v-if="noticia.instalacionId" class="tag">🏢 Instalación</span>
                <span v-if="!noticia.regionId && !noticia.comunaId && !noticia.instalacionId" class="tag-global">🌐 Global</span>
              </div>
            </td>
            <td>
              <span class="elements-count">{{ noticia.contentJson?.length || 0 }} elementos</span>
            </td>
            <td>
              <div class="actions-buttons">
                <button @click="editarNoticia(noticia._id)" class="btn-edit" title="Editar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button @click="confirmarEliminar(noticia)" class="btn-delete" title="Eliminar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="noticiaAEliminar" class="modal-overlay" @click.self="noticiaAEliminar = null">
      <div class="modal-card">
        <h3>¿Eliminar noticia?</h3>
        <p>Esta acción no se puede deshacer. Se eliminará permanentemente:</p>
        <div class="noticia-preview">
          <strong>{{ noticiaAEliminar.titulo }}</strong>
          <span>{{ noticiaAEliminar.texto }}</span>
        </div>
        <div class="modal-actions">
          <button @click="noticiaAEliminar = null" class="btn-secondary">Cancelar</button>
          <button @click="eliminarNoticia()" class="btn-danger" :disabled="eliminando">
            {{ eliminando ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../../composables/useAuth'
import type { Noticia } from '../../../services/noticiasService'

definePageMeta({
  layout: 'admin'
})

const router = useRouter()
const { accessToken } = useAuth()

// Estado
const noticias = ref<Noticia[]>([])
const regiones = ref<any[]>([])
const comunas = ref<any[]>([])
const instalaciones = ref<any[]>([])
const cargando = ref(true)
const error = ref('')
const eliminando = ref(false)
const noticiaAEliminar = ref<Noticia | null>(null)

// Filtros
const filtros = ref({
  regionId: '',
  comunaId: '',
  instalacionId: ''
})

// Computed
const comunasFiltradas = computed(() => {
  if (!filtros.value.regionId) return []
  return comunas.value.filter(c => c.regionId === filtros.value.regionId)
})

const instalacionesFiltradas = computed(() => {
  if (!filtros.value.comunaId) return []
  return instalaciones.value.filter(i => i.comunaId === filtros.value.comunaId)
})

const noticiasFiltradas = computed(() => {
  let resultado = [...noticias.value]

  if (filtros.value.regionId) {
    resultado = resultado.filter(n => n.regionId === filtros.value.regionId)
  }
  if (filtros.value.comunaId) {
    resultado = resultado.filter(n => n.comunaId === filtros.value.comunaId)
  }
  if (filtros.value.instalacionId) {
    resultado = resultado.filter(n => n.instalacionId === filtros.value.instalacionId)
  }

  return resultado
})

// Watchers para resetear filtros dependientes
watch(() => filtros.value.regionId, () => {
  filtros.value.comunaId = ''
  filtros.value.instalacionId = ''
})

watch(() => filtros.value.comunaId, () => {
  filtros.value.instalacionId = ''
})

// Métodos
async function cargarDatos() {
  cargando.value = true
  error.value = ''
  try {
    const [noticiasRes, regionesRes, comunasRes, instalacionesRes] = await Promise.all([
      $fetch<Noticia[]>('http://localhost:5000/noticias'),
      $fetch<any[]>('http://localhost:5000/regiones'),
      $fetch<any[]>('http://localhost:5000/comunas'),
      $fetch<any[]>('http://localhost:5000/instalaciones')
    ])
    noticias.value = noticiasRes
    regiones.value = regionesRes
    comunas.value = comunasRes
    instalaciones.value = instalacionesRes
  } catch (e) {
    error.value = 'Error al cargar los datos'
    console.error(e)
  } finally {
    cargando.value = false
  }
}

function aplicarFiltros() {
  // Los filtros se aplican automáticamente por el computed
}

function limpiarFiltros() {
  filtros.value.regionId = ''
  filtros.value.comunaId = ''
  filtros.value.instalacionId = ''
}

function editarNoticia(id: string) {
  router.push(`/admin/editar-noticia/${id}`)
}

function confirmarEliminar(noticia: Noticia) {
  noticiaAEliminar.value = noticia
}

async function eliminarNoticia() {
  if (!noticiaAEliminar.value) return
  eliminando.value = true
  try {
    await $fetch(`http://localhost:5000/noticia/${noticiaAEliminar.value._id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })
    noticias.value = noticias.value.filter(n => n._id !== noticiaAEliminar.value?._id)
    noticiaAEliminar.value = null
  } catch (e) {
    alert('Error al eliminar la noticia')
    console.error(e)
  } finally {
    eliminando.value = false
  }
}

function formatDate(fecha: string) {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(cargarDatos)
</script>

<style scoped>
.admin-noticias-page {
  padding: 2rem;
}

.actions-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.filters-section {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  flex: 1;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  min-width: 150px;
}

.filter-select:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #f9fafb;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2563eb;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  color: #dc2626;
}

.table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #9ca3af;
}

.empty-state svg {
  margin-bottom: 1rem;
  opacity: 0.5;
}

.noticias-table {
  width: 100%;
  border-collapse: collapse;
}

.noticias-table thead {
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
}

.noticias-table th {
  text-align: left;
  padding: 1rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.noticias-table td {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.noticias-table tbody tr:hover {
  background: #f9fafb;
}

.noticia-titulo-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.noticia-titulo-cell strong {
  color: #111827;
  font-size: 0.95rem;
}

.noticia-excerpt {
  color: #6b7280;
  font-size: 0.85rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ubicacion-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag, .tag-global {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  background: #eff6ff;
  color: #1e40af;
  border: 1px solid #dbeafe;
}

.tag-global {
  background: #f0fdf4;
  color: #166534;
  border-color: #dcfce7;
}

.elements-count {
  font-size: 0.875rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  display: inline-block;
}

.actions-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-edit,
.btn-delete {
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-edit {
  background: #eff6ff;
  color: #2563eb;
}

.btn-edit:hover {
  background: #dbeafe;
}

.btn-delete {
  background: #fef2f2;
  color: #dc2626;
}

.btn-delete:hover {
  background: #fee2e2;
}

/* Modal */
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
  backdrop-filter: blur(4px);
}

.modal-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.modal-card h3 {
  margin: 0 0 0.5rem 0;
  color: #111827;
}

.modal-card p {
  color: #6b7280;
  margin-bottom: 1rem;
}

.noticia-preview {
  background: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.noticia-preview strong {
  color: #111827;
}

.noticia-preview span {
  color: #6b7280;
  font-size: 0.9rem;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.btn-danger {
  background: #dc2626;
  color: white;
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-danger:hover:not(:disabled) {
  background: #b91c1c;
}

.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
