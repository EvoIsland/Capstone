<template>
  <div class="auth-layout">
    
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
      <div class="auth-card animated-entry">
        <div class="card-content">
          
          <!-- LADO IZQUIERDO: Títulos -->
          <div class="card-left">
            <h1 class="titulo-principal">
              Crea tu nueva<br>
              <span class="titulo-secundario">contraseña</span>
            </h1>
            <p class="subtitulo">Asegúrate de que sea segura y fácil de recordar</p>
          </div>
          
          <!-- LADO DERECHO: Formulario -->
          <div class="card-right">
            <form @submit.prevent="handleSubmit" class="form-container">
              
              <div class="input-group">
                <div class="icon-wrapper">
                  <Icon icon="mdi:lock-outline" width="20" />
                </div>
                <input 
                  v-model="nuevaContraseña" 
                  type="password" 
                  placeholder="Nueva contraseña" 
                  class="modern-input" 
                  required 
                />
              </div>

              <div class="input-group">
                <div class="icon-wrapper">
                  <Icon icon="mdi:lock-check-outline" width="20" />
                </div>
                <input 
                  v-model="repetirContraseña" 
                  type="password" 
                  placeholder="Repetir contraseña" 
                  class="modern-input" 
                  required 
                />
              </div>

              <button type="submit" class="btn-primary" :disabled="loading">
                <span v-if="loading" class="spinner"></span>
                <span v-else>Cambiar contraseña</span>
                <Icon v-if="!loading" icon="mdi:check-circle-outline" width="20" />
              </button>

              <!-- Mensajes de Estado -->
              <div v-if="mensaje" class="status-message" :class="error ? 'error' : 'success'">
                <Icon :icon="error ? 'mdi:alert-circle' : 'mdi:check-circle'" width="20" />
                {{ mensaje }}
              </div>

              <div class="back-link">
                 <span class="link-action bold" @click="$router.push('/')">Volver al inicio de sesión</span>
              </div>

            </form>
          </div>
        </div>
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
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';

const route = useRoute();
const router = useRouter();
const nuevaContraseña = ref('');
const repetirContraseña = ref('');
const mensaje = ref('');
const error = ref(false);
const loading = ref(false);

const handleSubmit = async () => {
  mensaje.value = '';
  error.value = false;
  
  if (nuevaContraseña.value !== repetirContraseña.value) {
      mensaje.value = "Las contraseñas no coinciden";
      error.value = true;
      return;
  }

  loading.value = true;

  const API_URL = process.env.NUXT_PUBLIC_API_URL || 'http://localhost:5000';
  try {
    const res = await fetch(`${API_URL}/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: route.params.token,
        nuevaContraseña: nuevaContraseña.value,
        repetirContraseña: repetirContraseña.value
      })
    });
    const data = await res.json();
    
    if (res.ok) {
      mensaje.value = data.message;
      // Redirigir después de un breve momento para que lean el mensaje
      setTimeout(() => router.push('/login'), 2000);
    } else {
      mensaje.value = data.error || 'Error al cambiar la contraseña';
      error.value = true;
    }
  } catch (e) {
    mensaje.value = 'Error de conexión con el servidor';
    error.value = true;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Reset básico */
* { box-sizing: border-box; }

/* --- LAYOUT & FONDO --- */
.auth-layout {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background-color: #ffffff;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Roboto', sans-serif;
}

/* Navbar */
.top-navbar {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
}
.brand-text { font-size: 1.5rem; font-weight: 800; color: #1f2937; }
.highlight { color: #6200EA; }

/* Decoraciones Fijas */
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 100px 1rem 2rem 1rem;
}

/* --- TARJETA AUTH --- */
.auth-card {
  width: 100%;
  max-width: 900px;
  background: #ffffff;
  border-radius: 2.5rem;
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
@keyframes slideUp { to { opacity: 1; transform: translateY(0); } }

.card-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4rem;
}

/* Lado Izquierdo */
.card-left { flex: 1; }
.titulo-principal {
  font-size: 3rem;
  font-weight: 800;
  color: #1f2937;
  line-height: 1.1;
  margin: 0 0 0.5rem 0;
}
.titulo-secundario { color: #6200EA; font-weight: 400; }
.subtitulo { font-size: 1.1rem; color: #6b7280; margin: 0.5rem 0 0 0; }

/* Lado Derecho */
.card-right { flex: 1.2; width: 100%; }
.form-container { display: flex; flex-direction: column; gap: 1.5rem; }

/* Inputs */
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
  border-radius: 2rem;
  outline: none;
  transition: all 0.3s ease;
}
.modern-input::placeholder { color: #9ca3af; }
.modern-input:focus {
  border-color: #6200EA;
  box-shadow: 0 0 0 4px rgba(98, 0, 234, 0.05);
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
}
.btn-primary:hover:not(:disabled) { transform: translateY(-2px); }
.btn-primary:disabled { opacity: 0.7; cursor: wait; }

/* Estado Mensajes */
.status-message {
  padding: 0.8rem;
  border-radius: 1rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-align: center;
}
.status-message.error { background-color: #FEF2F2; color: #B91C1C; }
.status-message.success { background-color: #F0FDF4; color: #15803D; }

/* Links */
.back-link { text-align: center; margin-top: 0.5rem; }
.link-action { font-size: 0.9rem; color: #6b7280; cursor: pointer; transition: color 0.2s; }
.link-action:hover { color: #6200EA; text-decoration: underline; }
.bold { font-weight: 700; color: #6200EA; }

/* Footer */
.page-footer { display: flex; gap: 2rem; color: #9ca3af; font-size: 0.85rem; }
.footer-link { cursor: pointer; transition: color 0.2s; }
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
@media (max-width: 900px) {
  .card-content { flex-direction: column; gap: 2rem; }
  .card-left { text-align: center; }
  .titulo-principal { font-size: 2.5rem; }
  .auth-card { padding: 3rem 2rem; }
}

@media (max-width: 600px) {
  .auth-card { padding: 2rem 1.5rem; }
  .top-navbar { position: relative; }
  .content-container { margin-top: 2rem; }
}
</style>