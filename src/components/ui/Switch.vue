<template>
  <label :class="['switch', { 'switch-disabled': disabled }]">
    <input
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @change="handleChange"
      class="switch-input"
    />
    <span :class="['switch-slider', { 'switch-checked': modelValue }]">
      <span class="switch-thumb"></span>
    </span>
    <span v-if="$slots.default || label" class="switch-label">
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
.switch {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-family: 'Quicksand', sans-serif;
  font-weight: 500;
  color: var(--text-primary);
  user-select: none;
}

.switch-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.switch-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.switch-slider {
  width: 44px;
  height: 24px;
  background: var(--border);
  border-radius: 17px;
  position: relative;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.switch-thumb {
  width: 17px;
  height: 17px;
  background: var(--gray-20);
  border-radius: 50%;
  border: 3px solid var(--white);
  outline: 4px solid var(--rose-60);
  position: absolute;
  top: 4px;
  left: 3px;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.switch-thumb:hover {
  outline-color: var(--accent);
}

.switch-checked {
  background: var(--primary);
}

.switch-checked .switch-thumb {
  transform: translateX(20px);
}

.switch:not(.switch-disabled):hover .switch-slider:not(.switch-checked) {
  background: var(--gray-40);
}

.switch-label {
  line-height: 1.4;
}
</style>