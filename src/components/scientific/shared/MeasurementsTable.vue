<template>
  <Card class="measurements-table-card">
    <template #header>
      <div class="table-header">
        <OhVueIcon name="bi-table" class="header-icon" />
        <h4>{{ t('scientificCalculators.table.title') }}</h4>
        <Badge variant="primary" size="small">
          {{ t('scientificCalculators.table.count', { count: values.length }) }}
        </Badge>
      </div>
    </template>

    <div class="table-responsive">
      <table class="measurements-table">
        <thead>
          <tr>
            <th>#</th>
            <th>{{ t('scientificCalculators.table.value') }}</th>
            <th>{{ t('scientificCalculators.table.unit') }}</th>
            <th>{{ t('scientificCalculators.table.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in values" :key="item.id">
            <td>{{ index + 1 }}</td>
            <td class="value-cell">{{ formatNumber(item.value) }}</td>
            <td>{{ unit }}</td>
            <td>
              <Button
                variant="danger"
                size="small"
                @click="handleRemove(item.id)"
              >
                <OhVueIcon name="hi-trash" />
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="table-footer" v-if="values.length > 0">
      <div class="stat-badge">
        <Badge variant="info" size="small">
          {{ t('scientificCalculators.table.mean') }}: {{ formatNumber(mean) }} {{ unit }}
        </Badge>
        <Badge variant="secondary" size="small" v-if="standardDeviation">
          {{ t('scientificCalculators.table.stdDev') }}: ±{{ formatNumber(standardDeviation) }} {{ unit }}
        </Badge>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import { OhVueIcon } from 'oh-vue-icons'
import type { ValueItem } from '@/types/scientific'
import { formatNumber as formatNumberUtil } from '../utils/statistics'

const { t } = useI18n()

const props = defineProps<{
  values: ValueItem[]
  unit: string
  mean: number
  standardDeviation?: number
  significantFigures: number
}>()

const emit = defineEmits<{
  (e: 'remove', id: string): void
}>()

const formatNumber = (num: number): string => {
  return formatNumberUtil(num, props.significantFigures)
}

const handleRemove = (id: string) => {
  emit('remove', id)
}
</script>

<style scoped>
.measurements-table-card {
  background: var(--surface-primary);
  border: 2px solid var(--border-secondary);
}

.table-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.header-icon {
  color: var(--primary);
  font-size: 1.2rem;
}

.table-responsive {
  overflow-x: auto;
}

.measurements-table {
  width: 100%;
  border-collapse: collapse;
}

.measurements-table th,
.measurements-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--border);
}

.measurements-table th {
  background: var(--inner-surface);
  font-weight: 600;
  color: var(--title-secondary);
}

.value-cell {
  font-family: monospace;
  font-weight: 500;
}

.table-footer {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .measurements-table th,
  .measurements-table td {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
}
</style>