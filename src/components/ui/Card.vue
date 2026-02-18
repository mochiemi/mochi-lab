<template>
  <div 
    :class="['card', { 
      'clickable': clickable, 
      'disabled': disabled,
      'flat': flat 
    }]" 
    @click="handleClick"
    :style="cardStyles"
  >
    <div class="card-header" v-if="$slots.header || title">
      <slot name="header">
        <h4 class="card-title">{{ title }}</h4>
      </slot>
    </div>
    
    <div class="card-body" :class="bodyClasses">
      <slot></slot>
    </div>
    
    <div class="card-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
    
    <div v-if="loading" class="card-loading">
      <Loading size="lg" variant="secondary"/>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Loading from './Loading.vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  clickable: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  flat: {
    type: Boolean,
    default: true
  },
  padding: {
    type: String,
    default: 'normal',
    validator: (value) => ['none', 'small', 'normal', 'large'].includes(value)
  }
})

const emit = defineEmits(['click'])

const bodyClasses = computed(() => {
  return {
    'card-body-no-padding': props.padding === 'none',
    'card-body-small-padding': props.padding === 'small',
    'card-body-large-padding': props.padding === 'large'
  }
})

const cardStyles = computed(() => {
  return {
    cursor: props.clickable && !props.disabled && !props.loading ? 'pointer' : 'default'
  }
})

const handleClick = () => {
  if (props.clickable && !props.disabled && !props.loading) {
    emit('click')
  }
}
</script>

<style scoped>
.card {
  padding: 0.5em;
  font-size: 1.1em;
  font-family: inherit;
  line-height: 1.2;
  box-shadow: 0 4px 12px var(--shadow);
  border: 2px dashed var(--border-contrast);
  border-radius: 10px;
  transition: all 0.3s ease;
  position: relative;
}

.card.flat {
  box-shadow: none;
}

.card.clickable:not(.disabled):hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px var(--shadow-hover);
}

.card.disabled {
  opacity: 0.6;
  pointer-events: none;
  background-color: var(--disabled-bg);
}

.card-header {
  margin-bottom: 1em;
  padding-bottom: 0.75em;
  border-bottom: 2px solid var(--border-strong);
  font-size: 2em;
}

.card-title {
  font-size: 0.8em;
  color: var(--title-primary);
  margin: 0;
}

.card-body {
  color: var(--text-primary);
}

.card-body-no-padding {
  padding: 0;
}

.card-body-small-padding {
  padding: 0.5em;
}

.card-body-large-padding {
  padding: 2em;
}

.card-footer {
  margin-top: 1em;
  padding-top: 0.75em;
}

.card-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(129, 129, 129, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

@media (max-width: 768px) {
.card {
  font-size: 0.9rem;
  margin:0;
}
}

</style>  