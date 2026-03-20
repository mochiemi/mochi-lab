<template>
  <div class="scientific-calculators-view">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <Card class="header-card" :flat="true">
          <div class="header-content">
            <div class="title-wrapper">
              <OhVueIcon name="bi-flask" class="title-icon-left" />
              <h1 class="page-title">{{ t('scientificCalculators.title') }}</h1>
              <OhVueIcon name="bi-eyedropper" class="title-icon-right" />
            </div>
            <p class="page-subtitle">{{ t('scientificCalculators.subtitle') }}</p>
            <p class="page-description">{{ t('scientificCalculators.description') }}</p>
            
            <div class="lab-reference" v-if="values.length >= 2">
              <Badge variant="info" size="small">
                <OhVueIcon name="bi-book" class="badge-icon" />
                {{ t('scientificCalculators.statistics.varianceNote') }}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      <!-- Input Section -->
      <MeasurementInput
        v-model:value="inputValue"
        v-model:unit="unit"
        v-model:significantFigures="significantFigures"
        :input-error="inputError"
        :unit-options="unitOptions"
        :instrument-precision="instrumentPrecisionValue"
        @add="addValue"
        @clear-all="clearAll"
      />

      <!-- Values Table -->
      <MeasurementsTable
        v-if="values.length > 0"
        :values="values"
        :unit="unit"
        :mean="mean"
        :significant-figures="significantFigures"
        @remove="removeValue"
      />

      <!-- Results Cards -->
      <div v-if="values.length >= 2" class="results-section">
        <ResultsCards
          :values="values"
          :unit="unit"
          :mean="mean"
          :mean-absolute-deviation="meanAbsoluteDeviation"
          :mean-percentage-deviation="meanPercentageDeviation"
          :significant-figures="significantFigures"
        />
      </div>

      <!-- Statistics Summary -->
      <StatisticsSummary
        :values="values"
        :unit="unit"
        :mean="mean"
        :significant-figures="significantFigures"
      />

      <!-- Explanation Section with Accordion -->
      <ExplanationSection :show-references="true" />
    </div>

    <!-- Toast Notifications -->
    <Toast
      v-model="showToast"
      :type="toastType"
      position="bottom-right"
      :dismissible="true"
      :auto-close="3000"
      size="md"
    >
      <div class="toast-content">
        <OhVueIcon :name="toastIcon" class="toast-icon" />
        {{ toastMessage }}
      </div>
    </Toast>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { OhVueIcon } from 'oh-vue-icons'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import Toast from '@/components/ui/Toast.vue'

// Scientific components
import MeasurementInput from '@/components/scientific/MeasurementInput.vue'
import MeasurementsTable from '@/components/scientific/MeasurementsTable.vue'
import ResultsCards from '@/components/scientific/ResultsCards.vue'
import StatisticsSummary from '@/components/scientific/StatisticsSummary.vue'
import ExplanationSection from '@/components/scientific/ExplanationSection.vue'

const { t } = useI18n()

// Types
interface ValueItem {
  id: string
  value: number
}

// State
const values = ref<ValueItem[]>([])
const inputValue = ref<number | null>(null)
const inputError = ref('')
const unit = ref('')
const significantFigures = ref(4)
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error' | 'info' | 'warning'>('success')

// Computed
const isValidInput = computed(() => {
  return inputValue.value !== null && !isNaN(inputValue.value) && inputValue.value !== undefined
})

const mean = computed(() => {
  if (values.value.length === 0) return 0
  const sum = values.value.reduce((acc, item) => acc + item.value, 0)
  return sum / values.value.length
})

const sumOfValues = computed(() => {
  return values.value.reduce((acc, item) => acc + item.value, 0)
})

const sumOfDeviations = computed(() => {
  return values.value.reduce((acc, item) => acc + Math.abs(item.value - mean.value), 0)
})

const sumOfSquaredDeviations = computed(() => {
  return values.value.reduce((acc, item) => {
    const dev = item.value - mean.value
    return acc + (dev * dev)
  }, 0)
})

const meanAbsoluteDeviation = computed(() => {
  if (values.value.length < 2) return 0
  return sumOfDeviations.value / values.value.length
})

const variance = computed(() => {
  if (values.value.length < 2) return 0
  return sumOfSquaredDeviations.value / (values.value.length - 1)
})

const standardDeviation = computed(() => {
  return Math.sqrt(variance.value)
})

const meanPercentageDeviation = computed(() => {
  if (mean.value === 0) return 0
  return (meanAbsoluteDeviation.value / Math.abs(mean.value)) * 100
})

const instrumentPrecision = computed<number | null>(() => {
  // Estimativa baseada na menor diferença entre medições
  if (values.value.length < 2) return null
  
  const sorted = [...values.value].map(v => v.value).sort((a, b) => a - b)
  let minDiff = Infinity
  
  for (let i = 1; i < sorted.length; i++) {
    const val1 = sorted[i-1]
    const val2 = sorted[i]
    // Garantir que os valores existem
    if (val1 !== undefined && val2 !== undefined) {
      const diff = Math.abs(val2 - val1)
      if (diff > 0 && diff < minDiff) {
        minDiff = diff
      }
    }
  }
  
  return minDiff !== Infinity ? Number((minDiff / 2).toPrecision(2)) : null
})

// Propriedade formatada para passar ao componente
const instrumentPrecisionValue = computed<string | number | null | undefined>(() => {
  return instrumentPrecision.value
})

// Unit Options
const unitOptions = [
  { value: '', label: t('scientificCalculators.siUnits.other') },
  { value: 'm', label: t('scientificCalculators.siUnits.meter') },
  { value: 'kg', label: t('scientificCalculators.siUnits.kilogram') },
  { value: 's', label: t('scientificCalculators.siUnits.second') },
  { value: 'K', label: t('scientificCalculators.siUnits.kelvin') },
  { value: 'mol', label: t('scientificCalculators.siUnits.mole') },
  { value: 'cd', label: t('scientificCalculators.siUnits.candela') },
  { value: '°C', label: t('scientificCalculators.siUnits.celsius') }
]

// Methods
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

const addValue = () => {
  if (!isValidInput.value) {
    inputError.value = t('scientificCalculators.messages.invalidValue')
    showNotification(t('scientificCalculators.messages.invalidValue'), 'error', 'bi-exclamation-triangle')
    return
  }

  if (inputValue.value !== null) {
    values.value.push({
      id: generateId(),
      value: inputValue.value
    })
  }

  inputValue.value = null
  inputError.value = ''
  showNotification(t('scientificCalculators.messages.valueAdded'), 'success', 'bi-check-circle')
}

const removeValue = (id: string) => {
  const index = values.value.findIndex(item => item.id === id)
  if (index !== -1) {
    values.value.splice(index, 1)
    showNotification(t('scientificCalculators.messages.valueRemoved'), 'info', 'bi-info-circle')
  }
}

const clearAll = () => {
  values.value = []
  unit.value = ''
  showNotification(t('scientificCalculators.messages.allCleared'), 'info', 'bi-trash')
}

const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', icon: string = 'bi-info-circle') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
}

const toastIcon = computed(() => {
  switch (toastType.value) {
    case 'success': return 'bi-check-circle-fill'
    case 'error': return 'bi-exclamation-triangle-fill'
    case 'warning': return 'bi-exclamation-circle-fill'
    default: return 'bi-info-circle-fill'
  }
})

// Watchers
watch(significantFigures, (newVal) => {
  if (newVal < 1) significantFigures.value = 1
  if (newVal > 15) significantFigures.value = 15
})
</script>

<style scoped>
.scientific-calculators-view {
  max-width: 1400px;
  margin: 2rem auto;
  padding: 1rem;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.page-header {
  margin-bottom: 0.5rem;
}

.header-card {
  background: var(--rose-surface);
  border: 2px dashed var(--border-strong);
  padding: 1.5rem;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
}

.title-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.title-icon-left {
  font-size: 2.5rem;
  color: var(--primary);
  transform: rotate(-10deg);
}

.title-icon-right {
  font-size: 2.5rem;
  color: var(--secondary);
  transform: rotate(10deg);
}

.page-title {
  color: var(--title-primary);
  margin: 0;
  font-size: 2.2rem;
  font-family: 'Gloria Hallelujah', cursive;
}

.page-subtitle {
  font-size: 1.3rem;
  color: var(--title-secondary);
  margin: 0;
  font-weight: 600;
}

.page-description {
  font-size: 1rem;
  color: var(--text-primary);
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
}

.lab-reference {
  margin-top: 0.5rem;
}

.badge-icon {
  margin-right: 0.25rem;
}

.results-section {
  margin: 0.5rem 0;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toast-icon {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .scientific-calculators-view {
    padding: 0.5rem;
  }

  .title-wrapper {
    gap: 0.75rem;
  }

  .title-icon-left,
  .title-icon-right {
    font-size: 1.8rem;
  }

  .page-title {
    font-size: 1.6rem;
  }

  .page-subtitle {
    font-size: 1.1rem;
  }

  .page-description {
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .title-wrapper {
    gap: 0.5rem;
  }

  .title-icon-left,
  .title-icon-right {
    font-size: 1.4rem;
  }

  .page-title {
    font-size: 1.3rem;
  }

  .header-card {
    padding: 1rem;
  }
}
</style>