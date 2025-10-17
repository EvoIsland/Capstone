import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export default defineEventHandler(async (event) => {
  try {
    console.log('API Key disponible:', !!process.env.GEMINI_API_KEY)
    
    // Listar modelos disponibles
    const models = await genAI.listModels()
    
    console.log('Modelos disponibles:', models)
    
    return {
      success: true,
      modelos: models.map(model => ({
        name: model.name,
        displayName: model.displayName,
        description: model.description,
        supportedGenerationMethods: model.supportedGenerationMethods
      }))
    }

  } catch (error: any) {
    console.error('Error listando modelos:', error)
    
    return {
      success: false,
      error: error.message,
      hasApiKey: !!process.env.GEMINI_API_KEY
    }
  }
})