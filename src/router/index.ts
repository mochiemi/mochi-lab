import { createRouter, createWebHistory } from 'vue-router'
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
      path: '/post/:slug',
      name: 'blog-post',
      component: () => import('../views/BlogPostView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/components',
      name: 'component-library',
      component: () => import('../views/ComponentLibraryView.vue')
    },
    {
      path: '/icons',
      name: 'icons',
      component: () => import('@/views/IconsLibraryView.vue')
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('@/views/BlogView.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue')
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
    },
    {
      path: '/admin/moderacao',
      name: 'moderation',
      component: () => import('@/views/ModerationView.vue')
  }
  ]
})

export default router