import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAdminStore = defineStore('admin', () => {
  const isAuthenticated = ref<boolean>(false)
  const authError = ref<string>('')

  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'mochi2024'

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      isAuthenticated.value = true
      authError.value = ''
      localStorage.setItem('admin_auth', 'true')
      return true
    }
    authError.value = 'Senha incorreta'
    return false
  }

  const logout = (): void => {
    isAuthenticated.value = false
    localStorage.removeItem('admin_auth')
  }

  const checkAuth = (): void => {
    isAuthenticated.value = localStorage.getItem('admin_auth') === 'true'
  }

  return {
    isAuthenticated,
    authError,
    login,
    logout,
    checkAuth
  }
})