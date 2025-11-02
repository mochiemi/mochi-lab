<template>
  <div class="accordion" :class="[`accordion-${variant}`, { 'accordion-bordered': bordered }]">
    <div
      v-for="(item, index) in items"
      :key="item.id || index"
      :class="['accordion-item', { 
        'accordion-item-expanded': isExpanded(index),
        'accordion-item-disabled': item.disabled
      }]"
    >
      <button
        :class="['accordion-header', { 'accordion-header-disabled': item.disabled }]"
        @click="toggleItem(index)"
        :disabled="item.disabled"
        :aria-expanded="isExpanded(index)"
        :aria-controls="`accordion-content-${index}`"
      >
        <span class="accordion-title">
          <OhVueIcon v-if="item.icon" :name="item.icon" class="accordion-icon" />
          {{ item.title }}
        </span>
        
        <span class="accordion-arrow">
          <OhVueIcon :name="isExpanded(index) ? 'oi-chevron-up' : 'oi-chevron-down'" />
        </span>
      </button>
      
      <transition
        name="accordion-slide"
        @enter="onEnter"
        @after-enter="onAfterEnter"
        @before-leave="onBeforeLeave"
      >
        <div
          v-show="isExpanded(index)"
          :id="`accordion-content-${index}`"
          class="accordion-content"
        >
          <div class="accordion-body">
            <slot name="content" :item="item" :index="index">
              {{ item.content }}
            </slot>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { OhVueIcon } from 'oh-vue-icons'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'secondary'].includes(value)
  },
  multiple: {
    type: Boolean,
    default: false
  },
  bordered: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'item-toggle'])

const expandedItems = ref(props.modelValue)

const isExpanded = (index) => {
  return expandedItems.value.includes(index)
}

const toggleItem = (index) => {
  if (props.items[index]?.disabled) return

  const currentIndex = expandedItems.value.indexOf(index)
  
  if (currentIndex > -1) {
    // Item is expanded, collapse it
    expandedItems.value.splice(currentIndex, 1)
  } else {
    // Item is collapsed, expand it
    if (props.multiple) {
      expandedItems.value.push(index)
    } else {
      expandedItems.value = [index]
    }
  }

  emit('update:modelValue', expandedItems.value)
  emit('item-toggle', { index, expanded: isExpanded(index), item: props.items[index] })
}

// Transition handlers
const onEnter = (el) => {
  el.style.height = '0'
  el.style.height = `${el.scrollHeight}px`
}

const onAfterEnter = (el) => {
  el.style.height = 'auto'
}

const onBeforeLeave = (el) => {
  el.style.height = `${el.scrollHeight}px`
  setTimeout(() => {
    el.style.height = '0'
  }, 10)
}
</script>

<style scoped>
.accordion {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.accordion-bordered {
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}

.accordion-bordered .accordion-item {
  border-bottom: 1px solid var(--border);
  margin: 0;
}

.accordion-bordered .accordion-item:last-child {
  border-bottom: none;
}

.accordion-item {
  background: var(--surface);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.accordion-bordered .accordion-item {
  border-radius: 0;
}

.accordion-item-expanded {
  box-shadow: 0 2px 8px var(--shadow);
}

.accordion-header {
  width: 100%;
  padding: 1.25rem 1.5rem;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  color: var(--text-primary);
  font-family: 'Quicksand', sans-serif;
  font-weight: 600;
  font-size: 1rem;
}

.accordion-header:hover:not(.accordion-header-disabled) {
  background: var(--inner-surface);
}

.accordion-header-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.accordion-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.accordion-icon {
  color: var(--primary);
  font-size: 1.1rem;
}

.accordion-arrow {
  color: var(--text-secondary);
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.accordion-item-expanded .accordion-arrow {
  transform: rotate(180deg);
}

.accordion-content {
  overflow: hidden;
  transition: height 0.3s ease;
}

.accordion-body {
  padding: 0 1.5rem 1.5rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Variants */
.accordion-primary .accordion-header {
  background: var(--turquoise-10);
  border-left: 4px solid var(--primary);
}

.accordion-secondary .accordion-header {
  background: var(--rose-10);
  border-left: 4px solid var(--secondary);
}

/* Transition */
.accordion-slide-enter-active,
.accordion-slide-leave-active {
  transition: height 0.3s ease;
}

.accordion-slide-enter-from,
.accordion-slide-leave-to {
  height: 0;
}

@media (max-width: 768px) {
  .accordion-header {
    padding: 1rem 1.25rem;
  }
  
  .accordion-body {
    padding: 0 1.25rem 1.25rem;
  }
}
</style>