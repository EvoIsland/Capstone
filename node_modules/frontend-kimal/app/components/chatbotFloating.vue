<template>
    <div class="chatbot-wrapper">
        <!-- Botón flotante -->
        <button 
            v-if="!mostrarChat"
            @click="abrirChat"
            class="chat-button"
            :class="{ 'with-notification': hayNotificacion }"
        >
            <img src="/images/logokimal.svg" alt="Chat KIMAL" class="chat-icon" />
            <div v-if="hayNotificacion" class="notification-dot"></div>
            <span class="chat-tooltip">¿Necesitas ayuda?</span>
        </button>

        <!-- Chatbot -->
        <Transition name="chat">
            <ChatbotKimal 
                v-if="mostrarChat"
                @cerrar="cerrarChat"
            />
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ChatbotKimal from './chatbotKimal.vue'

const mostrarChat = ref(false)
const hayNotificacion = ref(false)

function abrirChat() {
    mostrarChat.value = true
    hayNotificacion.value = false
}

function cerrarChat() {
    mostrarChat.value = false
}

// Mostrar notificación después de un tiempo (simulando que hay ayuda disponible)
onMounted(() => {
    setTimeout(() => {
        if (!mostrarChat.value) {
            hayNotificacion.value = true
        }
    }, 10000) // 10 segundos
})
</script>

<style lang="sass" scoped>
.chatbot-wrapper
    position: fixed
    bottom: 0
    right: 0
    z-index: 1500

.chat-button
    position: fixed
    bottom: 20px
    right: 20px
    width: 64px
    height: 64px
    background: linear-gradient(135deg, #10B981 0%, #059669 100%)
    border: none
    border-radius: 50%
    cursor: pointer
    box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4)
    transition: all 0.3s ease
    display: flex
    align-items: center
    justify-content: center
    overflow: visible

    &:hover
        transform: scale(1.1)
        box-shadow: 0 6px 25px rgba(16, 185, 129, 0.6)

        .chat-tooltip
            opacity: 1
            visibility: visible

    &.with-notification
        animation: pulse 2s infinite

.chat-icon
    width: 32px
    height: 32px
    filter: brightness(0) invert(1)

.notification-dot
    position: absolute
    top: 8px
    right: 8px
    width: 12px
    height: 12px
    background: #ef4444
    border-radius: 50%
    border: 2px solid white
    animation: pulse-dot 2s infinite

.chat-tooltip
    position: absolute
    right: 80px
    top: 50%
    transform: translateY(-50%)
    background: #374151
    color: white
    padding: 0.5rem 0.75rem
    border-radius: 0.5rem
    font-size: 0.8rem
    white-space: nowrap
    opacity: 0
    visibility: hidden
    transition: all 0.3s ease

    &::after
        content: ''
        position: absolute
        right: -8px
        top: 50%
        transform: translateY(-50%)
        width: 0
        height: 0
        border-left: 8px solid #374151
        border-top: 8px solid transparent
        border-bottom: 8px solid transparent

// Animaciones
@keyframes pulse
    0%
        box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4)
    50%
        box-shadow: 0 4px 20px rgba(16, 185, 129, 0.8), 0 0 0 10px rgba(16, 185, 129, 0.1)
    100%
        box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4)

@keyframes pulse-dot
    0%
        transform: scale(1)
    50%
        transform: scale(1.2)
    100%
        transform: scale(1)

// Transiciones del chat
.chat-enter-active
    transition: all 0.3s ease

.chat-leave-active
    transition: all 0.3s ease

.chat-enter-from
    opacity: 0
    transform: translateY(20px) scale(0.9)

.chat-leave-to
    opacity: 0
    transform: translateY(20px) scale(0.9)

// Responsive
@media screen and (max-width: 768px)
    .chat-button
        bottom: 15px
        right: 15px
        width: 56px
        height: 56px

    .chat-icon
        width: 28px
        height: 28px

    .chat-tooltip
        display: none
</style>