<template>
  <nav class="navbar">
    <div class="nav-container">
      <router-link to="/" class="nav-brand">
        <MochiLogo 
          size="medium" 
          clickable="true"
          class="logo"
        />
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
import MochiLogo from '../misc/Logo.vue'
import { OhVueIcon } from 'oh-vue-icons'
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { navigationConfig } from '@/config/navigation.js'

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
  background: var(--gradient-surface);
  padding: 0.75rem 0;
  box-shadow: 0 4px 15px var(--shadow);
  position: sticky;
  top: 0;
  max-height: 90px;
  z-index: 100;
  border-bottom: 1px solid var(--border);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--title-primary);
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
  font-family: 'Sour Gummy', sans-serif;
  transition: all 0.3s ease;
  padding: 0.5rem 0;
}

.nav-brand:hover {
  color: var(--secondary);
  transform: translateY(-1px);
}

.desktop-nav {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-dropdown {
  position: relative;
}

.nav-controls {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-left: 1.5rem;
  padding-left: 1.5rem;
  border-left: 1px solid var(--border);
}

.nav-control {
  transition: transform 0.3s ease;
}

.nav-control:hover {
  transform: scale(1.1);
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
  justify-content: space-between;
  width: 40px;
  height: 40px;
  background: var(--inner-surface);
  border: 1px solid var(--border);
  border-radius: 5px;
  cursor: pointer;
  padding: 5px;
  position: relative;
  transition: all 0.4s linear;
}

.hamburger-btn:hover {
  border-color: var(--secondary);
  background-color: var(--turquoise-20);
}

.hamburger-btn span {
  display: block;
  height: 4px;
  width: 100%;
  background: var(--turquoise-50);
  transition: all 0.4s linear;
  border-radius: 3px;
  transform-origin: center;
}

.hamburger-btn:hover span {
  background: var(--rose-60);
  transition: all 0.4s linear;
}

.hamburger-btn[aria-expanded="true"] {
  border-radius: 50%;
  width: 35px;
  height: 35px;
  border: var(--primary) 2px solid;
  background-color: var(--inner-surface);
}

.hamburger-btn[aria-expanded="true"] span:nth-child(1) {
  transform: rotate(45deg) translate(7px, 7px);
  background: var(--secondary);
}

.hamburger-btn[aria-expanded="true"] span:nth-child(2) {
  opacity: 0;
  transform: scale(0);
}

.hamburger-btn[aria-expanded="true"] span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -5px);
  background: var(--secondary);
}

.hamburger-btn[aria-expanded="true"]:hover {
  border-color: var(--accent);
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
  border: 1px solid transparent;
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
  color: var(--accent);
  transition: transform 0.3s ease;
}

.mobile-menu-item:hover .mobile-menu-icon {
  transform: scale(1.2);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1rem;
  text-decoration: none;
  color: var(--text-primary);
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
  margin: 0.25rem 0;
  border: 1px solid transparent;
}

.dropdown-item:hover,
.dropdown-item.router-link-active {
  background: var(--gradient-primary);
  color: var(--text-secondary);
  transform: translateX(4px);
  border-color: var(--secondary);
  box-shadow: 0 2px 8px var(--shadow);
}

.dropdown-icon {
  font-size: 1.1rem;
  width: 20px;
  color: var(--accent);
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
    padding: 0 1.5rem;
  }
  
  .nav-brand {
    font-size: 1.25rem;
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
    font-size: 1.1rem;
  }
  
  .brand-text {
    font-size: 1rem;
  }
  
  .mobile-menu-content {
    padding: 0.75rem;
  }
  
  .mobile-controls {
    gap: 0.5rem;
  }
  
  .mobile-menu-item,
  .dropdown-item {
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    font-size: 0.9rem;
  }
  
  .spin-logo {
    width: 32px ;
    height: 32px ;
  }
  
  .nav-container {
    padding: 0 1rem;
  }
}

@media (max-width: 1024px) and (min-width: 801px) {
  .nav-container {
    padding: 0 1.5rem;
  }
  
  .desktop-nav {
    gap: 1rem;
  }
  
  .nav-brand {
    font-size: 1.3rem;
  }
}

</style>