<template>
  <form @submit.prevent="handleSubmit" class="event-form">
    <div class="form-grid">
      <!-- Tipo de Evento -->
      <div class="form-group full-width">
        <label>Tipo de Evento *</label>
        <div class="type-selector">
          <button 
            v-for="type in eventTypes" 
            :key="type.value"
            type="button"
            :class="['type-btn', { active: form.event_type === type.value }]"
            @click="form.event_type = type.value as EventType"
          >
            <OhVueIcon :name="type.icon" />
            {{ type.label }}
          </button>
        </div>
      </div>

      <!-- Código e Título -->
      <div class="form-group">
        <label>Código *</label>
        <Input 
          v-model="form.code" 
          placeholder="Ex: DF228"
          required
        />
      </div>

      <div class="form-group">
        <label>Título *</label>
        <Input 
          v-model="form.title" 
          placeholder="Nome da disciplina/atividade"
          required
        />
      </div>

      <div class="form-group">
        <label>Dia da Semana *</label>
        <Select 
          v-model="form.day" 
          :options="weekDayOptions"
          required
        />
      </div>

      <div class="form-group">
        <label>Horário *</label>
        <Input 
          v-model="form.time" 
          placeholder="13:00 - 14:00"
          required
          pattern="\d{2}:\d{2} - \d{2}:\d{2}"
        />
      </div>

      <div class="form-group">
        <label>Sala/Laboratório *</label>
        <Input 
          v-model="form.room" 
          placeholder="AL-PCA-203"
          required
        />
      </div>

      <div class="form-group">
        <label>Professor/Responsável</label>
        <Input 
          v-model="form.professor" 
          placeholder="Nome do professor"
        />
      </div>

      <template v-if="form.event_type === 'class'">
        <div class="form-group">
          <label>Período</label>
          <Select 
            v-model="form.period" 
            :options="periodOptions"
          />
        </div>

        <div class="form-group">
          <label>Turma Prática</label>
          <Input 
            v-model="form.practical_class" 
            placeholder="A, B, T1..."
          />
        </div>

        <div class="form-group">
          <label>Tipo de Disciplina</label>
          <Select 
            v-model="form.class_type" 
            :options="[
              { value: 'required', label: 'Obrigatória' },
              { value: 'elective', label: 'Eletiva' },
              { value: 'optional', label: 'Optativa' }
            ]"
          />
        </div>

        <div class="form-group">
          <label>Créditos</label>
          <Input 
            v-model="form.credits" 
            placeholder="4 créditos (2T + 2P)"
          />
        </div>
      </template>

      <template v-if="form.event_type === 'tutoring'">
        <div class="form-group">
          <label>Nome do Monitor *</label>
          <Input 
            v-model="form.tutor_name" 
            placeholder="Nome do monitor"
            required
          />
        </div>

        <div class="form-group">
          <label>Matéria de Apoio *</label>
          <Input 
            v-model="form.subject_target" 
            placeholder="Ex: Físico-química"
            required
          />
        </div>
      </template>

      <!-- Descrição -->
      <div class="form-group full-width">
        <label>Descrição/Detalhes</label>
        <Textarea 
          v-model="form.description" 
          :rows="3"
          placeholder="Informações adicionais, ementa, observações..."
        />
      </div>
    </div>

    <div class="form-actions">
      <Button 
        type="button" 
        variant="secondary" 
        @click="$emit('cancel')"
      >
        Cancelar
      </Button>
      <Button 
        type="submit" 
        variant="primary" 
        :loading="saving"
      >
        <OhVueIcon name="oi-check" />
        {{ isEditing ? 'Atualizar' : 'Criar' }} Evento
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { OhVueIcon } from 'oh-vue-icons'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import Textarea from '@/components/ui/Textarea.vue'
import Button from '@/components/ui/Button.vue'
import type { EventItem, EventType, EventDay } from '@/types/events'

const props = defineProps<{
  editingEvent?: EventItem | null
  saving?: boolean
}>()

const emit = defineEmits<{
  submit: [data: Record<string, any>]
  cancel: []
}>()

interface EventTypeOption {
  value: EventType
  label: string
  icon: string
}

const eventTypes: EventTypeOption[] = [
  { value: 'class', label: 'Aula', icon: 'oi-mortar-board' },
  { value: 'tutoring', label: 'Monitoria', icon: 'hi-light-bulb' },
  { value: 'study', label: 'Estudo/Grupo', icon: 'fa-book' },
  { value: 'exam', label: 'Prova/Avaliação', icon: 'fa-flask' },
  { value: 'other', label: 'Outro', icon: 'oi-calendar' }
]

const weekDayOptions = [
  { value: 'Segunda', label: 'Segunda-feira' },
  { value: 'Terça', label: 'Terça-feira' },
  { value: 'Quarta', label: 'Quarta-feira' },
  { value: 'Quinta', label: 'Quinta-feira' },
  { value: 'Sexta', label: 'Sexta-feira' },
  { value: 'Sábado', label: 'Sábado' },
  { value: 'Domingo', label: 'Domingo' }
]

const periodOptions = Array.from({ length: 10 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}º Período`
}))

const isEditing = computed<boolean>(() => !!props.editingEvent)

interface FormState {
  event_type: EventType
  code: string
  title: string
  day: EventDay
  time: string
  room: string
  professor: string
  description: string
  period: number | null
  practical_class: string
  class_type: 'required' | 'elective' | 'optional'
  credits: string | number
  tutor_name: string
  subject_target: string
  [key: string]: any
}

const defaultForm: FormState = {
  event_type: 'class',
  code: '',
  title: '',
  day: 'Segunda',
  time: '',
  room: '',
  professor: '',
  description: '',
  period: null,
  practical_class: '',
  class_type: 'required',
  credits: '',
  tutor_name: '',
  subject_target: ''
}

const form = ref<FormState>({ ...defaultForm })

watch(() => props.editingEvent, (event: EventItem | null | undefined) => {
  if (event) {
    form.value = {
      ...defaultForm,
      event_type: event.event_type,
      code: event.code,
      title: event.title,
      day: event.day,
      time: event.time,
      room: event.room,
      professor: event.professor || '',
      description: event.description || '',
      period: event.period || null,
      practical_class: event.practical_class || '',
      class_type: event.class_type || 'required',
      credits: event.credits || '',
      tutor_name: event.tutor_name || '',
      subject_target: event.subject_target || ''
    }
  } else {
    form.value = { ...defaultForm }
  }
}, { immediate: true })

const handleSubmit = (): void => {
  const payload: Record<string, any> = { ...form.value }
  
  // Limpar campos não utilizados baseado no tipo
  if (payload.event_type !== 'class') {
    payload.period = undefined
    payload.practical_class = undefined
    payload.class_type = undefined
    payload.credits = undefined
  }
  
  if (payload.event_type !== 'tutoring') {
    payload.tutor_name = undefined
    payload.subject_target = undefined
  }

  // Remover undefined values
  Object.keys(payload).forEach((key: string) => {
    if (payload[key] === undefined) {
      delete payload[key]
    }
  })

  emit('submit', payload)
}
</script>

<style scoped>
.event-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: span 2;
}

.form-group label {
  font-family: 'Shantell Sans', cursive;
  font-weight: 600;
  color: var(--title-primary);
  font-size: 0.9rem;
}

.type-selector {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.type-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 2px dashed var(--border);
  background: var(--surface-secondary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Comfortaa', sans-serif;
  font-size: 0.9rem;
}

.type-btn:hover {
  border-color: var(--secondary);
  background: var(--rose-surface);
}

.type-btn.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
  border-style: solid;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 2px dashed var(--border);
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-group.full-width {
    grid-column: span 1;
  }
}
</style>