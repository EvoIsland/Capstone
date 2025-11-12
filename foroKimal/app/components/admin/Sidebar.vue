<template>
  <aside class="admin-sidebar">
    <!-- Logo Section -->
    <div class="sidebar-header">
      <div class="logo">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
        <span class="logo-text">KIMAL Admin</span>
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
            <span>Dashboard</span>
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
            <span>Usuarios</span>
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
            <span>Publicaciones</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/admin/instalacionesAdmin" class="nav-link" active-class="active">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>Instalaciones</span>
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
        <div class="user-info">
          <div class="user-name">Admin</div>
          <div class="user-role">Administrador</div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.admin-sidebar {
  width: 260px;
  background: var(--fondo-oscuro);
  color: var(--texto-claro);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.1);
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