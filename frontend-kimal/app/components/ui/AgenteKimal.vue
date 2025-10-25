<template>
  <div class="agent-card">
    <div class="agent-header">
      <strong>AgenteKimal</strong>
      <small>IA del proyecto Kimal-Lo Aguirre</small>
    </div>

    <div class="agent-messages" ref="list">
      <div v-for="m in items" :key="m.id" :class="['msg', m.role]">
        <div class="bubble" v-html="m.text"></div>
      </div>
      <div v-if="loading" class="msg assistant">
        <div class="bubble">Escribiendo…</div>
      </div>
    </div>

    <div class="agent-input">
      <input
        v-model="text"
        @keyup.enter="send"
        placeholder="Pregúntale al AgenteKimal…"
      />
      <button :disabled="!text.trim() || loading" @click="send">Enviar</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue'
import { useAgent } from '../../../composables/useAgent'

const props = defineProps<{ initialQuestion?: string }>()
type Row = { id: number; role: 'user' | 'assistant'; text: string }

const { askAgent } = useAgent()
const items = ref<Row[]>([])
const text = ref('')
const loading = ref(false)
const list = ref<HTMLElement | null>(null)
let id = 0

function push(role: Row['role'], msg: string) {
  items.value.push({ id: ++id, role, text: msg })
  nextTick(() => { if (list.value) list.value.scrollTop = list.value.scrollHeight })
}

async function send() {
  if (!text.value.trim() || loading.value) return
  const q = text.value.trim()
  text.value = ''
  push('user', q)
  loading.value = true
  try {
    const a = await askAgent(q)
    push('assistant', a || 'Sin respuesta.')
  } catch {
    push('assistant', 'Hubo un problema al contactar al agente. Intenta nuevamente.')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  push('assistant', '¡Hola! Soy AgenteKimal. Respondo únicamente sobre Kimal-Lo Aguirre.')
  if (props.initialQuestion?.trim()) {
    text.value = props.initialQuestion
    await send()
  }
})
</script>

<style scoped>
.agent-card{border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;background:#fff}
.agent-header{padding:.75rem 1rem;border-bottom:1px solid #eee;background:#f8fafc}
.agent-messages{max-height:280px;overflow:auto;padding:10px;display:flex;flex-direction:column;gap:8px}
.msg{display:flex}
.msg.user{justify-content:flex-end}
.bubble{max-width:80%;padding:.5rem .75rem;border-radius:12px;background:#f3f4f6}
.msg.user .bubble{background:#10B981;color:#fff}
.agent-input{display:flex;gap:.5rem;padding:.75rem;border-top:1px solid #eee}
.agent-input input{flex:1;padding:.5rem .75rem;border:1px solid #e5e7eb;border-radius:8px}
.agent-input button{background:#10B981;color:#fff;border:none;padding:.5rem .9rem;border-radius:8px;cursor:pointer}
.agent-input button:disabled{opacity:.6;cursor:not-allowed}
</style>
