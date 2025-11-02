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
  path: '/projects',
  name: 'projects',
  component: () => import('../views/ProjectsView.vue')
    },
    {
  path: '/contact',
  name: 'contact',
  component: () => import('../views/ContactView.vue')
    },
    {
  path: '/poke-forms',
  name: 'pokemonquiz',
  component: () => import('@/views/PokeFormsView.vue'),
  meta: {
    title: 'Pokémon Quiz'
  }
    },

    {
    path: '/i-list',
    name: 'interactivelist',
    component: () => import('@/views/InteractiveListView.vue')
    }
  ]
})

export default router