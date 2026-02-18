<template>
  <nav class="navbar">
    <div class="nav-container">
      <router-link to="/" class="nav-brand">
        <span class="brand-text">Mochi Lab</span>
      </router-link>
      
      <div class="nav-links desktop-nav">
        <Dropdown 
          v-for="section in navigationConfig" 
          :key="section.id"
          :label="$t(section.labelKey)" 
          :dropdown-id="section.id"
          class="nav-dropdown"
        >
          <router-link 
            v-for="item in section.items" 
            :key="item.path"
            :to="item.path" 
            class="dropdown-item" 
            @click="closeMobileMenu"
          >
            <OhVueIcon :name="item.icon" class="dropdown-icon" />
            {{ $t(item.labelKey) }}
          </router-link>
        </Dropdown>

        <div class="nav-controls">
          <LanguageToggle class="nav-control" />
          <ThemeToggle class="nav-control" />
        </div>
      </div>

      <div class="mobile-nav">
        <div class="mobile-controls">
          <LanguageToggle class="nav-control" />
          <ThemeToggle class="nav-control" />
        </div>
        <button 
          class="hamburger-btn"
          @click="toggleMobileMenu"
          :aria-expanded="isMobileMenuOpen"
          :aria-label="$t('nav.toggleMenu')"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>

    <transition name="mobile-menu">
      <div v-if="isMobileMenuOpen" class="mobile-menu">
        <div class="mobile-menu-content">
          <Accordion
            :items="accordionItems"
            :multiple="true"
            class="mobile-accordion"
          >
            <template #content="{ item }">
              <div class="mobile-accordion-content">
                <router-link 
                  v-for="menuItem in item.children" 
                  :key="menuItem.path"
                  :to="menuItem.path" 
                  class="mobile-menu-item" 
                  @click="closeMobileMenu"
                >
                  <OhVueIcon :name="menuItem.icon" class="mobile-menu-icon" />
                  {{ $t(menuItem.labelKey) }}
                </router-link>
              </div>
            </template>
          </Accordion>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import Dropdown from '@/components/ui/Dropdown.vue'
import Accordion from '@/components/ui/Accordion.vue'
import ThemeToggle from './ThemeToggle.vue'
import LanguageToggle from './LanguageToggle.vue'
import { OhVueIcon } from 'oh-vue-icons'
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { navigationConfig } from '@/config/navigation.js'
import '@/assets/styles/variables.css'
import '@/assets/styles/fonts.css'


const { t } = useI18n()
const isMobileMenuOpen = ref(false)

const accordionItems = computed(() => {
  return navigationConfig.map(section => ({
    id: section.id,
    title: t(section.labelKey),
    children: section.items
  }))
})

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const handleResize = () => {
  if (window.innerWidth > 800) {
    closeMobileMenu()
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.navbar {
  font-size: 1.3em;
  background: var(--bg-navbar);
  padding: 0.1em 0;
  box-shadow: 0 4px 15px var(--shadow);
  position: sticky;
  top: 0;
  max-height: 90px;
  z-index: 100;
  border-bottom: 2px dashed var(--border-navbar);
}

.nav-container {
  font-family: "Shantell Sans", cursive;
  font-weight: 700;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0em;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.5em;
  color: var(--title-secondary);
  font-size: 1.8em;
  text-decoration: none;
  font-family: "Finger Paint", sans-serif; 
  letter-spacing: -2px;
  transition: all 0.3s ease;
  padding: 0.25em 0;
  text-shadow:  
    0 0 5px #fff,
    0 0 10px #fff,
    0 0 20px #fffdf6,
    0 0 40px #fff9df;
  z-index: 1000;
}

.nav-brand:hover {
  color: var(--secondary);
  transform: translateY(-1px);
}

.desktop-nav {
  display: flex;
  gap: 1rem;
  align-items: center;
  background-color: var(--bg-navbar);
}

.nav-dropdown {
  position: relative;
  background-color: transparent;
}

.nav-controls {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-left: 1.5rem;
  padding-left: 1.5rem;
  border-left: 1px solid var(--strong-border);
  background-color: var(--bg-navbar);

}

.nav-control {
  transition: transform 0.3s ease;
}

.nav-control:hover {
  transform: scale(1.1);
  background-color: var(--inner-surface);
}

.mobile-nav {
  display: none;
  align-items: center;
  gap: 1rem;
}

.mobile-controls {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.hamburger-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 40px;
  height: 40px;
  background: var(--rose-surface);
  border: 2px solid var(--border-primary);
  border-radius: 25%;
  cursor: pointer;
  padding: 5px;
  position: relative;
  transition: all 0.4s linear;
}

.hamburger-btn:hover {  
  border-color: var(--border-seecondary);
  background-color: var(--sky-blue-surface);
}

.hamburger-btn span {
  display: block;
  height: 4px;
  width: 80%;
  background: var(--rose);
  transition: all 0.4s linear;
  border-radius: 50%;
  transform-origin: center;
}

.hamburger-btn:hover span {
  background: var(--sky-blue);
  transition: all 0.4s linear;
}

.hamburger-btn[aria-expanded="true"] {
  border-radius: 50%;
  width: 35px;
  height: 35px;
  background-color: transparent;
}

.hamburger-btn[aria-expanded="true"] span:nth-child(1) {
  transform: rotate(45deg) translate(7px, 7px);
  background: var(--text-contrast);
}

.hamburger-btn[aria-expanded="true"] span:nth-child(2) {
  opacity: 0;
  transform: scale(0);
}

.hamburger-btn[aria-expanded="true"] span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -5px);
  background: var(--text-contrast);
}

.hamburger-btn[aria-expanded="true"]:hover {
  border-color: var(--border-primary);
  background-color: var(--bg-secondary);
}

.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: var(--surface);
  background: linear-gradient(135deg, var(--surface) 0%, var(--inner-surface) 100%);
  box-shadow: 0 8px 30px var(--shadow-hover);
  border-top: 1px solid var(--border);
  max-height: 80vh;
  overflow-y: auto;
  backdrop-filter: blur(20px);
}

.mobile-menu-content {
  padding: 1rem;
}

.mobile-accordion {
  width: 100%;
}

.mobile-accordion-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem 0;
}

.mobile-menu-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  text-decoration: none;
  color: var(--text-primary);
  border-radius: 12px;
  transition: all 0.3s ease;
  font-weight: 500;
  margin-bottom: 0.25rem;
  border-bottom: 2px dashed (--text-contrast);
  background: var(--inner-surface);
}

.mobile-menu-item:hover,
.mobile-menu-item.router-link-active {
  background: var(--gradient-primary);
  color: var(--text-secondary);
  transform: translateX(8px);
  border-color: var(--secondary);
  box-shadow: 0 4px 12px var(--shadow);
}

.mobile-menu-icon {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
  color: var(--strong-rose);
  transition: transform 0.3s ease;
}

.mobile-menu-item:hover .mobile-menu-icon {
  transform: scale(1.2);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.7em 1em;
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.3s ease;
  font-weight: 500;
  margin: 0.25em 0;
  border-bottom: 2px dashed var(--text-contrast);
}

.dropdown-item:hover,
.dropdown-item.router-link-active {
  background: var(--navbar-surface);
  color: var(--text-secondary);
  transform: translateX(4px);
  border-color: var(--secondary);
  box-shadow: 0 2px 8px var(--shadow);
}

.dropdown-icon {
  font-size: 1.1rem;
  width: 20px;
  color: var(--rose);
  text-align: center;
  transition: transform 0.3s ease;
}

.dropdown-item:hover .dropdown-icon {
  transform: scale(1.1);
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 800px) {
  .desktop-nav {
    display: none;
  }
  
  .mobile-nav {
    display: flex;
  }
  
  .nav-container {
    padding: 0 1.5em;
  }
  
  .nav-brand {
    font-size: 1.25em;
    gap: 0.5rem;
  }
  
  .spin-logo {
    width: 40px ;
    height: 40px ;
  }
}

@media (min-width: 801px) {
  .mobile-menu {
    display: none;
  }
}

@media (max-width: 480px) {
  .nav-brand {
    font-size: 1.1em;
  }
  
  .brand-text {
    font-size: 1em;
  }
  
  .mobile-menu-content {
    padding: 0.75em;
  }
  
  .mobile-controls {
    gap: 0.5em;
  }
  
  .mobile-menu-item,
  .dropdown-item {
    gap: 0.75em;
    padding: 0.875em 1em;
    font-size: 0.9em;
  }
  
  .spin-logo {
    width: 32px ;
    height: 32px ;
  }
  
  .nav-container {
    padding: 0 1em;
  }
}

@media (max-width: 1024px) and (min-width: 801px) {
  .nav-container {
    padding: 0 1.5em;
  }
  
  .desktop-nav {
    gap: 1rem;
  }
  
  .nav-brand {
    font-size: 1.3rem;
  }
}

</style>