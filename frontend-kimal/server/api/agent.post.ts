// server/api/agent.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import { ofetch } from 'ofetch'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { text } = await readBody<{ text?: string }>(event)

  if (!text || !text.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Missing text' })
  }

  // Ya viene la URL completa al TEST webhook desde .env (incluye /webhook-test/kimal/ask)
  const endpoint = config.n8nUrl as string
  const agentKey = (config.agentKey || '').trim()

  try {
    const result = await ofetch<{ response?: string }>(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(agentKey ? { 'X-AGENT-KEY': agentKey } : {}),
      },
      body: { text },
    })

    return { ok: true, message: result?.response ?? '' }
  } catch (err) {
    console.error('Agent call error:', err)
    throw createError({ statusCode: 502, statusMessage: 'Agent upstream error' })
  }
})
