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

// Tipos
export interface Tab {
  label: string
  icon?: string
  badge?: string | number
  badgeVariant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'tag' | 'info' | 'purple' | 'teal' | 'coral' | 'lavender' | 'mint' | 'peach' | 'plum'
  content?: string
}

// Props com tipagem
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
    type: String as () => 'default' | 'pills' | 'underline',
    default: 'default',
    validator: (value: string): boolean => ['default', 'pills', 'underline'].includes(value)
  }
})

// Emits com tipagem
const emit = defineEmits<{
  (e: 'update:modelValue', index: number): void
  (e: 'change', index: number): void
}>()

// Refs com tipagem
const showScrollControls = ref<boolean>(false)
const isAtStart = ref<boolean>(true)
const isAtEnd = ref<boolean>(false)
const tabsHeaderRef = ref<HTMLElement | null>(null)
const tabButtonsRef = ref<HTMLElement[]>([])

// Computed com tipagem CSSProperties
const indicatorStyle = computed<CSSProperties>(() => {
  const activeTab = tabButtonsRef.value[props.modelValue]
  if (!activeTab) return { width: '0px', transform: 'translateX(0px)' }
  
  return {
    width: `${activeTab.offsetWidth}px`,
    transform: `translateX(${activeTab.offsetLeft}px)`
  }
})

// Métodos com tipagem
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

// Lifecycle hooks
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
  gap: 0.25em;
  border-bottom: 2px dashed var(--border-contrast);
  min-width: min-content;
  border-radius: 16px 16px 0 0;
  padding: 0.5rem 0.5rem 0 0.5rem;
  backdrop-filter: blur(10px);
}

.scroll-button {
  background: var(--strong-rose);
  border: 2px solid var(--border);
  border-radius: 12px;
  padding: 0.75em;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  backdrop-filter: blur(10px);
}

.scroll-button:hover:not(:disabled) {
  background: var(--dull-blue);
  color: var(--text-primary);
}

.scroll-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.scroll-button-prev {
  margin-right: 0.75em;
}

.scroll-button-next {
  margin-left: 0.75em;
}

.tab-button {
  background: var(--sky-blue-surface);
  border: 2px dashed var(--border-contrast);
  border-bottom: none;
  padding: 0.5em 1.5em;
  cursor: pointer;
  font-family: 'Comic Neue', cursive;
  font-style: bold;
  font-size: 1.2em;
  color: var(--text-secondary);
  transition: all 0.4s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75em;
  white-space: nowrap;
  flex-shrink: 0;
  border-radius: 12px 12px 0 0;
  margin-bottom:0 ;
  overflow: hidden;
}

.tab-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  transition: left 0.4s ease;
  z-index: -1;
  opacity: 0.5;
}

.tab-button:hover::before {
  left: 0;
}

.tab-button:hover {
  color: var(--text-primary);
  background: var(--sky-blue);
}

.tab-active {
  color: var(--text-primary);
  font-weight: 700;
  background: var(--rose-surface);
}

.tab-active::before {
  left: 0;
  opacity: 0.15;
}

.tab-icon {
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
  font-size: 1.2em;
}

.tab-active .tab-icon {
  transform: scale(1.1);
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
  left: 0px;
  height: 4px;
  background: var(--gradient-secondary);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
}

.tabs-content {
  min-height: 200px;
  border-radius: 0 0 16px 16px;
  padding: 2em;
  backdrop-filter: blur(10px);
  border: 1px solid var(--border);
}

.tab-panel {
  animation: tab-fade 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes tab-fade {
  0% {
    opacity: 0;
    transform: translateY(20px);
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
  background: var(--gradient-primary);
  color: white;
  box-shadow: 0 4px 16px var(--shadow-hover);
}

.tabs-header.pills-variant .tab-indicator {
  display: none;
}

@media (max-width: 768px) {
  .scroll-button {
    padding: 0.5em;
    min-width: 36px;
    min-height: 36px;
  }
  
  .scroll-button-prev {
    margin-right: 0.5em;
  }
  
  .scroll-button-next {
    margin-left: 0.5em;
  }
  
  .tab-button {
    padding: 0.875em 1.25em;
    font-size: 0.9em;
    gap: 0.5em;
  }
  
  .tabs-content {
    padding: 1.5em;
  }
}

@media (max-width: 480px) {
  .tab-button {
    padding: 0.75em 1em;
  }
  
  .tabs-content {
    padding: 1em;
  }
}
</style>