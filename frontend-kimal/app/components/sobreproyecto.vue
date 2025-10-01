<template>
  <section class="sobre-proyecto p4rem">
    <div class="anchoMaximo flex flex-responsive jcc gap4rem">
      <!-- Contenido principal izquierdo -->
      <div class="contenido-izquierdo">
        <h2 class="titulo mb3rem">Sobre el proyecto</h2>
        
        <!-- Comillas decorativas -->
        <div class="comillas mb3rem">
          <span class="comilla-izq">"</span>
          <span class="comilla-der">"</span>
        </div>
        
        <!-- Descripción del proyecto -->
        <p class="descripcion mb4rem">
          Consiste en el desarrollo, construcción y operación de la 
          primera línea de transmisión de corriente continua entre la 
          Subestación Limal en la comuna de María Elena, Región de 
          Antofagasta y la Subestación Lo Aguirre en la comuna de 
          Pudahuel, Región Metropolitana.
        </p>
        
        <!-- Botón Leer más -->
        <button class="btn-leer-mas">
          Leer más
        </button>
      </div>
      
      <!-- Contenido derecho - Imagen -->
      <div class="contenido-derecho">
        <div class="imagen-container">
          <img src="#" alt="Torre eléctrica" class="torre-imagen">
        </div>
      </div>
    </div>
  </section>
</template>

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
