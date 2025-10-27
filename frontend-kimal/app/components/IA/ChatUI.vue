<template>
  <div class="chat">
    <header class="chat__header">
      <h1>Asistente IA – Conexión Kimal</h1>
      <button class="btn btn--ghost" @click="clearChat" :disabled="asking">Limpiar</button>
    </header>

    <main class="chat__messages" ref="scrollArea">
      <!-- mensaje de bienvenida -->
      <div v-if="showWelcome" class="bubble bubble--bot">
        <span class="bubble__role">agenteKimal</span>
        <p class="bubble__text">Hola, soy el asistente del proyecto Conexión Kimal. ¿En qué puedo ayudarte?</p>
      </div>

      <!-- historial -->
      <div
        v-for="(m, i) in visibleMessages"
        :key="i"
        class="bubble"
        :class="m.role === 'user' ? 'bubble--user' : 'bubble--bot'"
      >
        <span class="bubble__role">{{ m.role === 'assistant' ? 'agenteKimal' : 'Tú' }}</span>
        <p class="bubble__text">{{ m.content }}</p>
      </div>

      <div v-if="asking" class="typing">
        <span class="dot"></span><span class="dot"></span><span class="dot"></span>
      </div>
    </main>

    <!-- INPUT BAR -->
    <footer class="chat__input">
      <div class="inputBar">
        <textarea
          class="ta"
          v-model="input"
          :disabled="asking"
          @keydown.enter.exact.prevent="send"
          @keydown.enter.shift.exact="newline"
          placeholder="Escribe tu mensaje… (Enter para enviar, Shift+Enter para salto)"
          rows="1"
          ref="ta"
          spellcheck="false"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          data-gramm="false"
          data-gramm_editor="false"
          :style="{
            color: '#FFFFFF',
            caretColor: '#FFFFFF',
            boxShadow: 'none',
            WebkitAppearance: 'none',
            appearance: 'none'
          }"
        />
        <button class="btn btn--send" @click="send" :disabled="asking || !canSend" aria-label="Enviar">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon-plane" viewBox="0 0 24 24" fill="none">
            <path d="M4 12L20 4L13.5 20L11.5 13.5L4 12Z"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick, ref, computed } from 'vue'
import { useChat } from '../../../composables/useChat'

const { history, ask, asking, clear } = useChat()
const input = ref('')
const scrollArea = ref<HTMLElement | null>(null)
const ta = ref<HTMLTextAreaElement | null>(null)

const visibleMessages = computed(() => history.value.filter(m => m.role !== 'system'))
const showWelcome = computed(() => visibleMessages.value.length === 0)
const canSend = computed(() => input.value.trim().length > 0)

const autoScroll = () => nextTick(() => {
  if (scrollArea.value) scrollArea.value.scrollTop = scrollArea.value.scrollHeight
})

const autoResize = () => {
  if (!ta.value) return
  ta.value.style.height = 'auto'
  ta.value.style.height = Math.min(ta.value.scrollHeight, 160) + 'px'
}

const send = async () => {
  if (!canSend.value) return
  const text = input.value.trim()
  input.value = ''
  autoResize()
  await ask(text)
  autoScroll()
}

const newline = () => {
  input.value += '\n'
  autoResize()
}

const clearChat = () => {
  clear()
  input.value = ''
  autoResize()
  autoScroll()
}

onMounted(() => {
  autoScroll()
  autoResize()
})
</script>

<style scoped lang="scss">
:root {
  --bg: #0b1220;
  --panel: #121a2b;
  --muted: #94a3b8;
  --text: #e5e7eb;
  --brand: #7F2BFF;
  --brand-weak: #6a22e0;
  --bot: #1f2937;
  --user: #194cfa;
  --border: #202a40;
}

/* Layout general */
.chat {
  height: 100vh;
  background: linear-gradient(180deg, var(--bg), #0a1020 40%, #0a0f1c 100%);
  color: var(--text);
  display: grid;
  grid-template-rows: auto 1fr auto;
}

.chat__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background: var(--panel);
  border-bottom: 1px solid var(--border);

  h1 {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
    letter-spacing: .2px;
  }
}

.chat__messages {
  padding: 18px 16px 140px; /* espacio para la barra fija */
  overflow: auto;
}

/* Burbujas */
.bubble {
  max-width: 72ch;
  padding: 10px 12px;
  border-radius: 12px;
  margin: 10px 0;
  line-height: 1.35;
  border: 1px solid var(--border);
  box-shadow: 0 2px 10px rgba(0,0,0,.15);
}
.bubble--bot   {
  background: #ffffff !important;
  color: #111827 !important;
  border: 1px solid #e5e7eb !important;
}
.bubble--user  {
  background: #7F2BFF !important;
  color: #fff !important;
  margin-left: auto;
  border: none !important;
}

.bubble__role { color: rgba(0,0,0,.45) !important; }
.bubble--user .bubble__role { color: #ffffff !important; }
.bubble__text { white-space: pre-wrap; }

/* typing */
.typing { display: inline-flex; gap: 6px; padding: 10px 0; }
.dot { width: 6px; height: 6px; border-radius: 50%; background: var(--muted); animation: bounce 1s infinite; }
.dot:nth-child(2){ animation-delay: .15s }
.dot:nth-child(3){ animation-delay: .3s }
@keyframes bounce { 0%,80%,100%{transform:translateY(0);opacity:.4} 40%{transform:translateY(-4px);opacity:1} }

/* Barra de input fija */
.chat__input {
  position: fixed;
  left: 12px;
  right: 12px;
  bottom: 12px;
  padding: 0;
  z-index: 50;
}

/* Contenedor del textarea + botón */
.inputBar {
  display: grid;
  grid-template-columns: 1fr 50px;       /* textarea | botón */
  align-items: center;
  background: var(--brand);
  border-radius: 14px;
  padding: 10px;                         /* respiro interno (mínimo) */
  box-shadow: 0 8px 30px rgba(127,43,255,.35);
  overflow: hidden;                      /* nada sale de los bordes redondeados */
  box-sizing: border-box;
}

/* Textarea */
.ta {
  background-color: rgba(127,43,255,.35); /* mantengo tu visual actual */
  color: #fff !important;
  border: none;
  resize: none;
  outline: none;
  padding: 12px 14px;
  font-size: 14px;
  line-height: 1.35;
  width: 100%;
  box-sizing: border-box;
}
.ta::placeholder { color: rgba(255,255,255,0.9) !important; }
.ta:focus { outline: 2px solid rgba(255,255,255,0.35); }

/* Botones */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform .12s ease, box-shadow .12s ease, background .12s ease, opacity .12s ease;
  border: none;
}
.btn:disabled { opacity: .55; cursor: not-allowed; }

.btn--send {
  justify-self: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #ffffff;                   /* blanco sólido */
  color: var(--brand);
  border: none;
  box-shadow: 0 2px 6px rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn--send:hover { background: #f5f5f5; }
.btn--ghost { background: transparent; border: 1px solid var(--border); color: var(--text); }
.btn--ghost:hover { border-color: var(--brand-weak); color: #cbd5e1; }

.icon-plane {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: var(--brand);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
