<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      
      <!-- Header del Modal -->
      <div class="modal-header">
        <h2 class="modal-title">Crear Publicación</h2>
        <button class="close-btn" @click="closeModal">
          <IconifyIcon icon="mdi:close" width="24" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-body">
        
        <!-- Selección de Tipo (Pestañas visuales) -->
        <div class="type-selector">
          <label 
            class="type-option" 
            :class="{ active: form.tipo === 'pregunta' }"
          >
            <input type="radio" v-model="form.tipo" value="pregunta" class="hidden-radio">
            <IconifyIcon icon="mdi:help-circle-outline" width="18" />
            Hacer una Pregunta
          </label>
          <label 
            class="type-option" 
            :class="{ active: form.tipo === 'reporte' }"
          >
            <input type="radio" v-model="form.tipo" value="reporte" class="hidden-radio">
            <IconifyIcon icon="mdi:alert-octagon-outline" width="18" />
            Reportar Incidente
          </label>
        </div>

        <!-- Área de Texto -->
        <div class="form-group">
          <textarea
            v-model="form.texto"
            class="form-input textarea"
            :placeholder="form.tipo === 'pregunta' ? '¿Qué duda tienes hoy?' : 'Describe el incidente detalladamente...'"
            rows="5"
            required
          ></textarea>
        </div>

        <!-- Campos Condicionales: PREGUNTA -->
        <div v-if="form.tipo === 'pregunta'" class="conditional-section">
          <div class="form-row">
            <div class="form-group half">
              <label class="label">Región</label>
              <div class="select-wrapper">
                <select v-model="form.regionId" class="form-input select">
                  <option value="">Todas las regiones</option>
                  <option v-for="region in regiones" :key="region._id" :value="region._id">
                    {{ region.nombre }}
                  </option>
                </select>
                <IconifyIcon icon="mdi:chevron-down" class="select-icon" />
              </div>
            </div>

            <div class="form-group half">
              <label class="label">Instalación</label>
              <div class="select-wrapper">
                <select v-model="form.instalacionId" class="form-input select" :disabled="!form.regionId">
                  <option value="">Selecciona instalación</option>
                  <option v-for="inst in instalacionesFiltradas" :key="inst._id" :value="inst._id">
                    {{ inst.nombre }}
                  </option>
                </select>
                <IconifyIcon icon="mdi:chevron-down" class="select-icon" />
              </div>
            </div>
          </div>
        </div>

        <!-- Campos Condicionales: REPORTE -->
        <div v-if="form.tipo === 'reporte'" class="conditional-section">
          <div class="form-group">
            <label class="label">Instalación <span class="required">*</span></label>
            <div class="select-wrapper">
              <select v-model="form.instalacionId" class="form-input select" required>
                <option value="">Selecciona dónde ocurrió</option>
                <option v-for="inst in instalaciones" :key="inst._id" :value="inst._id">
                  {{ inst.nombre }}
                </option>
              </select>
              <IconifyIcon icon="mdi:chevron-down" class="select-icon" />
            </div>
          </div>

          <!-- Datos Automáticos (Readonly) -->
          <div class="form-row">
            <div class="form-group half">
              <label class="label">Región</label>
              <div class="readonly-field">
                <IconifyIcon icon="mdi:map-marker-outline" class="field-icon" />
                {{ regionAuto || '-' }}
              </div>
            </div>
            <div class="form-group half">
              <label class="label">Comuna</label>
              <div class="readonly-field">
                <IconifyIcon icon="mdi:city-variant-outline" class="field-icon" />
                {{ comunaAuto || '-' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Mensajes de Estado -->
        <div v-if="error" class="status-message error">
          <IconifyIcon icon="mdi:alert-circle" width="20" />
          {{ error }}
        </div>
        <div v-if="success" class="status-message success">
          <IconifyIcon icon="mdi:check-circle" width="20" />
          {{ success }}
        </div>

        <!-- Footer con Acciones -->
        <div class="modal-footer">
          <button type="button" @click="closeModal" class="btn cancel-btn">
            Cancelar
          </button>
          <button type="submit" class="btn submit-btn" :disabled="!form.texto">
            <IconifyIcon icon="mdi:send" width="18" />
            Publicar
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { Icon as IconifyIcon } from '@iconify/vue';
import type { Region, Comuna, Instalacion } from '~/types';
import { useAuth } from '../../composables/useAuth';

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits(['update:modelValue']);

const closeModal = () => {
  emit('update:modelValue', false);
};

const { accessToken } = useAuth();

const form = ref({
  tipo: 'pregunta',
  texto: '',
  instalacionId: '',
  comunaId: '',
  regionId: ''
});
const error = ref('');
const success = ref('');

// --- DATOS API ---
const regiones = ref<Region[]>([]);
const comunas = ref<Comuna[]>([]);
const instalaciones = ref<Instalacion[]>([]);

// --- COMPUTED ---
const instalacionesFiltradas = computed(() => {
  if (!form.value.regionId) return [];
  return instalaciones.value.filter((inst: any) => inst.regionId === form.value.regionId);
});

const regionAuto = computed(() => {
  if (form.value.tipo !== 'reporte' || !form.value.instalacionId) return '';
  const inst = instalaciones.value.find((i: any) => i._id === form.value.instalacionId);
  const region = regiones.value.find((r: any) => r._id === inst?.regionId);
  return region ? region.nombre : '';
});

const comunaAuto = computed(() => {
  if (form.value.tipo !== 'reporte' || !form.value.instalacionId) return '';
  const inst = instalaciones.value.find((i: any) => i._id === form.value.instalacionId);
  const comuna = comunas.value.find((c: any) => c._id === inst?.comunaId);
  return comuna ? comuna.nombre : '';
});

// --- WATCHERS ---
watch(() => form.value.tipo, () => {
  form.value.regionId = '';
  form.value.instalacionId = '';
  error.value = ''; 
});

watch(() => form.value.regionId, () => {
  if (form.value.tipo === 'pregunta') {
    form.value.instalacionId = '';
  }
});

// --- MOUNTED ---
onMounted(async () => {
  const runtimeConfig = useRuntimeConfig();
  const apiUrl = runtimeConfig.public.apiUrl;
  try {
    // Asegúrate que estas URLs sean correctas para tu entorno
    const [regionesData, comunasData, instalacionesData] = await Promise.all([
      $fetch<Region[]>(`${apiUrl}/regiones`),
      $fetch<Comuna[]>(`${apiUrl}/comunas`),
      $fetch<Instalacion[]>(`${apiUrl}/instalaciones`)
    ]);
    regiones.value = regionesData;
    comunas.value = comunasData;
    instalaciones.value = instalacionesData;
  } catch (err) {
    error.value = "No se pudieron cargar las listas de opciones.";
    console.error(err);
  }
});

// --- SUBMIT ---
const handleSubmit = async () => {
  error.value = '';
  success.value = '';

  const runtimeConfig = useRuntimeConfig();
  const apiUrl = runtimeConfig.public.apiUrl;
  
  try {
    const body: any = {
      tipo: form.value.tipo, // Envía 'pregunta' o 'reporte' tal cual
      texto: form.value.texto,
    };
    
    if (form.value.tipo === 'pregunta') {
      if (form.value.instalacionId) body.instalacionId = form.value.instalacionId;
      if (form.value.regionId) body.regionId = form.value.regionId;
    } else if (form.value.tipo === 'reporte') {
      if (!form.value.instalacionId) {
        error.value = 'Debes seleccionar una instalación para el reporte.';
        return;
      }
      body.instalacionId = form.value.instalacionId;
      
      // Agregar comunaId y regionId desde la instalación seleccionada
      const inst = instalaciones.value.find((i: any) => i._id === form.value.instalacionId);
      if (inst) {
        body.comunaId = inst.comunaId;
        body.regionId = inst.regionId;
      }
    }

    console.log('📤 Body enviado:', body); // Para debugging

    await $fetch(`${apiUrl}/publicacion`, {
      method: 'POST',
      body: body,
      headers: { 'Authorization': `Bearer ${accessToken.value}` }
    });

    success.value = '¡Publicado correctamente!';
    
    setTimeout(() => {
      // Reset form
      form.value.texto = '';
      form.value.tipo = 'pregunta';
      form.value.instalacionId = '';
      form.value.regionId = '';
      closeModal();
      window.location.reload(); // Refresca las publicaciones
    }, 1500);

  } catch (err: any) {
    console.error('❌ Error completo:', err);
    error.value = err.data?.message || err.message || 'Ocurrió un error al intentar publicar.';
  }
};
</script>

<style scoped>
/* Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(31, 41, 55, 0.6); /* Gris oscuro */
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 1rem;
}

/* Modal Box */
.modal-content {
  width: 100%;
  max-width: 600px;
  background: #ffffff;
  border-radius: 1.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow-y: auto;
  animation: fadeInScale 0.2s ease-out;
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #f3f4f6;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111;
  margin: 0;
}

.close-btn {
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s;
  display: flex;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #ef4444;
}

/* Body */
.modal-body {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Selector de Tipo (Tabs) */
.type-selector {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.type-option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  border: 2px solid #f3f4f6;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  color: #6b7280;
  transition: all 0.2s;
}

.hidden-radio { display: none; }

.type-option:hover {
  background: #f9fafb;
  border-color: #e5e7eb;
}

.type-option.active {
  border-color: #6200EA;
  background: #F3E5F5;
  color: #6200EA;
}

/* Inputs y Labels */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  margin-left: 4px;
}

.required { color: #ef4444; }

.form-input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #1f2937;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
}

.form-input:focus {
  background: #ffffff;
  border-color: #6200EA;
  box-shadow: 0 0 0 3px rgba(98, 0, 234, 0.1);
}

.textarea {
  resize: vertical;
  min-height: 100px;
}

/* Custom Select */
.select-wrapper {
  position: relative;
}
.select {
  appearance: none;
  padding-right: 40px;
  cursor: pointer;
}
.select-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  pointer-events: none;
}

/* Conditional Grid */
.form-row {
  display: flex;
  gap: 1rem;
}
.half { flex: 1; }

/* Readonly Fields */
.readonly-field {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f3f4f6;
  border: 1px solid transparent;
  border-radius: 12px;
  color: #4b5563;
  font-size: 0.95rem;
}
.field-icon { color: #9ca3af; }

/* Mensajes */
.status-message {
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}
.error { background: #FEF2F2; color: #B91C1C; }
.success { background: #ECFDF5; color: #047857; }

/* Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f3f4f6;
}

.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  border-radius: 99px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.cancel-btn {
  background: transparent;
  color: #6b7280;
}
.cancel-btn:hover { background: #f3f4f6; color: #374151; }

.submit-btn {
  background: linear-gradient(135deg, #FF4081, #C2185B);
  color: white;
  box-shadow: 0 4px 12px rgba(233, 30, 99, 0.3);
}
.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 15px rgba(233, 30, 99, 0.4);
}
.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

@keyframes fadeInScale {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@media (max-width: 640px) {
  .form-row { flex-direction: column; gap: 1rem; }
  .type-selector { flex-direction: column; gap: 0.5rem; }
}
</style>