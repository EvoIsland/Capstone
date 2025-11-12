<template>
  <header class="admin-header">
    <div class="header-content">
      <div class="header-left">
        <h1 class="header-title">{{ title }}</h1>
        <p v-if="subtitle" class="header-subtitle">{{ subtitle }}</p>
      </div>
      
      <div class="header-right">
        <button class="header-btn" @click="goBack" v-if="showBackButton">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span>Volver</span>
        </button>
        
        <div class="header-actions">
          <button class="icon-btn" title="Notificaciones">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span class="badge">3</span>
          </button>
          
          <button class="icon-btn" @click="logout" title="Cerrar Sesión">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuth } from '../../../composables/useAuth'

const props = defineProps<{
  title: string
  subtitle?: string
  showBackButton?: boolean
}>()

const router = useRouter()
const auth = useAuth()

const goBack = () => {
  router.back()
}

const logout = async () => {
  await auth.logout()
  router.push('/')
}
</script>

<style scoped lang="scss">
.admin-header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 2rem;
  gap: 2rem;
}

.header-left {
  flex: 1;
  min-width: 0;
}

.header-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--fondo-oscuro);
  margin: 0;
  line-height: 1.2;
}

.header-subtitle {
  margin: 0.375rem 0 0;
  font-size: 0.9rem;
  color: #666;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.125rem;
  background: var(--fondo-oscuro);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  svg {
    transition: transform 0.2s ease;
  }
  
  &:hover {
    background: var(--color-rosado);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(142, 36, 170, 0.2);
    
    svg {
      transform: translateX(-2px);
    }
  }
  
  &:active {
    transform: translateY(0);
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--fondo-oscuro);
    border-color: var(--fondo-oscuro);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(142, 36, 170, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
}

.badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: var(--color-rosado);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}
</style>