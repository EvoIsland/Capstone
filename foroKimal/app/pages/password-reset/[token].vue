<template>
  <div class="password-reset-container">
    <h2>Restablecer contraseña</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label>Nueva contraseña</label>
        <input v-model="nuevaContraseña" type="password" required />
      </div>
      <div>
        <label>Repetir contraseña</label>
        <input v-model="repetirContraseña" type="password" required />
      </div>
      <button type="submit">Cambiar contraseña</button>
    </form>
    <div v-if="mensaje" :class="{ error: error }">{{ mensaje }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const nuevaContraseña = ref('');
const repetirContraseña = ref('');
const mensaje = ref('');
const error = ref(false);

const handleSubmit = async () => {
  mensaje.value = '';
  error.value = false;
  try {
    const res = await fetch('http://localhost:5000/change-password', {
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
      setTimeout(() => router.push('/login'), 2000);
    } else {
      mensaje.value = data.error || 'Error al cambiar la contraseña';
      error.value = true;
    }
  } catch (e) {
    mensaje.value = 'Error de red';
    error.value = true;
  }
};
</script>

<style scoped>
.password-reset-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
label {
  display: block;
  margin-bottom: 4px;
}
input {
  width: 100%;
  margin-bottom: 12px;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
button {
  padding: 8px 16px;
  background: #2d8cf0;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.error {
  color: #e74c3c;
  margin-top: 12px;
}
</style>
