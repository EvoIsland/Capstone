import { useAuth } from '~~/composables/useAuth'

export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useAuth()

  // Si el usuario no es admin, redirige a la página principal
  if (user.value?.rol !== 'admin') {
    return navigateTo('/')
  }
  // Si es admin, permite el acceso (no retornes nada)
})