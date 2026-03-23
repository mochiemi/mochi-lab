<template>
  <div class="results-cards">
    <div v-if="values.length < 1" class="min-values-message">
      <Alert type="warning" :dismissible="false">
        <OhVueIcon name="bi-exclamation-triangle" class="alert-icon" />
        {{ t('scientificCalculators.messages.minValuesApostila') }}
      </Alert>
    </div>

    <div v-else class="cards-grid">
      <!-- Mean Card -->
      <Card class="result-card">
        <template #header>
          <div class="result-header">
            <OhVueIcon name="bi-calculator" class="card-icon" />
            <h5 class="result-title">{{ t('scientificCalculators.apostila.mean.label') }}</h5>
            <Tooltip :content="t('scientificCalculators.results.probableMean.tooltip')" position="top">
              <OhVueIcon name="oi-question" class="help-icon" />
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
            <span>Σxᵢ = {{ formatNumber(computedSum) }} {{ unit }}</span>
            <span>n = {{ values.length }}</span>
          </div>
        </div>
      </Card>

      <!-- Mean Absolute Deviation Card -->
      <Card class="result-card">
        <template #header>
          <div class="result-header">
            <OhVueIcon name="bi-arrow-left-right" class="card-icon" />
            <h5 class="result-title">{{ t('scientificCalculators.apostila.deviation.label') }}</h5>
            <Tooltip :content="t('scientificCalculators.results.meanAbsoluteDeviation.tooltip')" position="top">
              <OhVueIcon name="oi-question" class="help-icon" />
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
            <span>Σ|xᵢ - x̄| = {{ formatNumber(computedSumDeviations) }} {{ unit }}</span>
          </div>
        </div>
      </Card>

      <!-- Final Result Card -->
      <Card class="result-card highlight result-card-full">
        <template #header>
          <div class="result-header">
            <OhVueIcon name="bi-check-circle" class="card-icon" />
            <h5 class="result-title">{{ t('scientificCalculators.apostila.finalResult.label') }}</h5>
            <Tooltip :content="t('scientificCalculators.results.finalResult.tooltip')" position="top">
              <OhVueIcon name="oi-question" class="help-icon" />
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
import type { ValueItem } from '@/types/scientific'
import { formatNumber as formatNumberUtil } from '../utils/statistics'

const { t } = useI18n()

const props = defineProps<{
  values: ValueItem[]
  unit: string
  mean: number
  meanAbsoluteDeviation: number
  meanPercentageDeviation: number
  significantFigures: number
  standardDeviation?: number
  relativeUncertainty?: number
  minValue?: number
  maxValue?: number
  range?: number
  median?: number
}>()

const computedSum = computed(() => {
  return props.values.reduce((acc, item) => acc + item.value, 0)
})

const computedSumDeviations = computed(() => {
  return props.values.reduce((acc, item) => acc + Math.abs(item.value - props.mean), 0)
})

const formatNumber = (num: number): string => {
  if (num === undefined || num === null || isNaN(num)) return '0'
  return formatNumberUtil(num, props.significantFigures)
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
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow);
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
</style>