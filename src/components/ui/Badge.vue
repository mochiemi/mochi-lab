<template>
  <span :class="badgeClasses">
    <slot></slot>
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'warning', 'error', 'tag'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  rounded: {
    type: Boolean,
    default: false
  }
})

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

const badgeClasses = computed(() => ({
  'badge': true,
  'badge-primary': props.variant === 'primary',
  'badge-secondary': props.variant === 'secondary',
  'badge-success': props.variant === 'success',
  'badge-warning': props.variant === 'warning',
  'badge-error': props.variant === 'error',
  'badge-tag': props.variant === 'tag',
  'badge-small': props.size === 'small',
  'badge-large': props.size === 'large',
  'badge-rounded': props.rounded,
  'dark-theme': isDark.value
}))
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.5em 0.75em;
  border-radius: 6px;
  font-size: 0.75em;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
}

.badge-small {
  padding: 0.25em 0.5em;
  font-size: 0.7em;
}

.badge-large {
  padding: 0.75em 1em;
  font-size: 0.875em;
}

.badge-rounded {
  border-radius: 50%;
}

.badge-primary {
  background: var(--sky-blue-surface);
  color: var(--text-primary);
  border: 1px solid var(--border-secondary);
}

.badge-secondary {
  background: var(--rose-surface);
  color: var(--text-secondary);
  border: 1px solid var(--border-primary);
}

.badge-success {
  background: var(--surface-primary);
  color: var(--green);
  border: 1px solid var(--green);
}

.badge-warning {
  background: var(--rose-10);
  color: var(--rose-70);
  border: 1px solid var(--rose-30);
}

.badge-error {
  background: var(--rose-20);
  color: var(--rose-90);
  border: 1px solid var(--rose-40);
}

.badge-tag {
  background: var(--turquoise-20);
  color: var(--rose-80);
  border: none;
}

</style>