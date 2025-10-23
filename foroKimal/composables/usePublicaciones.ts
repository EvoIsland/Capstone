import { ref } from 'vue'
import { fetchPublicaciones } from '../services/publicacionesService'
import type { Publicacion } from '../services/publicacionesService'

export function usePublicaciones() {
    const publicaciones = ref<Publicacion[]>([])
    const cargandoPublicaciones = ref(true)
    const errorPublicaciones = ref('')

    async function cargarPublicaciones() {
        cargandoPublicaciones.value = true
        errorPublicaciones.value = ''
        try {
            publicaciones.value = await fetchPublicaciones()
        } catch (err) {
            errorPublicaciones.value = 'Error al cargar publicaciones'
        } finally {
            cargandoPublicaciones.value = false
        }
    }

    return {
        publicaciones,
        cargandoPublicaciones,
        errorPublicaciones,
        cargarPublicaciones
    }
}