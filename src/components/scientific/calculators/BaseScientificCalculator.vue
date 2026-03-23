<template>
  <div class="base-scientific-calculator">
    <MeasurementInput
      v-model:value="inputValue"
      v-model:unit="unit"
      v-model:significantFigures="significantFigures"
      :input-error="inputError"
      :unit-options="unitOptions"
      :instrument-precision="instrumentPrecision"
      @add="addValue"
      @clear-all="clearAll"
    />

    <MeasurementsTable
      v-if="values.length > 0"
      :values="values"
      :unit="unit"
      :mean="statistics.mean"
      :standard-deviation="statistics.standardDeviation"
      :significant-figures="significantFigures"
      @remove="removeValue"
    />

    <div v-if="values.length >= minMeasurements" class="results-section">
      <slot name="results" :statistics="statistics" :unit="unit" :values="values" />
    </div>

    <div v-if="values.length >= minMeasurements" class="stats-section">
      <StatisticsSummary
        :values="values"
        :unit="unit"
        :mean="statistics.mean"
        :significant-figures="significantFigures"
      />
    </div>

    <div class="explanation-section">
      <slot name="explanation" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import MeasurementInput from '@/components/scientific/shared/MeasurementInput.vue'
import MeasurementsTable from '@/components/scientific/shared/MeasurementsTable.vue'
import StatisticsSummary from '@/components/scientific/shared/StatisticsSummary.vue'
import type { ValueItem, UnitOption, Statistics } from '@/types/scientific'
import { calculateStatistics, generateId } from '../utils/statistics'

const { t } = useI18n()

const props = defineProps({
  unitOptions: {
    type: Array as PropType<UnitOption[]>,
    default: () => []
  },
  minMeasurements: {
    type: Number,
    default: 2
  },
  showSaveLoad: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  (e: 'show-notification', message: string, type: 'success' | 'error' | 'info' | 'warning'): void
}>()

// State
const values = ref<ValueItem[]>([])
const inputValue = ref<number | null>(null)
const inputError = ref('')
const unit = ref('')
const significantFigures = ref(4)

// Computed
const isValidInput = computed(() => {
  return inputValue.value !== null && !isNaN(inputValue.value) && inputValue.value !== undefined
})

const statistics = computed<Statistics>(() => {
  return calculateStatistics(values.value, significantFigures.value)
})

const instrumentPrecision = computed<number | null>(() => {
  if (values.value.length < 2) return null
  
  const sorted = [...values.value].map(v => v.value).sort((a, b) => a - b)
  let minDiff = Infinity
  
  for (let i = 1; i < sorted.length; i++) {
    const val1 = sorted[i-1]
    const val2 = sorted[i]
    if (val1 !== undefined && val2 !== undefined) {
      const diff = Math.abs(val2 - val1)
      if (diff > 0 && diff < minDiff) {
        minDiff = diff
      }
    }
  }
  
  return minDiff !== Infinity ? Number((minDiff / 2).toPrecision(2)) : null
})

// Methods
const addValue = () => {
  if (!isValidInput.value || inputValue.value === null) {
    inputError.value = t('scientificCalculators.messages.invalidValue')
    emit('show-notification', t('scientificCalculators.messages.invalidValue'), 'error')
    return
  }

  if (!unit.value) {
    emit('show-notification', t('scientificCalculators.messages.selectUnit'), 'warning')
    return
  }

  const newValue: ValueItem = {
    id: generateId(),
    value: inputValue.value
  }

  values.value.push(newValue)
  inputValue.value = null
  inputError.value = ''
  emit('show-notification', t('scientificCalculators.messages.valueAdded'), 'success')
}

const removeValue = (id: string) => {
  const index = values.value.findIndex(item => item.id === id)
  if (index !== -1) {
    values.value.splice(index, 1)
    emit('show-notification', t('scientificCalculators.messages.valueRemoved'), 'info')
  }
}

const clearAll = () => {
  if (values.value.length > 0) {
    if (confirm(t('scientificCalculators.messages.confirmClearAll'))) {
      values.value = []
      unit.value = ''
      emit('show-notification', t('scientificCalculators.messages.allCleared'), 'info')
    }
  }
}

defineExpose({
  values,
  unit,
  significantFigures,
  statistics
})
</script>

<style scoped>
.base-scientific-calculator {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.results-section {
  margin: 0.5rem 0;
}

.stats-section {
  margin-top: 0.5rem;
}

.explanation-section {
  margin-top: 1rem;
}
</style>