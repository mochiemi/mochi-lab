import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export interface ListItem {
  id: string
  text: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  notes: string
  createdAt: string
  completedAt?: string
}

export type NewListItem = {
  text: string
  priority?: 'low' | 'medium' | 'high'
  notes?: string
  createdAt?: string
}

export const useInteractiveListStore = defineStore('interactiveList', () => {
  // Estado
  const items = ref<ListItem[]>([])

  // Carregar do localStorage
  function loadFromStorage() {
    try {
      const saved = localStorage.getItem('interactive-list')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          items.value = parsed
        }
      } else {
        // Dados de exemplo
        items.value = [
          {
            id: generateId(),
            text: 'Explorar a nova funcionalidade de notas',
            completed: false,
            priority: 'high',
            notes: 'Verificar se está funcionando com markdown',
            createdAt: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: generateId(),
            text: 'Testar os filtros da lista',
            completed: true,
            priority: 'medium',
            notes: 'Testar combinações de filtros',
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            completedAt: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: generateId(),
            text: 'Adicionar mais ícones divertidos',
            completed: false,
            priority: 'low',
            notes: 'Procurar ícones de abacaxi e capivara',
            createdAt: new Date().toISOString()
          },
          {
            id: generateId(),
            text: 'Compartilhar lista com amigos',
            completed: false,
            priority: 'medium',
            notes: 'Talvez adicionar opção de compartilhamento',
            createdAt: new Date().toISOString()
          }
        ]
      }
    } catch (e) {
      console.error('Erro ao carregar lista:', e)
      items.value = []
    }
  }

  // Salvar no localStorage
  function saveToStorage() {
    try {
      localStorage.setItem('interactive-list', JSON.stringify(items.value))
    } catch (e) {
      console.error('Erro ao salvar lista:', e)
    }
  }

  // Gerar ID único
  function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  // Adicionar item
  function addItem(itemData: NewListItem) {
    const newItem: ListItem = {
      id: generateId(),
      text: itemData.text,
      completed: false,
      priority: itemData.priority || 'medium',
      notes: itemData.notes || '',
      createdAt: itemData.createdAt || new Date().toISOString()
    }
    
    items.value.push(newItem)
    saveToStorage()
  }

  // Atualizar item por índice (mantido para compatibilidade)
  function updateItem(index: number, updates: Partial<Omit<ListItem, 'id'>>) {
    if (index >= 0 && index < items.value.length) {
      const currentItem = items.value[index]
      if (!currentItem) return
      
      items.value[index] = { 
        ...currentItem, 
        ...updates 
      }
      saveToStorage()
    }
  }

  // Atualizar item por ID (mais seguro)
  function updateItemById(id: string, updates: Partial<Omit<ListItem, 'id'>>) {
    const index = items.value.findIndex(i => i.id === id)
    if (index !== -1) {
      updateItem(index, updates)
    }
  }

  // Remover item por ID
  function removeItemById(id: string) {
    const index = items.value.findIndex(i => i.id === id)
    if (index !== -1) {
      items.value.splice(index, 1)
      saveToStorage()
    }
  }

  // Alternar estado do item por ID
  function toggleItemById(id: string) {
    const item = items.value.find(i => i.id === id)
    if (item) {
      item.completed = !item.completed
      item.completedAt = item.completed ? new Date().toISOString() : undefined
      saveToStorage()
    }
  }

  // Limpar itens concluídos
  function clearCompleted() {
    items.value = items.value.filter(item => !item.completed)
    saveToStorage()
  }

  // Reordenar itens
  function reorderItems(oldIndex: number, newIndex: number) {
    if (oldIndex >= 0 && oldIndex < items.value.length &&
        newIndex >= 0 && newIndex < items.value.length) {
      
      const newItems = [...items.value]
      const [removed] = newItems.splice(oldIndex, 1)
      if (!removed) return
      
      newItems.splice(newIndex, 0, removed)
      items.value = newItems
      saveToStorage()
    }
  }

  // Atualizar prioridade
  function updatePriority(index: number, priority: ListItem['priority']) {
    if (index >= 0 && index < items.value.length) {
      const item = items.value[index]
      if (!item) return
      
      item.priority = priority
      saveToStorage()
    }
  }

  // Buscar itens por texto
  function searchItems(query: string): ListItem[] {
    if (!query) return items.value
    const lowerQuery = query.toLowerCase()
    return items.value.filter(item => 
      item.text.toLowerCase().includes(lowerQuery) ||
      item.notes.toLowerCase().includes(lowerQuery)
    )
  }

  // Obter estatísticas
  function getStats() {
    return {
      total: items.value.length,
      completed: items.value.filter(i => i.completed).length,
      pending: items.value.filter(i => !i.completed).length,
      highPriority: items.value.filter(i => i.priority === 'high').length,
      mediumPriority: items.value.filter(i => i.priority === 'medium').length,
      lowPriority: items.value.filter(i => i.priority === 'low').length
    }
  }

  // Exportar lista
  function exportList(): string {
    return JSON.stringify(items.value, null, 2)
  }

  // Importar lista
  function importList(jsonData: string): boolean {
    try {
      const parsed = JSON.parse(jsonData)
      if (Array.isArray(parsed)) {
        items.value = parsed
        saveToStorage()
        return true
      }
      return false
    } catch {
      return false
    }
  }

  // Watch para salvar automaticamente
  watch(items, () => {
    saveToStorage()
  }, { deep: true })

  return {
    // Estado
    items,
    
    // Métodos
    loadFromStorage,
    saveToStorage,
    addItem,
    updateItem,
    updateItemById,
    removeItemById,
    toggleItemById,
    clearCompleted,
    reorderItems,
    updatePriority,
    searchItems,
    getStats,
    exportList,
    importList
  }
})