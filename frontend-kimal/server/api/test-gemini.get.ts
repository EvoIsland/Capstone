export default defineEventHandler(async (event) => {
  try {
    const API_KEY = process.env.GEMINI_API_KEY
    
    if (!API_KEY) {
      return {
        success: false,
        error: 'No API key configurada'
      }
    }

    // Test con texto básico que debería estar disponible
    const url = `https://generativelanguage.googleapis.com/v1beta/models/text-bison-001:generateText?key=${API_KEY}`
    
    const requestBody = {
      prompt: {
        text: "Hola, responde brevemente"
      },
      temperature: 0.7,
      candidateCount: 1
    }

    console.log('Testing API key con URL:', url.replace(API_KEY, 'API_KEY_HIDDEN'))
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    const data = await response.text()
    
    console.log('Response status:', response.status)
    console.log('Response data:', data)

    return {
      success: response.ok,
      status: response.status,
      data: data,
      hasApiKey: !!API_KEY,
      apiKeyLength: API_KEY.length
    }

  } catch (error: any) {
    console.error('Error testing API:', error)
    
    return {
      success: false,
      error: error.message,
      hasApiKey: !!process.env.GEMINI_API_KEY
    }
  }
})