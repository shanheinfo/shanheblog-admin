import { useAuthStore } from '@/stores/auth'

export function setupRouteGuard(router) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    
    if (to.path === '/login' && authStore.token) {
      next('/')
      return
    }
    
    if (to.meta.requiresAuth && !authStore.token) {
      // if (import.meta.env.DEV) {
      //   next()
      //   return
      // }
      next('/login')
      return
    }
    
    next()
  })
}
