<template>
  <div class="mapa-wrapper">
    <MapaLeaflet />
  </div>
</template>

<script setup>
import MapaLeaflet from '~/components/MapaLeaflet.vue'
</script>

<style lang="sass" scoped>
.mapa-wrapper
  position: relative
  width: 100vw
  height: 100vh

#map
  width: 100vw
  height: 100vh
</style>