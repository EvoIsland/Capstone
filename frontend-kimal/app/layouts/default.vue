<template>
  <div class="layout-wrapper">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="anchoMaximo navbar-content">
        <!-- Logo y título -->
        <div class="navbar-brand">
          <div class="logo-container">
            <img src="/images/logokimal.svg" alt="Logo Kimal" class="logo-kimal">
            <p class="brand-subtitle">Línea Kimal - Lo Aguirre</p>
          </div>
        </div>
      </div>
    </nav>

    <!-- Contenido principal -->
    <main class="main-content">
      <slot />
    </main>

    <!-- Chatbot flotante -->
    <ChatbotFloating />
  </div>
</template>

<script setup>
import ChatbotFloating from '~/components/ui/chatbotFloating.vue'
</script>

<style lang="sass">
@use '@sass/base' as *

// Reset específico para el layout sin interferir con otros componentes
.layout-wrapper
  min-height: 100vh
  display: flex
  flex-direction: column
  margin: 0
  padding: 0
  position: relative

.navbar
  background: linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A855F7 100%)
  position: fixed
  top: 0
  left: 0
  right: 0
  z-index: 1000
  padding: 1.5rem 0
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3)
  width: 100%

.navbar-content
  display: flex
  align-items: center
  justify-content: space-between
  gap: 2rem

.navbar-brand
  flex: 1

.logo-container
  display: flex
  flex-direction: column
  gap: 0.4rem
  align-items: flex-start

.logo-kimal
  height: 3.2rem
  width: auto
  object-fit: contain

.brand-title
  font-size: 2.4rem
  font-weight: 300
  color: white
  margin: 0
  letter-spacing: 0.1rem

.brand-equals
  color: #10B981
  font-weight: 500

.brand-subtitle
  font-size: 1rem
  color: rgba(255, 255, 255, 0.8)
  margin: 0
  font-weight: 300

.navbar-menu
  display: flex
  align-items: center
  gap: 2rem
  flex: 1
  justify-content: center

.menu-icon
  display: flex
  flex-direction: column
  gap: 0.4rem
  cursor: pointer
  padding: 0.8rem

.menu-line
  width: 2.4rem
  height: 0.2rem
  background: #10B981
  border-radius: 0.1rem
  transition: all 0.3s ease

.menu-plus
  background: #10B981
  width: 4rem
  height: 4rem
  border-radius: 50%
  display: flex
  align-items: center
  justify-content: center
  cursor: pointer
  transition: all 0.3s ease

  &:hover
    transform: scale(1.1)
    box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4)

.plus-icon
  font-size: 2.4rem
  color: white
  font-weight: 300
  line-height: 1

.navbar-right
  display: flex
  align-items: center
  gap: 2rem
  flex: 1
  justify-content: flex-end

.flag-chile
  display: flex
  flex-direction: column
  width: 4rem
  height: 2.8rem
  border-radius: 0.4rem
  overflow: hidden
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2)
  cursor: pointer
  transition: transform 0.3s ease
  position: relative

  &:hover
    transform: scale(1.05)

.flag-blue
  background: #0F4C94
  height: 50%
  width: 50%
  display: flex
  align-items: center
  justify-content: center

.flag-star
  color: white
  font-size: 1rem

.flag-white
  background: white
  height: 50%
  width: 50%
  position: absolute
  top: 0
  right: 0

.flag-red
  background: #D52B1E
  height: 50%
  width: 100%

.user-avatar
  cursor: pointer

.avatar-circle
  width: 4.8rem
  height: 4.8rem
  border-radius: 50%
  background: rgba(255, 255, 255, 0.2)
  display: flex
  align-items: center
  justify-content: center
  border: 2px solid rgba(255, 255, 255, 0.3)
  transition: all 0.3s ease

  &:hover
    background: rgba(255, 255, 255, 0.3)
    transform: scale(1.05)

.avatar-icon
  font-size: 2rem
  color: white

.main-content
  flex: 1
  background-color: var(--fondo-claro)
  min-height: 0
  padding-top: 8rem  // Espacio para compensar el navbar fijo

// Responsive siguiendo los patrones del sistema
@media screen and (max-width: 1000px)
  .navbar
    padding: 1rem 0

  .main-content
    padding-top: 6.5rem  // Menos espacio en tablet

  .navbar-content
    gap: 1rem

  .logo-kimal
    height: 2.8rem

  .brand-subtitle
    font-size: 0.9rem

  .navbar-menu
    gap: 1rem

  .menu-plus
    width: 3.2rem
    height: 3.2rem

  .plus-icon
    font-size: 2rem

  .flag-chile
    width: 3.2rem
    height: 2.2rem

  .avatar-circle
    width: 4rem
    height: 4rem

  .avatar-icon
    font-size: 1.6rem

@media screen and (max-width: 600px)
  .logo-kimal
    height: 2.4rem

  .main-content
    padding-top: 5.5rem  // Menos espacio en móvil

  .navbar-content
    flex-wrap: wrap
    gap: 1rem

  .navbar-brand, .navbar-right
    flex: none

  .navbar-menu
    order: 3
    width: 100%
    justify-content: center
    margin-top: 1rem
</style>
