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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 2000;
  padding-top: 90px; /* Altura del navbar + margen extra */
  box-sizing: border-box;
}
.modal-content {
  width: 90vw;
  max-width: 600px;
  background: #f7f7f7;
  border-radius: 2.5rem;
  box-shadow: 0 4px 32px 0 #0000004a;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  position: relative;
  max-height: calc(90vh - 90px);
  overflow-y: auto;
}
.close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: none;
  border: none;
  font-size: 2rem;
  color: #ff3388;
  cursor: pointer;
  transition: color 0.2s;
}
.close-btn:hover {
  color: #e6006d;
}
.post-header {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
}
.post-type {
  background: #ffe082;
  color: #333;
  border-radius: 1.2rem;
  padding: 0.3rem 1.2rem;
  font-size: 1rem;
  font-weight: 500;
  margin-right: 0.5rem;
}
.post-author {
  font-weight: 500;
  color: #6d6d6d;
}
.post-date {
  color: #888;
  font-size: 0.95rem;
  margin-left: auto;
}
.post-actions {
  display: flex;
  gap: 1.2rem;
  align-items: center;
  margin: 1.2rem 0;
}
.post-actions button {
  background: #ff3388;
  color: #fff;
  border: none;
  border-radius: 1.5rem;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.post-actions button:hover {
  background: #e6006d;
}
.likes-list {
  margin-bottom: 1rem;
  font-size: 0.95rem;
  color: #555;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.like-user {
  background: #e9e2f5;
  border-radius: 1rem;
  padding: 0.2rem 0.8rem;
  font-size: 0.95rem;
  color: #333;
}
.comentarios-section {
  margin-top: 2.2rem;
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 1px 4px #0001;
  padding: 1.5rem;
}
.comentarios-section h4 {
  font-size: 1.2rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 1rem;
}
.comentario-form {
  margin-top: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.comentario-form textarea {
  width: 100%;
  min-height: 60px;
  border-radius: 2rem;
  border: none;
  background: #e9e2f5;
  color: #333;
  font-size: 1.05rem;
  padding: 1rem 1.5rem;
  outline: none;
  transition: box-shadow 0.2s;
}
.comentario-form textarea::placeholder {
  color: #6d6d6d;
  opacity: 0.8;
}
.comentario-form textarea:focus {
  box-shadow: 0 0 0 2px #b388f5cc;
}
.comentario-form button {
  align-self: flex-end;
  background: #ff3388;
  color: #fff;
  border: none;
  border-radius: 1.5rem;
  padding: 0.5rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.comentario-form button:hover {
  background: #e6006d;
}
.comentario-form > div {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #ffe0e9;
  border-radius: 1rem;
  padding: 0.5rem 1rem;
  font-size: 0.95rem;
  color: #d8000c;
}
</style>