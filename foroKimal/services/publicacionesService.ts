const API_URL = process.env.NUXT_PUBLIC_API_URL || 'http://localhost:5000'

export interface Publicacion {
    _id: string
    tipo: string
    texto: string
    fecha: string
    imagenes?: string[]
    instalacionId?: { nombre: string }
    comunaId?: { nombre: string}
    regionId?: {nombre: string}
    publicadorId?: { nombre?:string }
}

export async function fetchPublicaciones(): Promise<Publicacion[]> {
    const res = await fetch(`${API_URL}/publicaciones`)
    if (!res.ok) throw new Error('No se pudieron obtener publicaciones')
    return await res.json()
}