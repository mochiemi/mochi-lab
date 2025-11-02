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
import { onMounted } from 'vue'

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initializeTheme()
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;
  color: var(--text-primary);
  background-color: var(--bg-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

#app {
  min-height: 100vh;
  transition: all 0.3s ease;
}

.main-content {
  min-height: calc(100vh - 80px);
  background: var(--gradient-bg);
  background-attachment: fixed;
  transition: all 0.3s ease;
}

* {
  transition: background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease;
}
</style>