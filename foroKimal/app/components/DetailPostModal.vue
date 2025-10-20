<!-- filepath: c:\proyectos\Capstone\foroKimal\app\components\PostDetailModal.vue -->
<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="close-btn" @click="$emit('close')">✕</button>
      <div v-if="publicacion">
        <!-- Header -->
        <div class="post-header">
          <span class="post-type">{{ publicacion.tipo }}</span>
          <span class="post-author">@{{ publicacion.publicadorId?.nombre || 'Usuario' }}</span>
          <span class="post-date">{{ fechaFormateada }}</span>
        </div>
        <!-- Título y texto -->
        <h2 v-if="publicacion.titulo">{{ publicacion.titulo }}</h2>
        <p>{{ publicacion.texto }}</p>

        <!-- Acciones -->
        <div class="post-actions">
          <button @click="toggleLike">
            <span v-if="userLiked">❤️ Quitar Me gusta</span>
            <span v-else>🤍 Me gusta</span>
          </button>
          <span>{{ likesTotal }} Me gusta</span>
          <button @click="compartir">🔗 Compartir</button>
        </div>
        <div v-if="likesUsuarios.length" class="likes-list">
          <span v-for="usuario in likesUsuarios" :key="usuario._id" class="like-user">
            {{ usuario.nombre }}
          </span>
        </div>

        <!-- Comentarios -->
        <div class="comentarios-section">
          <h4>Respuestas ({{ comentarios.length }})</h4>
          <div v-if="cargandoComentarios">Cargando...</div>
          <div v-else>
            <ComentarioItem
              v-for="comentario in comentarios"
              :key="comentario._id"
              :comentario="comentario"
              @responder="responderAComentario"
            />
          </div>
          <!-- Formulario para comentar/responder -->
          <div class="comentario-form">
            <textarea v-model="nuevoComentario" placeholder="Escribe tu respuesta..."></textarea>
            <div v-if="respuestaA">
              <span>Respondiendo a un comentario</span>
              <button @click="cancelarRespuesta">Cancelar</button>
            </div>
            <button @click="enviarComentario">Publicar Respuesta</button>
          </div>
        </div>
      </div>
      <div v-else>Cargando publicación...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuth } from '../../composables/useAuth'

// Componente recursivo para comentarios y respuestas
import ComentarioItem from '../components/ComentarioItem.vue'

const props = defineProps<{ publicacionId: string }>()
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

const fetchPublicacion = async () => {
  publicacion.value = await $fetch(`http://localhost:5000/publicacion/${props.publicacionId}`)
}
const fetchLikes = async () => {
  const res = await $fetch<{ total: number; usuarios: { _id: string; nombre: string }[] }>(
    `http://localhost:5000/publicacion/${props.publicacionId}/likes`
  )
  likesTotal.value = res.total
  likesUsuarios.value = res.usuarios
  userLiked.value = res.usuarios.some((u) => u._id === user.value?._id)
}
const fetchComentarios = async () => {
  cargandoComentarios.value = true
  comentarios.value = await $fetch(`http://localhost:5000/publicacion/${props.publicacionId}/comentarios`)
  cargandoComentarios.value = false
}
const toggleLike = async () => {
  await $fetch(`http://localhost:5000/publicacion/${props.publicacionId}/like`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken.value}` }
  })
  fetchLikes()
}
const enviarComentario = async () => {
  if (!nuevoComentario.value.trim()) return
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
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  position: relative;
}
.close-btn {
  position: absolute;
  top: 1rem; right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
.post-header {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
}
.post-type {
  background: #ffe082;
  color: #333;
  border-radius: 8px;
  padding: 0.2rem 0.7rem;
  font-size: 0.9rem;
  font-weight: bold;
}
.post-author {
  font-weight: bold;
}
.post-date {
  color: #888;
  font-size: 0.9rem;
}
.post-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin: 1rem 0;
}
.likes-list {
  margin-bottom: 1rem;
  font-size: 0.95rem;
  color: #555;
}
.like-user {
  margin-right: 8px;
}
.comentarios-section {
  margin-top: 2rem;
}
.comentario-form {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.comentario-form textarea {
  width: 100%;
  min-height: 60px;
  border-radius: 8px;
  border: 1px solid #ccc;
  padding: 0.5rem;
}
.comentario-form button {
  align-self: flex-end;
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.2rem;
  cursor: pointer;
}
</style>