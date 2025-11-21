export interface Usuario {
  _id: string
  nombre: string
  apellido: string
  correo: string
  rol: 'usuario' | 'admin'
  recibirCartas: boolean
  puebloOriginario: boolean
  nombrePueblo?: string
  direccion?: string
  verificado: boolean
  tokenVerificacion?: string
  createdAt: string
  updatedAt: string
}

export async function fetchUsuarios(apiUrl: string, token: string): Promise<Usuario[]> {
  const res = await fetch(`${apiUrl}/admin/usuarios`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('No se pudieron obtener usuarios')
  return await res.json()
}

export async function crearUsuario(apiUrl: string, data: Partial<Usuario>, token: string): Promise<Usuario> {
  const res = await fetch(`${apiUrl}/admin/usuarios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('No se pudo crear el usuario')
  return await res.json()
}

export async function actualizarUsuario(apiUrl: string, id: string, data: Partial<Usuario>, token: string): Promise<Usuario> {
  const res = await fetch(`${apiUrl}/admin/usuarios/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('No se pudo actualizar el usuario')
  return await res.json()
}

export async function eliminarUsuario(apiUrl: string, id: string, token: string): Promise<{ success: boolean }> {
  const res = await fetch(`${apiUrl}/admin/usuarios/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('No se pudo eliminar el usuario')
  return await res.json()
}