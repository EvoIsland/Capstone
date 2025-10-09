<template>
  <div class="foro-main-bg flex jcc aic w100 min-h100">
    <div class="foro-main-card">
      <h1 class="titulo tac mb2rem">¡Bienvenido al Foro Kimal!</h1>
      <p class="text-md tac">Aquí pronto verás las publicaciones y debates de la comunidad.</p>
      <form @submit.prevent="handleSubmit" class="mt4rem tac">
        <div class="mb2rem">
          <label for="tipo" class="text-md">Tipo de publicación:</label>
          <select v-model="form.tipo" id="tipo" class="registro-input">
            <option value="pregunta">Pregunta</option>
            <option value="reporte">Reporte</option>
            <option value="noticia">Noticia</option>
          </select>
        </div>
        <div v-if="form.tipo === 'pregunta' || form.tipo === 'noticia'" class="mb2rem">
          <label for="region" class="text-md">Región:</label>
          <select v-model="form.regionId" id="region" class="registro-input">
            <option value="">Sin filtro</option>
            <option v-for="region in regiones" :key="region._id" :value="region._id">{{ region.nombre }}</option>
          </select>
        </div>
        <div v-if="form.tipo === 'pregunta' || form.tipo === 'noticia'" class="mb2rem">
          <label for="comuna" class="text-md">Comuna:</label>
          <select v-model="form.comunaId" id="comuna" class="registro-input">
            <option value="">Sin filtro</option>
            <option v-for="comuna in comunasFiltradas" :key="comuna._id" :value="comuna._id">{{ comuna.nombre }}</option>
          </select>
        </div>
        <div v-if="form.tipo === 'pregunta' || form.tipo === 'noticia'" class="mb2rem">
          <label for="instalacion" class="text-md">Instalación:</label>
          <select v-model="form.instalacionId" id="instalacion" class="registro-input">
            <option value="">Sin filtro</option>
            <option v-for="inst in instalacionesFiltradas" :key="inst._id" :value="inst._id">{{ inst.nombre }}</option>
          </select>
        </div>
        <div v-if="form.tipo === 'reporte'" class="mb2rem">
          <label for="instalacion" class="text-md">Instalación (obligatorio):</label>
          <select v-model="form.instalacionId" id="instalacion" class="registro-input" required>
            <option value="">Selecciona una instalación</option>
            <option v-for="inst in instalacionesFiltradas" :key="inst._id" :value="inst._id">{{ inst.nombre }}</option>
          </select>
        </div>
        <div v-if="form.tipo === 'reporte'" class="mb2rem">
          <label class="text-md">Comuna:</label>
          <input :value="comunaAuto" class="registro-input" readonly />
        </div>
        <div v-if="form.tipo === 'reporte'" class="mb2rem">
          <label class="text-md">Región:</label>
          <input :value="regionAuto" class="registro-input" readonly />
        </div>
        <div class="mb2rem">
          <label for="texto" class="text-md">Texto:</label>
          <textarea v-model="form.texto" id="texto" rows="3" class="registro-input" required></textarea>
        </div>
        <div class="mb2rem">
          <label for="imagenes" class="text-md">Imágenes (máx 3, JPG/PNG, 1-2MB c/u):</label>
          <input id="imagenes" type="file" class="registro-input" multiple accept="image/png,image/jpeg" @change="handleFileChange" />
        </div>
        <button type="submit" class="registro-btn">Publicar</button>
        <div v-if="error" class="text-red-800 text-md mt2rem">{{ error }}</div>
        <div v-if="success" class="text-green-700 text-md mt2rem">{{ success }}</div>
      </form>
      <div class="foro-main-placeholder mt4rem tac">
        <Icon icon="mdi:forum-outline" width="80" height="80" style="color: #b388f5;" />
        <p class="text-lg mt2rem">Funcionalidad en construcción...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuth } from '../../composables/useAuth'

interface Region { _id: string; nombre: string; }
interface Comuna { _id: string; nombre: string; regionId: string; }
interface Instalacion { _id: string; nombre: string; comunaId: string; regionId: string; }

const { accessToken } = useAuth()
const form = ref({
  tipo: 'pregunta',
  texto: '',
  imagenes: [],
  instalacionId: '',
  comunaId: '',
  regionId: ''
})
const error = ref('')
const success = ref('')
const regiones = ref<Region[]>([])
const comunas = ref<Comuna[]>([])
const instalaciones = ref<Instalacion[]>([])
const imagenFiles = ref<File[]>([])

const comunasFiltradas = computed(() => {
  if (!form.value.regionId) return comunas.value
  return comunas.value.filter(c => c.regionId === form.value.regionId)
})
const instalacionesFiltradas = computed(() => {
  if (!form.value.comunaId) return instalaciones.value
  return instalaciones.value.filter(i => i.comunaId === form.value.comunaId)
})
const comunaAuto = computed(() => {
  const inst = instalaciones.value.find(i => i._id === form.value.instalacionId)
  const comuna = comunas.value.find(c => c._id === inst?.comunaId)
  return comuna ? comuna.nombre : ''
})
const regionAuto = computed(() => {
  const inst = instalaciones.value.find(i => i._id === form.value.instalacionId)
  const region = regiones.value.find(r => r._id === inst?.regionId)
  return region ? region.nombre : ''
})

const handleFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (!files) return
  imagenFiles.value = Array.from(files).slice(0, 3)
}

onMounted(async () => {
  // Obtener regiones, comunas, instalaciones
  const [regRes, comRes, instRes] = await Promise.all([
    fetch('http://localhost:5000/regiones'),
    fetch('http://localhost:5000/comunas'),
    fetch('http://localhost:5000/instalaciones')
  ])
  regiones.value = await regRes.json()
  comunas.value = await comRes.json()
  instalaciones.value = await instRes.json()
})

watch(() => form.value.instalacionId, (newId) => {
  if (form.value.tipo === 'reporte' && newId) {
    const inst = instalaciones.value.find(i => i._id === newId)
    form.value.comunaId = inst?.comunaId || ''
    form.value.regionId = inst?.regionId || ''
  }
})

const handleSubmit = async () => {
  error.value = ''
  success.value = ''
  // Validaciones
  if (!form.value.texto) {
    error.value = 'El texto es obligatorio.'
    return
  }
  if (form.value.tipo === 'reporte' && !form.value.instalacionId) {
    error.value = 'Debes seleccionar una instalación.'
    return
  }
  if (imagenFiles.value.length > 3) {
    error.value = 'Máximo 3 imágenes.'
    return
  }
  // Validar tamaño y formato
  for (const file of imagenFiles.value) {
    if (file.size > 2 * 1024 * 1024) {
      error.value = 'Cada imagen debe pesar máximo 2MB.'
      return
    }
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      error.value = 'Solo se permiten imágenes JPG o PNG.'
      return
    }
  }
  // Construir FormData
  const fd = new FormData()
  fd.append('tipo', form.value.tipo)
  fd.append('texto', form.value.texto)
  if (form.value.instalacionId) fd.append('instalacionId', form.value.instalacionId)
  if (form.value.comunaId) fd.append('comunaId', form.value.comunaId)
  if (form.value.regionId) fd.append('regionId', form.value.regionId)
  imagenFiles.value.forEach((file, idx) => fd.append('imagenes', file))
  const res = await fetch('http://localhost:5000/publicacion', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken.value}`
    },
    body: fd
  })
  const data = await res.json()
  if (!res.ok) {
    error.value = data.error || 'Error al publicar'
    return
  }
  success.value = '¡Publicación creada!'
  form.value.texto = ''
  form.value.instalacionId = ''
  form.value.comunaId = ''
  form.value.regionId = ''
  imagenFiles.value = []
}
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
