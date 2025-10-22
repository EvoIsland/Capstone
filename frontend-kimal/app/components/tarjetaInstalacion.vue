<template>
    <div class="tarjeta-instalacion" v-if="instalacion">
        <div class="header-tarjeta">
            <div>
                <h2 class="nombre-instalacion">{{ instalacion.nombre }}</h2>
                <div v-if="instalacion.estado" class="estado-instalacion">
                    <span :class="`estado-${instalacion.estado}`">{{ instalacion.estado }}</span>
                </div>
            </div>
            <button class="btn-cerrar" @click="$emit('cerrar')">✕</button>
        </div>
        <div class="tabs-tarjeta">
            <button v-for="tab in tabs" :key="tab" :class="['tab-btn', { activo: activeTab === tab }]" @click="activeTab = tab">
                {{ tab }}
            </button>
        </div>
        <div class="contenido-tarjeta">
            <div v-if="activeTab === 'Preguntas'">
                <div class="lista-items">
                    <div v-for="pregunta in preguntas" :key="pregunta._id" class="card-publicacion">
                        <div class="card-header">
                            <span class="autor" v-if="pregunta.publicadorId">{{ pregunta.publicadorId.nombre }}</span>
                            <span class="card-fecha">{{ formatFecha(pregunta.fecha) }}</span>
                        </div>
                        <div class="card-contenido">{{ pregunta.texto }}</div>
                        <div v-if="pregunta.imagenes && pregunta.imagenes.length" class="card-imagenes">
                            <img v-for="img in pregunta.imagenes" :src="img" :key="img" class="card-img" />
                        </div>
                    </div>
                    <div v-if="preguntas.length === 0" class="no-items">No hay preguntas disponibles</div>
                </div>
            </div>
            <div v-else-if="activeTab === 'Reporte'">
                <div class="lista-items">
                    <div v-for="reporte in reportes" :key="reporte._id" class="card-publicacion">
                        <div class="card-header">
                            <span class="autor" v-if="reporte.publicadorId">{{ reporte.publicadorId.nombre }}</span>
                            <span class="card-fecha">{{ formatFecha(reporte.fecha) }}</span>
                        </div>
                        <div class="card-contenido">{{ reporte.texto }}</div>
                        <div v-if="reporte.imagenes && reporte.imagenes.length" class="card-imagenes">
                            <img v-for="img in reporte.imagenes" :src="img" :key="img" class="card-img" />
                        </div>
                    </div>
                    <div v-if="reportes.length === 0" class="no-items">No hay reportes disponibles</div>
                </div>
            </div>
            <div v-else-if="activeTab === 'Información'">
                <div class="lista-items">
                    <div v-for="noticia in noticias" :key="noticia._id" class="card-publicacion">
                        <div class="card-header">
                            <span class="autor" v-if="noticia.publicadorId">{{ noticia.publicadorId.nombre }}</span>
                            <span class="card-fecha">{{ formatFecha(noticia.fecha) }}</span>
                        </div>
                        <div class="card-contenido">{{ noticia.texto }}</div>
                        <div v-if="noticia.imagenes && noticia.imagenes.length" class="card-imagenes">
                            <img v-for="img in noticia.imagenes" :src="img" :key="img" class="card-img" />
                        </div>
                    </div>
                    <div v-if="noticias.length === 0" class="no-items">No hay información disponible</div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import axios from 'axios'

interface Instalacion {
    _id: string
    nombre: string
    estado?: string
    location: { type: string, coordinates: number[] }
    regionId: string
    comunaId: string
}

interface Publicacion {
    _id: string
    texto: string
    tipo: 'pregunta' | 'reporte' | 'noticia'
    fecha: string
    imagenes?: string[]
    publicadorId?: { nombre: string }
}

const props = defineProps<{ instalacion: Instalacion | null }>()
const publicaciones = ref<Publicacion[]>([])

const tabs = ['Preguntas', 'Reporte', 'Información']
const activeTab = ref('Preguntas')

const preguntas = computed(() => publicaciones.value.filter(p => p.tipo === 'pregunta'))
const reportes = computed(() => publicaciones.value.filter(p => p.tipo === 'reporte'))
const noticias = computed(() => publicaciones.value.filter(p => p.tipo === 'noticia'))

watch(() => props.instalacion, async (inst) => {
    if (inst && inst._id) {
        try {
            const { data } = await axios.get(`http://localhost:5000/publicaciones?instalacionId=${inst._id}`)
            publicaciones.value = Array.isArray(data) ? data : []
        } catch (error) {
            publicaciones.value = []
        }
    } else {
        publicaciones.value = []
    }
}, { immediate: true })

function formatFecha(fecha: string) {
    if (!fecha) return ''
    const d = new Date(fecha)
    return d.toLocaleDateString()
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
    background: linear-gradient(135deg, #111827 0%, #374151 100%)
    color: white
    padding: 2rem 1.5rem 1.5rem 1.5rem
    display: flex
    justify-content: space-between
    align-items: center

.nombre-instalacion
    font-size: 1.8rem
    font-weight: bold
    margin: 0

.estado-instalacion
    margin-top: 0.5rem
    .estado-operativo
        background: #d1fae5
        color: #065f46
        padding: 0.2rem 0.7rem
        border-radius: 1rem
        font-size: 1rem
        font-weight: 600

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
        color: #374151

.tabs-tarjeta
    display: flex
    background: #f3f4f6
    padding: 0.5rem 1.5rem 0.5rem 1.5rem
    gap: 1rem

.tab-btn
    background: none
    border: none
    font-size: 1.1rem
    font-weight: 600
    color: #374151
    padding: 0.7rem 1.2rem
    border-radius: 1.2rem 1.2rem 0 0
    cursor: pointer
    transition: background 0.2s, color 0.2s
    &.activo
        background: white
        color: #059669
        box-shadow: 0 -2px 8px rgba(0,0,0,0.07)

.contenido-tarjeta
    padding: 1.5rem
    overflow-y: auto
    flex: 1

.lista-items
    display: flex
    flex-direction: column
    gap: 1.2rem

.card-publicacion
    background: #f8f9fa
    border-radius: 1.2rem
    padding: 1.2rem 1rem
    box-shadow: 0 2px 8px rgba(0,0,0,0.07)
    display: flex
    flex-direction: column
    gap: 0.5rem
    cursor: default
    border-left: 4px solid #059669
    transition: box-shadow 0.2s
    &:hover
        box-shadow: 0 4px 16px rgba(0,0,0,0.12)
        background: #eef2f7

.card-header
    display: flex
    justify-content: space-between
    align-items: center
    margin-bottom: 0.3rem

.autor
    font-weight: 600
    color: #059669

.card-fecha
    font-size: 0.95rem
    color: #666

.card-contenido
    font-size: 1.1rem
    color: #222

.card-imagenes
    display: flex
    gap: 0.5rem
    margin-top: 0.5rem

.card-img
    max-width: 100px
    max-height: 80px
    border-radius: 0.5rem
    box-shadow: 0 2px 8px rgba(0,0,0,0.08)

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
</style>