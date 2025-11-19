<template>
  <div class="noticia-box" @click="$emit('abrirDetalle', noticia._id)">
    <!-- Cabecera -->
    <div class="noticia-header">
      <div class="avatar-wrapper">
        <div class="avatar" :style="{ background: avatarColor }">
          {{ autorIniciales }}
        </div>
      </div>
      <div class="noticia-info">
        <span class="username">{{ autor }}</span>
        <span class="post-type">NOTICIA</span>
        <span class="time">{{ fecha }}</span>
      </div>
    </div>

    <!-- Contenido resumen -->
    <div class="noticia-content">
      <h2 class="noticia-titulo">{{ noticia.titulo }}</h2>
      <p class="noticia-texto">{{ noticia.texto }}</p>
      <div v-if="noticia.imagenes && noticia.imagenes.length" class="noticia-image-container">
        <img :src="noticia.imagenes[0]" alt="Imagen de Noticia" loading="lazy" />
      </div>
      <div class="noticia-meta-tags" v-if="noticia.regionId || noticia.comunaId || noticia.instalacionId">
        <span v-if="noticia.regionId" class="meta-tag">Región</span>
        <span v-if="noticia.comunaId" class="meta-tag">Comuna</span>
        <span v-if="noticia.instalacionId" class="meta-tag">Instalación</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Noticia } from '../services/noticiasService'

const props = defineProps<{
  noticia: Noticia,
  autor?: string,
  avatarColor?: string,
  fecha?: string
}>()

const autorIniciales = computed(() =>
  props.autor?.split(' ').slice(0,2).map(n => n[0]).join('').toUpperCase() || 'US'
)
</script>

<style scoped>
.noticia-box {
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #f0f0f0;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.noticia-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(98, 0, 234, 0.08);
}
.noticia-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}
.avatar-wrapper { position: relative; }
.avatar {
  width: 48px; height: 48px; border-radius: 50%;
  color: #fff; font-weight: 700; font-size: 1.1rem;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.noticia-info {
  flex: 1; display: flex; flex-direction: column; gap: 2px;
}
.username { font-weight: 700; color: #1f2937; font-size: 1rem; }
.post-type { font-size: 0.75rem; font-weight: 600; color: #6200EA; }
.time { color: #9ca3af; font-size: 0.85rem; }
.noticia-content { margin-top: 1rem; }
.noticia-titulo { font-size: 1.3rem; font-weight: 700; margin-bottom: 0.5rem; }
.noticia-texto { font-size: 1rem; color: #374151; margin-bottom: 1rem; }
.noticia-image-container {
  width: 100%; max-height: 400px; border-radius: 1rem;
  overflow: hidden; margin-bottom: 1rem; background: #f3f4f6;
}
.noticia-image-container img {
  width: 100%; height: 100%; object-fit: cover;
}
.noticia-meta-tags {
  display: flex; gap: 0.5rem; margin-top: 0.5rem;
}
.meta-tag {
  font-size: 0.8rem; color: #6b7280; background: #f9fafb;
  padding: 4px 10px; border-radius: 8px; border: 1px solid #eee;
}
</style>