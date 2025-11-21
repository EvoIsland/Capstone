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

export async function fetchInstalaciones(apiUrl: string, token: string): Promise<Instalacion[]> {
  const res = await fetch(`${apiUrl}/admin/instalaciones`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('No se pudieron obtener instalaciones')
  return await res.json()
}

export async function crearInstalacion(apiUrl: string, data: Partial<Instalacion>, token: string): Promise<Instalacion> {
  const res = await fetch(`${apiUrl}/admin/instalaciones`, {
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

export async function actualizarInstalacion(apiUrl: string, id: string, data: Partial<Instalacion>, token: string): Promise<Instalacion> {
  const res = await fetch(`${apiUrl}/admin/instalaciones/${id}`, {
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

export async function eliminarInstalacion(apiUrl: string, id: string, token: string): Promise<{ success: boolean }> {
  const res = await fetch(`${apiUrl}/admin/instalaciones/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('No se pudo eliminar la instalación')
  return await res.json()
}