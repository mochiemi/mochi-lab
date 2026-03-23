<template>
  <div class="unified-explanation-section">
    <Accordion
      :items="unifiedAccordionItems"
      variant="primary"
      :multiple="true"
      :bordered="true"
    >
      <template #content="{ item }">
        <div class="accordion-content-wrapper">
          <div class="item-content" v-html="item.content"></div>
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

    <Card class="references-card">
      <template #header>
        <div class="references-header">
          <OhVueIcon name="fa-book" class="header-icon" />
          <h4>{{ t('scientificCalculators.explanation.references') }}</h4>
        </div>
      </template>
      <ul class="references-list">
        <li v-for="(ref, index) in referencesList" :key="index">
          {{ ref }}
        </li>
      </ul>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Accordion from '@/components/ui/Accordion.vue'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import { OhVueIcon } from 'oh-vue-icons'

const { t } = useI18n()

const unifiedAccordionItems = computed(() => [
  {
    id: 'intro',
    title: t('scientificCalculators.theory.intro.title'),
    content: t('scientificCalculators.theory.intro.content')
  },
  {
    id: 'errors',
    title: t('scientificCalculators.theory.errors.title'),
    content: t('scientificCalculators.theory.errors.content')
  },
  {
    id: 'definitions',
    title: t('scientificCalculators.theory.definitions.title'),
    content: t('scientificCalculators.theory.definitions.content'),
    formula: t('scientificCalculators.theory.definitions.formula')
  },
  {
    id: 'operations',
    title: t('scientificCalculators.theory.operations.title'),
    content: t('scientificCalculators.theory.operations.content'),
    formula: t('scientificCalculators.theory.operations.formula'),
    example: t('scientificCalculators.theory.operations.example')
  },
  {
    id: 'rounding',
    title: t('scientificCalculators.explanation.rounding.title'),
    content: t('scientificCalculators.explanation.rounding.content'),
    formula: t('scientificCalculators.explanation.rounding.formula'),
    example: t('scientificCalculators.explanation.rounding.example')
  },
  {
    id: 'uncertainty',
    title: t('scientificCalculators.explanation.uncertainty.title'),
    content: t('scientificCalculators.explanation.uncertainty.content'),
    formula: t('scientificCalculators.explanation.uncertainty.formula'),
    example: t('scientificCalculators.explanation.uncertainty.example')
  },
  {
    id: 'meanDeviation',
    title: t('scientificCalculators.explanation.meanDeviation.title'),
    content: t('scientificCalculators.explanation.meanDeviation.content'),
    formula: t('scientificCalculators.explanation.meanDeviation.formula'),
    example: t('scientificCalculators.explanation.meanDeviation.example')
  },
  {
    id: 'standardDeviation',
    title: t('scientificCalculators.explanation.standardDeviation.title'),
    content: t('scientificCalculators.explanation.standardDeviation.content'),
    formula: t('scientificCalculators.explanation.standardDeviation.formula'),
    example: t('scientificCalculators.explanation.standardDeviation.example')
  },
  {
    id: 'significantFigures',
    title: t('scientificCalculators.explanation.significantFigures.title'),
    content: t('scientificCalculators.explanation.significantFigures.content'),
    formula: t('scientificCalculators.explanation.significantFigures.formula'),
    example: t('scientificCalculators.explanation.significantFigures.example')
  }
])

const referencesList = [
  'HELENE, Otaviano Augusto Marcondes, VANIN, Vito Roberto. Tratamento Estatístico de Dados em Física Experimental. Edgard Blücher, 2ª edição, 1991.',
  'VUOLO, José Henrique. Fundamentos da Teoria de Erros. Edgard Blücher, 2ª edição, 1996.',
  'Bureau Internacional de Pesos e Medidas. Guide to the Expression of Uncertainty in Measurement (GUM). 2004.',
  'UNIVERSIDADE FEDERAL DE ALFENAS. Apostila de Aulas Práticas de Físico-Química - Curso de Farmácia. Prof. Dr. Luciano Sindra Virtuoso, 2026.'
]
</script>

<style scoped>
.unified-explanation-section {
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

.item-content :deep(strong) {
  color: var(--primary);
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

.references-header h4 {
  margin: 0;
  color: var(--title-primary);
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

@media (max-width: 768px) {
  .formula-box code {
    font-size: 0.85rem;
  }
}
</style>