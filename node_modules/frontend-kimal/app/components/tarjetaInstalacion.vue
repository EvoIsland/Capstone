<template>
    <div class="tarjeta-instalacion" v-if="instalacion">
        <div class="header-tarjeta">
            <h2 class="nombre-instalacion">{{ instalacion.nombre }}</h2>
            <button class="btn-cerrar" @click="$emit('cerrar')">✕</button>
        </div>
        
        <div class="contenido-tarjeta">
            <div class="seccion-noticias">
                <h3 class="titulo-seccion">📰 Noticias</h3>
                <div class="lista-items">
                    <div 
                        v-for="noticia in noticias" 
                        :key="noticia.id"
                        class="item-noticia"
                        @click="verNoticia(noticia)"
                    >
                        <div class="item-fecha">{{ noticia.fecha }}</div>
                        <div class="item-titulo">{{ noticia.titulo }}</div>
                    </div>
                    <div v-if="noticias.length === 0" class="no-items">
                        No hay noticias disponibles
                    </div>
                </div>
            </div>
            
            <div class="seccion-reportes">
                <h3 class="titulo-seccion">📊 Reportes</h3>
                <div class="lista-items">
                    <div 
                        v-for="reporte in reportes" 
                        :key="reporte.id"
                        class="item-reporte"
                        @click="verReporte(reporte)"
                    >
                        <div class="item-fecha">{{ reporte.fecha }}</div>
                        <div class="item-titulo">{{ reporte.titulo }}</div>
                        <div class="item-estado" :class="`estado-${reporte.estado}`">
                            {{ reporte.estado }}
                        </div>
                    </div>
                    <div v-if="reportes.length === 0" class="no-items">
                        No hay reportes disponibles
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Instalacion {
    nombre: string
    coords: number[]
    region: string
}

interface Noticia {
    id: number
    titulo: string
    fecha: string
    contenido: string
}

interface Reporte {
    id: number
    titulo: string
    fecha: string
    estado: 'activo' | 'resuelto' | 'pendiente'
    descripcion: string
}

const props = defineProps<{
    instalacion: Instalacion | null
}>()

const emit = defineEmits<{
    cerrar: []
    verNoticia: [noticia: Noticia]
    verReporte: [reporte: Reporte]
}>()

// Datos de ejemplo - en producción vendrían de una API
const noticiasData = ref<Record<string, Noticia[]>>({
    'Pudahuel': [
        { id: 1, titulo: 'Avance en construcción de subestación', fecha: '15 Oct 2025', contenido: 'Se completó el 70% de la construcción...' },
        { id: 2, titulo: 'Reunión con la comunidad local', fecha: '10 Oct 2025', contenido: 'Se realizó una reunión informativa...' }
    ],
    'María Elena': [
        { id: 3, titulo: 'Inicio de obras en subestación Kimal', fecha: '12 Oct 2025', contenido: 'Comenzaron las obras principales...' },
        { id: 4, titulo: 'Estudio de impacto ambiental aprobado', fecha: '08 Oct 2025', contenido: 'El estudio fue aprobado por las autoridades...' }
    ]
})

const reportesData = ref<Record<string, Reporte[]>>({
    'Pudahuel': [
        { id: 1, titulo: 'Mantenimiento programado', fecha: '20 Oct 2025', estado: 'pendiente', descripcion: 'Mantenimiento de torres...' },
        { id: 2, titulo: 'Inspección completada', fecha: '18 Oct 2025', estado: 'resuelto', descripcion: 'Inspección rutinaria...' }
    ],
    'María Elena': [
        { id: 3, titulo: 'Monitoreo ambiental', fecha: '22 Oct 2025', estado: 'activo', descripcion: 'Monitoreo continuo...' },
        { id: 4, titulo: 'Revisión de seguridad', fecha: '19 Oct 2025', estado: 'resuelto', descripcion: 'Revisión de protocolos...' }
    ]
})

const noticias = computed(() => {
    if (!props.instalacion) return []
    return noticiasData.value[props.instalacion.nombre] || []
})

const reportes = computed(() => {
    if (!props.instalacion) return []
    return reportesData.value[props.instalacion.nombre] || []
})

function verNoticia(noticia: Noticia) {
    emit('verNoticia', noticia)
}

function verReporte(reporte: Reporte) {
    emit('verReporte', reporte)
}
</script>

<style lang="sass" scoped>
.tarjeta-instalacion
    position: absolute
    top: 100px
    left: 16px
    width: 400px
    max-height: calc(85vh - 120px)
    background: white
    border-radius: 2rem
    box-shadow: 0 8px 32px rgba(0,0,0,0.15)
    z-index: 2000
    display: flex
    flex-direction: column
    overflow: hidden

.header-tarjeta
    background: linear-gradient(135deg, #10B981 0%, #059669 100%)
    color: white
    padding: 2rem 1.5rem 1.5rem 1.5rem
    display: flex
    justify-content: space-between
    align-items: center

.nombre-instalacion
    font-size: 1.8rem
    font-weight: bold
    margin: 0

.btn-cerrar
    background: transparent
    border: 2px solid white
    color: white
    width: 40px
    height: 40px
    border-radius: 50%
    cursor: pointer
    font-size: 1.2rem
    display: flex
    align-items: center
    justify-content: center
    transition: all 0.3s ease

    &:hover
        background: white
        color: #059669

.contenido-tarjeta
    padding: 1.5rem
    overflow-y: auto
    flex: 1

.titulo-seccion
    font-size: 1.4rem
    font-weight: 600
    margin-bottom: 1rem
    color: #333
    display: flex
    align-items: center
    gap: 0.5rem

.seccion-noticias,
.seccion-reportes
    margin-bottom: 2rem

    &:last-child
        margin-bottom: 0

.lista-items
    display: flex
    flex-direction: column
    gap: 0.8rem

.item-noticia,
.item-reporte
    background: #f8f9fa
    border-radius: 1rem
    padding: 1rem
    cursor: pointer
    transition: all 0.3s ease
    border-left: 4px solid transparent

    &:hover
        background: #e9ecef
        transform: translateX(4px)

.item-noticia
    border-left-color: #10B981

.item-reporte
    border-left-color: #7C3AED

.item-fecha
    font-size: 0.9rem
    color: #666
    margin-bottom: 0.3rem

.item-titulo
    font-size: 1.1rem
    font-weight: 500
    color: #333
    margin-bottom: 0.5rem

.item-estado
    font-size: 0.8rem
    padding: 0.2rem 0.6rem
    border-radius: 1rem
    font-weight: 600
    text-transform: uppercase
    width: fit-content

    &.estado-activo
        background: #fef3c7
        color: #92400e

    &.estado-resuelto
        background: #d1fae5
        color: #065f46

    &.estado-pendiente
        background: #fee2e2
        color: #991b1b

.no-items
    text-align: center
    color: #666
    font-style: italic
    padding: 2rem 1rem

// Responsive
@media screen and (max-width: 768px)
    .tarjeta-instalacion
        left: 8px
        right: 8px
        width: auto
        max-width: calc(100vw - 16px)
        top: 90px
        max-height: calc(85vh - 110px)

    .header-tarjeta
        padding: 1.5rem 1rem

    .nombre-instalacion
        font-size: 1.5rem

    .contenido-tarjeta
        padding: 1rem

@media screen and (max-width: 480px)
    .tarjeta-instalacion
        top: 80px
        left: 8px
        right: 8px
        max-height: calc(100vh - 100px)

    .item-titulo
        font-size: 1rem

    .titulo-seccion
        font-size: 1.2rem
</style>