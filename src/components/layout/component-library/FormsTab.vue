<template>
  <div class="tab-content">
    <section class="catalog-section">
      <h2><OhVueIcon name="oi-arrow-right" /> Botões</h2>
      <p class="section-description">Componentes de botão com diferentes variantes, tamanhos e estados.</p>
      
      <div class="component-demo">
        <h3>Variantes</h3>
        <div class="demo-grid">
          <Button variant="primary">Primário</Button>
          <Button variant="secondary">Secundário</Button>
          <Button variant="outline">Contorno</Button>
          <Button variant="danger">Perigo</Button>
        </div>

        <h3>Tamanhos</h3>
        <div class="demo-grid">
          <Button size="small">Pequeno</Button>
          <Button size="medium">Médio</Button>
          <Button size="large">Grande</Button>
        </div>

        <h3>Estados</h3>
        <div class="demo-grid">
          <Button disabled>Desabilitado</Button>
          <Button loading>Carregando</Button>
        </div>
      </div>
    </section>

    <section class="catalog-section">
      <h2><OhVueIcon name="bi-card-checklist" /> Controles de Formulário</h2>
      <p class="section-description">Componentes interativos para seleção e alternância de opções.</p>
      
      <div class="component-demo">
        <h3><OhVueIcon name="oi-check" /> Checkbox</h3>
        <div class="form-controls-grid">
          <Checkbox v-model="formData.checkbox1" label="Checkbox padrão" />
          <Checkbox v-model="formData.checkbox2" label="Checkbox marcado" />
          <Checkbox v-model="formData.checkbox3" label="Checkbox desabilitado" disabled />
          <Checkbox v-model="formData.checkbox4" label="Checkbox desabilitado e marcado" :model-value="true" disabled />
        </div>

        <h3><OhVueIcon name="md-radiobuttonchecked" /> Radio</h3>
        <div class="form-controls-grid">
          <Radio v-model="formData.radioValue" value="option1" label="Opção 1" />
          <Radio v-model="formData.radioValue" value="option2" label="Opção 2" />
          <Radio v-model="formData.radioValue" value="option3" label="Opção 3 (desabilitada)" disabled />
        </div>
        <p class="demo-value">Opção selecionada: {{ formData.radioValue }}</p>

        <h3><OhVueIcon name="md-toggleoff-outlined" /> Switch</h3>
        <div class="form-controls-grid">
          <Switch v-model="formData.switch1" label="Switch desligado" />
          <Switch v-model="formData.switch2" label="Switch ligado" />
          <Switch v-model="formData.switch3" label="Switch desabilitado" disabled />
          <Switch v-model="formData.switch4" label="Switch desabilitado e ligado" :model-value="true" disabled />
        </div>
      </div>
    </section>

    <section class="catalog-section">
      <h2><OhVueIcon name="oi-pencil" /> Campos de Entrada</h2>
      <p class="section-description">Componentes para entrada de dados como input, textarea e select.</p>
      
      <div class="component-demo">
        <h3><OhVueIcon name="oi-pencil" /> Input</h3>
        <div class="inputs-grid">
          <Input label="Nome Completo" placeholder="Digite seu nome" />
          <Input type="email" label="E-mail" placeholder="Digite seu e-mail" />
          <Input label="Senha" type="password" placeholder="Digite sua senha" />
          <Input label="Com erro" error="Campo obrigatório" />
          <Input label="Válido" success="Tudo certo!" />
          <Input label="Desabilitado" disabled placeholder="Campo não editável" />
        </div>

        <h3><OhVueIcon name="oi-comment" /> Textarea</h3>
        <div class="inputs-grid">
          <Textarea 
            label="Mensagem" 
            placeholder="Digite sua mensagem" 
            :rows="4"
            v-model="formData.textarea1"
          />
          <Textarea 
            label="Com contador" 
            placeholder="Digite até 50 caracteres" 
            :maxlength="50"
            :show-counter="true"
            v-model="formData.textarea2"
          />
          <Textarea 
            label="Com erro" 
            placeholder="Campo com erro" 
            error="Mensagem muito curta"
            v-model="formData.textarea4"
          />
          <Textarea 
            label="Desabilitado" 
            placeholder="Campo não editável" 
            disabled
            v-model="formData.textarea5"
          />
        </div>

        <h3><OhVueIcon name="hi-solid-selector" /> Select</h3>
        <div class="inputs-grid">
          <Select 
            label="Selecione uma opção"
            placeholder="Escolha..."
            :options="selectOptions"
            v-model="formData.selectValue1"
          />
          <Select 
            label="Com valor padrão"
            :options="selectOptions"
            v-model="formData.selectValue2"
          />
          <Select 
            label="Com erro"
            :options="selectOptions"
            v-model="formData.selectValue3"
            error="Seleção obrigatória"
          />
          <Select 
            label="Desabilitado"
            :options="selectOptions"
            v-model="formData.selectValue4"
            disabled
          />
        </div>
        <p class="demo-value">Select 1: {{ formData.selectValue1 || 'Nenhum' }}</p>
        <p class="demo-value">Select 2: {{ formData.selectValue2 || 'Nenhum' }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { OhVueIcon } from 'oh-vue-icons' 
import Button from '@/components/ui/Button.vue'
import Checkbox from '@/components/ui/Checkbox.vue'
import Radio from '@/components/ui/Radio.vue'
import Switch from '@/components/ui/Switch.vue'
import Input from '@/components/ui/Input.vue'
import Textarea from '@/components/ui/Textarea.vue'
import Select from '@/components/ui/Select.vue'

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
  textarea5: 'Texto pré-definido desabilitado'
})

const selectOptions = [
  { value: 'option1', label: 'Opção 1' },
  { value: 'option2', label: 'Opção 2' },
  { value: 'option3', label: 'Opção 3' },
  { value: 'option4', label: 'Opção 4 (desabilitada)', disabled: true },
  { value: 'option5', label: 'Opção 5' }
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
}
</style>