import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDropdownStore = defineStore('dropdown', () => {
  const openDropdownId = ref<string | null>(null)

  const setOpenDropdown = (id: string): void => {
    openDropdownId.value = id
  }

  const closeDropdown = (): void => {
    openDropdownId.value = null
  }

  const isDropdownOpen = (id: string): boolean => {
    return openDropdownId.value === id
  }

  return {
    openDropdownId,
    setOpenDropdown,
    closeDropdown,
    isDropdownOpen
  }
})