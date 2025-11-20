const API_URL = process.env.NUXT_PUBLIC_API_URL || 'http://localhost:5000'

export interface LikesResponse {
    total: number
    usuarios: { _id: string; nombre: string}[]
}

export async function fetchLikes(publicacionId: string, token?: string) {
    return await $fetch< {
        total: number; 
        usuarios: {_id: string; nombre: string }[]
    }>(
        `${API_URL}/publicacion/${publicacionId}/likes`,
        token
        ? { headers: {Authorization: `Bearer ${token}`} }
        : undefined
    )
}

export async function toggleLike(publicacionId: string, token: string) {
    return await $fetch(
        `${API_URL}/publicacion/${publicacionId}/like`,
        {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`}
        }
    )
}