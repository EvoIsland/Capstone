<template>
  <div class="login-layout">
    
    <!-- ========================================= -->
    <!--           HEADER SUPERIOR (NAVBAR)        -->
    <!-- ========================================= -->

    <!-- ========================================= -->
    <!--          FONDO DECORATIVO (FIXED)         -->
    <!-- ========================================= -->
    <!-- Nota: position: fixed para que funcione igual que ForoMain -->
    
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
      <div class="login-card animated-entry">
        <div class="login-content">
          
          <!-- LADO IZQUIERDO: Bienvenida -->
          <div class="login-left">
            <h1 class="titulo-principal">
              Bienvenido al<br>
              <span class="titulo-secundario">Inicio de sesión</span>
            </h1>
            <p class="subtitulo">Tu portal de acceso seguro</p>
          </div>
          
          <!-- LADO DERECHO: Formulario -->
          <div class="login-right">
            <form @submit.prevent="handleLogin" class="form-container">
              
              <!-- Input Correo -->
              <div class="input-group">
                <div class="icon-wrapper">
                  <Icon icon="mdi:email-outline" width="20" />
                </div>
                <input 
                  v-model="email" 
                  type="email" 
                  placeholder="Correo Electrónico" 
                  class="modern-input" 
                  required 
                />
              </div>

              <!-- Input Contraseña -->
              <div class="input-group">
                <div class="icon-wrapper">
                  <Icon icon="mdi:lock-outline" width="20" />
                </div>
                <input 
                  v-model="password" 
                  type="password" 
                  placeholder="Contraseña" 
                  class="modern-input" 
                  required 
                />
              </div>

              <div class="actions-row">
                <span class="link-action" @click="goToPasswordReset">¿Olvidaste tu contraseña?</span>
              </div>

              <!-- Mensaje de Error -->
              <div v-if="error" class="error-banner">
                <Icon icon="mdi:alert-circle" width="18" />
                {{ error }}
              </div>

              <!-- Botones -->
              <div class="buttons-container">
                <button type="submit" class="btn-primary" :disabled="loading">
                  <span v-if="loading" class="spinner"></span>
                  <span v-else>Ingresar</span>
                  <Icon v-if="!loading" icon="mdi:arrow-right" width="20" />
                </button>

                <div class="register-row">
                  <span>¿No tienes cuenta?</span>
                  <span class="link-action bold" @click="goToRegister">Regístrate</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="login-footer">
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
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth' 

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const router = useRouter()
const { login, error: authError } = useAuth()

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  
  const success = await login({ correo: email.value, contraseña: password.value })
  
  loading.value = false
  if (!success) {
    error.value = authError.value || 'Error de autenticación'
  }
}

const goToPasswordReset = () => {
  router.push('/request-password-reset')
}

const goToRegister = () => {
  router.push('/registro')
}
</script>

<style scoped>
/* Reset básico para evitar desbordamientos */
* {
  box-sizing: border-box;
}

/* --- LAYOUT PRINCIPAL --- */
.login-layout {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background-color: #ffffff;
  overflow-x: hidden; /* Previene scroll horizontal por decoraciones */
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Roboto', sans-serif;
}

/* --- HEADER SUPERIOR (NAVBAR) --- */
.login-navbar {
  width: 100%;
  height: 80px; /* Altura fija para el header */
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  /* Sombra muy suave solo abajo */
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  position: fixed; /* Fijo arriba */
  top: 0;
  left: 0;
  z-index: 50; /* Por encima de todo */
}

.brand-text {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1f2937;
}
.highlight {
  color: #6200EA;
}

/* --- DECORACIONES DE FONDO (FIXED) --- */
/* Importante: position: fixed para que se quede quieto como en ForoMain */
.decoration-fixed {
  position: fixed; 
  z-index: 0;
  pointer-events: none;
}
.decoration-fixed svg {
  display: block;
  width: 100%;
  height: 100%;
}
.top-right { top: 0; right: 0; width: 400px; height: 400px; }
.bottom-left { bottom: 0; left: 0; width: 350px; height: 350px; }
.bottom-right { bottom: 0; right: 0; width: 500px; height: 500px; transform: translate(20%, 20%); }

/* --- CONTENEDOR DE CONTENIDO (SCROLLABLE) --- */
.content-container {
  position: relative;
  z-index: 10;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh; /* Centrado vertical */
  padding: 100px 1rem 2rem 1rem; /* Padding top compensa el navbar fixed */
}

/* --- TARJETA DE LOGIN --- */
.login-card {
  width: 100%;
  max-width: 960px;
  background: #ffffff;
  border-radius: 2.5rem;
  /* Sombra suave y difusa */
  box-shadow: 0 15px 50px -10px rgba(0, 0, 0, 0.08);
  padding: 4rem;
  border: 1px solid #f3f4f6;
  margin-bottom: 2rem;
}

.animated-entry {
  animation: slideUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}
@keyframes slideUp {
  to { opacity: 1; transform: translateY(0); }
}

.login-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4rem;
}

/* Lado Izquierdo */
.login-left {
  flex: 1;
}
.titulo-principal {
  font-size: 3rem;
  font-weight: 800;
  color: #1f2937;
  line-height: 1.1;
  margin: 0 0 0.5rem 0;
}
.titulo-secundario {
  color: #6200EA;
  font-weight: 400;
}
.subtitulo {
  font-size: 1.1rem;
  color: #6b7280;
  margin: 0.5rem 0 0 0;
}

/* Lado Derecho */
.login-right {
  flex: 1.2;
  width: 100%;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

/* INPUTS */
.input-group {
  position: relative;
  width: 100%;
}

.icon-wrapper {
  position: absolute;
  left: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6200EA; /* Icono morado */
  pointer-events: none;
  z-index: 2;
}

.modern-input {
  width: 100%;
  /* IMPORTANTE: box-sizing evita que se salga */
  box-sizing: border-box; 
  padding: 1rem 1rem 1rem 3rem; /* espacio a la izquierda para icono */
  font-size: 1rem;
  color: #333;
  background-color: #fff;
  border: 1.5px solid #e5e7eb; /* Borde gris suave */
  border-radius: 2rem; /* Borde muy redondeado */
  outline: none;
  transition: all 0.3s ease;
}

.modern-input::placeholder {
  color: #9ca3af;
}

/* Focus State */
.modern-input:focus {
  border-color: #6200EA; /* Borde morado al focus */
  box-shadow: 0 0 0 4px rgba(98, 0, 234, 0.05);
}

/* Acciones */
.actions-row {
  display: flex;
  justify-content: flex-end;
}
.link-action {
  font-size: 0.85rem;
  color: #6b7280;
  cursor: pointer;
}
.link-action:hover { color: #6200EA; text-decoration: underline; }

/* Botón */
.btn-primary {
  width: 100%;
  padding: 1rem;
  border-radius: 2rem;
  border: none;
  background: linear-gradient(90deg, #FF4081 0%, #C2185B 100%); /* Gradiente Rosa */
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
.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
}
.btn-primary:disabled {
  opacity: 0.7;
  cursor: wait;
}

.register-row {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: #6b7280;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}
.bold { font-weight: 700; color: #6200EA; }

/* Footer */
.login-footer {
  display: flex;
  gap: 2rem;
  color: #9ca3af;
  font-size: 0.85rem;
}
.footer-link { cursor: pointer; transition: color 0.2s; }
.footer-link:hover { color: #6200EA; }

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
@media (max-width: 900px) {
  .login-content {
    flex-direction: column;
    gap: 2rem;
  }
  .login-left {
    text-align: center;
  }
  .titulo-principal {
    font-size: 2.5rem;
  }
  .login-card {
    padding: 3rem 2rem;
  }
}
</style>