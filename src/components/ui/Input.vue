<template>
  <div class="input-wrapper">
    <label v-if="label" :for="id" class="input-label">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="['base-input', { 
        'input-error': error, 
        'input-success': success,
        'input-disabled': disabled 
      }]"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <div v-if="error" class="input-error-message">{{ error }}</div>
    <div v-if="success" class="input-success-message">{{ success }}</div>
  </div>
</template>

<script setup>

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'password', 'email', 'number', 'tel', 'url'].includes(value)
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  success: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  id: {
    type: String,
    default: () => `input-${Math.random().toString(36).substr(2, 9)}`
  }
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'input'])

const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
  emit('input', event)
}

const handleFocus = (event) => {
  emit('focus', event)
}

const handleBlur = (event) => {
  emit('blur', event)
}
</script>

<style scoped>
.input-wrapper {
  margin-bottom: 1rem;
  text-align: left;
}

.input-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 700;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.base-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  font-family: 'Quicksand', sans-serif;
  font-size: 1rem;
  background-color: var(--surface);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.base-input:focus {
  outline: none;
  border-color: var(--turquoise-40);
  background-color: var(--surface-contrast);
  box-shadow: 0 0 0 3px rgba(42, 157, 143, 0.1);
}

.base-input::placeholder {
  color: var(--gray-40);
}

.input-error {
  border-color: var(--rose-50);
  background-color: var(--bg-secondary);
}

.input-error:focus {
  border-color: var(--rose-50);
  box-shadow: 0 0 0 3px rgba(228, 89, 136, 0.1);
}

.input-success {
  border-color: var(--clovergreen);
}

.input-success:focus {
  border-color: var(--clovergreen);
  box-shadow: 0 0 0 3px rgba(28, 148, 102, 0.1);
}

.input-disabled {
  background: var(--inner-surface);
  cursor: not-allowed;
}

.input-error-message {
  margin-top: 0.5rem;
  color: var(--rose-50);
  font-size: 0.9rem;
  font-weight: 700;
}

.input-success-message {
  margin-top: 0.5rem;
  color: var(--clovergreen);
  font-size: 0.9rem;
  font-weight: 700;

}
</style>