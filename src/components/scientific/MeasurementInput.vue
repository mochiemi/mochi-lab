<template>
  <Card class="measurement-input-card">
    <template #header>
      <div class="input-header">
        <OhVueIcon name="bi-rulers" class="header-icon" />
        <h4>{{ t('scientificCalculators.inputs.title') }}</h4>
      </div>
    </template>

    <div class="measurement-input">
      <div class="input-row">
        <div class="input-group value-group">
          <Input
            v-model.number="localValue"
            :label="t('scientificCalculators.inputs.value')"
            :placeholder="t('scientificCalculators.inputs.valuePlaceholder')"
            type="number"
            step="any"
            @keyup.enter="handleAdd"
            :error="inputError"
          />
        </div>

        <div class="input-group unit-group">
          <Select
            v-model="localUnit"
            :label="t('scientificCalculators.inputs.unit')"
            :placeholder="t('scientificCalculators.inputs.unitPlaceholder')"
            :options="unitOptions"
          />
        </div>

        <div class="input-group sig-figs-group">
          <Input
            v-model.number="localSigFigs"
            :label="t('scientificCalculators.inputs.significantFigures')"
            type="number"
            min="1"
            max="15"
            step="1"
            :placeholder="t('scientificCalculators.inputs.sigFigsPlaceholder')"
          />
        </div>
      </div>

      <div class="precision-info" v-if="instrumentPrecision !== undefined && instrumentPrecision !== null">
        <Badge variant="info" size="small">
          <OhVueIcon name="bi-info-circle" class="badge-icon" />
          {{ t('scientificCalculators.inputs.instrumentPrecision') }}: ±{{ instrumentPrecision }} {{ localUnit }}
        </Badge>
      </div>

      <div class="button-group">
        <Tooltip :content="t('scientificCalculators.tooltips.addValue')" position="top">
          <Button
            variant="primary"
            @click="handleAdd"
            :disabled="!isValidInput"
            :class="{ 'pulse-animation': isValidInput }"
          >
            <OhVueIcon name="bi-plus-circle" />
            {{ t('scientificCalculators.inputs.add') }}
          </Button>
        </Tooltip>

        <Tooltip
          v-if="showClear"
          :content="t('scientificCalculators.tooltips.clearAll')"
          position="top"
        >
          <Button
            variant="danger"
            @click="handleClearAll"
          >
            <OhVueIcon name="bi-trash3" />
            {{ t('scientificCalculators.inputs.clearAll') }}
          </Button>
        </Tooltip>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import Button from '@/components/ui/Button.vue'
import Tooltip from '@/components/ui/Tooltip.vue'
import Badge from '@/components/ui/Badge.vue'
import { OhVueIcon } from 'oh-vue-icons'

const { t } = useI18n()

const props = defineProps<{
  value: number | null
  unit: string
  significantFigures: number
  inputError?: string
  unitOptions: Array<{ value: string; label: string }>
  instrumentPrecision?: number | string | null
}>()

const emit = defineEmits<{
  (e: 'update:value', value: number | null): void
  (e: 'update:unit', value: string): void
  (e: 'update:significantFigures', value: number): void
  (e: 'add'): void
  (e: 'clear-all'): void
}>()

const localValue = ref<number | null>(props.value)
const localUnit = ref<string>(props.unit)
const localSigFigs = ref<number>(props.significantFigures)

watch(() => props.value, (newVal) => {
  localValue.value = newVal
})

watch(() => props.unit, (newVal) => {
  localUnit.value = newVal
})

watch(() => props.significantFigures, (newVal) => {
  localSigFigs.value = newVal
})

watch(localValue, (newVal) => {
  emit('update:value', newVal)
})

watch(localUnit, (newVal) => {
  emit('update:unit', newVal)
})

watch(localSigFigs, (newVal) => {
  if (newVal !== null && newVal !== undefined) {
    if (newVal < 1) {
      localSigFigs.value = 1
    } else if (newVal > 15) {
      localSigFigs.value = 15
    }
    emit('update:significantFigures', localSigFigs.value)
  }
})

const isValidInput = computed(() => {
  return localValue.value !== null && !isNaN(localValue.value) && localValue.value !== undefined
})

const showClear = computed(() => {
  return true
})

const handleAdd = () => {
  if (isValidInput.value) {
    emit('add')
  }
}

const handleClearAll = () => {
  emit('clear-all')
}
</script>

<style scoped>
.measurement-input-card {
  background: var(--surface-primary);
  border: 2px solid var(--border-secondary);
}

.input-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-icon {
  color: var(--primary);
  font-size: 1.4rem;
}

.measurement-input {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}


.input-group {
  flex: 2;
  min-width: 200px;
  display: flex;
  flex-direction: column;
}

.unit-group,
.sig-figs-group {
  flex: 1;
  min-width: 150px;
}

.input-group :deep(.input-wrapper),
.input-group :deep(.select-wrapper) {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.input-group :deep(.input-wrapper) {
  margin-bottom: 0; 
}

.input-group :deep(.input-label),
.input-group :deep(.select-label) {
  min-height: 1.2em; 
  margin: 0.75em;
  display: block;
}

.input-group :deep(.base-input),
.input-group :deep(.select) {
  width: 100%;
  height: calc(1.5em + 1.5em); 
  box-sizing: border-box;
}

.precision-info {
  display: flex;
  justify-content: center;
  margin-top: -0.5rem;
}

.badge-icon {
  margin-right: 0.25rem;
}

.button-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

@media (max-width: 768px) {
  .input-row {
    flex-direction: column;
    gap: 0.5rem;
  }

  .input-group,
  .unit-group,
  .sig-figs-group {
    min-width: 100%;
  }

  .button-group {
    flex-direction: column;
  }

  .button-group .btn {
    width: 100%;
  }
}
</style>