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
      <div class="post-options">...</div>
    </div>
    <div class="post-content">
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
      <span>🤍 Me gusta</span>
      <span>💬 Comentar</span>
      <span>🔗 Compartir</span>
    </div>
    <!-- <div class="post-likes">
      <b>A {{ likes }} personas les gusta esto</b>
    </div>
    <div class="post-comments">
      Ver los {{ comentarios }} comentarios
    </div>
    <div class="post-add-comment">
      <div class="avatar small">YO</div>
      <input type="text" placeholder="Añade un comentario..." />
      <button>Publicar</button>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  username: { type: String, default: 'Usuario' },
  tipo: { type: String, required: true },
  fecha: { type: String, required: true },
  texto: { type: String, required: true },
  imagenes: { type: Array as () => string[], default: () => [] },
  region: String,
  comuna: String,
  instalacion: String,
  likes: { type: Number, default: 0 },
  comentarios: { type: Number, default: 0 },
  avatarColor: { type: String, default: '#FFD600' }
})

const userInitials = computed(() => props.username?.split('_').map(n => n[0]).join('').toUpperCase() || 'US')
const typeClass = computed(() => props.tipo === 'Reporte' ? 'report' : 'question')
</script>

<style scoped>
.post-box {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 4px #0001;
  margin-bottom: 24px;
  padding: 16px;
  font-family: 'Segoe UI', sans-serif;
}
.post-header {
  display: flex;
  align-items: center;
  gap: 12px;
}
.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #FFD600;
  color: #444;
  font-weight: bold;
  font-size: 1.2em;
  display: flex;
  align-items: center;
  justify-content: center;
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
  font-weight: bold;
}
.username-bold {
  font-weight: bold;
  margin-right: 4px;
}
.post-type {
  font-size: 0.85em;
  padding: 2px 8px;
  border-radius: 8px;
  margin-left: 8px;
  background: #e0e0e0;
  color: #444;
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
  font-size: 0.9em;
}
.post-options {
  color: #888;
  cursor: pointer;
}
.post-content {
  margin: 12px 0;
}
.post-image {
  background: #90A4AE;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 220px;
  border-radius: 8px;
  margin-bottom: 12px;
}
.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}
.post-actions {
  display: flex;
  gap: 24px;
  color: #666;
  font-size: 1em;
  margin-bottom: 8px;
}
.post-likes {
  font-size: 1em;
  margin-bottom: 4px;
}
.post-comments {
  color: #1976D2;
  font-size: 0.95em;
  margin-bottom: 8px;
  cursor: pointer;
}
.post-add-comment {
  display: flex;
  align-items: center;
  gap: 8px;
  border-top: 1px solid #eee;
  padding-top: 8px;
}
.post-add-comment input {
  flex: 1;
  border: none;
  background: #f5f6fa;
  border-radius: 16px;
  padding: 8px 12px;
  margin-right: 8px;
}
.post-add-comment button {
  background: none;
  border: none;
  color: #1976D2;
  font-weight: bold;
  cursor: pointer;
}
</style>