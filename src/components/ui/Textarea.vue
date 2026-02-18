<template>
  <div class="textarea-wrapper">
    <label v-if="label" :for="id" class="textarea-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    
    <textarea
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      :maxlength="maxlength"
      :class="[
        'textarea', 
        { 
          'dark-theme': isDark,
          'error': error || isAtLimit,
          'at-limit': isAtLimit,
          'warning': isNearLimit
        }
      ]"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
    ></textarea>
    
    <div 
      v-if="showCounter && maxlength" 
      :class="[
        'character-counter', 
        { 
          'warning': isNearLimit,
          'at-limit': isAtLimit
        }
      ]"
    >
      {{ currentLength }}/{{ maxlength }}
    </div>
    
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useThemeStore } from '@/stores/theme'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  isError: {
    type: Boolean,
    default: false
  },
  rows: {
    type: Number,
    default: 4
  },
  maxlength: {
    type: Number,
    default: null
  },
  showCounter: {
    type: Boolean,
    default: false
  },
  id: {
    type: String,
    default: () => `textarea-${Math.random().toString(36).substr(2, 9)}`
  }
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'error'])

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)
const isFocused = ref(false)

const currentLength = computed(() => props.modelValue?.length || 0)
const isAtLimit = computed(() => props.maxlength && currentLength.value >= props.maxlength)
const isNearLimit = computed(() => {
  if (!props.maxlength) return false
  const warningThreshold = props.maxlength * 0.9 
  return currentLength.value >= warningThreshold && !isAtLimit.value
})

const handleInput = (event) => {
  let value = event.target.value
  

  if (props.maxlength && value.length > props.maxlength) {
    value = value.substring(0, props.maxlength)
    event.target.value = value 
  }
  
  emit('update:modelValue', value)
}

const handleKeydown = (event) => {

  const isControlKey = [
    'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 
    'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End'
  ].includes(event.key)
  
  if (isAtLimit.value && !isControlKey && !event.ctrlKey && !event.metaKey) {

    const textarea = event.target
    const hasSelection = textarea.selectionStart !== textarea.selectionEnd
    
    if (!hasSelection) {
      event.preventDefault()
    }
  }
}

const handleFocus = (event) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event) => {
  isFocused.value = false
  emit('blur', event)
}
</script>

<style scoped>
.textarea-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.textarea-label {
  font-weight: 600;
  font-size: 0.875em;
  color: var(--text-primary);
}

.required {
  color: var(--light-blue);
}

.textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  background: var(--surface-secondary);
  color: var(--text-primary);
  font-family: 'Comic Neue', cursive;
  font-size: 1em;
  resize: vertical;
  transition: all 0.2s ease;
}

.textarea:focus {
  outline: none;
  border-color: var(--focus);
  background: var(--surface-contrast);
  box-shadow: 0 0 0 3px rgba(42, 157, 143, 0.1);
}

.textarea:disabled {
  background: var(--disabled-surface);
  color: var(--text-disabled) !important;
  cursor: not-allowed;
}

.textarea.error {
  border-color: var(--red);
}

.textarea.error:focus {
  border-color: var(--strong-rose);
  box-shadow: 0 0 0 3px rgba(218, 110, 133, 0.1);
}


.textarea.warning {
  border-color: var(--strong-rose);
}

.textarea.warning:focus {
  border-color: var(--strong-rose);
  box-shadow: 0 0 0 3px rgba(151, 65, 91,  0.1);
}

.textarea.at-limit {
  border-color: var(--dull-rose);
  background-color: rgba(151, 65, 91, 0.1);
}

.textarea.at-limit:focus {
  border-color: var(--rose);
  box-shadow: 0 0 0 3px rgba(151, 65, 91, 0.2);
}

.character-counter {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-align: right;
  transition: all 0.2s ease;
}

.character-counter.warning {
  color: var(--strong-rose);
  font-weight: 600;
}

.character-counter.at-limit {
  color: var(--red);
  font-weight: 700;
}

.error-message {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

</style>
