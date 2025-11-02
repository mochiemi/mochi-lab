<template>
  <img 
    :src="logoPath" 
    :alt="altText" 
    :class="computedClasses"
    :style="computedStyles"
    @click="$emit('click')"
  />
</template>

<script setup>
import { computed } from 'vue'
import logoImage from '@/assets/images/mochilab-logo.png'

const props = defineProps({
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large', 'xlarge'].includes(value)
  },
  width: {
    type: [String, Number],
    default: null
  },
  height: {
    type: [String, Number],
    default: null
  },
  altText: {
    type: String,
    default: 'Mochilab Logo'
  },
  className: {
    type: String,
    default: ''
  },
  clickable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const logoPath = logoImage

const computedClasses = computed(() => {
  return [
    'app-logo',
    `app-logo-${props.size}`,
    {
      'app-logo-clickable': props.clickable
    },
    props.className
  ]
})

const computedStyles = computed(() => {
  const styles = {}
  
  if (props.width) {
    styles.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  
  if (props.height) {
    styles.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }
  
  return styles
})
</script>

<style scoped>
.app-logo {
  display: inline-block;
  vertical-align: middle;
  transition: opacity 0.2s ease;
}

.app-logo-small {
  width: 32px;
  height: auto;
}

.app-logo-medium {
  width: 48px;
  height: auto;
}

.app-logo-large {
  width: 60px;
  height: auto;
}

.app-logo-xlarge {
  width: 120px;
  height: auto;
}

.app-logo-clickable {
  cursor: pointer;
  
}

.app-logo-clickable:hover {
  opacity: 0.8;
  animation: smoothSpin 3s linear infinite;
}

@keyframes smoothSpin {
  0% {
    transform: rotate(0deg) scale(1.1);
  }
  100% {
    transform: rotate(360deg) scale(1.1);
  }
}
</style>