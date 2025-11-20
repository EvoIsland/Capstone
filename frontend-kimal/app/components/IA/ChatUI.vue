<template>
  <div class="chat-page-wrapper">
    
    <!-- Fondo decorativo ambiental -->
    <div class="bg-glow"></div>

    <!-- Contenedor Principal (Glassmorphism) -->
    <div class="chat-container glass-panel">
      
      <!-- SIDEBAR: HISTORIAL -->
      <aside :class="['chat-sidebar', { 'is-open': sidebarOpen }]">
        <div class="sidebar-header">
          <button class="new-chat-btn" @click="clearChat" :disabled="asking">
            <span class="plus-icon">+</span>
            <span>Nuevo Chat</span>
          </button>
          <!-- Botón cerrar en móvil -->
          <button class="close-sidebar-mobile" @click="sidebarOpen = false">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="history-content custom-scroll">
          <h3 class="section-title">Historial Reciente</h3>
          <div class="history-list">
            <a
              v-for="(msg, idx) in userMessages"
              :key="idx"
              href="#"
              :class="['history-item', { active: selectedMessage === idx }]"
              @click.prevent="scrollToMessage(idx)"
            >
              <svg class="item-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              <span class="item-text">{{ msg.content }}</span>
            </a>
            <div v-if="userMessages.length === 0" class="empty-history">
              No hay conversaciones previas.
            </div>
          </div>
        </div>
      </aside>

      <!-- Overlay para móvil -->
      <div class="sidebar-overlay" :class="{ show: sidebarOpen }" @click="sidebarOpen = false"></div>

      <!-- ÁREA PRINCIPAL DEL CHAT -->
      <main class="chat-main">
        
        <!-- Header del Chat -->
        <header class="chat-header">
          <div class="header-left">
            <button class="menu-toggle" @click="sidebarOpen = true">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
            
            <div class="bot-identity">
              <div class="bot-avatar-large">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div class="bot-info">
                <h1>Asistente Kimal</h1>
                <div class="status-badge">
                  <span class="status-dot"></span> En línea
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- Cuerpo de Mensajes -->
        <div class="messages-container custom-scroll" ref="scrollArea">
          
          <!-- Estado Vacío / Bienvenida -->
          <div v-if="showWelcome" class="welcome-screen">
            <div class="welcome-logo">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h2>¿En qué puedo ayudarte hoy?</h2>
            <p>Pregúntame sobre el estado de las líneas, reportes técnicos o noticias del proyecto.</p>
            
            <div class="suggestion-chips">
              <button class="chip" @click="input = 'Estado de la línea Kimal'; send()">⚡ Estado de línea</button>
              <button class="chip" @click="input = 'Explicame que es Conexiones Kimal'; send()">📝 Que es conexiones Kimal</button>
              <button class="chip" @click="input = 'Ver últimas noticias'; send()">📰 Noticias</button>
            </div>
          </div>

          <!-- Lista de Mensajes -->
          <div class="messages-list">
            <div
              v-for="(m, i) in visibleMessages"
              :key="i"
              :ref="el => { if (el) messageRefs[i] = el }"
              class="message-wrapper"
              :class="m.role === 'user' ? 'outgoing' : 'incoming'"
            >
              <!-- Avatar del Bot (solo en incoming) -->
              <div v-if="m.role !== 'user'" class="message-avatar">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>

              <div class="message-content">
                <div class="message-bubble">
                  {{ m.content }}
                </div>
              </div>
            </div>

            <!-- Indicador escribiendo -->
            <div v-if="asking" class="message-wrapper incoming typing">
              <div class="message-avatar">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div class="message-bubble typing-bubble">
                <span class="dot"></span><span class="dot"></span><span class="dot"></span>
              </div>
            </div>
          </div>

        </div>

        <!-- Footer: Input -->
        <footer class="chat-input-area">
          <div class="input-box">
            <input
              type="text"
              v-model="input"
              :disabled="asking"
              @keydown.enter="send"
              placeholder="Escribe tu mensaje aquí..."
              class="main-input"
            >
            <button class="send-btn" @click="send" :disabled="asking || !canSend">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
            </button>
          </div>
          <div class="disclaimer">
            La IA puede cometer errores. Verifica la información importante.
          </div>
        </footer>

      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick, ref, computed } from 'vue'
// Asegúrate que la ruta sea correcta según tu proyecto
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

const userMessages = computed(() => visibleMessages.value.filter(m => m.role === 'user'))

const autoScroll = () => nextTick(() => {
  if (scrollArea.value) {
    scrollArea.value.scrollTo({
      top: scrollArea.value.scrollHeight,
      behavior: 'smooth'
    })
  }
})

const send = async () => {
  if (!canSend.value) return
  const text = input.value.trim()
  input.value = ''
  // Pequeño hack para que la UI se sienta instantánea antes de procesar
  setTimeout(() => autoScroll(), 100) 
  await ask(text)
  autoScroll()
}

const clearChat = () => {
  clear()
  input.value = ''
  selectedMessage.value = null
  if (window.innerWidth <= 768) sidebarOpen.value = false
}

const scrollToMessage = (idx: number) => {
  selectedMessage.value = idx
  let userMsgCount = -1
  
  // Lógica para encontrar el índice real en la lista completa
  for (let i = 0; i < visibleMessages.value.length; i++) {
    const msg = visibleMessages.value[i]
    if (msg && msg.role === 'user') {
      userMsgCount++
      if (userMsgCount === idx) {
        const targetElement = messageRefs.value[i]
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
          // Efecto visual de resaltado
          targetElement.classList.add('highlight-message')
          setTimeout(() => targetElement.classList.remove('highlight-message'), 2000)
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

<style lang="scss" scoped>
// --- VARIABLES DE DISEÑO ---
$primary: #7c3aed;
$primary-gradient: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
$success: #10b981;
$text-main: #1f2937;
$text-light: #6b7280;
$bg-app: #f3f4f6;
$glass-bg: rgba(255, 255, 255, 0.85);
$border-light: rgba(255, 255, 255, 0.5);

/* --- CONTENEDOR GENERAL PAGINA --- */
.chat-page-wrapper {
  width: 100%;
  height: calc(100vh - 80px); // Ajuste por el navbar superior si existe
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: $bg-app;
  overflow: hidden;
}

// Fondo decorativo difuso
.bg-glow {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 100%; height: 100%;
  background: radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.05) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

/* --- CONTENEDOR CHAT (TARJETA GLASS) --- */
.chat-container {
  width: 100%;
  max-width: 1200px;
  height: 100%;
  max-height: 900px;
  display: flex;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.glass-panel {
  background: $glass-bg;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid white;
  border-radius: 24px;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.05);
}

/* --- SIDEBAR --- */
.chat-sidebar {
  width: 300px;
  background: rgba(255, 255, 255, 0.6);
  border-right: 1px solid $border-light;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  @media (max-width: 768px) {
    position: absolute;
    top: 0; left: 0; bottom: 0;
    z-index: 20;
    background: white;
    width: 80%;
    transform: translateX(-100%);
    
    &.is-open {
      transform: translateX(0);
      box-shadow: 10px 0 30px rgba(0,0,0,0.1);
    }
  }
}

.sidebar-header {
  padding: 1.5rem;
}

.new-chat-btn {
  width: 100%;
  padding: 12px;
  background: $primary-gradient;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(124, 58, 237, 0.3);
  }
  &:active { transform: translateY(0); }
  &:disabled { opacity: 0.7; cursor: not-allowed; }
}

.close-sidebar-mobile {
  display: none;
  @media (max-width: 768px) {
    display: block;
    position: absolute;
    top: 1rem; right: 1rem;
    background: none; border: none;
    color: $text-light;
  }
}

.history-content {
  flex: 1;
  padding: 0 1.5rem 1.5rem;
  overflow-y: auto;
}

.section-title {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: $text-light;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
  display: block;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  color: $text-main;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s;
  margin-bottom: 4px;
  
  .item-icon { color: $text-light; flex-shrink: 0; }
  .item-text { 
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.8);
    .item-icon { color: $primary; }
  }
  
  &.active {
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    font-weight: 600;
    color: $primary;
    .item-icon { color: $primary; }
  }
}

.empty-history {
  font-size: 0.85rem;
  color: $text-light;
  font-style: italic;
  padding: 10px;
  opacity: 0.7;
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid $border-light;
}

.user-mini-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  
  .avatar-circle {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: #e2e8f0;
    display: flex; align-items: center; justify-content: center;
    color: $text-light; font-weight: 700;
  }
  
  .user-details {
    display: flex; flex-direction: column;
    .name { font-size: 0.9rem; font-weight: 600; color: $text-main; }
    .role { font-size: 0.75rem; color: $text-light; }
  }
}

.sidebar-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 15;
  opacity: 0; pointer-events: none; transition: opacity 0.3s;
  &.show { opacity: 1; pointer-events: auto; }
  @media (min-width: 769px) { display: none; }
}


/* --- CHAT MAIN AREA --- */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.4);
  position: relative;
}

.chat-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid $border-light;
  display: flex; justify-content: space-between; align-items: center;
  
  .header-left { display: flex; align-items: center; gap: 1rem; }
  
  .menu-toggle {
    display: none;
    background: none; border: none; color: $text-main;
    @media (max-width: 768px) { display: block; }
  }
}

.bot-identity {
  display: flex; align-items: center; gap: 12px;
  
  .bot-avatar-large {
    width: 40px; height: 40px;
    background: white;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    color: $primary;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }
  
  .bot-info h1 { margin: 0; font-size: 1rem; font-weight: 700; color: $text-main; }
  
  .status-badge {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 0.75rem; color: $success; font-weight: 500;
    
    .status-dot { width: 6px; height: 6px; border-radius: 50%; background: $success; }
  }
}

/* --- MENSAJES --- */
.messages-container {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.welcome-screen {
  flex: 1;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center;
  color: $text-main;
  
  .welcome-logo {
    width: 64px; height: 64px;
    background: $primary-gradient;
    color: white;
    border-radius: 20px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1.5rem;
    box-shadow: 0 10px 30px rgba(124, 58, 237, 0.3);
  }
  
  h2 { font-size: 1.75rem; margin-bottom: 0.5rem; }
  p { color: $text-light; margin-bottom: 2rem; max-width: 400px; }
}

.suggestion-chips {
  display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;
  
  .chip {
    background: white; border: 1px solid $border-light;
    padding: 10px 16px; border-radius: 100px;
    font-size: 0.9rem; color: $text-main; cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(0,0,0,0.02);
    
    &:hover {
      border-color: $primary; color: $primary;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(124, 58, 237, 0.15);
    }
  }
}

.messages-list {
  display: flex; flex-direction: column; gap: 1.5rem;
}

.message-wrapper {
  display: flex; gap: 12px; max-width: 80%;
  
  &.incoming {
    align-self: flex-start;
    .message-avatar {
      width: 32px; height: 32px; border-radius: 10px;
      background: white; color: $primary;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    }
    .message-bubble {
      background: white; color: $text-main;
      border-top-left-radius: 4px;
    }
  }
  
  &.outgoing {
    align-self: flex-end;
    flex-direction: row-reverse;
    .message-bubble {
      background: $primary-gradient;
      color: white;
      border-top-right-radius: 4px;
      box-shadow: 0 4px 15px rgba(124, 58, 237, 0.2);
    }
  }
}

.message-bubble {
  padding: 14px 18px;
  border-radius: 18px;
  font-size: 0.95rem;
  line-height: 1.5;
  box-shadow: 0 2px 10px rgba(0,0,0,0.03);
}

/* Animación de resaltado para scrollToMessage */
.highlight-message .message-bubble {
  animation: highlightPulse 1.5s ease;
}
@keyframes highlightPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); box-shadow: 0 0 20px rgba(124, 58, 237, 0.3); }
}

/* Typing Indicator */
.typing-bubble {
  display: flex; align-items: center; gap: 4px; padding: 18px;
  .dot {
    width: 6px; height: 6px; background: $text-light; border-radius: 50%;
    animation: typing 1.4s infinite ease-in-out;
    &:nth-child(1) { animation-delay: 0s; }
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
}
@keyframes typing { 0%, 100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.2); opacity: 1; } }


/* --- INPUT FOOTER --- */
.chat-input-area {
  padding: 1.5rem 2rem;
  /* No background color para mantener el glass effect del main container */
}

.input-box {
  position: relative;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  border: 1px solid transparent;
  transition: border 0.2s;
  
  &:focus-within {
    border-color: $primary;
    box-shadow: 0 4px 20px rgba(124, 58, 237, 0.15);
  }
}

.main-input {
  width: 100%;
  padding: 16px 50px 16px 20px;
  border: none;
  background: transparent;
  font-size: 1rem;
  border-radius: 16px;
  outline: none;
  font-family: inherit;
}

.send-btn {
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  width: 36px; height: 36px;
  border-radius: 10px;
  background: $primary; color: white;
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
  
  &:hover:not(:disabled) { background: darken($primary, 5%); transform: translateY(-50%) scale(1.05); }
  &:disabled { opacity: 0.5; cursor: not-allowed; background: $text-light; }
}

.disclaimer {
  text-align: center; font-size: 0.75rem; color: $text-light;
  margin-top: 0.75rem; opacity: 0.8;
}

/* Scrollbar fino */
.custom-scroll {
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
  &::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
}
</style>