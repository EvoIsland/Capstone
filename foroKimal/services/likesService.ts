export interface LikesResponse {
    total: number
    usuarios: { _id: string; nombre: string}[]
}

export async function fetchLikes(publicacionId: string, apiUrl: string, token?: string) {
    return await $fetch< {
        total: number; 
        usuarios: {_id: string; nombre: string }[]
    }>(
        `${apiUrl}/publicacion/${publicacionId}/likes`,
        token
        ? { headers: {Authorization: `Bearer ${token}`} }
        : undefined
    )
}

export async function toggleLike(publicacionId: string, apiUrl: string, token: string) {
    return await $fetch(
        `${apiUrl}/publicacion/${publicacionId}/like`,
        {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`}
        }
    )
}