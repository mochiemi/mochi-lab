<template>
  <Card class="measurement-input-card">
    <template #header>
      <div class="input-header">
        <OhVueIcon name="bi-input-cursor" class="header-icon" />
        <h3>{{ t('scientificCalculators.inputs.title') }}</h3>
      </div>
    </template>
    
    <div class="measurement-input">
      <div class="input-row">
        <div class="input-group">
          <label>{{ t('scientificCalculators.inputs.value') }}</label>
          <Input 
            v-model.number="localValue"
            type="number"
            step="any"
            :placeholder="t('scientificCalculators.inputs.valuePlaceholder')"
            :error="inputError"
            @keyup.enter="handleAdd"
          />
        </div>
        
        <div class="unit-group">
          <label>{{ t('scientificCalculators.inputs.unit') }}</label>
          <Input 
            v-model="localUnit"
            type="text"
            :placeholder="t('scientificCalculators.inputs.selectUnit')"
          />
        </div>
        
        <div class="sig-figs-group">
          <label>{{ t('scientificCalculators.inputs.significantFigures') }}</label>
          <Input 
            v-model.number="localSigFigs"
            type="number"
            :min="1"
            :max="15"
            :step="1"
          />
        </div>
      </div>
      
      <div v-if="instrumentPrecision" class="precision-info">
        <Badge variant="info" size="small">
          <OhVueIcon name="la-ruler-solid" class="badge-icon" />
          {{ t('scientificCalculators.inputs.precision') }}: ±{{ formatPrecision(instrumentPrecision) }}
        </Badge>
      </div>
      
      <div class="button-group">
        <Button 
          variant="primary" 
          @click="handleAdd"
          :disabled="!isValidInput"
        >
          <OhVueIcon name="fa-plus" />
          {{ t('scientificCalculators.actions.add') }}
        </Button>
        
        <Button 
          variant="secondary" 
          @click="handleClearAll"
        >
          <OhVueIcon name="hi-trash" />
          {{ t('scientificCalculators.actions.clearAll') }}
        </Button>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import { OhVueIcon } from 'oh-vue-icons'
import type { UnitOption } from '@/types/scientific'

const { t } = useI18n()

const props = defineProps<{
  value: number | null
  unit: string
  significantFigures: number
  inputError?: string
  unitOptions: UnitOption[]
  instrumentPrecision?: number | string | null
}>()

const emit = defineEmits<{
  (e: 'update:value', value: number | null): void
  (e: 'update:unit', value: string): void
  (e: 'update:significantFigures', value: number): void
  (e: 'add'): void
  (e: 'clear-all'): void
}>()

const localValue = ref<number | null>(props.value)
const localUnit = ref<string>(props.unit)
const localSigFigs = ref<number>(props.significantFigures)

watch(() => props.value, (newVal) => {
  localValue.value = newVal
})

watch(() => props.unit, (newVal) => {
  localUnit.value = newVal
})

watch(() => props.significantFigures, (newVal) => {
  localSigFigs.value = newVal
})

watch(localValue, (newVal) => {
  emit('update:value', newVal)
})

watch(localUnit, (newVal) => {
  emit('update:unit', newVal)
})

watch(localSigFigs, (newVal) => {
  if (newVal !== null && newVal !== undefined) {
    if (newVal < 1) {
      localSigFigs.value = 1
    } else if (newVal > 15) {
      localSigFigs.value = 15
    }
    emit('update:significantFigures', localSigFigs.value)
  }
})

const isValidInput = computed(() => {
  return localValue.value !== null && !isNaN(localValue.value) && localValue.value !== undefined
})

const handleAdd = () => {
  if (isValidInput.value) {
    emit('add')
  }
}

const handleClearAll = () => {
  emit('clear-all')
}

const formatPrecision = (value: number | string): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return String(value)
  return num.toPrecision(2)
}
</script>

<style scoped>
.measurement-input-card {
  background: var(--surface-primary);
  border: 2px solid var(--border-secondary);
}

.input-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-icon {
  color: var(--primary);
  font-size: 1.4rem;
}

.measurement-input {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: flex-end;
}

.input-group,
.unit-group,
.sig-figs-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group {
  flex: 2;
  min-width: 200px;
}

.unit-group,
.sig-figs-group {
  flex: 1;
  min-width: 150px;
}

label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.precision-info {
  display: flex;
  justify-content: center;
  margin-top: -0.5rem;
}

.badge-icon {
  margin-right: 0.25rem;
}

.button-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input {
  appearance: none;
}

@media (max-width: 768px) {
  .input-row {
    flex-direction: column;
    gap: 1rem;
  }

  .input-group,
  .unit-group,
  .sig-figs-group {
    min-width: 100%;
  }

  .button-group {
    flex-direction: column;
  }

  .button-group .btn {
    width: 100%;
  }
}
</style>