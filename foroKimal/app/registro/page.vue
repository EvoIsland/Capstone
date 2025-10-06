&lt;template>
  <div class="registro-container">
    <h2>Registro</h2>
    
    <form @submit.prevent="handleSubmit">
      <!-- Nombre -->
      <div>
        <label>Nombre</label>
        <input 
          v-model="formData.nombre"
          type="text"
          required
        >
      </div>

      <!-- Apellido -->
      <div>
        <label>Apellido</label>
        <input 
          v-model="formData.apellido"
          type="text"
          required
        >
      </div>

      <!-- Correo -->
      <div>
        <label>Correo</label>
        <input 
          v-model="formData.correo"
          type="email"
          required
        >
      </div>

      <!-- Contraseña -->
      <div>
        <label>Contraseña</label>
        <input 
          v-model="formData.contraseña"
          type="password"
          required
        >
      </div>

      <!-- Pueblo Originario -->
      <div>
        <input 
          v-model="formData.puebloOriginario"
          type="checkbox"
        >
        <label>Pertenezco a un pueblo originario</label>
      </div>

      <!-- Nombre del Pueblo (condicional) -->
      <div v-if="formData.puebloOriginario">
        <label>Nombre del Pueblo</label>
        <input 
          v-model="formData.nombrePueblo"
          type="text"
        >
      </div>

      <!-- Recibir Cartas -->
      <div>
        <input 
          v-model="formData.recibirCartas"
          type="checkbox"
        >
        <label>Deseo recibir cartas</label>
      </div>

      <!-- Dirección (condicional) -->
      <div v-if="formData.recibirCartas">
        <label>Dirección</label>
        <input 
          v-model="formData.direccion"
          type="text"
        >
      </div>

      <!-- Error message -->
      <div v-if="error" class="error">
        {{ error }}
      </div>

      <!-- Submit button -->
      <button 
        type="submit"
        :disabled="loading"
      >
        <span v-if="loading">Registrando...</span>
        <span v-else>Registrar</span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../../composables/useAuth'

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

<style scoped>
.registro-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
