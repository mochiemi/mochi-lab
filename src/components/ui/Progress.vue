<template>
  <div class="progress">
    <div class="progress-info" v-if="showInfo">
      <span class="progress-label">
        <slot name="label">{{ label }}</slot>
      </span>
      <span class="progress-value" v-if="showValue">{{ percentage }}%</span>
    </div>
    
    <div class="progress-bar" :class="[`progress-${size}`, { 'progress-striped': striped, 'progress-animated': animated }]">
      <div 
        :class="['progress-fill', `progress-${variant}`, { 'progress-glow': glow }]"
        :style="fillStyle"
        role="progressbar"
        :aria-valuenow="percentage"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div class="progress-inner-shine" v-if="showShine"></div>
      </div>
    </div>
    
    <div class="progress-description" v-if="$slots.description || description">
      <slot name="description">{{ description }}</slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0 && value <= 100
  },
  label: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'gradient'].includes(value)
  },
  showValue: {
    type: Boolean,
    default: true
  },
  showInfo: {
    type: Boolean,
    default: true
  },
  height: {
    type: String,
    default: '8px'
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  striped: {
    type: Boolean,
    default: false
  },
  animated: {
    type: Boolean,
    default: false
  },
  glow: {
    type: Boolean,
    default: false
  },
  showShine: {
    type: Boolean,
    default: false
  },
  rounded: {
    type: Boolean,
    default: true
  }
})

const percentage = computed(() => {
  return Math.min(100, Math.max(0, props.value))
})

const fillStyle = computed(() => {
  return {
    width: `${percentage.value}%`,
    height: props.height
  }
})
</script>

<style scoped>
.progress {
  width: 100%;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.progress-label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.progress-value {
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.progress-bar {
  width: 100%;
  background: var(--inner-surface);
  border-radius: 12px;
  overflow: hidden;
  height: v-bind(height);
  position: relative;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.progress-small {
  height: 6px;
}

.progress-medium {
  height: 10px;
}

.progress-large {
  height: 16px;
}

.progress-fill {
  height: 100%;
  border-radius: 12px;
  transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  background: var(--primary);
  position: relative;
  overflow: hidden;
}

.progress-striped .progress-fill {
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 1rem 1rem;
}

.progress-animated .progress-fill {
  animation: progress-stripes 1s linear infinite;
}

@keyframes progress-stripes {
  0% {
    background-position: 1rem 0;
  }
  100% {
    background-position: 0 0;
  }
}

.progress-primary {
  background: var(--primary);
}

.progress-secondary {
  background: var(--secondary);
}

.progress-gradient {
  background: linear-gradient(90deg, 
    var(--primary) 0%, 
    var(--secondary) 50%, 
    var(--primary) 100%);
  background-size: 200% 100%;
  animation: gradient-flow 2s linear infinite;
}

@keyframes gradient-flow {
  0% {
    background-position: 200% 0%;
  }
  100% {
    background-position: 0% 0%;
  }
}

.progress-bar:not(.progress-rounded) {
  border-radius: 0;
}

.progress-bar:not(.progress-rounded) .progress-fill {
  border-radius: 0;
}

.progress-description {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.progress-fill[style*="width: 0%"],
.progress-fill[style*="width: 1%"],
.progress-fill[style*="width: 2%"],
.progress-fill[style*="width: 3%"],
.progress-fill[style*="width: 4%"],
.progress-fill[style*="width: 5%"] {
  animation: progress-pulse 2s ease-in-out infinite;
}

@keyframes progress-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>