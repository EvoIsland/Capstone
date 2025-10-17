<template>
  <div style="display: flex; flex-direction: column; gap: 8px;">
    <input
      v-model="busqueda"
      placeholder="Buscar instalación..."
      style="width: 220px; padding: 8px; border-radius: 6px; border: 1px solid #ccc;"
    />
    <select v-model="region" style="width: 220px; padding: 8px; border-radius: 6px;">
      <option value="">Todas las regiones</option>
      <option v-for="r in regiones" :key="r" :value="r">{{ r }}</option>
    </select>
    <select v-model="comuna" style="width: 220px; padding: 8px; border-radius: 6px;">
      <option value="">Todas las comunas</option>
      <option v-for="c in comunasFiltradas" :key="c" :value="c">{{ c }}</option>
    </select>
    <button @click="emitBusqueda" style="width: 220px; padding: 8px; border-radius: 6px; background: #1976d2; color: white; border: none; cursor: pointer;">
      Aplicar filtro
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const busqueda = ref('')
const region = ref('')
const comuna = ref('')

const regiones = [
  'Región Metropolitana',
  'Región de Valparaíso',
  'Región de Coquimbo',
  'Atacama',
  'Antofagasta'
]

const comunasPorRegion = {
  'Región Metropolitana': ['Lampa', 'Pudahuel', 'Til Til'],
  'Región de Valparaíso': ['Cabildo', 'Catemu', 'La Ligua', 'LlayLlay', 'Panquehue', 'Petorca'],
  'Región de Coquimbo': ['Andacollo', 'Combarbalá', 'Canela', 'Illapel', 'La Higuera', 'La Serena', 'Los Vilos', 'Ovalle', 'Punitaqui', 'Río Hurtado', 'Vicuña'],
  'Atacama': ['Diego de Almagro', 'Tierra Amarilla', 'Vallenar', 'Copiapó'],
  'Antofagasta': ['Antofagasta', 'María Elena', 'Sierra Gorda', 'Taltal']
}

const comunasFiltradas = computed(() => {
  if (!region.value) {
    return Object.values(comunasPorRegion).flat()
  }
  return comunasPorRegion[region.value] || []
})

function emitBusqueda() {
  emit('buscar', {
    nombre: busqueda.value,
    region: region.value,
    comuna: comuna.value
  })
}
</script>