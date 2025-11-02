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
        <div class="tabs-header" role="tablist">
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
          <div class="tab-indicator" :style="indicatorStyle"></div>
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

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import Badge from './Badge.vue'
import { OhVueIcon } from 'oh-vue-icons'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  tabs: {
    type: Array,
    required: true,
    validator: (tabs) => tabs.every(tab => 
      typeof tab.label === 'string' && 
      (tab.content === undefined || typeof tab.content === 'string')
    )
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'pills', 'underline'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const showScrollControls = ref(false)
const isAtStart = ref(true)
const isAtEnd = ref(false)
const tabsHeaderRef = ref(null)
const tabButtonsRef = ref([])

const indicatorStyle = computed(() => {
  const activeTab = tabButtonsRef.value[props.modelValue]
  if (!activeTab) return {}
  
  return {
    width: `${activeTab.offsetWidth}px`,
    transform: `translateX(${activeTab.offsetLeft}px)`
  }
})

const selectTab = (index) => {
  emit('update:modelValue', index)
  emit('change', index)
  scrollTabIntoView(index)
}

const checkScrollNeeded = () => {
  if (!tabsHeaderRef.value) return
  
  const container = tabsHeaderRef.value
  const content = container.querySelector('.tabs-header')
  
  showScrollControls.value = content.scrollWidth > container.offsetWidth
  updateScrollState()
}

const scrollTabs = (direction) => {
  const container = tabsHeaderRef.value
  const scrollAmount = 200
  
  container.scrollBy({
    left: direction * scrollAmount,
    behavior: 'smooth'
  })
  
  setTimeout(() => {
    updateScrollState()
  }, 300)
}

const scrollTabIntoView = (index) => {
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

const updateScrollState = () => {
  if (!tabsHeaderRef.value) return
  
  const container = tabsHeaderRef.value
  const scrollLeft = container.scrollLeft
  const scrollWidth = container.scrollWidth
  const clientWidth = container.clientWidth
  
  isAtStart.value = scrollLeft <= 0
  isAtEnd.value = scrollLeft + clientWidth >= scrollWidth - 1
}

onMounted(() => {
  checkScrollNeeded()
  window.addEventListener('resize', checkScrollNeeded)
})

onBeforeUnmount(() => {
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
  margin-bottom: 2rem;
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
  border-bottom: 2px solid var(--primary);
  min-width: min-content;
  background: transparent;
  border-radius: 16px 16px 0 0;
  padding: 0.5rem 0.5rem 0 0.5rem;
  box-shadow: 0 4px 20px var(--shadow);
  backdrop-filter: blur(10px);
}

.scroll-button {
  background: var(--gradient-surface-1);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 0.75rem;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  box-shadow: 0 2px 8px var(--shadow);
  backdrop-filter: blur(10px);
}

.scroll-button:hover:not(:disabled) {
  background: var(--gradient-primary);
  color: var(--text-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px var(--shadow-hover);
}

.scroll-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.scroll-button-prev {
  margin-right: 0.75rem;
}

.scroll-button-next {
  margin-left: 0.75rem;
}

.tab-button {
  background: none;
  border: none;
  padding: 0.7rem 1.5rem;
  cursor: pointer;
  font-family: 'Quicksand', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  color: var(--text-secondary);
  transition: all 0.4s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  white-space: nowrap;
  flex-shrink: 0;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
}

.tab-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: var(--gradient-primary);
  transition: left 0.4s ease;
  z-index: -1;
  opacity: 0.1;
}

.tab-button:hover::before {
  left: 0;
}

.tab-button:hover {
  color: var(--text-primary);
  background: var(--gradient-mix);
  transform: translateY(-2px);
}

.tab-active {
  color: var(--title-primary);
  font-weight: 700;
  background: var(--gradient-surface-1);
  box-shadow: 0 -4px 12px var(--shadow);
}

.tab-active::before {
  left: 0;
  opacity: 0.15;
}

.tab-icon {
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
  font-size: 1.2rem;
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
  box-shadow: 0 2px 8px var(--primary);
  z-index: 2;
}

.tabs-content {
  min-height: 200px;
  background: var(--surface);
  border-radius: 0 0 16px 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px var(--shadow);
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
  padding: 0.5rem;
  gap: 0.5rem;
}

.tabs-header.pills-variant .tab-button {
  border-radius: 50px;
  padding: 0.875rem 1.5rem;
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
    padding: 0.5rem;
    min-width: 36px;
    min-height: 36px;
  }
  
  .scroll-button-prev {
    margin-right: 0.5rem;
  }
  
  .scroll-button-next {
    margin-left: 0.5rem;
  }
  
  .tab-button {
    padding: 0.875rem 1.25rem;
    font-size: 0.9rem;
    gap: 0.5rem;
  }
  
  .tabs-content {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .tab-button {
    padding: 0.75rem 1rem;
  }
  
  .tabs-content {
    padding: 1rem;
  }
}
</style>