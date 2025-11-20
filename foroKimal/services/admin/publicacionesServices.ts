export interface Publicacion {
    _id: string
    texto: string
    tipo: 'pregunta' | 'reporte' | 'noticia'
    imagenes?:  string[]
    comunaId: string[]
    regionId: string[]
    likes?: string[]
    fecha?: string[]
    publicadorId?: string
}

const API_URL = process.env.NUXT_PUBLIC_API_URL || 'http://localhost:5000'

export async function fetchPublicaciones(token: string): Promise<Publicacion[]> {
  const res = await fetch(`${API_URL}/admin/publicaciones`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('No se pudieron obtener publicaciones')
  return await res.json()
}

export async function eliminarPublicacion(id: string, token: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_URL}/admin/publicaciones/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('No se pudo eliminar la publicación')
  return await res.json()
}

// Opcional: crear y editar publicaciones
export async function crearPublicacion(data: Partial<Publicacion>, token: string): Promise<Publicacion> {
  const res = await fetch(`${API_URL}/admin/publicaciones`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('No se pudo crear la publicación')
  return await res.json()
}

export async function actualizarPublicacion(id: string, data: Partial<Publicacion>, token: string): Promise<Publicacion> {
  const res = await fetch(`${API_URL}/admin/publicaciones/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('No se pudo actualizar la publicación')
  return await res.json()
}