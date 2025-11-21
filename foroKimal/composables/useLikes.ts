import { ref } from 'vue'
import { fetchLikes, toggleLike } from '../services/likesService'

export function useLikes(publicacionId: string, token: string, userId: string) {
    const runtimeConfig = useRuntimeConfig()
    const apiUrl = runtimeConfig.public.apiUrl
    const likesTotal = ref(0)
    const likesUsuarios = ref<{ _id: string; nombre: string }[]>([])
    const userLiked = ref(false)

    async function cargarLikes() {
        const res = await fetchLikes(publicacionId, apiUrl, token)
        likesTotal.value = res.total
        likesUsuarios.value = res.usuarios
        userLiked.value = res.usuarios.some(u => u._id === userId)
    }

    async function darLike() {
        await toggleLike(publicacionId, apiUrl, token)
        await cargarLikes()
    }

    return { likesTotal, likesUsuarios, userLiked, cargarLikes, darLike }
}