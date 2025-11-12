<!-- filepath: c:\proyectos\Capstone\foroKimal\app\layouts\admin.vue -->
<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="sidebar-title">Panel Admin</div>
      <nav>
        <ul>
          <li><NuxtLink to="/admin/dashboard">Dashboard</NuxtLink></li>
          <li><NuxtLink to="/admin/usuarios">Usuarios</NuxtLink></li>
          <li><NuxtLink to="/admin/publicaciones">Publicaciones</NuxtLink></li>
          <li><NuxtLink to="/admin/instalaciones">Instalaciones</NuxtLink></li>
        </ul>
      </nav>
    </aside>
    <div class="admin-main">
      <header class="admin-header">
        <h1>Administración</h1>
        <!-- Aquí puedes agregar acciones rápidas, usuario, etc. -->
      </header>
      <main class="admin-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">

.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--fondo-oscuro);
}

.admin-sidebar {
  width: 220px;
  background: var(--fondo-oscuro);
  color: var(--texto-claro);
  padding: 2rem 1rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0,0,0,0.05);
}

.sidebar-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2.5rem;
  color: var(--color-amarillo);
  text-align: center;
}

.admin-sidebar ul {
  list-style: none;
  padding: 0;
}

.admin-sidebar li {
  margin-bottom: 1.2rem;
}

.admin-sidebar a {
  color: var(--texto-claro);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.admin-sidebar a:hover {
  color: var(--color-rosado);
}

.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.admin-header {
  background: var(--fondo-oscuro);
  color: var(--color-amarillo);
  padding: 1.2rem 2rem;
  font-size: 1.6rem;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
}

.admin-content {
  flex: 1;
  padding: 2rem;
  background: var(--fondo-claro);
}
</style>