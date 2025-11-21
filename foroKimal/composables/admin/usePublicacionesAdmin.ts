import { ref } from 'vue'
import {
  fetchPublicaciones,
  eliminarPublicacion,
  crearPublicacion,
  actualizarPublicacion,
  Publicacion
} from '../../services/admin/publicacionesServices'

export function usePublicacionesAdmin(token: string) {
  const runtimeConfig = useRuntimeConfig()
  const apiUrl = runtimeConfig.public.apiUrl
  const publicaciones = ref<Publicacion[]>([])
  const loading = ref(false)
  const error = ref('')

  const cargarPublicaciones = async () => {
    loading.value = true
    error.value = ''
    try {
      publicaciones.value = await fetchPublicaciones(apiUrl, token)
    } catch (e: any) {
      error.value = e.message || 'Error al cargar publicaciones'
    } finally {
      loading.value = false
    }
  }

  const eliminar = async (id: string) => {
    loading.value = true
    error.value = ''
    try {
      await eliminarPublicacion(apiUrl, id, token)
      await cargarPublicaciones()
    } catch (e: any) {
      error.value = e.message || 'Error al eliminar publicación'
    } finally {
      loading.value = false
    }
  }

  const crear = async (data: Partial<Publicacion>) => {
    loading.value = true
    error.value = ''
    try {
      await crearPublicacion(apiUrl, data, token)
      await cargarPublicaciones()
    } catch (e: any) {
      error.value = e.message || 'Error al crear publicación'
    } finally {
      loading.value = false
    }
  }

  const actualizar = async (id: string, data: Partial<Publicacion>) => {
    loading.value = true
    error.value = ''
    try {
      await actualizarPublicacion(apiUrl, id, data, token)
      await cargarPublicaciones()
    } catch (e: any) {
      error.value = e.message || 'Error al actualizar publicación'
    } finally {
      loading.value = false
    }
  }

  return {
    publicaciones,
    loading,
    error,
    cargarPublicaciones,
    eliminar,
    crear,
    actualizar
  }
}