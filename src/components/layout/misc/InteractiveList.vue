<template>
  <div class="interactive-list">
    <header>  
    <h1>{{$t('interactiveList.title')}}</h1>
    <p class="description">{{ $t('interactiveList.description') }}</p>
    </header>
    <div class="list-controls">
      <Input
        v-model="newItemText"
        :placeholder="$t('interactiveList.placeholder')"
        @keyup.enter="addItem"
        class="add-input"
      />
      <Button @click="addItem" variant="primary" :disabled="!newItemText.trim()">
        <OhVueIcon name="md-playlistadd-round" />
        {{$t('interactiveList.add')}}
      </Button>
    </div>

    <List
      :items="listItems" 
      :custom-bullet="customBulletImage"
      :clickable="true"
      :divided="true"
      @item-click="toggleItem"
    >
      <template #actions="{ item, index }">
        <Tooltip :content="item.completed ? undo : done" position="top">
        <Button 
          :variant="item.completed ? 'outline' : 'primary'"
          size="small"
          @click.stop="toggleItem(item, index)"
        >
          <OhVueIcon :name="item.completed ? 'fa-redo-alt' : 'oi-check'" />
        </Button>
      </Tooltip>
      <Tooltip :content="$t('interactiveList.delete')" position="top" variant="secondary">
        <Button 
          variant="secondary" 
          size="small"
          @click.stop="removeItem(index)"
        >
          <OhVueIcon name="ri-delete-back-2-line" />
        </Button>
      </Tooltip>
      </template>
    </List>

    <div v-if="listItems.length === 0" class="empty-state">
      <OhVueIcon name="bi-card-checklist" class="empty-icon" />
      <p>{{$t("interactiveList.noitem")}}</p>
    </div>

    <div v-else class="list-stats">
      <Badge variant="success">
        Total: {{ listItems.length }}
      </Badge>
      <Badge variant="primary">
        {{$t('interactiveList.concluded')}}: {{ completedCount }}
      </Badge>
      <Badge variant="secondary">
        {{$t('interactiveList.pending')}}: {{ pendingCount }}
      </Badge>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useInteractiveListStore } from '@/stores/interactiveList'
import List from '@/components/ui/List.vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Tooltip from '@/components/ui/Tooltip.vue'
import { OhVueIcon } from 'oh-vue-icons'
import { useI18n } from 'vue-i18n'
import customBulletImage from '@/assets/icons/bullet.gif'

const { t } = useI18n()
const done = computed(() => t('interactiveList.done'))
const undo = computed(() => t('interactiveList.undo'))
const concluded = computed(() => t('interactiveList.concluded'))
const pending = computed(() => t('interactiveList.pending'))

const listStore = useInteractiveListStore()
const newItemText = ref('')

const listItems = computed(() => 
  listStore.items.map(item => ({
    ...item,
    icon: item.completed ? 'md-checkcircleoutline' : 'md-radiobuttonunchecked',
    text: item.text,
    meta: item.completed ? concluded : pending
  }))
)

const completedCount = computed(() => 
  listStore.items.filter(item => item.completed).length
)

const pendingCount = computed(() => 
  listStore.items.filter(item => !item.completed).length
)

const addItem = () => {
  if (newItemText.value.trim()) {
    listStore.addItem(newItemText.value.trim())
    newItemText.value = ''
  }
}

const removeItem = (index) => {
  listStore.removeItem(index)
}

const toggleItem = (item, index) => {
  listStore.toggleItem(index)
}

onMounted(() => {
  listStore.loadFromStorage()
})
</script>

<style scoped>
.interactive-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.interactive-list header {
  text-align: center;
}

.list-controls {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  justify-content: center;
}

.add-input {
  flex: 1;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.empty-icon {
  color: var(--border);
  margin-bottom: 1rem;
  transform: scale(3);
}

.list-stats {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .list-controls {
    flex-direction: column;
    align-items: center;
  }

  .list-controls .add-input{
    align-self: stretch;
  }
}

@media (max-width: 480px) {
  .list-stats {
    flex-direction: column;
    align-items: center;
  }
}
</style>