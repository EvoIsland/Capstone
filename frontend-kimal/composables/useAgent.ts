// composables/useAgent.ts
import { ref } from 'vue'

export function useAgent() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function askAgent(text: string) {
    if (!text?.trim()) return ''
    loading.value = true
    error.value = null
    try {
      const resp = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })
      const json = await resp.json().catch(() => ({}))
      return (json as any)?.response ?? ''
    } catch (e) {
      error.value = 'Error al contactar al agente.'
      return ''
    } finally {
      loading.value = false
    }
  }

  return { loading, error, askAgent }
}
