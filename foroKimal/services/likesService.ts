export interface LikesResponse {
    total: number
    usuarios: { _id: string; nombre: string}[]
}

export async function fetchLikes(publicacionId: string, token?: string) {
    return await $fetch< {
        total: number; 
        usuarios: {_id: string; nombre: string }[]
    }>(
        `http://localhost:5000/publicacion/${publicacionId}/likes`,
        token
        ? { headers: {Authorization: `Bearer ${token}`} }
        : undefined
    )
}

export async function toggleLike(publicacionId: string, token: string) {
    return await $fetch(
        `http://localhost:5000/publicacion/${publicacionId}/like`,
        {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`}
        }
    )
}