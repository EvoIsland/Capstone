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
                    <option v-for="region in regiones" :key="region" :value="region">
                        {{ region }}
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
                    <option v-for="comuna in comunasFiltradas" :key="comuna" :value="comuna">
                        {{ comuna }}
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

interface Sucursal {
    nombre: string
    coords: number[]
}

interface Comuna {
    nombre: string
    sucursales: Sucursal[]
}

interface Region {
    nombre: string
    comunas: Comuna[]
}

interface InstalacionFlat {
    nombre: string
    coords: number[]
    region: string
    comuna: string
}

const props = defineProps<{
    data: { regiones: Region[] }
}>()

const emit = defineEmits<{
    filtrar: [instalaciones: InstalacionFlat[]]
}>()

const filtros = ref({
    region: '',
    comuna: ''
})

const mostrarResultados = ref(false)

// Aplanar datos para facilitar el filtrado
const instalacionesPlanas = computed((): InstalacionFlat[] => {
    const result: InstalacionFlat[] = []
    
    props.data.regiones.forEach(region => {
        region.comunas.forEach(comuna => {
            comuna.sucursales.forEach(sucursal => {
                result.push({
                    nombre: sucursal.nombre,
                    coords: sucursal.coords,
                    region: region.nombre,
                    comuna: comuna.nombre
                })
            })
        })
    })
    
    return result
})

// Obtener regiones únicas
const regiones = computed(() => {
    return props.data.regiones.map(r => r.nombre).sort()
})

// Obtener comunas filtradas por región
const comunasFiltradas = computed(() => {
    if (!filtros.value.region) return []
    
    const regionSeleccionada = props.data.regiones.find(r => r.nombre === filtros.value.region)
    if (!regionSeleccionada) return []
    
    return regionSeleccionada.comunas.map(c => c.nombre).sort()
})

// Instalaciones filtradas
const instalacionesFiltradas = computed(() => {
    let resultado = instalacionesPlanas.value
    
    if (filtros.value.region) {
        resultado = resultado.filter(inst => inst.region === filtros.value.region)
    }
    
    if (filtros.value.comuna) {
        resultado = resultado.filter(inst => inst.comuna === filtros.value.comuna)
    }
    
    return resultado
})

// Limpiar filtro de comuna cuando cambia la región
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
    emit('filtrar', instalacionesPlanas.value)
}

// Emitir todas las instalaciones al inicio
onMounted(() => {
    emit('filtrar', instalacionesPlanas.value)
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