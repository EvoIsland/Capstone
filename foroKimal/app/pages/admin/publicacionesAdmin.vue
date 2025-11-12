<!-- filepath: c:\proyectos\Capstone\foroKimal\app\pages\admin\publicacionesAdmin.vue -->
<template>
  <div>
    <h2>Administrar Publicaciones</h2>

    <div v-if="loading">Cargando publicaciones...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <table v-if="publicaciones.length">
      <thead>
        <tr>
          <th>Texto</th>
          <th>Tipo</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pub in publicaciones" :key="pub._id">
          <td>{{ pub.texto }}</td>
          <td>{{ pub.tipo }}</td>
          <td>{{ pub.fecha ? new Date(pub.fecha).toLocaleString() : '-' }}</td>
          <td>
            <button @click="editarPublicacion(pub)">Editar</button>
            <button @click="eliminar(pub._id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <h3>Crear publicación</h3>
    <form @submit.prevent="crearNuevaPublicacion">
      <input v-model="nuevaPublicacion.texto" placeholder="Texto" required />
      <select v-model="nuevaPublicacion.tipo">
        <option value="pregunta">Pregunta</option>
        <option value="reporte">Reporte</option>
        <option value="noticia">Noticia</option>
      </select>
      <button type="submit">Crear</button>
    </form>

    <div v-if="editando">
      <h3>Editar publicación</h3>
      <form @submit.prevent="actualizarPublicacion">
        <input v-model="publicacionEditada.texto" placeholder="Texto" required />
        <select v-model="publicacionEditada.tipo">
          <option value="pregunta">Pregunta</option>
          <option value="reporte">Reporte</option>
          <option value="noticia">Noticia</option>
        </select>
        <button type="submit">Actualizar</button>
        <button type="button" @click="cancelarEdicion">Cancelar</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePublicacionesAdmin } from '../../../composables/admin/usePublicacionesAdmin'
import { useAuth } from '../../../composables/useAuth'

const { accessToken } = useAuth()
const {
  publicaciones,
  loading,
  error,
  cargarPublicaciones,
  crear,
  actualizar,
  eliminar
} = usePublicacionesAdmin(accessToken.value)

const nuevaPublicacion = ref({
  texto: '',
  tipo: 'pregunta'
})

const editando = ref(false)
const publicacionEditada = ref({
  _id: '',
  texto: '',
  tipo: 'pregunta'
})

const crearNuevaPublicacion = async () => {
  await crear(nuevaPublicacion.value)
  nuevaPublicacion.value = { texto: '', tipo: 'pregunta' }
}

const editarPublicacion = (pub: any) => {
  editando.value = true
  publicacionEditada.value = { ...pub }
}

const actualizarPublicacion = async () => {
  await actualizar(publicacionEditada.value._id, publicacionEditada.value)
  editando.value = false
  publicacionEditada.value = { _id: '', texto: '', tipo: 'pregunta' }
}

const cancelarEdicion = () => {
  editando.value = false
  publicacionEditada.value = { _id: '', texto: '', tipo: 'pregunta' }
}

onMounted(cargarPublicaciones)
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