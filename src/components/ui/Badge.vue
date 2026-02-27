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
    validator: (value) => [
      'primary', 
      'secondary', 
      'success', 
      'warning', 
      'error', 
      'tag',
      'info',
      'purple',
      'teal',
      'coral',
      'lavender',
      'mint',
      'peach',
      'plum'
    ].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  rounded: {
    type: Boolean,
    default: false
  },
  outlined: {
    type: Boolean,
    default: false
  },
  pulsating: {
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
  'badge-info': props.variant === 'info',
  'badge-purple': props.variant === 'purple',
  'badge-teal': props.variant === 'teal',
  'badge-coral': props.variant === 'coral',
  'badge-lavender': props.variant === 'lavender',
  'badge-mint': props.variant === 'mint',
  'badge-peach': props.variant === 'peach',
  'badge-plum': props.variant === 'plum',
  'badge-small': props.size === 'small',
  'badge-large': props.size === 'large',
  'badge-rounded': props.rounded,
  'badge-outlined': props.outlined,
  'badge-pulsating': props.pulsating,
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
  transition: all 0.3s ease;
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
  padding: 0.4em;
  width: 2em;
  height: 2em;
  justify-content: center;
}

.badge-rounded.badge-small {
  width: 1.5em;
  height: 1.5em;
  padding: 0.25em;
}

.badge-rounded.badge-large {
  width: 2.5em;
  height: 2.5em;
  padding: 0.5em;
}

/* Variantes existentes */
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
  background: var(--rose-surface);
  color: var(--orange);
  border: 1px solid var(--orange);
}

.badge-error {
  background: var(--rose-surface);
  color: var(--red);
  border: 1px solid var(--red);
}

.badge-tag {
  background: var(--sky-blue-surface);
  color: var(--text-primary);
  border: none;
  font-style: italic;
}

.badge-info {
  background: var(--badge-info-bg);
  color: var(--text-primary);
  border: 1px solid var(--badge-info-border);
}

.badge-purple {
  background: var(--badge-purple-bg);
  color: var(--badge-purple);
  border: 1px solid var(--badge-purple-border);
}

.badge-teal {
  background: var(--badge-teal-bg);
  color: var(--badge-teal);
  border: 1px solid var(--badge-teal-border);
}

.badge-coral {
  background: var(--badge-coral-bg);
  color: var(--badge-coral);
  border: 1px solid var(--badge-coral-border);
}

.badge-lavender {
  background: var(--badge-lavender-bg);
  color: var(--badge-lavender);
  border: 1px solid var(--badge-lavender-border);
}

.badge-mint {
  background: var(--badge-mint-bg);
  color: var(--badge-mint);
  border: 1px solid var(--badge-mint-border);
}

.badge-peach {
  background: var(--badge-peach-bg);
  color: var(--badge-peach);
  border: 1px solid var(--badge-peach-border);
}

.badge-plum {
  background: var(--badge-plum-bg);
  color: var(--badge-plum);
  border: 1px solid var(--badge-plum-border);
}

.badge-outlined {
  background: transparent;
}

.badge-outlined.badge-primary {
  background: transparent;
  color: var(--border-secondary);
}

.badge-outlined.badge-secondary {
  background: transparent;
  color: var(--border-primary);
}

.badge-outlined.badge-success {
  background: transparent;
  color: var(--green);
}

.badge-outlined.badge-warning {
  background: transparent;
  color: var(--orange);
}

.badge-outlined.badge-error {
  background: transparent;
  color: var(--red);
}

.badge-outlined.badge-info {
  background: transparent;
  color: var(--badge-info-border);
}

.badge-outlined.badge-purple {
  background: transparent;
  color: var(--badge-purple-border);
}

.badge-outlined.badge-teal {
  background: transparent;
  color: var(--badge-teal-border);
}

/* Efeito pulsating */
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.badge-pulsating {
  animation: pulse 2s infinite;
}

/* Dark theme ajustes */
.dark-theme.badge-warning,
.dark-theme.badge-error {
  color: var(--text-primary);
}
</style>