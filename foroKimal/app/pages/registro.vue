<template>
  <div class="registro-bg flex jcc aic w100 min-h100">
    <div class="registro-card bg-white p4rem radioComun flex ffcn aic w100" style="max-width: 420px;">
      <div class="registro-avatar flex jcc aic mb3rem">
        <div class="icono circle flex jcc aic" style="background: #fff; border: 2px solid #CFD2D7; width: 8rem; height: 8rem;">
          <Icon icon="mdi:account-circle" width="64" height="64" style="color: #b388f5;" />
        </div>
      </div>
      <h2 class="tac text-2xl bold mb2rem">Registro</h2>
      <form @submit.prevent="handleSubmit" class="flex ffcn gap2rem w100">
        <input v-model="formData.nombre" type="text" placeholder="Nombre" class="registro-input" required>
        <input v-model="formData.apellido" type="text" placeholder="Apellidos" class="registro-input" required>
        <input v-model="formData.correo" type="email" placeholder="Correo" class="registro-input" required>
        <input v-model="formData.contraseña" type="password" placeholder="Contraseña" class="registro-input" required>
        <!-- Pueblo Originario -->
        <div class="flex aic gap1rem w100">
          <input v-model="formData.puebloOriginario" type="checkbox" id="puebloOriginario" class="registro-checkbox">
          <label for="puebloOriginario" class="text-md">Pertenezco a un pueblo originario</label>
        </div>
        <div v-if="formData.puebloOriginario">
          <select v-model="formData.nombrePueblo" class="registro-input" required>
            <option value="" disabled>Selecciona tu pueblo originario</option>
            <option v-for="pueblo in pueblosOriginariosChile" :key="pueblo" :value="pueblo">{{ pueblo }}</option>
          </select>
        </div>
        <!-- Recibir Cartas -->
        <div class="flex aic gap1rem w100">
          <input v-model="formData.recibirCartas" type="checkbox" id="recibirCartas" class="registro-checkbox">
          <label for="recibirCartas" class="text-md">Deseo recibir cartas</label>
        </div>
        <div v-if="formData.recibirCartas">
          <input v-model="formData.direccion" type="text" placeholder="Dirección" class="registro-input">
        </div>
        <div v-if="error" class="text-red-800 text-sm">{{ error }}</div>
        <button type="submit" class="registro-btn" :disabled="loading">
          <span v-if="loading">Registrando...</span>
          <span v-else>Registrar</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuth } from '../../composables/useAuth'

const pueblosOriginariosChile = [
  'Aymara',
  'Quechua',
  'Atacameño (Likan Antai)',
  'Colla',
  'Diaguita',
  'Mapuche',
  'Rapa Nui',
  'Kawésqar',
  'Yagán',
  'Chango',
  'Otros'
]

const { register, loading, error } = useAuth()

const formData = ref({
  nombre: '',
  apellido: '',
  correo: '',
  contraseña: '',
  puebloOriginario: false,
  nombrePueblo: '',
  recibirCartas: false,
  direccion: ''
})

const handleSubmit = async () => {
  try {
    const success = await register(formData.value)
    if (success) {
      // Limpiar formulario y mostrar mensaje de éxito
      formData.value = {
        nombre: '',
        apellido: '',
        correo: '',
        contraseña: '',
        puebloOriginario: false,
        nombrePueblo: '',
        recibirCartas: false,
        direccion: ''
      }
      alert('Usuario registrado exitosamente')
    }
  } catch (e) {
    console.error('Error en el registro:', e)
  }
}

</script>

<style lang="sass" scoped>
.registro-bg
  min-height: 100vh
  background: #fff

.registro-card
  box-shadow: 0 4px 32px 0 #cfd2d7aa
  margin: 4rem 0

.registro-avatar
  width: 100%
  justify-content: center

.registro-input
  width: 100%
  padding: 1.2rem 1rem
  border-radius: var(--radio-input)
  border: none
  background: #b388f5
  color: #fff
  font-size: 1.2rem
  outline: none
  transition: box-shadow 0.2s
  &::placeholder
    color: #fff
    opacity: 0.8
  &:focus
    box-shadow: 0 0 0 2px #b388f5cc

.registro-checkbox
  width: 2rem
  height: 2rem
  border-radius: 0.5rem
  border: 1.5px solid #cfd2d7
  accent-color: #b388f5
  margin-right: 0.5rem

.registro-btn
  width: 100%
  background: #ff3388
  color: #fff
  border: none
  border-radius: 1.5rem
  padding: 1.2rem 0
  font-size: 1.3rem
  font-weight: 500
  margin-top: 1.5rem
  cursor: pointer
  transition: background 0.2s
  &:hover:not(:disabled)
    background: #e6006d
  &:disabled
    opacity: 0.7
    cursor: not-allowed

.text-red-800
  color: var(--color-error)
</style>
