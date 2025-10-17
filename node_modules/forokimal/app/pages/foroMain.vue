<template>
  <div class="foro-main-lista">
    <h1 class="titulo tac mb2rem">¡Bienvenido al Foro Kimal!</h1>
    <div v-if="cargandoPublicaciones" class="tac mt4rem">Cargando publicaciones...</div>
    <div v-else-if="errorPublicaciones" class="text-red-800 tac mt4rem">{{ errorPublicaciones }}</div>
    <div v-else>
      <div v-if="publicaciones.length === 0" class="tac mt4rem">
        No hay publicaciones aún.
      </div>
      <div>
        <PostBoxFeed
          v-for="pub in publicaciones"
          :key="pub._id"
          :username="pub.publicadorId?.nombre || 'Usuario'"
          :tipo="pub.tipo"
          :fecha="new Date(pub.fecha).toLocaleString()"
          :texto="pub.texto"
          :imagenes="pub.imagenes"
          :region="pub.regionId?.nombre"
          :comuna="pub.comunaId?.nombre"
          :instalacion="pub.instalacionId?.nombre"
          :likes="210"
          :comentarios="15"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { onMounted, ref } from 'vue'

interface Publicacion {
  _id: string
  tipo: string
  texto: string
  fecha: string
  imagenes?: string[]
  instalacionId?: { nombre: string }
  comunaId?: { nombre: string }
  regionId?: { nombre: string }
  publicadorId?: { nombre?: string }
}

const publicaciones = ref<Publicacion[]>([])
const cargandoPublicaciones = ref(true)
const errorPublicaciones = ref('')

onMounted(async () => {
  try{
    cargandoPublicaciones.value = true
    const res = await fetch('http://localhost:5000/publicaciones')
    if(!res.ok) throw new Error('No se pudieron obtener publicaciones')
    publicaciones.value = await res.json()
  } catch (err) {
    errorPublicaciones.value = 'Error al cargar publicaciones'
  } finally {
    cargandoPublicaciones.value = false
  }

})


</script>

<style lang="sass" scoped>
.foro-main-bg
  min-height: 100vh
  background: #fff
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center

.foro-main-card
  background: #f7f7f7
  border-radius: 2.5rem
  box-shadow: 0 4px 32px 0 #cfd2d7aa
  padding: 4rem 2.5rem
  max-width: 600px
  width: 100%
  margin: 4rem auto

.titulo
  font-size: 2.8rem
  font-family: 'Roboto', 'Segoe UI', Arial, sans-serif
  font-weight: bold
  color: var(--fondo-azul)
  margin-bottom: 1.5rem

.text-md
  font-size: 1.3rem
  color: #333

.text-lg
  font-size: 1.7rem
  color: #b388f5

.tac
  text-align: center

.mt2rem
  margin-top: 2rem
.mt4rem
  margin-top: 4rem

.registro-input
  width: 100%
  padding: 0.7rem
  border-radius: 0.7rem
  border: 1px solid #b388f5
  margin-top: 0.5rem
  font-size: 1.1rem

.registro-btn
  background: #b388f5
  color: #fff
  border: none
  border-radius: 1rem
  padding: 0.8rem 2rem
  font-size: 1.2rem
  cursor: pointer
  margin-top: 1rem
  transition: background 0.2s
  &:hover
    background: #8e24aa
</style>
