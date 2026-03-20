<template>
  <Card class="measurements-table-card">
    <template #header>
      <div class="table-header">
        <div class="header-left">
          <OhVueIcon name="bi-table" class="header-icon" />
          <h4>{{ t('scientificCalculators.table.header') }}</h4>
        </div>
        <Badge variant="primary" size="small" v-if="values.length > 0">
          n = {{ values.length }}
        </Badge>
      </div>
    </template>

    <div v-if="values.length === 0" class="empty-state">
      <OhVueIcon name="bi-clipboard-data" class="empty-icon" />
      <p>{{ t('scientificCalculators.table.empty') }}</p>
      <Badge variant="info">{{ t('scientificCalculators.table.emptyHint') }}</Badge>
    </div>

    <div v-else class="table-responsive">
      <table class="measurements-table">
        <thead>
          <tr>
            <th>#</th>
            <th>{{ t('scientificCalculators.table.value') }} ({{ unit || '—' }})</th>
            <th>{{ t('scientificCalculators.table.deviation') }} |xᵢ - x̄|</th>
            <th>{{ t('scientificCalculators.table.deviationSquared') }} (xᵢ - x̄)²</th>
            <th class="actions-column">{{ t('scientificCalculators.table.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in computedValues" :key="item.id">
            <td class="index-cell">{{ index + 1 }}</td>
            <td class="value-cell">
              <span class="value">{{ formatNumber(item.value) }}</span>
            </td>
            <td class="deviation-cell">
              <Badge :variant="getDeviationVariant(item.deviation)">
                {{ formatNumber(item.deviation) }}
              </Badge>
            </td>
            <td class="deviation-squared-cell">
              <Badge variant="secondary">
                {{ formatNumber(item.deviationSquared) }}
              </Badge>
            </td>
            <td class="actions-cell">
              <Tooltip :content="t('scientificCalculators.inputs.delete')" position="left">
                <Button
                  variant="danger"
                  size="small"
                  @click="handleRemove(item.id)"
                  class="action-btn"
                >
                  <OhVueIcon name="bi-trash" />
                </Button>
              </Tooltip>
            </td>
          </tr>
        </tbody>
        <tfoot v-if="values.length > 0">
          <tr class="summary-row">
            <td colspan="2" class="summary-label">{{ t('scientificCalculators.table.sum') }}:</td>
            <td class="summary-value">{{ formatNumber(sumDeviations) }}</td>
            <td class="summary-value">{{ formatNumber(sumDeviationsSquared) }}</td>
            <td></td>
          </tr>
          <tr class="summary-row">
            <td colspan="2" class="summary-label">{{ t('scientificCalculators.table.variance') }}:</td>
            <td colspan="2" class="summary-value">
              s² = {{ formatNumber(variance) }} {{ unit }}²
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import Tooltip from '@/components/ui/Tooltip.vue'
import { OhVueIcon } from 'oh-vue-icons'

export interface ValueItem {
  id: string
  value: number
}

interface TableRow extends ValueItem {
  deviation: number
  deviationSquared: number
}

const { t } = useI18n()

const props = defineProps<{
  values: ValueItem[]
  unit: string
  mean: number
  significantFigures: number
}>()

const emit = defineEmits<{
  (e: 'remove', id: string): void
}>()

const computedValues = computed<TableRow[]>(() => {
  return props.values.map(item => {
    const deviation = item.value - props.mean
    return {
      ...item,
      deviation: Math.abs(deviation),
      deviationSquared: deviation * deviation
    }
  })
})

const sumDeviations = computed(() => {
  return computedValues.value.reduce((acc, item) => acc + item.deviation, 0)
})

const sumDeviationsSquared = computed(() => {
  return computedValues.value.reduce((acc, item) => acc + item.deviationSquared, 0)
})

const variance = computed(() => {
  if (props.values.length < 2) return 0
  return sumDeviationsSquared.value / (props.values.length - 1)
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

const getDeviationVariant = (deviation: number): string => {
  if (deviation === 0) return 'success'
  if (deviation < props.mean * 0.1) return 'info'
  if (deviation < props.mean * 0.2) return 'warning'
  return 'error'
}

const handleRemove = (id: string) => {
  emit('remove', id)
}
</script>

<style scoped>
.measurements-table-card {
  background: var(--surface-primary);
  border: 2px solid var(--border);
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-icon {
  color: var(--primary);
  font-size: 1.2rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
  background: var(--inner-surface);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.empty-icon {
  font-size: 3rem;
  color: var(--border-strong);
  opacity: 0.5;
}

.table-responsive {
  overflow-x: auto;
  margin: 0.5rem 0;
}

.measurements-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Comfortaa', sans-serif;
  font-size: 0.9rem;
  background: var(--surface-primary);
  border-radius: 8px;
  overflow: hidden;
}

.measurements-table thead tr {
  background: var(--sky-blue-surface);
  border-bottom: 2px solid var(--border-secondary);
}

.measurements-table th {
  padding: 0.75rem 0.5rem;
  font-family: 'Shantell Sans', cursive;
  font-weight: 600;
  color: var(--title-secondary);
  text-align: left;
  white-space: nowrap;
}

.measurements-table td {
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid var(--border);
  color: var(--text-primary);
  vertical-align: middle;
}

.measurements-table tbody tr:hover {
  background: var(--inner-surface);
}

.index-cell {
  font-weight: 600;
  color: var(--title-secondary);
  width: 50px;
  text-align: center;
}

.value-cell .value {
  font-weight: 600;
  color: var(--primary);
}

.deviation-cell,
.deviation-squared-cell {
  text-align: center;
}

.actions-column {
  width: 80px;
  text-align: center;
}

.actions-cell {
  text-align: center;
}

.action-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.summary-row {
  background: var(--rose-surface);
  font-weight: 600;
}

.summary-label {
  text-align: right;
  color: var(--title-primary);
  padding-right: 1rem;
}

.summary-value {
  color: var(--text-primary);
  font-family: 'Courier New', monospace;
}

@media (max-width: 768px) {
  .measurements-table {
    font-size: 0.8rem;
  }

  .measurements-table th,
  .measurements-table td {
    padding: 0.5rem 0.25rem;
  }

  .index-cell {
    width: 30px;
  }

  .actions-column {
    width: 50px;
  }
}
</style>