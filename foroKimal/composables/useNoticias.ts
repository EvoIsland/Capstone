import { ref } from 'vue'
import { fetchNoticias } from '../services/noticiasService'
import type { Noticia } from '../services/noticiasService'

export function useNoticias() {
    const runtimeConfig = useRuntimeConfig()
    const apiUrl = runtimeConfig.public.apiUrl
    const noticias = ref<Noticia[]>([])
    const cargandoNoticias = ref(true)
    const errorNoticias = ref('')

    async function cargarNoticias() {
        cargandoNoticias.value = true
        errorNoticias.value = ''
        try {
            noticias.value = await fetchNoticias(apiUrl)
        } catch (err) {
            errorNoticias.value = 'Error al cargar noticias'
        } finally {
            cargandoNoticias.value = false
        }
    }

    return {
        noticias,
        cargandoNoticias,
        errorNoticias,
        cargarNoticias
    }
}