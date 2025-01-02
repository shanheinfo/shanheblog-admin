import { useAuthStore } from '@/stores/auth'

export function setupRouteGuard(router) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    
    if (to.meta.requiresAuth && !authStore.token) {
      next('/login')
      return
    }
    
    if (to.path === '/login' && authStore.token) {
      next('/')
      return
    }
    
    next()
  })
}
