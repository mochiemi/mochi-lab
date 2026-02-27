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
    validator: (value) => ['primary', 'secondary', 'success', 'danger', 'phantom'].includes(value)
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
    'btn-phantom':props.variant === 'phantom',
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
  padding: 0.5em 1em;
  border-radius: 8px;
  font-family: 'Comfortaa', sans-serif;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1em;
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
  padding: 0.25em 0.5em;
  font-size: 0.9em;
  max-width: 40%;
}

.btn-large {
  padding: 1em 2em;
  font-size: 1.3em;
  max-width: 100%;
}

.btn-primary {
  background: var(--primary);
  color: var(--text-primary);
}

.btn-primary:hover:not(.btn-disabled) {
  background: var(--border-secondary);
  color: var(--white);
}

.btn-secondary {
  background: var(--secondary);
  color: var(--text-primary);
}

.btn-secondary:hover:not(.btn-disabled) {
  background: var(--strong-rose);
  color: var(--white);
}

.btn-outline {
  background-color: transparent;
  color: var(--text-primary);
  outline: 3px dashed var(--strong-rose );
  
}

.btn-outline:hover:not(.btn-disabled) {
  color: var(--primary);
  outline: 3px solid var(--sky-blue);
}

.btn-danger {
  background: var(--red);
  outline: 5px double var(--rose);
  color: white;
  padding: 0.6rem 1rem;
}

.btn-danger:hover:not(.btn-disabled) {
  outline: 5px double white;
  background: var(--strong-rose);
  color: var(--black);
  box-shadow: 0 0 25px var(--rose);
}

.dark-theme.btn-danger{
  outline-color: var(--rose);
  background: var(--red);
  color: var(--white);
}

.dark-theme.btn-danger:hover:not(.btn-disabled) {
  outline: 5px double white;
  background: var(--strong-rose);
  color: white;
}

.btn-phantom {
  background-color: transparent;
  color: var(--text-primary);
}

.btn-phantom:hover:not(.btn-disabled) {
  color: var(--primary);
  box-shadow: 0 0 15px var(--rose);
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