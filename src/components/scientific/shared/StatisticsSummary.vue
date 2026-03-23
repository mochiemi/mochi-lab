<template>
  <Card v-if="values.length >= 2" class="stats-summary-card">
    <template #header>
      <div class="card-header">
        <OhVueIcon name="bi-clipboard-data-fill" class="header-icon" />
        <h4>{{ t('scientificCalculators.statistics.summary') }}</h4>
      </div>
    </template>

    <div class="stats-grid">
      <div class="stat-item">
        <span class="stat-label">{{ t('scientificCalculators.statistics.count') }} (n):</span>
        <Badge variant="primary" size="medium">{{ values.length }}</Badge>
      </div>

      <div class="stat-item">
        <span class="stat-label">{{ t('scientificCalculators.statistics.sum') }} (Σxᵢ):</span>
        <Badge variant="secondary">{{ formatNumber(computedSum) }} {{ unit }}</Badge>
      </div>

      <div class="stat-item">
        <span class="stat-label">{{ t('scientificCalculators.statistics.mean') }} (x̄):</span>
        <Badge variant="primary">{{ formatNumber(mean) }} {{ unit }}</Badge>
      </div>

      <div class="stat-item">
        <span class="stat-label">{{ t('scientificCalculators.statistics.sumOfDeviations') }} (Σ|xᵢ - x̄|):</span>
        <Badge variant="secondary">{{ formatNumber(computedSumOfDeviations) }} {{ unit }}</Badge>
      </div>

      <div class="stat-item">
        <span class="stat-label">{{ t('scientificCalculators.statistics.sumOfSquaredDeviations') }} (Σ(xᵢ - x̄)²):</span>
        <Badge variant="secondary">{{ formatNumber(computedSumOfSquaredDeviations) }} {{ unit }}²</Badge>
      </div>

      <div class="stat-item">
        <span class="stat-label">{{ t('scientificCalculators.statistics.variance') }} (s²):</span>
        <Badge variant="secondary">{{ formatNumber(computedVariance) }} {{ unit }}²</Badge>
      </div>

      <div class="stat-item">
        <span class="stat-label">{{ t('scientificCalculators.statistics.min') }} (xₘᵢₙ):</span>
        <Badge variant="success">{{ formatNumber(computedMinValue) }} {{ unit }}</Badge>
      </div>

      <div class="stat-item">
        <span class="stat-label">{{ t('scientificCalculators.statistics.max') }} (xₘₐₓ):</span>
        <Badge variant="warning">{{ formatNumber(computedMaxValue) }} {{ unit }}</Badge>
      </div>

      <div class="stat-item">
        <span class="stat-label">{{ t('scientificCalculators.statistics.range') }} (R):</span>
        <Badge variant="info">{{ formatNumber(computedRange) }} {{ unit }}</Badge>
      </div>

      <div class="stat-item">
        <span class="stat-label">{{ t('scientificCalculators.statistics.median') }}:</span>
        <Badge variant="secondary">{{ formatNumber(computedMedian) }} {{ unit }}</Badge>
      </div>
    </div>

    <div class="stats-note" v-if="values.length >= 2">
      <Badge variant="info" size="small">
        <OhVueIcon name="oi-info" class="note-icon" />
        {{ t('scientificCalculators.statistics.varianceNote') }}
      </Badge>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
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
  significantFigures: number
}>()

const computedSum = computed<number>(() => {
  return props.values.reduce((acc, item) => acc + item.value, 0)
})

const computedSumOfDeviations = computed<number>(() => {
  return props.values.reduce((acc, item) => acc + Math.abs(item.value - props.mean), 0)
})

const computedSumOfSquaredDeviations = computed<number>(() => {
  return props.values.reduce((acc, item) => {
    const dev = item.value - props.mean
    return acc + (dev * dev)
  }, 0)
})

const computedVariance = computed<number>(() => {
  if (props.values.length < 2) return 0
  return computedSumOfSquaredDeviations.value / (props.values.length - 1)
})

const computedMinValue = computed<number>(() => {
  if (props.values.length === 0) return 0
  return Math.min(...props.values.map(v => v.value))
})

const computedMaxValue = computed<number>(() => {
  if (props.values.length === 0) return 0
  return Math.max(...props.values.map(v => v.value))
})

const computedRange = computed<number>(() => {
  return computedMaxValue.value - computedMinValue.value
})

const computedMedian = computed<number>(() => {
  if (props.values.length === 0) return 0
  
  const sorted = [...props.values].map(v => v.value).sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  
  if (sorted.length % 2 === 0) {
    const val1 = sorted[mid - 1]
    const val2 = sorted[mid]
    if (val1 !== undefined && val2 !== undefined) {
      return (val1 + val2) / 2
    }
    return val1 !== undefined ? val1 : 0
  }
  
  const medianValue = sorted[mid]
  return medianValue !== undefined ? medianValue : 0
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
.stats-summary-card {
  margin-top: 1.5rem;
  background: var(--inner-surface);
  border: 2px solid var(--border);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-icon {
  color: var(--primary);
  font-size: 1.2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background: var(--surface-primary);
  border: 1px solid var(--border);
  border-radius: 6px;
  transition: all 0.2s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px var(--shadow);
}

.stat-label {
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.85rem;
}

.stats-note {
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px dashed var(--border);
}

.note-icon {
  margin-right: 0.25rem;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-item {
    padding: 0.4rem 0.6rem;
  }

  .stat-label {
    font-size: 0.8rem;
  }
}
</style>