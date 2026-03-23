<template>
  <div class="traditional-calculator">
    <div class="section-header">
      <OhVueIcon name="bi-calculator" class="section-icon" />
      <h3>{{ t('scientificCalculators.traditionalCalculator.title') }}</h3>
      <p>{{ t('scientificCalculators.traditionalCalculator.subtitle') }}</p>
    </div>

    <BaseScientificCalculator 
      :unit-options="unitOptions" 
      :min-measurements="2"
      @show-notification="handleNotification"
    >
      <template #results="{ statistics, unit, values }">
        <TraditionalResultsCards
          :values="values"
          :unit="unit"
          :mean="statistics.mean"
          :mean-absolute-deviation="statistics.meanAbsoluteDeviation"
          :mean-percentage-deviation="statistics.relativeUncertainty"
          :significant-figures="significantFigures"
          :standard-deviation="statistics.standardDeviation"
          :relative-uncertainty="statistics.relativeUncertainty"
          :sum="statistics.sum"
          :sum-deviations="statistics.sumOfDeviations"
          :sum-deviations-squared="statistics.sumOfSquaredDeviations"
          :variance="statistics.variance"
        />
      </template>

      <template #explanation>
        <UnifiedExplanationSection />
      </template>
    </BaseScientificCalculator>
  </div>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseScientificCalculator from './BaseScientificCalculator.vue'
import TraditionalResultsCards from '../traditional/ResultsCards.vue'
import { OhVueIcon } from 'oh-vue-icons'
import type { UnitOption } from '@/types/scientific'

const { t } = useI18n()

const props = defineProps({
  unitOptions: {
    type: Array as PropType<UnitOption[]>,
    default: () => []
  }
})

const emit = defineEmits<{
  (e: 'show-notification', message: string, type: 'success' | 'error' | 'info' | 'warning'): void
}>()

const significantFigures = ref(4)

const handleNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
  emit('show-notification', message, type)
}
</script>

<style scoped>
.traditional-calculator {
  width: 100%;
}

.section-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.section-icon {
  font-size: 2rem;
  color: var(--primary);
  margin-bottom: 0.5rem;
}

.section-header h3 {
  margin: 0;
  color: var(--title-primary);
  font-size: 1.5rem;
}

.section-header p {
  margin: 0.5rem 0 0;
  color: var(--text-secondary);
  font-style: italic;
}
</style>