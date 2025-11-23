<template>
  <div class="news-editor-page">
    <!-- Estado de carga -->
    <div v-if="cargandoNoticia" class="loading-overlay">
      <div class="loader"></div>
      <p>Cargando noticia...</p>
    </div>

    <template v-else>
      <!-- Controles superiores -->
      <div class="editor-controls">
        <div class="controls-left">
          <button @click="$router.push('/admin/noticiasAdmin')" class="btn-back">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Volver
          </button>
          <span class="badge" :class="deviceMode">{{ deviceMode === 'desktop' ? 'Escritorio' : 'Móvil' }}</span>
        </div>
        
        <div class="device-toggle">
          <button 
            @click="deviceMode = 'desktop'"
            :class="{ active: deviceMode === 'desktop' }"
            title="Editar vista Escritorio"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
          </button>
          <button 
            @click="deviceMode = 'mobile'"
            :class="{ active: deviceMode === 'mobile' }"
            title="Editar vista Móvil"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
          </button>
        </div>

        <button class="preview-btn" @click="togglePreview">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          <span>{{ viewMode === 'editor' ? 'Previsualizar' : 'Editar' }}</span>
        </button>
      </div>

      <!-- VISTA PREVIA (FEED) -->
      <div v-if="viewMode === 'feed_preview'" class="preview-container">
        <div class="preview-card">
          <h3>Así se verá en el Feed de Noticias</h3>
          <div class="news-card-simulation">
            <div v-if="getNewsMetadata().image" class="card-img">
              <img :src="getNewsMetadata().image || ''" alt="Portada" />
            </div>
            <div class="card-content">
              <h4>{{ getNewsMetadata().title }}</h4>
              <p>{{ getNewsMetadata().excerpt }}</p>
              <span class="read-more">Leer más -></span>
            </div>
          </div>
          <p class="note">La imagen y textos se extraen automáticamente de tu diseño.</p>
          <button @click="viewMode = 'editor'" class="back-btn">Volver al Editor</button>
        </div>
      </div>

      <!-- VISTA EDITOR -->
      <div v-else class="editor-workspace">
        
        <!-- BARRA LATERAL (HERRAMIENTAS) -->
        <div class="sidebar-tools">
          <h3>Componentes</h3>
          <div class="tools-grid">
            <button @click="addElement('headline')" class="tool-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>
              <span>Titular</span>
            </button>
            <button @click="addElement('subhead')" class="tool-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>
              <span>Subtítulo</span>
            </button>
            <button @click="addElement('body')" class="tool-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg>
              <span>Párrafo</span>
            </button>
            <button @click="addElement('image')" class="tool-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              <span>Imagen</span>
            </button>
            <button @click="addElement('divider')" class="tool-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              <span>Separador</span>
            </button>
          </div>

          <!-- FILTROS DE UBICACIÓN -->
          <div class="location-section">
            <h3>Publicar en:</h3>
            <select v-model="form.regionId" class="mini-select">
              <option value="">Todas las Regiones</option>
              <option v-for="r in regiones" :key="r._id" :value="r._id">{{ r.nombre }}</option>
            </select>
            <select v-model="form.comunaId" class="mini-select" :disabled="!form.regionId">
              <option value="">Todas las Comunas</option>
              <option v-for="c in comunasFiltradas" :key="c._id" :value="c._id">{{ c.nombre }}</option>
            </select>
            <select v-model="form.instalacionId" class="mini-select" :disabled="!form.comunaId">
              <option value="">Todas las Instalaciones</option>
              <option v-for="i in instalacionesFiltradas" :key="i._id" :value="i._id">{{ i.nombre }}</option>
            </select>
          </div>

          <button @click="handleSubmit" class="publish-btn" :disabled="isLoading">
            {{ isLoading ? 'Guardando...' : 'Guardar Cambios' }}
          </button>
          <p v-if="error" class="error-msg">{{ error }}</p>
          <p v-if="success" class="success-msg">{{ success }}</p>
        </div>

        <!-- CANVAS CENTRAL -->
        <div class="canvas-area" @click="selectedId = null">
          <div 
            ref="canvasRef"
            class="canvas-paper"
            :style="{ 
              width: canvasSizes[deviceMode].width + 'px', 
              height: canvasSizes[deviceMode].height + 'px' 
            }"
          >
            <!-- Renderizado de Elementos -->
            <div 
              v-for="element in elements" 
              :key="element.id"
              class="canvas-element"
              :class="{ selected: selectedId === element.id }"
              :style="getElementStyle(element)"
              @mousedown.stop="handleMouseDown($event, element.id)"
              @click.stop
            >
              <!-- Contenido Texto -->
              <div v-if="element.type === 'text'" class="element-content text">
                {{ element.content }}
              </div>
              
              <!-- Contenido Imagen -->
              <img v-if="element.type === 'image'" :src="element.src" class="element-content image" />
              
              <!-- Contenido Box/Divider -->
              <div v-if="element.type === 'box'" class="element-content box"></div>

              <!-- Botón Eliminar -->
              <button v-if="selectedId === element.id" class="delete-element-btn" @click.stop="deleteElement(element.id)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>

              <!-- Etiqueta de modo -->
              <div v-if="selectedId === element.id" class="mode-tag" :class="deviceMode">
                {{ deviceMode === 'desktop' ? 'PC' : 'Móvil' }}
              </div>
            </div>

            <div v-if="elements.length === 0" class="empty-state">
              Arrastra elementos aquí
            </div>
          </div>
        </div>

        <!-- PANEL DE PROPIEDADES (DERECHA) -->
        <div class="properties-panel" :class="{ open: selectedId }">
          <div v-if="selectedElement" class="props-content">
            <div class="props-header">
              <h4>Propiedades</h4>
              <button @click="selectedId = null">×</button>
            </div>

            <!-- Editor de Texto -->
            <div v-if="selectedElement.type === 'text'" class="form-group">
              <label>Texto (Compartido)</label>
              <textarea v-model="selectedElement.content" rows="4"></textarea>
            </div>
              <!-- Subir Imagen y optimizar -->
              <div v-if="selectedElement.type === 'image'" class="form-group">
                <label>Subir Imagen</label>
                <input type="file" accept="image/*" @change="handleImageUpload" />
              </div>

            <!-- Editor de Layout -->
            <div class="form-group">
              <label>Ancho ({{ deviceMode }})</label>
              <input 
                type="range" 
                min="50" 
                :max="canvasSizes[deviceMode].width" 
                step="10" 
                v-model.number="selectedElement.layout[deviceMode].width"
              >
              <span>{{ selectedElement.layout[deviceMode].width }}px</span>
            </div>

            <!-- Estilos (Texto) -->
            <div v-if="selectedElement.type === 'text'" class="style-grid">
              <div class="form-group">
                <label>Tamaño</label>
                <input type="text" v-model="selectedElement.style.fontSize">
              </div>
              <div class="form-group">
                <label>Color</label>
                <input type="color" v-model="selectedElement.style.color">
              </div>
              <div class="form-group full">
                <label>Alineación</label>
                <div class="align-buttons">
                  <button @click="selectedElement.style.textAlign = 'left'">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg>
                  </button>
                  <button @click="selectedElement.style.textAlign = 'center'">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="10" x2="6" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="18" y1="18" x2="6" y2="18"></line></svg>
                  </button>
                  <button @click="selectedElement.style.textAlign = 'right'">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="10" x2="7" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="7" y2="18"></line></svg>
                  </button>
                  <button @click="selectedElement.style.textAlign = 'justify'">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>
                  </button>
                </div>
              </div>
            </div>

          </div>
          <div v-else class="no-selection">
            Selecciona un elemento para editar
          </div>
        </div>

      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useAuth } from '../../../../composables/useAuth';
import { useRouter, useRoute } from 'vue-router';

definePageMeta({
  layout: 'admin'
});

// --- Tipos ---
interface Layout {
  x: number; y: number; width: number | string; height: number | string;
}
interface Element {
  id: string;
  type: 'text' | 'image' | 'box';
  role: string;
  content: string;
  src?: string;
  layout: { desktop: Layout; mobile: Layout };
  style: any;
}

// --- Setup Base ---
const { accessToken, user } = useAuth();
const router = useRouter();
const route = useRoute();
const noticiaId = route.params.id as string;

// --- Estado del Editor ---
const elements = ref<Element[]>([]);
const selectedId = ref<string | null>(null);
const viewMode = ref<'editor' | 'feed_preview'>('editor');
const deviceMode = ref<'desktop' | 'mobile'>('desktop');
const cargandoNoticia = ref(true);

const canvasSizes = {
  desktop: { width: 800, height: 1200 },
  mobile: { width: 375, height: 1000 }
};

// Estado de Arrastre
const draggingId = ref<string | null>(null);
const dragOffset = ref({ x: 0, y: 0 });
const canvasRef = ref<HTMLElement | null>(null);

// --- Estado de Formulario (Filtros) ---
const form = ref({ regionId: '', comunaId: '', instalacionId: '' });
const regiones = ref<any[]>([]);
const comunas = ref<any[]>([]);
const instalaciones = ref<any[]>([]);
const error = ref('');
const success = ref('');
const isLoading = ref(false);

// --- Computed ---
const selectedElement = computed(() => elements.value.find(e => e.id === selectedId.value));
// --- Optimización de imágenes al subir ---
const handleImageUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const img = new window.Image();
  img.src = URL.createObjectURL(file);
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const maxWidth = 800;
    const maxHeight = 600;
    let { width, height } = img;
    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width = width * ratio;
      height = height * ratio;
    }
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(img, 0, 0, width, height);
    // Convertir a base64 JPEG (calidad 0.8)
    const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    // Asignar al elemento seleccionado si es imagen
    if (selectedElement.value && selectedElement.value.type === 'image') {
      selectedElement.value.src = optimizedDataUrl;
    }
  };
};

const comunasFiltradas = computed(() => {
  if (!form.value.regionId) return [];
  return comunas.value.filter(c => c.regionId === form.value.regionId);
});

const instalacionesFiltradas = computed(() => {
  if (!form.value.comunaId) return [];
  return instalaciones.value.filter(i => i.comunaId === form.value.comunaId);
});

// --- Watchers Filtros ---
watch(() => form.value.regionId, () => { form.value.comunaId = ''; form.value.instalacionId = ''; });
watch(() => form.value.comunaId, () => { form.value.instalacionId = ''; });

// --- Carga Inicial ---
onMounted(async () => {
  if (!user.value || user.value.rol !== 'admin') router.replace('/');
  
  const runtimeConfig = useRuntimeConfig();
  const apiUrl = runtimeConfig.public.apiUrl;
  try {
    // Cargar datos de regiones
    const [reg, com, inst] = await Promise.all([
       $fetch<any[]>(`${apiUrl}/regiones`),
       $fetch<any[]>(`${apiUrl}/comunas`),
       $fetch<any[]>(`${apiUrl}/instalaciones`),
    ]);
    regiones.value = reg; 
    comunas.value = com; 
    instalaciones.value = inst;

    // Cargar la noticia existente
    const noticia = await $fetch<any>(`${apiUrl}/noticia/${noticiaId}`);
    
    // Cargar el contentJson en el editor
    if (noticia.contentJson && Array.isArray(noticia.contentJson)) {
      elements.value = noticia.contentJson;
    }

    // Cargar filtros
    form.value.regionId = noticia.regionId || '';
    form.value.comunaId = noticia.comunaId || '';
    form.value.instalacionId = noticia.instalacionId || '';

  } catch (e) { 
    console.error('Error cargando datos:', e);
    error.value = 'Error al cargar la noticia';
  } finally {
    cargandoNoticia.value = false;
  }

  // Event Listeners Globales para Drag & Drop
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseup', handleMouseUp);
});

// --- LÓGICA DEL EDITOR (Igual que crear-noticia.vue) ---

const elementTypes = {
    headline: {
      type: 'text', role: 'title', content: 'TITULAR',
      style: { fontSize: '36px', fontWeight: 'bold', color: '#1a1a1a', textAlign: 'center' },
      defaultWidth: 600, mobileWidth: 340
    },
    subhead: {
      type: 'text', role: 'subtitle', content: 'Subtítulo',
      style: { fontSize: '24px', fontWeight: '600', color: '#444', textAlign: 'left' },
      defaultWidth: 500, mobileWidth: 320
    },
    body: {
      type: 'text', role: 'body', content: 'Escribe tu contenido aquí...',
      style: { fontSize: '16px', lineHeight: '1.6', color: '#333', textAlign: 'justify' },
      defaultWidth: 400, mobileWidth: 340
    },
    image: {
      type: 'image', role: 'main_image', content: 'Img', src: 'https://via.placeholder.com/400x300',
      style: { borderRadius: '4px' },
      defaultWidth: 400, mobileWidth: 350, height: 250
    },
    divider: {
      type: 'box', role: 'decoration', content: '',
      style: { backgroundColor: '#000', height: '2px' },
      defaultWidth: 600, mobileWidth: 300, height: 2
    }
};

const addElement = (typeKey: string) => {
  const tmpl = elementTypes[typeKey as keyof typeof elementTypes];
  const dWidth = canvasSizes.desktop.width;
  const mWidth = canvasSizes.mobile.width;
  const dHeight = canvasSizes.desktop.height;
  const mHeight = canvasSizes.mobile.height;
  
  let yPos = elements.value.length > 0 ? (elements.value.length * 80) + 50 : 50;
  
  const elementHeight = (tmpl as any).height || 50;
  if (yPos + elementHeight > dHeight) {
    yPos = dHeight - elementHeight - 20;
  }
  
  let yPosMobile = yPos;
  if (yPosMobile + elementHeight > mHeight) {
    yPosMobile = mHeight - elementHeight - 20;
  }

  const newEl: Element = {
    id: Date.now().toString(),
    type: tmpl.type as any,
    role: tmpl.role,
    content: tmpl.content,
    src: (tmpl as any).src,
    layout: {
      desktop: { 
        x: Math.max(0, Math.min((dWidth / 2) - (tmpl.defaultWidth / 2), dWidth - tmpl.defaultWidth)), 
        y: yPos, 
        width: tmpl.defaultWidth, 
        height: (tmpl as any).height || 'auto' 
      },
      mobile: { 
        x: Math.max(0, Math.min((mWidth / 2) - (tmpl.mobileWidth / 2), mWidth - tmpl.mobileWidth)), 
        y: yPosMobile, 
        width: tmpl.mobileWidth, 
        height: (tmpl as any).height || 'auto' 
      }
    },
    style: { ...tmpl.style }
  };
  elements.value.push(newEl);
  selectedId.value = newEl.id;
};

const handleMouseDown = (e: MouseEvent, id: string) => {
  if (viewMode.value !== 'editor') return;
  
  selectedId.value = id;
  
  const el = elements.value.find(x => x.id === id);
  if (!el || !canvasRef.value) return;

  const currentLayout = el.layout[deviceMode.value];
  const canvasRect = canvasRef.value.getBoundingClientRect();
  
  dragOffset.value = {
    x: e.clientX - canvasRect.left - currentLayout.x,
    y: e.clientY - canvasRect.top - currentLayout.y
  };
  
  draggingId.value = id;
};

const handleMouseMove = (e: MouseEvent) => {
  if (!draggingId.value || !canvasRef.value) return;

  const el = elements.value.find(x => x.id === draggingId.value);
  if (!el) return;

  const canvasRect = canvasRef.value.getBoundingClientRect();
  let newX = e.clientX - canvasRect.left - dragOffset.value.x;
  let newY = e.clientY - canvasRect.top - dragOffset.value.y;

  const layout = el.layout[deviceMode.value];
  const elementWidth = typeof layout.width === 'number' ? layout.width : 100;
  const elementHeight = typeof layout.height === 'number' ? layout.height : 50;
  
  const maxX = canvasSizes[deviceMode.value].width - elementWidth;
  const maxY = canvasSizes[deviceMode.value].height - elementHeight;
  
  newX = Math.max(0, Math.min(newX, maxX));
  newY = Math.max(0, Math.min(newY, maxY));

  newX = Math.round(newX / 10) * 10;
  newY = Math.round(newY / 10) * 10;

  el.layout[deviceMode.value].x = newX;
  el.layout[deviceMode.value].y = newY;
};

const handleMouseUp = () => {
  draggingId.value = null;
};

const getElementStyle = (element: Element) => {
  const l = element.layout[deviceMode.value];
  return {
    left: `${l.x}px`,
    top: `${l.y}px`,
    width: typeof l.width === 'number' ? `${l.width}px` : l.width,
    height: typeof l.height === 'number' ? `${l.height}px` : l.height,
    ...element.style
  };
};

const deleteElement = (id: string) => {
  elements.value = elements.value.filter(e => e.id !== id);
  selectedId.value = null;
};

const togglePreview = () => {
  viewMode.value = viewMode.value === 'editor' ? 'feed_preview' : 'editor';
};

const getNewsMetadata = () => {
  const titleEl = elements.value.find(e => e.role === 'title') || elements.value.find(e => e.type === 'text');
  const imageEl = elements.value.find(e => e.type === 'image');
  const bodyEl = elements.value.find(e => e.role === 'body') || elements.value.find(e => e.type === 'text' && e.id !== titleEl?.id);

  return {
    title: titleEl ? titleEl.content : 'Sin título',
    image: imageEl ? imageEl.src : null,
    excerpt: bodyEl ? bodyEl.content.substring(0, 120) + '...' : '...'
  };
};

// --- SUBMIT (Actualizar) ---
const handleSubmit = async () => {
  error.value = '';
  success.value = '';
  isLoading.value = true;

  const meta = getNewsMetadata();

  if (elements.value.length === 0) {
    error.value = "El lienzo está vacío.";
    isLoading.value = false;
    return;
  }

  try {
    const body: any = {
      tipo: 'noticia',
      titulo: meta.title,
      texto: meta.excerpt,
      contentJson: elements.value,
    };

    if (form.value.regionId) body.regionId = form.value.regionId;
    if (form.value.comunaId) body.comunaId = form.value.comunaId;
    if (form.value.instalacionId) body.instalacionId = form.value.instalacionId;

    await $fetch(`${apiUrl}/noticia/${noticiaId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      },
      body,
    });

    success.value = '¡Cambios guardados! Redirigiendo...';
    setTimeout(() => router.push('/admin/noticiasAdmin'), 2000);

  } catch (err: any) {
    error.value = err.data?.error || 'Error al actualizar.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Reutilizamos los mismos estilos de crear-noticia.vue */
* { box-sizing: border-box; }

.loading-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2563eb;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.news-editor-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 84px);
  background-color: #f3f4f6;
  overflow: hidden;
}

.editor-controls {
  height: 60px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 10;
}
.controls-left { display: flex; align-items: center; gap: 10px; }
.btn-back {
  display: flex; align-items: center; gap: 6px;
  background: white; border: 1px solid #d1d5db; padding: 6px 12px; border-radius: 6px; cursor: pointer;
  font-weight: 500; color: #374151; transition: all 0.2s;
}
.btn-back:hover { background: #f9fafb; }
.badge { font-size: 0.75rem; background: #e0e7ff; color: #3730a3; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; font-weight: 600; }

.device-toggle {
  background: #f3f4f6;
  padding: 4px;
  border-radius: 8px;
  display: flex;
  gap: 4px;
}
.device-toggle button {
  border: none;
  background: transparent;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
}
.device-toggle button.active {
  background: white;
  color: #2563eb;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.preview-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #1f2937;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
}

.editor-workspace {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar-tools {
  width: 260px;
  background: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow-y: auto;
  z-index: 5;
}
.sidebar-tools h3 { font-size: 0.85rem; text-transform: uppercase; color: #9ca3af; margin-bottom: 15px; letter-spacing: 0.05em; }

.tools-grid {
  display: grid;
  gap: 10px;
  margin-bottom: 30px;
}
.tool-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px;
  background: #f9fafb;
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  color: #4b5563;
  transition: all 0.2s;
  font-weight: 500;
}
.tool-btn:hover { background: #eff6ff; color: #2563eb; border-color: #bfdbfe; }

.location-section {
  margin-top: auto;
  border-top: 1px solid #e5e7eb;
  padding-top: 20px;
}
.mini-select {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
}

.publish-btn {
  width: 100%;
  background: #2563eb;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
}
.publish-btn:disabled { background: #93c5fd; cursor: not-allowed; }
.error-msg { color: #dc2626; font-size: 0.85rem; margin-top: 10px; }
.success-msg { color: #16a34a; font-size: 0.85rem; margin-top: 10px; }

.canvas-area {
  flex: 1;
  background: #e5e7eb;
  background-image: radial-gradient(#d1d5db 1px, transparent 1px);
  background-size: 20px 20px;
  overflow: auto;
  display: flex;
  justify-content: center;
  padding: 40px;
  position: relative;
}

.canvas-paper {
  background: white;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: width 0.3s ease;
}

.empty-state {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  pointer-events: none;
}

.canvas-element {
  position: absolute;
  transition: box-shadow 0.2s;
}
.canvas-element:hover { box-shadow: 0 0 0 1px #60a5fa; cursor: grab; }
.canvas-element.selected { box-shadow: 0 0 0 2px #2563eb; z-index: 10; }

.element-content { width: 100%; height: 100%; pointer-events: none; }
.element-content.text { white-space: pre-wrap; word-break: break-word; }
.element-content.image { object-fit: cover; border-radius: inherit; }
.element-content.box { width: 100%; height: 100%; }

.delete-element-btn {
  position: absolute;
  top: -10px; right: -10px;
  background: #ef4444;
  color: white;
  border: none;
  width: 24px; height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.mode-tag {
  position: absolute;
  top: -20px; left: 0;
  background: #2563eb;
  color: white;
  font-size: 0.65rem;
  padding: 2px 6px;
  border-radius: 4px 4px 0 0;
  font-weight: bold;
}
.mode-tag.mobile { background: #9333ea; }

.properties-panel {
  width: 280px;
  background: white;
  border-left: 1px solid #e5e7eb;
  transform: translateX(100%);
  transition: transform 0.3s;
  position: absolute;
  right: 0; top: 0; bottom: 0;
  z-index: 20;
}
.properties-panel.open { transform: translateX(0); position: relative; }

.props-header {
  padding: 15px;
  border-bottom: 1px solid #f3f4f6;
  display: flex; justify-content: space-between; align-items: center;
}
.props-header button { border: none; background: none; font-size: 1.5rem; cursor: pointer; color: #9ca3af; }

.props-content { padding: 20px; display: flex; flex-direction: column; gap: 20px; }

.form-group label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 5px;
  text-transform: uppercase;
}
.form-group textarea, .form-group input[type="text"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}
.style-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.full { grid-column: span 2; }

.align-buttons { display: flex; gap: 5px; background: #f3f4f6; padding: 4px; border-radius: 6px; }
.align-buttons button {
  flex: 1; border: none; background: white; padding: 5px; border-radius: 4px; cursor: pointer; display: flex; justify-content: center;
}
.align-buttons button:hover { background: #e5e7eb; }

.no-selection {
  height: 100%;
  display: flex;
  align-items: center; justify-content: center;
  color: #9ca3af;
  font-size: 0.9rem;
}

.preview-container {
  flex: 1;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.preview-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  text-align: center;
}
.news-card-simulation {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  text-align: left;
  margin: 20px 0;
  display: flex;
}
.card-img { width: 150px; height: 150px; background: #e5e7eb; }
.card-img img { width: 100%; height: 100%; object-fit: cover; }
.card-content { padding: 15px; flex: 1; }
.card-content h4 { margin: 0 0 10px 0; color: #111827; font-size: 1.1rem; }
.card-content p { font-size: 0.9rem; color: #6b7280; line-height: 1.4; margin-bottom: 10px; }
.read-more { font-size: 0.8rem; color: #2563eb; font-weight: 600; }
.note { font-size: 0.8rem; color: #9ca3af; margin-bottom: 20px; }
.back-btn { background: white; border: 1px solid #d1d5db; padding: 8px 16px; border-radius: 6px; cursor: pointer; }
</style>
