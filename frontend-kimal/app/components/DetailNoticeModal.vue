<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <!-- Header del Modal -->
      <div class="modal-header">
        <button class="close-btn" @click="$emit('close')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Contenido de la Noticia -->
      <div v-if="cargando" class="loading-state">
        <div class="loader"></div>
        <p>Cargando noticia...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
      </div>

      <div v-else-if="noticia" class="noticia-detail">
        <!-- Canvas para renderizar el contentJson -->
        <div 
          class="noticia-canvas"
          :class="['device-' + deviceMode]"
        >
          <!-- Renderizado de elementos del editor -->
          <div
            v-for="element in noticia.contentJson"
            :key="element.id"
            class="noticia-element"
            :style="getElementStyle(element)"
          >
            <!-- Texto -->
            <div v-if="element.type === 'text'" class="element-text" :style="element.style">
              {{ element.content }}
            </div>
            
            <!-- Imagen -->
            <img 
              v-if="element.type === 'image'" 
              :src="element.src" 
              class="element-image" 
              :style="element.style"
            />
            
            <!-- Divisor/Box -->
            <div v-if="element.type === 'box'" class="element-box" :style="element.style"></div>
          </div>
        </div>

        <!-- Metadatos al final -->
        <div class="noticia-metadata">
          <span class="meta-date">{{ new Date(noticia.fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
          <div class="meta-tags" v-if="noticia.regionId || noticia.comunaId || noticia.instalacionId">
            <span v-if="noticia.regionId" class="meta-tag">📍 Región</span>
            <span v-if="noticia.comunaId" class="meta-tag">🏘️ Comuna</span>
            <span v-if="noticia.instalacionId" class="meta-tag">🏢 Instalación</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Noticia {
  _id: string
  titulo: string
  texto: string
  fecha: string
  contentJson?: any[]
  regionId?: string
  comunaId?: string
  instalacionId?: string
}

const props = defineProps<{
  noticiaId: string
}>()

const noticia = ref<Noticia | null>(null)
const cargando = ref(true)
const error = ref('')
const deviceMode = ref<'desktop' | 'mobile'>('desktop')

// Detectar tamaño de pantalla
onMounted(async () => {
  // Detectar si es móvil
  if (window.innerWidth < 768) {
    deviceMode.value = 'mobile'
  }
  
  await cargarNoticia()
})

async function cargarNoticia() {
  cargando.value = true
  error.value = ''
  try {
    const res = await fetch(`http://localhost:5000/noticia/${props.noticiaId}`)
    if (!res.ok) throw new Error('Error al cargar la noticia')
    noticia.value = await res.json()
  } catch (err) {
    error.value = 'No se pudo cargar la noticia'
    console.error(err)
  } finally {
    cargando.value = false
  }
}

// Función para obtener estilos de cada elemento según el dispositivo
function getElementStyle(element: any) {
  const layout = element.layout?.[deviceMode.value] || element.layout?.desktop || {}
  
  return {
    position: 'absolute',
    left: `${layout.x}px`,
    top: `${layout.y}px`,
    width: typeof layout.width === 'number' ? `${layout.width}px` : layout.width,
    height: typeof layout.height === 'number' ? `${layout.height}px` : layout.height,
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow-y: auto;
}

.modal-content {
  background: white;
  border-radius: 1.5rem;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  position: sticky;
  top: 0;
  background: white;
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  z-index: 10;
}

.close-btn {
  background: #f3f4f6;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #e5e7eb;
  transform: rotate(90deg);
}

.loading-state,
.error-state {
  padding: 4rem 2rem;
  text-align: center;
  color: #6b7280;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #7c3aed;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  color: #dc2626;
}

.noticia-detail {
  padding: 2rem;
}

/* Canvas para renderizar el diseño */
.noticia-canvas {
  position: relative;
  margin: 0 auto;
  background: white;
  min-height: 400px;
}

.noticia-canvas.device-desktop {
  width: 800px;
  max-width: 100%;
}

.noticia-canvas.device-mobile {
  width: 375px;
  max-width: 100%;
}

.noticia-element {
  position: absolute;
}

.element-text {
  width: 100%;
  height: 100%;
  white-space: pre-wrap;
  word-break: break-word;
}

.element-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.element-box {
  width: 100%;
  height: 100%;
}

/* Metadatos */
.noticia-metadata {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.meta-date {
  color: #6b7280;
  font-size: 0.95rem;
  font-style: italic;
}

.meta-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.meta-tag {
  font-size: 0.85rem;
  color: #6b7280;
  background: #f9fafb;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

/* Responsive */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 0;
  }
  
  .modal-content {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }
  
  .noticia-detail {
    padding: 1rem;
  }
  
  .noticia-canvas {
    width: 100% !important;
  }
}
</style>
