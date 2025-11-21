<template>
  <div class="usuarios-admin">
    <!-- Tabs Navigation -->
    <div class="tabs-nav">
      <nav>
        <button 
          class="tab-button" 
          :class="{ 'is-active': activeTab === 'all' }"
          @click="activeTab = 'all'"
        >
          Todos los Usuarios
        </button>
        <button 
          class="tab-button" 
          :class="{ 'is-active': activeTab === 'admins' }"
          @click="activeTab = 'admins'"
        >
          Administradores
        </button>
        <button 
          class="tab-button" 
          :class="{ 'is-active': activeTab === 'users' }"
          @click="activeTab = 'users'"
        >
          Usuarios Regulares
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="card">
      <!-- Header with Search and Create Button -->
      <div class="card-header">
        <input 
          v-model="searchQuery"
          class="form-input" 
          type="search" 
          placeholder="Buscar por nombre o email..."
        >
        <button class="button button-primary" @click="openCreateModal">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 4.5v15m7.5-7.5h-15"/>
          </svg>
          <span>Crear Usuario</span>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando usuarios...</p>
      </div>

      <!-- Error State -->
      <div v-if="error" class="error-state">
        <p>{{ error }}</p>
      </div>

      <!-- Table -->
      <div v-if="!loading && !error" class="table-container">
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Fecha de Registro</th>
              <th style="text-align: right;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="usuario in filteredUsuarios" :key="usuario._id">
              <td>
                <div class="table-avatar">
                  <div class="avatar-placeholder">
                    {{ usuario.nombre.charAt(0) }}{{ usuario.apellido.charAt(0) }}
                  </div>
                  <div class="table-avatar-info">
                    <div class="name">{{ usuario.nombre }} {{ usuario.apellido }}</div>
                    <div class="email">{{ usuario.correo }}</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="status-badge" :class="usuario.rol === 'admin' ? 'status-purple' : 'status-blue'">
                  {{ usuario.rol === 'admin' ? 'Admin' : 'Usuario' }}
                </span>
              </td>
              <td>{{ formatDate(usuario.createdAt) }}</td>
              <td class="table-actions">
                <button class="link-primary" @click="openEditModal(usuario)">
                  Editar
                </button>
                <button class="link-danger" @click="confirmDelete(usuario)">
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && !error && filteredUsuarios.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.003c0 1.113.285 2.16.786 3.07M9 13.5a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <p>No se encontraron usuarios</p>
      </div>
    </div>

    <!-- Modal: Create/Edit User -->
    <div v-if="showModal" class="modal-container" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario' }}</h3>
          <button class="close-modal" @click="closeModal">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <form class="modal-body" @submit.prevent="saveUsuario">
          <div class="form-grid">
            <div class="form-group">
              <label for="nombre">Nombre</label>
              <input 
                id="nombre"
                v-model="currentUsuario.nombre" 
                type="text"
                class="form-input" 
                required 
              />
            </div>
            
            <div class="form-group">
              <label for="apellido">Apellido</label>
              <input 
                id="apellido"
                v-model="currentUsuario.apellido" 
                type="text"
                class="form-input" 
                required 
              />
            </div>
          </div>

          <div class="form-group">
            <label for="correo">Correo Electrónico</label>
            <input 
              id="correo"
              v-model="currentUsuario.correo" 
              type="email"
              class="form-input" 
              required 
            />
          </div>

          <div class="form-group">
            <label for="rol">Rol</label>
            <select 
              id="rol"
              v-model="currentUsuario.rol" 
              class="form-select"
            >
              <option value="usuario">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
        </form>

        <div class="modal-footer">
          <button type="button" class="button button-gray" @click="closeModal">
            Cancelar
          </button>
          <button type="button" class="button button-primary" @click="saveUsuario">
            {{ isEditing ? 'Actualizar' : 'Crear' }} Usuario
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '../../../composables/useAuth'

definePageMeta({
  layout: 'admin'
})

const { accessToken } = useAuth()

// Estado
const usuarios = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const activeTab = ref('all')
const searchQuery = ref('')
const showModal = ref(false)
const isEditing = ref(false)
const currentUsuario = ref<{
  _id?: string;
  nombre: string;
  apellido: string;
  correo: string;
  rol: 'usuario' | 'admin';
}>({
  nombre: '',
  apellido: '',
  correo: '',
  rol: 'usuario'
})

// Computed
const filteredUsuarios = computed(() => {
  let filtered = usuarios.value

  // Filtrar por tab
  if (activeTab.value === 'admins') {
    filtered = filtered.filter(u => u.rol === 'admin')
  } else if (activeTab.value === 'users') {
    filtered = filtered.filter(u => u.rol === 'usuario')
  }

  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(u => 
      u.nombre.toLowerCase().includes(query) ||
      u.apellido.toLowerCase().includes(query) ||
      u.correo.toLowerCase().includes(query)
    )
  }

  return filtered
})

// Métodos
const runtimeConfig = useRuntimeConfig();
const apiUrl = runtimeConfig.public.apiUrl;

const cargarUsuarios = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await fetch(`${apiUrl}/admin/usuarios`, {
      headers: { Authorization: `Bearer ${accessToken.value}` }
    })
    if (!res.ok) throw new Error('Error al cargar usuarios')
    usuarios.value = await res.json()
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  isEditing.value = false
  currentUsuario.value = {
    nombre: '',
    apellido: '',
    correo: '',
    rol: 'usuario' as 'usuario' | 'admin'
  }
  showModal.value = true
}

const openEditModal = (usuario: any) => {
  isEditing.value = true
  currentUsuario.value = { ...usuario }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveUsuario = async () => {
  try {
    if (isEditing.value) {
      // Actualizar
      const res = await fetch(`${apiUrl}/admin/usuarios/${currentUsuario.value._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken.value}`
        },
        body: JSON.stringify(currentUsuario.value)
      })
      if (!res.ok) throw new Error('Error al actualizar usuario')
    } else {
      // Crear
      const res = await fetch(`${apiUrl}/admin/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken.value}`
        },
        body: JSON.stringify(currentUsuario.value)
      })
      if (!res.ok) throw new Error('Error al crear usuario')
    }
    
    await cargarUsuarios()
    closeModal()
  } catch (err: any) {
    error.value = err.message
  }
}

const confirmDelete = async (usuario: any) => {
  if (confirm(`¿Estás seguro de eliminar a ${usuario.nombre} ${usuario.apellido}?`)) {
    try {
      const res = await fetch(`${apiUrl}/admin/usuarios/${usuario._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      if (!res.ok) throw new Error('Error al eliminar usuario')
      await cargarUsuarios()
    } catch (err: any) {
      error.value = err.message
    }
  }
}

const formatDate = (date: string) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-CL')
}

onMounted(() => {
  cargarUsuarios()
})
</script>

<style scoped lang="scss">
.usuarios-admin {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.tabs-nav {
  border-bottom: 1px solid #e5e7eb;
  
  nav {
    display: flex;
    gap: 2rem;
    margin-bottom: -1px;
  }
}

.tab-button {
  padding: 1rem 0.25rem;
  border: none;
  border-bottom: 2px solid transparent;
  background: none;
  font-weight: 500;
  font-size: 0.875rem;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: #374151;
    border-color: #d1d5db;
  }
  
  &.is-active {
    border-color: var(--fondo-oscuro);
    color: var(--fondo-oscuro);
  }
}

.card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem;
  border-bottom: 1px solid #e5e7eb;
  gap: 1rem;
  
  .form-input {
    width: 256px;
  }
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f9fafb;
}

th {
  padding: 0.75rem 1.5rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e5e7eb;
}

td {
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.table-avatar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar-placeholder {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background: var(--fondo-oscuro);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.table-avatar-info {
  .name {
    font-weight: 500;
    color: #111827;
  }
  
  .email {
    font-size: 0.8rem;
    color: #6b7280;
    margin-top: 0.125rem;
  }
}

.status-badge {
  padding: 0.25rem 0.75rem;
  display: inline-flex;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  
  &.status-purple {
    background: rgba(142, 36, 170, 0.1);
    color: var(--fondo-oscuro);
  }
  
  &.status-blue {
    background: rgba(33, 150, 243, 0.1);
    color: var(--fondo-azul);
  }
}

.table-actions {
  text-align: right;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  
  button {
    background: none;
    border: none;
    cursor: pointer;
    font-weight: 500;
    font-size: 0.875rem;
    padding: 0;
  }
}

.link-primary {
  color: var(--fondo-oscuro);
  
  &:hover {
    color: var(--color-rosado);
  }
}

.link-danger {
  color: #dc2626;
  
  &:hover {
    color: #991b1b;
  }
}

.loading-state, .error-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  
  svg {
    color: #9ca3af;
    margin-bottom: 1rem;
  }
  
  p {
    color: #6b7280;
    font-size: 1rem;
  }
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(142, 36, 170, 0.2);
  border-top-color: var(--fondo-oscuro);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state p {
  color: #dc2626;
}

// Modal Styles
.modal-container {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 42rem;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1px solid #e5e7eb;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
  }
  
  .close-modal {
    background: none;
    border: none;
    cursor: pointer;
    color: #9ca3af;
    padding: 0;
    
    &:hover {
      color: #4b5563;
    }
  }
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1.25rem;
  border-top: 1px solid #e5e7eb;
  gap: 0.75rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }
}

.form-input, .form-select {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  font-family: 'Inter', sans-serif;
  
  &:focus {
    outline: none;
    border-color: var(--fondo-oscuro);
    box-shadow: 0 0 0 1px var(--fondo-oscuro);
  }
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.button {
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  
  svg {
    flex-shrink: 0;
  }
  
  &.button-primary {
    background: var(--fondo-oscuro);
    color: white;
    
    &:hover {
      background: var(--color-rosado);
    }
  }
  
  &.button-gray {
    background: #e5e7eb;
    color: #1f2937;
    
    &:hover {
      background: #d1d5db;
    }
  }
}
</style>