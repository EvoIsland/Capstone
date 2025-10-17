<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="post-card">
      <form @submit.prevent="handleSubmit">
        <h2 class="form-title">Crear una Nueva Publicación</h2>
        
        <textarea
          v-model="form.texto"
          class="post-input"
          placeholder="¿Qué estás pensando?"
          rows="4"
          required
        ></textarea>
        
        <select v-model="form.tipo" class="post-input select-style">
          <option value="pregunta">Pregunta</option>
          <option value="reporte">Reporte</option>
        </select>

        <template v-if="form.tipo === 'pregunta'">
          <select v-model="form.regionId" class="post-input select-style">
            <option value="">Selecciona una Región (Opcional)</option>
            <option v-for="region in regiones" :key="region._id" :value="region._id">{{ region.nombre }}</option>
          </select>
          <select v-model="form.comunaId" class="post-input select-style" :disabled="!form.regionId">
            <option value="">Selecciona una Comuna (Opcional)</option>
            <option v-for="comuna in comunasFiltradas" :key="comuna._id" :value="comuna._id">{{ comuna.nombre }}</option>
          </select>
        </template>

        <template v-if="form.tipo === 'reporte'">
          <select v-model="form.instalacionId" class="post-input select-style" required>
            <option value="">Selecciona una Instalación (Obligatorio)</option>
            <option v-for="inst in instalaciones" :key="inst._id" :value="inst._id">{{ inst.nombre }}</option>
          </select>
          <input :value="regionAuto" class="post-input" placeholder="Región (automático)" readonly />
          <input :value="comunaAuto" class="post-input" placeholder="Comuna (automático)" readonly />
        </template>

        <div class="form-actions">
          <button type="button" @click="closeModal" class="post-btn post-btn-cancel">Cancelar</button>
          <button type="submit" class="post-btn">Publicar</button>
        </div>

        <div v-if="error" class="form-message error">{{ error }}</div>
        <div v-if="success" class="form-message success">{{ success }}</div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import type { Region, Comuna, Instalacion } from '~/types';
import { useAuth } from '../../composables/useAuth';

// --- PROPS Y EMITS PARA EL MODAL ---
const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits(['update:modelValue']);
const closeModal = () => {
  emit('update:modelValue', false);
};

const { accessToken } = useAuth()


const form = ref({
  tipo: 'pregunta',
  texto: '',
  instalacionId: '',
  comunaId: '',
  regionId: ''
});
const error = ref('');
const success = ref('');

// --- ESTADO PARA DATOS DE LA API ---
const regiones = ref<Region[]>([]);
const comunas = ref<Comuna[]>([]);
const instalaciones = ref<Instalacion[]>([]);

// --- PROPIEDADES COMPUTADAS PARA FILTROS ---
const comunasFiltradas = computed(() => {
  if (!form.value.regionId) return [];
  return comunas.value.filter(c => c.regionId === form.value.regionId);
});

const regionAuto = computed(() => {
  if (form.value.tipo !== 'reporte' || !form.value.instalacionId) return '';
  const inst = instalaciones.value.find(i => i._id === form.value.instalacionId);
  const region = regiones.value.find(r => r._id === inst?.regionId);
  return region ? region.nombre : 'Calculando...';
});

const comunaAuto = computed(() => {
  if (form.value.tipo !== 'reporte' || !form.value.instalacionId) return '';
  const inst = instalaciones.value.find(i => i._id === form.value.instalacionId);
  const comuna = comunas.value.find(c => c._id === inst?.comunaId);
  return comuna ? comuna.nombre : 'Calculando...';
});

// --- WATCHER PARA LIMPIAR CAMPOS ---
watch(() => form.value.tipo, () => {
  // Limpia los campos al cambiar de tipo para evitar inconsistencias
  form.value.regionId = '';
  form.value.comunaId = '';
  form.value.instalacionId = '';
});

watch(() => form.value.regionId, () => {
  // Limpia la comuna si la región cambia
  form.value.comunaId = '';
});

// --- CARGA DE DATOS INICIAL ---
onMounted(async () => {
  try {
    const [regionesData, comunasData, instalacionesData] = await Promise.all([
      $fetch<Region[]>('http://localhost:5000/regiones'),
      $fetch<Comuna[]>('http://localhost:5000/comunas'),
      $fetch<Instalacion[]>('http://localhost:5000/instalaciones')
    ]);
    regiones.value = regionesData;
    comunas.value = comunasData;
    instalaciones.value = instalacionesData;
  } catch (err) {
    error.value = "No se pudieron cargar los datos del formulario.";
    console.error(err);
  }
});

// --- ENVÍO DEL FORMULARIO ---
const handleSubmit = async () => {
  error.value = '';
  success.value = '';

  // Aquí iría tu lógica de envío con $fetch a /api/publicacion
  try {
    const body: any = {
      tipo: form.value.tipo,
      texto: form.value.texto,
    };
    
    if (form.value.tipo === 'pregunta') {
      if (form.value.regionId) body.regionId = form.value.regionId;
      if (form.value.comunaId) body.comunaId = form.value.comunaId;
    } else if (form.value.tipo === 'reporte') {
      if (!form.value.instalacionId) {
        error.value = 'Debes seleccionar una instalación para el reporte.';
        return;
      }
      body.instalacionId = form.value.instalacionId;
    }

    await $fetch('http://localhost:5000/publicacion', {
      method: 'POST',
      body: body,

      headers: { 'Authorization': `Bearer ${accessToken.value}` }
    });

    success.value = '¡Publicación creada con éxito!';
    // Limpiar formulario y cerrar modal después de un momento
    setTimeout(() => {
      form.value.texto = '';
      form.value.tipo = 'pregunta';
      closeModal();
    }, 1500);

  } catch (err: any) {
    error.value = err.data?.message || 'Ocurrió un error al publicar.';
    console.error(err);
  }
};
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.post-card {
  width: 90vw;
  max-width: 600px;
  background: #f7f7f7;
  border-radius: 2.5rem;
  box-shadow: 0 4px 32px 0 #0000004a;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
}

.form-title {
  text-align: center;
  font-size: 1.8rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 2rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.post-input {
  width: 100%;
  padding: 1rem 1.5rem;
  border-radius: 2rem;
  border: none;
  background: #e9e2f5;
  color: #333;
  font-size: 1.1rem;
  outline: none;
  transition: box-shadow 0.2s;
  &::placeholder {
    color: #6d6d6d;
    opacity: 0.8;
  }
  &:focus {
    box-shadow: 0 0 0 2px #b388f5cc;
  }
  &[readonly] {
    background-color: #e0e0e0;
    cursor: not-allowed;
  }
}

.select-style {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  padding-right: 2.5rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.post-btn {
  background: #ff3388;
  color: #fff;
  border: none;
  border-radius: 1.5rem;
  padding: 0.8rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  &:hover:not(:disabled) {
    background: #e6006d;
  }
}

.post-btn-cancel {
  background: #e0e0e0;
  color: #333;
  &:hover:not(:disabled) {
    background: #c7c7c7;
  }
}

.form-message {
  text-align: center;
  margin-top: 1rem;
  padding: 0.8rem;
  border-radius: 0.5rem;
  font-weight: 500;
  &.error {
    background-color: #ffdddd;
    color: #d8000c;
  }
  &.success {
    background-color: #ddffdd;
    color: #4f8a10;
  }
}
</style>