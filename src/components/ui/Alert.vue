<template>
  <transition name="alert-fade">
    <div 
      v-if="visible" 
      :class="['alert', `alert-${type}`, `alert-${size}`, { 'dark-theme': isDark }]" 
      role="alert"
    >
      <div class="alert-content">
        <slot></slot>
      </div>
      
      <button 
        v-if="dismissible" 
        class="alert-close" 
        @click="handleDismiss"
        aria-label="Close alert"
      >
        ×
      </button>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
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
    default: false
  },
  modelValue: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['dismiss', 'update:modelValue'])

const themeStore = useThemeStore()
const visible = ref(props.modelValue)

const isDark = computed(() => themeStore.isDark)

watch(() => props.modelValue, (newVal) => {
  visible.value = newVal
})

onMounted(() => {
  if (props.autoClose) {
    const duration = typeof props.autoClose === 'number' ? props.autoClose : 5000
    setTimeout(() => {
      handleDismiss()
    }, duration)
  }
})

const handleDismiss = () => {
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
.alert {
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  transition: all 0.3s ease;
}

.alert-info {
  background: var(--gray-10);
  border: 1px solid var(--turquoise-40);
  color: var(--turquoise-70);
}

.alert-warning {
  background: var(--rose-20);
  border: 2px solid var(--accent);
  border-radius: 0;
  color: var(--rose-70);
}

.alert-success {
  background: var(--turquoise-20);
  border: 1px solid var(--clovergreen);
  color: var(--turquoise-90);
}

.alert-error {
  background: var(--rose-10);
  border: 1px solid var(--rose-50);
  color: var(--rose-70);
}

.dark-theme.alert-info {
  background: var(--gray-70);
  border: 1px solid var(--turquoise-50);
  color: var(--gray-10);
}

.dark-theme.alert-warning {
  background: var(--rose-70);
  border: 1px solid var(--accent);
  color: var(--white);
}

.dark-theme.alert-success {
  background: var(--turquoise-90);
  border: 1px solid var(--clovergreen);
  color: var(--turquoise-10);
}

.dark-theme.alert-error {
  background: var(--rose-90);
  border: 1px solid var(--rose-60);
  color: var(--rose-10);
}

.alert-sm {
  padding: 0.2rem; 
}

.alert-md {
  padding: 0.5rem;
}

.alert-lg {
  padding: 1rem;
  width: 100%;
}

.alert-content {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.alert-close {
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
}

.alert-close:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.1);
}

.dark-theme .alert-close:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.alert-fade-enter-active,
.alert-fade-leave-active {
  transition: all 0.3s ease;
}

.alert-fade-enter-from,
.alert-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>