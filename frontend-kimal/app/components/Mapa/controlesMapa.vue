<template>
  <div class="map-actions">
    <!-- Botón Toggle Línea -->
    <button 
      class="action-btn btn-purple" 
      :class="{ 'inactivo': !mostrarLinea }"
      @click="toggleLinea"
    >
      <div class="btn-icon">
        <!-- Icono Rayo -->
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <span class="btn-text">{{ mostrarLinea ? 'Ocultar' : 'Mostrar' }} Línea</span>
    </button>
    
    <!-- Botón Mi Ubicación -->
    <button 
      class="action-btn btn-green" 
      @click="centrarEnMiUbicacion"
    >
      <div class="btn-icon">
        <!-- Icono Pin/Ubicación -->
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <span class="btn-text">Mi Ubicación</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'toggle-linea', mostrar: boolean): void
  (e: 'centrar-ubicacion'): void
}>()

const mostrarLinea = ref(true)

function toggleLinea() {
  mostrarLinea.value = !mostrarLinea.value
  emit('toggle-linea', mostrarLinea.value)
}

function centrarEnMiUbicacion() {
  emit('centrar-ubicacion')
}
</script>

<style lang="scss" scoped>
// Variables locales para mantener el diseño consistente
$primary: #7c3aed;       // Morado
$primary-soft: #f3e8ff;
$success: #10b981;       // Verde
$success-soft: #d1fae5;
$text-main: #1f2937;

.map-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  /* Eliminamos position absolute para que fluya dentro de .right-controls del padre */
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  // min-width: 160px; // Opcional: Ancho fijo si quieres uniformidad
  background: white;
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
  pointer-events: auto; // Importante: reactivar clics
  text-align: left;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }

  &:active {
    transform: translateY(0);
  }
}

.btn-text {
  font-size: 13px;
  font-weight: 600;
  color: $text-main;
  font-family: 'Inter', sans-serif;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

// --- Variantes de Color ---

// Botón Morado (Línea)
.btn-purple {
  .btn-icon {
    background: $primary-soft;
    color: $primary;
  }

  &:hover .btn-icon {
    background: $primary;
    color: white;
  }

  // Estado inactivo (cuando la línea está oculta)
  &.inactivo {
    opacity: 0.7;
    background: #f9fafb; // Gris muy claro
    
    .btn-icon {
      background: #e5e7eb; // Gris
      color: #6b7280;
    }
    
    &:hover {
        opacity: 1;
    }
  }
}

// Botón Verde (Ubicación)
.btn-green {
  .btn-icon {
    background: $success-soft;
    color: darken($success, 10%);
  }

  &:hover .btn-icon {
    background: $success;
    color: white;
  }
}

// --- Responsive ---
@media screen and (max-width: 480px) {
  .action-btn {
      padding: 10px 12px;
  }
  .btn-text {
      font-size: 12px;
  }
}
</style>