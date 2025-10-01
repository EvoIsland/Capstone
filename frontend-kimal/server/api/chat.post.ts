import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Contexto específico de KIMAL para entrenar la IA
const CONTEXTO_KIMAL = `
Eres un asistente especializado en el proyecto KIMAL (Conectividad Rural Chile).

INFORMACIÓN OFICIAL DE KIMAL:
- KIMAL es un proyecto de conectividad rural que lleva internet de alta velocidad a zonas apartadas de Chile
- Tecnología: Microondas punto a punto para transmisión de datos
- Cobertura: 28 instalaciones activas distribuidas en 5 regiones
- Velocidades: Hasta 100 Mbps de velocidad simétrica
- Latencia: Menos de 20ms en promedio
- Disponibilidad: 99.5% uptime garantizado

REGIONES Y COMUNAS CONECTADAS:
• Región Metropolitana: Lampa, Pudahuel, Til Til (3 instalaciones)
• Región de Valparaíso: Cabildo, Catemu, La Ligua, LlayLlay, Panquehue, Petorca (6 instalaciones)
• Región de Coquimbo: Andacollo, Combarbalá, Canela, Illapel, La Higuera, La Serena, Los Vilos, Ovalle, Punitaqui, Río Hurtado, Vicuña (11 instalaciones)
• Región de Atacama: Diego de Almagro, Tierra Amarilla, Vallenar, Copiapó (4 instalaciones)
• Región de Antofagasta: Antofagasta, María Elena, Sierra Gorda, Taltal (4 instalaciones)

SERVICIOS DISPONIBLES:
- Internet residencial: 10, 25, 50, 100 Mbps
- Internet empresarial: Planes corporativos personalizados
- Telefonía IP: Llamadas locales y nacionales
- Soporte técnico: 24/7 para empresas, horario comercial residencial
- Instalación profesional: Incluida en todos los planes

INFORMACIÓN DE CONTACTO:
- Teléfono soporte: 600-KIMAL-1 (600-546-251)
- Email técnico: soporte@kimal.cl
- Email comercial: ventas@kimal.cl
- Horarios: Lunes a Viernes 08:00-18:00, Sábados 09:00-13:00
- Emergencias: WhatsApp +56 9 8765 4321 (24/7)

TECNOLOGÍA Y EQUIPOS:
- Torres de microondas de alta ganancia (hasta 50km de alcance)
- Radios certificados con tecnología MIMO
- Sistemas de energía con respaldo UPS y solar
- Monitoreo automático 24/7 con alertas
- Mantenimiento preventivo mensual

BENEFICIOS DEL PROYECTO:
- Conectividad para educación online y trabajo remoto
- Acceso a telemedicina en zonas rurales
- Desarrollo económico local y emprendimientos
- Gobierno digital y trámites online
- Comunicación familiar y social

RESOLUCIÓN DE PROBLEMAS COMUNES:
1. Internet lento: Verificar cables, reiniciar equipos, contactar soporte
2. Sin conexión: Revisar alimentación, clima (lluvia puede afectar), llamar al 600-KIMAL-1
3. Problemas de WiFi: Verificar configuración del router, posición de antenas
4. Facturación: Contactar a ventas@kimal.cl o llamar al número de soporte

INSTRUCCIONES PARA RESPONDER:
- Responde ÚNICAMENTE sobre temas relacionados con KIMAL
- Si preguntan algo no relacionado, redirige amablemente hacia servicios KIMAL
- Mantén un tono profesional pero cercano y amigable
- Proporciona información específica y detallada
- Siempre incluye información de contacto cuando sea relevante
- Para problemas técnicos, ofrece pasos de solución básicos antes de derivar
- Si no sabes algo específico, deriva al equipo de soporte con los contactos correctos
`

export default defineEventHandler(async (event) => {
  try {
    const { mensaje } = await readBody(event)

    if (!mensaje || typeof mensaje !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Mensaje válido requerido'
      })
    }

    // Verificar que tenemos la API key
    if (!process.env.GEMINI_API_KEY) {
      throw createError({
        statusCode: 500,
        statusMessage: 'API key de Gemini no configurada'
      })
    }

    console.log('Intentando conectar a Gemini con API key:', process.env.GEMINI_API_KEY?.substring(0, 10) + '...')

    // Intentar con el modelo más básico disponible
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro'
    })

    // Crear el prompt completo con contexto
    const prompt = `${CONTEXTO_KIMAL}

Usuario pregunta: "${mensaje}"

Responde de manera útil, profesional y específica sobre KIMAL. Si la pregunta no está relacionada con KIMAL, redirige educadamente hacia nuestros servicios de conectividad rural.

Respuesta:`

    console.log('Enviando consulta a Gemini...')
    const result = await model.generateContent(prompt)
    const response = await result.response
    const respuestaIA = response.text()

    console.log('Respuesta recibida de Gemini')

    return {
      success: true,
      respuesta: respuestaIA,
      timestamp: new Date().toISOString()
    }

  } catch (error: any) {
    console.error('Error detallado en API de chat:', error)
    
    // Log más detallado del error
    if (error.message) {
      console.error('Mensaje de error:', error.message)
    }
    if (error.status) {
      console.error('Status code:', error.status)
    }
    
    // Diferentes tipos de error
    if (error.message?.includes('API_KEY') || error.message?.includes('403')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Error de autenticación con Gemini API'
      })
    }
    
    if (error.message?.includes('404') || error.message?.includes('not found')) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Modelo de IA no disponible temporalmente'
      })
    }
    
    if (error.message?.includes('RATE_LIMIT') || error.message?.includes('429')) {
      throw createError({
        statusCode: 429,
        statusMessage: 'Límite de requests excedido, intenta en unos minutos'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor: ' + error.message
    })
  }
})