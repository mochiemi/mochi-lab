import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAdminStore } from '@/stores/admin'

export const requireAdminAuth = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const adminStore = useAdminStore()
  adminStore.checkAuth()
  
  if (!adminStore.isAuthenticated) {
    next({ 
      path: '/admin/login', 
      query: { redirect: to.fullPath } 
    })
  } else {
    next()
  }
}