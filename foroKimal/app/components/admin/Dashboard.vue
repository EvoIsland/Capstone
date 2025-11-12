<template>
  <div class="dashboard-admin">
    <div class="dashboard-cards">
      <div class="dashboard-card publicaciones">
        <div class="card-icon"><i class="icon-publicaciones"></i></div>
        <span class="card-title">Total Publicaciones</span>
        <span class="card-value">{{ publicacionesCount }}</span>
      </div>
      <div class="dashboard-card reportes">
        <div class="card-icon"><i class="icon-reportes"></i></div>
        <span class="card-title">Contenido Reportado</span>
        <span class="card-value">{{ reportesCount }}</span>
      </div>
      <div class="dashboard-card comentarios">
        <div class="card-icon"><i class="icon-comentarios"></i></div>
        <span class="card-title">Total Comentarios</span>
        <span class="card-value">{{ comentariosCount }}</span>
      </div>
      <div class="dashboard-card usuarios">
        <div class="card-icon"><i class="icon-usuarios"></i></div>
        <span class="card-title">Total Usuarios</span>
        <span class="card-value">{{ usuariosCount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '../../../composables/useAuth'
import { fetchUsuarios } from '../../../services/admin/usuarioServices'
import { fetchPublicaciones } from '../../../services/admin/publicacionesServices'
import { fetchInstalaciones } from '../../../services/admin/instalacionesService'

const { accessToken } = useAuth()

const usuariosCount = ref(0)
const publicacionesCount = ref(0)
const instalacionesCount = ref(0)

onMounted(async () => {
  const usuarios = await fetchUsuarios(accessToken.value)
  usuariosCount.value = usuarios.length

  const publicaciones = await fetchPublicaciones(accessToken.value)
  publicacionesCount.value = publicaciones.length

  const instalaciones = await fetchInstalaciones(accessToken.value)
  instalacionesCount.value = instalaciones.length
})
</script>

<style scoped lang="scss">
.dashboard-admin {
  background: var(--fondo-claro);
  min-height: 80vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.dashboard-cards {
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-top: 2rem;
}
.dashboard-card {
  background: var(--blanco);
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  border-radius: 1.5rem;
  min-width: 220px;
  min-height: 140px;
  padding: 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: box-shadow 0.2s;
}
.dashboard-card .card-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}
.dashboard-card.publicaciones .card-icon { color: var(--fondo-oscuro); }
.dashboard-card.reportes .card-icon { color: var(--color-rosado); }
.dashboard-card.comentarios .card-icon { color: var(--fondo-azul); }
.dashboard-card.usuarios .card-icon { color: var(--color-amarillo); }

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.7rem;
  color: var(--fondo-oscuro);
  text-align: center;
}
.card-value {
  font-size: 2.2rem;
  font-weight: bold;
  color: var(--fondo-oscuro);
  text-align: center;
}
</style>