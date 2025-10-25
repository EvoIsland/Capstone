// composables/useAgent.ts
import { ref } from 'vue'

export function useAgent() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const answer = ref<string>('')

  async function askAgent(question: string): Promise<string> {
    error.value = null
    answer.value = ''
    if (!question?.trim()) {
      error.value = 'Pregunta vacía.'
      return ''
    }
    loading.value = true
    try {
      const res = await $fetch<{ ok?: boolean; message?: string }>('/api/agent', {
        method: 'POST',
        body: { text: question },
      })
      const msg = res?.message ?? ''
      answer.value = msg
      return msg
    } catch (err) {
      error.value = 'Error al conectar con el agente.'
      console.error('useAgent askAgent error:', err)
      return ''
    } finally {
      loading.value = false
    }
  }

  return { loading, error, answer, askAgent }
}
