<template>
  <div class="verify-container">
    <h1>Verificando tu cuenta...</h1>
    <p v-if="loading">Por favor espera...</p>
    <p v-if="success" class="success">¡Tu cuenta ha sido verificada exitosamente! Ya puedes iniciar sesión.</p>
    <p v-if="error" class="error">El enlace de verificación es inválido o expiró.</p>
    <button v-if="success" @click="goLogin">Ir a iniciar sesión</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const success = ref(false);
const error = ref(false);

const goLogin = () => {
  router.push('/login');
};

onMounted(async () => {
  const token = route.params.token;
  try {
    const res = await fetch(`http://localhost:5000/verify/${token}`);
    const data = await res.json();
    if (res.ok) {
      success.value = true;
    } else {
      error.value = true;
    }
  } catch (e) {
    error.value = true;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.verify-container {
  max-width: 500px;
  margin: 80px auto;
  padding: 32px;
  background: #181c2b;
  color: #fff;
  border-radius: 12px;
  text-align: center;
}
.success {
  color: #4CAF50;
  font-weight: bold;
}
.error {
  color: #ff5252;
  font-weight: bold;
}
button {
  margin-top: 24px;
  padding: 10px 24px;
  background: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
