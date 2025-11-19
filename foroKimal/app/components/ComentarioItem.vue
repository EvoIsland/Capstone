<template>
  <div class="comment-container">
    
    <!-- Fila del Comentario Principal -->
    <div class="comment-row">
      <!-- Avatar -->
      <div class="avatar-col">
        <div class="avatar">
          {{ comentario.usuarioId?.nombre?.[0]?.toUpperCase() || 'U' }}
        </div>
        <!-- Línea vertical si hay respuestas (opcional visualmente) -->
      </div>
      
      <!-- Burbuja de Contenido -->
      <div class="content-col">
        <div class="comment-bubble">
          <div class="comment-header">
            <span class="username">
              {{ comentario.usuarioId?.nombre || 'Usuario' }}
            </span>
            <span class="timestamp">{{ fechaFormateada }}</span>
          </div>
          
          <p class="comment-text">{{ comentario.texto }}</p>
        </div>
        
        <!-- Botones de acción (fuera de la burbuja para limpieza) -->
        <div class="comment-actions">
          <button class="action-link" @click="$emit('responder', comentario._id)">
            <IconifyIcon icon="mdi:reply" width="16" height="16" />
            Responder
          </button>
        </div>
      </div>
    </div>

    <!-- Respuestas Anidadas (Recursivo) -->
    <div v-if="comentario.respuestas && comentario.respuestas.length" class="nested-thread">
      <!-- Línea guía visual -->
      <div class="thread-line"></div>
      
      <div class="nested-items">
        <ComentarioItem
          v-for="respuesta in comentario.respuestas"
          :key="respuesta._id"
          :comentario="respuesta"
          @responder="$emit('responder', $event)"
        />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon as IconifyIcon } from '@iconify/vue'

// Definición recursiva implícita en SFC, pero aseguramos el nombre
defineOptions({
  name: 'ComentarioItem'
})

const props = defineProps<{ comentario: any }>()

const fechaFormateada = computed(() =>
  props.comentario.fecha
    ? new Date(props.comentario.fecha).toLocaleString(undefined, { 
        dateStyle: 'short', 
        timeStyle: 'short' 
      })
    : ''
)
</script>

<style scoped>
.comment-container {
  margin-bottom: 1rem;
  position: relative;
}

.comment-row {
  display: flex;
  gap: 12px;
}

/* --- AVATAR --- */
.avatar-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #e0e0e0; /* Gris neutro para comentarios */
  color: #555;
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

/* --- CONTENIDO --- */
.content-col {
  flex: 1;
  max-width: 100%;
}

.comment-bubble {
  background-color: #f3f4f6; /* Gris muy claro */
  padding: 10px 14px;
  border-radius: 0 16px 16px 16px; /* Estilo burbuja de chat */
  display: inline-block; /* Se ajusta al contenido */
  min-width: 200px;
  max-width: 100%;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
  gap: 10px;
}

.username {
  font-weight: 700;
  font-size: 0.9rem;
  color: #333;
}

.timestamp {
  font-size: 0.75rem;
  color: #9ca3af;
}

.comment-text {
  font-size: 0.95rem;
  color: #374151;
  line-height: 1.5;
  margin: 0;
  white-space: pre-wrap; /* Mantiene saltos de línea */
}

/* --- ACCIONES --- */
.comment-actions {
  margin-top: 4px;
  margin-left: 4px;
}

.action-link {
  background: none;
  border: none;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.action-link:hover {
  color: #6200EA; /* Morado Kimal al hover */
  background-color: #f9fafb;
}

/* --- RESPUESTAS ANIDADAS (THREAD) --- */
.nested-thread {
  display: flex;
  margin-top: 0.5rem;
  position: relative;
}

.thread-line {
  width: 2px;
  background-color: #e5e7eb;
  margin-left: 15px; /* Centrado con el avatar de arriba (32px / 2 approx) */
  margin-right: 15px;
  border-radius: 99px;
  flex-shrink: 0;
}

.nested-items {
  flex: 1;
  /* Espaciado vertical entre respuestas hijas */
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>