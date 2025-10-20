import { useLocalStorage } from '@vueuse/core'

interface User {
  id: string
  nombre: string
  apellido: string
  correo: string
  rol: 'usuario' | 'admin';
}

interface AuthResponse {
  accessToken: string
  user: User
}

export const useAuth = () => {

  const user = useState<User | null>('user', () => null)
  const accessToken = useLocalStorage('accessToken', '')
  const loading = useState('auth-loading', () => false)
  const error = useState<string | null>('auth error', () => null)

  const API_URL = 'http://localhost:5000'

  const router = useRouter();

  const register = async (userData: {
    nombre: string
    apellido: string
    correo: string
    contraseña: string
    recibirCartas?: boolean
    puebloOriginario: boolean
    nombrePueblo?: string
    direccion?: string
  }) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include' // Importante para las cookies
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error en el registro')
      }

      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error en el registro'
      return false
    } finally {
      loading.value = false
    }
  }

  const login = async (credentials: { correo: string; contraseña: string }) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include'
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error en el inicio de sesión')
      }

      const data = await response.json()

      console.log('DATOS RECIBIDOS DEL LOGIN: ', data)

      user.value = data.user
      accessToken.value = data.token


      if (data.user.rol === 'admin') {
        await router.push('/admin/crear-noticia')
      } else {
        await router.push('/foroMain')
      }
        return true
      } catch (e) {
        error.value = e instanceof Error ? e.message : 'Error en el inicio de sesion'
        console.error('error en el login:' ,e)
        return false
      } finally {
        loading.value = false
      }
  }

  const logout = async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken.value}`
        },
        credentials: 'include'
      })

      user.value = null
      accessToken.value = ''
    } catch (e) {
      console.error('Error en el cierre de sesión:', e)
    }
  }

  const refreshToken = async () => {
    try {
      const response = await fetch(`${API_URL}/refresh-token`, {
        method: 'POST',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Error al renovar el token')
      }

      const data = await response.json()
      accessToken.value = data.accessToken
    } catch (e) {
      console.error('Error al renovar el token:', e)
      // Si falla la renovación, cerrar sesión
      logout()
    }
  }


  const getProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/profile`, {
        headers: {
          'Authorization': `Bearer ${accessToken.value}`
        },
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Error al obtener el perfil')
      }

      const data = await response.json()
      user.value = data.user
    } catch (e) {
      console.error('Error al obtener el perfil:', e)
    }
  }


  const fetchWithToken = async (url: string, options: RequestInit = {}) => {
    if (accessToken.value) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken.value}`
      }
    }

    let response = await fetch(url, options)

    // Si recibimos un 401, intentamos renovar el token
    if (response.status === 401) {
      await refreshToken()
      // Reintentamos la petición original con el nuevo token
      if (accessToken.value) {
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${accessToken.value}`
        }
        response = await fetch(url, options)
      }
    }

    return response
  }

  return {
    user,
    loading,
    error,
    accessToken,
    register,
    login,
    logout,
    getProfile,
    fetchWithToken,
    isAuthenticated: () => !!accessToken.value
  }
}
