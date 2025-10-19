<template>
  <div class="admin-page-container">
    <div class="news-form-card">
      <h1 class="form-title">Crear Nueva Noticia</h1>
      <p class="form-subtitle">
        Esta publicación aparecerá en el feed de "Noticias".
      </p>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="titulo">Titular</label>
          <input
            id="titulo"
            v-model="form.titulo"
            type="text"
            class="form-input"
            required
          />
        </div>

        <div class="form-group">
          <label for="texto">Contenido</label>
          <textarea
            id="texto"
            v-model="form.texto"
            class="form-input form-textarea"
            rows="10"
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label>Ubicación (Opcional)</label>
          <div class="location-filters">
            <select v-model="form.regionId" class="form-input select-style">
              <option value="">Región</option>
              <option v-for="region in regiones" :key="region._id" :value="region._id">{{ region.nombre }}</option>
            </select>
            <select v-model="form.comunaId" class="form-input select-style" :disabled="!form.regionId">
              <option value="">Comuna</option>
              <option v-for="comuna in comunasFiltradas" :key="comuna._id" :value="comuna._id">{{ comuna.nombre }}</option>
            </select>
            <select v-model="form.instalacionId" class="form-input select-style" :disabled="!form.comunaId">
              <option value="">Instalación</option>
              <option v-for="inst in instalacionesFiltradas" :key="inst._id" :value="inst._id">{{ inst.nombre }}</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="imagenes">Imágenes (Máx 3)</label>
          <input
            id="imagenes"
            type="file"
            class="form-input"
            multiple
            accept="image/png,image/jpeg"
            @change="handleFileChange"
          />
        </div>

        <button type="submit" class="form-submit-btn" :disabled="isLoading">
          {{ isLoading ? 'Publicando...' : 'Publicar Noticia' }}
        </button>
        <div v-if="error" class="form-message error">{{ error }}</div>
        <div v-if="success" class="form-message success">{{ success }}</div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useAuth } from '../../../composables/useAuth';
import { useRouter } from 'vue-router';
import type { Region, Comuna, Instalacion } from '~/types';

const { accessToken, user } = useAuth();
const router = useRouter();

// --- Protección de Página ---
onMounted(() => {
  if (!user.value || user.value.rol !== 'admin') {
    router.replace('/');
  }
});

// --- Estado del Formulario ---
const form = ref({
  titulo: '',
  texto: '',
  regionId: '',
  comunaId: '',
  instalacionId: '',
});
const imagenFiles = ref<File[]>([]);
const error = ref('');
const success = ref('');
const isLoading = ref(false);

// --- Estado para Filtros ---
const regiones = ref<Region[]>([]);
const comunas = ref<Comuna[]>([]);
const instalaciones = ref<Instalacion[]>([]);

// --- Filtros en Cadena ---
const comunasFiltradas = computed(() => {
  if (!form.value.regionId) return [];
  return comunas.value.filter(c => c.regionId === form.value.regionId);
});

const instalacionesFiltradas = computed(() => {
  if (!form.value.comunaId) return [];
  return instalaciones.value.filter(i => i.comunaId === form.value.comunaId);
});

// --- Watchers para limpiar filtros ---
watch(() => form.value.regionId, () => {
  form.value.comunaId = '';
  form.value.instalacionId = '';
});
watch(() => form.value.comunaId, () => {
  form.value.instalacionId = '';
});

// --- Carga de Datos ---
onMounted(async () => {
  try {
    const [reg, com, inst] = await Promise.all([
      $fetch<Region[]>('http://localhost:5000/regiones'),
      $fetch<Comuna[]>('http://localhost:5000/comunas'),
      $fetch<Instalacion[]>('http://localhost:5000/instalaciones'),
    ]);
    regiones.value = reg;
    comunas.value = com;
    instalaciones.value = inst;
  } catch (err) {
    console.error("Error al cargar datos de ubicación:", err);
    error.value = "No se pudieron cargar los filtros.";
  }
});

// --- Manejador de Archivos ---
const handleFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files) return;
  imagenFiles.value = Array.from(files).slice(0, 3);

  for (const file of imagenFiles.value) {
    if (file.size > 2 * 1024 * 1024) {
      error.value = 'Cada imagen debe pesar máximo 2MB.';
      (e.target as HTMLInputElement).value = '';
      return;
    }
  }
  error.value = '';
};

// --- Lógica de Envío con FormData ---
const handleSubmit = async () => {
  error.value = '';
  success.value = '';
  isLoading.value = true;

  try {
    const fd = new FormData();
    fd.append('tipo', 'noticia');
    fd.append('titulo', form.value.titulo);
    fd.append('texto', form.value.texto);

    if (form.value.regionId) fd.append('regionId', form.value.regionId);
    if (form.value.comunaId) fd.append('comunaId', form.value.comunaId);
    if (form.value.instalacionId) fd.append('instalacionId', form.value.instalacionId);

    imagenFiles.value.forEach((file) => {
      fd.append('imagenes', file, file.name);
    });

    await $fetch('http://localhost:5000/noticia', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
      },
      body: fd,
    });

    success.value = '¡Noticia publicada con éxito! Redirigiendo...';
    setTimeout(() => {
      router.push('/');
    }, 2000);

  } catch (err: any) {
    error.value = err.data?.error || 'No se pudo publicar la noticia.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped lang="scss">
/* ... (Los mismos estilos de la respuesta anterior) ... */
.admin-page-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 4rem 1rem;
  background-color: #f0f2f5;
  min-height: 100vh;
}
.news-form-card {
  width: 100%;
  max-width: 800px;
  background: #fff;
  padding: 3rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.form-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #333;
}
.form-subtitle {
  text-align: center;
  font-size: 1rem;
  color: #666;
  margin-bottom: 2.5rem;
}
form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  label {
    font-size: 0.9rem;
    font-weight: 500;
    color: #444;
  }
}
.form-input {
  width: 100%;
  padding: 0.8rem 1.2rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  &:focus {
    outline: none;
    border-color: #b388f5;
    box-shadow: 0 0 0 2px #b388f544;
  }
}
.form-textarea {
  resize: vertical;
  min-height: 200px;
}
.location-filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}
.select-style {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-Main,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
}
.form-submit-btn {
  background: #ff3388;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.9rem;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;
  &:hover:not(:disabled) {
    background: #e6006d;
  }
  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
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