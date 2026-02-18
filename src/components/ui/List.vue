<template>
  <component 
    :is="ordered ? 'ol' : 'ul'" 
    :class="['base-list', `list-${variant}`, { 
      'list-divided': divided,
      'list-bordered': bordered,
      'list-striped': striped
    }]"
    :style="listStyles"
  >
    <li 
      v-for="(item, index) in items" 
      :key="item.id || index"
      :class="['list-item', { 
        'list-item-clickable': clickable,
        'list-item-disabled': item.disabled
      }]"
      @click="handleItemClick(item, index)"
    >

      <span v-if="!ordered && showBullet" class="list-bullet">
        <img v-if="customBullet" :src="customBullet" :alt="''" class="bullet-image" />
        <OhVueIcon v-else-if="bulletIcon" :name="bulletIcon" class="bullet-icon" />
        <span v-else class="bullet-default">•</span>
      </span>
      
 
      <span v-else-if="ordered" class="list-number">{{ index + 1 }}.</span>
      

      <div class="list-item-content">
        <div class="list-item-main">
          <span v-if="item.icon" class="list-item-icon">
            <OhVueIcon :name="item.icon" />
          </span>
          <span class="list-item-text">{{ item.text }}</span>
        </div>
        
        <div v-if="item.description" class="list-item-description">
          {{ item.description }}
        </div>
        
        <div v-if="item.meta" class="list-item-meta">
          {{ item.meta }}
        </div>
      </div>
      

      <div v-if="item.actions || $slots.actions" class="list-item-actions">
        <slot name="actions" :item="item" :index="index">
          <Button 
            v-for="action in item.actions" 
            :key="action.id"
            :variant="action.variant || 'secondary'"
            size="small"
            @click.stop="handleAction(action, item, index)"
          >
            <OhVueIcon v-if="action.icon" :name="action.icon" />
            {{ action.label }}
          </Button>
        </slot>
      </div>
    </li>
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { OhVueIcon } from 'oh-vue-icons'
import Button from './Button.vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  ordered: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'secondary'].includes(value)
  },
  divided: {
    type: Boolean,
    default: false
  },
  bordered: {
    type: Boolean,
    default: false
  },
  striped: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: false
  },
  showBullet: {
    type: Boolean,
    default: true
  },
  customBullet: {
    type: String,
    default: ''
  },
  bulletIcon: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['item-click', 'action-click'])

const listStyles = computed(() => {
  if (props.customBullet && !props.ordered) {
    return {
      '--custom-bullet': `url(${props.customBullet})`
    }
  }
  return {}
})

const handleItemClick = (item, index) => {
  if (props.clickable && !item.disabled) {
    emit('item-click', { item, index })
  }
}

const handleAction = (action, item, index) => {
  emit('action-click', { action, item, index })
}
</script>

<style scoped>
.base-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  background: var(--surface);
}

.list-item-clickable:not(.list-item-disabled):hover {
  background: var(--inner-surface);
  transform: translateX(4px);
  cursor: pointer;
}

.list-item-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.list-divided .list-item {
  border-bottom: 1px solid var(--border);
  border-radius: 0;
}

.list-divided .list-item:last-child {
  border-bottom: none;
}

.list-bordered .list-item {
  border: 1px solid var(--border-strong);
}

.list-striped .list-item:nth-child(even) {
  background: var(--inner-surface);
}


.list-primary .list-item {
  background: var(--bg-primary);
  border-left: 4px solid var(--primary);
}

.list-secondary .list-item {
  background: var(--bg-secondary);
  border-left: 4px solid var(--secondary);
}


.list-bullet,
.list-number {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  color: var(--title-secondary);
  font-weight: 600;
  flex-shrink: 0;
}

.bullet-image {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.bullet-icon {
  font-size: 0.875rem;
}

.bullet-default {
  font-size: 1.25rem;
  line-height: 1;
}

.list-number {
  font-size: 0.875rem;
}


.list-item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.list-item-main {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.list-item-icon {
  color: var(--title-primary);
  font-size: 1rem;
  display: flex;
  align-items: center;
}

.list-item-text {
  color: var(--text-primary);
  font-weight: 500;
}

.list-item-description {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.4;
}

.list-item-meta {
  color: var(--border);
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.list-item-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.base-list:not(.base-list-ordered) {
  list-style: none;
}

.base-list:not(.base-list-ordered) .list-bullet {
  display: flex;
}

@media (max-width: 768px) {
  .list-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .list-item-actions {
    align-self: flex-end;
  }
  
  .list-item-main {
    width: 100%;
  }
}
</style>