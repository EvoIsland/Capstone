import OpenAI from 'openai'
import fs from 'node:fs'
import path from 'node:path'

type Role = 'system' | 'user' | 'assistant'
type Msg = { role: Role; content: string }

const CONTEXT_PATH = path.join(process.cwd(), 'data', 'kimal_context.txt')

// cache en memoria
let OFFICIAL_CONTEXT = ''
if (fs.existsSync(CONTEXT_PATH)) {
  try {
    OFFICIAL_CONTEXT = fs.readFileSync(CONTEXT_PATH, 'utf8')
  } catch (e) {
    console.warn('⚠️ Error leyendo data/kimal_context.txt:', e)
  }
} else {
  console.warn('⚠️ No se encontró data/kimal_context.txt. Ejecuta: npm run fetch:official')
}

export default defineEventHandler(async (event) => {
  const body = await readBody<{ messages: Msg[] }>(event)
  const messages = body?.messages ?? []

  const guard = `Eres un asistente del proyecto Conexión Kimal (línea de transmisión HVDC Kimal–Lo Aguirre en Chile).
Responde exclusivamente con base en el CONTEXTO OFICIAL. 
Si la pregunta no está cubierta por el CONTEXTO OFICIAL o no es relevante al proyecto, responde: "No dispongo de esa información en las fuentes oficiales del proyecto."
Responde de forma breve, directa y sin formato.`

  const contextBlock = `CONTEXTO OFICIAL (texto extraído de conexionenergia.com):
${OFFICIAL_CONTEXT || '(vacío: ejecuta npm run fetch:official para cargar contenido)'}`

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

  const completion = await client.chat.completions.create({
    model: 'gpt-4.1-mini',
    temperature: 0.3,
    max_tokens: 120,
    messages: [
      { role: 'system', content: guard },
      { role: 'system', content: contextBlock },
      // preserva solo user/assistant del historial
      ...messages.filter(m => m.role !== 'system')
    ]
  })

  const reply = completion.choices?.[0]?.message?.content?.trim() || ''
  return { reply }
})
