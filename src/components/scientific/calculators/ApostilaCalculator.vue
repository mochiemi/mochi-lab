<template>
  <div class="apostila-calculator">
    <div class="section-header">
      <OhVueIcon name="gi-erlenmeyer" class="section-icon" />
      <h3>{{ t('scientificCalculators.apostilaCalculator.title') }}</h3>
      <p>{{ t('scientificCalculators.apostilaCalculator.subtitle') }}</p>
    </div>

    <BaseScientificCalculator 
      :unit-options="unitOptions" 
      :min-measurements="1"
      @show-notification="handleNotification"
    >
      <template #results="{ statistics, unit, values }">
        <ApostilaResultsCards
          :values="values"
          :unit="unit"
          :mean="statistics.mean"
          :mean-absolute-deviation="statistics.meanAbsoluteDeviation"
          :mean-percentage-deviation="statistics.relativeUncertainty"
          :standard-deviation="statistics.standardDeviation"
          :relative-uncertainty="statistics.relativeUncertainty"
          :significant-figures="significantFigures"
          :min-value="statistics.min"
          :max-value="statistics.max"
          :range="statistics.range"
          :median="statistics.median"
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
import ApostilaResultsCards from '../apostila/ResultsCards.vue'
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
.apostila-calculator {
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