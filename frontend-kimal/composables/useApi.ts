export const useApi = () => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.apiUrl

  // Función genérica para hacer peticiones al backend
  const apiRequest = async (endpoint: string, options: any = {}) => {
    const url = `${apiUrl}${endpoint}`
    
    try {
      const response = await $fetch(url, {
        ...options
      })
      return response
    } catch (error) {
      console.error('Error en la petición al backend:', error)
      throw error
    }
  }

  // Métodos específicos para diferentes tipos de peticiones
  const get = (endpoint: string, query: any = {}) => {
    return apiRequest(endpoint, { 
      method: 'GET',
      query 
    })
  }

  const post = (endpoint: string, data: any) => {
    return apiRequest(endpoint, {
      method: 'POST',
      body: data
    })
  }

  const put = (endpoint: string, data: any) => {
    return apiRequest(endpoint, {
      method: 'PUT', 
      body: data
    })
  }

  const del = (endpoint: string) => {
    return apiRequest(endpoint, {
      method: 'DELETE'
    })
  }

  return {
    // URL base
    apiUrl,
    
    // Métodos básicos
    get,
    post,
    put,
    del,
    
    // Método genérico
    request: apiRequest
  }
}
