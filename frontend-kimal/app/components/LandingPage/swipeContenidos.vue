<template>
    <section class="swipe-contenidos">
        <div class="anchoMaximo flex flex-responsive jcc gap4rem">
            <!-- Lado izquierdo - Noticias destacadas -->
            <div class="lado lado-izquierdo">
                <div class="carousel-container">
                    <Swiper
                        :breakpoints="breakpoints"
                        :slides-per-view="1"
                        :space-between="20"
                        :pagination="{ clickable: true }"
                        :modules="[Pagination]"
                        class="noticias-swiper"
                        ref="swiperRef"
                    >
                        <SwiperSlide
                            v-for="noticia in noticiasDestacadas"
                            :key="noticia.id"
                        >
                            <div class="noticia-card-principal">
                                <!-- Título en la esquina superior izquierda -->
                                <div class="titulo-esquina">
                                    <h2 class="titulo-destacadas">Noticias destacadas</h2>
                                </div>
                                
                                <!-- Contenedor del mapa -->
                                <div class="mapa-container">
                                    <img src="#" alt="Mapa Kimal-Lo Aguirre" class="mapa-imagen">
                                </div>
                                
                                <!-- Contenido del texto a la derecha -->
                                <div class="contenido-texto">
                                    <h3 class="titulo-noticia">{{ noticia.titulo }}</h3>
                                    <p class="descripcion-noticia">{{ noticia.descripcion }}</p>
                                </div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>
            
            <!-- Lado derecho - Panel Verde -->
            <!-- <div class="lado lado-derecho">
                <div class="panel-noticias-proyecto">
                    <h2 class="titulo-panel">Noticias sobre proyecto</h2>
                    
                    <!-- Mapa pequeño -->
                    <!-- <div class="mapa-pequeno">
                        <img src="#" alt="Mapa pequeño" class="imagen-mapa-pequeno">
                    </div> -->
                    
                    <!-- Texto informativo -->
                    <!-- <div class="texto-informativo">
                        <h3 class="titulo-informacion">Información sobre noticias</h3>
                        <p class="descripcion-informacion">
                            Mantente informado sobre los últimos avances del proyecto HVDC Kimal-Lo Aguirre, 
                            incluyendo actualizaciones de construcción y beneficios para las comunidades.
                        </p>
                    </div> -->
                <!-- </div>
            </div>  -->
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

interface Noticia {
    id: number
    titulo: string
    descripcion: string
    imagen: string
    fecha?: string
    categoria: 'destacada' | 'proyecto'
}

const swiperRef = ref<any>(null)

// Datos de ejemplo basados en el proyecto KIMAL
const noticiasDestacadas = ref<Noticia[]>([
    {
        id: 1,
        titulo: "Título",
        descripcion: "Las comunidades carecen de mecanismos claros y accesibles para monitorear y fiscalizar los avances del proyecto HVDC, lo que puede generar desconfianza o limitar la transparencia.",
        imagen: "#",
        categoria: 'destacada'
    },
    {
        id: 2,
        titulo: "Conexión entre subestaciones",
        descripcion: "Se ha establecido exitosamente la conexión principal entre la Subestación Kimal en María Elena y la Subestación Lo Aguirre en Pudahuel, marcando un hito importante en el proyecto.",
        imagen: "#",
        categoria: 'destacada'
    },
    {
        id: 3,
        titulo: "Beneficios para comunidades",
        descripcion: "El proyecto HVDC generará empleos locales y mejorará la infraestructura eléctrica de las regiones de Antofagasta y Metropolitana, beneficiando a miles de familias.",
        imagen: "#",
        categoria: 'destacada'
    }
])

const noticiasProyecto = ref<Noticia[]>([])

const breakpoints = {
    320: {
        slidesPerView: 1,
        spaceBetween: 20
    },
    768: {
        slidesPerView: 1,
        spaceBetween: 20
    },
    1024: {
        slidesPerView: 1,
        spaceBetween: 30
    }
}

onMounted(async () => {
    // Aquí puedes cargar datos desde data.json si es necesario
    // const response = await fetch('/data.json')
    // const data = await response.json()
    // Procesar datos según necesidad
})
</script>

<style lang="sass" scoped>
@use '@sass/base' as *

.swipe-contenidos
	display: flex
	justify-content: center
	align-items: center
	min-height: 100vh
	width: 100%
	position: relative
	z-index: 0
	padding: 4rem 0
	background-color: var(--fondo-claro)

.lado
	&.lado-izquierdo
		flex: 2
		display: flex
		flex-direction: column

	&.lado-derecho
		flex: 1
		display: flex
		flex-direction: column

.carousel-container
	width: 100%
	overflow: hidden
	position: relative

.noticias-swiper
	min-height: 600px
	padding-bottom: 3rem
	border-radius: 3rem
	overflow: visible

.noticia-card-principal
	background: linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A855F7 100%)
	border-radius: 3rem
	overflow: hidden
	position: relative
	height: 550px
	display: flex
	align-items: center
	padding: 4rem
	color: white

.titulo-esquina
	position: absolute
	top: 3rem
	left: 3rem
	z-index: 10

.titulo-destacadas
	font-size: 2.4rem
	font-weight: 700
	color: white
	margin: 0

.mapa-container
	flex: 1
	display: flex
	align-items: center
	justify-content: center
	padding-right: 2rem

.mapa-imagen
	width: 100%
	max-width: 320px
	height: auto
	object-fit: contain
	border-radius: 2rem
	background: rgba(255, 255, 255, 0.1)
	padding: 2rem

.contenido-texto
	flex: 1
	display: flex
	flex-direction: column
	justify-content: center
	padding: 2rem
	text-align: center

.titulo-noticia
	font-size: 3rem
	font-weight: 700
	margin-bottom: 2rem
	color: white
	text-align: center

.descripcion-noticia
	font-size: 1.6rem
	line-height: 1.6
	color: white
	text-align: center

.panel-noticias-proyecto
	background: linear-gradient(135deg, #10B981 0%, #059669 100%)
	border-radius: 3rem
	padding: 4rem
	height: 550px
	display: flex
	flex-direction: column
	color: white
	position: relative

.titulo-panel
	font-size: 2.4rem
	font-weight: 700
	margin-bottom: 2rem
	color: white
	text-align: left

.mapa-pequeno
	display: flex
	justify-content: center
	margin-bottom: 2rem

.imagen-mapa-pequeno
	width: 240px
	height: auto
	object-fit: contain
	border-radius: 1.5rem
	background: rgba(255, 255, 255, 0.1)
	padding: 1rem

.texto-informativo
	margin-top: auto

.titulo-informacion
	font-size: 2rem
	font-weight: 600
	margin-bottom: 1.5rem
	color: white

.descripcion-informacion
	font-size: 1.4rem
	line-height: 1.6
	color: white

// Estilos de paginación personalizados para que coincidan con la imagen
:deep(.swiper-pagination)
	bottom: 0 !important

:deep(.swiper-pagination-bullet)
	background: #EC4899 !important
	opacity: 0.4
	width: 12px
	height: 12px

:deep(.swiper-pagination-bullet-active)
	background: #EC4899 !important
	opacity: 1

// Responsive
@media screen and (max-width: 900px)
	.swipe-contenidos
		padding: 2rem 0
		min-height: auto
		
	.noticia-card-principal
		flex-direction: column
		height: 500px
		padding: 3rem
		text-align: center
		
	.mapa-container
		padding: 0
		margin-bottom: 2rem
		
	.contenido-texto
		padding: 1rem
		
	.titulo-esquina
		position: relative
		top: 0
		left: 0
		margin-bottom: 2rem
		text-align: center
		
	.panel-noticias-proyecto
		height: 450px
		margin-top: 2rem

@media screen and (max-width: 600px)
	.swipe-contenidos
		padding: 2rem 0
		
	.noticia-card-principal, .panel-noticias-proyecto
		padding: 2rem
		
	.noticia-card-principal
		height: 400px
		
	.panel-noticias-proyecto
		height: 350px
		
	.titulo-destacadas, .titulo-panel
		font-size: 2rem
		
	.titulo-noticia
		font-size: 2.4rem
		
	.descripcion-noticia, .descripcion-informacion
		font-size: 1.2rem
</style>
