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
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
}

.badge-small {
  padding: 0.25rem 0.5rem;
  font-size: 0.7rem;
}

.badge-large {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
}

.badge-rounded {
  border-radius: 50%;
}

.badge-primary {
  background: var(--turquoise-20);
  color: var(--turquoise-80);
  border: 1px solid var(--turquoise-30);
}

.badge-secondary {
  background: var(--rose-20);
  color: var(--rose-80);
  border: 1px solid var(--rose-30);
}

.badge-success {
  background: var(--turquoise-10);
  color: var(--clovergreen);
  border: 1px solid var(--turquoise-30);
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

.dark-theme.badge-primary {
  background: var(--turquoise-80);
  color: var(--turquoise-10);
  border-color: var(--turquoise-70);
}

.dark-theme.badge-secondary {
  background: var(--rose-80);
  color: var(--rose-10);
  border-color: var(--rose-70);
}

.dark-theme.badge-success {
  background: var(--turquoise-90);
  color: var(--turquoise-20);
  border-color: var(--turquoise-70);
}

.dark-theme.badge-warning {
  background: var(--rose-70);
  color: var(--rose-10);
  border-color: var(--rose-60);
}

.dark-theme.badge-error {
  background: var(--rose-90);
  color: var(--rose-10);
  border-color: var(--rose-70);
}

.dark-theme.badge-tag {
  background: var(--turquoise-80);
  color: var(--rose-10);
}
</style>