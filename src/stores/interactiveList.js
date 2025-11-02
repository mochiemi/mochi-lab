import { defineStore } from 'pinia'

export const useInteractiveListStore = defineStore('interactiveList', {
  state: () => ({
    items: []
  }),

  actions: {
    addItem(text) {
      this.items.push({
        id: Date.now().toString(),
        text,
        completed: false,
        createdAt: new Date().toISOString()
      })
      this.saveToStorage()
    },

    removeItem(index) {
      this.items.splice(index, 1)
      this.saveToStorage()
    },

    toggleItem(index) {
      this.items[index].completed = !this.items[index].completed
      this.saveToStorage()
    },

    saveToStorage() {
      if (typeof window !== 'undefined') {
        localStorage.setItem('interactiveList', JSON.stringify(this.items))
      }
    },

    loadFromStorage() {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('interactiveList')
        if (stored) {
          this.items = JSON.parse(stored)
        }
      }
    },

    clearCompleted() {
      this.items = this.items.filter(item => !item.completed)
      this.saveToStorage()
    },

    clearAll() {
      this.items = []
      this.saveToStorage()
    }
  }
})