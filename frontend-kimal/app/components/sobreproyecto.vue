<template>
  <section class="sobre-proyecto p4rem">
    <div class="anchoMaximo flex flex-responsive jcc gap4rem">
      <!-- Estado de carga -->
      <div v-if="pending" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Cargando información del proyecto...</p>
      </div>
      
      <!-- Error -->
      <div v-else-if="error" class="error-container">
        <p>Error al cargar la información: {{ error }}</p>
      </div>
      
      <!-- Contenido normal -->
      <template v-else-if="sobreProyecto">
        <!-- Contenido principal izquierdo -->
        <div class="contenido-izquierdo">
          <h2 class="titulo mb3rem">{{ sobreProyecto.titulo }}</h2>
          
          <!-- Comillas decorativas -->
          <div class="comillas mb3rem">
            <span class="comilla-izq">"</span>
            <span class="comilla-der">"</span>
          </div>
          
          <!-- Descripción del proyecto -->
          <p class="descripcion mb4rem">
            {{ sobreProyecto.descripcion }}
          </p>
          
          <!-- Botón Leer más -->
          <button class="btn-leer-mas">
            Leer más
          </button>
        </div>
        
        <!-- Contenido derecho - Imagen -->
        <div class="contenido-derecho">
          <div class="imagen-container">
            <img 
              :src="getImageUrl(sobreProyecto.imagen)" 
              :alt="sobreProyecto.imagen?.alternativeText || 'Torre eléctrica'" 
              class="torre-imagen"
            >
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup>
// Importar explícitamente si es necesario
// import { useStrapi } from '~/composables/useStrapi'

// Configuración directa para evitar problemas de import
const config = useRuntimeConfig()
const strapiUrl = config.public.strapiUrl || 'http://localhost:1337'
const strapiApiUrl = config.public.strapiApiUrl || 'http://localhost:1337/api'

// Estados reactivos
const sobreProyecto = ref(null)
const pending = ref(true)
const error = ref(null)

// Función para obtener la URL completa de la imagen
const getImageUrl = (imagen) => {
  if (!imagen?.url) {
    return '/images/placeholder.jpg' // Imagen por defecto
  }
  
  const imageUrl = imagen.url
  
  // Si la URL ya es completa, la retornamos
  if (imageUrl.startsWith('http')) {
    return imageUrl
  }
  
  // Si es una URL relativa, la concatenamos con la URL de Strapi
  return `${strapiUrl}${imageUrl}`
}

// Función para cargar los datos usando $fetch directamente
const loadSobreProyecto = async () => {
  try {
    pending.value = true
    error.value = null
    
    console.log('🔄 Cargando datos de sobre-proyecto desde Strapi...')
    
    // Usar $fetch directamente - SINGLE TYPE no lleva ID
    const response = await $fetch(`${strapiApiUrl}/sobre-proyecto?populate=imagen`)
    
    console.log('✅ Datos cargados:', response)
    console.log('✅ Tipo de response:', typeof response)
    console.log('✅ Keys de response:', Object.keys(response))
    
    // Los datos vienen dentro de response.data
    sobreProyecto.value = response.data
    
    console.log('✅ sobreProyecto.value:', sobreProyecto.value)
    console.log('✅ titulo:', response.data.titulo)
    console.log('✅ descripcion:', response.data.descripcion)
    
  } catch (err) {
    console.error('❌ Error cargando sobre-proyecto:', err)
    error.value = err.message
    
    // Datos de fallback en caso de error
    sobreProyecto.value = {
      titulo: 'Sobre el proyecto',
      descripcion: 'Consiste en el desarrollo, construcción y operación de la primera línea de transmisión de corriente continua entre la Subestación Limal en la comuna de María Elena, Región de Antofagasta y la Subestación Lo Aguirre en la comuna de Pudahuel, Región Metropolitana.',
      imagen: null
    }
  } finally {
    pending.value = false
  }
}

// Cargar datos al montar el componente
onMounted(() => {
  loadSobreProyecto()
})
</script>

<style lang="sass" scoped>
@use '@sass/base' as *

.sobre-proyecto
  background: linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A855F7 100%)
  display: flex
  justify-content: center
  align-items: center
  min-height: calc(100vh - 15rem)
  width: 100%
  position: relative
  z-index: 0
  color: white

.contenido-izquierdo
  flex: 1
  display: flex
  flex-direction: column
  justify-content: center
  max-width: 50rem

.contenido-derecho
  flex: 1
  display: flex
  justify-content: center
  align-items: center

.titulo
  font-size: 3.6rem
  font-weight: 600
  color: white
  margin: 0

.comillas
  display: flex
  gap: 1rem
  align-items: center

.comilla-izq,
.comilla-der
  background: white
  color: #7C3AED
  font-size: 4rem
  font-weight: 900
  width: 6rem
  height: 6rem
  border-radius: 1rem
  display: flex
  align-items: center
  justify-content: center
  line-height: 1

.comilla-izq
  font-family: Georgia, serif

.comilla-der
  font-family: Georgia, serif

.descripcion
  font-size: 1.6rem
  line-height: 1.6
  color: white
  font-weight: 300
  max-width: 45rem

.btn-leer-mas
  background: linear-gradient(135deg, #EC4899 0%, #BE185D 100%)
  color: white
  padding: 1.5rem 4rem
  border-radius: 5rem
  border: none
  font-weight: 600
  font-size: 1.6rem
  cursor: pointer
  transition: all 0.3s ease
  align-self: flex-start
  min-width: 20rem

  &:hover
    transform: translateY(-2px)
    box-shadow: 0 8px 20px rgba(236, 72, 153, 0.4)

.imagen-container
  width: 100%
  max-width: 45rem
  border-radius: 2rem
  overflow: hidden
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3)

.torre-imagen
  width: 100%
  height: 35rem
  object-fit: cover
  display: block

// Estados de carga y error
.loading-container,
.error-container
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  min-height: 20rem
  width: 100%
  color: white

.loading-spinner
  width: 4rem
  height: 4rem
  border: 3px solid rgba(255, 255, 255, 0.3)
  border-top: 3px solid white
  border-radius: 50%
  animation: spin 1s linear infinite
  margin-bottom: 1rem

@keyframes spin
  0%
    transform: rotate(0deg)
  100%
    transform: rotate(360deg)

.error-container
  background: rgba(239, 68, 68, 0.2)
  border-radius: 1rem
  padding: 2rem

// Responsive
@media screen and (max-width: 1000px)
  .sobre-proyecto
    padding: 4rem 0
    min-height: auto

  .titulo
    font-size: 3rem
    text-align: center

  .comillas
    justify-content: center

  .descripcion
    font-size: 1.4rem
    text-align: center

  .btn-leer-mas
    align-self: center

  .imagen-container
    max-width: 100%

  .torre-imagen
    height: 30rem

@media screen and (max-width: 600px)
  .sobre-proyecto
    padding: 3rem 0

  .titulo
    font-size: 2.4rem

  .comillas
    gap: 0.5rem

  .comilla-izq,
  .comilla-der
    width: 5rem
    height: 5rem
    font-size: 3.2rem

  .descripcion
    font-size: 1.3rem

  .btn-leer-mas
    padding: 1.2rem 3rem
    font-size: 1.4rem
    min-width: 18rem

  .torre-imagen
    height: 25rem
</style>
