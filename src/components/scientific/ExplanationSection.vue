<template>
  <div class="explanation-section">
    <Accordion
      :items="accordionItems"
      variant="primary"
      :multiple="true"
      :bordered="true"
    >
      <template #content="{ item, index }">
        <div class="accordion-content-wrapper">
          <p class="item-content">{{ item.content }}</p>
          <div class="formula-box" v-if="item.formula">
            <code>{{ item.formula }}</code>
          </div>
          <div class="example-box" v-if="item.example">
            <Badge variant="info" size="small">{{ t('scientificCalculators.explanation.example') }}</Badge>
            <p>{{ item.example }}</p>
          </div>
        </div>
      </template>
    </Accordion>

    <Card class="references-card" v-if="showReferences">
      <template #header>
        <div class="references-header">
          <OhVueIcon name="bi-book" class="header-icon" />
          <h4>{{ t('scientificCalculators.explanation.references') }}</h4>
        </div>
      </template>
      <ul class="references-list">
        <li v-for="(ref, index) in references" :key="index">
          {{ ref }}
        </li>
      </ul>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Accordion from '@/components/ui/Accordion.vue'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import { OhVueIcon } from 'oh-vue-icons'

const { t } = useI18n()

interface Props {
  showReferences?: boolean
}

withDefaults(defineProps<Props>(), {
  showReferences: true
})

const accordionItems = [
  {
    id: 'uncertainty',
    title: t('scientificCalculators.explanation.uncertainty.title'),
    icon: 'bi-question-circle',
    content: t('scientificCalculators.explanation.uncertainty.content'),
    formula: 'δx = p/2 = (x_máx - x_mín)/2',
    example: t('scientificCalculators.explanation.uncertainty.example')
  },
  {
    id: 'meanDeviation',
    title: t('scientificCalculators.explanation.meanDeviation.title'),
    icon: 'bi-graph-up',
    content: t('scientificCalculators.explanation.meanDeviation.content'),
    formula: 'DAM = (Σ|xᵢ - x̄|)/n  ou  Δx = (Σ|xᵢ - x̄|)/n',
    example: t('scientificCalculators.explanation.meanDeviation.example')
  },
  {
    id: 'standardDeviation',
    title: t('scientificCalculators.explanation.standardDeviation.title'),
    icon: 'bi-bar-chart',
    content: t('scientificCalculators.explanation.standardDeviation.content'),
    formula: 'σ = √[Σ(xᵢ - x̄)²/(n-1)]  (amostral)',
    example: t('scientificCalculators.explanation.standardDeviation.example')
  },
  {
    id: 'significantFigures',
    title: t('scientificCalculators.explanation.significantFigures.title'),
    icon: 'bi-123',
    content: t('scientificCalculators.explanation.significantFigures.content'),
    formula: t('scientificCalculators.explanation.significantFigures.formula'),
    example: t('scientificCalculators.explanation.significantFigures.example')
  },
  {
    id: 'rounding',
    title: t('scientificCalculators.explanation.rounding.title'),
    icon: 'bi-arrow-repeat',
    content: t('scientificCalculators.explanation.rounding.content'),
    formula: t('scientificCalculators.explanation.rounding.formula'),
    example: t('scientificCalculators.explanation.rounding.example')
  }
]

const references = [
  'HELENE, Otaviano Augusto Marcondes, VANIN, Vito Roberto. Tratamento Estatístico de Dados em Física Experimental. Edgard Blücher, 2ª edição, 1991.',
  'VUOLO, José Henrique. Fundamentos da Teoria de Erros. Edgard Blücher, 2ª edição, 1996.',
  'Bureau Internacional de Pesos e Medidas. Guide to the Expression of Uncertainty in Measurement (GUM). 2004.'
]
</script>

<style scoped>
.explanation-section {
  margin: 1rem 0;
}

.accordion-content-wrapper {
  padding: 0.5rem 0;
}

.item-content {
  color: var(--text-primary);
  line-height: 1.6;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.formula-box {
  padding: 0.75rem;
  background: var(--sky-blue-surface);
  border: 2px solid var(--border-secondary);
  border-radius: 8px;
  text-align: center;
  margin: 1rem 0;
}

.formula-box code {
  background: transparent;
  color: var(--title-secondary);
  font-size: 1rem;
  font-weight: 600;
  font-family: 'Courier New', monospace;
}

.example-box {
  margin-top: 1rem;
  padding: 0.75rem;
  background: var(--inner-surface);
  border-left: 4px solid var(--primary);
  border-radius: 4px;
}

.example-box p {
  margin: 0.5rem 0 0 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.references-card {
  margin-top: 1.5rem;
  background: var(--rose-surface);
  border: 2px dashed var(--border-strong);
}

.references-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-icon {
  color: var(--primary);
  font-size: 1.2rem;
}

.references-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.references-list li {
  padding: 0.5rem 0;
  border-bottom: 1px dashed var(--border);
  color: var(--text-secondary);
  font-size: 0.85rem;
  line-height: 1.4;
}

.references-list li:last-child {
  border-bottom: none;
}

.references-list li::before {
  content: "📚";
  margin-right: 0.5rem;
  opacity: 0.7;
}
</style>