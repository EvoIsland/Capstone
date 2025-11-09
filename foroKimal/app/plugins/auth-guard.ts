import { useAuth } from '../../composables/useAuth'

export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()
  // Si el usuario está autenticado y va a login o registro
  if ((to.path === '/' || to.path === '/registro') && isAuthenticated()) {
    return navigateTo('/foroMain')
  }
})