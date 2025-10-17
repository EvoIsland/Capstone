<template>
  <div class="login-bg">
    <div class="login-card">
      <div class="login-header flex jcsb aic">
        <Icon icon="mdi:menu" width="32" height="32" style="color: #00d1b2;" />
        <div class="flex gap2rem">
          <Icon icon="mdi:minus" width="32" height="32" style="color: #00d1b2;" />
          <Icon icon="mdi:plus" width="32" height="32" style="color: #00d1b2;" />
        </div>
      </div>
      <div class="login-content flex">
        <div class="login-left">
          <h1 class="titulo bold mb2rem">
            Recupera tu<br>
            <span class="secundario">contraseña</span>
          </h1>
        </div>
        <div class="login-right flex ffcn aic w100">
          <input v-model="correo" type="email" placeholder="Correo electrónico" class="login-input mb1rem" required />
          <div class="flex jcsb aic w100 mt1rem">
            <button class="login-btn" @click="handleSubmit">
              Solicitar cambio de contraseña
            </button>
          </div>
          <div v-if="mensaje" class="text-red-800 text-sm" style="margin-top:1rem;">{{ mensaje }}</div>
        </div>
      </div>
    </div>
    <div class="login-footer flex jcsb aic">
      <div class="flex aic gap1rem">
        <span class="login-flag"></span>
        <span>Idiomas</span>
      </div>
      <div class="flex gap2rem">
        <span class="pointer">Ayuda</span>
        <span class="pointer">Privacidad</span>
        <span class="pointer">Términos</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

const correo = ref('')
const mensaje = ref('')

const handleSubmit = async () => {
  mensaje.value = ''
  try {
    const res = await fetch('http://localhost:5000/request-password-change', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: correo.value })
    })
    const data = await res.json()
    mensaje.value = data.message || 'Solicitud enviada.'
  } catch (e) {
    mensaje.value = 'Error de red'
  }
}
</script>

<style lang="sass" scoped>
.login-bg
  min-height: 100vh
  background: #fff
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  padding-top: 5vh

.login-card
  width: 90vw
  max-width: 900px
  min-width: 350px
  min-height: 340px
  background: #f7f7f7
  border-radius: 2.5rem
  box-shadow: 0 4px 32px 0 #cfd2d7aa
  padding: 3rem 2.5rem 2.5rem 2.5rem
  display: flex
  flex-direction: column
  justify-content: flex-start
  align-items: stretch

.login-header
  width: 100%
  margin-bottom: 1.5rem

.login-content
  display: flex
  flex-direction: row
  width: 100%
  align-items: flex-start
  gap: 2.5rem

.login-left
  flex: 1
  display: flex
  align-items: flex-start
  justify-content: flex-start
  .titulo
    font-size: 3.2rem
    font-family: 'Roboto', 'Segoe UI', Arial, sans-serif
    font-weight: bold
    line-height: 1.1
    margin-bottom: 0.5rem
    .secundario
      color: var(--fondo-azul)
      font-size: 2.2rem
      font-weight: 400

.login-right
  flex: 2
  display: flex
  flex-direction: column
  align-items: flex-end
  justify-content: center

.login-input
  width: 100%
  padding: 1.2rem 2rem
  border-radius: 2rem
  border: none
  background: #b388f5
  color: #fff
  font-size: 1.3rem
  font-family: 'Roboto', 'Segoe UI', Arial, sans-serif
  outline: none
  transition: box-shadow 0.2s
  &::placeholder
    color: #fff
    opacity: 0.8
  &:focus
    box-shadow: 0 0 0 2px #b388f5cc

.login-btn
  background: #ff3388
  color: #fff
  border: none
  border-radius: 1.5rem
  padding: 0.8rem 2.5rem
  font-size: 1.2rem
  font-family: 'Roboto', 'Segoe UI', Arial, sans-serif
  font-weight: 500
  cursor: pointer
  transition: background 0.2s
  &:hover:not(:disabled)
    background: #e6006d
  &:disabled
    opacity: 0.7
    cursor: not-allowed

.loader
  border: 2px solid transparent
  border-top: 2px solid #fff
  border-radius: 50%
  width: 1.5rem
  height: 1.5rem
  animation: spin 0.6s linear infinite
  display: inline-block
  vertical-align: middle
  margin-right: 0.5rem

@keyframes spin
  0%
    transform: rotate(0deg)
  100%
    transform: rotate(360deg)

.error-message
  color: #ff3366
  font-size: 1rem
  margin-top: 1rem
  text-align: center

.login-footer
  width: 90vw
  max-width: 900px
  margin: 2.5rem auto 0 auto
  padding: 1.5rem 2rem 0 2rem
  font-size: 1.1rem
  color: #111
  display: flex
  justify-content: space-between
  align-items: center

.login-flag
  width: 2.2rem
  height: 1.5rem
  background: linear-gradient(180deg, #fff 50%, #d52b1e 50% )
  border: 1.5px solid #222
  border-radius: 0.2rem
  position: relative
  display: inline-block
  &::before
    content: ''
    display: block
    position: absolute
    left: 0
    top: 0
    width: 0.7rem
    height: 100%
    background: #0033a0
  &::after
    content: ''
    display: block
    position: absolute
    left: 0.18rem
    top: 0.18rem
    width: 0.34rem
    height: 0.34rem
    background: #fff
    border-radius: 50%

.pointer
  cursor: pointer
  &:hover
    text-decoration: underline

@media (max-width: 700px)
  .login-card, .login-footer
    width: 98vw
    max-width: 98vw
    padding-left: 1rem
    padding-right: 1rem
  .login-content
    flex-direction: column
    gap: 1.5rem
  .login-left, .login-right
    width: 100%
    align-items: flex-start
    justify-content: flex-start
</style>
