<template>
  <div class="results-cards">
    <div v-if="values.length < 2" class="min-values-message">
      <Alert type="warning" :dismissible="false">
        <OhVueIcon name="bi-exclamation-triangle" class="alert-icon" />
        {{ t('scientificCalculators.messages.minValues') }}
      </Alert>
    </div>

    <div v-else class="cards-grid">
      <!-- Mean Card -->
      <Card class="result-card">
        <template #header>
          <div class="result-header">
            <OhVueIcon name="bi-calculator" class="card-icon" />
            <h5 class="result-title">{{ t('scientificCalculators.results.probableMean.label') }}</h5>
            <Tooltip :content="t('scientificCalculators.results.probableMean.tooltip')" position="top">
              <OhVueIcon name="bi-question-circle" class="help-icon" />
            </Tooltip>
          </div>
        </template>

        <div class="result-content">
          <div class="result-value primary">
            {{ formatNumber(mean) }}
            <span v-if="unit" class="unit">{{ unit }}</span>
          </div>
          <div class="formula">
            <Badge variant="secondary" size="small">x̄ = Σxᵢ/n</Badge>
          </div>
          <div class="calculation-detail">
            <span>Σxᵢ = {{ formatNumber(sum) }} {{ unit }}</span>
            <span>n = {{ values.length }}</span>
          </div>
        </div>
      </Card>

      <!-- MAD Card -->
      <Card class="result-card">
        <template #header>
          <div class="result-header">
            <OhVueIcon name="bi-arrow-left-right" class="card-icon" />
            <h5 class="result-title">{{ t('scientificCalculators.results.meanAbsoluteDeviation.label') }}</h5>
            <Tooltip :content="t('scientificCalculators.results.meanAbsoluteDeviation.tooltip')" position="top">
              <OhVueIcon name="bi-question-circle" class="help-icon" />
            </Tooltip>
          </div>
        </template>

        <div class="result-content">
          <div class="result-value secondary">
            ±{{ formatNumber(meanAbsoluteDeviation) }}
            <span v-if="unit" class="unit">{{ unit }}</span>
          </div>
          <div class="formula">
            <Badge variant="secondary" size="small">Δx = Σ|xᵢ - x̄|/n</Badge>
          </div>
          <div class="calculation-detail">
            <span>Σ|xᵢ - x̄| = {{ formatNumber(sumDeviations) }} {{ unit }}</span>
          </div>
        </div>
      </Card>

      <!-- Standard Deviation Card -->
      <Card class="result-card">
        <template #header>
          <div class="result-header">
            <OhVueIcon name="bi-bar-chart" class="card-icon" />
            <h5 class="result-title">{{ t('scientificCalculators.results.standardDeviation.label') }}</h5>
            <Tooltip :content="t('scientificCalculators.results.standardDeviation.tooltip')" position="top">
              <OhVueIcon name="bi-question-circle" class="help-icon" />
            </Tooltip>
          </div>
        </template>

        <div class="result-content">
          <div class="result-value accent">
            ±{{ formatNumber(standardDeviation) }}
            <span v-if="unit" class="unit">{{ unit }}</span>
          </div>
          <div class="formula">
            <Badge variant="secondary" size="small">σ = √[Σ(xᵢ - x̄)²/(n-1)]</Badge>
          </div>
          <div class="calculation-detail">
            <span>Σ(xᵢ - x̄)² = {{ formatNumber(sumDeviationsSquared) }} {{ unit }}²</span>
          </div>
        </div>
      </Card>

      <!-- Relative Uncertainty Card -->
      <Card class="result-card">
        <template #header>
          <div class="result-header">
            <OhVueIcon name="bi-percent" class="card-icon" />
            <h5 class="result-title">{{ t('scientificCalculators.results.relativeUncertainty.label') }}</h5>
            <Tooltip :content="t('scientificCalculators.results.relativeUncertainty.tooltip')" position="top">
              <OhVueIcon name="bi-question-circle" class="help-icon" />
            </Tooltip>
          </div>
        </template>

        <div class="result-content">
          <div class="result-value accent">
            {{ formatNumber(relativeUncertainty) }}%
          </div>
          <div class="formula">
            <Badge variant="secondary" size="small">εᵣ = (Δx/|x̄|) × 100%</Badge>
          </div>
        </div>
      </Card>

      <!-- Final Result Card -->
      <Card class="result-card highlight result-card-full">
        <template #header>
          <div class="result-header">
            <OhVueIcon name="bi-check-circle" class="card-icon" />
            <h5 class="result-title">{{ t('scientificCalculators.results.finalResult.label') }}</h5>
            <Tooltip :content="t('scientificCalculators.results.finalResult.tooltip')" position="top">
              <OhVueIcon name="bi-question-circle" class="help-icon" />
            </Tooltip>
          </div>
        </template>

        <div class="result-content">
          <div class="final-value-display">
            <span class="final-value">{{ formatNumber(mean) }}</span>
            <span class="final-plusminus"> ± </span>
            <span class="final-uncertainty">{{ formatNumber(meanAbsoluteDeviation) }}</span>
            <span v-if="unit" class="final-unit">{{ unit }}</span>
          </div>
          <div class="formula">
            <Badge variant="secondary" size="small">x = x̄ ± Δx</Badge>
          </div>
          <div class="calculation-detail">
            <span>{{ t('scientificCalculators.results.significantFigures') }}: {{ significantFigures }}</span>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import Tooltip from '@/components/ui/Tooltip.vue'
import Alert from '@/components/ui/Alert.vue'
import { OhVueIcon } from 'oh-vue-icons'

export interface ValueItem {
  id: string
  value: number
}

const { t } = useI18n()

const props = defineProps<{
  values: ValueItem[]
  unit: string
  mean: number
  meanAbsoluteDeviation: number
  meanPercentageDeviation: number
  significantFigures: number
}>()

const sum = computed(() => {
  return props.values.reduce((acc, item) => acc + item.value, 0)
})

const sumDeviations = computed(() => {
  return props.values.reduce((acc, item) => acc + Math.abs(item.value - props.mean), 0)
})

const sumDeviationsSquared = computed(() => {
  return props.values.reduce((acc, item) => {
    const dev = item.value - props.mean
    return acc + (dev * dev)
  }, 0)
})

const variance = computed(() => {
  if (props.values.length < 2) return 0
  return sumDeviationsSquared.value / (props.values.length - 1)
})

const standardDeviation = computed(() => {
  return Math.sqrt(variance.value)
})

const relativeUncertainty = computed(() => {
  if (props.mean === 0) return 0
  return (props.meanAbsoluteDeviation / Math.abs(props.mean)) * 100
})

const formatNumber = (num: number): string => {
  if (num === 0) return '0'
  if (isNaN(num) || !isFinite(num)) return '—'

  try {
    if (props.significantFigures > 0 && num !== 0) {
      return num.toPrecision(props.significantFigures)
    }

    if (Math.abs(num) < 0.001 || Math.abs(num) > 10000) {
      return num.toExponential(3)
    }
    return num.toFixed(4).replace(/\.?0+$/, '')
  } catch {
    return num.toString()
  }
}
</script>

<style scoped>
.results-cards {
  margin: 1rem 0;
}

.min-values-message {
  margin-bottom: 1rem;
}

.alert-icon {
  margin-right: 0.5rem;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.result-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 2px solid var(--border);
  background: var(--surface-primary);
}

.result-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px var(--shadow-hover);
}

.result-card-full {
  grid-column: 1 / -1;
}

.result-card.highlight {
  border-color: var(--primary);
  background: var(--sky-blue-surface);
}

.result-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  flex-wrap: wrap;
}

.card-icon {
  color: var(--primary);
  font-size: 1.2rem;
}

.result-title {
  margin: 0;
  color: var(--title-primary);
  font-size: 1rem;
  flex: 1;
}

.help-icon {
  color: var(--text-secondary);
  cursor: help;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.help-icon:hover {
  color: var(--primary);
}

.result-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.result-value {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  line-height: 1.2;
}

.result-value.primary {
  color: var(--primary);
}

.result-value.secondary {
  color: var(--secondary);
}

.result-value.accent {
  color: var(--green);
}

.unit {
  font-size: 0.6em;
  color: var(--text-secondary);
  margin-left: 0.25rem;
}

.formula {
  display: flex;
  justify-content: center;
}

.calculation-detail {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: var(--inner-surface);
  border-radius: 6px;
  font-size: 0.85rem;
  color: var(--text-secondary);
  flex-wrap: wrap;
  gap: 0.5rem;
}

.final-value-display {
  text-align: center;
  font-size: 2.2rem;
  font-weight: 700;
  line-height: 1.3;
  word-break: break-word;
}

.final-value {
  color: var(--primary);
}

.final-plusminus {
  color: var(--title-primary);
  font-weight: 400;
}

.final-uncertainty {
  color: var(--secondary);
}

.final-unit {
  font-size: 0.6em;
  color: var(--text-secondary);
  margin-left: 0.25rem;
}

@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }

  .result-value {
    font-size: 1.6rem;
  }

  .final-value-display {
    font-size: 1.8rem;
  }

  .calculation-detail {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .result-header {
    flex-wrap: wrap;
    justify-content: center;
  }

  .result-value {
    font-size: 1.4rem;
  }

  .final-value-display {
    font-size: 1.5rem;
  }
}
</style>