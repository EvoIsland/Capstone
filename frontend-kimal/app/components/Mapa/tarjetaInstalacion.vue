<template>
  <div class="tarjeta-wrapper" v-if="instalacion">
    
    <!-- HEADER -->
    <div class="detail-header">
      <div class="header-content">
        <h2 class="location-title">{{ instalacion.nombre }}</h2>
        <div class="status-badge" v-if="instalacion.estado">
          <span class="status-dot" :class="instalacion.estado.toLowerCase()"></span>
          {{ instalacion.estado }}
        </div>
      </div>
      <button class="close-btn" @click="$emit('cerrar')">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- TABS -->
    <div class="tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab" 
        :class="['tab-btn', { active: activeTab === tab }]" 
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <!-- BODY (Scrollable) -->
    <div class="detail-body">
      
      <!-- TAB: PREGUNTAS -->
      <div v-if="activeTab === 'Preguntas'" class="tab-content">
        <div v-if="preguntas.length === 0" class="empty-state">
          <p>No hay preguntas recientes.</p>
          <span class="sub-text">Sé el primero en preguntar.</span>
        </div>
        
        <div v-for="pregunta in preguntas" :key="pregunta._id" class="chat-item">
          <div class="chat-meta">
            <div class="chat-user">
              <span class="user-icon">{{ getInitial(pregunta.publicadorId?.nombre) }}</span>
              {{ pregunta.publicadorId?.nombre || 'Anónimo' }}
            </div>
            <span class="chat-date">{{ formatFecha(pregunta.fecha) }}</span>
          </div>
          <p class="chat-text">{{ pregunta.texto }}</p>
          <!-- Imágenes si existen -->
          <div v-if="pregunta.imagenes?.length" class="chat-images">
            <img v-for="img in pregunta.imagenes" :src="img" :key="img" class="chat-img" />
          </div>
          <button class="chat-action">Responder</button>
        </div>
      </div>

      <!-- TAB: REPORTE -->
      <div v-else-if="activeTab === 'Reporte'" class="tab-content">
        <div v-if="reportes.length === 0" class="empty-state">
          <p>Todo opera con normalidad.</p>
          <button class="action-btn-small">Crear Reporte</button>
        </div>

        <div v-for="reporte in reportes" :key="reporte._id" class="chat-item report-item">
          <div class="chat-meta">
            <div class="chat-user">
              <span class="user-icon warning">!</span>
              {{ reporte.publicadorId?.nombre || 'Usuario' }}
            </div>
            <span class="chat-date">{{ formatFecha(reporte.fecha) }}</span>
          </div>
          <p class="chat-text">{{ reporte.texto }}</p>
           <div v-if="reporte.imagenes?.length" class="chat-images">
            <img v-for="img in reporte.imagenes" :src="img" :key="img" class="chat-img" />
          </div>
        </div>
      </div>

      <!-- TAB: INFORMACIÓN (Noticias) -->
      <div v-else-if="activeTab === 'Información'" class="tab-content">
        <!-- Metadatos Fijos (Ejemplo) -->
        <div class="info-grid">
          <div class="info-box">
             <span class="label">LATITUD</span>
             <span class="value">{{ instalacion.location?.coordinates[1]?.toFixed(4) }}</span>
          </div>
          <div class="info-box">
             <span class="label">LONGITUD</span>
             <span class="value">{{ instalacion.location?.coordinates[0]?.toFixed(4) }}</span>
          </div>
        </div>

        <div class="divider"><span>Noticias</span></div>

        <div v-if="noticias.length === 0" class="empty-state">
          <p>No hay noticias disponibles.</p>
        </div>

        <div v-for="noticia in noticias" :key="noticia._id" class="news-card">
           <div class="news-header">
             <span class="news-badge">Noticia</span>
             <span class="news-date">{{ formatFecha(noticia.fecha) }}</span>
           </div>
           <p class="news-text">{{ noticia.texto }}</p>
           <div v-if="noticia.imagenes?.length" class="chat-images">
            <img v-for="img in noticia.imagenes" :src="img" :key="img" class="chat-img" />
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import axios from 'axios'

interface Instalacion {
  _id: string
  nombre: string
  estado?: string
  location: { type: string, coordinates: number[] }
  regionId: string
  comunaId: string
}

interface Publicacion {
  _id: string
  texto: string
  tipo: 'pregunta' | 'reporte' | 'noticia'
  fecha: string
  imagenes?: string[]
  publicadorId?: { nombre: string }
  instalacionId?: string | { $oid?: string, _id?: string, nombre?: string }
}

const props = defineProps<{ instalacion: Instalacion | null }>()

const publicaciones = ref<Publicacion[]>([])
const noticias = ref<Publicacion[]>([])

const tabs = ['Preguntas', 'Reporte', 'Información']
const activeTab = ref('Preguntas')

// Helpers
const getInitial = (name?: string) => name ? name.charAt(0).toUpperCase() : 'U'

function matchInstalacionId(pub: Publicacion, id?: string) {
  if (!pub.instalacionId || !id) return false
  if (typeof pub.instalacionId === 'string') return pub.instalacionId === id
  if (typeof pub.instalacionId === 'object') {
    if (typeof (pub.instalacionId as any).$oid === 'string') return (pub.instalacionId as any).$oid === id
    if (typeof (pub.instalacionId as any)._id === 'string') return (pub.instalacionId as any)._id === id
  }
  return false
}

// Computed Filters
const preguntas = computed(() => {
  const id = props.instalacion?._id
  return publicaciones.value.filter(p => p.tipo === 'pregunta' && matchInstalacionId(p, id))
})
const reportes = computed(() => {
  const id = props.instalacion?._id
  return publicaciones.value.filter(p => p.tipo === 'reporte' && matchInstalacionId(p, id))
})

// Data Fetching
watch(() => props.instalacion, async (inst) => {
  if (inst && inst._id) {
    try {
      // Preguntas y reportes
      const { data } = await axios.get(`http://localhost:5000/publicaciones?instalacionId=${inst._id}`)
      publicaciones.value = Array.isArray(data) ? data : []
      // Noticias
      const noticiasRes = await axios.get(`http://localhost:5000/noticias?instalacionId=${inst._id}`)
      noticias.value = Array.isArray(noticiasRes.data) ? noticiasRes.data : []
    } catch (error) {
      publicaciones.value = []
      noticias.value = []
    }
  } else {
    publicaciones.value = []
    noticias.value = []
  }
}, { immediate: true })

function formatFecha(fecha: string) {
  if (!fecha) return ''
  const d = new Date(fecha)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  
  // Formato "Hace X tiempo" simple
  if (diff < 3600000) return 'Hace ' + Math.floor(diff/60000) + ' min'
  if (diff < 86400000) return 'Hace ' + Math.floor(diff/3600000) + ' h'
  
  return d.toLocaleDateString()
}
</script>

<style lang="scss" scoped>
// Variables alineadas con el diseño general
$primary: #7c3aed;
$primary-soft: #f3e8ff;
$success: #10b981;
$success-soft: #d1fae5;
$text-main: #1f2937;
$text-light: #6b7280;
$border: #f3f4f6;
$bg-glass: rgba(255, 255, 255, 0.6);

.tarjeta-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
  // No background here, parent handles glass effect
}

/* --- HEADER --- */
.detail-header {
  padding: 16px 20px;
  background: white; // Header sólido para legibilidad
  border-bottom: 1px solid $border;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-shrink: 0;
}

.location-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: $text-main;
  line-height: 1.2;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: $success-soft;
  color: darken($success, 10%);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  margin-top: 6px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: $success;
  
  &.mantenimiento { background-color: #f59e0b; }
  &.inactivo { background-color: #ef4444; }
}

.close-btn {
  background: #f3f4f6;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  color: $text-light;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    background: #e5e7eb;
    color: $text-main;
  }
}

/* --- TABS --- */
.tabs {
  display: flex;
  background: rgba(255,255,255,0.8);
  padding: 0 20px;
  border-bottom: 1px solid $border;
  flex-shrink: 0;
}

.tab-btn {
  flex: 1;
  padding: 12px;
  background: none;
  border: none;
  font-weight: 600;
  font-size: 13px;
  color: $text-light;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(.active) {
    color: $text-main;
  }
  
  &.active {
    color: $primary;
    border-bottom-color: $primary;
  }
}

/* --- BODY --- */
.detail-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: $bg-glass;
  
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
}

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* --- CHAT ITEMS (Preguntas) --- */
.chat-item {
  background: white;
  padding: 14px;
  border-radius: 16px;
  border-top-left-radius: 4px; // Estilo burbuja
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  border: 1px solid transparent;
  transition: border 0.2s;
  
  &:hover {
    border-color: $primary-soft;
  }
}

.report-item {
    border-left: 3px solid #f59e0b; // Naranja para reportes
}

.chat-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.chat-user {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 13px;
  color: $text-main;
}

.user-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, $primary, #ec4899);
  color: white;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  
  &.warning { background: #f59e0b; }
}

.chat-date {
  font-size: 11px;
  color: $text-light;
}

.chat-text {
  font-size: 13px;
  color: #4b5563;
  line-height: 1.5;
  margin: 0;
}

.chat-action {
  background: none;
  border: none;
  display: block;
  margin-top: 10px;
  font-size: 11px;
  font-weight: 700;
  color: $primary;
  cursor: pointer;
  padding: 0;
  
  &:hover { text-decoration: underline; }
}

.chat-images {
    display: flex;
    gap: 8px;
    margin-top: 8px;
    overflow-x: auto;
}

.chat-img {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    object-fit: cover;
    border: 1px solid $border;
}

/* --- INFO TAB --- */
.info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 20px;
}

.info-box {
    background: white;
    padding: 12px;
    border-radius: 12px;
    text-align: center;
    border: 1px solid $border;
}

.info-box .label {
    display: block;
    font-size: 10px;
    font-weight: 700;
    color: $text-light;
    margin-bottom: 4px;
}
.info-box .value {
    font-size: 14px;
    font-weight: 600;
    color: $text-main;
}

.divider {
    display: flex;
    align-items: center;
    color: $text-light;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    margin: 10px 0;
    
    &::before, &::after {
        content: '';
        flex: 1;
        height: 1px;
        background: #e5e7eb;
    }
    span { padding: 0 10px; }
}

.news-card {
    background: white;
    padding: 14px;
    border-radius: 12px;
    border: 1px solid $border;
}
.news-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
}
.news-badge {
    background: $primary-soft;
    color: $primary;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 700;
}
.news-date { font-size: 10px; color: $text-light; }
.news-text { font-size: 13px; line-height: 1.4; }

/* --- EMPTY STATE --- */
.empty-state {
  text-align: center;
  padding: 30px 10px;
  color: $text-light;
  
  p { font-size: 14px; margin: 0 0 4px 0; }
  .sub-text { font-size: 12px; opacity: 0.7; }
  
  .action-btn-small {
      margin-top: 10px;
      background: $primary;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
  }
}

/* --- FOOTER --- */
.detail-footer {
  padding: 16px 20px;
  background: white;
  border-top: 1px solid $border;
  flex-shrink: 0;
}

.input-container {
  position: relative;
}

.chat-input {
  width: 100%;
  padding: 12px 44px 12px 16px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  font-size: 13px;
  outline: none;
  font-family: inherit;
  transition: all 0.2s;
  box-sizing: border-box;
  
  &:focus {
    border-color: $primary;
    background: white;
    box-shadow: 0 0 0 3px $primary-soft;
  }
}

.send-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: $primary;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  display: flex;
  transition: background 0.2s;
  
  &:hover {
    background: $primary-soft;
  }
}
</style>