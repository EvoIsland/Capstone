export interface Instalacion {
  _id: string
  nombre: string
  direccion: string
  comunaId: string
  regionId: string
  location: {
    type: 'Point'
    coordinates: [number, number]
  }
}

const API_URL = process.env.NUXT_PUBLIC_API_URL || 'http://localhost:5000'

export async function fetchInstalaciones(token: string): Promise<Instalacion[]> {
  const res = await fetch(`${API_URL}/admin/instalaciones`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('No se pudieron obtener instalaciones')
  return await res.json()
}

export async function crearInstalacion(data: Partial<Instalacion>, token: string): Promise<Instalacion> {
  const res = await fetch(`${API_URL}/admin/instalaciones`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('No se pudo crear la instalación')
  return await res.json()
}

export async function actualizarInstalacion(id: string, data: Partial<Instalacion>, token: string): Promise<Instalacion> {
  const res = await fetch(`${API_URL}/admin/instalaciones/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('No se pudo actualizar la instalación')
  return await res.json()
}

export async function eliminarInstalacion(id: string, token: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_URL}/admin/instalaciones/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('No se pudo eliminar la instalación')
  return await res.json()
}