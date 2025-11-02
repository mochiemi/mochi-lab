<template>
  <Teleport to="body">
    <transition name="toast-fade">
      <div 
  v-if="visible" 
  :class="['toast', `toast-${type}`, `toast-${position}`, `toast-${size}`, { 'dark-theme': isDark }]" 
  role="alert"
  aria-live="polite"
>
        <div class="toast-content">
          <slot></slot>
        </div>
        
        <button 
          v-if="dismissible" 
          class="toast-close" 
          @click="handleDismiss"
          aria-label="Close toast"
        >
          ×
        </button>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'

const props = defineProps({
  position: {
    type: String,
    default: 'top-right',
    validator: (value) => ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'].includes(value)
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'warning', 'success', 'error'].includes(value)
  },
  dismissible: {
    type: Boolean,
    default: false
  },
  autoClose: {
    type: [Boolean, Number],
    default: 5000
  },
  modelValue: {
    type: Boolean,
    default: true
  },
  size: {
  type: String,
  default: 'md',
  validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
})

const emit = defineEmits(['dismiss', 'update:modelValue'])

const themeStore = useThemeStore()
const visible = ref(props.modelValue)

const isDark = computed(() => themeStore.isDark)

watch(() => props.modelValue, (newVal) => {
  visible.value = newVal
})

let autoCloseTimeout = null

onMounted(() => {
  if (props.autoClose) {
    const duration = typeof props.autoClose === 'number' ? props.autoClose : 5000
    autoCloseTimeout = setTimeout(() => {
      handleDismiss()
    }, duration)
  }
})

const handleDismiss = () => {
  if (autoCloseTimeout) {
    clearTimeout(autoCloseTimeout)
    autoCloseTimeout = null
  }
  
  visible.value = false
  emit('update:modelValue', false)
  emit('dismiss')
}

const show = () => {
  visible.value = true
  emit('update:modelValue', true)
}

const hide = () => {
  handleDismiss()
}

defineExpose({
  show,
  hide
})
</script>

<style scoped>
.toast {
  position: fixed;
  z-index: 1000;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  transition: all 0.3s ease;
  max-width: 400px;
  min-width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin: 0.5rem;
}


.toast-top-left {
  top: 0;
  left: 0;
}

.toast-top-center {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.toast-top-right {
  top: 0;
  right: 0;
}

.toast-bottom-left {
  bottom: 0;
  left: 0;
}

.toast-bottom-center {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.toast-bottom-right {
  bottom: 0;
  right: 0;
}

.toast-info {
  background: var(--gray-10);
  border: 1px solid var(--turquoise-40);
  color: var(--turquoise-70);
}

.toast-warning {
  background: var(--rose-20);
  border: 2px solid var(--accent);
  border-radius: 0;
  color: var(--rose-70);
}

.toast-success {
  background: var(--turquoise-20);
  border: 1px solid var(--clovergreen);
  color: var(--turquoise-90);
}

.toast-error {
  background: var(--rose-10);
  border: 1px solid var(--rose-50);
  color: var(--rose-70);
}

.dark-theme.toast-info {
  background: var(--gray-70);
  border: 1px solid var(--turquoise-50);
  color: var(--gray-10);
}

.dark-theme.toast-warning {
  background: var(--rose-70);
  border: 1px solid var(--accent);
  color: var(--white);
}

.dark-theme.toast-success {
  background: var(--turquoise-90);
  border: 1px solid var(--clovergreen);
  color: var(--turquoise-10);
}

.dark-theme.toast-error {
  background: var(--rose-90);
  border: 1px solid var(--rose-60);
  color: var(--rose-10);
}


.toast-sm {
  padding: 0.75rem;
  font-size: 0.875rem;
}

.toast-md {
  padding: 1rem;
  font-size: 1rem;
}

.toast-lg {
  padding: 1.25rem;
  font-size: 1.125rem;
}

.toast-content {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.toast-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: inherit;
  opacity: 0.7;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.toast-close:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.1);
}

.dark-theme .toast-close:hover {
  background-color: rgba(255, 255, 255, 0.1);
}


.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}

.toast-fade-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}

.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}


.toast-top-left.toast-fade-enter-from,
.toast-top-center.toast-fade-enter-from,
.toast-top-right.toast-fade-enter-from {
  transform: translateY(-20px) scale(0.9);
}

.toast-bottom-left.toast-fade-enter-from,
.toast-bottom-center.toast-fade-enter-from,
.toast-bottom-right.toast-fade-enter-from {
  transform: translateY(20px) scale(0.9);
}

.toast-top-left.toast-fade-leave-to,
.toast-top-center.toast-fade-leave-to,
.toast-top-right.toast-fade-leave-to {
  transform: translateY(-10px) scale(0.95);
}

.toast-bottom-left.toast-fade-leave-to,
.toast-bottom-center.toast-fade-leave-to,
.toast-bottom-right.toast-fade-leave-to {
  transform: translateY(10px) scale(0.95);
}
</style>