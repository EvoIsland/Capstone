<template>
  <div class="tarjetas-info-container">
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Cargando tarjetas desde Strapi...</p>
    </div>
    
    <div v-else-if="error" class="error-state">
      <p>Error al cargar las tarjetas: {{ error }}</p>
    </div>
    
    <div v-else class="tarjetas-info gap2rem">
      <template v-for="tarjeta in tarjetasData" :key="tarjeta.id">
        <div 
          class="tarjeta info-dinamica" 
          :style="{ background: tarjeta.color }"
          @click="cambiarImagen(tarjeta)"
        >
          <h3 class="text-xl bold mb1rem text-white">{{ tarjeta.titulo }}</h3>
          <p class="text-md text-white">{{ tarjeta.texto }}</p>
        </div>
      </template>

      <div class="tarjeta torre-imagen">
        <img :src="currentImage" :alt="currentImageAlt" class="w100 h100 object-cover">
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const tarjetasData = ref([]);
const currentImage = ref('');
const currentImageAlt = ref('');
const loading = ref(true);
const error = ref(null);

// Configuración de Strapi
const config = useRuntimeConfig()
const strapiUrl = config.public.strapiUrl || 'http://localhost:1337'
const strapiApiUrl = config.public.strapiApiUrl || 'http://localhost:1337/api'

// Función para obtener la URL completa de la imagen
const getImageUrl = (imagen) => {
  if (!imagen?.url) {
    return '/images/placeholder.jpg'
  }
  
  const imageUrl = imagen.url
  
  if (imageUrl.startsWith('http')) {
    return imageUrl
  }
  
  return `${strapiUrl}${imageUrl}`
}

// Lógica para cargar los datos desde Strapi
onMounted(async () => {
  try {
    console.log('🔄 Cargando tarjetas desde Strapi...')
    
    // Cargar datos con imagen poblada
    const response = await $fetch(`${strapiApiUrl}/tarjetas-intros?populate=imagen`)
    
    console.log('✅ Datos cargados:', response)
    
    // Los datos vienen en response.data para collection types
    const tarjetas = response.data || response
    
    // Mapear los datos al formato esperado
    tarjetasData.value = tarjetas.map(tarjeta => ({
      id: tarjeta.id,
      titulo: tarjeta.titulo,
      texto: tarjeta.descripcion,
      imagen: getImageUrl(tarjeta.imagen),
      alt: tarjeta.imagen?.alternativeText || 'Imagen del proyecto',
      color: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' // Color por defecto
    }))
    
    // Establece la imagen inicial
    if (tarjetasData.value.length > 0) {
      currentImage.value = tarjetasData.value[0].imagen;
      currentImageAlt.value = tarjetasData.value[0].alt;
    }
    
  } catch (err) {
    console.error('❌ Error cargando tarjetas:', err)
    error.value = err.message
    
    // Datos de fallback en caso de error
    tarjetasData.value = [
      {
        id: 1,
        titulo: "Comunas de Carga Sobredimensionada",
        texto: "Melillones, Calama, San Antonio, Cartagena, Casablanca, El Tabo y Curacaví.",
        imagen: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        alt: "Torre de alta tensión",
        color: "linear-gradient(135deg, #10B981 0%, #059669 100%)"
      }
    ]
    
    if (tarjetasData.value.length > 0) {
      currentImage.value = tarjetasData.value[0].imagen;
      currentImageAlt.value = tarjetasData.value[0].alt;
    }
  } finally {
    loading.value = false;
  }
});

// Función para cambiar la imagen según la tarjeta seleccionada
const cambiarImagen = (tarjeta) => {
  currentImage.value = tarjeta.imagen;
  currentImageAlt.value = tarjeta.alt;
};
</script>

<style lang="sass" scoped>
@use '@sass/base' as *

.tarjetas-info-container
  width: 100%

.tarjetas-info
  display: flex
  gap: 2rem

.tarjeta
  border-radius: 2rem
  padding: 1rem
  flex: 1

.torre-imagen
  padding: 0
  overflow: hidden
  background: #f3f4f6
  min-height: 200px
  img
    transition: all 0.5s ease-in-out

.info-dinamica
  cursor: pointer
  transition: transform 0.3s ease
  &:hover
    transform: translateY(-5px)

// Estados de carga y error
.loading-state,
.error-state
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  min-height: 200px
  padding: 2rem
  text-align: center

.loading-spinner
  width: 3rem
  height: 3rem
  border: 3px solid rgba(107, 70, 193, 0.3)
  border-top: 3px solid #6B46C1
  border-radius: 50%
  animation: spin 1s linear infinite
  margin-bottom: 1rem

@keyframes spin
  0%
    transform: rotate(0deg)
  100%
    transform: rotate(360deg)

.error-state
  background: rgba(239, 68, 68, 0.1)
  border-radius: 1rem
  color: #DC2626

// Responsive
@media screen and (max-width: 900px)
  .tarjetas-info
    flex-direction: column
</style>