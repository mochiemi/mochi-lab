// stores/theme.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)

  const initializeTheme = () => {
    try {
      const savedTheme = localStorage.getItem('mochi-theme')
      
      if (savedTheme) {
        isDark.value = savedTheme === 'dark'
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        isDark.value = prefersDark
      }
      
      applyTheme()
    } catch (error) {
      console.error('Error initializing theme:', error)
    }
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    applyTheme()
    saveTheme()
  }

  const applyTheme = () => {
    const html = document.documentElement
    if (isDark.value) {
      html.classList.add('dark-theme')
    } else {
      html.classList.remove('dark-theme')
    }
  }

  const saveTheme = () => {
    try {
      localStorage.setItem('mochi-theme', isDark.value ? 'dark' : 'light')
    } catch (error) {
      console.error('Error saving theme preference:', error)
    }
  }

  return {
    isDark: computed(() => isDark.value),
    toggleTheme,
    initializeTheme
  }
})