<template>
    <div class="tarjetas-swipe-container">
        <!-- Tarjetas informativas con swipe -->
        <div 
            class="tarjetas-info-swipe"
            ref="swipeContainer"
            @touchstart="onTouchStart"
            @touchmove="onTouchMove"
            @touchend="onTouchEnd"
            @mousedown="onMouseDown"
            @mousemove="onMouseMove"
            @mouseup="onMouseUp"
            @mouseleave="onMouseUp"
            :style="{ transform: `translateX(${translateX}px)` }"
        >
            <div 
                v-for="(tarjeta, index) in tarjetas" 
                :key="tarjeta.id"
                class="tarjeta-swipe"
                :class="{ 'active': index === currentIndex }"
            >
                <!-- Tarjeta de texto -->
                <div 
                    class="tarjeta info-texto"
                    :style="{ background: tarjeta.color }"
                >
                    <h3 class="text-xl bold mb1rem text-white">{{ tarjeta.titulo }}</h3>
                    <p class="text-md text-white">{{ tarjeta.texto }}</p>
                </div>
                
                <!-- Tarjeta de imagen -->
                <div class="tarjeta torre-imagen">
                    <img 
                        :src="tarjeta.imagen" 
                        :alt="tarjeta.alt" 
                        class="w100 h100 object-cover"
                    >
                </div>
            </div>
        </div>
        
        <!-- Indicadores de posición -->
        <div class="indicadores">
            <div 
                v-for="(tarjeta, index) in tarjetas"
                :key="`indicator-${tarjeta.id}`"
                class="indicador"
                :class="{ 'active': index === currentIndex }"
                @click="goToSlide(index)"
            ></div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

// Datos reactivos
const tarjetas = ref([])
const currentIndex = ref(0)
const translateX = ref(0)
const swipeContainer = ref(null)

// Variables para el manejo del swipe
const isDragging = ref(false)
const startX = ref(0)
const currentX = ref(0)
const initialTranslateX = ref(0)

// Cargar datos desde Strapi
onMounted(async () => {
    try {
        console.log('🔄 Cargando tarjetas desde Strapi...')
        
        // Configuración de Strapi
        const config = useRuntimeConfig()
        const strapiApiUrl = config.public.strapiApiUrl || 'http://localhost:1337/api'
        const strapiUrl = config.public.strapiUrl || 'http://localhost:1337'
        
        const response = await $fetch(`${strapiApiUrl}/tarjetas-intros?populate=imagen`)
        
        console.log('✅ Datos cargados desde Strapi:', response)
        
        // Mapear los datos al formato del swiper
        const tarjetasStrapi = response.data || response
        
        tarjetas.value = tarjetasStrapi.map(tarjeta => ({
            id: tarjeta.id,
            titulo: tarjeta.titulo,
            texto: tarjeta.descripcion,
            color: "linear-gradient(135deg, #10B981 0%, #059669 100%)", // Color por defecto
            imagen: tarjeta.imagen?.url ? 
                (tarjeta.imagen.url.startsWith('http') ? 
                    tarjeta.imagen.url : 
                    `${strapiUrl}${tarjeta.imagen.url}`) 
                : '/images/placeholder.jpg',
            alt: tarjeta.imagen?.alternativeText || 'Imagen del proyecto'
        }))
        
    } catch (error) {
        console.error('❌ Error al cargar los datos desde Strapi:', error)
        // NO más fallback a data.json - mostrar error
        tarjetas.value = []
    }
})

// Funciones de navegación
const nextSlide = () => {
    if (currentIndex.value < tarjetas.value.length - 1) {
        currentIndex.value++
        updateTranslateX()
    }
}

const prevSlide = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--
        updateTranslateX()
    }
}

const goToSlide = (index) => {
    currentIndex.value = index
    updateTranslateX()
}

const updateTranslateX = () => {
    if (swipeContainer.value) {
        const slideWidth = swipeContainer.value.offsetWidth
        translateX.value = -currentIndex.value * slideWidth
    }
}

// Manejo de eventos táctiles
const onTouchStart = (e) => {
    isDragging.value = true
    startX.value = e.touches[0].clientX
    initialTranslateX.value = translateX.value
}

const onTouchMove = (e) => {
    if (!isDragging.value) return
    
    currentX.value = e.touches[0].clientX
    const deltaX = currentX.value - startX.value
    
    // Solo permitir swipe desde la tarjeta izquierda (hacia la derecha)
    if (deltaX > 0 && currentIndex.value > 0) {
        translateX.value = initialTranslateX.value + deltaX
    } else if (deltaX < 0 && currentIndex.value < tarjetas.value.length - 1) {
        translateX.value = initialTranslateX.value + deltaX
    }
}

const onTouchEnd = () => {
    if (!isDragging.value) return
    
    const deltaX = currentX.value - startX.value
    const threshold = 100 // Umbral mínimo para cambiar de slide
    
    if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0 && currentIndex.value > 0) {
            prevSlide()
        } else if (deltaX < 0 && currentIndex.value < tarjetas.value.length - 1) {
            nextSlide()
        } else {
            updateTranslateX() // Volver a la posición original
        }
    } else {
        updateTranslateX() // Volver a la posición original
    }
    
    isDragging.value = false
}

// Manejo de eventos de mouse (para escritorio)
const onMouseDown = (e) => {
    isDragging.value = true
    startX.value = e.clientX
    initialTranslateX.value = translateX.value
    e.preventDefault()
}

const onMouseMove = (e) => {
    if (!isDragging.value) return
    
    currentX.value = e.clientX
    const deltaX = currentX.value - startX.value
    
    // Solo permitir swipe desde la tarjeta izquierda (hacia la derecha)
    if (deltaX > 0 && currentIndex.value > 0) {
        translateX.value = initialTranslateX.value + deltaX
    } else if (deltaX < 0 && currentIndex.value < tarjetas.value.length - 1) {
        translateX.value = initialTranslateX.value + deltaX
    }
}

const onMouseUp = () => {
    if (!isDragging.value) return
    
    const deltaX = currentX.value - startX.value
    const threshold = 100
    
    if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0 && currentIndex.value > 0) {
            prevSlide()
        } else if (deltaX < 0 && currentIndex.value < tarjetas.value.length - 1) {
            nextSlide()
        } else {
            updateTranslateX()
        }
    } else {
        updateTranslateX()
    }
    
    isDragging.value = false
}

// Actualizar cuando cambie el tamaño de ventana
onMounted(() => {
    window.addEventListener('resize', updateTranslateX)
    updateTranslateX()
})
</script>

<style lang="sass" scoped>
@use '@sass/base' as *

.tarjetas-swipe-container
    position: relative
    width: 100%
    overflow: hidden
    user-select: none

.tarjetas-info-swipe
    display: flex
    transition: transform 0.3s ease-out
    cursor: grab
    width: 100%
    
    &:active
        cursor: grabbing

.tarjeta-swipe
    min-width: 100%
    display: flex
    gap: 2rem
    flex-shrink: 0
    align-items: stretch // Asegurar que ambas tarjetas tengan la misma altura
    width: 100% // Asegurar que cada slide ocupe todo el ancho

.tarjeta
    border-radius: 2rem
    padding: 2rem
    flex: 1
    min-height: 200px
    max-height: 200px
    display: flex
    flex-direction: column
    width: calc(50% - 1rem) // Cada tarjeta ocupa exactamente la mitad del espacio menos el gap

.info-texto
    color: white
    display: flex
    flex-direction: column
    justify-content: center
    align-items: flex-start
    text-align: left

.torre-imagen
    padding: 0 !important
    overflow: hidden
    background: #f3f4f6
    min-height: 200px
    max-height: 200px
    
    img
        width: 100%
        height: 100%
        object-fit: cover
        border-radius: 2rem

.indicadores
    display: flex
    justify-content: center
    gap: 0.8rem
    margin-top: 1.5rem

.indicador
    width: 0.8rem
    height: 0.8rem
    border-radius: 50%
    background: #d1d5db
    cursor: pointer
    transition: all 0.3s ease
    
    &.active
        background: #6B46C1
        transform: scale(1.2)
    
    &:hover
        background: #9CA3AF

.nav-btn
    position: absolute
    top: calc(50% - 2rem) // Ajustar posición para centrar en las tarjetas
    transform: translateY(-50%)
    background: rgba(255, 255, 255, 0.9)
    border: none
    border-radius: 50%
    width: 3rem
    height: 3rem
    display: flex
    align-items: center
    justify-content: center
    cursor: pointer
    box-shadow: 0 2px 8px rgba(0,0,0,0.15)
    transition: all 0.3s ease
    z-index: 2
    opacity: 0.7
    
    &:hover:not(:disabled)
        background: white
        opacity: 1
        transform: translateY(-50%) scale(1.05)
    
    &:disabled
        opacity: 0.3
        cursor: not-allowed
    
    svg
        color: #6B46C1
        width: 1.8rem
        height: 1.8rem


// Responsive
@media screen and (max-width: 900px)
    .tarjeta-swipe
        flex-direction: column
        gap: 1.5rem
        
    .tarjeta
        min-height: 160px
        max-height: 160px
        width: 100% // En móvil cada tarjeta ocupa todo el ancho
        
    .torre-imagen
        min-height: 160px
        max-height: 160px
        
    .nav-btn
        display: none // Ocultar botones en móvil, usar solo swipe

@media screen and (max-width: 600px)
    .tarjeta
        padding: 1.5rem
        min-height: 140px
        max-height: 140px
        width: 100%
        
    .torre-imagen
        min-height: 140px
        max-height: 140px
        
    .tarjeta-swipe
        gap: 1rem
        
    .indicadores
        margin-top: 1rem
        gap: 0.6rem
        
    .indicador
        width: 0.6rem
        height: 0.6rem
</style>