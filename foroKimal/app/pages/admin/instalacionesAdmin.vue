<!-- filepath: c:\proyectos\Capstone\foroKimal\app\pages\admin\instalacionesAdmin.vue -->
<template>
  <div>
    <h2>Administrar Instalaciones</h2>

    <div v-if="loading">Cargando instalaciones...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <table v-if="instalaciones.length">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Dirección</th>
          <th>Comuna</th>
          <th>Región</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="inst in instalaciones" :key="inst._id">
          <td>{{ inst.nombre }}</td>
          <td>{{ inst.direccion }}</td>
          <td>{{ inst.comunaId }}</td>
          <td>{{ inst.regionId }}</td>
          <td>
            <button @click="editarInstalacion(inst)">Editar</button>
            <button @click="eliminar(inst._id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <h3>Crear instalación</h3>
    <form @submit.prevent="crearNuevaInstalacion">
      <input v-model="nuevaInstalacion.nombre" placeholder="Nombre" required />
      <input v-model="nuevaInstalacion.direccion" placeholder="Dirección" required />
      <input v-model="nuevaInstalacion.comunaId" placeholder="Comuna ID" required />
      <input v-model="nuevaInstalacion.regionId" placeholder="Región ID" required />
      <input v-model.number="nuevaInstalacion.location.coordinates[0]" placeholder="Longitud" required />
      <input v-model.number="nuevaInstalacion.location.coordinates[1]" placeholder="Latitud" required />
      <button type="submit">Crear</button>
    </form>

    <div v-if="editando">
      <h3>Editar instalación</h3>
      <form @submit.prevent="actualizarInstalacion">
        <input v-model="instalacionEditada.nombre" placeholder="Nombre" required />
        <input v-model="instalacionEditada.direccion" placeholder="Dirección" required />
        <input v-model="instalacionEditada.comunaId" placeholder="Comuna ID" required />
        <input v-model="instalacionEditada.regionId" placeholder="Región ID" required />
        <input v-model.number="instalacionEditada.location.coordinates[0]" placeholder="Longitud" required />
        <input v-model.number="instalacionEditada.location.coordinates[1]" placeholder="Latitud" required />
        <button type="submit">Actualizar</button>
        <button type="button" @click="cancelarEdicion">Cancelar</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useInstalacionesAdmin } from '../../../composables/admin/useInstalacionesAdmin'
import { useAuth } from '../../../composables/useAuth'

const { accessToken } = useAuth()
const {
  instalaciones,
  loading,
  error,
  cargarInstalaciones,
  crear,
  actualizar,
  eliminar
} = useInstalacionesAdmin(accessToken.value)

const nuevaInstalacion = ref({
  nombre: '',
  direccion: '',
  comunaId: '',
  regionId: '',
  location: {
    type: 'Point',
    coordinates: [0, 0]
  }
})

const editando = ref(false)
const instalacionEditada = ref({
  _id: '',
  nombre: '',
  direccion: '',
  comunaId: '',
  regionId: '',
  location: {
    type: 'Point',
    coordinates: [0, 0]
  }
})

const crearNuevaInstalacion = async () => {
  await crear(nuevaInstalacion.value)
  nuevaInstalacion.value = {
    nombre: '',
    direccion: '',
    comunaId: '',
    regionId: '',
    location: { type: 'Point', coordinates: [0, 0] }
  }
}

const editarInstalacion = (inst: any) => {
  editando.value = true
  instalacionEditada.value = { ...inst }
}

const actualizarInstalacion = async () => {
  await actualizar(instalacionEditada.value._id, instalacionEditada.value)
  editando.value = false
  instalacionEditada.value = {
    _id: '',
    nombre: '',
    direccion: '',
    comunaId: '',
    regionId: '',
    location: { type: 'Point', coordinates: [0, 0] }
  }
}

const cancelarEdicion = () => {
  editando.value = false
  instalacionEditada.value = {
    _id: '',
    nombre: '',
    direccion: '',
    comunaId: '',
    regionId: '',
    location: { type: 'Point', coordinates: [0, 0] }
  }
}

onMounted(cargarInstalaciones)
</script>

<style scoped>
.error {
  color: red;
  margin-bottom: 1rem;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
}
th, td {
  border: 1px solid #ccc;
  padding: 0.5rem;
  text-align: left;
}
form {
  margin-bottom: 2rem;
}
button {
  margin-right: 0.5rem;
}
</style>