<!-- filepath: c:\conexiones-kimal\frontend-kimal\pages\index.vue -->
<template>
  <div class="layout-principal">
    <Navbar />
    <div class="mapa-contenedor">
      <!-- El cuadro verde irá aquí, superpuesto -->
      <!-- <CuadroLateral /> -->
      <MapaLeaflet />
    </div>
  </div>
</template>

<script setup>
import MapaLeaflet from '~/components/MapaLeaflet.vue'
import Navbar from '~/components/ui/navbar.vue';
// import CuadroLateral from '~/components/CuadroLateral.vue' // Cuando lo tengas listo
</script>

<style lang="sass" scoped>
@use '../../sass/base' as *

.layout-principal
  min-height: 100vh
  display: flex
  flex-direction: column

.navbar
  @extend .navbar
  justify-content: space-between
  position: relative
  z-index: 10

.logo
  height: 60px
  margin-left: 24px

.nav-links
  display: flex
  gap: 48px
  margin-right: 48px
  a
    font-size: 2rem
    font-weight: 700
    color: var(--blanco)
    transition: opacity .2s
    &:hover
      opacity: .7

.mapa-contenedor
  position: relative
  flex: 1
  width: 100%
  height: calc(100vh - var(--navbar-height))
  overflow: hidden

  // El cuadro verde lateral debe ir aquí con position: absolute o fixed
  // .cuadro-lateral
  //   position: absolute
  //   top: 32px
  //   left: 32px
  //   z-index: 20

  // El mapa ocupa todo el fondo
  :deep(.leaflet-container)
    width: 100% !important
    height: 100% !important
    min-height: 500px

@media (max-width: 900px)
  .navbar
    flex-direction: column
    align-items: flex-start
    .logo
      margin-left: 0
    .nav-links
      margin-right: 0
      gap: 24px
  .mapa-contenedor
    height: calc(100vh - var(--navbar-height))

@media (max-width: 600px)
  .mapa-contenedor
    height: calc(100vh - var(--navbar-height))
</style>