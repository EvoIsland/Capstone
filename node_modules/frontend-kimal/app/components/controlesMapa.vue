<template>
    <div class="controles-mapa">
        <button 
            class="btn-control btn-linea"
            @click="toggleLinea"
            :class="{ 'activo': mostrarLinea }"
        >
            <span class="icono">⚡</span>
            <span class="texto">{{ mostrarLinea ? 'Ocultar' : 'Mostrar' }} Línea</span>
        </button>
        
        <button 
            class="btn-control btn-ubicacion"
            @click="centrarEnMiUbicacion"
        >
            <span class="icono">📍</span>
            <span class="texto">Mi Ubicación</span>
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
    toggleLinea: [mostrar: boolean]
    centrarUbicacion: []
}>()

const mostrarLinea = ref(true)

function toggleLinea() {
    mostrarLinea.value = !mostrarLinea.value
    emit('toggleLinea', mostrarLinea.value)
}

function centrarEnMiUbicacion() {
    emit('centrarUbicacion')
}
</script>

<style lang="sass" scoped>
.controles-mapa
    position: absolute
    top: 100px
    right: 20px
    z-index: 1000
    display: flex
    flex-direction: column
    gap: 1rem

.btn-control
    background: white
    border: none
    border-radius: 1rem
    padding: 1rem 1.5rem
    cursor: pointer
    box-shadow: 0 4px 12px rgba(0,0,0,0.15)
    font-weight: 600
    font-size: 1rem
    transition: all 0.3s ease
    display: flex
    align-items: center
    gap: 0.8rem
    min-width: 140px

    &:hover
        transform: translateY(-2px)
        box-shadow: 0 6px 20px rgba(0,0,0,0.2)

.btn-linea
    &.activo
        background: linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)
        color: white

    &:not(.activo)
        background: #f3f4f6
        color: #374151

.btn-ubicacion
    background: linear-gradient(135deg, #10B981 0%, #059669 100%)
    color: white

    &:hover
        background: linear-gradient(135deg, #059669 0%, #047857 100%)

.icono
    font-size: 1.2rem

.texto
    font-size: 0.9rem

// Responsive
@media screen and (max-width: 768px)
    .controles-mapa
        top: 90px
        right: 15px
        gap: 0.8rem

    .btn-control
        padding: 0.8rem 1.2rem
        min-width: 120px
        font-size: 0.9rem

    .icono
        font-size: 1.1rem

    .texto
        font-size: 0.8rem

@media screen and (max-width: 480px)
    .controles-mapa
        top: 80px
        right: 10px
        flex-direction: row
        gap: 0.5rem

    .btn-control
        padding: 0.6rem 1rem
        min-width: auto
        flex: 1

    .texto
        display: none

    .icono
        font-size: 1.3rem
</style>