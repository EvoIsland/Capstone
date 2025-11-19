<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      
      <!-- Botón Cerrar Flotante -->
      <button class="close-btn" @click="$emit('close')">
        <IconifyIcon icon="mdi:close" width="24" height="24" />
      </button>

      <div v-if="publicacion" class="modal-body">
        
        <!-- Header del Post -->
        <div class="post-header">
          <!-- Avatar (Generado con iniciales) -->
          <div class="avatar">
            {{ publicacion.publicadorId?.nombre?.[0]?.toUpperCase() || 'U' }}
          </div>
          
          <div class="header-info">
            <div class="info-row">
              <span class="author-name">{{ publicacion.publicadorId?.nombre || 'Usuario' }}</span>
              <span class="post-type" :class="publicacion.tipo === 'Reporte' ? 'tag-report' : 'tag-question'">
                {{ publicacion.tipo }}
              </span>
            </div>
            <span class="post-date">{{ fechaFormateada }}</span>
          </div>
        </div>

        <!-- Contenido Principal -->
        <div class="post-main-content">
          <h2 v-if="publicacion.titulo" class="post-title">{{ publicacion.titulo }}</h2>
          <p class="post-text">{{ publicacion.texto }}</p>
        </div>

        <!-- Barra de Acciones -->
        <div class="post-actions">
          <button class="action-btn like-btn" :class="{ 'is-liked': userLiked }" @click="toggleLike">
            <IconifyIcon :icon="userLiked ? 'mdi:heart' : 'mdi:heart-outline'" width="20" height="20" />
            <span>{{ userLiked ? 'Te gusta' : 'Me gusta' }}</span>
          </button>
          
          <button class="action-btn share-btn" @click="compartir">
            <IconifyIcon icon="mdi:share-variant-outline" width="20" height="20" />
            <span>Compartir</span>
          </button>
        </div>

        <!-- Sección de Likes (Detalle) -->
        <div v-if="likesTotal > 0" class="likes-section">
          <div class="likes-icon">
             <IconifyIcon icon="mdi:heart" width="14" color="#fff" />
          </div>
          <span class="likes-count-text">
            A <b>{{ likesTotal }} personas</b> les gusta esto
          </span>
        </div>
        
        <!-- Lista de Nombres (Chips) -->
        <div v-if="likesUsuarios.length" class="likes-list">
          <span v-for="usuario in likesUsuarios" :key="usuario._id" class="like-chip">
            {{ usuario.nombre }}
          </span>
        </div>

        <!-- Sección de Comentarios -->
        <div class="comments-section">
          <h4 class="section-title">
            Respuestas <span class="count-badge">{{ comentarios.length }}</span>
          </h4>
          
          <div class="comments-list">
            <div v-if="cargandoComentarios" class="loading-text">Cargando respuestas...</div>
            <div v-else-if="comentarios.length === 0" class="empty-text">Sé el primero en responder.</div>
            <div v-else class="comments-wrapper">
              <ComentarioItem
                v-for="comentario in comentarios"
                :key="comentario._id"
                :comentario="comentario"
                @responder="responderAComentario"
              />
            </div>
          </div>

          <!-- Caja de Comentario (Sticky Bottom opcional, aquí estático) -->
          <div class="comment-input-area">
            <div v-if="respuestaA" class="replying-to">
              <span>Respondiendo a comentario...</span>
              <button @click="cancelarRespuesta" class="cancel-reply-btn">
                <IconifyIcon icon="mdi:close-circle" width="16" /> Cancelar
              </button>
            </div>
            
            <div class="input-wrapper">
              <textarea 
                v-model="nuevoComentario" 
                placeholder="Escribe tu respuesta aquí..."
                rows="1"
                @input="autoResize"
              ></textarea>
              <button 
                class="send-btn" 
                @click="enviarComentario"
                :disabled="!nuevoComentario.trim()"
              >
                <IconifyIcon icon="mdi:send" width="20" height="20" />
              </button>
            </div>
          </div>
        </div>

      </div>
      
      <!-- Loading State del Modal -->
      <div v-else class="modal-loading">
        <div class="spinner"></div>
        <p>Cargando...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuth } from '../../composables/useAuth'
import { Icon as IconifyIcon } from '@iconify/vue'
import ComentarioItem from '../components/ComentarioItem.vue'

const props = defineProps<{ publicacionId: string }>()
const emit = defineEmits(['close'])
const { user, accessToken } = useAuth()

const publicacion = ref<any>(null)
const likesTotal = ref(0)
const likesUsuarios = ref<{ _id: string; nombre: string }[]>([])
const userLiked = ref(false)
const comentarios = ref<any[]>([])
const nuevoComentario = ref('')
const respuestaA = ref<string | null>(null)
const cargandoComentarios = ref(false)

const fechaFormateada = computed(() =>
  publicacion.value?.fecha
    ? new Date(publicacion.value.fecha).toLocaleString()
    : ''
)

// Simples utilidades para auto-resize del textarea
const autoResize = (e: Event) => {
  const target = e.target as HTMLTextAreaElement
  target.style.height = 'auto'
  target.style.height = target.scrollHeight + 'px'
}

const fetchPublicacion = async () => {
  try {
    publicacion.value = await $fetch(`http://localhost:5000/publicacion/${props.publicacionId}`)
  } catch (e) { console.error(e) }
}

const fetchLikes = async () => {
  try {
    const res = await $fetch<{ total: number; usuarios: { _id: string; nombre: string }[] }>(
      `http://localhost:5000/publicacion/${props.publicacionId}/likes`
    )
    likesTotal.value = res.total
    likesUsuarios.value = res.usuarios
    userLiked.value = res.usuarios.some((u) => u._id === user.value?._id)
  } catch (e) { console.error(e) }
}

const fetchComentarios = async () => {
  cargandoComentarios.value = true
  try {
    comentarios.value = await $fetch(`http://localhost:5000/publicacion/${props.publicacionId}/comentarios`)
  } catch (e) { console.error(e) }
  cargandoComentarios.value = false
}

const toggleLike = async () => {
  try {
    await $fetch(`http://localhost:5000/publicacion/${props.publicacionId}/like`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken.value}` }
    })
    fetchLikes()
  } catch (e) { console.error(e) }
}

const enviarComentario = async () => {
  if (!nuevoComentario.value.trim()) return
  try {
    await $fetch(`http://localhost:5000/publicacion/${props.publicacionId}/comentario`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken.value}` },
      body: {
        texto: nuevoComentario.value,
        respuestaA: respuestaA.value || undefined
      }
    })
    nuevoComentario.value = ''
    respuestaA.value = null
    fetchComentarios()
  } catch (e) { console.error(e) }
}

const responderAComentario = (comentarioId: string) => {
  respuestaA.value = comentarioId
}

const cancelarRespuesta = () => {
  respuestaA.value = null
}

const compartir = () => {
  const url = `${window.location.origin}/publicacion/${props.publicacionId}`
  navigator.clipboard.writeText(url)
  alert('¡Enlace copiado al portapapeles!')
}

onMounted(() => {
  fetchPublicacion()
  fetchLikes()
  fetchComentarios()
})
</script>

<style scoped>
/* Overlay con Blur */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(31, 41, 55, 0.6); /* Gris oscuro semi-transparente */
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: flex-end; /* En móvil sale de abajo */
  z-index: 2000;
  padding: 0;
}

/* Modal Content */
.modal-content {
  width: 100%;
  max-width: 700px;
  height: 85vh; /* Ocupa casi toda la pantalla en altura */
  background: #ffffff;
  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
  box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  position: relative;
  animation: slideUp 0.3s ease-out;
}

@media (min-width: 768px) {
  .modal-overlay {
    align-items: center;
    padding: 2rem;
  }
  .modal-content {
    height: auto;
    max-height: 90vh;
    border-radius: 1.5rem;
    animation: fadeInScale 0.2s ease-out;
  }
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

/* Botón Cerrar */
.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #f3f4f6;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
}
.close-btn:hover {
  background: #e5e7eb;
  color: #ef4444;
}

/* Header */
.post-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-right: 2rem;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6200EA, #7C4DFF);
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-info {
  display: flex;
  flex-direction: column;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.author-name {
  font-weight: 700;
  color: #1f2937;
  font-size: 1.1rem;
}

.post-type {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 99px;
  font-weight: 600;
  text-transform: uppercase;
}
.tag-report { background: #FCE4EC; color: #C2185B; }
.tag-question { background: #E0F7FA; color: #0097A7; }

.post-date {
  font-size: 0.85rem;
  color: #9ca3af;
}

/* Contenido Principal */
.post-main-content {
  margin-bottom: 2rem;
}

.post-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111;
  margin: 0 0 0.5rem 0;
}

.post-text {
  font-size: 1rem;
  line-height: 1.6;
  color: #374151;
  white-space: pre-wrap; /* Respeta saltos de línea */
}

/* Acciones */
.post-actions {
  display: flex;
  gap: 1rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 1.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  color: #6b7280;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover { background: #f9fafb; }
.like-btn:hover, .like-btn.is-liked { color: #FF4081; background: #FFF0F5; }
.share-btn:hover { color: #6200EA; background: #F3E5F5; }

/* Sección Likes */
.likes-section {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 0.5rem;
}

.likes-icon {
  background: #FF4081;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.likes-count-text { font-size: 0.9rem; color: #4b5563; }

.likes-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 2rem;
}

.like-chip {
  font-size: 0.8rem;
  background: #f3f4f6;
  color: #4b5563;
  padding: 4px 10px;
  border-radius: 99px;
}

/* Comentarios */
.comments-section {
  background: #f9fafb;
  border-radius: 1rem;
  padding: 1.5rem;
}

.section-title {
  margin: 0 0 1.5rem 0;
  font-size: 1.1rem;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 8px;
}

.count-badge {
  background: #e5e7eb;
  color: #4b5563;
  padding: 2px 8px;
  border-radius: 99px;
  font-size: 0.8rem;
}

.comments-list { margin-bottom: 1.5rem; }
.empty-text, .loading-text { text-align: center; color: #9ca3af; font-style: italic; margin: 1rem 0; }

/* Input Comentario */
.comment-input-area {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 0.75rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.replying-to {
  display: flex;
  justify-content: space-between;
  background: #E0F7FA;
  color: #006064;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  margin-bottom: 8px;
}
.cancel-reply-btn {
  background: none;
  border: none;
  color: #00838F;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
}

.input-wrapper {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

textarea {
  flex: 1;
  border: none;
  resize: none;
  padding: 8px;
  font-family: inherit;
  font-size: 0.95rem;
  outline: none;
  max-height: 100px;
  color: #374151;
}

textarea::placeholder { color: #9ca3af; }

.send-btn {
  background: #6200EA;
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.send-btn:disabled {
  background: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
}

.send-btn:not(:disabled):hover {
  background: #5000c8;
  transform: scale(1.05);
}

/* Animaciones */
@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

@keyframes fadeInScale {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* Spinner */
.modal-loading {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}
.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #6200EA;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>