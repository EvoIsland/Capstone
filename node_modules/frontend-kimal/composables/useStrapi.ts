export const useStrapi = () => {
  const config = useRuntimeConfig()
  
  const strapiUrl = config.public.strapiUrl
  const strapiApiUrl = config.public.strapiApiUrl
  
  // Función genérica para hacer peticiones a Strapi
  const strapiRequest = async (endpoint: string, options: any = {}) => {
    const url = `${strapiApiUrl}${endpoint}`
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(config.strapiToken && { 
          'Authorization': `Bearer ${config.strapiToken}` 
        })
      }
    }
    
    try {
      const response = await $fetch(url, {
        ...defaultOptions,
        ...options
      })
      return response
    } catch (error) {
      console.error('Error en la petición a Strapi:', error)
      throw error
    }
  }
  
  // Métodos específicos para diferentes tipos de peticiones
  const get = (endpoint: string, query: any = {}) => {
    return strapiRequest(endpoint, { 
      method: 'GET',
      query 
    })
  }
  
  const post = (endpoint: string, data: any) => {
    return strapiRequest(endpoint, {
      method: 'POST',
      body: data
    })
  }
  
  const put = (endpoint: string, data: any) => {
    return strapiRequest(endpoint, {
      method: 'PUT', 
      body: data
    })
  }
  
  const del = (endpoint: string) => {
    return strapiRequest(endpoint, {
      method: 'DELETE'
    })
  }
  
  // Métodos específicos para contenido común
  const getCollection = (collectionName: string, populate: string = '') => {
    const query = populate ? { populate } : {}
    return get(`/${collectionName}`, query)
  }
  
  const getSingle = (collectionName: string, id: string | number, populate: string = '') => {
    const query = populate ? { populate } : {}
    return get(`/${collectionName}/${id}`, query)
  }
  
  return {
    // URL base
    strapiUrl,
    strapiApiUrl,
    
    // Métodos básicos
    get,
    post,
    put,
    del,
    
    // Métodos específicos
    getCollection,
    getSingle,
    
    // Método genérico
    request: strapiRequest
  }
}