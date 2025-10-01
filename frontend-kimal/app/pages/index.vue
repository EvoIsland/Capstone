<template>
  <div class="mapa-wrapper">
    <MapaLeaflet @seleccionar-instalacion="seleccionarInstalacion" />
    <div v-if="instalacionSeleccionada" class="sidebar-posts">
      <h2 class="sidebar-title">{{ instalacionSeleccionada.nombre }}</h2>
      <UiPostList :posts="instalacionSeleccionada.posts" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MapaLeaflet from '~/components/MapaLeaflet.vue'

// Ejemplo de datos de instalaciones y posts
const instalaciones = [
  {
    nombre: 'Pudahuel', // Cambiado para coincidir con el nombre del mapa
    posts: [
      { title: 'Post 1', body: 'Contenido del post 1', image: '' },
      { title: 'Post 2', body: 'Contenido del post 2', image: '' }
    ]
  },
  // ...otras instalaciones
]

const instalacionSeleccionada = ref(null)

function seleccionarInstalacion(nombre) {
  instalacionSeleccionada.value = instalaciones.find(i => i.nombre === nombre)
}
</script>

<style lang="sass" scoped>
.mapa-wrapper
  position: relative
  width: 100vw
  height: 100vh

#map
  width: 100vw
  height: 100vh

.sidebar-posts
  position: absolute
  top: 32px
  left: 16px
  width: 400px
  min-height: 300px
  max-height: 85vh
  background: linear-gradient(135deg, #6fd37e 0%, #3a8d5d 100%)
  border-radius: 2rem
  box-shadow: 0 2px 12px rgba(0,0,0,0.12)
  padding: 2rem 1.5rem 1.5rem 1.5rem
  z-index: 2000
  display: flex
  flex-direction: column
  align-items: center
  overflow: hidden

.sidebar-title
  color: #fff
  font-size: 2rem
  font-weight: bold
  margin-bottom: 1.5rem
</style>