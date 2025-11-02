<template>
  <div class="select-wrapper">
    <label v-if="label" :for="id" class="select-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    
    <div class="select-container">
      <select
        :id="id"
        :value="modelValue"
        :disabled="disabled"
        :class="['select', { 'error': error, 'dark-theme': isDark , 'selected': modelValue}]"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      >
        <option v-if="placeholder" value="" disabled>
          {{ placeholder }}
        </option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>
      <OhVueIcon name="hi-solid-selector" class="select-icon" />
    </div>
    
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
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
  options: {
    type: Array,
    default: () => []
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
  id: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'focus', 'blur'])

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

const handleChange = (event) => {
  emit('update:modelValue', event.target.value)
  emit('change', event.target.value)
}

const handleFocus = (event) => {
  emit('focus', event)
}

const handleBlur = (event) => {
  emit('blur', event)
}
</script>

<style scoped>
.select-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.select-label {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-primary);
}

.required {
  color: var(--rose-60);
}

.select-container {
  position: relative;
  display: inline-block;
  width: 100%;
}

.select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  background-color: var(--surface);
  color: var(--text-primary);
  font-family: 'Quicksand', sans-serif;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  padding-right: 2.5rem; 
}
 
.select-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--secondary);
  font-size: 1rem;
}

.select:focus {
  outline: none;
  border-color: var(--turquoise-50);
  box-shadow: 0 0 0 3px rgba(42, 157, 143, 0.1);
}

.select:disabled {
  background: var(--gray-10);
  color: var(--gray-50);
  cursor: not-allowed;
  opacity: 0.6;
}

.select.selected:not(:disabled, .error) {
  border-color: var(--primary);
  background-color: var(--bg-primary);
}

.select.error {
  border-color: var(--rose-60);
  background-color: var(--rose-10);
}

.select.error:focus {
  border-color: var(--rose-60);
  background-color: var(--surface);
  box-shadow: 0 0 0 3px rgba(218, 110, 133, 0.1);
}

.error-message {
  font-size: 0.875rem;
  color: var(--rose-60);
  margin-top: 0.25rem;
}

.dark-theme.select:focus {
  border-color: var(--turquoise-40);
  box-shadow: 0 0 0 3px rgba(42, 157, 143, 0.2);
}

.dark-theme.select:disabled {
  background: var(--gray-80);
  color: var(--gray-40);
}

.dark-theme.select.error {
  border-color: var(--rose-50);
  background-color: var(--rose-90);
}

.dark-theme.select.error:focus {
  border-color: var(--rose-50);
  box-shadow: 0 0 0 3px rgba(218, 110, 133, 0.2);
}

.dark-theme .error-message {
  color: var(--rose-50);
}

.dark-theme .select-icon {
  color: var(--text-secondary);
}
</style>