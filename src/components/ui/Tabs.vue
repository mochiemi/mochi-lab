<template>
  <div class="tabs">
    <div class="tabs-header-container">
      <button 
        v-if="showScrollControls" 
        class="scroll-button scroll-button-prev"
        @click="scrollTabs(-1)"
        :disabled="isAtStart"
        aria-label="Aba anterior"
      >
        <OhVueIcon name="hi-solid-chevron-double-left" />
      </button>
      
      <div class="tabs-header-wrapper" ref="tabsHeaderRef">
        <div class="tabs-header" :class="`${variant}-variant`" role="tablist">
          <button
            v-for="(tab, index) in tabs"
            :key="index"
            :class="['tab-button', { 'tab-active': modelValue === index }]"
            @click="selectTab(index)"
            role="tab"
            :aria-selected="modelValue === index"
            :aria-controls="`tab-panel-${index}`"
            :id="`tab-${index}`"
            ref="tabButtonsRef"
          >
            <span class="tab-icon" v-if="tab.icon">
              <OhVueIcon :name="tab.icon" />
            </span>
            <span class="tab-label">{{ tab.label }}</span>
            <Badge v-if="tab.badge" :variant="tab.badgeVariant || 'primary'" class="tab-badge">
              {{ tab.badge }}
            </Badge>
          </button>
          <div class="tab-indicator" :style="indicatorStyle as any"></div>
        </div>
      </div>
      
      <button 
        v-if="showScrollControls" 
        class="scroll-button scroll-button-next"
        @click="scrollTabs(1)"
        :disabled="isAtEnd"
        aria-label="Próxima aba"
      >
        <OhVueIcon name="hi-solid-chevron-double-right" />
      </button>
    </div>
    
    <div class="tabs-content">
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        :id="`tab-panel-${index}`"
        :class="['tab-panel', { 'tab-panel-active': modelValue === index }]"
        role="tabpanel"
        :aria-labelledby="`tab-${index}`"
        v-show="modelValue === index"
      >
        <slot :name="`tab-${index}`" :tab="tab">
          {{ tab.content }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, type Ref, type CSSProperties } from 'vue'
import Badge from './Badge.vue'
import { OhVueIcon } from 'oh-vue-icons'

export interface Tab {
  label: string
  icon?: string
  badge?: string | number
  badgeVariant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'tag' | 'info' | 'purple' | 'teal' | 'coral' | 'lavender' | 'mint' | 'peach' | 'plum'
  content?: string
}

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  tabs: {
    type: Array as () => Tab[],
    required: true,
    validator: (tabs: Tab[]): boolean => tabs.every(tab => 
      typeof tab.label === 'string' && 
      (tab.content === undefined || typeof tab.content === 'string')
    )
  },
  variant: {
    type: String as () => 'default' | 'pills' | 'underline' | 'square',
    default: 'default',
    validator: (value: string): boolean => ['default', 'pills', 'underline', 'square'].includes(value)
  }
})

const emit = defineEmits<{
  (e: 'update:modelValue', index: number): void
  (e: 'change', index: number): void
}>()

const showScrollControls = ref<boolean>(false)
const isAtStart = ref<boolean>(true)
const isAtEnd = ref<boolean>(false)
const tabsHeaderRef = ref<HTMLElement | null>(null)
const tabButtonsRef = ref<HTMLElement[]>([])

const indicatorStyle = computed<CSSProperties>(() => {
  const activeTab = tabButtonsRef.value[props.modelValue]
  if (!activeTab) return { width: '0px', transform: 'translateX(0px)' }
  
  return {
    width: `${activeTab.offsetWidth}px`,
    transform: `translateX(${activeTab.offsetLeft}px)`
  }
})

const selectTab = (index: number): void => {
  emit('update:modelValue', index)
  emit('change', index)
  scrollTabIntoView(index)
}

const checkScrollNeeded = (): void => {
  if (!tabsHeaderRef.value) return
  
  const container = tabsHeaderRef.value
  const content = container.querySelector('.tabs-header') as HTMLElement | null
  
  if (content) {
    showScrollControls.value = content.scrollWidth > container.offsetWidth
    updateScrollState()
  }
}

const scrollTabs = (direction: number): void => {
  const container = tabsHeaderRef.value
  if (!container) return
  
  const scrollAmount = 200
  
  container.scrollBy({
    left: direction * scrollAmount,
    behavior: 'smooth'
  })
  
  setTimeout((): void => {
    updateScrollState()
  }, 300)
}

const scrollTabIntoView = (index: number): void => {
  if (!tabsHeaderRef.value || !tabButtonsRef.value[index]) return
  
  const container = tabsHeaderRef.value
  const tab = tabButtonsRef.value[index]
  
  const tabLeft = tab.offsetLeft
  const tabRight = tabLeft + tab.offsetWidth
  const containerLeft = container.scrollLeft
  const containerRight = containerLeft + container.offsetWidth
  
  if (tabLeft < containerLeft) {
    container.scrollTo({
      left: tabLeft - 10,
      behavior: 'smooth'
    })
  } else if (tabRight > containerRight) {
    container.scrollTo({
      left: tabLeft - container.offsetWidth + tab.offsetWidth + 10,
      behavior: 'smooth'
    })
  }
}

const updateScrollState = (): void => {
  if (!tabsHeaderRef.value) return
  
  const container = tabsHeaderRef.value
  const scrollLeft = container.scrollLeft
  const scrollWidth = container.scrollWidth
  const clientWidth = container.clientWidth
  
  isAtStart.value = scrollLeft <= 0
  isAtEnd.value = scrollLeft + clientWidth >= scrollWidth - 1
}

onMounted((): void => {
  checkScrollNeeded()
  window.addEventListener('resize', checkScrollNeeded)
})

onBeforeUnmount((): void => {
  window.removeEventListener('resize', checkScrollNeeded)
})
</script>

<style scoped>
.tabs {
  width: 100%;
}

.tabs-header-container {
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 0;
}

.tabs-header-wrapper {
  flex: 1;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none; 
}

.tabs-header-wrapper::-webkit-scrollbar {
  display: none;
}

.tabs-header {
  display: flex;
  position: relative;
  gap: 0;
  border-bottom: 2px solid var(--border-contrast);
  min-width: min-content;
  padding: 0;
  background: var(--bg-secondary);
}

.scroll-button {
  background: var(--surface-primary);
  border: 2px solid var(--border);
  border-radius: 0;
  padding: 0.75em;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
}

.scroll-button:hover:not(:disabled) {
  background: var(--primary);
  color: var(--white);
}

.scroll-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.scroll-button-prev {
  margin-right: 0;
  border-right: none;
}

.scroll-button-next {
  margin-left: 0;
  border-left: none;
}

/* Estilo SQUARE - sem bordas arredondadas */
.tabs-header.square-variant {
  border-bottom: 3px solid var(--primary);
  gap: 0;
  background: var(--surface-secondary);
}

.tabs-header.square-variant .tab-button {
  border: none;
  border-radius: 0;
  padding: 1em 2em;
  margin: 0;
  background: var(--surface-secondary);
  border-bottom: 3px solid transparent;
  position: relative;
  transition: all 0.2s ease;
}

.tabs-header.square-variant .tab-button:hover {
  background: var(--inner-surface);
  border-bottom-color: var(--secondary);
}

.tabs-header.square-variant .tab-active {
  background: var(--surface-primary);
  border-bottom-color: var(--primary);
  color: var(--primary);
}

.tabs-header.square-variant .tab-indicator {
  display: none;
}

/* Estilo padrão para outras variantes */
.tab-button {
  background: var(--surface-secondary);
  border: none;
  padding: 0.75em 1.5em;
  cursor: pointer;
  font-family: 'Comic Neue', cursive;
  font-weight: 600;
  font-size: 1em;
  color: var(--text-secondary);
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75em;
  white-space: nowrap;
  flex-shrink: 0;
}

.tab-button:hover {
  color: var(--primary);
  background: var(--inner-surface);
}

.tab-active {
  color: var(--primary);
  font-weight: 700;
}

.tab-icon {
  display: flex;
  align-items: center;
  font-size: 1.2em;
}

.tab-active .tab-icon {
  color: var(--primary);
}

.tab-label {
  position: relative;
  z-index: 1;
}

.tab-badge {
  position: relative;
  z-index: 1;
}

.tab-indicator {
  position: absolute;
  bottom: -2px;
  left: 0;
  height: 3px;
  background: var(--primary);
  transition: all 0.3s ease;
  z-index: 2;
}

.tabs-content {
  min-height: 200px;
  padding: 2em;
  background: var(--surface-primary);
  border: 2px solid var(--border);
  border-top: none;
}

.tab-panel {
  animation: tab-fade 0.3s ease;
}

@keyframes tab-fade {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.tabs-header.pills-variant {
  border: none;
  background: var(--inner-surface);
  border-radius: 50px;
  padding: 0.5em;
  gap: 0.5em;
}

.tabs-header.pills-variant .tab-button {
  border-radius: 50px;
  padding: 0.875em 1.5em;
}

.tabs-header.pills-variant .tab-active {
  background: var(--primary);
  color: white;
  box-shadow: 0 4px 16px var(--shadow-hover);
}

.tabs-header.pills-variant .tab-indicator {
  display: none;
}
.tabs-header.underline-variant .tab-button {
  background: transparent;
  border-bottom: 3px solid transparent;
}

.tabs-header.underline-variant .tab-active {
  border-bottom-color: var(--primary);
}

@media (max-width: 768px) {
  .scroll-button {
    padding: 0.5em;
    min-width: 36px;
    min-height: 36px;
  }
  
  .tab-button {
    padding: 0.75em 1.25em;
    font-size: 0.9em;
    gap: 0.5em;
  }
  
  .tabs-content {
    padding: 1.5em;
  }
}

@media (max-width: 480px) {
  .tab-button {
    padding: 0.6em 1em;
  }
  
  .tabs-content {
    padding: 1em;
  }
}
</style>