<template>
  <div class="header-wrapper">
    
    <!-- Barra de Navegación Flotante -->
    <div :class="['navbar-overlay', { 'is-scrolled': navbarScrolled }]">
      <nav class="navbar-container">
        
        <!-- 1. Marca / Logo -->
        <div class="brand">
          <span class="brand-text">MiConexion<span class="brand-highlight">Kimal</span></span>
        </div>

        <!-- 2. Navegación Central -->
        <div class="nav-links">
          <NuxtLink
            v-for="item in navItems" 
            :key="item.id"
            :to="item.route"
            :class="['nav-item']"
            active-class="active"
          >
            <!-- Renderizado de SVG directo -->
            <span class="nav-icon-wrapper" v-html="item.icon"></span>
            <span class="nav-label">{{ item.label }}</span>
            
            <!-- Indicador de activo (punto sutil) -->
            <div class="active-dot"></div>
          </NuxtLink>
        </div>

      </nav>
    </div>

    <!-- Espaciador para compensar el header fixed -->
    <div v-if="!isMapRoute" class="header-spacer"></div>

    <!-- Contenido inyectado (Slots) -->
    <div class="content-slot">
      <slot />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from '#app'

const router = useRouter()
const route = useRoute()
const isScrolled = ref(false)

// Detectar si estamos en la ruta del mapa
const isMapRoute = computed(() => route.path === '/mapa' || route.path === '/')

// El navbar debe verse como scrolleado si estamos en el mapa O si realmente se hizo scroll
const navbarScrolled = computed(() => isMapRoute.value || isScrolled.value)

// Configuración de Navegación con SVGs modernos (Estilo Lucide/Heroicons)
const navItems = [
  { 
    id: 'intro', 
    label: 'Intro',
    route: '/intro',
    // Icono Home
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`
  },
  { 
    id: 'mapa', 
    label: 'Mapa',
    route: '/',
    // Icono Mapa/Pin
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>`
  },
  { 
    id: 'ia', 
    label: 'Agente IA',
    route: '/ai',
    // Icono Bot/Sparkles
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>`
  }
]

// Métodos
function handleScroll() {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* --- LAYOUT GENERAL --- */
.header-wrapper {
  position: relative;
  width: 100%;
  font-family: 'Inter', sans-serif;
}

.header-spacer {
  height: 100px;
}

/* --- NAVBAR FLOTANTE (Overlay) --- */
.navbar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  padding: 1.5rem;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  pointer-events: none;
}

/* --- CONTENEDOR PÍLDORA --- */
.navbar-container {
  pointer-events: auto;
  max-width: 700px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-radius: 100px;
  padding: 0.6rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.05), 
    0 10px 15px -3px rgba(0, 0, 0, 0.05),
    0 0 0 1px rgba(0,0,0,0.02);
    
  transition: all 0.4s ease;
}

/* --- ESTADO SCROLLED --- */
.navbar-overlay.is-scrolled {
  padding: 0.5rem;
}

.navbar-overlay.is-scrolled .navbar-container {
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

/* --- BRAND / LOGO --- */
.brand {
  display: flex;
  align-items: center;
  padding-right: 1.5rem;
  border-right: 1px solid #f3f4f6;
}

.brand-text {
  font-size: 1.2rem;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.03em;
  user-select: none;
}

.brand-highlight {
  color: #7C3AED; /* Morado Kimal */
}

/* --- NAVEGACIÓN (LINKS) --- */
.nav-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  justify-content: flex-end;
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  text-decoration: none;
  color: #6b7280;
  font-weight: 500;
  font-size: 0.95rem;
  border-radius: 100px;
  transition: all 0.2s ease;
}

/* Hover */
.nav-item:hover {
  color: #111827;
  background: rgba(0, 0, 0, 0.03);
}

/* Estado Activo */
.nav-item.active {
  color: #7C3AED;
  background: rgba(124, 58, 237, 0.05);
  font-weight: 600;
}

/* Iconos SVG */
.nav-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  transition: transform 0.2s;
}

/* Hacemos que el SVG herede el color del texto */
.nav-icon-wrapper :deep(svg) {
  width: 100%;
  height: 100%;
  stroke-width: 2;
}

.nav-item:hover .nav-icon-wrapper {
  transform: scale(1.1);
}

/* Punto indicador activo */
.active-dot {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background-color: #7C3AED;
  border-radius: 50%;
  box-shadow: 0 0 4px rgba(124, 58, 237, 0.5);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.nav-item.active .active-dot {
  opacity: 1;
}

/* --- RESPONSIVE --- */
@media (max-width: 640px) {
  .navbar-container {
    padding: 0.5rem 1rem;
    max-width: 95%;
  }
  
  .brand {
    border-right: none;
    padding-right: 0.5rem;
  }
  
  .brand-text {
    font-size: 1.1rem;
  }
  
  .nav-label {
    display: none; /* Solo iconos en móvil para ahorrar espacio */
  }
  
  .nav-item {
    padding: 0.6rem;
  }
  
  .active-dot {
    bottom: 2px;
  }
}
</style>