<template>
  <button
    @click="toggleLanguage"
    :aria-label="isPortuguese ? 'Switch to English' : 'Mudar para Português'"
    :title="isPortuguese ? 'Switch to English' : 'Mudar para Português'"
    class="language-toggle"
  >
    <transition name="language-text" mode="out-in">
      <span v-if="isPortuguese" key="pt" class="language-text">PT</span>
      <span v-else key="en" class="language-text">EN</span>
    </transition>
  </button>
</template>

<script setup>
import { useLanguageStore } from '@/stores/language'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const languageStore = useLanguageStore()
const { locale } = useI18n()

const currentLanguage = computed(() => languageStore.currentLanguage)
const isPortuguese = computed(() => languageStore.currentLanguage === 'pt-BR')

const toggleLanguage = () => {
  const newLocale = isPortuguese.value ? 'en-US' : 'pt-BR'
  locale.value = newLocale
  languageStore.setLanguage(newLocale)
}

onMounted(() => {
  languageStore.initializeLanguage()
  locale.value = languageStore.currentLanguage
})
</script>

<style scoped>
.language-toggle {
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
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.3s ease;
  color: var(--text-secondary);
  padding: 0;
  font-family: inherit;
}

.language-toggle:hover {
  transform: scale(1.1);
  background: var(--secondary);
  box-shadow: 0 4px 12px var(--shadow-hover);
}

.language-toggle:active {
  transform: scale(0.95);
}

.language-text {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.language-text-enter-active,
.language-text-leave-active {
  transition: all 0.3s ease;
}

.language-text-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.5);
}

.language-text-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.5);
}

.language-text-enter-to,
.language-text-leave-from {
  opacity: 1;
  transform: rotate(0deg) scale(1);
}
</style>