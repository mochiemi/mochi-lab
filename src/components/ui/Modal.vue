<template>
  <Teleport to="body">
    <transition name="modal-fade">
      <div v-if="show" class="modal-overlay" @click.self="handleOverlayClick">
        <div 
          :class="['modal-container', `modal-${size}`]" 
          :style="modalStyles"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title ? `${modalId}-title` : null"
        >
          <div class="modal-header" v-if="$slots.header || title">
            <slot name="header">
              <h2 :id="`${modalId}-title`" class="modal-title">{{ title }}</h2>
            </slot>
            <button 
              v-if="closable" 
              class="modal-close" 
              @click="handleClose"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
          
          <div class="modal-body">
            <slot></slot>
          </div>
          
          <div class="modal-footer" v-if="$slots.footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  closable: {
    type: Boolean,
    default: true
  },
  closeOnOverlay: {
    type: Boolean,
    default: true
  },
  width: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:show', 'close'])

const modalId = ref(`modal-${Math.random().toString(36).substr(2, 9)}`)

const modalStyles = computed(() => {
  return {
    width: props.width || null
  }
})

watch(() => props.show, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
    nextTick(() => {
      const focusable = document.querySelector('.modal-container button, .modal-container input, .modal-container select, .modal-container textarea')
      if (focusable) focusable.focus()
    })
  } else {
    document.body.style.overflow = ''
  }
})

const handleClose = () => {
  emit('update:show', false)
  emit('close')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    handleClose()
  }
}

const handleEscape = (event) => {
  if (event.key === 'Escape' && props.show && props.closable) {
    handleClose()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100dvw;
  height: 100dvh;
  background: rgba(110, 50, 65, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
}

.modal-container {
  background: var(--surface);
  border-radius: 12px;
  box-shadow: 0 0 60px var(--shadow-hover);
  border: 1px solid var(--border);
  max-height: 80dvh;
  display: flex;
  flex-direction: column;
  animation: modal-scale 0.3s ease;
  position: relative;
  margin: 20px;
}

.modal-sm {
  width: 300px;
}

.modal-md {
  width: 500px;
}

.modal-lg {
  width: 650px;
}

.modal-xl {
  width: 800px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem 1.5rem 0;
  margin-bottom: 1rem;
  flex-shrink: 0;
}

.modal-title {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 700;
}

.modal-close {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: var(--text-secondary);
  transition: all 0.2s ease;
  margin-left: 1rem;
}

.modal-close:hover {
  background: var(--inner-surface);
  border: 2px solid var(--accent);
  color: var(--text-primary);
}

.modal-body {
  padding: 0 1.5rem;
  flex: 1;
  overflow-y: auto;
  color: var(--text-secondary);
}

.modal-footer {
  padding: 1rem 1.5rem 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  border-top: 1px solid var(--border);
  margin-top: 1rem;
  flex-shrink: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
  transform: scale(0.9);
}

@keyframes modal-scale {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>