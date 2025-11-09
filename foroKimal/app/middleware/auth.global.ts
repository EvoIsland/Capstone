import { useAuth } from '../../composables/useAuth'

export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()
  // Si está autenticado y va a login o registro, redirige al foro
  if ((to.path === '/' || to.path === '/registro') && isAuthenticated()) {
    return navigateTo('/foroMain')
  }
  // Si NO está autenticado y va a una ruta protegida, redirige al login
  const protectedRoutes = ['/foroMain', '/admin/crear-noticia'] // agrega aquí las rutas privadas
  if (protectedRoutes.includes(to.path) && !isAuthenticated()) {
    return navigateTo('/')
  }
})