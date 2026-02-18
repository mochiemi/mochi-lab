<template>
  <div class="tab-content">
    <section class="catalog-section">
      <h2><OhVueIcon name="oi-arrow-right" /> {{ $t('components.tabs.forms.button.title') }}</h2>
      <p class="section-description">{{ $t('components.tabs.forms.button.description') }}</p>
      
      <div class="component-demo">
        <h3>Variants</h3>
        <div class="demo-grid">
          <Button variant="primary">{{ $t('components.tabs.forms.button.variants.primary') }}</Button>
          <Button variant="secondary">{{ $t('components.tabs.forms.button.variants.secondary') }}</Button>
          <Button variant="outline">{{ $t('components.tabs.forms.button.variants.outline') }}</Button>
          <Button variant="danger">{{ $t('components.tabs.forms.button.variants.danger') }}</Button>
        </div>

        <h3>Sizes</h3>
        <div class="demo-grid">
          <Button size="small">{{ $t('components.tabs.forms.button.sizes.small') }}</Button>
          <Button size="medium">{{ $t('components.tabs.forms.button.sizes.medium') }}</Button>
          <Button size="large">{{ $t('components.tabs.forms.button.sizes.large') }}</Button>
        </div>

        <h3>States</h3>
        <div class="demo-grid">
          <Button disabled>{{ $t('components.tabs.forms.button.states.disabled') }}</Button>
          <Button loading>{{ $t('components.tabs.forms.button.states.loading') }}</Button>
        </div>
      </div>
    </section>

    <section class="catalog-section">
      <h2><OhVueIcon name="oi-list" /> {{ $t('components.tabs.forms.formControls.title') }}</h2>
      <p class="section-description">{{ $t('components.tabs.forms.formControls.description') }}</p>
      
      <div class="component-demo">
        <h3><OhVueIcon name="oi-check" /> Checkbox</h3>
        <div class="form-controls-grid">
          <Checkbox v-model="formData.checkbox1" :label="$t('components.tabs.forms.formControls.checkbox.default')" />
          <Checkbox v-model="formData.checkbox2" :label="$t('components.tabs.forms.formControls.checkbox.checked')" />
          <Checkbox v-model="formData.checkbox3" :label="$t('components.tabs.forms.formControls.checkbox.disabled')" disabled />
          <Checkbox v-model="formData.checkbox4" :label="$t('components.tabs.forms.formControls.checkbox.disabledChecked')" :model-value="true" disabled />
        </div>

        <h3><OhVueIcon name="md-radiobuttonchecked" /> Radio</h3>
        <div class="form-controls-grid">
          <Radio v-model="formData.radioValue" value="option1" :label="$t('components.tabs.forms.formControls.radio.option1')" />
          <Radio v-model="formData.radioValue" value="option2" :label="$t('components.tabs.forms.formControls.radio.option2')" />
          <Radio v-model="formData.radioValue" value="option3" :label="$t('components.tabs.forms.formControls.radio.option3')" disabled />
        </div>
        <p class="demo-value">{{ $t('components.tabs.forms.formControls.radio.selected', { value: formData.radioValue }) }}</p>

        <h3><OhVueIcon name="oi-toggle" /> Switch</h3>
        <div class="form-controls-grid">
          <Switch v-model="formData.switch1" :label="$t('components.tabs.forms.formControls.switch.off')" />
          <Switch v-model="formData.switch2" :label="$t('components.tabs.forms.formControls.switch.on')" />
          <Switch v-model="formData.switch3" :label="$t('components.tabs.forms.formControls.switch.disabled')" disabled />
          <Switch v-model="formData.switch4" :label="$t('components.tabs.forms.formControls.switch.disabledOn')" :model-value="true" disabled />
        </div>
      </div>
    </section>

    <section class="catalog-section">
      <h2><OhVueIcon name="oi-pencil" /> {{ $t('components.tabs.forms.inputFields.title') }}</h2>
      <p class="section-description">{{ $t('components.tabs.forms.inputFields.description') }}</p>
      
      <div class="component-demo">
        <h3><OhVueIcon name="oi-input" /> Input</h3>
        <div class="inputs-grid">
          <Input :label="$t('components.tabs.forms.inputFields.input.fullName')" :placeholder="$t('components.tabs.forms.inputFields.input.enterName')" />
          <Input type="email" :label="$t('components.tabs.forms.inputFields.input.email')" :placeholder="$t('components.tabs.forms.inputFields.input.enterEmail')" />
          <Input :label="$t('components.tabs.forms.inputFields.input.password')" type="password" :placeholder="$t('components.tabs.forms.inputFields.input.enterPassword')" />
          <Input :label="$t('components.tabs.forms.inputFields.input.withError')" :error="$t('components.tabs.forms.inputFields.input.required')" />
          <Input :label="$t('components.tabs.forms.inputFields.input.valid')" :success="$t('components.tabs.forms.inputFields.input.everythingOk')" />
          <Input :label="$t('components.tabs.forms.inputFields.input.disabled')" disabled :placeholder="$t('components.tabs.forms.inputFields.input.notEditable')" />
        </div>

        <h3><OhVueIcon name="oi-text" /> Textarea</h3>
        <div class="inputs-grid">
          <Textarea 
            :label="$t('components.tabs.forms.inputFields.textarea.message')" 
            :placeholder="$t('components.tabs.forms.inputFields.textarea.enterMessage')" 
            :rows="4"
            v-model="formData.textarea1"
          />
          <Textarea 
            :label="$t('components.tabs.forms.inputFields.textarea.withCounter')" 
            :placeholder="$t('components.tabs.forms.inputFields.textarea.enterLimited')" 
            :maxlength="50"
            :show-counter="true"
            v-model="formData.textarea2"
          />
          <Textarea 
            :label="$t('components.tabs.forms.inputFields.textarea.withError')" 
            :placeholder="$t('components.tabs.forms.inputFields.textarea.withError')" 
            :error="$t('components.tabs.forms.inputFields.textarea.errorMessage')"
            v-model="formData.textarea4"
          />
          <Textarea 
            :label="$t('components.tabs.forms.inputFields.textarea.disabled')" 
            :placeholder="$t('components.tabs.forms.inputFields.input.notEditable')" 
            disabled
            v-model="formData.textarea5"
          />
        </div>

        <h3><OhVueIcon name="hi-solid-selector" /> Select</h3>
        <div class="inputs-grid">
          <Select 
            :label="$t('components.tabs.forms.inputFields.select.selectOption')"
            :placeholder="$t('components.tabs.forms.inputFields.select.choose')"
            :options="selectOptions"
            v-model="formData.selectValue1"
          />
          <Select 
            :label="$t('components.tabs.forms.inputFields.select.defaultValue')"
            :options="selectOptions"
            v-model="formData.selectValue2"
          />
          <Select 
            :label="$t('components.tabs.forms.inputFields.select.withError')"
            :options="selectOptions"
            v-model="formData.selectValue3"
            :error="$t('components.tabs.forms.inputFields.select.selectionRequired')"
          />
          <Select 
            :label="$t('components.tabs.forms.inputFields.select.disabled')"
            :options="selectOptions"
            v-model="formData.selectValue4"
            disabled
          />
        </div>
        <p class="demo-value">{{ $t('components.tabs.forms.inputFields.select.selectedValue', { index: 1, value: formData.selectValue1 }) }}</p>
        <p class="demo-value">{{ $t('components.tabs.forms.inputFields.select.selectedValue', { index: 2, value: formData.selectValue2 }) }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from '@/components/ui/Button.vue'
import Checkbox from '@/components/ui/Checkbox.vue'
import Radio from '@/components/ui/Radio.vue'
import Switch from '@/components/ui/Switch.vue'
import Input from '@/components/ui/Input.vue'
import Textarea from '@/components/ui/Textarea.vue'
import Select from '@/components/ui/Select.vue'

const { t } = useI18n()

const formData = reactive({
  checkbox1: false,
  checkbox2: true,
  checkbox3: false,
  checkbox4: true,
  radioValue: 'option1',
  switch1: false,
  switch2: true,
  switch3: false,
  switch4: true,
  selectValue1: '',
  selectValue2: 'option2',
  selectValue3: '',
  selectValue4: 'option1',
  textarea1: '',
  textarea2: '',
  textarea4: '',
  textarea5: t('components.tabs.forms.inputFields.textarea.disabledText')
})

const selectOptions = [
  { value: 'option1', label: t('components.tabs.forms.inputFields.options.option1') },
  { value: 'option2', label: t('components.tabs.forms.inputFields.options.option2') },
  { value: 'option3', label: t('components.tabs.forms.inputFields.options.option3') },
  { value: 'option4', label: t('components.tabs.forms.inputFields.options.option4'), disabled: true },
  { value: 'option5', label: t('components.tabs.forms.inputFields.options.option5') }
]
</script>

<style scoped>
.tab-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.catalog-section {
  padding: 2rem;
  background: var(--surface);
  border-radius: 12px;
  border: 1px solid var(--border);
  box-shadow: 0 2px 8px var(--shadow);
}

.catalog-section h2 {
  margin-bottom: 1rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-description {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.component-demo {
  padding: 1.5rem;
  background: var(--inner-surface);
  border-radius: 8px;
  border: 1px solid var(--border);
}

.component-demo h3 {
  margin: 1.5rem 0 1rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.component-demo h3:first-child {
  margin-top: 0;
}

.demo-grid {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
}

.form-controls-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.inputs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.demo-value {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-style: italic;
  margin-top: 0.5rem;
}

.counter-states-demo {
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--surface-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-primary);
}

.counter-states-demo h4 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
}

.states-grid {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.state-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.state-indicator {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 2px solid;
}

.state-indicator.normal {
  border-color: var(--border);
  background: var(--surface);
}

.state-indicator.warning {
  border-color: var(--accent);
  background: rgba(255, 193, 7, 0.1);
}

.state-indicator.at-limit {
  border-color: var(--accent);
  background: rgba(255, 193, 7, 0.2);
}

@media (max-width: 768px) {
  .catalog-section {
    padding: 1rem;
  }
  
  .demo-grid {
    flex-direction: column;
    align-items: stretch;
  }
  
  .inputs-grid {
    grid-template-columns: 1fr;
  }
  
  .states-grid {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
