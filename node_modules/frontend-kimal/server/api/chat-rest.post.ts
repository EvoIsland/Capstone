export default defineEventHandler(async (event) => {
  try {
    const { mensaje } = await readBody(event)

    if (!mensaje || typeof mensaje !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Mensaje válido requerido'
      })
    }

    const API_KEY = process.env.GEMINI_API_KEY
    if (!API_KEY) {
      throw createError({
        statusCode: 500,
        statusMessage: 'API key de Gemini no configurada'
      })
    }

    // Contexto específico de KIMAL
    const contextoKimal = `
Eres un asistente especializado en el proyecto KIMAL (Conectividad Rural Chile).

INFORMACIÓN OFICIAL DE KIMAL:
- KIMAL es un proyecto de conectividad rural que lleva internet de alta velocidad a zonas apartadas de Chile
- Tecnología: Microondas punto a punto para transmisión de datos
- Cobertura: 28 instalaciones activas distribuidas en 5 regiones
- Velocidades: Hasta 100 Mbps de velocidad simétrica
- Contacto: 600-KIMAL-1, soporte@kimal.cl

REGIONES CONECTADAS:
• Región Metropolitana: Lampa, Pudahuel, Til Til (3 instalaciones)
• Región de Valparaíso: Cabildo, Catemu, La Ligua, LlayLlay, Panquehue, Petorca (6 instalaciones)
• Región de Coquimbo: Andacollo, Combarbalá, Canela, Illapel, La Higuera, La Serena, Los Vilos, Ovalle, Punitaqui, Río Hurtado, Vicuña (11 instalaciones)
• Región de Atacama: Diego de Almagro, Tierra Amarilla, Vallenar, Copiapó (4 instalaciones)
• Región de Antofagasta: Antofagasta, María Elena, Sierra Gorda, Taltal (4 instalaciones)

Responde ÚNICAMENTE sobre temas relacionados con KIMAL. Mantén un tono profesional pero amigable.
`

    const prompt = `${contextoKimal}\n\nUsuario pregunta: "${mensaje}"\n\nRespuesta:`

    // Usar text-bison que está disponible en la mayoría de API keys
    const url = `https://generativelanguage.googleapis.com/v1beta/models/text-bison-001:generateText?key=${API_KEY}`
    
    const requestBody = {
      prompt: {
        text: prompt
      },
      temperature: 0.7,
      candidateCount: 1,
      maxOutputTokens: 1024,
    }

    console.log('Enviando request a Gemini API REST...')
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Error de Gemini API:', response.status, errorData)
      throw new Error(`API Error: ${response.status} - ${errorData}`)
    }

    const data = await response.json()
    console.log('Respuesta recibida de Gemini')

    if (data.candidates && data.candidates[0] && data.candidates[0].output) {
      const respuestaIA = data.candidates[0].output

      return {
        success: true,
        respuesta: respuestaIA,
        timestamp: new Date().toISOString()
      }
    } else {
      console.error('Estructura de respuesta inesperada:', JSON.stringify(data, null, 2))
      throw new Error('Respuesta inválida de Gemini')
    }

  } catch (error: any) {
    console.error('Error detallado en API de chat:', error)
    
    if (error.message?.includes('403')) {
      throw createError({
        statusCode: 403,
        statusMessage: 'API key inválida o sin permisos'
      })
    }
    
    if (error.message?.includes('404')) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Modelo no encontrado'
      })
    }
    
    if (error.message?.includes('429')) {
      throw createError({
        statusCode: 429,
        statusMessage: 'Límite de requests excedido'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno: ' + error.message
    })
  }
})