<template>
  <div class="tooltip-wrapper" @mouseenter="showTooltip" @mouseleave="hideTooltip">
    <slot></slot>
    
    <transition name="tooltip-fade">
      <div 
        v-if="visible" 
        :class="['tooltip', `tooltip-${position}`, `tooltip-${variant}`, `tootip-${size}`]"
        :style="tooltipStyles"
        role="tooltip"
      >
        <div class="tooltip-content">
          {{ content }}
        </div>
        <div class="tooltip-arrow"></div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'

const props = defineProps({
  content: {
    type: String,
    required: true
  },
  position: {
    type: String,
    default: 'top',
    validator: (value) => ['top', 'bottom', 'left', 'right'].includes(value)
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary'].includes(value)
  },
  size: {
    type: String,
    default: 'min',
    validator: (value) => ['md', 'lg', 'xl'].includes(value)
  },

  delay: {
    type: Number,
    default: 0
  },
  maxWidth: {
    type: String,
    default: '200px'
  }
})

const visible = ref(false)
const timeout = ref(null)

const tooltipStyles = computed(() => {
  return {
    'max-width': props.maxWidth
  }
})

const showTooltip = () => {
  if (props.delay > 0) {
    timeout.value = setTimeout(() => {
      visible.value = true
    }, props.delay)
  } else {
    visible.value = true
  }
}

const hideTooltip = () => {
  if (timeout.value) {
    clearTimeout(timeout.value)
    timeout.value = null
  }
  visible.value = false
}

onBeforeUnmount(() => {
  if (timeout.value) {
    clearTimeout(timeout.value)
  }
})
</script>

<style scoped>
.tooltip-wrapper {
  display: inline-block;
  position: relative;
}

.tooltip {
  position: absolute;
  z-index: 1000;
  padding: 0.25rem 0.4rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  line-height: 1.4;
  text-align: center;
  white-space: normal;
  pointer-events: none;
  box-shadow: 0 4px 12px var(--shadow);
}

.tooltip-content {
  position: relative;
  z-index: 1;
}

.tooltip-arrow {
  position: absolute;
  width: 8px;
  height: 8px;
  background: inherit;
  transform: rotate(45deg);
}

.tootip-md {
  min-width: 5rem;
  max-width: 10rem;
  padding: 0.3rem 0.5rem;
}

.tootip-lg {
  min-width: 10rem;
  max-width: 20rem;
  padding: 0.5rem 0.6rem;
}

.tootip-xl {
  min-width: 20rem;
  max-width: 30rem;
  padding: 0.6rem 0.8rem;
}

.tooltip-top {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
}

.tooltip-top .tooltip-arrow {
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%) rotate(45deg);
}

.tooltip-bottom {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8px;
}

.tooltip-bottom .tooltip-arrow {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(50%) rotate(45deg);
}

.tooltip-left {
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-right: 8px;
}

.tooltip-left .tooltip-arrow {
  left: 100%;
  top: 50%;
  transform: translateY(-50%) translateX(-50%) rotate(45deg);
}

.tooltip-right {
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 8px;
}

.tooltip-right .tooltip-arrow {
  right: 100%;
  top: 50%;
  transform: translateY(-50%) translateX(50%) rotate(45deg);
}


.tooltip-primary {
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--primary);
}

.tooltip-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--secondary);
}

.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: all 0.2s ease;
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px) translateX(-50%);
}

.tooltip-fade-enter-from.tooltip-bottom,
.tooltip-fade-leave-to.tooltip-bottom {
  transform: translateY(5px) translateX(-50%);
}

.tooltip-fade-enter-from.tooltip-left,
.tooltip-fade-leave-to.tooltip-left {
  transform: translateX(-5px) translateY(-50%);
}

.tooltip-fade-enter-from.tooltip-right,
.tooltip-fade-leave-to.tooltip-right {
  transform: translateX(5px) translateY(-50%);
}
</style>