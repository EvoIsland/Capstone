import { ref } from 'vue'
import {
  fetchUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  Usuario
} from '../../services/admin/usuarioServices'

export function useUsuariosAdmin(token: string) {
  const runtimeConfig = useRuntimeConfig()
  const apiUrl = runtimeConfig.public.apiUrl
  const usuarios = ref<Usuario[]>([])
  const loading = ref(false)
  const error = ref('')

  const cargarUsuarios = async () => {
    loading.value = true
    error.value = ''
    try {
      usuarios.value = await fetchUsuarios(apiUrl, token)
    } catch (e: any) {
      error.value = e.message || 'Error al cargar usuarios'
    } finally {
      loading.value = false
    }
  }

  const crear = async (data: Partial<Usuario>) => {
    loading.value = true
    error.value = ''
    try {
      await crearUsuario(apiUrl, data, token)
      await cargarUsuarios()
    } catch (e: any) {
      error.value = e.message || 'Error al crear usuario'
    } finally {
      loading.value = false
    }
  }

  const actualizar = async (id: string, data: Partial<Usuario>) => {
    loading.value = true
    error.value = ''
    try {
      await actualizarUsuario(apiUrl, id, data, token)
      await cargarUsuarios()
    } catch (e: any) {
      error.value = e.message || 'Error al actualizar usuario'
    } finally {
      loading.value = false
    }
  }

  const eliminar = async (id: string) => {
    loading.value = true
    error.value = ''
    try {
      await eliminarUsuario(apiUrl, id, token)
      await cargarUsuarios()
    } catch (e: any) {
      error.value = e.message || 'Error al eliminar usuario'
    } finally {
      loading.value = false
    }
  }

  return {
    usuarios,
    loading,
    error,
    cargarUsuarios,
    crear,
    actualizar,
    eliminar
  }
}