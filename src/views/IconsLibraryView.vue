<template>
  <div class="icons-catalog-container">
    <header class="catalog-header">
      <div class="header-top">
        <h1>
          <OhVueIcon name="oi-star" class="header-icon" /> 
          Biblioteca de Ícones
        </h1>
        <Button variant="secondary" size="small" @click="logout">
          🚪 Sair
        </Button>
      </div>
      <p>Ícones disponíveis via <a href="https://oh-vue-icons.js.org/" target="_blank" alt="Oh Vue Icons Link">Oh, Vue Icons</a></p>
      <p class="icons-count">Total: {{ iconsList.length }} ícones registrados</p>
    </header>

    <section class="filters-section">
      <div class="search-controls">
        <Input
          v-model="searchQuery"
          placeholder="Buscar ícone por nome..."
          class="search-input"
        />
        <Button 
          variant="secondary" 
          size="small"
          @click="clearFilters"
        >
          <OhVueIcon name="oi-x-circle" /> Limpar
        </Button>
      </div>
    </section>

    <section class="icons-grid-section">
      <div v-if="filteredIcons.length === 0" class="no-results">
        <OhVueIcon name="oi-comment" size="2x" />
        <h3>Nenhum ícone encontrado</h3>
        <p>Tente buscar por outro termo</p>
      </div>

      <div v-else class="icons-grid">
        <div 
          v-for="icon in filteredIcons" 
          :key="icon"
          class="icon-card"
          @click="copyIconCode(icon)"
        >
          <div class="icon-preview">
            <OhVueIcon :name="icon" size="2x" />
          </div>
          <div class="icon-info">
            <h4 class="icon-name">{{ icon }}</h4>
            <code class="icon-usage">&lt;OhVueIcon name="{{ icon }}" /&gt;</code>
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
      position="bottom-right"
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

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import { OhVueIcon } from '@/plugins/icons'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import Toast from '@/components/ui/Toast.vue'

const router = useRouter()
const adminStore = useAdminStore()

const logout = (): void => {
  adminStore.logout()
  router.push('/admin')
}

const iconsList = ref<string[]>([
  'hi-home',
  'fa-regular-paper-plane',
  'hi-information-circle',
  'fa-arrow-right',
  'md-settingssuggest-outlined',
  'gi-cat',
  'fa-linkedin',
  'fa-github',
  'fa-blogger',
  'wi-time-2',
  'hi-light-bulb',
  'oi-person',
  'oi-chevron-down',
  'hi-sun',
  'ri-moon-clear-line',
  'md-catchingpokemon-twotone',
  'fa-cannabis',
  'gi-coffee-cup',
  'oi-star',
  'oi-x-circle',
  'oi-comment',
  'co-freecodecamp',
  'co-mozilla-firefox',
  'vi-file-type-vue',
  'bi-chat-heart',
  'ri-mental-health-line',
  'gi-health-potion',
  'gi-brazil',
  'gi-capybara',
  'gi-erlenmeyer',
  'oi-check',
  'oi-pencil',
  'hi-solid-selector',
  'hi-solid-chevron-double-left',
  'hi-solid-chevron-double-right',
  'hi-arrow-circle-up',
  'bi-play-circle',
  'fa-regular-comment-dots',
  'hi-solid-code',
  'md-librarybooks-outlined',
  'bi-play-fill',
  'bi-pause-fill',
  'fa-regular-heart',
  'fa-chevron-circle-left',
  'fa-chevron-circle-right',
  'hi-clock',
  'bi-calendar-heart',
  'la-bug-solid',
  'md-warning-round',
  'bi-window',
  'md-toggleoff-outlined',
  'bi-chat-square-text',
  'md-radiobuttonchecked',
  'bi-card-checklist',
  'fa-question-circle',
  'ri-delete-back-2-line',
  'fa-redo-alt',
  'la-puzzle-piece-solid',
  'gi-world',
  'md-playlistadd-round',
  'md-addbox-outlined',
  'md-radiobuttonunchecked',
  'md-checkcircleoutline',
  'ri-share-forward-line',
  'fa-plus',
  'fa-minus',
  'io-construct',
  'md-rocketlaunch-round',
  'gi-pineapple',
  'si-typescript',
  'fa-paint-brush',
  'vi-file-type-vite',
  'ri-stethoscope-line',
  'co-gamepad',
  'la-cheese-solid',
  'ai-scihub',
  'la-pills-solid',
  'bi-clipboard-data-fill',
  'bi-eyedropper',
  'hi-solid-chevron-double-up',
  'hi-solid-chevron-double-down',
  'md-noteadd-outlined',
  'io-calendar-outline',
  'fa-regular-edit',
  'hi-document-download',
  'hi-trash',
  'bi-search-heart',
  'md-donotdisturb'
])

const searchQuery = ref<string>('')
const showCopyToast = ref<boolean>(false)
const toastMessage = ref<string>('')
const toastType = ref<'success' | 'error' | 'info' | 'warning'>('success')
const toastIcon = ref<string>('oi-check')

const filteredIcons = computed<string[]>(() => {
  if (!searchQuery.value) {
    return iconsList.value
  }
  
  const query = searchQuery.value.toLowerCase()
  return iconsList.value.filter(icon => 
    icon.toLowerCase().includes(query)
  )
})

const clearFilters = (): void => {
  searchQuery.value = ''
}

const copyIconCode = async (iconName: string): Promise<void> => {
  const code = `<OhVueIcon name="${iconName}" />`
  
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(code)
      showToast('success', 'Código copiado!', 'oi-check')
      return
    }
    
    const textArea = document.createElement('textarea')
    textArea.value = code
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)
    
    if (successful) {
      showToast('success', 'Código copiado!', 'oi-check')
    } else {
      throw new Error('Falha ao copiar')
    }
    
  } catch (err) {
    console.error('Erro ao copiar:', err)
    showToast('error', 'Erro ao copiar código', 'oi-x-circle')
  }
}

const showToast = (type: 'success' | 'error' | 'info' | 'warning', message: string, icon: string): void => {
  toastType.value = type
  toastMessage.value = message
  toastIcon.value = icon
  showCopyToast.value = true
}

const refresh = (): void => {
  // Função de refresh - pode ser usada para recarregar dados se necessário
  // Por enquanto, apenas garante que a lista de ícones está carregada
  console.log('Ícones carregados:', iconsList.value.length)
}

onMounted((): void => {
  adminStore.checkAuth()
  if (!adminStore.isAuthenticated) {
    router.push('/admin')
    return
  }
  refresh()
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

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.header-top h1 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.catalog-header p {
  font-size: 1.2rem;
  color: var(--text-secondary);
}

.icons-count {
  font-size: 1rem !important;
  margin-top: 0.5rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.header-icon {
  transform: scale(2);
  margin: 0.5rem;
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
}

.search-input {
  flex: 1;
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

@media (max-width: 768px) {
  .icons-catalog-container {
    padding: 1rem;
  }
  
  .catalog-header h1 {
    font-size: 2rem;
  }
  
  .header-top {
    flex-direction: column;
    gap: 1rem;
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