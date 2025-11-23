
<template>
	<section class="intro p4rem">
		<div class="anchoMaximo flex flex-responsive jcc gap4rem">
			<!-- Contenido principal izquierdo -->
			<div class="contenido-izquierdo">
				<h1 class="titulo mb3rem">Plataforma de Comunicación Kimal</h1>
				<!-- Mapa de Chile con torres -->
				<div class="mapa-container">
					<div class="mapa-chile">
						<img src="/images/mapa.svg" alt="Mapa de Chile" class="mapa-imagen">
						<div class="torre-marker">
							<div class="torre-icon">
								<svg width="40" height="40" viewBox="0 0 24 24" fill="white">
									<path d="M12 2L8 6v2l4-4 4 4V6l-4-4zM8 8v8l4-4 4 4V8l-4 4-4-4zm0 10v2l4-4 4 4v-2l-4 4-4-4z"/>
								</svg>
							</div>
						</div>
					</div>
				</div>
				<!-- Tarjetas informativas con swipe -->
				<TarjetaIntro />
			</div>
			<!-- Contenido derecho -->
			<div class="contenido-derecho">
				<div class="ubicacion-tiempo">
					<h2 class="subTitulo mb2rem">Ubicación tiempo real</h2>
					<div class="mapa-tiempo-real">
						<MapaIntro />
					</div>
					<button class="btn-leer-mas mt3rem">Leer más</button>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import TarjetaIntro from './tarjetaIntro.vue';
import MapaIntro from './MapaIntro.vue';
</script>

<style lang="sass" scoped>
@use '@sass/base' as *

.intro
	display: flex
	justify-content: center
	align-items: flex-start
	min-height: calc(100vh - 15rem)
	width: 100%
	position: relative
	z-index: 0
	background-color: var(--fondo-claro)

.contenido-izquierdo
	flex: 1
	display: flex
	flex-direction: column
	gap: 2rem

.contenido-derecho
	flex: 1
	display: flex
	flex-direction: column

.mapa-container
	background: linear-gradient(135deg, #6B46C1 0%, #8B5CF6 50%, #A855F7 100%)
	border-radius: 2rem
	padding: 3rem
	position: relative
	min-height: 400px
	overflow: hidden

.mapa-chile
	width: 100%
	height: 100%
	position: relative

.mapa-imagen
	width: 100%
	height: 100%
	object-fit: contain
	opacity: 0.3

.torre-marker
	position: absolute
	top: 30%
	left: 50%
	transform: translate(-50%, -50%)
	background: white
	border-radius: 50%
	padding: 0.8rem
	box-shadow: 0 4px 12px rgba(0,0,0,0.2)

.torre-icon svg
	width: 2.4rem
	height: 2.4rem
	fill: #6B46C1

.ubicacion-tiempo
	background: white
	border-radius: 2rem
	padding: 3rem
	box-shadow: 0 4px 12px rgba(0,0,0,0.1)

.mapa-tiempo-real
	border-radius: 1.2rem
	height: 300px
	width: 100%
	overflow: hidden

.btn-leer-mas
	background: linear-gradient(135deg, #EC4899 0%, #BE185D 100%)
	color: white
	padding: 1.2rem 3rem
	border-radius: 5rem
	border: none
	font-weight: 700
	font-size: 1.4rem
	cursor: pointer
	transition: all 0.3s ease
	align-self: center

	&:hover
		transform: translateY(-2px)
		box-shadow: 0 8px 20px rgba(236, 72, 153, 0.3)

// Responsive
@media screen and (max-width: 900px)
	.mapa-container
		min-height: 300px
		
	.mapa-tiempo-real
		height: 250px

@media screen and (max-width: 600px)
	.intro
		padding: 2rem 1rem
		
	.mapa-container, .ubicacion-tiempo
		padding: 2rem
</style>