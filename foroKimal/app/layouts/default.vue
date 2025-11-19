<template>
  <div class="header-wrapper">
    
    <!-- Barra de Navegación Flotante -->
    <div :class="['navbar-overlay', { 'is-scrolled': isScrolled }]">
      <div class="navbar-container">
        
        <!-- 1. Logo / Marca -->
        <div class="brand">
          <span class="brand-text">MiConexion<span class="brand-highlight">Kimal</span></span>
        </div>

        <template v-if="isLoggedIn">
          <!-- 2. Pestañas Centrales (Tabs) -->
          <div class="nav-tabs">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              :class="['tab-item', { active: activeTab === tab.id }]"
              @click="activeTab = tab.id"
            >
              <Icon :icon="tab.icon" width="20" height="20" />
              <span class="tab-label">{{ tab.label }}</span>
            </button>
          </div>

          <!-- 3. Acciones Derecha -->
          <div class="nav-actions">
            <!-- Botón Crear Post -->
            <button class="create-btn" @click="openAddPostModal" title="Nueva Publicación">
              <Icon icon="mdi:plus" width="24" height="24" />
            </button>

            <!-- Perfil / Dropdown -->
            <div class="profile-dropdown-wrapper">
              <div class="user-avatar" @click="toggleDropdown">
                {{ userInitial }}
              </div>
              
              <!-- Menú Desplegable -->
              <transition name="fade">
                <div v-if="showDropdown" class="dropdown-menu">
                  <div class="dropdown-header">
                    <span class="user-name">{{ user?.nombre || 'Usuario' }}</span>
                  </div>
                  <div class="dropdown-divider"></div>
                  <button class="dropdown-item" @click="handleLogout">
                    <Icon icon="mdi:logout" width="18" class="item-icon" />
                    Cerrar sesión
                  </button>
                </div>
              </transition>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Espaciador para compensar el header fixed -->
    <div class="header-spacer"></div>

    <!-- Contenido inyectado (Slots) -->
    <div class="content-slot">
      <slot />
    </div>

    <!-- Modal de Crear Post -->
    <CreatePostModal v-if="showAddPostModal" v-model="showAddPostModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuth } from '../../composables/useAuth'
import CreatePostModal from '../components/AddPostModal.vue' // Asegúrate que la ruta coincida con el componente anterior

const { user, logout } = useAuth()

const showAddPostModal = ref(false)
const activeTab = ref('general')
const showDropdown = ref(false)
const isScrolled = ref(false)

// Configuración de Tabs
const tabs = [
  { id: 'siguiendo', label: 'Siguiendo', icon: 'mdi:account-group-outline' },
  { id: 'general', label: 'General', icon: 'mdi:earth' },
  { id: 'noticias', label: 'Noticias', icon: 'mdi:newspaper-variant-outline' }
]

const isLoggedIn = computed(() => !!user.value)

const userInitial = computed(() => {
  if (user.value && user.value.nombre) {
    return user.value.nombre.charAt(0).toUpperCase()
  }
  return 'U'
})

function openAddPostModal() {
  showAddPostModal.value = true
}

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

async function handleLogout() {
  showDropdown.value = false
  await logout()
  await nextTick()
}

// Detectar Scroll para cambiar estilo del header
function handleScroll() {
  isScrolled.value = window.scrollY > 20
}

// Cerrar dropdown si clickean fuera (opcional simple)
function closeDropdown(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (showDropdown.value && !target.closest('.profile-dropdown-wrapper')) {
    showDropdown.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('click', closeDropdown)
})
</script>

<style scoped>
/* --- LAYOUT GENERAL --- */
.header-wrapper {
  position: relative;
  width: 100%;
}

.header-spacer {
  height: 90px; /* Altura aproximada del header para empujar el contenido */
}

/* --- NAVBAR FLOTANTE --- */
.navbar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  padding: 1rem;
  transition: all 0.3s ease;
}

.navbar-overlay.is-scrolled {
  padding: 0; /* Se pega al tope al scrollear */
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

.navbar-container {
  max-width: 1100px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 99px; /* Forma de píldora grande */
  padding: 0.7rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 25px rgba(0,0,0,0.08); /* Sombra suave */
  transition: all 0.3s ease;
}

/* Al scrollear, el contenedor pierde la forma de píldora flotante y se expande (opcional) 
   O mantenemos la píldora flotante. Aquí hago que se integre si el overlay tiene fondo */
.navbar-overlay.is-scrolled .navbar-container {
  border-radius: 0;
  width: 100%;
  max-width: 100%;
  box-shadow: none;
  background: transparent;
  padding: 0.8rem 2rem;
}

/* --- BRAND --- */
.brand-text {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1f2937;
  letter-spacing: -0.5px;
}

.brand-highlight {
  color: #6200EA; /* Morado Kimal */
}

/* --- TABS CENTRALES --- */
.nav-tabs {
  display: flex;
  background: #f3f4f6;
  padding: 4px;
  border-radius: 99px;
  gap: 4px;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 99px;
  border: none;
  background: transparent;
  color: #6b7280;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-item:hover {
  color: #374151;
  background: rgba(0,0,0,0.03);
}

.tab-item.active {
  background: #ffffff;
  color: #6200EA;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

/* En pantallas pequeñas, ocultamos el texto de los tabs */
@media (max-width: 768px) {
  .tab-label { display: none; }
  .tab-item { padding: 8px 12px; }
}

/* --- ACCIONES DERECHA --- */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Botón Crear (+) */
.create-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  /* Gradiente Rosa Kimal */
  background: linear-gradient(135deg, #FF4081, #C2185B);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(233, 30, 99, 0.3);
  transition: transform 0.2s;
}

.create-btn:hover {
  transform: scale(1.05) rotate(90deg); /* Pequeño giro divertido */
}

/* Avatar Usuario */
.profile-dropdown-wrapper {
  position: relative;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #6200EA; /* Morado */
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 0 0 2px #ede9fe; /* Anillo exterior suave */
  transition: box-shadow 0.2s;
}

.user-avatar:hover {
  box-shadow: 0 0 0 3px #ddd6fe;
}

/* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  top: 120%;
  right: 0;
  width: 200px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  border: 1px solid #f3f4f6;
  padding: 8px;
  display: flex;
  flex-direction: column;
  transform-origin: top right;
}

.dropdown-header {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
}

.user-name { font-weight: 700; color: #1f2937; font-size: 0.95rem; }
.user-role { font-size: 0.75rem; color: #9ca3af; margin-top: 2px; }

.dropdown-divider {
  height: 1px;
  background: #f3f4f6;
  margin: 4px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border: none;
  background: transparent;
  color: #4b5563;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 8px;
  text-align: left;
  width: 100%;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background: #fee2e2;
  color: #ef4444;
}

.item-icon { opacity: 0.7; }

/* Transiciones Vue */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>