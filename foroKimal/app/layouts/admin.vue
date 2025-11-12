<template>
  <div class="admin-layout">
    <AdminSidebar />
    <div class="admin-main">
      <AdminHeader 
        :title="pageTitle" 
        :subtitle="pageSubtitle"
        :showBackButton="showBackButton"
      />
      <main class="admin-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/admin/dashboard': 'Dashboard',
    '/admin/usuariosAdmin': 'Gestión de Usuarios',
    '/admin/publicacionesAdmin': 'Gestión de Publicaciones',
    '/admin/instalacionesAdmin': 'Gestión de Instalaciones'
  }
  return titles[route.path] || 'Administración'
})

const pageSubtitle = computed(() => {
  const subtitles: Record<string, string> = {
    '/admin/dashboard': 'Vista general del sistema',
    '/admin/usuariosAdmin': 'Administra los usuarios del sistema',
    '/admin/publicacionesAdmin': 'Gestiona las publicaciones del foro',
    '/admin/instalacionesAdmin': 'Administra las zonas e instalaciones'
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

.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.admin-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background: #f5f5f5;
}
</style>
