<!-- filepath: c:\proyectos\Capstone\foroKimal\app\pages\admin\usuariosAdmin.vue -->
<template>
  <div>
    <h2>Administrar Usuarios</h2>

    <div v-if="loading">Cargando usuarios...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <table v-if="usuarios.length">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Correo</th>
          <th>Rol</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="usuario in usuarios" :key="usuario._id">
          <td>{{ usuario.nombre }}</td>
          <td>{{ usuario.apellido }}</td>
          <td>{{ usuario.correo }}</td>
          <td>{{ usuario.rol }}</td>
          <td>
            <button @click="editarUsuario(usuario)">Editar</button>
            <button @click="eliminar(usuario._id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <h3>Crear usuario</h3>
    <form @submit.prevent="crearNuevoUsuario">
      <input v-model="nuevoUsuario.nombre" placeholder="Nombre" required />
      <input v-model="nuevoUsuario.apellido" placeholder="Apellido" required />
      <input v-model="nuevoUsuario.correo" placeholder="Correo" required />
      <select v-model="nuevoUsuario.rol">
        <option value="usuario">Usuario</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Crear</button>
    </form>

    <div v-if="editando">
      <h3>Editar usuario</h3>
      <form @submit.prevent="actualizarUsuario">
        <input v-model="usuarioEditado.nombre" placeholder="Nombre" required />
        <input v-model="usuarioEditado.apellido" placeholder="Apellido" required />
        <input v-model="usuarioEditado.correo" placeholder="Correo" required />
        <select v-model="usuarioEditado.rol">
          <option value="usuario">Usuario</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Actualizar</button>
        <button type="button" @click="cancelarEdicion">Cancelar</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUsuariosAdmin } from '../../../composables/admin/useUsuariosAdmin'
import { useAuth } from '../../../composables/useAuth'

const { accessToken } = useAuth()
const {
  usuarios,
  loading,
  error,
  cargarUsuarios,
  crear,
  actualizar,
  eliminar
} = useUsuariosAdmin(accessToken.value)

const nuevoUsuario = ref({
  nombre: '',
  apellido: '',
  correo: '',
  rol: 'usuario'
})

const editando = ref(false)
const usuarioEditado = ref({
  _id: '',
  nombre: '',
  apellido: '',
  correo: '',
  rol: 'usuario'
})

const crearNuevoUsuario = async () => {
  await crear(nuevoUsuario.value)
  nuevoUsuario.value = { nombre: '', apellido: '', correo: '', rol: 'usuario' }
}

const editarUsuario = (usuario: any) => {
  editando.value = true
  usuarioEditado.value = { ...usuario }
}

const actualizarUsuario = async () => {
  await actualizar(usuarioEditado.value._id, usuarioEditado.value)
  editando.value = false
  usuarioEditado.value = { _id: '', nombre: '', apellido: '', correo: '', rol: 'usuario' }
}

const cancelarEdicion = () => {
  editando.value = false
  usuarioEditado.value = { _id: '', nombre: '', apellido: '', correo: '', rol: 'usuario' }
}

onMounted(cargarUsuarios)
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