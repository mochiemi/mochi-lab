<template>
  <div id="app">
    <AppNavbar />
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
    <ToTop />
  </div>
</template>

<script setup>
import AppNavbar from '@/components/layout/AppNavbar.vue'
import ToTop from '@/components/layout/ToTop.vue'
import Footer from './components/layout/Footer.vue'
import { useThemeStore } from '@/stores/theme'
import { useLanguageStore } from '@/stores/language'
import { onMounted } from 'vue'

const themeStore = useThemeStore()
const languageStore = useLanguageStore()

onMounted(() => {
  themeStore.initializeTheme()
  languageStore.initializeLanguage()
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  color: var(--text-primary);
  background: var(--bg-primary);
}

#app {
  min-height: 100vh;
  transition: all 0.3s ease;
}

.main-content {
  min-height: calc(100vh - 80px);
  transition: all 0.3s ease;
}

</style>
