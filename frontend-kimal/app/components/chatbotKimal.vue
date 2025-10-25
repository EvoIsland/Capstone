<template>
  <div class="chatbot-container">
    <div class="chatbot-header">
      <div class="bot-info">
        <div class="bot-avatar">
          <img src="/images/logokimal.svg" alt="KIMAL Bot" />
        </div>
        <div class="bot-details">
          <h3>KIMAL Assistant</h3>
          <span class="status">Asistente de Conexiones Rurales</span>
        </div>
      </div>
      <button class="close-btn" @click="$emit('cerrar')">✕</button>
    </div>

    <div class="chat-messages" ref="messagesContainer">
      <div
        v-for="mensaje in mensajes"
        :key="mensaje.id"
        :class="['mensaje', mensaje.tipo]"
      >
        <div class="mensaje-content">
          <p v-html="mensaje.texto"></p>
          <span class="timestamp">{{ formatearHora(mensaje.timestamp) }}</span>
        </div>
      </div>

      <div v-if="escribiendo" class="mensaje bot">
        <div class="mensaje-content escribiendo">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>

    <div class="chat-input">
      <div class="sugerencias" v-if="mostrarSugerencias">
        <button
          v-for="sugerencia in sugerenciasActuales"
          :key="sugerencia"
          @click="enviarSugerencia(sugerencia)"
          class="sugerencia-btn"
        >
          {{ sugerencia }}
        </button>
      </div>

      <!-- CTA para derivar al Agente IA cuando el bot normal no tiene respuesta específica -->
      <div v-if="ofrecerAgente" class="mt-2">
        <button
          class="sugerencia-btn"
          style="background:#e8f5e9;border-color:#10B981"
          @click="showAgent = true"
        >
          🤖 ¿Necesitas más detalle? Hablar con Agente IA
        </button>
      </div>

      <div class="input-container">
        <input
          v-model="mensajeActual"
          @keyup.enter="enviarMensaje"
          @input="actualizarSugerencias"
          placeholder="Pregunta sobre conexiones KIMAL..."
          class="message-input"
          :disabled="escribiendo"
        />
        <button
          @click="enviarMensaje"
          :disabled="!mensajeActual.trim() || escribiendo"
          class="send-btn"
        >
          ➤
        </button>
      </div>
    </div>

    <!-- Mini-chat del Agente IA (embebido) -->
    <div v-if="showAgent" class="mt-3" style="padding: 0 1rem 1rem;">
      <AgenteKimal :initialQuestion="ultimaPreguntaUsuario" />
      <div class="mt-2">
        <button class="sugerencia-btn" @click="showAgent = false">
          Cerrar Agente IA
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import AgenteKimal from './ui/AgenteKimal.vue' // ⬅️ mini-chat IA (ruta relativa)

defineEmits(['cerrar'])

interface Mensaje {
  id: number
  texto: string
  tipo: 'usuario' | 'bot'
  timestamp: Date
}

const mensajes = ref<Mensaje[]>([])
const mensajeActual = ref('')
const escribiendo = ref(false)
const messagesContainer = ref<HTMLElement>()
const mostrarSugerencias = ref(true)
const sugerenciasActuales = ref<string[]>([])

/** 🔀 Estados para handoff al Agente IA */
const showAgent = ref(false)              // abre/cierra el mini-chat IA
const ofrecerAgente = ref(false)          // muestra el CTA “Hablar con Agente IA”
const ultimaPreguntaUsuario = ref('')     // pasamos la última pregunta al agente

// Base de conocimiento estructurada de KIMAL
const baseConocimientoKimal = {
  proyecto: {
    nombre: 'KIMAL',
    descripcion:
      'Proyecto de conectividad rural que lleva internet de alta velocidad a zonas rurales de Chile',
    objetivo:
      'Reducir la brecha digital en comunidades apartadas mediante tecnología de microondas',
    mision: 'Conectar Chile rural con tecnología de vanguardia'
  },

  cobertura: {
    regiones: [
      {
        nombre: 'Región Metropolitana',
        comunas: ['Lampa', 'Pudahuel', 'Til Til'],
        instalaciones: 3
      },
      {
        nombre: 'Región de Valparaíso',
        comunas: ['Cabildo', 'Catemu', 'La Ligua', 'LlayLlay', 'Panquehue', 'Petorca'],
        instalaciones: 6
      },
      {
        nombre: 'Región de Coquimbo',
        comunas: [
          'Andacollo',
          'Combarbalá',
          'Canela',
          'Illapel',
          'La Higuera',
          'La Serena',
          'Los Vilos',
          'Ovalle',
          'Punitaqui',
          'Río Hurtado',
          'Vicuña'
        ],
        instalaciones: 11
      },
      {
        nombre: 'Atacama',
        comunas: ['Diego de Almagro', 'Tierra Amarilla', 'Vallenar', 'Copiapó'],
        instalaciones: 4
      },
      {
        nombre: 'Antofagasta',
        comunas: ['Antofagasta', 'María Elena', 'Sierra Gorda', 'Taltal'],
        instalaciones: 4
      }
    ],
    total_instalaciones: 28,
    total_regiones: 5
  },

  tecnologia: {
    tipo: 'Microondas punto a punto',
    velocidad_maxima: '100 Mbps',
    alcance: 'Hasta 50 km por enlace',
    equipos: ['Torres de alta ganancia', 'Radios certificados', 'Sistemas de energía respaldados'],
    ventajas: [
      'No requiere fibra óptica',
      'Instalación rápida',
      'Costo-efectivo en zonas rurales',
      'Alta disponibilidad'
    ],
    monitoreo: '24/7 con alertas automáticas'
  },

  servicios: {
    internet: {
      velocidades: ['10 Mbps', '25 Mbps', '50 Mbps', '100 Mbps'],
      latencia: 'Menor a 20ms',
      disponibilidad: '99.5% uptime garantizado'
    },
    soporte: {
      telefono: '600-KIMAL-1',
      email: 'soporte@kimal.cl',
      horario: 'Lunes a Viernes 08:00 - 18:00',
      emergencias: '24/7 vía WhatsApp +56 9 8765 4321',
      tiempo_respuesta: 'Máximo 4 horas'
    }
  },

  beneficios: {
    economicos: ['Desarrollo de emprendimientos locales', 'Comercio electrónico', 'Trabajo remoto'],
    sociales: ['Educación online', 'Telemedicina', 'Conectividad familiar'],
    tecnicos: ['Conexión estable', 'Baja latencia', 'Escalabilidad']
  },

  problemas_comunes: {
    conectividad: {
      sintomas: ['Internet lento', 'Cortes frecuentes', 'No hay conexión'],
      causas: ['Clima adverso', 'Problemas de equipos', 'Mantenimiento'],
      soluciones: ['Reiniciar equipos', 'Verificar cables', 'Contactar soporte']
    }
  }
}

const sugerenciasComunes = [
  '¿Qué es exactamente Kimal-Lo Aguirre.?',
  '¿En qué regiones tienen cobertura?',
  'Explícame cómo funciona su tecnología',
  'Tengo problemas con mi conexión',
  '¿Cuáles son los beneficios de KIMAL?',
  '¿Cómo puedo contactarlos?',
  '¿Qué velocidades de internet ofrecen?',
  '¿Atienden en mi región?'
]

let contadorMensajes = 0

// (Tu función enviarAGeminiPro sigue igual, la dejamos como está en tu versión)

// Función de respaldo local para casos de error
function generarRespuestaLocal(mensaje: string): string {
  const mensajeLower = mensaje.toLowerCase()

  if (mensajeLower.includes('kimal') || mensajeLower.includes('qué es') || mensajeLower.includes('que es')) {
    return `KIMAL es nuestro proyecto de conectividad rural que lleva internet de alta velocidad a 28 instalaciones en 5 regiones de Chile usando tecnología de microondas.<br/><br/>Para más información detallada:<br/>📞 <strong>600-KIMAL-1</strong><br/>📧 <strong>soporte@kimal.cl</strong>`
  }

  if (mensajeLower.includes('cobertura') || mensajeLower.includes('regiones') || mensajeLower.includes('donde')) {
    return `KIMAL tiene cobertura en:<br/>• Región Metropolitana (3 instalaciones)<br/>• Región de Valparaíso (6 instalaciones)<br/>• Región de Coquimbo (11 instalaciones)<br/>• Región de Atacama (4 instalaciones)<br/>• Región de Antofagasta (4 instalaciones)<br/><br/>📞 <strong>600-KIMAL-1</strong> para consultas específicas de tu zona.`
  }

  if (mensajeLower.includes('problema') || mensajeLower.includes('ayuda') || mensajeLower.includes('soporte')) {
    return `Para soporte técnico inmediato:<br/>📞 <strong>600-KIMAL-1</strong><br/>📧 <strong>soporte@kimal.cl</strong><br/>🕒 Lunes a Viernes 08:00-18:00<br/>🚨 Emergencias: WhatsApp +56 9 8765 4321 (24/7)<br/><br/>Pasos básicos:<br/>1. Reinicia tu router (30 segundos desconectado)<br/>2. Verifica cables de conexión<br/>3. Si persiste, contacta soporte`
  }

  return `No puedo procesar tu consulta en este momento. Para asistencia inmediata:<br/><br/>📞 <strong>600-KIMAL-1</strong><br/>📧 <strong>soporte@kimal.cl</strong><br/>🕒 Horario: Lunes a Viernes 08:00-18:00<br/><br/>¿Hay algo específico sobre conectividad KIMAL en lo que pueda ayudarte?`
}

function analizarIntencion(pregunta: string): string {
  const preguntaLower = pregunta.toLowerCase()

  const preguntaNormalizada = preguntaLower.replace(/[¿?¡!.,;:]/g, ' ').replace(/\s+/g, ' ').trim()
  const palabras = preguntaNormalizada.split(' ')

  if (preguntaLower.includes('qué es') || preguntaLower.includes('que es') || palabras.includes('kimal')) {
    return generarRespuestaProyecto(pregunta)
  }
  if (palabras.some(p => ['donde', 'dónde', 'ubicación', 'cobertura', 'regiones', 'comunas'].includes(p))) {
    return generarRespuestaCobertura(pregunta)
  }
  if (palabras.some(p => ['como', 'cómo', 'funciona', 'tecnología', 'microondas', 'velocidad'].includes(p))) {
    return generarRespuestaTecnologia(pregunta)
  }
  if (palabras.some(p => ['problema', 'falla', 'lento', 'corte', 'no funciona', 'ayuda'].includes(p))) {
    return generarRespuestaProblemas(pregunta)
  }
  if (palabras.some(p => ['contacto', 'teléfono', 'email', 'soporte', 'llamar'].includes(p))) {
    return generarRespuestaContacto(pregunta)
  }
  if (palabras.some(p => ['beneficios', 'ventajas', 'por qué', 'porque', 'para qué'].includes(p))) {
    return generarRespuestaBeneficios(pregunta)
  }

  const regionMencionada = buscarRegionEnPregunta(pregunta)
  if (regionMencionada) {
    return generarRespuestaRegionEspecifica(regionMencionada, pregunta)
  }

  return generarRespuestaGenerica(pregunta)
}

function generarRespuestaProyecto(pregunta: string): string {
  const respuestas = [
    `¡Excelente pregunta! KIMAL es nuestro proyecto estrella de conectividad rural. Nos especializamos en llevar internet de alta velocidad a comunidades rurales de Chile que tradicionalmente han estado desconectadas.`,
    `Te cuento sobre KIMAL: Es una iniciativa innovadora que utiliza tecnología de microondas para conectar zonas rurales donde la fibra óptica no es viable. Nuestro objetivo principal es reducir la brecha digital.`,
    `KIMAL representa la democratización del internet en Chile rural. Trabajamos con tecnología de microondas punto a punto para ofrecer conexiones estables y rápidas en lugares donde antes era imposible.`
  ]

  const respuestaBase = respuestas[Math.floor(Math.random() * respuestas.length)]

  return `${respuestaBase}<br/><br/>
    <strong>Datos clave de KIMAL:</strong><br/>
    🌐 ${baseConocimientoKimal.cobertura.total_instalaciones} instalaciones activas<br/>
    📍 Presencia en ${baseConocimientoKimal.cobertura.total_regiones} regiones<br/>
    ⚡ Velocidades hasta ${baseConocimientoKimal.tecnologia.velocidad_maxima}<br/>
    🎯 Misión: ${baseConocimientoKimal.proyecto.mision}`
}

function generarRespuestaCobertura(pregunta: string): string {
  const preguntaLower = pregunta.toLowerCase()

  let respuestaIntro = ''
  if (preguntaLower.includes('donde') || preguntaLower.includes('dónde')) {
    respuestaIntro = 'Te explico dónde puedes encontrar KIMAL:'
  } else if (preguntaLower.includes('cobertura')) {
    respuestaIntro = 'Nuestra cobertura actual incluye:'
  } else {
    respuestaIntro = 'KIMAL está presente en las siguientes ubicaciones:'
  }

  let respuesta = `${respuestaIntro}<br/><br/>`

  baseConocimientoKimal.cobertura.regiones.forEach(region => {
    respuesta += `<strong>${region.nombre}</strong><br/>`
    respuesta += `📍 ${region.instalaciones} instalaciones en: ${region.comunas.join(', ')}<br/><br/>`
  })

  respuesta += `<strong>Resumen de cobertura:</strong><br/>
    🗺️ Total: ${baseConocimientoKimal.cobertura.total_instalaciones} instalaciones activas<br/>
    📍 Distribuidas en ${baseConocimientoKimal.cobertura.total_regiones} regiones de Chile<br/>
    🎯 Enfoque: Comunidades rurales prioritarias`

  return respuesta
}

function generarRespuestaTecnologia(pregunta: string): string {
  const preguntaLower = pregunta.toLowerCase()

  let enfoque = ''
  if (preguntaLower.includes('como') || preguntaLower.includes('cómo')) {
    enfoque = 'Te explico cómo funciona nuestra tecnología:'
  } else if (preguntaLower.includes('velocidad')) {
    enfoque = 'Sobre las velocidades que ofrecemos:'
  } else {
    enfoque = 'Nuestra tecnología se basa en:'
  }

  return `${enfoque}<br/><br/>
    <strong>🔧 Tecnología ${baseConocimientoKimal.tecnologia.tipo}</strong><br/>
    • Conexiones punto a punto sin necesidad de fibra óptica<br/>
    • Alcance de hasta ${baseConocimientoKimal.tecnologia.alcance}<br/>
    • Velocidades de hasta ${baseConocimientoKimal.tecnologia.velocidad_maxima}<br/><br/>

    <strong>⚡ Velocidades disponibles:</strong><br/>
    ${baseConocimientoKimal.servicios.internet.velocidades.map(v => `• ${v}`).join('<br/>')}<br/><br/>

    <strong>✅ Ventajas clave:</strong><br/>
    ${baseConocimientoKimal.tecnologia.ventajas.map(v => `• ${v}`).join('<br/>')}<br/><br/>

    <strong>📊 Garantías de servicio:</strong><br/>
    • Latencia: ${baseConocimientoKimal.servicios.internet.latencia}<br/>
    • Disponibilidad: ${baseConocimientoKimal.servicios.internet.disponibilidad}<br/>
    • Monitoreo: ${baseConocimientoKimal.tecnologia.monitoreo}`
}

function generarRespuestaProblemas(pregunta: string): string {
  const preguntaLower = pregunta.toLowerCase()

  let intro = ''
  if (preguntaLower.includes('lento')) {
    intro = 'Entiendo que tienes problemas de velocidad. Te ayudo a solucionarlo:'
  } else if (preguntaLower.includes('no funciona') || preguntaLower.includes('corte')) {
    intro = 'Problemas de conectividad pueden ser frustrantes. Sigamos estos pasos:'
  } else {
    intro = 'Te guío para resolver problemas técnicos comunes:'
  }

  return `${intro}<br/><br/>
    <strong>🔍 Diagnóstico rápido:</strong><br/>
    1. <strong>Verifica tu equipo:</strong> Luces del router encendidas<br/>
    2. <strong>Reinicia el sistema:</strong> Desconecta 30 segundos y vuelve a conectar<br/>
    3. <strong>Revisa el clima:</strong> Lluvia intensa puede afectar temporalmente<br/>
    4. <strong>Verifica cables:</strong> Conexiones firmes y sin daños<br/><br/>

    <strong>⚠️ Factores que pueden afectar:</strong><br/>
    ${baseConocimientoKimal.problemas_comunes.conectividad.causas.map(c => `• ${c}`).join('<br/>')}<br/><br/>

    <strong>📞 Si el problema persiste:</strong><br/>
    • Llama a: <strong>${baseConocimientoKimal.servicios.soporte.telefono}</strong><br/>
    • Email: <strong>${baseConocimientoKimal.servicios.soporte.email}</strong><br/>
    • Emergencias 24/7: <strong>${baseConocimientoKimal.servicios.soporte.emergencias}</strong><br/>
    • Tiempo de respuesta: ${baseConocimientoKimal.servicios.soporte.tiempo_respuesta}`
}

function generarRespuestaContacto(pregunta: string): string {
  return `¡Por supuesto! Aquí tienes todos nuestros canales de contacto:<br/><br/>

    <strong>📞 Soporte Técnico Principal:</strong><br/>
    • Teléfono: <strong>${baseConocimientoKimal.servicios.soporte.telefono}</strong><br/>
    • Horario: ${baseConocimientoKimal.servicios.soporte.horario}<br/><br/>

    <strong>📧 Contacto por Email:</strong><br/>
    • ${baseConocimientoKimal.servicios.soporte.email}<br/>
    • Respuesta garantizada en ${baseConocimientoKimal.servicios.soporte.tiempo_respuesta}<br/><br/>

    <strong>🚨 Emergencias 24/7:</strong><br/>
    • WhatsApp: ${baseConocimientoKimal.servicios.soporte.emergencias}<br/>
    • Para cortes críticos y problemas urgentes<br/><br/>

    <strong>💡 Tip:</strong> Para consultas técnicas, tener a mano tu número de instalación acelera el proceso.`
}

function generarRespuestaBeneficios(pregunta: string): string {
  return `¡Excelente pregunta! KIMAL transforma la vida rural de múltiples maneras:<br/><br/>

    <strong>💼 Beneficios Económicos:</strong><br/>
    ${baseConocimientoKimal.beneficios.economicos.map(b => `• ${b}`).join('<br/>')}<br/><br/>

    <strong>👥 Impacto Social:</strong><br/>
    ${baseConocimientoKimal.beneficios.sociales.map(b => `• ${b}`).join('<br/>')}<br/><br/>

    <strong>⚙️ Ventajas Técnicas:</strong><br/>
    ${baseConocimientoKimal.beneficios.tecnicos.map(b => `• ${b}`).join('<br/>')}<br/><br/>

    <strong>🎯 Impacto Real:</strong><br/>
    Conectamos comunidades que antes estaban aisladas digitalmente, permitiendo que participen plenamente en la economía digital del siglo XXI.`
}

function generarRespuestaPrecios(pregunta: string): string {
  return `Te entiendo, la información de precios es importante. Para ofrecerte la tarifa más adecuada, necesitamos evaluar tu ubicación específica y necesidades.<br/><br/>

    <strong>📋 Factores que influyen en el precio:</strong><br/>
    • Ubicación geográfica<br/>
    • Velocidad requerida (${baseConocimientoKimal.servicios.internet.velocidades.join(', ')})<br/>
    • Tipo de instalación necesaria<br/>
    • Distancia a nuestros puntos de enlace<br/><br/>

    <strong>💰 Para cotización personalizada:</strong><br/>
    📞 Llama a: <strong>${baseConocimientoKimal.servicios.soporte.telefono}</strong><br/>
    📧 Email: <strong>${baseConocimientoKimal.servicios.soporte.email}</strong><br/><br/>

    <strong>✅ Garantizamos:</strong><br/>
    • Cotización sin compromiso<br/>
    • Evaluación técnica gratuita<br/>
    • Instalación profesional incluida`
}

function buscarRegionEnPregunta(pregunta: string): any {
  const preguntaLower = pregunta.toLowerCase()
  return baseConocimientoKimal.cobertura.regiones.find(region => {
    if (preguntaLower.includes(region.nombre.toLowerCase())) return true
    return region.comunas.some(comuna => preguntaLower.includes(comuna.toLowerCase()))
  })
}

function generarRespuestaRegionEspecifica(region: any, _pregunta: string): string {
  return `¡Perfecto! Te cuento sobre KIMAL en <strong>${region.nombre}</strong>:<br/><br/>

    <strong>📍 Cobertura actual:</strong><br/>
    • ${region.instalaciones} instalaciones activas<br/>
    • Comunas conectadas: ${region.comunas.join(', ')}<br/><br/>

    <strong>🌐 Servicios disponibles:</strong><br/>
    • Velocidades: ${baseConocimientoKimal.servicios.internet.velocidades.join(', ')}<br/>
    • Latencia: ${baseConocimientoKimal.servicios.internet.latencia}<br/>
    • Disponibilidad: ${baseConocimientoKimal.servicios.internet.disponibilidad}<br/><br/>

    <strong>📞 Para más información específica de tu comuna:</strong><br/>
    Llama a ${baseConocimientoKimal.servicios.soporte.telefono} y menciona tu ubicación exacta para una evaluación personalizada.`
}

function generarRespuestaGenerica(_pregunta: string): string {
  // 🔔 Señalizamos que hay que ofrecer el Agente IA
  ofrecerAgente.value = true

  const respuestasGenericas = [
    `Interesante pregunta. Aunque no tengo información específica sobre eso, puedo ayudarte con todo lo relacionado a KIMAL:`,
    `No tengo datos específicos sobre esa consulta, pero soy experto en conectividad rural KIMAL. Te puedo ayudar con:`,
    `Esa pregunta está fuera de mi especialización en KIMAL, pero puedo asistirte con:`
  ]

  const respuestaBase =
    respuestasGenericas[Math.floor(Math.random() * respuestasGenericas.length)]

  return `${respuestaBase}<br/><br/>
    ✅ <strong>Información sobre cobertura y regiones</strong><br/>
    ✅ <strong>Detalles técnicos de nuestra tecnología</strong><br/>
    ✅ <strong>Soporte para problemas de conexión</strong><br/>
    ✅ <strong>Contactos y canales de ayuda</strong><br/>
    ✅ <strong>Beneficios de nuestros servicios</strong><br/><br/>

    Para consultas fuera de KIMAL, te recomiendo contactar directamente:<br/>
    📞 <strong>${baseConocimientoKimal.servicios.soporte.telefono}</strong><br/>
    📧 <strong>${baseConocimientoKimal.servicios.soporte.email}</strong>`
}

function generarRespuesta(pregunta: string): string {
  return analizarIntencion(pregunta)
}

function agregarMensaje(texto: string, tipo: 'usuario' | 'bot') {
  const mensaje: Mensaje = {
    id: ++contadorMensajes,
    texto,
    tipo,
    timestamp: new Date()
  }
  mensajes.value.push(mensaje)
  nextTick(scrollToBottom)
}

async function enviarMensaje() {
  if (!mensajeActual.value.trim() || escribiendo.value) return

  const pregunta = mensajeActual.value.trim()
  ultimaPreguntaUsuario.value = pregunta       // 🔹 guardamos última pregunta para el agente
  mensajeActual.value = ''
  mostrarSugerencias.value = false
  ofrecerAgente.value = true                 // 🔹 reseteamos; se activará en genérica

  // Usuario
  agregarMensaje(pregunta, 'usuario')

  // "Escribiendo…"
  escribiendo.value = true

  try {
    // Por ahora usar sistema local (puedes cambiar a tu API cuando quieras)
    const respuesta = generarRespuestaLocal(pregunta)

    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    escribiendo.value = false
    agregarMensaje(respuesta, 'bot')
  } catch (error) {
    console.error('Error generando respuesta:', error)
    escribiendo.value = false
    agregarMensaje(
      'Disculpa, tengo problemas técnicos temporales. Para asistencia inmediata, contacta:<br/>📞 <strong>600-KIMAL-1</strong><br/>📧 <strong>soporte@kimal.cl</strong>',
      'bot'
    )
  }
}

function enviarSugerencia(sugerencia: string) {
  mensajeActual.value = sugerencia
  enviarMensaje()
}

function actualizarSugerencias() {
  if (mensajeActual.value.length === 0) {
    mostrarSugerencias.value = true
    sugerenciasActuales.value = sugerenciasComunes
  } else {
    mostrarSugerencias.value = false
  }
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

function formatearHora(timestamp: Date): string {
  return timestamp.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  const mensajesBienvenida: string[] = [
    '¡Hola! Soy el asistente especializado de KIMAL 🌐<br/><br/>Tengo toda la información sobre nuestro proyecto de conectividad rural: 28 instalaciones, 5 regiones, tecnología de microondas y soporte técnico.<br/><br/>¿En qué puedo ayudarte?',
    '¡Bienvenido al soporte KIMAL! 📡<br/><br/>Soy tu asistente experto en conectividad rural. Puedo ayudarte con información de cobertura, problemas técnicos, contactos y todo sobre nuestras instalaciones en Chile.<br/><br/>¿Qué necesitas saber?',
    '¡Hola! Soy el bot especialista en KIMAL ⚡<br/><br/>Estoy aquí para resolver tus dudas sobre internet rural, nuestras 28 instalaciones activas, planes de velocidad y soporte técnico 24/7.<br/><br/>¿Cómo puedo asistirte?'
  ]

  const indiceRandom = Math.floor(Math.random() * mensajesBienvenida.length)
  const mensajeRandom = mensajesBienvenida[indiceRandom] as string

  agregarMensaje(mensajeRandom, 'bot')
  sugerenciasActuales.value = sugerenciasComunes
})
</script>

<style lang="sass" scoped>
.chatbot-container
  position: fixed
  bottom: 20px
  right: 20px
  width: 400px
  height: 600px
  background: white
  border-radius: 1rem
  box-shadow: 0 10px 30px rgba(0,0,0,0.2)
  display: flex
  flex-direction: column
  z-index: 2000
  overflow: hidden

.chatbot-header
  background: linear-gradient(135deg, #10B981 0%, #059669 100%)
  color: white
  padding: 1rem
  display: flex
  align-items: center
  justify-content: space-between

.bot-info
  display: flex
  align-items: center
  gap: 0.75rem

.bot-avatar
  width: 40px
  height: 40px
  border-radius: 50%
  background: white
  display: flex
  align-items: center
  justify-content: center
  padding: 8px

  img
    width: 100%
    height: auto

.bot-details
  h3
    margin: 0
    font-size: 1rem
    font-weight: 600

  .status
    font-size: 0.8rem
    opacity: 0.9

.close-btn
  background: rgba(255,255,255,0.2)
  border: none
  color: white
  width: 32px
  height: 32px
  border-radius: 50%
  cursor: pointer
  display: flex
  align-items: center
  justify-content: center
  transition: background 0.2s

  &:hover
    background: rgba(255,255,255,0.3)

.chat-messages
  flex: 1
  padding: 1rem
  overflow-y: auto
  display: flex
  flex-direction: column
  gap: 1rem

.mensaje
  display: flex

  &.usuario
    justify-content: flex-end

    .mensaje-content
      background: #10B981
      color: white
      margin-left: 2rem

  &.bot
    justify-content: flex-start

    .mensaje-content
      background: #f3f4f6
      color: #374151
      margin-right: 2rem

.mensaje-content
  max-width: 85%
  padding: 0.75rem 1rem
  border-radius: 1rem
  position: relative

  p
    margin: 0
    line-height: 1.4
    font-size: 0.9rem

  .timestamp
    font-size: 0.7rem
    opacity: 0.7
    margin-top: 0.5rem
    display: block

  &.escribiendo
    background: #f3f4f6
    padding: 1rem

.typing-indicator
  display: flex
  gap: 4px
  align-items: center

  span
    width: 8px
    height: 8px
    border-radius: 50%
    background: #9ca3af
    animation: typing 1.4s infinite ease-in-out

    &:nth-child(1)
      animation-delay: -0.32s

    &:nth-child(2)
      animation-delay: -0.16s

@keyframes typing
  0%, 80%, 100%
    transform: scale(0.8)
    opacity: 0.5
  40%
    transform: scale(1)
    opacity: 1

.chat-input
  border-top: 1px solid #e5e7eb
  padding: 1rem

.sugerencias
  display: flex
  flex-wrap: wrap
  gap: 0.5rem
  margin-bottom: 1rem

.sugerencia-btn
  background: #f3f4f6
  border: 1px solid #e5e7eb
  padding: 0.5rem 0.75rem
  border-radius: 1rem
  font-size: 0.8rem
  cursor: pointer
  transition: all 0.2s

  &:hover
    background: #10B981
    color: white
    border-color: #10B981

.input-container
  display: flex
  gap: 0.5rem

.message-input
  flex: 1
  padding: 0.75rem
  border: 2px solid #e5e7eb
  border-radius: 1rem
  font-size: 0.9rem
  outline: none
  transition: border-color 0.2s

  &:focus
    border-color: #10B981

  &:disabled
    background: #f9fafb
    color: #9ca3af

.send-btn
  background: #10B981
  color: white
  border: none
  padding: 0.75rem 1rem
  border-radius: 1rem
  cursor: pointer
  transition: background 0.2s
  display: flex
  align-items: center
  justify-content: center

  &:hover:not(:disabled)
    background: #059669

  &:disabled
    background: #d1d5db
    cursor: not-allowed

/* Responsive */
@media screen and (max-width: 768px)
  .chatbot-container
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    width: 100%
    height: 100%
    border-radius: 0

  .sugerencias
    flex-direction: column

  .sugerencia-btn
    text-align: left
</style>
