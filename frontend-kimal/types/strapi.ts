// Tipos para la API de Strapi
export interface StrapiResponse<T = any> {
  data: T
  meta: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface StrapiSingleResponse<T = any> {
  data: T
}

export interface StrapiError {
  error: {
    status: number
    name: string
    message: string
    details?: any
  }
}

// Tipos básicos de contenido de Strapi
export interface StrapiAttributes {
  id: number
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

// Ejemplo de tipos para tus content-types específicos
export interface Article extends StrapiAttributes {
  title: string
  content: string
  slug: string
  image?: {
    data: {
      id: number
      attributes: {
        name: string
        url: string
        alternativeText?: string
      }
    }
  }
}

export interface User extends StrapiAttributes {
  username: string
  email: string
  confirmed: boolean
  blocked: boolean
}