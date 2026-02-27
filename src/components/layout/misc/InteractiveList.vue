<template>
  <div class="interactive-list">
    <header>
      <h1>
        <OhVueIcon name="bi-card-checklist" class="header-icon" />
        {{ $t('interactiveList.title') }}
      </h1>
      <p class="description">{{ $t('interactiveList.description') }}</p>
      <p v-if="$t('interactiveList.subDescription') !== 'interactiveList.subDescription'" class="sub-description">
        {{ $t('interactiveList.subDescription') }}
      </p>
    </header>

    <div class="toolbar">
      <div class="toolbar-group">
        <Tooltip :content="$t('interactiveList.tooltips.sort')" position="bottom">
          <Button 
            variant="primary" 
            size="medium"
            @click="toggleSort"
          >
            {{ $t(`interactiveList.sort.${sortOrder}`) }}
          </Button>
        </Tooltip>

        <Tooltip :content="$t('interactiveList.tooltips.filter')" position="bottom">
          <Button 
            variant="secondary" 
            size="medium"
            @click="showFilters = !showFilters"
          >
            <OhVueIcon name="hi-solid-selector" class="tool-icon"/>
            {{ $t('interactiveList.filter') }}
          </Button>
        </Tooltip>

        <Tooltip :content="$t('interactiveList.tooltips.export')" position="bottom">
          <Button 
            variant="secondary" 
            size="medium"
            @click="exportList('view')"
          >
            <OhVueIcon name="hi-document-download" class="tool-icon"/>
          </Button> 
        </Tooltip>

        <Tooltip :content="$t('interactiveList.tooltips.addTask')" position="bottom">
          <Button 
            class="add-btn"
            variant="primary" 
            size="medium"
            @click="openAddModal"
          >
            <OhVueIcon name="fa-plus" class="add-icon"/>
            {{ $t('interactiveList.add') }}
          </Button>
        </Tooltip>
      </div>

      <div class="stats-simple">
        <Tooltip :content="$t('interactiveList.stats.totalTooltip')" position="top" :delay="300">
          <Badge variant="lavender" size="medium">
            <OhVueIcon name="oi-list" /> Total: {{ totalCount }}
          </Badge>
        </Tooltip>
        
        <Tooltip :content="$t('interactiveList.stats.completedTooltip')" position="top" :delay="300">
          <Badge variant="mint" size="medium">
            <OhVueIcon name="oi-check" /> {{ completedCount }}
          </Badge>
        </Tooltip>
        
        <Tooltip :content="$t('interactiveList.stats.pendingTooltip')" position="top" :delay="300">
          <Badge variant="peach" size="medium">
            <OhVueIcon name="hi-clock" /> {{ pendingCount }}
          </Badge>
        </Tooltip>
        <Tooltip :content="$t('interactiveList.tooltips.clear')" position="bottom">
          <Button 
            variant="danger" 
            size="medium"
            @click="clearCompleted"
            :disabled="completedCount === 0"
          >
            <OhVueIcon name="hi-trash" class="trash-icon"/>
          </Button>
        </Tooltip>
      </div>
    </div>

    <transition name="slide-fade">
      <div v-if="showFilters" class="filters-panel">
        <h4>{{ $t('interactiveList.filters.title') }}</h4>
        <div class="filters-grid">
          <Checkbox 
            v-model="filters.showCompleted" 
            :label="$t('interactiveList.filters.showCompleted')"
          />
          <Checkbox 
            v-model="filters.showPending" 
            :label="$t('interactiveList.filters.showPending')"
          />
          <div class="filter-search">
            <div class="search-wrapper">
              <OhVueIcon name="bi-search-heart" class="search-icon" />
              <Input
                v-model="filters.searchText"
                :placeholder="$t('interactiveList.filters.search')"
                size="small"
                class="search-input"
              />
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition-group name="list" tag="div" class="list-container">
      <Card 
        v-for="item in filteredItems" 
        :key="item.id"
        :class="['list-item-card', `priority-${item.priority}`, { 'item-completed': item.completed }]"
        :flat="false"
        :padding="'small'"
      >
        <div class="list-item-content">
          <div class="item-main">
            <div class="item-check">
              <Checkbox
                :model-value="item.completed"
                @update:model-value="toggleItem(item.id)"
                size="medium"
              />
            </div>
            
            <div class="item-details">
              <div class="item-header">
                <span class="item-text" :class="{ 'completed-text': item.completed }">
                  {{ item.text }}
                </span>
                
                <Tooltip 
                  :content="$t(`interactiveList.tooltips.priority.${item.priority}`)" 
                  position="top" 
                  :delay="200"
                >
                  <Badge 
                    :variant="getPriorityVariant(item.priority, item.completed)" 
                    size="small"
                    class="priority-badge"
                    :outlined="item.completed"
                  >
                    {{ $t(`interactiveList.priority.${item.priority}`) }}
                  </Badge>
                </Tooltip>
              </div>
              
              <div class="item-metadata">
                <span class="item-date">
                  <OhVueIcon name="hi-clock" />
                  {{ formatDate(item.createdAt) }}
                </span>
                <span v-if="item.completedAt" class="item-date">
                  <OhVueIcon name="oi-check" />
                  {{ formatDate(item.completedAt) }}
                </span>
              </div>

              <div v-if="item.notes" class="item-notes">
                <OhVueIcon name="oi-comment" />
                {{ item.notes }}
              </div>
            </div>
          </div>

          <div class="item-actions">
            <Tooltip :content="$t('interactiveList.tooltips.edit')" position="top">
              <Button 
                variant="phantom" 
                size="medium"
                @click.stop="openEditModal(item)"
                class="action-button"
              >
                <OhVueIcon name="oi-pencil" class="action-icon"/>
              </Button>
            </Tooltip>
            
            <Tooltip :content="$t('interactiveList.tooltips.duplicate')" position="top">
              <Button 
                variant="phantom" 
                size="medium"
                @click.stop="duplicateItem(item)"
                class="action-button"
              >
                <OhVueIcon name="md-addbox-outlined" class="action-icon"/>
              </Button>
            </Tooltip>
            
            <Tooltip :content="$t('interactiveList.tooltips.delete')" position="top" variant="secondary">
              <Button 
                variant="danger" 
                size="small"
                @click.stop="confirmRemove(item.id)"
              >
                <OhVueIcon name="ri-delete-back-2-line" />
              </Button>
            </Tooltip>
          </div>
        </div>
      </Card>
    </transition-group>

    <div v-if="filteredItems.length === 0" class="empty-state">
      <OhVueIcon name="bi-card-checklist" class="empty-icon" />
      <h3>{{ $t('interactiveList.empty.title') }}</h3>
      <p>{{ $t('interactiveList.empty.message') }}</p>
      <div class="empty-actions">
        <Button v-if="hasFilters" variant="secondary" @click="resetFilters">
          <OhVueIcon name="oi-x-circle" />
          {{ $t('interactiveList.empty.clearFilters') }}
        </Button>
        <Button variant="primary" @click="openAddModal">
          <OhVueIcon name="fa-plus" />
          {{ $t('interactiveList.add') }}
        </Button>
      </div>
    </div>

    <Modal
      v-model:show="showModal"
      :title="isEditing ? $t('interactiveList.modal.edit') : $t('interactiveList.modal.add')"
      size="md"
      :closable="true"
      :close-on-overlay="true"
      @close="closeModal"
    >
      <div class="modal-form">
        <div class="form-group">
          <Input
            id="modal-text"
            v-model="modalForm.text"
            :label="$t('interactiveList.modal.taskLabel')"
            :placeholder="$t('interactiveList.modal.taskPlaceholder')"
            :error="modalFormError"
            @keyup.enter="saveModal"
          />
        </div>
        
        <div class="form-group">
          <Textarea
            id="modal-notes"
            v-model="modalForm.notes"
            :label="$t('interactiveList.modal.notesLabel')"
            :placeholder="$t('interactiveList.modal.notesPlaceholder')"
            rows="4"
          />
        </div>
        
        <div class="form-group">
          <Select
            id="modal-priority"
            v-model="modalForm.priority"
            :label="$t('interactiveList.modal.priorityLabel')"
            :options="priorityOptions"
          />
        </div>
      </div>

      <template #footer>
        <Button variant="secondary" @click="closeModal">
          {{ $t('common.cancel') }}
        </Button>
        <Button 
          variant="primary" 
          @click="saveModal" 
          :disabled="!isModalFormValid"
        >
          {{ isEditing ? $t('common.save') : $t('common.add') }}
        </Button>
      </template>
    </Modal>

    <Toast
      v-model="showToast"
      :type="toastType"
      :position="'bottom-center'"
      :auto-close="2000"
      dismissible
    >
      {{ toastMessage }}
    </Toast>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, reactive } from 'vue'
import { useInteractiveListStore, type ListItem } from '@/stores/useInteractiveListStore'
import { useI18n } from 'vue-i18n'
import { OhVueIcon } from 'oh-vue-icons'
import Input from '@/components/ui/Input.vue'
import Textarea from '@/components/ui/Textarea.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Card from '@/components/ui/Card.vue'
import Checkbox from '@/components/ui/Checkbox.vue'
import Tooltip from '@/components/ui/Tooltip.vue'
import Toast from '@/components/ui/Toast.vue'
import Modal from '@/components/ui/Modal.vue'
import Select from '@/components/ui/Select.vue'

type Priority = 'low' | 'medium' | 'high'
type ToastType = 'success' | 'warning' | 'info' | 'error'

const { t , locale } = useI18n()
const listStore = useInteractiveListStore()

interface ModalForm {
  text: string
  notes: string
  priority: Priority
}

const sortOrder = ref<'asc' | 'desc'>('asc')
const showFilters = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const editingItem = ref<ListItem | null>(null)
const modalForm = reactive<ModalForm>({
  text: '',
  notes: '',
  priority: 'medium'
})
const modalFormError = ref('')
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<ToastType>('success')

interface Filters {
  showCompleted: boolean
  showPending: boolean
  searchText: string
}

const filters = ref<Filters>({
  showCompleted: true,
  showPending: true,
  searchText: ''
})

const priorityOptions = computed(() => [
  { value: 'low', label: `🟢 ${t('interactiveList.priority.low')}` },
  { value: 'medium', label: `🟡 ${t('interactiveList.priority.medium')}` },
  { value: 'high', label: `🔴 ${t('interactiveList.priority.high')}` }
])

const listItems = computed(() => listStore.items)

const filteredItems = computed(() => {
  return listItems.value
    .filter((item: ListItem) => {
      if (!filters.value.showCompleted && item.completed) return false
      if (!filters.value.showPending && !item.completed) return false
      
      if (filters.value.searchText) {
        const search = filters.value.searchText.toLowerCase()
        return item.text.toLowerCase().includes(search) ||
            (item.notes && item.notes.toLowerCase().includes(search))
      }
      
      return true
    })
    .sort((a: ListItem, b: ListItem) => {
      const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 }
      if (sortOrder.value === 'asc') {
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      } else {
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
    })
})

const totalCount = computed(() => listItems.value.length)

const completedCount = computed(() => 
  listItems.value.filter((item: ListItem) => item.completed).length
)

const pendingCount = computed(() => 
  listItems.value.filter((item: ListItem) => !item.completed).length
)

const isModalFormValid = computed(() => 
  modalForm.text.trim().length >= 3
)

const hasFilters = computed(() => 
  !filters.value.showCompleted || 
  !filters.value.showPending || 
  filters.value.searchText !== ''
)

const openAddModal = () => {
  isEditing.value = false
  editingItem.value = null
  modalForm.text = ''
  modalForm.notes = ''
  modalForm.priority = 'medium'
  modalFormError.value = ''
  showModal.value = true
}

const openEditModal = (item: ListItem) => {
  isEditing.value = true
  editingItem.value = item
  modalForm.text = item.text
  modalForm.notes = item.notes || ''
  modalForm.priority = item.priority
  modalFormError.value = ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingItem.value = null
  modalForm.text = ''
  modalForm.notes = ''
  modalForm.priority = 'medium'
  modalFormError.value = ''
}

const saveModal = () => {
  if (!isModalFormValid.value) {
    modalFormError.value = t('interactiveList.errors.minLength')
    return
  }
  
  if (isEditing.value && editingItem.value) {
    listStore.updateItemById(editingItem.value.id, {
      text: modalForm.text.trim(),
      notes: modalForm.notes.trim(),
      priority: modalForm.priority
    })
    showToastMessage(t('interactiveList.messages.updated'), 'success')
  } else {
    listStore.addItem({
      text: modalForm.text.trim(),
      priority: modalForm.priority,
      notes: modalForm.notes.trim(),
      createdAt: new Date().toISOString()
    })
    showToastMessage(t('interactiveList.messages.added'), 'success')
  }
  
  closeModal()
}

const toggleItem = (id: string) => {
  listStore.toggleItemById(id)
  const item = listItems.value.find((i: ListItem) => i.id === id)
  if (item) {
    showToastMessage(
      item.completed ? t('interactiveList.messages.completed') : t('interactiveList.messages.pending'),
      'info'
    )
  }
}

const confirmRemove = (id: string) => {
  if (confirm(t('interactiveList.confirm.delete'))) {
    listStore.removeItemById(id)
    showToastMessage(t('interactiveList.messages.deleted'), 'warning')
  }
}

const duplicateItem = (item: ListItem) => {
  listStore.addItem({
    text: `${item.text} (${t('interactiveList.copy')})`,
    priority: item.priority,
    notes: item.notes,
    createdAt: new Date().toISOString()
  })
  showToastMessage(t('interactiveList.messages.duplicated'), 'success')
}

const toggleSort = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

const clearCompleted = () => {
  if (confirm(t('interactiveList.confirm.clearCompleted'))) {
    listStore.clearCompleted()
    showToastMessage(t('interactiveList.messages.cleared'), 'success')
  }
}

const exportList = (mode: 'view' | 'download' = 'view') => {
  const now = new Date().toLocaleString(locale.value === 'pt-BR' ? 'pt-BR' : 'en-US')
  const stats = listStore.getStats()
  
  const texts = {
    title: t('interactiveList.export.title'),
    exportedAt: t('interactiveList.export.exportedAt'),
    total: t('interactiveList.export.stats.total'),
    completed: t('interactiveList.export.stats.completed'),
    pending: t('interactiveList.export.stats.pending'),
    priority: t('interactiveList.export.stats.priority'),
    highPriority: t('interactiveList.export.stats.highPriority'),
    mediumPriority: t('interactiveList.export.stats.mediumPriority'),
    lowPriority: t('interactiveList.export.stats.lowPriority'),
    created: t('interactiveList.export.created'),
    completedLabel: t('interactiveList.export.completed'),
    print: t('interactiveList.export.print'),
    close: t('interactiveList.export.close'),
    footer: t('interactiveList.export.footer'),
    priorityLabels: {
      low: t('interactiveList.priority.low'),
      medium: t('interactiveList.priority.medium'),
      high: t('interactiveList.priority.high')
    }
  }

  const htmlContent = `<!DOCTYPE html>
<html lang="${locale.value}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${texts.title} - ${new Date().toLocaleDateString(locale.value === 'pt-BR' ? 'pt-BR' : 'en-US')}</title>
    <style>
        body { 
            font-family: 'Tahoma', sans-serif; 
            max-width: 800px; 
            margin: 2em auto; 
            padding: 0 1em;
            background: #f5f7fa;
            color: #333;
            line-height: 1.6;
            min-height: 100vh;
        }
        .container {
            background: white;
            border: 2px dashed #111; 
            padding: 2em;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        h1 { 
            font-family:'Brush Script MT', cursive;
            color: #162242; 
            border-bottom: 2px solid #16bdff; 
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5em;
            margin-top: 0;
            font-size: 1.8em;
        }
        .stats { 
            background: #967aa1;
            color: white;
            padding: 1em; 
            border-top: 2px dashed #000; 
            border-bottom: 2px dashed #000; 
            margin-bottom: 1.5em;
            display: flex;
            justify-content: center;
            gap: 1.5em;
            flex-wrap: wrap;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .stat-item { font-weight: 600; font-size: 0.95em; }
        ul { list-style: none; padding: 0; margin: 0; }
        li { 
            margin-bottom: 1em; 
            padding: 1em; 
            background: #fafafa;
            border-bottom: 2px dashed #111; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            transition: all 0.2s;
        }
        li:hover { 
            transform: translateX(3px); 
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .task-row {
            display: flex;
            align-items: flex-start;
            gap: 1em;
        }
        .checkbox-wrapper {
            flex-shrink: 0;
            margin-top: 0.2em;
        }
        .custom-checkbox {
            width: 24px;
            height: 24px;
            border: 3px solid #555;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-weight: bold;
            transition: all 0.2s;
            cursor: default;
            user-select: none;
        }
        .custom-checkbox.checked {
            background: #00ad88;
            border-color: #00695c;
            color: white;
        }
        .custom-checkbox.unchecked {
            background: white;
            color: transparent;
        }
        
        .task-content {
            flex: 1;
        }
        .task-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center;
            margin-bottom: 0.3em;
            flex-wrap: wrap;
            gap: 0.5em;
        }
        .task-text {
            font-size: 1.1em;
            font-weight: 500;
            flex: 1;
        }
        .task-text.completed {
            text-decoration: line-through;
            color: #888;
            opacity: 0.8;
        }
        .priority-badge { 
            padding: 0.25em 0.75em; 
            border-radius: 10px; 
            font-size: 0.75em; 
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .priority-high { border-left-color: #d33f3f; }
        .priority-high .priority-badge { background: #ffebee; color: #c62828; }
        .priority-medium { border-left-color: #eb820a; }
        .priority-medium .priority-badge { background: #fff3e0; color: #ef6c00; }
        .priority-low { border-left-color: #00ad88; }
        .priority-low .priority-badge { background: #e8f5e9; color: #2e7d32; }
        
        .notes { 
            margin-top: 0.5em; 
            padding: 0.75em; 
            background: #f0f4f8; 
            font-size: 0.9em;
            color: #555;
            border-left: 3px solid #111;
        }
        .metadata { 
            margin-top: 0.5em; 
            font-size: 0.8em; 
            color: #888;
            display: flex;
            gap: 1em;
            flex-wrap: wrap;
        }
        .actions {
            margin-top: 2em;
            padding-top: 1.5em;
            border-top: 2px dashed #ddd;
            display: flex;
            gap: 1em;
            justify-content: center;
        }
        .btn {
            padding: 0.75em 1.5em;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1em;
            font-weight: 600;
            transition: all 0.2s;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 0.5em;
        }
        .btn-primary {
            background: #ff559c;
            color: white;
        }
        .btn-primary:hover {
            background: #0099ff;
            transform: translateY(-2px);
            box-shadow: 0 2px 6px rgba(22, 189, 255, 0.3);
        }
        .btn-secondary {
            background: #f0f0f0;
            color: #333;
        }
        .btn-secondary:hover {
            background: #e0e0e0;
        }
        .footer { 
            margin-top: 3em; 
            text-align: center; 
            color: #999;
            font-size: 0.9em;
        }
        @media print {
            body { background: white; }
            .container { box-shadow: none; padding: 0; }
            .actions { display: none; }
            li { break-inside: avoid; box-shadow: none; border-bottom: 2px dashed #555; }
            .stats { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
        @media (max-width: 600px) {
            .container { padding: 0.5em; }
            .stats { gap: 0.75em; font-size: 0.9em; }
            .task-header { flex-direction: column; align-items: flex-start; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📋 ${texts.title}</h1>
        <p style="color: #666; margin-bottom: 1.5em;;">
            ${texts.exportedAt}: <strong>${now}</strong>
        </p>
        
        <div class="stats">
            <div class="stat-item">📊 ${texts.total}: ${stats.total}</div>
            <div class="stat-item">✅ ${texts.completed}: ${stats.completed}</div>
            <div class="stat-item">⏳ ${texts.pending}: ${stats.pending}</div>
        </div>

        <ul>
            ${listItems.value.map(item => {
              const priorityLabel = texts.priorityLabels[item.priority]
              return `
            <li class="priority-${item.priority}">
                <div class="task-row">
                    <div class="checkbox-wrapper">
                        <div class="custom-checkbox ${item.completed ? 'checked' : 'unchecked'}">
                            ${item.completed ? '✓' : ''}
                        </div>
                    </div>
                    <div class="task-content">
                        <div class="task-header">
                            <span class="task-text ${item.completed ? 'completed' : ''}">
                                ${item.text}
                            </span>
                            <span>${texts.priority}</span><span class="priority-badge">${priorityLabel}</span>
                        </div>
                        ${item.notes ? `<div class="notes">${item.notes}</div>` : ''}
                        <div class="metadata">
                            <span>📅 ${texts.created}: ${formatDate(item.createdAt)}</span>
                            ${item.completedAt ? `<span>✔️ ${texts.completedLabel}: ${formatDate(item.completedAt)}</span>` : ''}
                        </div>
                    </div>
                </div>
            </li>`
            }).join('')}
        </ul>

        <div class="actions">
            <button class="btn btn-primary" onclick="window.print()">
                🖨️ ${texts.print}
            </button>
            <button class="btn btn-secondary" onclick="window.close()">
                ✕ ${texts.close}
            </button>
        </div>

        <div class="footer">
            <p>${texts.footer}</p>
        </div>
    </div>
</body>
</html>`

  const blob = new Blob([htmlContent], { type: 'text/html' })
  const url = URL.createObjectURL(blob)

  if (mode === 'view') {
    const newWindow = window.open(url, '_blank')
    
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      showToastMessage(t('interactiveList.messages.exported') + ' (Download)', 'warning')
      const a = document.createElement('a')
      a.href = url
      a.download = `task-list-${new Date().toISOString().split('T')[0]}.html`
      a.click()
    } else {
      showToastMessage(t('interactiveList.messages.exported'), 'success')
    }
    
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  } else {
    const a = document.createElement('a')
    a.href = url
    a.download = `task-list-${new Date().toISOString().split('T')[0]}.html`
    a.click()
    URL.revokeObjectURL(url)
    showToastMessage(t('interactiveList.messages.exported'), 'success')
  }
}

const resetFilters = () => {
  filters.value = {
    showCompleted: true,
    showPending: true,
    searchText: ''
  }
}

const showToastMessage = (message: string, type: ToastType = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
}

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const getPriorityVariant = (priority: Priority, completed: boolean = false): string => {
  if (completed) {
    return 'success'
  }
  
  const variants: Record<Priority, string> = {
    low: 'mint',
    medium: 'peach',
    high: 'coral'
  }
  return variants[priority] || 'info'
}

watch(() => modalForm.text, (value: string) => {
  if (value.trim().length > 0 && value.trim().length < 3) {
    modalFormError.value = t('interactiveList.errors.minLength')
  } else {
    modalFormError.value = ''
  }
})

onMounted(() => {
  listStore.loadFromStorage()
})
</script>

<style scoped>
.interactive-list {
  max-width: 1000px;
  margin: 0 auto;
}

header {
  text-align: center;
  margin-bottom: 2em;
}

.header-icon{
  color: var(--strong-rose);
  margin: 0 0.5em;
  transform: scale(3) !important;
}

.description {
  color: var(--text-secondary);
  font-size: 1.1em;
}

.sub-description {
  color: var(--text-secondary);
  font-size: 0.9em;
  font-style: italic;
  margin-top: 0.5em;
  opacity: 0.8;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5em;
  padding: 1em;
  background: var(--surface-primary);
  border-radius: 12px;
  border: 2px dashed var(--border-secondary);
  flex-wrap: wrap;
  gap: 1em;
}

.toolbar-group {
  display: flex;
  gap: 0.5em;
  flex-wrap: wrap;
}

.tool-icon {
  margin: 0.4em;
  transform: scale(1.5);
}

.trash-icon {
  transform: scale(1.4);
}

.add-icon {
  margin: 0.4em;
  margin-right: 0.5em;
}

.add-btn {
  padding-right: 1.5em;
}

.stats-simple {
  display: flex;
  gap: 0.5em;
  align-items: center;
  justify-content: center;
}

.filters-panel {
  background: var(--surface-secondary);
  padding: 1em;
  border-radius: 8px;
  margin-bottom: 1.5em;
  border: 2px solid var(--border-primary);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1em;
  margin-top: 1em;
}

.filter-search {
  grid-column: 1 / -1;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  top: 0.5em;
  left: 0.5em;
  color: var(--strong-rose);
  transform: scale(1.6) !important;
  z-index: 1;
}

.search-input {
  padding-left: 2.5em;
  width: 100%;
}

.list-container {
  display: flex;
  flex-direction: column;
  gap: 0.75em;
}

.list-item-card {
  transition: all 0.3s ease;
  border-width: 2px;
}

.list-item-card:hover {
  background-color: var(--sky-blue-surface);
  box-shadow: 0 4px 15px var(--shadow-hover);
}

.list-item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1em;
}

.item-main {
  display: flex;
  align-items: flex-start;
  gap: 1em;
  flex: 1;
}

.item-details {
  flex: 1;
}

.item-header {
  display: flex;
  align-items: center;
  gap: 0.5em;
  font-size: 1.5em;
  flex-wrap: wrap;
  margin-bottom: 0.25em;
}

.item-text {
  font-size: 1.1em;
  font-weight: 500;
  color: var(--text-primary);
}

.completed-text {
  text-decoration: line-through;
  opacity: 0.7;
  color: var(--text-secondary);
}

.priority-badge {
  font-size: 0.8em;
  cursor: help;
}

.item-metadata {
  display: flex;
  gap: 1em;
  font-size: 0.8em; 
  color: var(--text-secondary);
  margin-bottom: 0.5em;
}

.item-date {
  display: flex;
  align-items: center;
  gap: 0.25em;
}

.item-notes {
  font-size: 0.9em;
  color: var(--text-secondary);
  background: var(--inner-surface);
  padding: 0.25em 0.5em;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.item-actions {
  display: flex;
  gap: 0.25em;
}

.action-button {
  box-shadow: none !important;
}

.action-icon {
  color: var(--rose);
  transform: scale(2) !important;
  transition: 0.3s all ease;
}

.action-icon:hover {
  color: var(--sky-blue);
}

.priority-high {
  border-left: 6px solid var(--red);
}

.priority-medium {
  border-left: 6px solid var(--yellow);
}

.priority-low {
  border-left: 6px solid var(--green);
}

.item-completed {
  opacity: 0.8;
  background: var(--surface-secondary);
}

.empty-state {
  text-align: center;
  padding: 3em;
  color: var(--text-secondary);
  background: var(--surface-primary);
  border-radius: 12px;
  border: 2px dashed var(--border);
}

.empty-icon {
  color: var(--border);
  margin-bottom: 1em;
  transform: scale(3) !important;
}

.empty-actions {
  display: flex;
  gap: 1em;
  justify-content: center;
  margin-top: 1em;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1.5em;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.list-move {
  transition: transform 0.3s ease;
}

@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-group {
    justify-content: center;
  }

  .stats-simple {
    justify-content: center;
  }

  .list-item-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .item-actions {
    align-self: flex-end;
    margin-top: 0.5em;
  }

  .empty-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .item-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .item-metadata {
    flex-direction: column;
    gap: 0.25em;
  }
}
</style>