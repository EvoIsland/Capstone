<template>
  <div class="forum-page">
    
    <!-- ========================================= -->
    <!--          FONDO DECORATIVO (Sutil)         -->
    <!-- ========================================= -->
    <!-- Arcos decorativos (Solo parte superior derecha) -->
    <div class="bg-decoration top-right">
      <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(350, -50)">
          <circle cx="0" cy="0" r="280" fill="none" stroke="#6200EA" stroke-width="30" opacity="0.1" />
          <circle cx="0" cy="0" r="220" fill="none" stroke="#00E5FF" stroke-width="30" opacity="0.15" />
          <circle cx="0" cy="0" r="160" fill="none" stroke="#FF4081" stroke-width="30" opacity="0.1" />
        </g>
      </svg>
    </div>

    <!-- ========================================= -->
    <!--                 NAVBAR                    -->
    <!-- ========================================= -->
    <nav class="navbar">
      <div class="container nav-content">
        <div class="brand">
          <h1 class="brand-text">MiConexion<span class="brand-highlight">Kimal</span></h1>
        </div>
        <div class="nav-actions">
          <div class="search-bar">
            <Icon icon="mdi:magnify" class="search-icon" />
            <input type="text" placeholder="Buscar temas..." />
          </div>
          <div class="user-profile">
            <div class="avatar">JP</div>
          </div>
        </div>
      </div>
    </nav>

    <!-- ========================================= -->
    <!--             CONTENIDO PRINCIPAL           -->
    <!-- ========================================= -->
    <main class="container main-grid">
      
      <!-- SIDEBAR (Categorías) -->
      <aside class="sidebar">
        <button class="btn-new-topic">
          <Icon icon="mdi:plus" class="btn-icon" />
          Nuevo Tema
        </button>

        <div class="categories-box">
          <h3 class="sidebar-title">Categorías</h3>
          <ul class="category-list">
            <li v-for="cat in categories" :key="cat.id" :class="{ active: cat.active }" class="category-item">
              <span class="cat-indicator" :style="{ background: cat.color }"></span>
              {{ cat.name }}
              <span class="cat-count">{{ cat.count }}</span>
            </li>
          </ul>
        </div>

        <!-- Decoración pequeña en sidebar (Cápsulas) -->
        <div class="sidebar-decoration">
          <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
             <g transform="rotate(-45, 100, 50)">
               <rect x="50" y="20" width="120" height="15" rx="7.5" fill="#FF4081" opacity="0.8"/>
               <rect x="70" y="45" width="120" height="15" rx="7.5" fill="#00E5FF" opacity="0.8"/>
             </g>
          </svg>
        </div>
      </aside>

      <!-- LISTA DE TEMAS -->
      <section class="feed">
        
        <!-- Filtros Rápidos -->
        <div class="feed-header">
          <h2 class="feed-title">Discusiones Recientes</h2>
          <div class="feed-tabs">
            <span class="tab active">Recientes</span>
            <span class="tab">Populares</span>
            <span class="tab">Sin respuesta</span>
          </div>
        </div>

        <!-- Cards de Temas -->
        <div class="topic-list">
          <div v-for="topic in topics" :key="topic.id" class="topic-card">
            
            <!-- Columna Votos -->
            <div class="topic-votes">
              <Icon icon="mdi:chevron-up" class="vote-icon" />
              <span class="vote-count">{{ topic.votes }}</span>
            </div>

            <!-- Contenido Central -->
            <div class="topic-content">
              <div class="topic-meta">
                <span class="topic-category" :style="{ color: topic.catColor, background: topic.catColor + '20' }">
                  {{ topic.category }}
                </span>
                <span class="topic-date">hace {{ topic.time }}</span>
              </div>
              <h3 class="topic-title">{{ topic.title }}</h3>
              <p class="topic-excerpt">{{ topic.excerpt }}</p>
              
              <div class="topic-footer">
                 <div class="topic-author">
                   <div class="author-avatar" :style="{ backgroundColor: topic.authorColor }">{{ topic.author[0] }}</div>
                   <span>{{ topic.author }}</span>
                 </div>
                 <div class="topic-stats">
                   <div class="stat">
                     <Icon icon="mdi:message-outline" /> {{ topic.replies }}
                   </div>
                   <div class="stat">
                     <Icon icon="mdi:eye-outline" /> {{ topic.views }}
                   </div>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

// Datos Mock
const categories = ref([
  { id: 1, name: 'General', count: 120, active: true, color: '#6200EA' },
  { id: 2, name: 'Anuncios', count: 45, active: false, color: '#FF4081' },
  { id: 3, name: 'Soporte Técnico', count: 82, active: false, color: '#00E5FF' },
  { id: 4, name: 'Sugerencias', count: 15, active: false, color: '#7C4DFF' },
])

const topics = ref([
  { 
    id: 1, 
    title: 'Bienvenidos a la nueva comunidad Kimal', 
    excerpt: 'Estamos muy emocionados de lanzar este nuevo espacio para todos nuestros usuarios...',
    category: 'Anuncios',
    catColor: '#FF4081',
    author: 'Admin',
    authorColor: '#6200EA',
    time: '2h',
    votes: 45,
    replies: 12,
    views: 340
  },
  { 
    id: 2, 
    title: '¿Cómo puedo cambiar mi contraseña?', 
    excerpt: 'He intentado desde el panel de configuración pero no me llega el correo de confirmación.',
    category: 'Soporte Técnico',
    catColor: '#00E5FF',
    author: 'JuanPerez',
    authorColor: '#FF9100',
    time: '4h',
    votes: 12,
    replies: 5,
    views: 120
  },
  { 
    id: 3, 
    title: 'Mejoras propuestas para la interfaz de usuario', 
    excerpt: 'Creo que sería genial si pudiéramos tener un modo oscuro nativo en la próxima versión.',
    category: 'Sugerencias',
    catColor: '#7C4DFF',
    author: 'MariaDesign',
    authorColor: '#E91E63',
    time: '1d',
    votes: 89,
    replies: 34,
    views: 890
  }
])
</script>

<style scoped>
/* Reset básico */
* {
  box-sizing: border-box;
}

.forum-page {
  min-height: 100vh;
  background-color: #F8F9FC; /* Gris muy suave de fondo */
  color: #333;
  font-family: 'Roboto', sans-serif;
  position: relative;
  overflow-x: hidden;
}

/* --- DECORACIONES DE FONDO --- */
.bg-decoration {
  position: absolute;
  z-index: 0;
  pointer-events: none;
}

.top-right {
  top: 0;
  right: 0;
  width: 400px;
  height: 400px;
}

/* --- NAVBAR --- */
.navbar {
  background: white;
  height: 70px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.03);
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.brand-highlight {
  color: #6200EA;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-bar {
  position: relative;
  background: #f0f2f5;
  border-radius: 20px;
  padding: 8px 15px;
  display: flex;
  align-items: center;
  width: 300px;
}

.search-icon {
  color: #888;
  margin-right: 8px;
}

.search-bar input {
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  color: #333;
}

.avatar {
  width: 40px;
  height: 40px;
  background: #6200EA;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
}

/* --- LAYOUT PRINCIPAL --- */
.main-grid {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 30px;
  padding-top: 40px;
  padding-bottom: 40px;
  position: relative;
  z-index: 10;
}

/* --- SIDEBAR --- */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.btn-new-topic {
  width: 100%;
  padding: 14px;
  background: #FF4081; /* Rosa de acento */
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(255, 64, 129, 0.3);
  transition: transform 0.2s;
}

.btn-new-topic:hover {
  transform: translateY(-2px);
  background: #f50057;
}

.categories-box {
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
}

.sidebar-title {
  font-size: 0.9rem;
  text-transform: uppercase;
  color: #888;
  letter-spacing: 1px;
  margin-bottom: 15px;
  margin-top: 0;
}

.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  color: #555;
  font-weight: 500;
  transition: all 0.2s;
  margin-bottom: 5px;
}

.category-item:hover {
  background: #f5f5f5;
  color: #6200EA;
}

.category-item.active {
  background: #F3E5F5; /* Morado muy claro */
  color: #6200EA;
}

.cat-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 10px;
}

.cat-count {
  margin-left: auto;
  font-size: 0.8rem;
  background: #eee;
  padding: 2px 8px;
  border-radius: 10px;
  color: #777;
}

.sidebar-decoration {
  opacity: 0.6;
  margin-top: 20px;
}

/* --- FEED / LISTA DE TEMAS --- */
.feed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.feed-title {
  font-size: 1.5rem;
  color: #333;
  margin: 0;
}

.feed-tabs {
  display: flex;
  gap: 20px;
}

.tab {
  cursor: pointer;
  color: #888;
  font-weight: 500;
  padding-bottom: 5px;
  position: relative;
}

.tab.active {
  color: #6200EA;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: #6200EA;
}

.topic-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.topic-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  gap: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid transparent;
}

.topic-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(98, 0, 234, 0.08);
  border-color: #E0E0E0;
}

.topic-votes {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 50px;
  padding-right: 15px;
  border-right: 1px solid #f0f0f0;
}

.vote-icon {
  color: #888;
  font-size: 24px;
  cursor: pointer;
}

.vote-icon:hover {
  color: #FF4081;
}

.vote-count {
  font-weight: bold;
  font-size: 1.1rem;
  color: #333;
}

.topic-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.topic-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.topic-category {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  text-transform: uppercase;
}

.topic-date {
  font-size: 0.8rem;
  color: #999;
}

.topic-title {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  color: #333;
  cursor: pointer;
}

.topic-title:hover {
  color: #6200EA;
}

.topic-excerpt {
  margin: 0 0 15px 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

.topic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.topic-author {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #555;
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
}

.topic-stats {
  display: flex;
  gap: 15px;
  color: #999;
  font-size: 0.9rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 5px;
}

/* Responsive */
@media (max-width: 768px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    display: none; /* O podrías hacerlo un menú hamburguesa */
  }
  
  .search-bar {
    width: 150px;
  }
}
</style>