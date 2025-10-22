<template>
    <div class="filtro-instalaciones">
        <div class="filtros-container">
            <div class="filtro-grupo">
                <label class="filtro-label">Región</label>
                <select 
                    v-model="filtros.region" 
                    @change="aplicarFiltros"
                    class="filtro-select"
                >
                    <option value="">Todas las regiones</option>
                    <option v-for="region in regiones" :key="region._id" :value="region._id">
                        {{ region.nombre }}
                    </option>
                </select>
            </div>
            
            <div class="filtro-grupo">
                <label class="filtro-label">Comuna</label>
                <select 
                    v-model="filtros.comuna" 
                    @change="aplicarFiltros"
                    class="filtro-select"
                    :disabled="!filtros.region"
                >
                    <option value="">Todas las comunas</option>
                    <option v-for="comuna in comunasFiltradas" :key="comuna._id" :value="comuna._id">
                        {{ comuna.nombre }}
                    </option>
                </select>
            </div>
            
            <button 
                class="btn-limpiar"
                @click="limpiarFiltros"
                v-if="filtros.region || filtros.comuna"
            >
                ✕ Limpiar
            </button>
        </div>
        
        <div class="resultados-info" v-if="mostrarResultados">
            <span class="contador">{{ instalacionesFiltradas.length }} instalaciones encontradas</span>
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

<style lang="sass" scoped>
.filtro-instalaciones
    background: white
    border-radius: 1.5rem
    padding: 1.5rem
    box-shadow: 0 4px 12px rgba(0,0,0,0.1)
    min-width: 320px
    max-width: 400px

.filtros-container
    display: flex
    flex-direction: column
    gap: 1rem

.filtro-grupo
    display: flex
    flex-direction: column
    gap: 0.5rem

.filtro-label
    font-size: 0.9rem
    font-weight: 600
    color: #374151
    margin-bottom: 0.2rem

.filtro-select
    padding: 0.8rem 1rem
    border: 2px solid #e5e7eb
    border-radius: 0.8rem
    font-size: 0.9rem
    background: white
    cursor: pointer
    transition: all 0.3s ease

    &:focus
        outline: none
        border-color: #10B981
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1)

    &:disabled
        background: #f9fafb
        color: #9ca3af
        cursor: not-allowed

.btn-limpiar
    background: #ef4444
    color: white
    border: none
    padding: 0.6rem 1rem
    border-radius: 0.8rem
    font-size: 0.8rem
    font-weight: 600
    cursor: pointer
    transition: all 0.3s ease
    align-self: flex-start

    &:hover
        background: #dc2626
        transform: translateY(-1px)

.resultados-info
    margin-top: 1rem
    padding-top: 1rem
    border-top: 1px solid #e5e7eb

.contador
    font-size: 0.85rem
    color: #6b7280
    font-weight: 500

// Responsive
@media screen and (max-width: 768px)
    .filtro-instalaciones
        min-width: 280px
        max-width: calc(100vw - 40px)
        padding: 1.2rem

    .filtros-container
        gap: 0.8rem

    .filtro-select
        padding: 0.7rem 0.8rem
        font-size: 0.85rem

@media screen and (max-width: 480px)
    .filtro-instalaciones
        min-width: 260px
        padding: 1rem

    .filtro-label
        font-size: 0.8rem

    .filtro-select
        padding: 0.6rem 0.7rem
        font-size: 0.8rem

    .btn-limpiar
        padding: 0.5rem 0.8rem
        font-size: 0.75rem
</style>