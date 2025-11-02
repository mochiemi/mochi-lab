<template>
  <div 
    :class="['skeleton', `skeleton-${type}`, `skeleton-${animation}`, { 
      'skeleton-rounded': rounded,
      'skeleton-pulse': animation === 'pulse'
    }]"
    :style="skeletonStyles"
    aria-label="Loading content"
    role="status"
  >
    <div v-if="type === 'card'" class="skeleton-card">
      <div class="skeleton-image" v-if="showImage"></div>
      <div class="skeleton-content">
        <div class="skeleton-title"></div>
        <div class="skeleton-text" v-for="i in lines" :key="i"></div>
      </div>
    </div>
    
    <div v-else-if="type === 'image'" class="skeleton-image-placeholder">
      <OhVueIcon v-if="showIcon" name="oi-image" class="skeleton-icon" />
    </div>
    
    <div v-else-if="type === 'avatar'" class="skeleton-avatar">
      <OhVueIcon v-if="showIcon" name="oi-person" class="skeleton-icon" />
    </div>
    
    <div v-else class="skeleton-text-content">
      <div v-for="i in lines" :key="i" class="skeleton-line"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { OhVueIcon } from 'oh-vue-icons'

const props = defineProps({
  type: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'image', 'avatar', 'card'].includes(value)
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: ''
  },
  lines: {
    type: Number,
    default: 3
  },
  animation: {
    type: String,
    default: 'wave',
    validator: (value) => ['wave', 'pulse', 'none'].includes(value)
  },
  rounded: {
    type: Boolean,
    default: false
  },
  showImage: {
    type: Boolean,
    default: true
  },
  showIcon: {
    type: Boolean,
    default: true
  }
})

const skeletonStyles = computed(() => {
  const styles = {
    width: props.width
  }
  
  if (props.height) {
    styles.height = props.height
  }
  
  return styles
})
</script>

<style scoped>
.skeleton {
  background: var(--inner-surface);
  position: relative;
  overflow: hidden;
}

.skeleton-rounded {
  border-radius: 8px;
}

/* Text Skeleton */
.skeleton-text-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
}

.skeleton-line {
  height: 1rem;
  background: var(--border);
  border-radius: 4px;
}

.skeleton-line:last-child {
  width: 70%;
}

/* Image Skeleton */
.skeleton-image-placeholder {
  width: 100%;
  height: 200px;
  background: var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.skeleton-icon {
  font-size: 2rem;
  color: var(--gray-40);
}

/* Avatar Skeleton */
.skeleton-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Card Skeleton */
.skeleton-card {
  background: var(--surface);
  border-radius: 12px;
  border: 1px solid var(--border);
  overflow: hidden;
}

.skeleton-image {
  width: 100%;
  height: 160px;
  background: var(--border);
}

.skeleton-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skeleton-title {
  height: 1.5rem;
  background: var(--border);
  border-radius: 4px;
  width: 80%;
}

.skeleton-text {
  height: 1rem;
  background: var(--border);
  border-radius: 4px;
}

/* Animations */
.skeleton-wave::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: skeleton-wave 1.5s ease-in-out infinite;
}

@keyframes skeleton-wave {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.skeleton-pulse {
  animation: skeleton-pulse 2s ease-in-out infinite;
}

@keyframes skeleton-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

/* Size variants */
.skeleton-text.skeleton-sm .skeleton-line {
  height: 0.75rem;
}

.skeleton-text.skeleton-lg .skeleton-line {
  height: 1.25rem;
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-wave::after,
  .skeleton-pulse {
    animation: none;
  }
}
</style>