<template>
  <label :class="['radio', { 'radio-disabled': disabled }]">
    <input
      type="radio"
      :checked="modelValue === value"
      :value="value"
      :disabled="disabled"
      @change="handleChange"
      class="radio-input"
    />
    <span :class="['radio-custom', { 'radio-checked': modelValue === value }]">
      <span class="radio-dot"></span>
    </span>
    <span class="radio-label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup>

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: ''
  },
  value: {
    type: [String, Number, Boolean],
    required: true
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
    emit('update:modelValue', props.value)
    emit('change', props.value)
  }
}
</script>

<style scoped>
.radio {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-family: 'Quicksand', sans-serif;
  font-weight: 500;
  color: var(--text-primary);
  user-select: none;
}

.radio-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.radio-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.radio-custom {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  background: var(--surface);
  flex-shrink: 0;
}

.radio-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: transparent;
  transition: all 0.2s ease;
}

.radio-checked {
  border-color: var(--primary);
  background: var(--surface-contrast);
}

.radio-checked .radio-dot {
  background: var(--secondary);
}

.radio:not(.radio-disabled):hover .radio-custom:not(.radio-checked) {
  border-color: var(--secondary);
  background: var(--turquoise-10);
}

.radio-label {
  line-height: 1.4;
}
</style>