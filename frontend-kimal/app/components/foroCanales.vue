<template>
    <section class="foro-canales">
        <div class="anchoMaximo flex flex-responsive jcc gap4rem">
            <!-- Lado izquierdo - Foro Comunitario -->
            <div class="lado lado-izquierdo">
                <div class="tarjeta-foro">
                    <h2 class="titulo-tarjeta">Foro Comunitario</h2>
                    <button class="btn-ver-mas">Ver más</button>
                </div>
            </div>
            
            <!-- Lado derecho - Canal Formales -->
            <div class="lado lado-derecho">
                <div class="tarjeta-canal">
                    <h2 class="titulo-tarjeta">Canal Formales</h2>
                    <button class="btn-ver-mas">Ver más</button>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
// Funciones para manejar clicks si es necesario
function verForoComunitario() {
    // Lógica para navegar al foro comunitario
    console.log('Navegando a Foro Comunitario')
}

function verCanalFormales() {
    // Lógica para navegar al canal formales
    console.log('Navegando a Canal Formales')
}
</script>

<style lang="sass" scoped>
@use '@sass/base' as *

.foro-canales
	display: flex
	justify-content: center
	align-items: center
	min-height: calc(100vh - 15rem)
	width: 100%
	padding: 5rem 0

.anchoMaximo
	display: flex
	align-items: center
	width: 100%
	max-width: 1400px
	margin: 0 auto
	padding: 0 2rem
	gap: 4rem

.lado
	&.lado-izquierdo,
	&.lado-derecho
		flex: 1
		display: flex
		justify-content: center
		align-items: center

.tarjeta-foro,
.tarjeta-canal
	width: 100%
	height: 400px
	border-radius: 3rem
	display: flex
	flex-direction: column
	justify-content: center
	align-items: center
	text-align: center
	padding: 4rem
	position: relative

.tarjeta-foro
	background: linear-gradient(135deg, #10B981 0%, #059669 100%)

.tarjeta-canal
	background: linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A855F7 100%)

.titulo-tarjeta
	font-size: 4rem
	font-weight: 700
	color: white
	margin-bottom: 4rem
	line-height: 1.2

.btn-ver-mas
	background: transparent
	border: 2px solid white
	color: white
	padding: 1.2rem 3rem
	border-radius: 5rem
	font-weight: 600
	font-size: 1.4rem
	cursor: pointer
	transition: all 0.3s ease

	&:hover
		background: white
		color: #333
		transform: translateY(-2px)
		box-shadow: 0 8px 20px rgba(255, 255, 255, 0.3)

// Responsive siguiendo el patrón estándar
@media screen and (max-width: 1000px)
	.foro-canales
		.anchoMaximo
			flex-direction: column
			gap: 2rem
			align-items: flex-start
			padding: 0 1rem

		.lado
			&.lado-izquierdo,
			&.lado-derecho
				flex: none
				max-width: 100%
				width: 100%

		.tarjeta-foro,
		.tarjeta-canal
			height: 300px

		.titulo-tarjeta
			font-size: 3rem

@media screen and (max-width: 600px)
	.foro-canales
		padding: 3rem 0

		.anchoMaximo
			padding: 0 1rem

		.tarjeta-foro,
		.tarjeta-canal
			padding: 3rem
			height: 250px

		.titulo-tarjeta
			font-size: 2.4rem
			margin-bottom: 3rem

		.btn-ver-mas
			padding: 1rem 2.5rem
			font-size: 1.2rem
</style>