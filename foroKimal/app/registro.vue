<template>
  <div class="flex min-h-screen justify-center items-center bg-gray-100">
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-6 text-center">Registro</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Nombre -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Nombre</label>
          <input 
            v-model="formData.nombre"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
        </div>

        <!-- Apellido -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Apellido</label>
          <input 
            v-model="formData.apellido"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
        </div>

        <!-- Correo -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Correo</label>
          <input 
            v-model="formData.correo"
            type="email"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
        </div>

        <!-- Contraseña -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Contraseña</label>
          <input 
            v-model="formData.contraseña"
            type="password"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
        </div>

        <!-- Pueblo Originario -->
        <div class="flex items-center">
          <input 
            v-model="formData.puebloOriginario"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          >
          <label class="ml-2 block text-sm text-gray-900">Pertenezco a un pueblo originario</label>
        </div>

        <!-- Nombre del Pueblo (condicional) -->
        <div v-if="formData.puebloOriginario">
          <label class="block text-sm font-medium text-gray-700">Nombre del Pueblo</label>
          <input 
            v-model="formData.nombrePueblo"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
        </div>

        <!-- Recibir Cartas -->
        <div class="flex items-center">
          <input 
            v-model="formData.recibirCartas"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          >
          <label class="ml-2 block text-sm text-gray-900">Deseo recibir cartas</label>
        </div>

        <!-- Dirección (condicional) -->
        <div v-if="formData.recibirCartas">
          <label class="block text-sm font-medium text-gray-700">Dirección</label>
          <input 
            v-model="formData.direccion"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
        </div>

        <!-- Error message -->
        <div v-if="error" class="text-red-600 text-sm">
          {{ error }}
        </div>

        <!-- Submit button -->
        <button 
          type="submit"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          :disabled="loading"
        >
          <span v-if="loading">Registrando...</span>
          <span v-else>Registrar</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'

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
      // Limpiar formulario y mostrar mensaje de éxito
      formData.value = {
        nombre: '',
        apellido: '',
        correo: '',
        contraseña: '',
        puebloOriginario: false,
        nombrePueblo: '',
        recibirCartas: false,
        direccion: ''
      }
      alert('Usuario registrado exitosamente')
    }
  } catch (e) {
    console.error('Error en el registro:', e)
  }
}
</script>
