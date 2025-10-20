<template>
  <div class="post-box">
    <div class="post-header">
      <div class="avatar" :style="{ background: avatarColor }">{{ userInitials }}</div>
      <div class="post-info">
        <div>
          <span class="username">{{ username }}</span>
          <span class="post-type" :class="typeClass">{{ tipo }}</span>
        </div>
        <span class="time">{{ fecha }}</span>
      </div>
      <div class="post-options">
        <IconifyIcon icon="mdi:dots-horizontal" width="24" height="24" />
      </div>
    </div>
    <div class="post-content" @click="$emit('abrirDetalle', publicacionId)">
      <span class="username-bold">{{ username }}</span>
      <span>{{ texto }}</span>
      <span v-if="region"> | Región: {{ region }}</span>
      <span v-if="comuna"> | Comuna: {{ comuna }}</span>
      <span v-if="instalacion"> | Instalación: {{ instalacion }}</span>
    </div>
    <div v-if="imagenes && imagenes.length" class="post-image">
      <img :src="imagenes[0]" alt="Imagen de Publicación" />
    </div>
    <div class="post-actions">
      <button @click="toggleLike">
        <IconifyIcon :icon="userLiked ? 'mdi:heart' : 'mdi:heart-outline'" width="20" height="20" style="vertical-align: middle; margin-right: 6px;" />
        <span v-if="userLiked">Quitar Me gusta</span>
        <span v-else>Me gusta</span>
      </button>
      <button @click="$emit('abrirDetalle', publicacionId)">
        <IconifyIcon icon="mdi:comment-outline" width="20" height="20" style="vertical-align: middle; margin-right: 6px;" />
        Comentar
      </button>
      <button @click="compartir">
        <IconifyIcon icon="mdi:share-variant" width="20" height="20" style="vertical-align: middle; margin-right: 6px;" />
        Compartir
      </button>
    </div>

    <div class="post-likes" v-if="likesTotal > 0">
      <b>{{ likesTotal }} personas les gusta esto</b>
      <div>
        <span v-for="usuario in likesUsuarios" :key="usuario._id" style="margin-right: 8px;">
          {{ usuario.nombre }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref, computed, onMounted } from 'vue'
import { useAuth } from '../../composables/useAuth'
import { Icon as IconifyIcon } from '@iconify/vue'

interface LikesResponse {
  total: number;
  usuarios: { _id: string; nombre: string }[];
}

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
  avatarColor: { type: String, default: '#FFD600' }
})

const { user, accessToken } = useAuth();


const likesTotal = ref(0);
const likesUsuarios = ref<{ _id: string; nombre: string }[]>([]);
const userLiked = ref(false);

const comentarios = ref<any[]>([]);
const nuevoComentario = ref('');
const respuestaA = ref<string | null>(null);
const cargandoComentarios = ref(false);


const fetchLikes = async () => {
  const res = await $fetch<LikesResponse>(`http://localhost:5000/publicacion/${props.publicacionId}/likes`);
  likesTotal.value = res.total;
  likesUsuarios.value = res.usuarios;
  userLiked.value = res.usuarios.some((u: any) => u._id === (user.value && (user.value._id || user.value.id)));
};


const toggleLike = async () => {
  await $fetch(`http://localhost:5000/publicacion/${props.publicacionId}/like`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken.value}` }
  });
  fetchLikes();
};


const compartir = () => {
  const url = `${window.location.origin}/publicacion/${props.publicacionId}`;
  navigator.clipboard.writeText(url);
  alert('¡Enlace copiado al portapapeles!');
};

onMounted(fetchLikes);

const userInitials = computed(() => props.username?.split('_').map(n => n[0]).join('').toUpperCase() || 'US')
const typeClass = computed(() => props.tipo === 'Reporte' ? 'report' : 'question')
</script>

<style scoped>
/* Card principal */
.post-box {
  background: #f7f7f7;
  border-radius: 2.5rem;
  box-shadow: 0 4px 32px 0 #0000001a;
  margin-bottom: 2rem;
  padding: 2rem 2.5rem;
  font-family: 'Segoe UI', sans-serif;
  transition: box-shadow 0.2s;
}
.post-box:hover {
  box-shadow: 0 8px 32px 0 #00000033;
}
.post-header {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1.2rem;
}
.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #FFD600;
  color: #444;
  font-weight: bold;
  font-size: 1.3em;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px #ffd60033;
}
.avatar.small {
  width: 32px;
  height: 32px;
  font-size: 1em;
}
.post-info {
  flex: 1;
}
.username {
  font-weight: 600;
  color: #333;
}
.username-bold {
  font-weight: 600;
  margin-right: 4px;
  color: #ff3388;
}
.post-type {
  font-size: 0.95em;
  padding: 0.3rem 1.2rem;
  border-radius: 1.2rem;
  margin-left: 0.7rem;
  background: #e9e2f5;
  color: #333;
  font-weight: 500;
}
.post-type.report {
  background: #FFD600;
  color: #444;
}
.post-type.question {
  background: #2196F3;
  color: #fff;
}
.time {
  color: #888;
  font-size: 0.95em;
}
.post-options {
  color: #888;
  cursor: pointer;
}
.post-content {
  margin: 1.2rem 0;
  font-size: 1.05rem;
  color: #333;
}
.post-image {
  background: #e9e2f5;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 220px;
  border-radius: 1.5rem;
  margin-bottom: 1.2rem;
}
.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1.5rem;
}
.post-actions {
  display: flex;
  gap: 1.2rem;
  color: #666;
  font-size: 1.05rem;
  margin-bottom: 1rem;
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
.post-likes {
  font-size: 1.05em;
  margin-bottom: 0.7rem;
  color: #555;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.post-likes b {
  color: #ff3388;
  font-weight: 600;
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