<template>
  <component
    :is="ordered ? 'ol' : 'ul'"
    :class="[
      'base-list',
      `list-${variant}`,
      `list-size-${size}`,
      {
        'list-ordered': ordered,
        'list-divided': divided,
        'list-bordered': bordered,
        'list-striped': striped,
        'list-hoverable': hoverable,
        'list-compact': compact,
        'list-with-shadow': withShadow,
        'list-loading': loading
      }
    ]"
    :style="listStyles"
    role="list"
    :aria-busy="loading"
  >
    <!-- Loading State -->
    <template v-if="loading">
      <li v-for="n in 3" :key="`skeleton-${n}`" class="list-item list-item-skeleton">
        <div class="list-item-skeleton-content">
          <div class="skeleton-bullet"></div>
          <div class="skeleton-text">
            <div class="skeleton-line"></div>
            <div class="skeleton-line short"></div>
          </div>
        </div>
      </li>
    </template>

    <!-- Empty State -->
    <template v-else-if="items.length === 0 && !hideEmpty">
      <li class="list-item list-item-empty">
        <slot name="empty">
          <div class="empty-state">
            <OhVueIcon v-if="emptyIcon" :name="emptyIcon" class="empty-icon" />
            <span class="empty-text">{{ emptyText || t('components.list.empty') }}</span>
          </div>
        </slot>
      </li>
    </template>

    <!-- Items -->
    <template v-else>
      <li
        v-for="(item, index) in items"
        :key="item.id || index"
        :class="[
          'list-item',
          {
            'list-item-clickable': clickable || item.clickable,
            'list-item-disabled': item.disabled,
            'list-item-selected': selectedIndex === index || item.selected,
            'list-item-highlighted': item.highlighted,
            'list-item-with-divider': item.divider,
            [`list-item-${item.variant || ''}`]: item.variant
          }
        ]"
        :aria-selected="selectedIndex === index || item.selected"
        :aria-disabled="item.disabled"
        @click="handleItemClick(item, index)"
        @keydown.enter="handleItemClick(item, index)"
        @keydown.space.prevent="handleItemClick(item, index)"
        tabindex="0"
      >
        <!-- Selection Control -->
        <div v-if="selectable" class="list-item-selector">
          <Checkbox
            v-if="selectionType === 'multiple'"
            :model-value="isItemSelected(item, index)"
            @update:model-value="toggleItemSelection(item, index)"
            :disabled="item.disabled"
            size="small"
          />
          <Radio
            v-else
            :model-value="selectedIndex === index"
            @update:model-value="selectItem(item, index)"
            :disabled="item.disabled"
            size="small"
            :name="`list-radio-${_uid}`"
          />
        </div>

        <!-- Bullet/Number -->
        <div v-if="showMarker && !selectable" class="list-marker">
          <template v-if="ordered">
            <span class="list-number">{{ getItemNumber(index) }}</span>
          </template>
          <template v-else>
            <img
              v-if="customBullet"
              :src="customBullet"
              :alt="''"
              class="bullet-image"
              :class="{ 'bullet-spin': item.animate }"
            />
            <OhVueIcon
              v-else-if="bulletIcon || item.bulletIcon"
              :name="bulletIcon || item.bulletIcon"
              class="bullet-icon"
              :class="{ 'bullet-spin': item.animate }"
            />
            <span v-else class="bullet-default">•</span>
          </template>
        </div>

        <!-- Content -->
        <div class="list-item-content">
          <div class="list-item-header">
            <div class="list-item-main">
              <OhVueIcon
                v-if="item.icon"
                :name="item.icon"
                class="list-item-icon"
                :class="{ 'icon-spin': item.iconSpin }"
              />
              <div class="list-item-text-wrapper">
                <span class="list-item-text" v-html="highlightText ? highlightMatch(item.text) : item.text"></span>
                <span v-if="item.badge" class="list-item-badge">
                  <Badge :variant="item.badgeVariant || 'primary'" size="small">
                    {{ item.badge }}
                  </Badge>
                </span>
              </div>
            </div>

            <div v-if="item.meta" class="list-item-meta">
              {{ item.meta }}
            </div>
          </div>

          <div v-if="item.description" class="list-item-description" v-html="highlightText ? highlightMatch(item.description) : item.description">
          </div>

          <div v-if="item.tags" class="list-item-tags">
            <Badge
              v-for="(tag, tagIndex) in item.tags"
              :key="tagIndex"
              size="small"
              :variant="tag.variant || 'secondary'"
              class="list-item-tag"
            >
              {{ tag.text }}
            </Badge>
          </div>

          <div v-if="item.progress !== undefined" class="list-item-progress">
            <Progress
              :value="item.progress"
              :variant="item.progressVariant || 'primary'"
              :size="compact ? 'small' : 'medium'"
              :show-label="false"
            />
          </div>

          <div v-if="item.metadata" class="list-item-metadata">
            <span v-for="(value, key) in item.metadata" :key="key" class="metadata-item">
              <strong>{{ key }}:</strong> {{ value }}
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div v-if="item.actions || hasActionsSlot" class="list-item-actions">
          <slot name="actions" :item="item" :index="index">
            <Button
              v-for="action in item.actions"
              :key="action.id"
              :variant="action.variant || 'secondary'"
              :size="compact ? 'small' : 'medium'"
              :loading="action.loading"
              :disabled="action.disabled"
              @click.stop="handleAction(action, item, index)"
            >
              <OhVueIcon v-if="action.icon" :name="action.icon" />
              {{ action.label }}
            </Button>
          </slot>
        </div>

        <!-- Expand/Collapse -->
        <div v-if="item.children || item.expandable" class="list-item-expand">
          <Button
            variant="ghost"
            :size="compact ? 'small' : 'medium'"
            @click.stop="toggleExpand(item, index)"
          >
            <OhVueIcon :name="item.expanded ? 'oi-chevron-up' : 'oi-chevron-down'" />
          </Button>
        </div>
      </li>

      <!-- Nested Items -->
      <template v-if="showNested">
        <li
          v-for="(item, index) in items"
          :key="`nested-${item.id || index}`"
          class="list-item-nested"
          v-show="item.expanded"
        >
          <List
            :items="item.children"
            :ordered="ordered"
            :variant="variant"
            :size="size"
            :divided="divided"
            :bordered="bordered"
            :striped="striped"
            :hoverable="hoverable"
            :compact="compact"
            :clickable="clickable"
            :selectable="selectable"
            :selection-type="selectionType"
            :show-marker="showMarker"
            :custom-bullet="customBullet"
            :bullet-icon="bulletIcon"
            :level="level + 1"
            @item-click="handleNestedItemClick"
            @action-click="handleNestedActionClick"
            @select="handleNestedSelect"
          >
            <template #actions="{ item: nestedItem, index: nestedIndex }">
              <slot name="actions" :item="nestedItem" :index="nestedIndex" :parent="item" />
            </template>
          </List>
        </li>
      </template>
    </template>
  </component>
</template>

<script setup>
import { computed, inject, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { OhVueIcon } from 'oh-vue-icons'
import Button from './Button.vue'
import Badge from './Badge.vue'
import Checkbox from './Checkbox.vue'
import Radio from './Radio.vue'
import Progress from './Progress.vue'

const { t } = useI18n()

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
    validator: (value) => ['default', 'primary', 'secondary', 'success', 'warning', 'danger'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
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
  hoverable: {
    type: Boolean,
    default: true
  },
  compact: {
    type: Boolean,
    default: false
  },
  withShadow: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: false
  },
  selectable: {
    type: Boolean,
    default: false
  },
  selectionType: {
    type: String,
    default: 'single',
    validator: (value) => ['single', 'multiple'].includes(value)
  },
  showMarker: {
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
  },
  loading: {
    type: Boolean,
    default: false
  },
  hideEmpty: {
    type: Boolean,
    default: false
  },
  emptyText: {
    type: String,
    default: ''
  },
  emptyIcon: {
    type: String,
    default: 'oi-inbox'
  },
  highlightText: {
    type: String,
    default: ''
  },
  level: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits([
  'item-click',
  'action-click',
  'select',
  'expand',
  'update:selected'
])

const selectedIndex = ref(-1)
const selectedItems = ref(new Set())
const hasActionsSlot = inject('hasActionsSlot', false)

const listStyles = computed(() => {
  const styles = {}
  if (props.customBullet && !props.ordered) {
    styles['--custom-bullet'] = `url(${props.customBullet})`
  }
  return styles
})

const showNested = computed(() => {
  return props.items.some(item => item.children && item.children.length > 0)
})

const getItemNumber = (index) => {
  if (props.ordered) {
    return `${index + 1}.`
  }
  return ''
}

const isItemSelected = (item, index) => {
  if (props.selectionType === 'multiple') {
    return selectedItems.value.has(item.id || index)
  }
  return selectedIndex.value === index
}

const toggleItemSelection = (item, index) => {
  if (item.disabled) return

  const key = item.id || index
  if (selectedItems.value.has(key)) {
    selectedItems.value.delete(key)
  } else {
    selectedItems.value.add(key)
  }
  
  emit('select', { 
    items: Array.from(selectedItems.value), 
    item, 
    index,
    selected: true
  })
  emit('update:selected', Array.from(selectedItems.value))
}

const selectItem = (item, index) => {
  if (item.disabled) return

  selectedIndex.value = index
  emit('select', { item, index })
  emit('update:selected', index)
}

const handleItemClick = (item, index) => {
  if (item.disabled) return

  if (props.selectable) {
    if (props.selectionType === 'multiple') {
      toggleItemSelection(item, index)
    } else {
      selectItem(item, index)
    }
  }

  if (props.clickable || item.clickable) {
    emit('item-click', { item, index })
  }
}

const handleAction = (action, item, index) => {
  if (action.disabled) return
  emit('action-click', { action, item, index })
}

const toggleExpand = (item, index) => {
  item.expanded = !item.expanded
  emit('expand', { item, index, expanded: item.expanded })
}

const handleNestedItemClick = (event) => {
  emit('item-click', event)
}

const handleNestedActionClick = (event) => {
  emit('action-click', event)
}

const handleNestedSelect = (event) => {
  emit('select', event)
}

const highlightMatch = (text) => {
  if (!props.highlightText || !text) return text
  const regex = new RegExp(`(${props.highlightText})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

// Reset selection when items change
watch(() => props.items, () => {
  selectedIndex.value = -1
  selectedItems.value.clear()
}, { deep: true })
</script>

<style scoped>
.base-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  transition: all 0.3s ease;
}

/* Variants */
.list-default .list-item {
  background: var(--surface-primary);
}

.list-primary .list-item {
  background: var(--bg-primary);
  border-left: 4px solid var(--primary);
}

.list-secondary .list-item {
  background: var(--bg-secondary);
  border-left: 4px solid var(--secondary);
}

.list-success .list-item {
  background: color-mix(in srgb, var(--green) 10%, transparent);
  border-left: 4px solid var(--green);
}

.list-warning .list-item {
  background: color-mix(in srgb, var(--orange) 10%, transparent);
  border-left: 4px solid var(--orange);
}

.list-danger .list-item {
  background: color-mix(in srgb, var(--red) 10%, transparent);
  border-left: 4px solid var(--red);
}

/* Sizes */
.list-size-small .list-item {
  padding: 0.5rem;
  font-size: 0.875rem;
  gap: 0.5rem;
}

.list-size-small .list-item-icon {
  font-size: 1rem;
}

.list-size-medium .list-item {
  padding: 1rem;
  font-size: 1rem;
  gap: 1rem;
}

.list-size-medium .list-item-icon {
  font-size: 1.25rem;
}

.list-size-large .list-item {
  padding: 1.25rem;
  font-size: 1.125rem;
  gap: 1.25rem;
}

.list-size-large .list-item-icon {
  font-size: 1.5rem;
}

/* Compact mode */
.list-compact .list-item {
  padding: 0.375rem 0.75rem;
  gap: 0.5rem;
}

.list-compact .list-item-content {
  gap: 0.125rem;
}

/* List Item */
.list-item {
  display: flex;
  align-items: flex-start;
  transition: all 0.2s ease;
  position: relative;
  border-radius: 4px;
  outline: none;
  cursor: default;
}

.list-item:focus-visible {
  outline: 3px solid var(--focus);
  outline-offset: 2px;
}

.list-hoverable .list-item:not(.list-item-disabled):hover {
  background: var(--inner-surface);
  transform: translateX(4px);
  box-shadow: 0 2px 8px var(--shadow);
}

.list-item-clickable:not(.list-item-disabled) {
  cursor: pointer;
}

.list-item-selected {
  background: var(--rose-surface) !important;
  border-left: 4px solid var(--secondary) !important;
}

.list-item-highlighted {
  background: var(--sky-blue-surface) !important;
  border: 2px solid var(--primary);
}

.list-item-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.list-item-with-divider {
  border-bottom: 2px solid var(--border-primary);
}

/* Divided */
.list-divided .list-item {
  border-bottom: 1px solid var(--border);
  border-radius: 0;
}

.list-divided .list-item:last-child {
  border-bottom: none;
}

/* Bordered */
.list-bordered .list-item {
  border: 1px solid var(--border-strong);
  margin-bottom: 0.5rem;
}

.list-bordered .list-item:last-child {
  margin-bottom: 0;
}

/* Striped */
.list-striped .list-item:nth-child(even) {
  background: var(--inner-surface);
}

/* With Shadow */
.list-with-shadow {
  box-shadow: 0 4px 12px var(--shadow);
}

/* Selector */
.list-item-selector {
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
}

/* Marker */
.list-marker {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  color: var(--secondary);
  font-weight: 600;
  flex-shrink: 0;
}

.bullet-image {
  width: 16px;
  height: 16px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.bullet-icon {
  font-size: 0.875rem;
  color: var(--secondary);
}

.bullet-default {
  font-size: 1.25rem;
  line-height: 1;
  color: var(--secondary);
}

.bullet-spin {
  animation: spin 2s linear infinite;
}

.list-number {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--secondary);
}

/* Content */
.list-item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.list-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.list-item-main {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.list-item-text-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.list-item-text {
  color: var(--text-primary);
  font-weight: 500;
  word-break: break-word;
}

.list-item-text :deep(mark) {
  background-color: var(--yellow);
  color: var(--text-contrast);
  padding: 0.125rem 0.25rem;
  border-radius: 4px;
}

.list-item-badge {
  display: inline-flex;
}

.list-item-icon {
  color: var(--primary);
  transition: transform 0.3s ease;
}

.icon-spin {
  animation: spin 2s linear infinite;
}

.list-item-meta {
  color: var(--text-secondary);
  font-size: 0.875rem;
  white-space: nowrap;
}

.list-item-description {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
}

.list-item-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.list-item-progress {
  margin-top: 0.5rem;
}

.list-item-metadata {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.metadata-item strong {
  color: var(--text-primary);
  margin-right: 0.25rem;
}

/* Actions */
.list-item-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
  margin-left: 0.5rem;
}

/* Expand */
.list-item-expand {
  display: flex;
  align-items: center;
  margin-left: 0.5rem;
}

/* Nested */
.list-item-nested {
  padding-left: 2rem;
  list-style: none;
}

/* Empty State */
.list-item-empty {
  justify-content: center;
  padding: 2rem !important;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  width: 100%;
}

.empty-icon {
  font-size: 2rem;
  color: var(--border);
}

.empty-text {
  font-size: 0.875rem;
}

/* Skeleton Loading */
.list-item-skeleton {
  pointer-events: none;
}

.list-item-skeleton-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.skeleton-bullet {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(90deg, var(--border) 25%, var(--surface-secondary) 50%, var(--border) 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.skeleton-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-line {
  height: 16px;
  background: linear-gradient(90deg, var(--border) 25%, var(--surface-secondary) 50%, var(--border) 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

.skeleton-line.short {
  width: 60%;
}

/* Animations */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Responsive */
@media (max-width: 768px) {
  .list-item {
    flex-wrap: wrap;
  }

  .list-item-header {
    flex-wrap: wrap;
  }

  .list-item-meta {
    white-space: normal;
  }

  .list-item-actions {
    width: 100%;
    justify-content: flex-end;
    margin-top: 0.5rem;
    margin-left: 0;
  }

  .list-item-nested {
    padding-left: 1rem;
  }

  .list-size-large .list-item {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .list-item-main {
    flex-wrap: wrap;
  }

  .list-item-text-wrapper {
    width: 100%;
  }

  .list-item-actions {
    flex-wrap: wrap;
  }
}
</style>