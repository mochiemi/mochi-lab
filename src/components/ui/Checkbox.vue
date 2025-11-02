<template>
  <label :class="['checkbox', { 'checkbox-disabled': disabled }]">
    <input
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @change="handleChange"
      class="checkbox-input"
    />
    <span :class="['checkbox-custom', { 'checkbox-checked': modelValue }]">
      <svg v-if="modelValue" width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
    <span class="checkbox-label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup>

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const handleChange = (event) => {
  if (!props.disabled) {
    emit('update:modelValue', event.target.checked)
    emit('change', event.target.checked)
  }
}
</script>

<style scoped>
.checkbox {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-family: 'Quicksand', sans-serif;
  font-weight: 500;
  color: var(--text-primary);
  user-select: none;
}

.checkbox-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border);
  outline: 2px solid transparent;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  background: var(--surface);
  flex-shrink: 0;
}

.checkbox-custom svg {
  color: white;
}

.checkbox-checked {
  background: var(--secondary);
  border-color: var(--surface);
  outline-color: var(--primary);
}

.checkbox:not(.checkbox-disabled):hover .checkbox-custom:not(.checkbox-checked) {
  border-color: var(--primary);
  background: var(--turquoise-10);
}

.checkbox-label {
  line-height: 1.4;
}
</style>