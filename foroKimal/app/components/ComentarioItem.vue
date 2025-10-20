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
  margin-bottom: 1rem;
  padding-left: 0.5rem;
  border-left: 2px solid #eee;
}
.comentario-actions {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #888;
  margin-top: 0.2rem;
}
.respuestas {
  margin-left: 1.5rem;
  margin-top: 0.5rem;
}
.comentario-fecha {
  font-size: 0.85rem;
}
</style>