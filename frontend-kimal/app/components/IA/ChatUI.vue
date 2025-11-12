<template>
  <div class="app-layout">
    <!-- Sidebar: Historial de Conversaciones -->
    <aside :class="['sidebar', { open: sidebarOpen }]" id="sidebar">
      <div class="sidebar-header">
        <button class="new-chat-btn" @click="clearChat" :disabled="asking">+ Nuevo Chat</button>
      </div>
      
      <h3>Conversación Actual</h3>
      
      <nav class="chat-history-list" id="chat-history-list">
        <a
          v-for="(msg, idx) in userMessages"
          :key="idx"
          href="#"
          :class="['history-item', { active: selectedMessage === idx }]"
          @click.prevent="scrollToMessage(idx)"
        >
          {{ msg.content }}
        </a>
      </nav>
    </aside>

    <!-- Overlay para cerrar el menú en móvil -->
    <div :class="['sidebar-overlay', { open: sidebarOpen }]" @click="sidebarOpen = false"></div>

    <!-- Contenido Principal: Chat -->
    <main class="main-content">
      <div class="chat-widget">
        <!-- Header del Chat -->
        <header class="chat-header">
          <!-- Botón de Menú (Hamburguesa) -->
          <button class="menu-toggle" @click="sidebarOpen = !sidebarOpen">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>

          <!-- Avatar del Bot -->
          <div class="header-avatar">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
            </svg>
          </div>
          
          <!-- Nombre y Estado -->
          <div class="header-info">
            <h1>KimalBot</h1>
            <div class="header-status">
              <span class="status-dot"></span>
              <span class="status-text">En línea</span>
            </div>
          </div>
        </header>

        <!-- Cuerpo del Chat -->
        <main class="chat-body" ref="scrollArea">
          <!-- Mensaje de bienvenida -->
          <div v-if="showWelcome" class="message-row bot">
            <div class="message-bubble bot">
              ¡Hola! Soy KimalBot. ¿En qué puedo ayudarte hoy? ✨
            </div>
          </div>

          <!-- Historial de mensajes -->
          <div
            v-for="(m, i) in visibleMessages"
            :key="i"
            :ref="el => { if (el) messageRefs[i] = el }"
            class="message-row"
            :class="m.role === 'user' ? 'user' : 'bot'"
          >
            <div class="message-bubble" :class="m.role === 'user' ? 'user' : 'bot'">
              {{ m.content }}
            </div>
          </div>

          <!-- Indicador de escritura -->
          <div v-if="asking" class="message-row bot">
            <div class="message-bubble bot">
              <div class="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        </main>

        <!-- Respuestas rápidas -->
        <div class="quick-replies" id="quick-replies"></div>

        <!-- Barra de Entrada -->
        <footer class="chat-footer">
          <input
            type="text"
            v-model="input"
            :disabled="asking"
            @keydown.enter="send"
            placeholder="Escribe un mensaje..."
            class="chat-input"
          >
          <button class="send-button" @click="send" :disabled="asking || !canSend">
            <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </footer>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick, ref, computed } from 'vue'
import { useChat } from '../../../composables/useChat'

const { history, ask, asking, clear } = useChat()
const input = ref('')
const scrollArea = ref<HTMLElement | null>(null)
const sidebarOpen = ref(false)
const selectedMessage = ref<number | null>(null)
const messageRefs = ref<any[]>([])

const visibleMessages = computed(() => history.value.filter(m => m.role !== 'system'))
const showWelcome = computed(() => visibleMessages.value.length === 0)
const canSend = computed(() => input.value.trim().length > 0)

// Obtener solo los mensajes del usuario para el historial
const userMessages = computed(() => visibleMessages.value.filter(m => m.role === 'user'))

const autoScroll = () => nextTick(() => {
  if (scrollArea.value) scrollArea.value.scrollTop = scrollArea.value.scrollHeight
})

const send = async () => {
  if (!canSend.value) return
  const text = input.value.trim()
  input.value = ''
  await ask(text)
  autoScroll()
}

const clearChat = () => {
  clear()
  input.value = ''
  selectedMessage.value = null
  autoScroll()
  if (window.innerWidth <= 768) sidebarOpen.value = false
}

const scrollToMessage = (idx: number) => {
  selectedMessage.value = idx
  let userMsgCount = -1
  for (let i = 0; i < visibleMessages.value.length; i++) {
    const msg = visibleMessages.value[i]
    if (msg && msg.role === 'user') {
      userMsgCount++
      if (userMsgCount === idx) {
        const targetElement = messageRefs.value[i]
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
          targetElement.style.transition = 'background-color 0.5s ease'
          targetElement.style.backgroundColor = '#e8e0f3'
          setTimeout(() => { targetElement.style.backgroundColor = '' }, 1500)
        }
        break
      }
    }
  }
  if (window.innerWidth <= 768) sidebarOpen.value = false
}

onMounted(() => {
  autoScroll()
})
</script>

<style lang="scss">
/* --- Definición de Colores y Fuentes --- */
:root {
  --morado-suave: #7E57C2;
  --verde-menta: #26A69A;
  --blanco-lavanda: #F7F3FF;
  --gris-oscuro: #333333;
  --gris-medio: #5E5E5E;
  --fondo-app: #f0f4f8;
  --sombra: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --sombra-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* --- Reseteo Básico --- */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* --- Estilo de Fuente Principal --- */
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  line-height: 1.5;
  background-color: var(--fondo-app);
  overflow: hidden; /* Evita el scroll de la página entera */
}

/* --- 1. Contenedor Principal (Estilo Gemini) --- */
.app-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
}

/* --- 2. Barra Lateral (Historial) --- */
.sidebar {
  width: 260px;
  background-color: var(--blanco-lavanda);
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  transition: transform 0.3s ease;
  z-index: 100;
}
 
.sidebar-header { margin-bottom: 1rem; }

.new-chat-btn {
  background-color: var(--verde-menta);
  color: white;
  border: none;
  padding: 0.75rem;
  width: 100%;
  border-radius: 9999px;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  transition: transform 0.1s ease;
}
.new-chat-btn:hover { transform: scale(1.02); }
.new-chat-btn:active { transform: scale(0.98); }

.sidebar h3 {
  font-size: 0.875rem;
  color: var(--gris-medio);
  margin-bottom: 0.5rem;
  padding: 0 0.5rem;
}

.chat-history-list {
  display: flex;
  flex-direction: column; /* Se llenará de arriba hacia abajo */
  gap: 0.25rem;
  overflow-y: auto;
  flex: 1;
}
 
.history-item {
  padding: 0.6rem 0.75rem;
  border-radius: 0.5rem;
  text-decoration: none;
  color: var(--gris-oscuro);
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.history-item:hover { background-color: #e8e0f3; }
.history-item.active { background-color: var(--morado-suave); color: white; }
 
/* --- 3. Contenido Principal (Chat) --- */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  /* Padding para centrar el widget en escritorio */
  padding: 1rem; 
}

/* Botón de Menú para Móvil (Hamburguesa) */
.menu-toggle {
  display: none; /* Oculto en escritorio */
  position: absolute;
  top: 1.25rem;
  left: 1rem;
  z-index: 50;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  width: 40px;
  height: 40px;
}
.menu-toggle svg { width: 24px; height: 24px; }

/* Overlay para cerrar el menú en móvil */
.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 99;
}
.sidebar-overlay.open { display: block; }


/* --- 4. Widget de Chat (Adaptado) --- */
.chat-widget {
  background-color: white;
  width: 100%;
  /* Centrado y con ancho máximo en escritorio */
  max-width: 800px; 
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  box-shadow: var(--sombra-lg);
  border-radius: 0.5rem;
  overflow: hidden;
}

/* --- 4a. Encabezado del Chat --- */
.chat-header {
  background-color: var(--morado-suave);
  color: white;
  padding: 1rem;
  display: flex;
  align-items: center;
  /* Espacio a la izquierda para el botón de menú en móvil */
  padding-left: 4rem; 
  gap: 0.75rem;
  box-shadow: var(--sombra);
  z-index: 10;
  position: relative; /* Para el botón de menú */
}

.header-avatar {
  width: 48px;
  height: 48px;
  border-radius: 9999px;
  background: linear-gradient(to bottom, var(--morado-suave), var(--verde-menta));
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.header-avatar svg { width: 24px; height: 24px; opacity: 0.9; }
 
.header-info h1 { font-size: 1.125rem; font-weight: 700; }
.header-status { display: flex; align-items: center; gap: 0.375rem; }
.status-dot {
  width: 10px;
  height: 10px;
  background-color: var(--verde-menta);
  border-radius: 9999px;
  border: 2px solid rgba(255, 255, 255, 0.5);
}
.status-text { font-size: 0.875rem; opacity: 0.9; }

/* --- 4b. Cuerpo del Chat --- */
.chat-body {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  background-color: var(--blanco-lavanda);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
 
.message-row { display: flex; }
.message-row.user { justify-content: flex-end; }
.message-row.bot { justify-content: flex-start; }
 
.message-bubble {
  padding: 0.75rem 1rem;
  max-width: 80%;
  box-shadow: var(--sombra);
  word-wrap: break-word;
}
.message-bubble.bot {
  background-color: var(--morado-suave);
  color: white;
  border-radius: 1rem;
  border-top-left-radius: 0.25rem;
}
.message-bubble.user {
  background-color: white;
  color: var(--gris-oscuro);
  border: 1px solid #f0f0f0;
  border-radius: 1rem;
  border-top-right-radius: 0.25rem;
}

/* --- 4c. Respuestas Rápidas --- */
.quick-replies {
  padding: 0.5rem;
  background-color: var(--blanco-lavanda);
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 0.5rem;
  white-space: nowrap;
  overflow-x: auto;
}
.quick-reply-btn {
  background-color: var(--verde-menta);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: transform 0.1s ease;
}
.quick-reply-btn:hover { transform: scale(1.05); }

/* --- 4d. Barra de Entrada (Footer) --- */
.chat-footer {
  background-color: white;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-top: 1px solid #e5e7eb;
}
.chat-input {
  flex: 1;
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 9999px;
  outline: none;
  color: var(--gris-oscuro);
  font-size: 1rem;
}
.chat-input:focus {
  border-color: var(--morado-suave);
  box-shadow: 0 0 0 2px rgba(126, 87, 194, 0.3);
}
.send-button {
  background-color: var(--verde-menta);
  color: white;
  width: 40px; height: 40px;
  border-radius: 9999px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--sombra-lg);
  border: none;
  cursor: pointer;
  transition: transform 0.1s ease;
}
.send-button:hover { transform: scale(1.1); }
.send-button svg { width: 20px; height: 20px; margin-right: -1px; }

/* --- Estilo de la Barra de Scroll --- */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #f1f1f1; }
::-webkit-scrollbar-thumb {
  background: #c7b8da;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover { background: #b3a2c9; }
 
/* --- 5. Responsividad para Móviles (<= 768px) --- */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0; top: 0;
    height: 100%;
    /* Oculto por defecto */
    transform: translateX(-100%); 
    box-shadow: var(--sombra-lg);
  }
  .sidebar.open { transform: translateX(0); }

  .main-content { padding: 0; /* Sin padding en móvil */ }

  .chat-widget {
    height: 100vh; /* Pantalla completa */
    max-width: 100%;
    border-radius: 0;
  }

  .menu-toggle { display: block; /* Mostrar botón de menú */ }

  .chat-header {
    /* Reducir el padding izquierdo en móvil para que el avatar no se monte */
    padding-left: 4.5rem; 
  }
}
</style>
