<!-- filepath: c:\proyectos\Capstone\foroKimal\app\pages\admin\dashboard.vue -->
<template>
  <div class="admin-layout">
    <AdminSidebar />
    <div class="admin-main">
      <AdminHeader />
      <main class="admin-content">
        <AdminDashboard />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminSidebar from '../../components/admin/Sidebar.vue'
import AdminHeader from '../../components/admin/Header.vue'
import AdminDashboard from '../../components/admin/Dashboard.vue'
</script>

<style scoped lang="scss">
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--fondo-claro);
}

.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.admin-content {
  flex: 1;
  padding: 2rem;
  background: var(--fondo-claro);
}
</style>