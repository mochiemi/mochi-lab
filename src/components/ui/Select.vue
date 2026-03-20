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
  gap: 0.5em;
}

.select-label {
  font-weight: 700;
  font-size: 0.9em;
  color: var(--text-primary);
  line-height: 1.2; /* Mesma altura de linha do input-label */
  margin-bottom: 0.5em; /* Mesmo margin-bottom do input-label */
}

.required {
  color: var(--strong-rose);
}

.select-container {
  position: relative;
  display: inline-block;
  width: 100%;
}

.select {
  width: 100%;
  padding: 0.75em 2.5em 0.75em 1em; 
  border: 2px solid var(--border);
  border-radius: 8px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'Comfortaa', sans-serif;
  font-size: 1em;
  line-height: 1.5; 
  height: calc(1.5em + 1.5em);
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  box-sizing: border-box; 
}

select:open {
  background-color: var(--bg-primary);
}
 
.select-icon {
  position: absolute;
  right: 0.75em;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--secondary);
  font-size: 1em;
  line-height: 1; 
}

.select:focus {
  outline: none;
  border-color: var(--sky-blue);
  box-shadow: 0 0 0 3px rgba(42, 157, 143, 0.1);
}

.select:disabled {
  background: var(--disabled-surface);
  color: var(--text-disabled);
  cursor: not-allowed;
  opacity: 0.6;
}

.select.selected:not(:disabled, .error) {
  border-color: var(--primary);
  background-color: var(--bg-primary);
}

.select.error {
  border-color: var(--orange);
  background-color: var(--bg-primary);
}

.select.error:focus {
  border-color: var(--orange);
  color: var(--orange);
  background-color: var(--bg-primary);
  box-shadow: 0 0 0 3px rgba(218, 110, 133, 0.1);
}

.select.error:open {
  background-color: var(--bg-primary);
  border-color: var(--orange);
}

.error-message {
  font-size: 0.9em;
  color: var(--orange);
  margin-top: 0.25em;
}

</style>