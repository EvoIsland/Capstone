import { useAuth } from '../../composables/useAuth'

export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, user, getProfile } = useAuth()

  // Si está autenticado pero el usuario aún no está cargado, espera el perfil
  if (isAuthenticated() && !user.value) {
    await getProfile()
  }

  // Si está autenticado y va a login o registro, redirige según el rol
  if ((to.path === '/' || to.path === '/registro') && isAuthenticated()) {
    if (user.value?.rol === 'admin') {
      return navigateTo('/admin/crear-noticia')
    }
    return navigateTo('/foroMain')
  }

  // Si NO está autenticado y va a una ruta protegida, redirige al login
  const protectedRoutes = ['/foroMain', '/admin/crear-noticia']
  if (protectedRoutes.includes(to.path) && !isAuthenticated()) {
    return navigateTo('/')
  }

  // Si intenta acceder a la ruta de admin y no es admin, redirige al foro
  if (to.path === '/admin/crear-noticia' && user.value?.rol !== 'admin') {
    return navigateTo('/foroMain')
  }
})