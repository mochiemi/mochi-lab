<template>
  <div class="dropdown" :class="{ 'dropdown-open': isOpen }">
    <button 
      class="dropdown-trigger"
      @click="toggleDropdown"
      :aria-expanded="isOpen"
    >
      <slot name="trigger">{{ label }}</slot>
      <span class="dropdown-arrow"><OhVueIcon name="oi-chevron-down" /></span>
    </button>
    
    <transition name="dropdown-fade">
      <div v-if="isOpen" class="dropdown-menu">
        <div class="dropdown-content">
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { OhVueIcon } from 'oh-vue-icons'
import { useDropdownStore } from '@/stores/dropdown'

interface Props {
  label?: string
  dropdownId: string
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Menu'
})

const dropdownStore = useDropdownStore()

const isOpen = computed(() => {
  return dropdownStore.isDropdownOpen(props.dropdownId)
})

const toggleDropdown = (): void => {
  if (isOpen.value) {
    dropdownStore.closeDropdown()
  } else {
    dropdownStore.setOpenDropdown(props.dropdownId)
  }
}

const closeDropdown = (): void => {
  dropdownStore.closeDropdown()
}

const handleClickOutside = (event: MouseEvent): void => {
  const target = event.target as HTMLElement
  if (!target.closest('.dropdown')) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  font-family: inherit;
  font-size: inherit;
}

.dropdown-trigger:hover {
  background-color: rgba(0, 148, 136, 0.2);
}

.dropdown-arrow {
  font-size: 0.8rem;
  transition: transform 0.3s ease;
}

.dropdown-open .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  min-width: 200px;
  margin-top: 0.5rem;
}

.dropdown-content {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: 0 4px 20px var(--shadow);
  padding: 0.5rem;
  backdrop-filter: blur(10px);
  outline: none;
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.3s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>