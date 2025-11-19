<template>
  <aside :class="['admin-sidebar', { collapsed }]">
    <div class="sidebar-toggle">
      <button @click="collapsed = !collapsed" :title="collapsed ? 'Expandir' : 'Colapsar'">
        <svg v-if="!collapsed" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>
    </div>
    <!-- Logo Section -->
    <div class="sidebar-header">
      <div class="logo">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
        <span v-if="!collapsed" class="logo-text">KIMAL Admin</span>
      </div>
    </div>
    <!-- Navigation -->
    <nav class="sidebar-nav">
      <ul>
        <li>
          <NuxtLink to="/admin/dashboard" class="nav-link" active-class="active">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            <span v-if="!collapsed">Dashboard</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/admin/usuariosAdmin" class="nav-link" active-class="active">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span v-if="!collapsed">Usuarios</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/admin/publicacionesAdmin" class="nav-link" active-class="active">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <path d="M14 2v6h6"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <line x1="10" y1="9" x2="8" y2="9"/>
            </svg>
            <span v-if="!collapsed">Publicaciones</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/admin/instalacionesAdmin" class="nav-link" active-class="active">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span v-if="!collapsed">Instalaciones</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/admin/noticiasAdmin" class="nav-link" active-class="active">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
            </svg>
            <span v-if="!collapsed">Noticias</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
    <!-- User Profile Section -->
    <div class="sidebar-footer">
      <div class="user-profile">
        <div class="user-avatar">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div v-if="!collapsed" class="user-info">
          <div class="user-name">
            {{ user?.nombre || 'Usuario' }}
          </div>
          <div class="user-role">
            {{ user?.rol ? (user.rol === 'admin' ? 'Administrador' : 'Usuario') : '' }}
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuth } from '../../../composables/useAuth'
const collapsed = ref(false)
const emit = defineEmits(['collapse'])
watch(collapsed, (val) => emit('collapse', val))

const { user } = useAuth()
</script>

<style scoped lang="scss">

.admin-sidebar {
  width: 260px;
  background: var(--fondo-oscuro);
  color: var(--texto-claro);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.1);
  transition: width 0.2s cubic-bezier(.4,0,.2,1);
}

.admin-sidebar.collapsed {
  width: 64px;
}

.sidebar-toggle {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0.75rem 1rem 0.25rem 0.5rem;
}

.sidebar-header {
  padding: 1.5rem 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: padding 0.2s cubic-bezier(.4,0,.2,1);
}
.admin-sidebar.collapsed .sidebar-header {
  padding: 1.5rem 0.5rem 2rem 0.5rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  svg {
    color: var(--color-amarillo);
    flex-shrink: 0;
  }
}

.logo-text {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-amarillo);
  letter-spacing: 0.5px;
  transition: opacity 0.2s cubic-bezier(.4,0,.2,1);
}
.admin-sidebar.collapsed .logo-text {
  opacity: 0;
  width: 0;
  pointer-events: none;
}

.sidebar-nav {
  flex: 1;
  padding: 1.5rem 0;
  overflow-y: auto;
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li {
    margin: 0;
  }
}
.admin-sidebar.collapsed .sidebar-nav {
  padding: 1.5rem 0.25rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1.5rem;
  color: var(--texto-claro);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  position: relative;
  svg {
    flex-shrink: 0;
    opacity: 0.8;
    transition: opacity 0.2s ease;
  }
  span {
    transition: transform 0.2s ease, opacity 0.2s cubic-bezier(.4,0,.2,1);
  }
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: var(--color-amarillo);
    svg {
      opacity: 1;
    }
  }
  &.active {
    background: rgba(255, 214, 0, 0.15);
    color: var(--color-amarillo);
    border-left: 3px solid var(--color-amarillo);
    svg {
      opacity: 1;
      color: var(--color-amarillo);
    }
    &::before {
      content: '';
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 40%;
      background: var(--color-amarillo);
      border-radius: 4px 0 0 4px;
    }
  }
}
.admin-sidebar.collapsed .nav-link {
  padding: 0.875rem 0.5rem;
  justify-content: center;
}
.admin-sidebar.collapsed .nav-link span {
  opacity: 0;
  width: 0;
  pointer-events: none;
}

.sidebar-footer {
  padding: 1rem 1.5rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  transition: padding 0.2s cubic-bezier(.4,0,.2,1);
}
.admin-sidebar.collapsed .sidebar-footer {
  padding: 1rem 0.5rem 1.5rem 0.5rem;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  transition: background 0.2s ease;
  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
}
.user-avatar {
  width: 38px;
  height: 38px;
  background: var(--color-amarillo);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  svg {
    color: var(--fondo-oscuro);
  }
}
.user-info {
  flex: 1;
  min-width: 0;
}
.user-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--texto-claro);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-role {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 2px;
}

.sidebar-header {
  padding: 1.5rem 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: var(--color-amarillo);
    flex-shrink: 0;
  }
}

.logo-text {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-amarillo);
  letter-spacing: 0.5px;
}

.sidebar-nav {
  flex: 1;
  padding: 1.5rem 0;
  overflow-y: auto;
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  li {
    margin: 0;
  }
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1.5rem;
  color: var(--texto-claro);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  position: relative;
  
  svg {
    flex-shrink: 0;
    opacity: 0.8;
    transition: opacity 0.2s ease;
  }
  
  span {
    transition: transform 0.2s ease;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: var(--color-amarillo);
    
    svg {
      opacity: 1;
    }
  }
  
  &.active {
    background: rgba(255, 214, 0, 0.15);
    color: var(--color-amarillo);
    border-left: 3px solid var(--color-amarillo);
    
    svg {
      opacity: 1;
      color: var(--color-amarillo);
    }
    
    &::before {
      content: '';
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 40%;
      background: var(--color-amarillo);
      border-radius: 4px 0 0 4px;
    }
  }
}

.sidebar-footer {
  padding: 1rem 1.5rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  transition: background 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
}

.user-avatar {
  width: 38px;
  height: 38px;
  background: var(--color-amarillo);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    color: var(--fondo-oscuro);
  }
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--texto-claro);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 2px;
}
</style>