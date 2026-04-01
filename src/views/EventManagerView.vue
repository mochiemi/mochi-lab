<!-- views/EventManagerView.vue -->
<template>
  <div class="event-manager">
    <header class="manager-header">
      <div class="header-title">
        <h1>
          <OhVueIcon name="bi-calendar-heart" />
          Gerenciador de Eventos
        </h1>
        <p>Crie, edite e organize aulas, monitorias e eventos de estudo</p>
      </div>
      
      <div class="header-actions">
        <Button variant="secondary" size="small" @click="refreshData">
          <OhVueIcon name="fa-redo-alt" :class="{ spinning: eventsStore.loading }" />
          Atualizar
        </Button>
        <Button variant="primary" @click="openCreateModal">
          <OhVueIcon name="fa-plus" />
          Novo Evento
        </Button>
      </div>
    </header>

    <!-- Filtros -->
    <div class="filters-bar">
      <div class="filter-group">
        <label>Tipo:</label>
        <Select 
          v-model="filterType" 
          :options="typeOptions"
        />
      </div>

      <div class="filter-group">
        <label>Dia:</label>
        <Select 
          v-model="filterDay" 
          :options="dayOptions"
        />
      </div>

      <div class="stats">
        <Badge variant="info">{{ filteredEvents.length }} eventos</Badge>
      </div>
    </div>

    <!-- Lista de Eventos -->
    <div class="events-list">
      <div v-if="eventsStore.loading && eventsStore.events.length === 0" class="loading-state">
        <Loading text="Carregando eventos..." />
      </div>

      <template v-else>
        <div 
          v-for="event in filteredEvents" 
          :key="event.id"
          class="event-row"
          :class="'type-' + event.event_type"
        >
          <div class="event-info">
            <Badge 
              :variant="getEventTypeColor(event.event_type)" 
              size="small"
              class="type-badge"
            >
              {{ getEventTypeLabel(event.event_type) }}
            </Badge>
            
            <div class="event-main">
              <h4>{{ event.code }} - {{ event.title }}</h4>
              <div class="event-meta">
                <span>
                  <OhVueIcon name="hi-clock" />
                  {{ event.day }}, {{ event.time }}
                </span>
                <span>
                  <OhVueIcon name="fa-regular-map-marker-alt" />
                  {{ event.room }}
                </span>
                <span v-if="event.professor">
                  <OhVueIcon name="oi-person" />
                  {{ event.professor }}
                </span>
              </div>
            </div>
          </div>

          <div class="event-actions">
            <Button 
              variant="phantom" 
              size="small" 
              @click="openEditModal(event)"
            >
              <OhVueIcon name="oi-pencil" />
            </Button>
            <Button 
              variant="danger" 
              size="small" 
              @click="confirmDelete(event)"
            >
              <OhVueIcon name="hi-trash" />
            </Button>
          </div>
        </div>

        <div v-if="filteredEvents.length === 0" class="empty-state">
          <OhVueIcon name="oi-inbox" class="empty-icon" />
          <p>Nenhum evento encontrado</p>
        </div>
      </template>
    </div>

    <!-- Modal de Criacao/Edicao -->
    <Modal 
      :show="showModal" 
      :title="modalTitle"
      size="lg"
      @close="closeModal"
    >
      <EventForm 
        :editing-event="editingEvent"
        :saving="saving"
        @submit="handleSubmit"
        @cancel="closeModal"
      />
    </Modal>

    <!-- Confirmacao de Delete -->
    <Modal 
      :show="showDeleteConfirm" 
      title="Confirmar Exclusao"
      size="sm"
      @close="showDeleteConfirm = false"
    >
      <div class="delete-confirm">
        <p>Tem certeza que deseja excluir <strong>{{ eventToDeleteTitle }}</strong>?</p>
        <p class="warning">Esta acao nao pode ser desfeita.</p>
        
        <div class="actions">
          <Button 
            variant="secondary" 
            @click="showDeleteConfirm = false"
          >
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            :loading="deleting"
            @click="handleDelete"
          >
            Confirmar Exclusao
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { OhVueIcon } from 'oh-vue-icons'
import { useEventsStore } from '@/stores/events'
import type { EventItem, EventType, EventDay } from '@/types/events'
import Button from '@/components/ui/Button.vue'
import Select from '@/components/ui/Select.vue'
import Badge from '@/components/ui/Badge.vue'
import Modal from '@/components/ui/Modal.vue'
import Loading from '@/components/ui/Loading.vue'
import EventForm from '@/components/admin/EventForm.vue'

const eventsStore = useEventsStore()

// State
const showModal = ref(false)
const showDeleteConfirm = ref(false)
const editingEvent = ref<EventItem | null>(null)
const eventToDelete = ref<EventItem | null>(null)
const saving = ref(false)
const deleting = ref(false)

const filterType = ref<EventType | 'all'>('all')
const filterDay = ref<EventDay | 'all'>('all')

// Options
const typeOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'class', label: 'Aulas' },
  { value: 'tutoring', label: 'Monitorias' },
  { value: 'study', label: 'Estudos' },
  { value: 'exam', label: 'Provas' },
  { value: 'other', label: 'Outros' }
]

const dayOptions = computed(() => [
  { value: 'all', label: 'Todos' },
  ...eventsStore.weekDays.map((d: EventDay) => ({ value: d, label: d }))
])

const modalTitle = computed(() => 
  editingEvent.value ? 'Editar Evento' : 'Novo Evento'
)

const eventToDeleteTitle = computed(() => 
  eventToDelete.value?.title || ''
)

// Computed
const filteredEvents = computed<EventItem[]>(() => {
  let result = eventsStore.allEvents
  
  if (filterType.value !== 'all') {
    result = result.filter((e: EventItem) => e.event_type === filterType.value)
  }
  
  if (filterDay.value !== 'all') {
    result = result.filter((e: EventItem) => e.day === filterDay.value)
  }
  
  const dayOrder: EventDay[] = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']
  
  return result.sort((a: EventItem, b: EventItem) => {
    const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
    if (dayDiff !== 0) return dayDiff
    return a.time.localeCompare(b.time)
  })
})

// Methods
onMounted(() => {
  eventsStore.fetchEvents()
})

const refreshData = () => {
  eventsStore.fetchEvents(true)
}

const getEventTypeColor = (type: EventType): string => {
  const colors: Record<EventType, string> = {
    class: 'primary',
    tutoring: 'warning',
    study: 'success',
    exam: 'error',
    other: 'secondary'
  }
  return colors[type] || 'secondary'
}

const getEventTypeLabel = (type: EventType): string => {
  const labels: Record<EventType, string> = {
    class: 'Aula',
    tutoring: 'Monitoria',
    study: 'Estudo',
    exam: 'Prova',
    other: 'Outro'
  }
  return labels[type] || type
}

const openCreateModal = () => {
  editingEvent.value = null
  showModal.value = true
}

const openEditModal = (event: EventItem) => {
  editingEvent.value = event
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingEvent.value = null
}

const handleSubmit = async (formData: Record<string, any>) => {
  saving.value = true
  
  try {
    if (editingEvent.value?.id) {
      const result = await eventsStore.updateEvent(editingEvent.value.id, formData)
      if (result.success) {
        closeModal()
        await eventsStore.fetchEvents(true) // Refresh após atualizar
      }
    } else {
      const result = await eventsStore.createEvent(formData as any)
      if (result.success) {
        closeModal()
        await eventsStore.fetchEvents(true) // Refresh após criar
      }
    }
  } catch (error) {
    console.error('Error submitting event:', error)
  } finally {
    saving.value = false
  }
}

const confirmDelete = (event: EventItem) => {
  eventToDelete.value = event
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  if (!eventToDelete.value?.id) return
  
  deleting.value = true
  const result = await eventsStore.deleteEvent(eventToDelete.value.id)
  
  if (result.success) {
    showDeleteConfirm.value = false
    eventToDelete.value = null
    await eventsStore.fetchEvents(true) // Refresh após deletar
  }
  
  deleting.value = false
}
</script>

<style scoped>
.event-manager {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.manager-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-title h1 {
  font-family: 'Gloria Hallelujah', cursive;
  color: var(--title-primary);
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-title p {
  color: var(--text-secondary);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.filters-bar {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--surface-secondary);
  border-radius: 12px;
  border: 2px dashed var(--border);
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group label {
  font-family: 'Shantell Sans', cursive;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.event-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--surface-primary);
  border: 2px dashed var(--border-secondary);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.event-row:hover {
  border-color: var(--primary);
  transform: translateX(4px);
  box-shadow: 0 4px 12px var(--shadow);
}

.event-row.type-tutoring {
  border-left: 4px solid var(--orange);
}

.event-row.type-study {
  border-left: 4px solid var(--green);
}

.event-row.type-class {
  border-left: 4px solid var(--primary);
}

.event-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.type-badge {
  min-width: 90px;
  text-align: center;
}

.event-main h4 {
  margin: 0 0 0.25rem 0;
  font-family: 'Comfortaa', sans-serif;
  color: var(--text-primary);
  font-size: 1rem;
}

.event-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
  flex-wrap: wrap;
}

.event-meta span {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.event-actions {
  display: flex;
  gap: 0.5rem;
}

.loading-state {
  padding: 3rem;
  text-align: center;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--border);
}

.delete-confirm {
  text-align: center;
  padding: 1rem;
}

.delete-confirm .warning {
  color: var(--red);
  font-size: 0.9rem;
}

.delete-confirm .actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .event-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .event-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>