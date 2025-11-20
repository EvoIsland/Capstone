<template>
  <div class="filtro-content">
    <!-- Header: Título y Botón Limpiar -->
    <div class="card-header">
      <span class="card-title">Búsqueda</span>
      <button 
        v-if="filtros.region || filtros.comuna"
        class="btn-ghost" 
        @click="limpiarFiltros"
      >
        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        Limpiar
      </button>
    </div>

    <!-- Inputs -->
    <div class="filtros-body">
      <div class="input-group">
        <label class="input-label">Región</label>
        <div class="select-wrapper">
          <select 
            v-model="filtros.region" 
            @change="aplicarFiltros"
            class="custom-select"
          >
            <option value="">Todas las regiones</option>
            <option v-for="region in regiones" :key="region._id" :value="region._id">
              {{ region.nombre }}
            </option>
          </select>
        </div>
      </div>

      <div class="input-group">
        <label class="input-label">Comuna</label>
        <div class="select-wrapper">
          <select 
            v-model="filtros.comuna" 
            @change="aplicarFiltros"
            class="custom-select"
            :disabled="!filtros.region"
          >
            <option value="">Todas las comunas</option>
            <option v-for="comuna in comunasFiltradas" :key="comuna._id" :value="comuna._id">
              {{ comuna.nombre }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Footer: Contador de resultados -->
    <div class="results-footer" v-if="mostrarResultados">
      <span class="results-text">{{ instalacionesFiltradas.length }} instalaciones encontradas</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps<{
  data: {
    regiones: Array<{ _id: string, nombre: string }>,
    comunas: Array<{ _id: string, nombre: string, regionId: string }>,
    instalaciones: Array<{ nombre: string, location: { type: string, coordinates: number[] }, regionId: string, comunaId: string }>
  }
}>()

const emit = defineEmits<{ filtrar: [instalaciones: any[]] }>()

const filtros = ref({ region: '', comuna: '' })
const mostrarResultados = ref(false)

const regiones = computed(() => props.data.regiones)

const comunasFiltradas = computed(() => {
  if (!filtros.value.region) return []
  return props.data.comunas.filter(c => c.regionId === filtros.value.region)
})

const instalacionesFiltradas = computed(() => {
  let resultado = props.data.instalaciones
  if (filtros.value.region) {
    resultado = resultado.filter(inst => inst.regionId === filtros.value.region)
  }
  if (filtros.value.comuna) {
    resultado = resultado.filter(inst => inst.comunaId === filtros.value.comuna)
  }
  return resultado
})

watch(() => filtros.value.region, () => {
  filtros.value.comuna = ''
})

function aplicarFiltros() {
  mostrarResultados.value = true
  emit('filtrar', instalacionesFiltradas.value)
}

function limpiarFiltros() {
  filtros.value.region = ''
  filtros.value.comuna = ''
  mostrarResultados.value = false
  emit('filtrar', props.data.instalaciones)
}

onMounted(() => {
  emit('filtrar', props.data.instalaciones)
})
</script>

<style lang="scss" scoped>
// Variables de diseño (Coherencia con MapaUsuario.vue)
$primary: #7c3aed;
$primary-light: #8b5cf6;
$primary-soft: #f3e8ff;
$text-main: #1f2937;
$text-light: #6b7280;
$danger: #ef4444;
$danger-soft: #fee2e2;
$border: #e5e7eb;
$bg-input: #f9fafb;

.filtro-content {
  // No background here, let the parent glass panel show through
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* --- HEADER --- */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-title {
  font-size: 14px;
  font-weight: 700;
  color: $text-main;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-ghost {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  color: $danger;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.2s ease;

  &:hover {
    background-color: $danger-soft;
  }
}

/* --- INPUTS --- */
.filtros-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: $text-light;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.select-wrapper {
  position: relative;
  
  // Flecha personalizada SVG (inline encoded)
  &::after {
    content: '';
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    pointer-events: none;
  }
}

.custom-select {
  width: 100%;
  padding: 10px 14px;
  padding-right: 32px; // Espacio para la flecha
  border-radius: 10px;
  border: 1px solid $border;
  background-color: $bg-input;
  font-family: inherit;
  font-size: 14px;
  color: $text-main;
  appearance: none; // Ocultar flecha nativa
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: $primary-light;
  }

  &:focus {
    outline: none;
    border-color: $primary;
    box-shadow: 0 0 0 3px rgba($primary, 0.1);
    background-color: white;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #f3f4f6;
  }
}

/* --- FOOTER --- */
.results-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.results-text {
  font-size: 11px;
  font-weight: 600;
  color: $primary;
}
</style>