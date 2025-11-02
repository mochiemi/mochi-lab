<template>
  <button 
    :class="buttonClasses" 
    @click="handleClick"
    :type="type"
    :disabled="disabled"
    :style="buttonStyles"
  >
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'danger'].includes(value)
  },
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  }
})

const emit = defineEmits(['click', 'update:loading'])

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

const buttonClasses = computed(() => {
  return {
    'btn': true,
    'btn-primary': props.variant === 'primary',
    'btn-secondary': props.variant === 'secondary',
    'btn-outline': props.variant === 'outline',
    'btn-danger': props.variant === 'danger',
    'btn-small': props.size === 'small',
    'btn-large': props.size === 'large',
    'btn-disabled': props.disabled,
    'btn-loading': props.loading,
    'dark-theme': isDark.value
  }
})

const buttonStyles = computed(() => {
  return {
    opacity: props.disabled ? 0.6 : 1,
    cursor: props.disabled || props.loading ? 'not-allowed' : 'pointer'
  }
})

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
    
    if (props.loading) {
      emit('update:loading', false)
    }
  }
}
</script>

<style scoped>
.btn {
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-family: 'Quicksand', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  position: relative;
  max-width: 75%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn:hover:not(.btn-disabled):not(.btn-loading) {
  transform: translateY(-2px);
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  max-width: 40%;
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1.125rem;
  max-width: 100%;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover:not(.btn-disabled) {
  background: var(--turquoise-20);
  color: var(--turquoise-80);
}

.btn-secondary {
  background: var(--secondary);
  color: white;
}

.btn-secondary:hover:not(.btn-disabled) {
  background: var(--rose-20);
  color: var(--rose-80);
}

.btn-outline {
  background: var(--surface-contrast);
  color: var(--secondary);
  outline: 2px dotted var(--accent);
  
}

.btn-outline:hover:not(.btn-disabled) {
  color: var(--primary);
  outline: 2px solid var(--turquoise-50);
}

.btn-danger {
  background: var(--accent);
  outline: 5px double var(--rose-60);
  color: white;
  padding: 0.6rem 1rem;
}

.btn-danger:hover:not(.btn-disabled) {
  background: var(--rose-10);
  color: var(--rose-60);
  box-shadow: 0 0 25px var(--rose-40);
}

.dark-theme.btn-danger{
  outline-color: var(--accent);
  background: var(--rose-90);
  color: var(--accent);
}

.dark-theme.btn-danger:hover:not(.btn-disabled) {
  outline: 5px double white;
  background: var(--accent);
  color: white;
}

.btn-loading::after {
  content: '';
  position: relative;
  left: 0.5rem;
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  right: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>