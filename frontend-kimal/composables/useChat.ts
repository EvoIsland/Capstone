// composables/useChat.ts
import { ref, watch, onMounted } from 'vue'
import { useState, useFetch } from '#app'

type Role = 'system' | 'user' | 'assistant'
type Msg = { role: Role; content: string }

const STORAGE_KEY = 'chat-history'

export const useChat = () => {
  // inicia desde vacío; lo llenamos desde localStorage en mounted
  const history = useState<Msg[]>('chat-history', () => [])

  const asking = ref(false)
  const errorMsg = ref<string | null>(null)

  // Restaurar al cargar (solo en cliente)
  onMounted(() => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Msg[]
        history.value = Array.isArray(parsed) ? parsed : []
      } catch {
        // si hay basura en storage, lo limpiamos
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  })

  // Guardar cada cambio (profundo)
  watch(
    history,
    (val) => {
      if (typeof window === 'undefined') return
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
      } catch {
        // storage lleno o bloqueado: opcionalmente manejar
      }
    },
    { deep: true, immediate: false }
  )

  const ask = async (prompt: string) => {
    if (!prompt?.trim()) return
    asking.value = true
    errorMsg.value = null
    history.value.push({ role: 'user', content: prompt })

    const { data, error } = await useFetch<{ reply: string }>('/api/chat', {
      method: 'POST',
      body: { messages: history.value }
    })

    if (error.value) {
      errorMsg.value = (error.value as any)?.message || 'Error al consultar la IA'
    } else {
      const reply = data.value?.reply || ''
      history.value.push({ role: 'assistant', content: reply })
    }

    asking.value = false
  }

  // Limpiar historial + storage (para tu botón "Limpiar")
  const clear = () => {
    history.value = []
    if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY)
  }

  return { history, ask, asking, errorMsg, clear }
}
