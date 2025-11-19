<template>
  <div class="register-page">
    
    <!-- ========================================= -->
    <!--           HEADER SUPERIOR (NAVBAR)        -->
    <!-- ========================================= -->

    <!-- ========================================= -->
    <!--          FONDO DECORATIVO (FIXED)         -->
    <!-- ========================================= -->
    
    <!-- 1. Esquina Superior Derecha -->
    <div class="decoration-fixed top-right">
      <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(300, 0)">
          <circle cx="0" cy="0" r="260" fill="none" stroke="#6200EA" stroke-width="40" opacity="0.15" />
          <circle cx="0" cy="0" r="190" fill="none" stroke="#00E5FF" stroke-width="40" opacity="0.2" />
          <circle cx="0" cy="0" r="120" fill="none" stroke="#FF4081" stroke-width="40" opacity="0.15" />
        </g>
      </svg>
    </div>

    <!-- 2. Esquina Inferior Izquierda -->
    <div class="decoration-fixed bottom-left">
      <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(0, 300)">
          <circle cx="0" cy="0" r="260" fill="none" stroke="#6200EA" stroke-width="40" opacity="0.15" />
          <circle cx="0" cy="0" r="190" fill="none" stroke="#00E5FF" stroke-width="40" opacity="0.2" />
          <circle cx="0" cy="0" r="120" fill="none" stroke="#FF4081" stroke-width="40" opacity="0.15" />
        </g>
      </svg>
    </div>

    <!-- 3. Esquina Inferior Derecha -->
    <div class="decoration-fixed bottom-right">
      <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
        <g transform="rotate(-45, 400, 400) translate(50, 100)">
          <rect x="0" y="0" width="600" height="60" rx="30" fill="none" stroke="#FF4081" stroke-width="4" opacity="0.15" />
          <rect x="0" y="90" width="600" height="60" rx="30" fill="none" stroke="#00E5FF" stroke-width="4" opacity="0.2" />
          <rect x="0" y="180" width="600" height="60" rx="30" fill="none" stroke="#6200EA" stroke-width="4" opacity="0.15" />
        </g>
      </svg>
    </div>

    <!-- ========================================= -->
    <!--           CONTENIDO PRINCIPAL             -->
    <!-- ========================================= -->

    <div class="content-container">
      <div class="register-card animated-entry">
        
        <!-- Avatar Header -->
        <div class="card-header">
          <div class="avatar-circle">
            <Icon icon="mdi:account-plus" width="48" height="48" color="#6200EA" />
          </div>
          <h2 class="card-title">Crear Cuenta</h2>
          <p class="card-subtitle">Únete a nuestra comunidad</p>
        </div>

        <form @submit.prevent="handleSubmit" class="register-form">
          
          <!-- Nombre y Apellido -->
          <div class="form-row">
            <div class="input-group">
              <div class="icon-wrapper">
                <Icon icon="mdi:account-outline" width="20" />
              </div>
              <input v-model="formData.nombre" type="text" placeholder="Nombre" class="modern-input" required>
            </div>
            <div class="input-group">
              <div class="icon-wrapper">
                <Icon icon="mdi:account-outline" width="20" />
              </div>
              <input v-model="formData.apellido" type="text" placeholder="Apellidos" class="modern-input" required>
            </div>
          </div>

          <!-- Correo -->
          <div class="input-group">
            <div class="icon-wrapper">
              <Icon icon="mdi:email-outline" width="20" />
            </div>
            <input v-model="formData.correo" type="email" placeholder="Correo electrónico" class="modern-input" required>
          </div>

          <!-- Contraseña -->
          <div class="input-group">
            <div class="icon-wrapper">
              <Icon icon="mdi:lock-outline" width="20" />
            </div>
            <input v-model="formData.contraseña" type="password" placeholder="Contraseña" class="modern-input" required>
          </div>

          <!-- Pueblo Originario -->
          <div class="checkbox-group">
            <label class="custom-checkbox-label">
              <input v-model="formData.puebloOriginario" type="checkbox" class="hidden-checkbox">
              <div class="checkbox-box">
                <Icon v-if="formData.puebloOriginario" icon="mdi:check" width="16" />
              </div>
              <span class="checkbox-text">Pertenezco a un pueblo originario</span>
            </label>
          </div>

          <div v-if="formData.puebloOriginario" class="input-group slide-down">
            <div class="icon-wrapper">
              <Icon icon="mdi:earth" width="20" />
            </div>
            <select v-model="formData.nombrePueblo" class="modern-input select-input" required>
              <option value="" disabled>Selecciona tu pueblo originario</option>
              <option v-for="pueblo in pueblosOriginariosChile" :key="pueblo" :value="pueblo">{{ pueblo }}</option>
            </select>
            <Icon icon="mdi:chevron-down" class="select-arrow" />
          </div>

          <!-- Recibir Cartas -->
          <div class="checkbox-group">
            <label class="custom-checkbox-label">
              <input v-model="formData.recibirCartas" type="checkbox" class="hidden-checkbox">
              <div class="checkbox-box">
                <Icon v-if="formData.recibirCartas" icon="mdi:check" width="16" />
              </div>
              <span class="checkbox-text">Deseo recibir cartas informativas</span>
            </label>
          </div>

          <div v-if="formData.recibirCartas" class="input-group slide-down">
            <div class="icon-wrapper">
              <Icon icon="mdi:map-marker-outline" width="20" />
            </div>
            <input v-model="formData.direccion" type="text" placeholder="Dirección completa" class="modern-input" required>
          </div>

          <!-- Mensajes de Error -->
          <div v-if="error" class="error-banner">
            <Icon icon="mdi:alert-circle" width="18" />
            {{ error }}
          </div>

          <!-- Botón Registro -->
          <button type="submit" class="btn-primary" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <span v-else>Registrarme</span>
            <Icon v-if="!loading" icon="mdi:account-plus" width="20" />
          </button>

          <div class="login-link">
             ¿Ya tienes cuenta? <span class="link-action bold" @click="$router.push('/')">Inicia sesión</span>
          </div>



        </form>
      </div>
      
       <!-- Footer -->
      <div class="page-footer">
        <span class="footer-link">Ayuda</span>
        <span class="footer-link">Privacidad</span>
        <span class="footer-link">Términos</span>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuth } from '../../composables/useAuth'

const pueblosOriginariosChile = [
  'Aymara', 'Quechua', 'Atacameño (Likan Antai)', 'Colla',
  'Diaguita', 'Mapuche', 'Rapa Nui', 'Kawésqar', 'Yagán', 'Chango', 'Otros'
]

const { register, loading, error } = useAuth()

const formData = ref({
  nombre: '',
  apellido: '',
  correo: '',
  contraseña: '',
  puebloOriginario: false,
  nombrePueblo: '',
  recibirCartas: false,
  direccion: ''
})

const handleSubmit = async () => {
  try {
    const success = await register(formData.value)
    if (success) {
      // Limpiar formulario
      formData.value = {
        nombre: '', apellido: '', correo: '', contraseña: '',
        puebloOriginario: false, nombrePueblo: '',
        recibirCartas: false, direccion: ''
      }
      alert('Usuario registrado exitosamente')
    }
  } catch (e) {
    console.error('Error en el registro:', e)
  }
}
</script>

<style scoped>
/* Reset */
* { box-sizing: border-box; }

/* --- LAYOUT & FONDO --- */
.register-page {
  min-height: 100vh;
  width: 100%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow-x: hidden;
  font-family: 'Roboto', sans-serif;
}

/* Top Navbar */
.top-navbar {
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.03);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
}
.brand-text { font-size: 1.5rem; font-weight: 800; color: #1f2937; }
.highlight { color: #6200EA; }

/* Decoraciones SVG Fijas */
.decoration-fixed { position: fixed; z-index: 0; pointer-events: none; }
.decoration-fixed svg { display: block; width: 100%; height: 100%; }
.top-right { top: 0; right: 0; width: 400px; height: 400px; }
.bottom-left { bottom: 0; left: 0; width: 350px; height: 350px; }
.bottom-right { bottom: 0; right: 0; width: 500px; height: 500px; transform: translate(20%, 20%); }

/* --- CONTENEDOR PRINCIPAL --- */
.content-container {
  position: relative;
  z-index: 10;
  width: 100%;
  margin-top: 90px; /* Espacio para el navbar */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  padding-bottom: 3rem;
}

/* --- TARJETA REGISTRO --- */
.register-card {
  width: 100%;
  max-width: 550px; /* Un poco más angosto que el login para enfocar el formulario */
  background: #ffffff;
  border-radius: 2.5rem;
  box-shadow: 0 15px 50px -10px rgba(0, 0, 0, 0.08);
  padding: 3rem;
  border: 1px solid #f3f4f6;
}

.animated-entry {
  animation: slideUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
}
@keyframes slideUp { to { opacity: 1; transform: translateY(0); } }

/* Header de la Tarjeta */
.card-header {
  text-align: center;
  margin-bottom: 2rem;
}
.avatar-circle {
  width: 80px;
  height: 80px;
  background-color: #F3E5F5; /* Morado muy suave */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem auto;
  border: 2px solid #fff;
  box-shadow: 0 4px 15px rgba(98, 0, 234, 0.1);
}
.card-title { font-size: 1.8rem; font-weight: 700; color: #1f2937; margin: 0; }
.card-subtitle { color: #6b7280; margin-top: 0.5rem; font-size: 0.95rem; }

/* Formulario */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.input-group { position: relative; width: 100%; }

.icon-wrapper {
  position: absolute;
  left: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6200EA;
  pointer-events: none;
  z-index: 2;
}

.modern-input {
  width: 100%;
  box-sizing: border-box;
  padding: 1rem 1rem 1rem 3rem;
  font-size: 1rem;
  color: #374151;
  background-color: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 1.5rem;
  outline: none;
  transition: all 0.3s ease;
}
.modern-input:focus {
  border-color: #6200EA;
  box-shadow: 0 0 0 4px rgba(98, 0, 234, 0.05);
}
.modern-input::placeholder { color: #9ca3af; }

/* Select Style */
.select-input {
  appearance: none; /* Quitar flecha default */
  cursor: pointer;
}
.select-arrow {
  position: absolute;
  right: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  pointer-events: none;
}

/* Checkbox Personalizado */
.checkbox-group { margin-top: 0.5rem; }
.custom-checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}
.hidden-checkbox { display: none; }
.checkbox-box {
  width: 22px;
  height: 22px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  transition: all 0.2s;
  color: white;
}
.hidden-checkbox:checked + .checkbox-box {
  background-color: #6200EA;
  border-color: #6200EA;
}
.checkbox-text { color: #4b5563; font-size: 0.95rem; }

/* Animación simple para campos condicionales */
.slide-down {
  animation: slideDown 0.3s ease-out;
}
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Botón */
.btn-primary {
  width: 100%;
  padding: 1rem;
  border-radius: 2rem;
  border: none;
  background: linear-gradient(90deg, #FF4081 0%, #C2185B 100%);
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 8px 20px -5px rgba(233, 30, 99, 0.4);
  transition: transform 0.2s;
  margin-top: 1rem;
}
.btn-primary:hover:not(:disabled) { transform: translateY(-2px); }
.btn-primary:disabled { opacity: 0.7; cursor: wait; }

.login-link {
  text-align: center;
  margin-top: 1rem;
  color: #6b7280;
  font-size: 0.9rem;
}
.link-action { cursor: pointer; color: #6200EA; transition: text-decoration 0.2s; }
.link-action:hover { text-decoration: underline; }
.bold { font-weight: 700; }

/* Error */
.error-banner {
  background-color: #FEF2F2;
  color: #B91C1C;
  padding: 0.8rem;
  border-radius: 1rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* Footer */
.page-footer {
  margin-top: 3rem;
  display: flex;
  gap: 2rem;
}
.footer-link { color: #9ca3af; font-size: 0.85rem; cursor: pointer; transition: color 0.2s; }
.footer-link:hover { color: #6200EA; }

/* Spinner */
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Responsive */
@media (max-width: 600px) {
  .register-card { padding: 2rem 1.5rem; }
  .form-row { flex-direction: column; gap: 1.2rem; }
}
</style>