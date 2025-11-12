import { ref } from 'vue'
import {
  fetchInstalaciones,
  crearInstalacion,
  actualizarInstalacion,
  eliminarInstalacion,
  Instalacion
} from '../../services/admin/instalacionesService'

export function useInstalacionesAdmin(token: string) {
  const instalaciones = ref<Instalacion[]>([])
  const loading = ref(false)
  const error = ref('')

  const cargarInstalaciones = async () => {
    loading.value = true
    error.value = ''
    try {
      instalaciones.value = await fetchInstalaciones(token)
    } catch (e: any) {
      error.value = e.message || 'Error al cargar instalaciones'
    } finally {
      loading.value = false
    }
  }

  const crear = async (data: Partial<Instalacion>) => {
    loading.value = true
    error.value = ''
    try {
      await crearInstalacion(data, token)
      await cargarInstalaciones()
    } catch (e: any) {
      error.value = e.message || 'Error al crear instalación'
    } finally {
      loading.value = false
    }
  }

  const actualizar = async (id: string, data: Partial<Instalacion>) => {
    loading.value = true
    error.value = ''
    try {
      await actualizarInstalacion(id, data, token)
      await cargarInstalaciones()
    } catch (e: any) {
      error.value = e.message || 'Error al actualizar instalación'
    } finally {
      loading.value = false
    }
  }

  const eliminar = async (id: string) => {
    loading.value = true
    error.value = ''
    try {
      await eliminarInstalacion(id, token)
      await cargarInstalaciones()
    } catch (e: any) {
      error.value = e.message || 'Error al eliminar instalación'
    } finally {
      loading.value = false
    }
  }

  return {
    instalaciones,
    loading,
    error,
    cargarInstalaciones,
    crear,
    actualizar,
    eliminar
  }
}