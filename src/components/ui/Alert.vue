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
import Alert from '@/components/ui/Alert.vue';

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
  margin: 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1em;
  transition: all 0.3s ease;
}

.alert-info {
  background: var(--sky-blue-surface);
  border: 2px solid var(--border);
  color: var(--text-secondary);
}

.alert-warning {
  background: var(--rose-surface);
  border: 2px solid var(--red);
  color: var(--text-primary);
}

.alert-success {
  background: var(--surface-contrast);
  color: var(--green);
  border: 2px solid var(--green);
}

.alert-error {
  background: var(--surface-error);
  color: var(--text-contrast);
}

.alert-sm {
  padding: 0.2em;
  font-size: 0.7em;
}

.alert-md {
  padding: 0.5em;
  font-size: 0.9em;
}

.alert-lg {
  padding: 1em;
  font-size: 1.1em;
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

.alert-fade-enter-active,
.alert-fade-leave-active {
  transition: all 0.3s ease;
}

.alert-fade-enter-from,
.alert-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.alert{
  padding-left: 1em;
}

</style>