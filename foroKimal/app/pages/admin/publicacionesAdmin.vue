<template>
  <div class="publicaciones-admin">
    <div class="publications-layout">
      
      <!-- Columna 1: Lista de Instalaciones -->
      <div class="publications-col-1">
        <div class="column-card">
          <div class="column-header">
            <h3>Instalaciones</h3>
            <p>Selecciona para filtrar publicaciones</p>
            <div class="column-filters">
              <select v-model="selectedRegion" class="form-select" @change="filterInstalaciones">
                <option value="">Todas las Regiones</option>
                <option v-for="region in regiones" :key="region">{{ region }}</option>
              </select>
            </div>
          </div>
          <div class="column-content-list">
            <div v-if="loadingInstalaciones" class="loading-small">
              <div class="spinner-small"></div>
            </div>
            <a 
              v-for="instalacion in filteredInstalaciones" 
              :key="instalacion._id"
              href="#"
              class="installation-item"
              :class="{ 'is-active': selectedInstalacion?._id === instalacion._id }"
              @click.prevent="selectInstalacion(instalacion)"
            >
              <h4>{{ instalacion.nombre }}</h4>
              <p>{{ instalacion.comuna }}</p>
            </a>
            <div v-if="!loadingInstalaciones && filteredInstalaciones.length === 0" class="empty-small">
              <p>No hay instalaciones</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Columna 2: Feed de Publicaciones -->
      <div class="publications-col-2">
        <div class="column-card">
          <div class="column-header">
            <div>
              <h3>
                Publicaciones en 
                <span class="highlight">{{ selectedInstalacion?.nombre || 'Todas las instalaciones' }}</span>
              </h3>
            </div>
            <div class="column-filters">
              <select v-model="filterTipo" class="form-select">
                <option value="">Todos los tipos</option>
                <option value="pregunta">Preguntas</option>
                <option value="reporte">Reportes</option>
                <option value="noticia">Noticias</option>
              </select>
            </div>
          </div>
          
          <div class="publications-feed">
            <div v-if="loadingPublicaciones" class="loading-small">
              <div class="spinner-small"></div>
              <p>Cargando publicaciones...</p>
            </div>

            <div 
              v-for="pub in filteredPublicaciones" 
              :key="pub._id"
              class="publication-item"
              :class="{ 'is-active': selectedPublicacion?._id === pub._id }"
              @click="selectPublicacion(pub)"
            >
              <div class="publication-item-content">
                <div class="publication-item-header">
                  <div class="publication-item-author">
                    <div class="avatar-placeholder-small">
                      {{ getInitials(pub.publicadorId) }}
                    </div>
                    <div>
                      <p class="name">{{ pub.publicadorId?.nombre || 'Usuario' }}</p>
                      <p class="date">{{ formatDate(pub.fecha) }}</p>
                    </div>
                  </div>
                  <span class="status-badge" :class="getBadgeClass(pub.tipo)">
                    {{ pub.tipo }}
                  </span>
                </div>
                <h4>{{ getTruncatedText(pub.texto, 50) }}</h4>
                <p>{{ getTruncatedText(pub.texto, 120) }}</p>
              </div>
            </div>

            <div v-if="!loadingPublicaciones && filteredPublicaciones.length === 0" class="empty-small">
              <p>No hay publicaciones</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Columna 3: Comentarios -->
      <div class="publications-col-3">
        <div class="column-card">
          <div class="column-header">
            <h3>Comentarios</h3>
            <p v-if="selectedPublicacion">
              de "{{ getTruncatedText(selectedPublicacion.texto, 30) }}"
            </p>
            <p v-else>Selecciona una publicación</p>
          </div>
          
          <div class="column-content-list">
            <div v-if="loadingComentarios" class="loading-small">
              <div class="spinner-small"></div>
            </div>

            <div v-if="selectedPublicacion && !loadingComentarios">
              <div 
                v-for="comment in comentarios" 
                :key="comment._id"
                class="comment-item"
              >
                <div class="comment-header">
                  <div class="comment-author">
                    <div class="avatar-placeholder-tiny">
                      {{ getInitials(comment.autorId) }}
                    </div>
                    <span>{{ comment.autorId?.nombre || 'Usuario' }}</span>
                  </div>
                  <button class="comment-action-btn" @click="deleteComment(comment._id)">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
                <p>{{ comment.texto }}</p>
              </div>

              <div v-if="comentarios.length === 0" class="empty-small">
                <p>No hay comentarios</p>
              </div>
            </div>

            <div v-if="!selectedPublicacion" class="empty-small">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p>Selecciona una publicación para ver comentarios</p>
            </div>
          </div>

          <div v-if="selectedPublicacion" class="comment-footer">
            <button class="button button-primary" @click="openPublicacionModal">
              Ver Detalles Completos
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Detalles de Publicación -->
    <div v-if="showModal" class="modal-container" @click="closeModal">
      <div class="modal-content modal-content-lg" @click.stop>
        <div class="modal-header">
          <h3>Detalle de Publicación</h3>
          <button class="close-modal" @click="closeModal">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="post-details-grid">
          <!-- Columna Izquierda: Publicación -->
          <div class="post-details-post">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
              <h4>Publicación</h4>
              <div style="display: flex; gap: 0.5rem;">
                <button class="button button-gray" @click="editPublicacion">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Editar
                </button>
                <button class="button button-danger" @click="confirmDeletePublicacion">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                  Eliminar
                </button>
              </div>
            </div>
            
            <div class="post-details-author">
              <div class="avatar-placeholder-small">
                {{ getInitials(selectedPublicacion?.publicadorId) }}
              </div>
              <span class="name">{{ selectedPublicacion?.publicadorId?.nombre || 'Usuario' }}</span>
              <span class="date">· {{ formatDate(selectedPublicacion?.fecha) }}</span>
            </div>
            
            <div class="post-meta">
              <span class="status-badge" :class="getBadgeClass(selectedPublicacion?.tipo)">
                {{ selectedPublicacion?.tipo }}
              </span>
            </div>

            <div class="prose">
              <p>{{ selectedPublicacion?.texto }}</p>
            </div>

            <div v-if="selectedPublicacion?.imagenes && selectedPublicacion.imagenes.length > 0" class="post-images">
              <h5>Imágenes adjuntas</h5>
              <div class="images-grid">
                <img 
                  v-for="(img, idx) in selectedPublicacion.imagenes" 
                  :key="idx"
                  :src="img" 
                  alt="Imagen de publicación"
                />
              </div>
            </div>
          </div>

          <!-- Columna Derecha: Comentarios -->
          <div class="post-details-comments">
            <h5>Comentarios ({{ comentarios.length }})</h5>
            
            <div 
              v-for="comment in comentarios" 
              :key="comment._id"
              class="comment-item"
            >
              <div class="comment-header">
                <div class="comment-author">
                  <div class="avatar-placeholder-tiny">
                    {{ getInitials(comment.autorId) }}
                  </div>
                  <span>{{ comment.autorId?.nombre || 'Usuario' }}</span>
                </div>
                <button class="comment-action-btn" @click="deleteComment(comment._id)">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
              <p>{{ comment.texto }}</p>
            </div>

            <div v-if="comentarios.length === 0" class="empty-small">
              <p>No hay comentarios</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '../../../composables/useAuth'

definePageMeta({
  layout: 'admin'
})

const { accessToken } = useAuth()

// Estado
const instalaciones = ref<any[]>([])
const publicaciones = ref<any[]>([])
const comentarios = ref<any[]>([])
const regiones = ref<string[]>([])

const selectedRegion = ref('')
const selectedInstalacion = ref<any>(null)
const selectedPublicacion = ref<any>(null)
const filterTipo = ref('')

const loadingInstalaciones = ref(false)
const loadingPublicaciones = ref(false)
const loadingComentarios = ref(false)
const showModal = ref(false)

// Computed
const filteredInstalaciones = computed(() => {
  if (!selectedRegion.value) return instalaciones.value
  return instalaciones.value.filter(i => i.region === selectedRegion.value)
})

const filteredPublicaciones = computed(() => {
  let filtered = publicaciones.value

  // Filtrar por instalación
  if (selectedInstalacion.value) {
    filtered = filtered.filter(p => 
      p.comunaId?.includes(selectedInstalacion.value.comuna) ||
      p.regionId?.includes(selectedInstalacion.value.region)
    )
  }

  // Filtrar por tipo
  if (filterTipo.value) {
    filtered = filtered.filter(p => p.tipo === filterTipo.value)
  }

  return filtered
})

// Métodos
const cargarInstalaciones = async () => {
  loadingInstalaciones.value = true
  try {
    const res = await fetch('http://localhost:5000/admin/instalaciones', {
      headers: { Authorization: `Bearer ${accessToken.value}` }
    })
    if (!res.ok) throw new Error('Error al cargar instalaciones')
    instalaciones.value = await res.json()
    
    // Extraer regiones únicas
    regiones.value = [...new Set(instalaciones.value.map(i => i.region).filter(Boolean))]
  } catch (err) {
    console.error(err)
  } finally {
    loadingInstalaciones.value = false
  }
}

const cargarPublicaciones = async () => {
  loadingPublicaciones.value = true
  try {
    const res = await fetch('http://localhost:5000/admin/publicaciones', {
      headers: { Authorization: `Bearer ${accessToken.value}` }
    })
    if (!res.ok) throw new Error('Error al cargar publicaciones')
    publicaciones.value = await res.json()
  } catch (err) {
    console.error(err)
  } finally {
    loadingPublicaciones.value = false
  }
}

const cargarComentarios = async (publicacionId: string) => {
  loadingComentarios.value = true
  try {
    const res = await fetch(`http://localhost:5000/comentarios/publicacion/${publicacionId}`)
    if (!res.ok) throw new Error('Error al cargar comentarios')
    comentarios.value = await res.json()
  } catch (err) {
    console.error(err)
    comentarios.value = []
  } finally {
    loadingComentarios.value = false
  }
}

const selectInstalacion = (instalacion: any) => {
  selectedInstalacion.value = instalacion
  selectedPublicacion.value = null
  comentarios.value = []
}

const selectPublicacion = (publicacion: any) => {
  selectedPublicacion.value = publicacion
  cargarComentarios(publicacion._id)
}

const filterInstalaciones = () => {
  selectedInstalacion.value = null
  selectedPublicacion.value = null
  comentarios.value = []
}

const openPublicacionModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const deleteComment = async (commentId: string) => {
  if (!confirm('¿Eliminar este comentario?')) return
  
  try {
    const res = await fetch(`http://localhost:5000/comentarios/${commentId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken.value}` }
    })
    if (!res.ok) throw new Error('Error al eliminar comentario')
    
    // Recargar comentarios
    if (selectedPublicacion.value) {
      cargarComentarios(selectedPublicacion.value._id)
    }
  } catch (err) {
    console.error(err)
  }
}

const confirmDeletePublicacion = async () => {
  if (!selectedPublicacion.value) return
  if (!confirm('¿Eliminar esta publicación?')) return
  
  try {
    const res = await fetch(`http://localhost:5000/admin/publicaciones/${selectedPublicacion.value._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken.value}` }
    })
    if (!res.ok) throw new Error('Error al eliminar publicación')
    
    closeModal()
    selectedPublicacion.value = null
    comentarios.value = []
    await cargarPublicaciones()
  } catch (err) {
    console.error(err)
  }
}

const editPublicacion = () => {
  alert('Función de edición en desarrollo')
  // Aquí puedes agregar lógica para editar
}

// Utilidades
const getInitials = (user: any) => {
  if (!user) return 'U'
  if (typeof user === 'string') return 'U'
  const nombre = user.nombre || ''
  const apellido = user.apellido || ''
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase() || 'U'
}

const getTruncatedText = (text: string, maxLength: number) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

const formatDate = (date: any) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-CL')
}

const getBadgeClass = (tipo: string) => {
  const classes: Record<string, string> = {
    pregunta: 'status-blue',
    reporte: 'status-red',
    noticia: 'status-green'
  }
  return classes[tipo] || 'status-gray'
}

onMounted(() => {
  cargarInstalaciones()
  cargarPublicaciones()
})
</script>

<style scoped lang="scss">
.publicaciones-admin {
  margin: -2rem;
  padding: 0;
  height: calc(100vh - 64px);
}

.publications-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  height: 100%;
  padding: 2rem;
  overflow: hidden;
  
  @media (min-width: 1024px) {
    grid-template-columns: 3fr 4fr 3fr;
  }
}

.column-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.column-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
  
  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0 0 0.25rem 0;
    color: #111827;
  }
  
  p {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .highlight {
    color: var(--fondo-oscuro);
    font-weight: 600;
  }
}

.column-filters {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
  
  .form-select {
    flex: 1;
  }
}

.column-content-list {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.publications-feed {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.installation-item {
  display: block;
  padding: 0.75rem;
  border-radius: 0.5rem;
  text-decoration: none;
  color: inherit;
  border-left: 4px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  
  h4 {
    font-weight: 500;
    margin: 0 0 0.25rem 0;
    font-size: 0.95rem;
    color: #111827;
  }
  
  p {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
  }
  
  &:hover {
    background: #f3f4f6;
  }
  
  &.is-active {
    background: rgba(142, 36, 170, 0.1);
    border-left-color: var(--fondo-oscuro);
  }
}

.publication-item {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
  
  &:hover {
    border-color: var(--color-rosado);
  }
  
  &.is-active {
    border-color: var(--fondo-oscuro);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
}

.publication-item-content {
  padding: 1.25rem;
}

.publication-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.publication-item-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  p {
    margin: 0;
  }
  
  .name {
    font-weight: 500;
    font-size: 0.875rem;
  }
  
  .date {
    font-size: 0.75rem;
    color: #6b7280;
  }
}

.publication-item h4 {
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #1f2937;
  font-size: 0.95rem;
}

.publication-item p {
  font-size: 0.875rem;
  color: #4b5563;
  margin: 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.avatar-placeholder-small {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background: var(--fondo-oscuro);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.avatar-placeholder-tiny {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  background: var(--fondo-oscuro);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.625rem;
  flex-shrink: 0;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  display: inline-flex;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  text-transform: capitalize;
  
  &.status-blue {
    background: rgba(33, 150, 243, 0.1);
    color: var(--fondo-azul);
  }
  
  &.status-red {
    background: #fee2e2;
    color: #dc2626;
  }
  
  &.status-green {
    background: #d1fae5;
    color: #059669;
  }
  
  &.status-gray {
    background: #f3f4f6;
    color: #6b7280;
  }
}

.comment-item {
  background: #f9fafb;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.comment-author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  span {
    font-weight: 500;
    font-size: 0.875rem;
  }
}

.comment-action-btn {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #dc2626;
  }
}

.comment-item p {
  font-size: 0.875rem;
  color: #4b5563;
  margin: 0;
}

.comment-footer {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.loading-small, .empty-small {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  text-align: center;
  
  svg {
    color: #9ca3af;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #6b7280;
    font-size: 0.875rem;
    margin: 0;
  }
}

.spinner-small {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(142, 36, 170, 0.2);
  border-top-color: var(--fondo-oscuro);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 0.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

// Modal Styles
.modal-container {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 48rem;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  
  &.modal-content-lg {
    max-width: 72rem;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
  }
  
  .close-modal {
    background: none;
    border: none;
    cursor: pointer;
    color: #9ca3af;
    padding: 0;
    display: flex;
    align-items: center;
    
    &:hover {
      color: #4b5563;
    }
  }
}

.post-details-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr;
  overflow: hidden;
  
  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
}

.post-details-post {
  padding: 1.5rem;
  overflow-y: auto;
  border-right: 1px solid #e5e7eb;
  
  h4 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
  }
}

.post-details-author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  .name {
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  .date {
    font-size: 0.875rem;
    color: #6b7280;
  }
}

.post-meta {
  margin-bottom: 1rem;
}

.prose {
  line-height: 1.6;
  color: #374151;
  
  p {
    margin-bottom: 1rem;
  }
}

.post-images {
  margin-top: 1.5rem;
  
  h5 {
    font-weight: 600;
    margin: 0 0 0.75rem 0;
    font-size: 0.95rem;
  }
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
  
  img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
  }
}

.post-details-comments {
  padding: 1.5rem;
  background: #f9fafb;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  h5 {
    font-weight: 600;
    margin: 0;
  }
  
  .comment-item {
    background: white;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }
}

.form-select {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  background: white;
  font-family: 'Inter', sans-serif;
  
  &:focus {
    outline: none;
    border-color: var(--fondo-oscuro);
    box-shadow: 0 0 0 1px var(--fondo-oscuro);
  }
}

.button {
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  
  svg {
    flex-shrink: 0;
  }
  
  &.button-primary {
    background: var(--fondo-oscuro);
    color: white;
    
    &:hover {
      background: var(--color-rosado);
    }
  }
  
  &.button-gray {
    background: #e5e7eb;
    color: #1f2937;
    
    &:hover {
      background: #d1d5db;
    }
  }
  
  &.button-danger {
    background: #dc2626;
    color: white;
    
    &:hover {
      background: #b91c1c;
    }
  }
}
</style>