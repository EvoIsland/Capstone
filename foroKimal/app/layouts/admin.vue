<template>
  <div class="admin-layout">
    <div :class="['sidebar-fixed', { collapsed: sidebarCollapsed }]">
      <AdminSidebar @collapse="onCollapse" />
    </div>
    <div :class="['admin-main', { collapsed: sidebarCollapsed }]">
      <div :class="['header-fixed', { collapsed: sidebarCollapsed }]">
        <AdminHeader 
          :title="pageTitle" 
          :subtitle="pageSubtitle"
          :showBackButton="showBackButton"
        />
      </div>
      <main :class="['admin-content', { collapsed: sidebarCollapsed }]">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const route = useRoute()
const sidebarCollapsed = ref(false)
const onCollapse = (val: boolean) => {
  sidebarCollapsed.value = val
}

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/admin/dashboard': 'Dashboard',
    '/admin/usuariosAdmin': 'Gestión de Usuarios',
    '/admin/publicacionesAdmin': 'Gestión de Publicaciones',
    '/admin/instalacionesAdmin': 'Gestión de Instalaciones',
    '/admin/crear-noticia': 'Crear Noticia'
  }
  return titles[route.path] || 'Administración'
})

const pageSubtitle = computed(() => {
  const subtitles: Record<string, string> = {
    '/admin/dashboard': 'Vista general del sistema',
    '/admin/usuariosAdmin': 'Administra los usuarios del sistema',
    '/admin/publicacionesAdmin': 'Gestiona las publicaciones del foro',
    '/admin/instalacionesAdmin': 'Administra las zonas e instalaciones',
    '/admin/crear-noticia': 'Publica noticias oficiales del sistema'
  }
  return subtitles[route.path] || ''
})

const showBackButton = computed(() => {
  return route.path !== '/admin/dashboard'
})
</script>

<style scoped lang="scss">

.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f5f5;
}



.sidebar-fixed {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 260px;
  z-index: 100;
  box-shadow: 2px 0 12px rgba(0,0,0,0.07);
  background: inherit;
  transition: width 0.2s cubic-bezier(.4,0,.2,1);
}
.sidebar-fixed.collapsed {
  width: 64px;
}


.admin-main {
  flex: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: margin-left 0.2s cubic-bezier(.4,0,.2,1);
  margin-left: 260px;
}
.admin-main.collapsed {
  margin-left: 64px;
}


.header-fixed {
  position: fixed;
  top: 0;
  left: 260px;
  right: 0;
  z-index: 101;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: left 0.2s cubic-bezier(.4,0,.2,1);
}
.header-fixed.collapsed {
  left: 64px;
}

.admin-content {
  flex: 1;
  padding: 2rem;
  padding-top: 84px;
  overflow-y: auto;
  background: #f5f5f5;
  min-height: 0;
  transition: padding-left 0.2s cubic-bezier(.4,0,.2,1);
}
.admin-content.collapsed {
  /* Si quieres que el contenido se expanda más al colapsar el sidebar, puedes ajustar aquí */
}
</style>
