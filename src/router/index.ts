import { createRouter, createWebHistory } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminView.vue') 
    },
    {
      path: '/admin/moderacao',
      name: 'moderation',
      component: () => import('@/views/ModerationView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/components',
      name: 'component-library',
      component: () => import('@/views/ComponentLibraryView.vue'),
      meta: { requiresAuth: true } 
    },
    {
      path: '/admin/icons',
      name: 'icons',
      component: () => import('@/views/IconsLibraryView.vue'),
      meta: { requiresAuth: true } 
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('@/views/BlogView.vue')
    },
    {
      path: '/post/:slug',
      name: 'blog-post',
      component: () => import('@/views/BlogPostView.vue')
    },
    {
      path: '/i-list',
      name: 'interactivelist',
      component: () => import('@/views/InteractiveListView.vue')
    },
    {
      path: '/grade-horaria',
      name: 'gradehoraria',
      component: () => import('@/views/GradeHorariaView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const adminStore = useAdminStore()

  adminStore.checkAuth()
  
  if (to.meta.requiresAuth && !adminStore.isAuthenticated) {
    next('/admin')
  } 

  else {
    next() 
  }
})

export default router