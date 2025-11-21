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

export async function fetchPublicaciones(apiUrl: string): Promise<Publicacion[]> {
    const res = await fetch(`${apiUrl}/publicaciones`)
    if (!res.ok) throw new Error('No se pudieron obtener publicaciones')
    return await res.json()
}