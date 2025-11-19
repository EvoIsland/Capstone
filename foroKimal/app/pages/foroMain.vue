<template>
  <div class="forum-layout">
    
    <!-- Estado Inicializando Auth -->
    <div v-if="!isInitialized" class="status-message">
      <div class="loader"></div>
      <p>Verificando sesión...</p>
    </div>

    <template v-else>
      <div class="decoration-fixed top-right">
        <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(300, 0)">
            <circle cx="0" cy="0" r="260" fill="none" stroke="#6200EA" stroke-width="40" opacity="0.15" />
            <circle cx="0" cy="0" r="190" fill="none" stroke="#00E5FF" stroke-width="40" opacity="0.2" />
            <circle cx="0" cy="0" r="120" fill="none" stroke="#FF4081" stroke-width="40" opacity="0.15" />
          </g>
        </svg>
      </div>

      <!-- 2. Esquina Inferior Izquierda (Arcos Espejo) -->
      <div class="decoration-fixed bottom-left">
        <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(0, 300)">
            <circle cx="0" cy="0" r="260" fill="none" stroke="#6200EA" stroke-width="40" opacity="0.15" />
            <circle cx="0" cy="0" r="190" fill="none" stroke="#00E5FF" stroke-width="40" opacity="0.2" />
            <circle cx="0" cy="0" r="120" fill="none" stroke="#FF4081" stroke-width="40" opacity="0.15" />
          </g>
        </svg>
      </div>

      <!-- 3. Esquina Inferior Derecha (Cápsulas) -->
      <div class="decoration-fixed bottom-right">
        <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
          <g transform="rotate(-45, 400, 400) translate(50, 100)">
            <rect x="0" y="0" width="600" height="60" rx="30" fill="none" stroke="#FF4081" stroke-width="4" opacity="0.15" />
            <rect x="0" y="90" width="600" height="60" rx="30" fill="none" stroke="#00E5FF" stroke-width="4" opacity="0.2" />
            <rect x="0" y="180" width="600" height="60" rx="30" fill="none" stroke="#6200EA" stroke-width="4" opacity="0.15" />
          </g>
        </svg>
      </div>

      <!-- ========================================= -->
      <!--         CONTENIDO PRINCIPAL (SCROLL)      -->
      <!-- ========================================= -->
      <div class="content-container">
      
      <!-- Estado Cargando -->
      <div v-if="cargandoPublicaciones" class="status-message">
        <div class="loader"></div>
        <p>Cargando publicaciones...</p>
      </div>

      <!-- Estado Error -->
      <div v-else-if="errorPublicaciones" class="status-message error">
        <p>{{ errorPublicaciones }}</p>
      </div>

      <!-- Lista de Publicaciones -->
      <div v-else class="feed-list">
        
        <!-- Estado Vacío -->
        <div v-if="publicaciones.length === 0" class="status-message empty">
          <p>No hay publicaciones aún.</p>
        </div>

        <!-- Loop de Posts -->
        <div class="posts-wrapper">
          <PostBoxFeed
            v-for="publicacion in publicaciones"
            :key="publicacion._id"
            :publicacionId="publicacion._id"
            @abrirDetalle="abrirDetalle(publicacion._id)"
            :username="publicacion.publicadorId?.nombre || 'Usuario'"
            :tipo="publicacion.tipo"
            :fecha="new Date(publicacion.fecha).toLocaleString()"
            :texto="publicacion.texto"
            :imagenes="publicacion.imagenes"
            :region="publicacion.regionId?.nombre"
            :comuna="publicacion.comunaId?.nombre"
            :instalacion="publicacion.instalacionId?.nombre"
          />
        </div>

        <!-- Modal -->
        <DetailPostModal
          v-if="showPostDetail"
          :publicacionId="selectedPublicacionId!"
          @close="showPostDetail = false"
        />
      </div>
      </div>
    </template>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { usePublicaciones } from '../../composables/usePublicaciones'
import { useAuth } from '../../composables/useAuth'
import PostBoxFeed from '~/components/PostBoxFeed.vue'
import DetailPostModal from '~/components/DetailPostModal.vue'

const {
  publicaciones,
  cargandoPublicaciones,
  errorPublicaciones,
  cargarPublicaciones
} = usePublicaciones()

const { isInitialized } = useAuth()

onMounted(cargarPublicaciones)

const showPostDetail = ref(false)
const selectedPublicacionId = ref<string | null>(null)

function abrirDetalle(id: string) {
  selectedPublicacionId.value = id
  showPostDetail.value = true
}
</script>

<style scoped>
/* Reset */
* {
  box-sizing: border-box;
}

.forum-layout {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background-color: #ffffff;
  /* Asegura que el fondo no se mueva horizontalmente */
  overflow-x: hidden; 
}

/* --- DECORACIONES DE FONDO (FIXED) --- */
/* Usamos 'fixed' para que se queden quietas mientras scrolleas el feed */
.decoration-fixed {
  position: fixed;
  z-index: 0;
  pointer-events: none;
}

.decoration-fixed svg {
  display: block;
  width: 100%;
  height: 100%;
}

.top-right {
  top: 0;
  right: 0;
  width: 400px;
  height: 400px;
}

.bottom-left {
  bottom: 0;
  left: 0;
  width: 350px;
  height: 350px;
}

.bottom-right {
  bottom: 0;
  right: 0;
  width: 500px;
  height: 500px;
  transform: translate(20%, 20%);
}

/* --- CONTENEDOR DEL FEED --- */
.content-container {
  position: relative;
  z-index: 10; /* Encima del fondo */
  width: 100%;
  max-width: 800px; /* Ancho típico de un feed (tipo Facebook/Twitter) */
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: 100vh;
}

.posts-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* Espacio entre posts */
}

/* --- MENSAJES DE ESTADO (Cargando/Error) --- */
.status-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 4rem;
  color: #666;
  font-family: 'Roboto', sans-serif;
  text-align: center;
}

.status-message.error {
  color: #D32F2F;
}

.status-message.empty {
  color: #9E9E9E;
  font-style: italic;
}

/* Loader simple con los colores de la marca */
.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #6200EA; /* Morado */
  border-right: 4px solid #00E5FF; /* Cian */
  border-bottom: 4px solid #FF4081; /* Rosa */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsividad */
@media (max-width: 768px) {
  .decoration-fixed {
    opacity: 0.5; /* Más sutil en móviles */
    transform: scale(0.7); /* Más pequeño */
  }
  
  /* Reajustar posiciones para que no molesten en pantallas chicas */
  .top-right { transform: translate(30%, -30%) scale(0.7); }
  .bottom-left { transform: translate(-30%, 30%) scale(0.7); }
  .bottom-right { transform: translate(40%, 40%) scale(0.7); }

  .content-container {
    padding: 1rem 0.5rem;
  }
}
</style>