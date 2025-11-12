<!-- filepath: c:\proyectos\Capstone\foroKimal\app\components\admin\Header.vue -->
<template>
  <header class="admin-header">
    <div class="header-left">
      <h1>Panel de Administración</h1>
    </div>
    <div class="header-right">
      <!-- Aquí puedes agregar el nombre del usuario, avatar, botón de logout, etc. -->
      <span class="admin-user">Admin</span>
    </div>
  </header>
</template>

<style scoped lang="scss">

.admin-header {
  background: var(--fondo-oscuro);
  color: var(--color-amarillo);
  padding: 1.5rem 2.5rem;
  font-size: 1.7rem;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left h1 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: bold;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.admin-user {
  background: var(--color-info-background);
  color: var(--fondo-oscuro);
  padding: 0.4rem 1rem;
  border-radius: var(--radio-suave);
  font-size: 1rem;
  font-weight: 500;
}
</style>