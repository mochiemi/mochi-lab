<template>
  <div 
    :class="['spinner', `spinner-${size}`, `spinner-${variant}`, `spinner-${animation}`]" 
    :style="spinnerStyles"
    aria-label="Loading"
    role="status"
  >
    <div class="spinner-inner">
      <span v-if="text" class="spinner-text">{{ text }}</span>
      <div v-if="animation === 'pulse'" class="spinner-pulse"></div>
      <div v-else-if="animation === 'bounce'" class="spinner-bounce">
        <div class="bounce-dot bounce-dot-1"></div>
        <div class="bounce-dot bounce-dot-2"></div>
        <div class="bounce-dot bounce-dot-3"></div>
      </div>

      <div v-else class="spinner-circle">
        <div v-if="glow" class="spinner-glow"></div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary'].includes(value)
  },
  animation: {
    type: String,
    default: 'circle',
    validator: (value) => ['circle', 'bounce'].includes(value)
  },
  text: {
    type: String,
    default: ''
  },
  speed: {
    type: String,
    default: 'normal',
    validator: (value) => ['slow', 'normal', 'fast'].includes(value)
  }
})

const spinnerStyles = computed(() => {
  return {
    '--spinner-thickness': props.thickness || null,
    '--animation-speed': props.speed === 'slow' ? '2s' : props.speed === 'fast' ? '0.6s' : '1s'
  }
})
</script>

<style scoped>
.spinner {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
}

.spinner-inner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner-circle .spinner-circle {
  border: 5px solid transparent;
  border-top: 5px solid;
  border-radius: 50%;
  animation: spin var(--animation-speed, 1s) linear infinite;
  position: relative;
}

.spinner-bounce {
  display: flex;
  align-items: center;
  gap: 2px;
}

.bounce-dot {
  border-radius: 50%;
  background: currentColor;
  animation: bounce var(--animation-speed, 2s) infinite ease-in-out;
}

.bounce-dot-1 { animation-delay: -0.50s; }
.bounce-dot-2 { animation-delay: -0.25s; }
.bounce-dot-3 { animation-delay: 0s; }


.spinner-sm .spinner-circle { width: 16px; height: 16px; }
.spinner-md .spinner-circle { width: 24px; height: 24px; }
.spinner-lg .spinner-circle { width: 48px; height: 48px; }
.spinner-xl .spinner-circle { width: 60px; height: 60px; }

.spinner-sm .bounce-dot { width: 4px; height: 4px; }
.spinner-md .bounce-dot { width: 6px; height: 6px; }
.spinner-lg .bounce-dot { width: 8px; height: 8px; }
.spinner-xl .bounce-dot { width: 10px; height: 10px; }

.spinner-primary .spinner-circle,
.spinner-primary .bounce-dot {
  color: var(--primary);
}

.spinner-secondary .spinner-circle,
.spinner-secondary .bounce-dot {
  color: var(--secondary);
}



@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.2);
    opacity: 1;
  }
}


.spinner-text {
  color: var(--text-secondary);
  margin-right: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
}

@media (prefers-reduced-motion: reduce) {
  .spinner-circle,
  .spinner-orbit,
  .spinner-pulse,
  .bounce-dot,
  .wave-bar {
    animation-duration: 5s;
  }
}
</style>