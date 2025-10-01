<template>
    <div class="foro-container">
        <div class="foro-header">
            <div class="anchoMaximo">
                <h1 class="titulo-foro">Foro Comunitario Kimal</h1>
                <p class="descripcion-foro">Comparte experiencias, haz preguntas y participa en la comunidad del proyecto Kimal</p>
                <button class="btn-nueva-pregunta" @click="mostrarModalPregunta = true">
                    ➕ Nueva Pregunta
                </button>
            </div>
        </div>

        <div class="foro-contenido">
            <div class="anchoMaximo">
                <!-- Filtros y categorías -->
                <div class="filtros-foro">
                    <div class="categorias">
                        <button 
                            v-for="categoria in categorias" 
                            :key="categoria.id"
                            :class="['btn-categoria', { 'activo': categoriaActiva === categoria.id }]"
                            @click="categoriaActiva = categoria.id"
                        >
                            {{ categoria.emoji }} {{ categoria.nombre }}
                        </button>
                    </div>
                    <div class="ordenamiento">
                        <select v-model="ordenActual" class="select-orden">
                            <option value="recientes">Más recientes</option>
                            <option value="populares">Más populares</option>
                            <option value="sin-responder">Sin responder</option>
                        </select>
                    </div>
                </div>

                <!-- Lista de preguntas -->
                <div class="lista-preguntas">
                    <div 
                        v-for="pregunta in preguntasFiltradas" 
                        :key="pregunta.id"
                        class="tarjeta-pregunta"
                        @click="verPregunta(pregunta)"
                    >
                        <div class="pregunta-header">
                            <div class="categoria-badge">
                                {{ pregunta.categoria.emoji }} {{ pregunta.categoria.nombre }}
                            </div>
                            <div class="fecha">{{ formatearFecha(pregunta.fechaCreacion) }}</div>
                        </div>
                        
                        <h3 class="titulo-pregunta">{{ pregunta.titulo }}</h3>
                        <p class="resumen-pregunta">{{ pregunta.contenido.substring(0, 150) }}...</p>
                        
                        <div class="pregunta-footer">
                            <div class="autor-info">
                                <div class="avatar">{{ pregunta.autor.nombre.charAt(0) }}</div>
                                <span class="nombre-autor">{{ pregunta.autor.nombre }}</span>
                            </div>
                            
                            <div class="stats-pregunta">
                                <div class="stat">
                                    <span class="stat-numero">{{ pregunta.likes }}</span>
                                    <span class="stat-label">👍</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-numero">{{ pregunta.respuestas.length }}</span>
                                    <span class="stat-label">💬</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-numero">{{ pregunta.vistas }}</span>
                                    <span class="stat-label">👁️</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal para nueva pregunta -->
        <div v-if="mostrarModalPregunta" class="modal-overlay" @click="cerrarModal">
            <div class="modal-contenido" @click.stop>
                <div class="modal-header">
                    <h2>Nueva Pregunta</h2>
                    <button class="btn-cerrar" @click="cerrarModal">✕</button>
                </div>
                <form @submit.prevent="crearPregunta" class="form-pregunta">
                    <div class="campo">
                        <label>Categoría</label>
                        <select v-model="nuevaPregunta.categoriaId" required class="select-categoria">
                            <option value="">Selecciona una categoría</option>
                            <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
                                {{ categoria.emoji }} {{ categoria.nombre }}
                            </option>
                        </select>
                    </div>
                    <div class="campo">
                        <label>Título</label>
                        <input 
                            v-model="nuevaPregunta.titulo" 
                            type="text" 
                            placeholder="Escribe un título claro y descriptivo"
                            required
                            class="input-titulo"
                        >
                    </div>
                    <div class="campo">
                        <label>Descripción</label>
                        <textarea 
                            v-model="nuevaPregunta.contenido" 
                            placeholder="Describe tu pregunta en detalle..."
                            required
                            rows="6"
                            class="textarea-contenido"
                        ></textarea>
                    </div>
                    <div class="campo">
                        <label>Tu nombre</label>
                        <input 
                            v-model="nuevaPregunta.autorNombre" 
                            type="text" 
                            placeholder="¿Cómo te llamas?"
                            required
                            class="input-autor"
                        >
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn-cancelar" @click="cerrarModal">
                            Cancelar
                        </button>
                        <button type="submit" class="btn-publicar">
                            Publicar Pregunta
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Modal para ver pregunta completa -->
        <div v-if="preguntaSeleccionada" class="modal-overlay" @click="cerrarPregunta">
            <div class="modal-contenido modal-pregunta" @click.stop>
                <div class="modal-header">
                    <div class="categoria-badge">
                        {{ preguntaSeleccionada.categoria.emoji }} {{ preguntaSeleccionada.categoria.nombre }}
                    </div>
                    <button class="btn-cerrar" @click="cerrarPregunta">✕</button>
                </div>
                
                <div class="pregunta-detalle">
                    <h2 class="titulo-completo">{{ preguntaSeleccionada.titulo }}</h2>
                    <div class="autor-fecha">
                        <div class="autor-info">
                            <div class="avatar">{{ preguntaSeleccionada.autor.nombre.charAt(0) }}</div>
                            <div>
                                <span class="nombre-autor">{{ preguntaSeleccionada.autor.nombre }}</span>
                                <span class="fecha-completa">{{ formatearFechaCompleta(preguntaSeleccionada.fechaCreacion) }}</span>
                            </div>
                        </div>
                        <div class="acciones-pregunta">
                            <button 
                                :class="['btn-like', { 'liked': preguntaSeleccionada.userLiked }]"
                                @click="toggleLike(preguntaSeleccionada)"
                            >
                                👍 {{ preguntaSeleccionada.likes }}
                            </button>
                        </div>
                    </div>
                    
                    <div class="contenido-completo">
                        {{ preguntaSeleccionada.contenido }}
                    </div>
                </div>

                <!-- Respuestas -->
                <div class="respuestas-seccion">
                    <h3 class="titulo-respuestas">
                        Respuestas ({{ preguntaSeleccionada.respuestas.length }})
                    </h3>
                    
                    <div class="lista-respuestas">
                        <div 
                            v-for="respuesta in preguntaSeleccionada.respuestas" 
                            :key="respuesta.id"
                            class="tarjeta-respuesta"
                        >
                            <div class="respuesta-header">
                                <div class="autor-info">
                                    <div class="avatar">{{ respuesta.autor.nombre.charAt(0) }}</div>
                                    <div>
                                        <span class="nombre-autor">{{ respuesta.autor.nombre }}</span>
                                        <span class="fecha-respuesta">{{ formatearFecha(respuesta.fecha) }}</span>
                                    </div>
                                </div>
                                <button 
                                    :class="['btn-like-respuesta', { 'liked': respuesta.userLiked }]"
                                    @click="toggleLikeRespuesta(respuesta)"
                                >
                                    👍 {{ respuesta.likes }}
                                </button>
                            </div>
                            <div class="contenido-respuesta">
                                {{ respuesta.contenido }}
                            </div>
                        </div>
                    </div>

                    <!-- Formulario nueva respuesta -->
                    <div class="nueva-respuesta">
                        <h4>Tu respuesta</h4>
                        <form @submit.prevent="crearRespuesta" class="form-respuesta">
                            <div class="campo">
                                <textarea 
                                    v-model="nuevaRespuesta.contenido" 
                                    placeholder="Escribe tu respuesta..."
                                    required
                                    rows="4"
                                    class="textarea-respuesta"
                                ></textarea>
                            </div>
                            <div class="campo">
                                <input 
                                    v-model="nuevaRespuesta.autorNombre" 
                                    type="text" 
                                    placeholder="Tu nombre"
                                    required
                                    class="input-autor"
                                >
                            </div>
                            <button type="submit" class="btn-responder">
                                Responder
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Categoria {
    id: string
    nombre: string
    emoji: string
}

interface Usuario {
    id: string
    nombre: string
}

interface Respuesta {
    id: string
    contenido: string
    autor: Usuario
    fecha: Date
    likes: number
    userLiked: boolean
}

interface Pregunta {
    id: string
    titulo: string
    contenido: string
    autor: Usuario
    fechaCreacion: Date
    categoria: Categoria
    likes: number
    vistas: number
    respuestas: Respuesta[]
    userLiked: boolean
}

// Estados reactivos
const categoriaActiva = ref<string>('todas')
const ordenActual = ref<string>('recientes')
const mostrarModalPregunta = ref(false)
const preguntaSeleccionada = ref<Pregunta | null>(null)

// Categorías disponibles
const categorias = ref<Categoria[]>([
    { id: 'todas', nombre: 'Todas', emoji: '🌐' },
    { id: 'general', nombre: 'General', emoji: '💬' },
    { id: 'tecnico', nombre: 'Técnico', emoji: '⚡' },
    { id: 'ambiental', nombre: 'Ambiental', emoji: '🌱' },
    { id: 'comunidad', nombre: 'Comunidad', emoji: '👥' },
    { id: 'construccion', nombre: 'Construcción', emoji: '🏗️' }
])

// Formularios
const nuevaPregunta = ref({
    titulo: '',
    contenido: '',
    categoriaId: '',
    autorNombre: ''
})

const nuevaRespuesta = ref({
    contenido: '',
    autorNombre: ''
})

// Datos de ejemplo
const preguntas = ref<Pregunta[]>([
    {
        id: '1',
        titulo: '¿Cuál es el impacto ambiental del proyecto Kimal?',
        contenido: 'Me gustaría conocer más detalles sobre los estudios de impacto ambiental que se han realizado para el proyecto de transmisión eléctrica Kimal. ¿Qué medidas se están tomando para proteger la flora y fauna local?',
        autor: { id: '1', nombre: 'María González' },
        fechaCreacion: new Date('2024-10-20'),
        categoria: { id: 'ambiental', nombre: 'Ambiental', emoji: '🌱' },
        likes: 12,
        vistas: 156,
        userLiked: false,
        respuestas: [
            {
                id: 'r1',
                contenido: 'Excelente pregunta María. Los estudios de impacto ambiental incluyen monitoreo de fauna, reforestación compensatoria y corredores biológicos para minimizar la afectación.',
                autor: { id: '2', nombre: 'Carlos Ruiz' },
                fecha: new Date('2024-10-21'),
                likes: 8,
                userLiked: false
            }
        ]
    },
    {
        id: '2',
        titulo: '¿Cuándo estarán operativas las subestaciones de Pudahuel?',
        contenido: 'Quisiera saber el cronograma actualizado para la puesta en marcha de las subestaciones en la zona de Pudahuel. ¿Hay algún retraso previsto?',
        autor: { id: '3', nombre: 'Roberto Silva' },
        fechaCreacion: new Date('2024-10-19'),
        categoria: { id: 'tecnico', nombre: 'Técnico', emoji: '⚡' },
        likes: 8,
        vistas: 89,
        userLiked: true,
        respuestas: []
    },
    {
        id: '3',
        titulo: 'Oportunidades laborales en el proyecto',
        contenido: '¿El proyecto Kimal generará empleos locales? Me interesa saber qué tipo de perfiles profesionales se necesitarán y si habrá programas de capacitación para la comunidad.',
        autor: { id: '4', nombre: 'Ana López' },
        fechaCreacion: new Date('2024-10-18'),
        categoria: { id: 'comunidad', nombre: 'Comunidad', emoji: '👥' },
        likes: 15,
        vistas: 203,
        userLiked: false,
        respuestas: [
            {
                id: 'r2',
                contenido: 'Sí Ana, el proyecto generará empleos tanto durante la construcción como en la operación. Habrá programas de capacitación técnica para la comunidad local.',
                autor: { id: '5', nombre: 'Diego Martínez' },
                fecha: new Date('2024-10-19'),
                likes: 6,
                userLiked: false
            },
            {
                id: 'r3',
                contenido: 'Además, se priorizará la contratación de mano de obra local. Te recomiendo estar atenta a las convocatorias que se publicarán próximamente.',
                autor: { id: '6', nombre: 'Patricia Herrera' },
                fecha: new Date('2024-10-20'),
                likes: 4,
                userLiked: false
            }
        ]
    }
])

// Computed properties
const preguntasFiltradas = computed(() => {
    let filtradas = [...preguntas.value]
    
    // Filtrar por categoría
    if (categoriaActiva.value !== 'todas') {
        filtradas = filtradas.filter(p => p.categoria.id === categoriaActiva.value)
    }
    
    // Ordenar
    switch (ordenActual.value) {
        case 'populares':
            filtradas.sort((a, b) => b.likes - a.likes)
            break
        case 'sin-responder':
            filtradas.sort((a, b) => a.respuestas.length - b.respuestas.length)
            break
        case 'recientes':
        default:
            filtradas.sort((a, b) => b.fechaCreacion.getTime() - a.fechaCreacion.getTime())
    }
    
    return filtradas
})

// Métodos
function verPregunta(pregunta: Pregunta) {
    pregunta.vistas++
    preguntaSeleccionada.value = pregunta
}

function cerrarPregunta() {
    preguntaSeleccionada.value = null
}

function cerrarModal() {
    mostrarModalPregunta.value = false
    nuevaPregunta.value = {
        titulo: '',
        contenido: '',
        categoriaId: '',
        autorNombre: ''
    }
}

function crearPregunta() {
    const categoria = categorias.value.find(c => c.id === nuevaPregunta.value.categoriaId)
    if (!categoria) return
    
    const nuevaP: Pregunta = {
        id: Date.now().toString(),
        titulo: nuevaPregunta.value.titulo,
        contenido: nuevaPregunta.value.contenido,
        autor: { id: Date.now().toString(), nombre: nuevaPregunta.value.autorNombre },
        fechaCreacion: new Date(),
        categoria,
        likes: 0,
        vistas: 1,
        respuestas: [],
        userLiked: false
    }
    
    preguntas.value.unshift(nuevaP)
    cerrarModal()
}

function crearRespuesta() {
    if (!preguntaSeleccionada.value) return
    
    const nuevaR: Respuesta = {
        id: Date.now().toString(),
        contenido: nuevaRespuesta.value.contenido,
        autor: { id: Date.now().toString(), nombre: nuevaRespuesta.value.autorNombre },
        fecha: new Date(),
        likes: 0,
        userLiked: false
    }
    
    preguntaSeleccionada.value.respuestas.push(nuevaR)
    nuevaRespuesta.value = { contenido: '', autorNombre: '' }
}

function toggleLike(pregunta: Pregunta) {
    if (pregunta.userLiked) {
        pregunta.likes--
        pregunta.userLiked = false
    } else {
        pregunta.likes++
        pregunta.userLiked = true
    }
}

function toggleLikeRespuesta(respuesta: Respuesta) {
    if (respuesta.userLiked) {
        respuesta.likes--
        respuesta.userLiked = false
    } else {
        respuesta.likes++
        respuesta.userLiked = true
    }
}

function formatearFecha(fecha: Date): string {
    return fecha.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short'
    })
}

function formatearFechaCompleta(fecha: Date): string {
    return fecha.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}
</script>

<style lang="sass" scoped>
@use '@sass/base' as *

.foro-container
    min-height: 100vh
    background: #f8f9fa

.foro-header
    background: linear-gradient(135deg, #10B981 0%, #059669 100%)
    color: white
    padding: 4rem 0
    text-align: center

    .titulo-foro
        font-size: 4rem
        font-weight: 700
        margin-bottom: 1rem

    .descripcion-foro
        font-size: 1.6rem
        margin-bottom: 3rem
        opacity: 0.9

    .btn-nueva-pregunta
        background: white
        color: #059669
        border: none
        padding: 1.2rem 3rem
        border-radius: 5rem
        font-weight: 600
        font-size: 1.4rem
        cursor: pointer
        transition: all 0.3s ease

        &:hover
            transform: translateY(-2px)
            box-shadow: 0 8px 20px rgba(255, 255, 255, 0.3)

.foro-contenido
    padding: 4rem 0

.filtros-foro
    display: flex
    justify-content: space-between
    align-items: center
    margin-bottom: 3rem
    gap: 2rem

.categorias
    display: flex
    gap: 1rem
    flex-wrap: wrap

.btn-categoria
    background: white
    border: 2px solid #e9ecef
    color: #6c757d
    padding: 0.8rem 1.5rem
    border-radius: 2rem
    font-size: 1.2rem
    cursor: pointer
    transition: all 0.3s ease

    &:hover
        border-color: #10B981
        color: #10B981

    &.activo
        background: #10B981
        border-color: #10B981
        color: white

.ordenamiento
    .select-orden
        background: white
        border: 2px solid #e9ecef
        padding: 0.8rem 1.2rem
        border-radius: 1rem
        font-size: 1.2rem
        cursor: pointer

.lista-preguntas
    display: flex
    flex-direction: column
    gap: 1.5rem

.tarjeta-pregunta
    background: white
    border-radius: 1.5rem
    padding: 2rem
    box-shadow: 0 2px 8px rgba(0,0,0,0.1)
    cursor: pointer
    transition: all 0.3s ease

    &:hover
        transform: translateY(-2px)
        box-shadow: 0 8px 20px rgba(0,0,0,0.15)

.pregunta-header
    display: flex
    justify-content: space-between
    align-items: center
    margin-bottom: 1rem

.categoria-badge
    background: #e3f2fd
    color: #1565c0
    padding: 0.4rem 1rem
    border-radius: 1rem
    font-size: 1rem
    font-weight: 500

.fecha
    color: #6c757d
    font-size: 1rem

.titulo-pregunta
    font-size: 1.8rem
    font-weight: 600
    color: #333
    margin-bottom: 0.8rem
    line-height: 1.3

.resumen-pregunta
    color: #6c757d
    font-size: 1.3rem
    line-height: 1.5
    margin-bottom: 1.5rem

.pregunta-footer
    display: flex
    justify-content: space-between
    align-items: center

.autor-info
    display: flex
    align-items: center
    gap: 0.8rem

.avatar
    width: 40px
    height: 40px
    background: #10B981
    color: white
    border-radius: 50%
    display: flex
    align-items: center
    justify-content: center
    font-weight: 600
    font-size: 1.2rem

.nombre-autor
    font-weight: 500
    color: #333

.stats-pregunta
    display: flex
    gap: 1.5rem

.stat
    display: flex
    align-items: center
    gap: 0.3rem
    color: #6c757d
    font-size: 1.1rem

.stat-numero
    font-weight: 600

// Modales
.modal-overlay
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    background: rgba(0,0,0,0.5)
    display: flex
    justify-content: center
    align-items: center
    z-index: 9999

.modal-contenido
    background: white
    border-radius: 2rem
    max-width: 600px
    width: 90%
    max-height: 90vh
    overflow-y: auto

    &.modal-pregunta
        max-width: 800px

.modal-header
    background: linear-gradient(135deg, #10B981 0%, #059669 100%)
    color: white
    padding: 2rem
    display: flex
    justify-content: space-between
    align-items: center
    border-radius: 2rem 2rem 0 0

    h2
        margin: 0
        font-size: 2rem

.btn-cerrar
    background: transparent
    border: 2px solid white
    color: white
    width: 40px
    height: 40px
    border-radius: 50%
    cursor: pointer
    font-size: 1.2rem

    &:hover
        background: white
        color: #059669

.form-pregunta,
.pregunta-detalle
    padding: 2rem

.campo
    margin-bottom: 1.5rem

    label
        display: block
        font-weight: 600
        margin-bottom: 0.5rem
        color: #333

.input-titulo,
.input-autor,
.select-categoria,
.textarea-contenido
    width: 100%
    padding: 1rem
    border: 2px solid #e9ecef
    border-radius: 1rem
    font-size: 1.2rem
    transition: border-color 0.3s ease

    &:focus
        outline: none
        border-color: #10B981

.modal-actions
    display: flex
    gap: 1rem
    justify-content: flex-end

.btn-cancelar
    background: #6c757d
    color: white
    padding: 1rem 2rem
    border: none
    border-radius: 1rem
    cursor: pointer

.btn-publicar,
.btn-responder
    background: #10B981
    color: white
    padding: 1rem 2rem
    border: none
    border-radius: 1rem
    cursor: pointer
    font-weight: 600

// Vista detallada de pregunta
.pregunta-detalle
    border-bottom: 1px solid #e9ecef

.titulo-completo
    font-size: 2.4rem
    font-weight: 700
    color: #333
    margin-bottom: 2rem
    line-height: 1.3

.autor-fecha
    display: flex
    justify-content: space-between
    align-items: center
    margin-bottom: 2rem

    .fecha-completa
        display: block
        color: #6c757d
        font-size: 1rem

.acciones-pregunta
    .btn-like
        background: #f8f9fa
        border: 2px solid #e9ecef
        color: #6c757d
        padding: 0.8rem 1.5rem
        border-radius: 2rem
        cursor: pointer
        transition: all 0.3s ease

        &:hover,
        &.liked
            background: #10B981
            border-color: #10B981
            color: white

.contenido-completo
    font-size: 1.4rem
    line-height: 1.6
    color: #333

.respuestas-seccion
    padding: 2rem

.titulo-respuestas
    font-size: 2rem
    font-weight: 600
    margin-bottom: 2rem
    color: #333

.lista-respuestas
    margin-bottom: 3rem

.tarjeta-respuesta
    background: #f8f9fa
    border-radius: 1.5rem
    padding: 1.5rem
    margin-bottom: 1.5rem

.respuesta-header
    display: flex
    justify-content: space-between
    align-items: center
    margin-bottom: 1rem

    .fecha-respuesta
        display: block
        color: #6c757d
        font-size: 0.9rem

.btn-like-respuesta
    background: transparent
    border: 1px solid #e9ecef
    color: #6c757d
    padding: 0.5rem 1rem
    border-radius: 1.5rem
    cursor: pointer
    font-size: 0.9rem

    &:hover,
    &.liked
        background: #10B981
        border-color: #10B981
        color: white

.contenido-respuesta
    font-size: 1.3rem
    line-height: 1.5
    color: #333

.nueva-respuesta
    border-top: 1px solid #e9ecef
    padding-top: 2rem

    h4
        font-size: 1.6rem
        margin-bottom: 1.5rem
        color: #333

.form-respuesta
    .textarea-respuesta
        width: 100%
        padding: 1rem
        border: 2px solid #e9ecef
        border-radius: 1rem
        font-size: 1.2rem
        resize: vertical
        min-height: 100px

        &:focus
            outline: none
            border-color: #10B981

// Responsive
@media screen and (max-width: 1000px)
    .filtros-foro
        flex-direction: column
        align-items: stretch
        gap: 1.5rem

    .categorias
        justify-content: center

@media screen and (max-width: 768px)
    .foro-header
        padding: 3rem 1rem

        .titulo-foro
            font-size: 3rem

        .descripcion-foro
            font-size: 1.4rem

    .foro-contenido
        padding: 2rem 1rem

    .tarjeta-pregunta
        padding: 1.5rem

    .pregunta-footer
        flex-direction: column
        gap: 1rem
        align-items: flex-start

    .modal-contenido
        width: 95%
        margin: 1rem

        &.modal-pregunta
            max-width: 95%

    .form-pregunta,
    .pregunta-detalle,
    .respuestas-seccion
        padding: 1.5rem

@media screen and (max-width: 480px)
    .categorias
        gap: 0.5rem

    .btn-categoria
        padding: 0.6rem 1rem
        font-size: 1rem

    .titulo-pregunta
        font-size: 1.5rem

    .stats-pregunta
        gap: 1rem

    .autor-fecha
        flex-direction: column
        gap: 1rem
        align-items: flex-start
</style>