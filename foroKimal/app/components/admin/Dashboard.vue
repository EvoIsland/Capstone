<template>
  <div class="dashboard">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Cargando datos...</p>
    </div>
    
    <div v-else>
      <!-- KPI Cards -->
      <div class="stats-grid">
        <div class="stat-card usuarios">
          <div class="card-header">
            <div class="icon-wrapper">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h3>Usuarios</h3>
          </div>
          <div class="card-body">
            <p class="stat-value">{{ cantidadUsuarios }}</p>
            <p class="stat-label">Usuarios registrados</p>
          </div>
          <div class="card-footer">
            <NuxtLink to="/admin/usuariosAdmin" class="card-link">
              Ver todos
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </NuxtLink>
          </div>
        </div>

        <div class="stat-card publicaciones">
          <div class="card-header">
            <div class="icon-wrapper">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <path d="M14 2v6h6"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <h3>Publicaciones</h3>
          </div>
          <div class="card-body">
            <p class="stat-value">{{ cantidadPublicaciones }}</p>
            <p class="stat-label">Publicaciones totales</p>
          </div>
          <div class="card-footer">
            <NuxtLink to="/admin/publicacionesAdmin" class="card-link">
              Ver todas
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </NuxtLink>
          </div>
        </div>

        <div class="stat-card instalaciones">
          <div class="card-header">
            <div class="icon-wrapper">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <h3>Instalaciones</h3>
          </div>
          <div class="card-body">
            <p class="stat-value">{{ cantidadInstalaciones }}</p>
            <p class="stat-label">Zonas registradas</p>
          </div>
          <div class="card-footer">
            <NuxtLink to="/admin/instalacionesAdmin" class="card-link">
              Ver todas
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div class="actions-grid">
          <NuxtLink to="/admin/usuariosAdmin" class="action-card">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            <span>Crear Usuario</span>
          </NuxtLink>
          
          <NuxtLink to="/admin/publicacionesAdmin" class="action-card">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            <span>Crear Publicación</span>
          </NuxtLink>
          
          <NuxtLink to="/admin/instalacionesAdmin" class="action-card">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>Agregar Instalación</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '../../../composables/useAuth'

const { accessToken } = useAuth()
const runtimeConfig = useRuntimeConfig()
const apiUrl = runtimeConfig.public.apiUrl

const cantidadUsuarios = ref(0)
const cantidadPublicaciones = ref(0)
const cantidadInstalaciones = ref(0)
const loading = ref(true)

onMounted(async () => {
  try {
    if (!accessToken.value) {
      console.error('No hay token de acceso')
      return
    }

    const [usuarios, publicaciones, instalaciones] = await Promise.all([
      fetch(`${apiUrl}/admin/usuarios`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      }).then(res => res.json()),
      fetch(`${apiUrl}/admin/publicaciones`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      }).then(res => res.json()),
      fetch(`${apiUrl}/admin/instalaciones`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      }).then(res => res.json())
    ])

    cantidadUsuarios.value = usuarios.length
    cantidadPublicaciones.value = publicaciones.length
    cantidadInstalaciones.value = instalaciones.length
  } catch (error) {
    console.error('Error al cargar datos del dashboard:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="scss">
.dashboard {
  padding: 0;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  
  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid rgba(142, 36, 170, 0.2);
    border-top-color: var(--fondo-oscuro);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  
  p {
    margin-top: 1.5rem;
    font-size: 1.1rem;
    color: #666;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  border-left: 4px solid;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
  
  &.usuarios {
    border-left-color: var(--fondo-oscuro);
    
    .icon-wrapper {
      background: linear-gradient(135deg, var(--fondo-oscuro), #ab47bc);
    }
  }
  
  &.publicaciones {
    border-left-color: var(--color-rosado);
    
    .icon-wrapper {
      background: linear-gradient(135deg, var(--color-rosado), #ff6eb4);
    }
  }
  
  &.instalaciones {
    border-left-color: var(--fondo-azul);
    
    .icon-wrapper {
      background: linear-gradient(135deg, var(--fondo-azul), #42a5f5);
    }
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 1.5rem 0.75rem;
  
  h3 {
    margin: 0;
    font-size: 0.95rem;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }
}

.icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-body {
  padding: 0.75rem 1.5rem 1rem;
}

.stat-value {
  margin: 0;
  font-size: 2.75rem;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1;
}

.stat-label {
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
  color: #888;
}

.card-footer {
  padding: 0 1.5rem 1.5rem;
}

.card-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--fondo-oscuro);
  text-decoration: none;
  transition: gap 0.2s ease;
  
  svg {
    transition: transform 0.2s ease;
  }
  
  &:hover {
    gap: 0.625rem;
    
    svg {
      transform: translateX(2px);
    }
  }
}

.quick-actions {
  margin-top: 3rem;
  
  h2 {
    margin: 0 0 1.5rem;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--fondo-oscuro);
  }
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1.25rem 1.5rem;
  background: white;
  border: 2px solid #f0f0f0;
  border-radius: 10px;
  color: #333;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  
  svg {
    color: var(--fondo-oscuro);
    flex-shrink: 0;
  }
  
  &:hover {
    border-color: var(--fondo-oscuro);
    background: var(--fondo-oscuro);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(142, 36, 170, 0.2);
    
    svg {
      color: white;
    }
  }
}
</style>