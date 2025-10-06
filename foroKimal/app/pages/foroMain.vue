<template>
  <div class="foro-main-bg flex jcc aic w100 min-h100">
    <div class="foro-main-card">
      <h1 class="titulo tac mb2rem">¡Bienvenido al Foro Kimal!</h1>
      <p class="text-md tac">Aquí pronto verás las publicaciones y debates de la comunidad.</p>
      <div class="foro-main-placeholder mt4rem tac">
        <Icon icon="mdi:forum-outline" width="80" height="80" style="color: #b388f5;" />
        <p class="text-lg mt2rem">Funcionalidad en construcción...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
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
</style>
