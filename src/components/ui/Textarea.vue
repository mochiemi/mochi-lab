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
  gap: 0.5rem;
}

.textarea-label {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-primary);
}

.required {
  color: var(--rose-60);
}

.textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text-primary);
  font-family: 'Quicksand', sans-serif;
  font-size: 1rem;
  resize: vertical;
  transition: all 0.2s ease;
}

.textarea:focus {
  outline: none;
  border-color: var(--turquoise-50);
  background: var(--surface-contrast);
  box-shadow: 0 0 0 3px rgba(42, 157, 143, 0.1);
}

.textarea:disabled {
  background: var(--gray-10);
  color: var(--gray-50);
  cursor: not-allowed;
  opacity: 0.6;
}

.textarea.error {
  border-color: var(--rose-60);
}

.textarea.error:focus {
  border-color: var(--rose-60);
  box-shadow: 0 0 0 3px rgba(218, 110, 133, 0.1);
}


.textarea.warning {
  border-color: var(--accent);
}

.textarea.warning:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(151, 65, 91,  0.1);
}

.textarea.at-limit {
  border-color: var(--accent);
  background-color: rgba(151, 65, 91, 0.1);
}

.textarea.at-limit:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(151, 65, 91, 0.2);
}

.character-counter {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-align: right;
  transition: all 0.2s ease;
}

.character-counter.warning {
  color: var(--accent);
  font-weight: 600;
}

.character-counter.at-limit {
  color: var(--accent);
  font-weight: 700;
}

.error-message {
  font-size: 0.875rem;
  color: var(--rose-60);
  margin-top: 0.25rem;
}


.dark-theme.textarea {
  border-color: var(--gray-60);
  color: var(--text-primary);
}

.dark-theme.textarea:focus {
  border-color: var(--turquoise-40);
  box-shadow: 0 0 0 3px rgba(42, 157, 143, 0.2);
}

.dark-theme.textarea:disabled {
  background: var(--inner-surface);
  color: var(--gray-40);
}

.dark-theme.textarea.error {
  border-color: var(--rose-50);
}

.dark-theme.textarea.error:focus {
  border-color: var(--rose-50);
  box-shadow: 0 0 0 3px rgba(218, 110, 133, 0.2);
}

.dark-theme.textarea.warning {
  border-color: var(--rose-80);
  background-color: rgba(63, 0, 19, 0.1);
}

.dark-theme.textarea.warning:focus {
  border-color: var(--rose-60);
  box-shadow: 0 0 0 3px rgba(63, 0, 19,  0.3);
}

.dark-theme.textarea.at-limit {
  border-color: var(--rose-70);
  background-color: rgba(82, 35, 49, 0.15);
}

.dark-theme.textarea.at-limit:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(82, 35, 49,  0.4);
}

.dark-theme .character-counter {
  color: var(--text-secondary);
}

.dark-theme .character-counter.warning {
  color: var(--accent);
}

.dark-theme .character-counter.at-limit {
  color: var(--accent);
}

.dark-theme .error-message {
  color: var(--rose-40);
}
</style>
