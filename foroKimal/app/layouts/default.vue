<template>
  <div>
    <div :class="['feed-header-overlay', { 'is-sticky': isSticky }]">
      <div class="feed-header">
        <div class="feed-title">MiConexionKimal</div>
        <div class="feed-tabs">
          <button :class="['feed-tab', activeTab === 'siguiendo' ? 'active' : '']" @click="activeTab = 'siguiendo'">
            <Icon icon="mdi:account-group" width="22" height="22" /> Siguiendo
          </button>
          <button :class="['feed-tab', activeTab === 'general' ? 'active' : '']" @click="activeTab = 'general'">
            <Icon icon="mdi:earth" width="22" height="22" /> General
          </button>
          <button :class="['feed-tab', activeTab === 'noticias' ? 'active' : '']" @click="activeTab = 'noticias'">
            <Icon icon="mdi:newspaper" width="22" height="22" /> Noticias
          </button>
        </div>
        <div class="feed-actions">
          <button class="feed-add-btn" @click="openAddPostModal">
            <Icon icon="mdi:plus" width="28" height="28" />
          </button>
          <div class="feed-user-circle">
            {{ userInitial }}
          </div>
        </div>
      </div>
    </div>
    <div class="feed-content" :style="{ marginTop: isSticky ? '110px' : '90px' }">
      <slot />
    </div>
    <AddPostModal v-if="showAddPostModal" v-model="showAddPostModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuth } from '../../composables/useAuth';

const { user, getProfile } = useAuth()

const showAddPostModal = ref(false) //Se asigna de manera predeterimanda que el postModal este cerrado
const activeTab = ref('general')



function openAddPostModal(){
  showAddPostModal.value = true
}

const isSticky = ref(false)
function handleScroll() {
  isSticky.value = window.scrollY > 10
}
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  getProfile()
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})


const userInitial = computed(() =>{
  if (user.value && user.value.nombre) {
    return user.value.nombre.charAt(0).toUpperCase()
  }
  return ''
})

</script>

<style scoped lang="sass">

.feed-header-overlay
  position: fixed
  top: 0
  left: 0
  width: 100vw
  z-index: 100
  display: flex
  justify-content: center
  pointer-events: auto
  transition: box-shadow 0.3s, background 0.3s
  background: #8e24aa // Morado arriba

.feed-header-overlay.is-sticky
  background: transparent // Al bajar, desaparece el color morado y solo se ve el box


.feed-content
  position: relative
  z-index: 1
  transition: margin-top 0.3s

.feed-header
  display: flex
  align-items: center
  background: #8e24aa
  padding: 0.8rem 2rem
  border-radius: 2rem
  margin: 2rem auto 0 auto
  max-width: 1100px
  box-shadow: 0 2px 8px #0001

.feed-title 
  color: #fff
  font-weight: bold
  font-size: 1.5rem
  margin-right: 2rem

.feed-tabs 
  display: flex
  gap: 0.5rem
  background: #7c1fa2
  border-radius: 2rem
  padding: 0.3rem 1.2rem
  flex: 1
  justify-content: center

.feed-tab 
  background: transparent
  border: none
  color: #fff
  font-size: 1.1rem
  padding: 0.5rem 1.2rem
  border-radius: 1.2rem
  cursor: pointer
  transition: background 0.2s, color 0.2s
  display: flex
  align-items: center
  gap: 0.5rem

.feed-tab.active 
  background: #fff
  color: #8e24aa
  font-weight: bold

.feed-actions 
  display: flex
  align-items: center
  gap: 1rem
  margin-left: 2rem

.feed-add-btn 
  background: #43ea7f
  border: none
  color: #fff
  font-size: 1.5rem
  border-radius: 50%
  width: 40px
  height: 40px
  display: flex
  align-items: center
  justify-content: center
  cursor: pointer
  box-shadow: 0 2px 8px #0002
  transition: background 0.2s

.feed-add-btn:hover 
  background: #2bbd5b

.feed-user-circle 
  background: #fff
  color: #8e24aa
  border: 2px solid #8e24aa
  border-radius: 50%
  width: 40px
  height: 40px
  font-size: 1.3rem
  font-weight: bold
  display: flex
  align-items: center
  justify-content: center
</style>