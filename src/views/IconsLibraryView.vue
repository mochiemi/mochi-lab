<template>
  <div class="icons-catalog-container">
    <header class="catalog-header">
      <h1><OhVueIcon name="oi-star" class="header-icon"/> {{ $t('iconsLibrary.title') }}</h1>
      <p>{{ $t('iconsLibrary.description') }} <a href="https://oh-vue-icons.js.org/" target="_blank" alt="Oh Vue Icons Link">Oh, Vue Icons</a></p>
    </header>

    <section class="filters-section">
      <div class="search-controls">
        <Input
          v-model="searchQuery"
          :placeholder="$t('iconsLibrary.searchPlaceholder')"
          class="search-input"
        />
        <Button 
          variant="secondary" 
          size="small"
          @click="clearFilters"
        >
          <OhVueIcon name="oi-x-circle" /> {{ $t('iconsLibrary.clear') }}
        </Button>
      </div>

    </section>

    <section class="icons-grid-section">
      <div v-if="filteredIcons.length === 0" class="no-results">
        <OhVueIcon name="oi-comment" size="2x" />
        <h3>{{ $t('iconsLibrary.noResults.title') }}</h3>
        <p>{{ $t('iconsLibrary.noResults.description') }}</p>
      </div>

      <div v-else class="icons-grid">
        <div 
          v-for="icon in filteredIcons" 
          :key="icon.name"
          class="icon-card"
          @click="copyIconName(icon.name)"
        >
          <div class="icon-preview">
            <OhVueIcon :name="icon.name" size="2x" />
          </div>
          <div class="icon-info">
            <h4 class="icon-name">{{ icon.name }}</h4>
            <code class="icon-usage">&lt;OhVueIcon name="{{ icon.name }}" /&gt;</code>
          </div>
          <div class="copy-indicator">
            <OhVueIcon name="oi-pencil" class="copy-icon" />
          </div>
        </div>
      </div>
    </section>

    <Toast
      v-if="showCopyToast"
      :type="toastType"
      :position="toastPosition"
      :auto-close="3000"
      @dismiss="showCopyToast = false"
    >
      <div class="toast-content">
        <OhVueIcon :name="toastIcon" class="toast-icon" />
        <span>{{ toastMessage }}</span>
      </div>
    </Toast>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { OhVueIcon } from 'oh-vue-icons'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Toast from '@/components/ui/Toast.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const searchQuery = ref('')
const selectedCategory = ref(null)
const showCopyToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')
const toastIcon = ref('oi-check')
const toastPosition = ref('bottom-right')

const iconsList = ref([])

const initializeIconsList = () => {
  iconsList.value = [
    { name: 'hi-home', category: 'Navigation', package: 'Heroicons' },
    { name: 'fa-regular-paper-plane', category: 'Communication', package: 'Font Awesome' },
    { name: 'hi-information-circle', category: 'UI_Actions', package: 'Heroicons' },
    { name: 'fa-arrow-right', category: 'Directional', package: 'Font Awesome' },
    { name: 'md-settingssuggest-outlined', category: 'Settings', package: 'Material Design' },
    { name: 'gi-cat', category: 'Animals', package: 'Game Icons' },
    { name: 'fa-linkedin', category: 'Social', package: 'Font Awesome' },
    { name: 'fa-github', category: 'Social', package: 'Font Awesome' },
    { name: 'fa-blogger', category: 'Social', package: 'Font Awesome' },
    { name: 'wi-time-2', category: 'Weather', package: 'Weather Icons' },
    { name: 'hi-light-bulb', category: 'Ideas', package: 'Heroicons' },
    { name: 'oi-person', category: 'People', package: 'Octicons' },
    { name: 'oi-chevron-down', category: 'Directional', package: 'Octicons' },
    { name: 'hi-sun', category: 'Weather', package: 'Heroicons' },
    { name: 'ri-moon-clear-line', category: 'Weather', package: 'Remix Icon' },
    { name: 'md-catchingpokemon-twotone', category: 'Fun', package: 'Material Design' },
    { name: 'fa-cannabis', category: 'Fun', package: 'Font Awesome' },
    { name: 'gi-coffee-cup', category: 'Food_Drink', package: 'Game Icons' },
    { name: 'oi-star', category: 'UI_Actions', package: 'Octicons' },
    { name: 'oi-x-circle', category: 'UI_Actions', package: 'Octicons' },
    { name: 'oi-comment', category: 'Communication', package: 'Octicons' },
    { name: 'co-freecodecamp', category: 'Technology', package: 'Simple Icons' },
    { name: 'co-mozilla-firefox', category: 'Technology', package: 'Simple Icons' },
    { name: 'vi-file-type-vue', category: 'Technology', package: 'VS Code Icons' },
    { name: 'bi-chat-heart', category: 'Communication', package: 'Bootstrap Icons' },
    { name: 'ri-mental-health-line', category: 'Health', package: 'Remix Icon' },
    { name: 'gi-health-potion', category: 'Health', package: 'Game Icons' },
    { name: 'gi-brazil', category: 'Location', package: 'Game Icons' },
    { name: 'gi-capybara', category: 'Animals', package: 'Game Icons' },
    { name: 'gi-erlenmeyer', category: 'Science', package: 'Game Icons' },
    { name: 'oi-check', category: 'UI_Actions', package: 'Octicons' },
    { name: 'oi-pencil', category: 'UI_Actions', package: 'Octicons' },
    { name: 'hi-solid-selector', category: 'UI_Actions', package: 'Heroicons' },
    { name: 'hi-solid-chevron-double-left', category: 'Directional', package: 'Heroicons' },
    { name: 'hi-solid-chevron-double-right', category: 'Directional', package: 'Heroicons' },
    { name: 'hi-arrow-circle-up', category: 'Directional', package: 'Heroicons' },
    { name: 'bi-play-circle', category: 'Media', package: 'Bootstrap Icons' },
    { name: 'fa-regular-comment-dots', category: 'Communication', package: 'Font Awesome' },
    { name: 'hi-solid-code', category: 'Technology', package: 'Heroicons' },
    { name: 'md-librarybooks-outlined', category: 'Education', package: 'Material Design' },
    { name: 'bi-play-fill', category: 'Media', package: 'Bootstrap Icons' },
    { name: 'bi-pause-fill', category: 'Media', package: 'Bootstrap Icons' },
    { name: 'fa-regular-heart', category: 'UI_Actions', package: 'Font Awesome' },
    { name: 'co-share-all', category: 'Actions', package: 'Simple Icons' },
    { name: 'fa-chevron-circle-left', category: 'Directional', package: 'Font Awesome' },
    { name: 'fa-chevron-circle-right', category: 'Directional', package: 'Font Awesome' },
    { name: 'hi-clock', category: 'Weather', package: 'Heroicons' },
    { name: 'bi-calendar-heart', category: 'Calendar', package: 'Bootstrap Icons' },
    { name: 'la-bug-solid', category: 'Development', package: 'Line Awesome' },
    { name: 'md-warning-round', category: 'UI_Actions', package: 'Material Design' },
    { name: 'bi-window', category: 'UI_Actions', package: 'Bootstrap Icons' },
    { name: 'md-toggleoff-outlined', category: 'UI_Actions', package: 'Material Design' },
    { name: 'bi-chat-square-text', category: 'Communication', package: 'Bootstrap Icons' },
    { name: 'md-radiobuttonchecked', category: 'Forms', package: 'Material Design' },
    { name: 'bi-card-checklist', category: 'UI_Actions', package: 'Bootstrap Icons' },
    { name: 'fa-question-circle', category: 'UI_Actions', package: 'Font Awesome' },
    { name: 'ri-delete-back-2-line', category: 'Actions', package: 'Remix Icon' },
    { name: 'fa-redo-alt', category: 'Actions', package: 'Font Awesome' },
    { name: 'la-puzzle-piece-solid', category: 'UI_Actions', package: 'Line Awesome' },
    { name: 'gi-world', category: 'Location', package: 'Game Icons' },
    { name: 'md-playlistadd-round', category: 'Media', package: 'Material Design' },
    { name: 'md-addbox-outlined', category: 'UI_Actions', package: 'Material Design' },
    { name: 'md-radiobuttonunchecked', category: 'Forms', package: 'Material Design' },
    { name: 'md-checkcircleoutline', category: 'UI_Actions', package: 'Material Design' },
    { name: 'ri-share-forward-line', category: 'Actions', package: 'Remix Icon' },
    { name: 'fa-plus', category: 'UI_Actions', package: 'Font Awesome' },
    { name: 'fa-minus', category: 'UI_Actions', package: 'Font Awesome' },
    { name: 'io-construct', category: 'Tools', package: 'Ionicons' },
    { name: 'md-rocketlaunch-round', category: 'Technology', package: 'Material Design' },
    { name: 'gi-pineapple', category: 'Food_Drink', package: 'Game Icons' },
    { name: 'si-typescript', category: 'Technology', package: 'Simple Icons' },
    { name: 'fa-paint-brush', category: 'Design', package: 'Font Awesome' },
    { name: 'vi-file-type-vite', category: 'Technology', package: 'VS Code Icons' },
    { name: 'ri-stethoscope-line', category: 'Health', package: 'Remix Icon' },
    { name: 'co-gamepad', category: 'Gaming', package: 'Simple Icons' }
  ]
}

const filteredIcons = computed(() => {
  let filtered = iconsList.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(icon => 
      icon.name.toLowerCase().includes(query) ||
      t(`iconsLibrary.categories.${icon.category}`).toLowerCase().includes(query) ||
      icon.package.toLowerCase().includes(query)
    )
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(icon => icon.category === selectedCategory.value)
  }

  return filtered
})


const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = null
}

const copyIconName = async (iconName) => {
  try {

    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(iconName)
      showToast('success', t('iconsLibrary.copySuccess'), 'oi-check')
      return
    }
    
    const textArea = document.createElement('textarea')
    textArea.value = iconName
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)
    
    if (successful) {
      showToast('success', t('iconsLibrary.copySuccess'), 'oi-check')
    } else {
      throw new Error('execCommand failed')
    }
    
  } catch (err) {
    console.error('Copy failed:', err)
    showToast('error', t('iconsLibrary.copyError'), 'oi-x-circle')
  }
}

const showToast = (type, message, icon) => {
  toastType.value = type
  toastMessage.value = message
  toastIcon.value = icon
  showCopyToast.value = true
}

onMounted(() => {
  initializeIconsList()
})
</script>

<style scoped>
.icons-catalog-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.catalog-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid var(--border);
}

.catalog-header p {
  font-size: 1.2rem;
  color: var(--text-secondary);
}

.header-icon {
  transform: scale(2);
  margin:0.5rem;
}

.filters-section {
  background: var(--surface);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--border);
  margin-bottom: 2rem;
}

.search-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
}

.search-input {
  flex: 1;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-badge {
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-badge:hover {
  transform: translateY(-1px);
}

.icons-grid-section {
  margin-bottom: 2rem;
}

.no-results {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
}

.no-results h3 {
  margin: 1rem 0 0.5rem;
  color: var(--text-primary);
}

.icons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.icon-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
}

.icon-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px var(--shadow-hover);
  border-color: var(--primary);
}

.icon-card:hover .copy-indicator {
  opacity: 1;
  transform: scale(1.1);
}

.icon-preview {
  margin-bottom: 1rem;
  padding: 1rem;
  background: var(--inner-surface);
  border-radius: 8px;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-info {
  flex: 1;
  width: 100%;
}

.icon-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
  word-break: break-word;
}

.icon-category {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
}

.icon-usage {
  background: var(--gray-90);
  color: var(--gray-10);
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-family: 'Courier New', monospace;
  display: block;
  word-break: break-all;
}

.copy-indicator {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  opacity: 0;
  transition: all 0.2s ease;
  color: var(--primary);
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toast-icon {
  font-size: 1.2rem;
}

/* Responsividade */
@media (max-width: 768px) {
  .icons-catalog-container {
    padding: 1rem;
  }
  
  .catalog-header h1 {
    font-size: 2rem;
  }
  
  .search-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .icons-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 480px) {
  .catalog-header h1 {
    font-size: 1.75rem;
  }
  
  .icons-grid {
    grid-template-columns: 1fr;
  }
}
</style>