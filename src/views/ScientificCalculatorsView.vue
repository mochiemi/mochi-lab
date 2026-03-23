<template>
  <div class="scientific-calculators-view">
    <div class="container">
      <div class="page-header">
        <Card class="header-card" :flat="true">
          <div class="header-content">
            <div class="title-wrapper">
              <OhVueIcon name="gi-erlenmeyer" class="title-icon-left" />
              <h1 class="page-title">{{ t('scientificCalculators.title') }}</h1>
              <OhVueIcon name="bi-eyedropper" class="title-icon-right" />
            </div>
            <p class="page-subtitle">{{ t('scientificCalculators.subtitle') }}</p>
            <p class="page-description">{{ t('scientificCalculators.description') }}</p>
          </div>
        </Card>
      </div>

      <div class="calculator-tabs-section">
        <Tabs v-model="activeTab" :tabs="calculatorTabs" variant="square">
          <template #tab-0>
            <UnifiedExplanationSection />
          </template>

          <template #tab-1>
            <ApostilaCalculator 
              :unit-options="unitOptions"
              @show-notification="showNotification"
            />
          </template>

          <template #tab-2>
            <TraditionalCalculator 
              :unit-options="unitOptions"
              @show-notification="showNotification"
            />
          </template>
        </Tabs>
      </div>
    </div>

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
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { OhVueIcon } from 'oh-vue-icons'
import Card from '@/components/ui/Card.vue'
import Toast from '@/components/ui/Toast.vue'
import Tabs from '@/components/ui/Tabs.vue'

import TraditionalCalculator from '@/components/scientific/calculators/TraditionalCalculator.vue'
import ApostilaCalculator from '@/components/scientific/calculators/ApostilaCalculator.vue'
import UnifiedExplanationSection from '@/components/scientific/shared/UnifiedExplanationSection.vue'
import type { UnitOption } from '@/types/scientific'

const { t } = useI18n()

const activeTab = ref(0)
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error' | 'info' | 'warning'>('success')

const unitOptions: UnitOption[] = [
  { value: 'mm', label: 'Milímetros (mm)', symbol: 'mm' },
  { value: 'cm', label: 'Centímetros (cm)', symbol: 'cm' },
  { value: 'm', label: 'Metros (m)', symbol: 'm' },
  { value: 'g', label: 'Gramas (g)', symbol: 'g' },
  { value: 'kg', label: 'Quilogramas (kg)', symbol: 'kg' },
  { value: 's', label: 'Segundos (s)', symbol: 's' },
  { value: '°C', label: 'Graus Celsius (°C)', symbol: '°C' }
]

const calculatorTabs = [
  {
    label: t('scientificCalculators.tabs.theory'),
    icon: 'fa-book'
  },
  {
    label: t('scientificCalculators.tabs.apostila'),
    icon: 'gi-erlenmeyer'
  },
  {
    label: t('scientificCalculators.tabs.traditional'),
    icon: 'bi-calculator'
  }
]

const toastIcon = computed(() => {
  switch (toastType.value) {
    case 'success': return 'bi-check-circle-fill'
    case 'error': return 'bi-exclamation-triangle-fill'
    case 'warning': return 'bi-exclamation-circle-fill'
    default: return 'bi-info-circle-fill'
  }
})

const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
}
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

.calculator-tabs-section {
  margin-top: 0.5rem;
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