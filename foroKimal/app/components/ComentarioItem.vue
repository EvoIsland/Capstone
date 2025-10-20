<!-- filepath: c:\proyectos\Capstone\foroKimal\app\components\ComentarioItem.vue -->
<template>
  <div class="comentario-item">
    <b>@{{ comentario.usuarioId?.nombre || 'Usuario' }}</b>: {{ comentario.texto }}
    <div class="comentario-actions">
      <button @click="$emit('responder', comentario._id)">Responder</button>
      <span class="comentario-fecha">{{ fechaFormateada }}</span>
    </div>
    <div v-if="comentario.respuestas && comentario.respuestas.length" class="respuestas">
      <ComentarioItem
        v-for="respuesta in comentario.respuestas"
        :key="respuesta._id"
        :comentario="respuesta"
        @responder="$emit('responder', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ comentario: any }>()
const fechaFormateada = computed(() =>
  props.comentario.fecha
    ? new Date(props.comentario.fecha).toLocaleString()
    : ''
)
</script>

<style scoped>

.comentario-item {
  margin-bottom: 1.2rem;
  padding: 1rem 1.2rem;
  background: #f7f7f7;
  border-radius: 1.5rem;
  box-shadow: 0 1px 4px #0001;
  border-left: 6px solid #e9e2f5;
}
.comentario-item > b {
  color: #ff3388;
  font-weight: 600;
  font-size: 1.05rem;
}
.comentario-actions {
  display: flex;
  gap: 1rem;
  font-size: 0.95rem;
  color: #888;
  margin-top: 0.5rem;
}
.comentario-actions button {
  background: #ff3388;
  color: #fff;
  border: none;
  border-radius: 1rem;
  padding: 0.2rem 1.2rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.comentario-actions button:hover {
  background: #e6006d;
}
.respuestas {
  margin-left: 2rem;
  margin-top: 0.7rem;
}
.comentario-fecha {
  font-size: 0.9rem;
  color: #6d6d6d;
}
</style>