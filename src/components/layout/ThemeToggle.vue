<template>
  <button
    @click="toggleTheme"
    :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    class="theme-toggle"
  >
    <transition name="theme-icon" mode="out-in">
      <span v-if="isDark" key="moon" class="theme-icon">
        <OhVueIcon name="ri-moon-clear-line" />
      </span>
      <span v-else key="sun" class="theme-icon">
        <OhVueIcon name="hi-sun" />
      </span>
    </transition>
  </button>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { OhVueIcon } from 'oh-vue-icons'

const themeStore = useThemeStore()

const isDark = computed(() => themeStore.isDark)

const toggleTheme = () => {
  themeStore.toggleTheme()
}

onMounted(() => {
  themeStore.initializeTheme()
})
</script>

<style scoped>
.theme-toggle {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px var(--shadow);
  font-size: 1.1rem;
  transition: all 0.3s ease;
  color: var(--text-secondary);
  padding: 0;
}

.theme-toggle:hover {
  transform: scale(1.1);
  background: var(--secondary);
  box-shadow: 0 4px 12px var(--shadow-hover);
}

.theme-toggle:active {
  transform: scale(0.95);
}

.theme-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.theme-icon :deep(svg) {
  color: var(--text-secondary) !important;
  transition: all 0.3s ease;
}

.theme-icon-enter-active,
.theme-icon-leave-active {
  transition: all 0.3s ease;
}

.theme-icon-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.5);
}

.theme-icon-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.5);
}

.theme-icon-enter-to,
.theme-icon-leave-from {
  opacity: 1;
  transform: rotate(0deg) scale(1);
}
</style>