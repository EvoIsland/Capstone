<template>
  <div class="post-box">
    
    <!-- Cabecera del Post -->
    <div class="post-header">
      <!-- Avatar con gradiente sutil en borde -->
      <div class="avatar-wrapper">
        <div class="avatar" :style="{ background: avatarColor || '#6200EA' }">
          {{ userInitials }}
        </div>
      </div>
      
      <div class="post-info">
        <div class="info-top">
          <span class="username">{{ username }}</span>
          <span class="post-type" :class="typeClass">{{ tipo }}</span>
        </div>
        <span class="time">{{ fecha }}</span>
      </div>
      
      <div class="post-options">
        <button class="icon-btn">
          <IconifyIcon icon="mdi:dots-horizontal" width="24" height="24" />
        </button>
      </div>
    </div>

    <!-- Contenido (Clickeable) -->
    <div class="post-content" @click="$emit('abrirDetalle', publicacionId)">
      <p class="post-text">
        <span class="username-highlight">{{ username }}</span>
        {{ texto }}
      </p>
      
      <!-- Metadatos (Ubicación) -->
      <div class="post-meta-tags" v-if="region || comuna || instalacion">
        <span v-if="region" class="meta-tag">
          <IconifyIcon icon="mdi:map-marker-outline" width="14" /> {{ region }}
        </span>
        <span v-if="comuna" class="meta-tag">
          <IconifyIcon icon="mdi:city-variant-outline" width="14" /> {{ comuna }}
        </span>
        <span v-if="instalacion" class="meta-tag">
          <IconifyIcon icon="mdi:office-building-outline" width="14" /> {{ instalacion }}
        </span>
      </div>
    </div>

    <!-- Imagen del Post -->
    <div v-if="imagenes && imagenes.length" class="post-image-container" @click="$emit('abrirDetalle', publicacionId)">
      <img :src="imagenes[0]" alt="Imagen de Publicación" loading="lazy" />
    </div>

    <!-- Barra de Acciones -->
    <div class="post-actions">
      <button class="action-btn like-btn" :class="{ 'is-liked': userLiked }" @click.stop="toggleLike">
        <IconifyIcon :icon="userLiked ? 'mdi:heart' : 'mdi:heart-outline'" width="20" height="20" />
        <span>{{ userLiked ? 'Te gusta' : 'Me gusta' }}</span>
      </button>
      
      <button class="action-btn comment-btn" @click.stop="$emit('abrirDetalle', publicacionId)">
        <IconifyIcon icon="mdi:comment-outline" width="20" height="20" />
        <span>Comentar</span>
      </button>
      
      <button class="action-btn share-btn" @click.stop="compartir">
        <IconifyIcon icon="mdi:share-variant-outline" width="20" height="20" />
        <span>Compartir</span>
      </button>
    </div>

    <!-- Resumen de Likes -->
    <div class="post-likes-summary" v-if="likesTotal > 0">
      <div class="likes-icon-wrapper">
        <IconifyIcon icon="mdi:heart" width="12" color="#fff" />
      </div>
      <span class="likes-text">
        A <b>{{ likesTotal }} personas</b> les gusta esto 
        <span class="likes-names" v-if="likesUsuarios.length">
          (incluyendo a {{ likesUsuarios[0].nombre }}<span v-if="likesTotal > 1">...</span>)
        </span>
      </span>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuth } from '../../../composables/useAuth'
import { useLikes } from '../../../composables/useLikes'
import { Icon as IconifyIcon } from '@iconify/vue'

const props = defineProps({
  publicacionId: { type: String, required: true },
  username: { type: String, default: 'Usuario' },
  tipo: { type: String, required: true },
  fecha: { type: String, required: true },
  texto: { type: String, required: true },
  imagenes: { type: Array as () => string[], default: () => [] },
  region: String,
  comuna: String,
  instalacion: String,
  avatarColor: { type: String, default: '#6200EA' } // Default al morado Kimal
})

const { user, accessToken } = useAuth()

const {
  likesTotal,
  likesUsuarios,
  userLiked,
  cargarLikes,
  darLike
} = useLikes(props.publicacionId, accessToken.value, user.value?.id ?? '')

onMounted(cargarLikes)

const toggleLike = async () => {
  await darLike()
}

const compartir = () => {
  const url = `${window.location.origin}/publicacion/${props.publicacionId}`
  navigator.clipboard.writeText(url)
  // Podrías usar un toast aquí en lugar de alert para ser más elegante
  alert('¡Enlace copiado al portapapeles!')
}

const userInitials = computed(() =>
  props.username?.split(' ').slice(0,2).map(n => n[0]).join('').toUpperCase() || 'US'
)

const typeClass = computed(() =>
  props.tipo === 'Reporte' ? 'tag-report' : 'tag-question'
)
</script>

<style scoped>
/* --- CARD PRINCIPAL --- */
.post-box {
  background: #ffffff;
  border-radius: 1.5rem; /* Bordes redondeados modernos */
  /* Sombra suave y elevada */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); 
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #f0f0f0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.post-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(98, 0, 234, 0.08); /* Sombra con tinte morado al hover */
}

/* --- HEADER --- */
.post-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.avatar-wrapper {
  position: relative;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  color: #fff;
  font-weight: 700;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.post-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.info-top {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.username {
  font-weight: 700;
  color: #1f2937; /* gray-800 */
  font-size: 1rem;
}

/* Etiquetas de Tipo */
.post-type {
  font-size: 0.75rem;
  padding: 0.2rem 0.8rem;
  border-radius: 999px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.tag-report {
  background-color: #FCE4EC; /* Rosa muy claro */
  color: #C2185B; /* Rosa oscuro */
}

.tag-question {
  background-color: #E0F7FA; /* Cian muy claro */
  color: #0097A7; /* Cian oscuro */
}

.time {
  color: #9ca3af; /* gray-400 */
  font-size: 0.85rem;
  margin-top: 2px;
}

.icon-btn {
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: background 0.2s;
}

.icon-btn:hover {
  background-color: #f3f4f6;
  color: #6200EA;
}

/* --- CONTENIDO --- */
.post-content {
  cursor: pointer;
}

.post-text {
  font-size: 1rem;
  color: #374151; /* gray-700 */
  line-height: 1.6;
  margin-bottom: 1rem;
}

.username-highlight {
  font-weight: 700;
  color: #6200EA; /* Morado Kimal */
  margin-right: 4px;
}

/* Metadatos (Chips de ubicación) */
.post-meta-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}

.meta-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  color: #6b7280;
  background: #f9fafb;
  padding: 4px 10px;
  border-radius: 8px;
  border: 1px solid #eee;
}

/* Imagen */
.post-image-container {
  width: 100%;
  max-height: 400px;
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: 1rem;
  background-color: #f3f4f6;
  cursor: pointer;
}

.post-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.post-image-container:hover img {
  transform: scale(1.02);
}

/* --- ACCIONES --- */
.post-actions {
  display: flex;
  justify-content: space-between; /* Distribuye uniformemente */
  border-top: 1px solid #f3f4f6;
  border-bottom: 1px solid #f3f4f6;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: transparent;
  border: none;
  padding: 10px;
  border-radius: 10px;
  color: #6b7280; /* gray-500 */
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: #f9fafb;
}

/* Colores específicos al hover/activo */
.like-btn:hover, .like-btn.is-liked {
  color: #FF4081; /* Rosa */
  background-color: #FFF0F5;
}

.comment-btn:hover {
  color: #00E5FF; /* Cian */
  background-color: #E0F7FA;
}

.share-btn:hover {
  color: #6200EA; /* Morado */
  background-color: #F3E5F5;
}

/* --- LIKES SUMMARY --- */
.post-likes-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #6b7280;
}

.likes-icon-wrapper {
  background: linear-gradient(135deg, #FF4081, #F50057);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(255, 64, 129, 0.3);
}

.likes-text b {
  color: #374151;
}

.likes-names {
  color: #9ca3af;
  font-size: 0.85rem;
}
</style>