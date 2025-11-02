<template>
  <div class="tab-content">
    <!-- Cards -->
     <section class="catalog-section">
      <h2><OhVueIcon name="oi-reload" /> {{ $t('components.tabs.feedback.loading.title') }}</h2>
      <p class="section-description">{{ $t('components.tabs.feedback.loading.description') }}</p>
      
      <div class="component-demo">
        <div class="loading-grid">
          <div class="loading-group">
            <h4>{{ $t('components.tabs.feedback.loading.types.circle') }}</h4>
            <div class="loading-examples">
              <Loading size="sm" animation="circle" variant="secondary"/>
              <Loading size="md" animation="circle" />
              <Loading size="lg" animation="circle" variant="secondary"/>
              <Loading size="xl" animation="circle" />
            </div>
          </div>
          <div class="loading-group">
            <h4>{{ $t('components.tabs.feedback.loading.types.bounce') }}</h4>
            <div class="loading-examples">
              <Loading size="sm" animation="bounce" />
              <Loading size="md" animation="bounce" variant="secondary"/>
              <Loading size="lg" animation="bounce" />
              <Loading size="xl" animation="bounce" variant="secondary"/>
            </div>
          </div>

          <div class="loading-group">
            <h4>{{ $t('components.tabs.feedback.loading.types.withText') }}</h4>
            <div class="loading-examples">
              <Loading animation="circle" :text="$t('components.tabs.feedback.loading.text.loading')" />
              <Loading animation="bounce" :text="$t('components.tabs.feedback.loading.text.processing')" />
            </div>
          </div>

          <div class="loading-group">
            <h4>{{ $t('components.tabs.feedback.loading.types.animationSpeed') }}</h4>
            <div class="loading-examples">
              <Loading animation="circle" speed="slow" :text="$t('components.tabs.feedback.loading.text.slow')" />
              <Loading animation="circle" speed="normal" :text="$t('components.tabs.feedback.loading.text.normal')" />
              <Loading animation="circle" speed="fast" :text="$t('components.tabs.feedback.loading.text.fast')" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="catalog-section">
      <h2><OhVueIcon name="oi-task" /> {{ $t('components.tabs.layout.progress.title') }}</h2>
      <p class="section-description">{{ $t('components.tabs.layout.progress.description') }}</p>
      
      <div class="component-demo">
        <div class="progress-grid">
          <!-- Basic Progress -->
          <Card :title="$t('components.tabs.layout.progress.examples.basic')" padding="normal">
            <Progress :value="75" label="Project Completion" />
          </Card>

          <Card :title="$t('components.tabs.layout.progress.examples.variants')" padding="normal">
            <Progress :value="45" label="Primary" variant="primary" class="progress-demo" />
            <Progress :value="60" label="Secondary" variant="secondary" class="progress-demo" />
            <Progress :value="85" label="Gradient" variant="gradient" class="progress-demo" />
          </Card>


          <Card :title="$t('components.tabs.layout.progress.examples.sizes')" padding="normal">
            <Progress :value="65" label="Small" size="small" class="progress-demo" />
            <Progress :value="65" label="Medium" size="medium" class="progress-demo" />
            <Progress :value="65" label="Large" size="large" class="progress-demo" />
          </Card>

          <Card :title="$t('components.tabs.layout.progress.examples.effects')" padding="normal">
            <Progress :value="80" label="Striped" striped class="progress-demo" />
            <Progress :value="70" label="Animated Stripes" striped animated class="progress-demo" />
          </Card>

          <Card :title="$t('components.tabs.layout.progress.examples.interactive')" padding="normal">
            <Progress 
              :value="progressValue" 
              :label="`Progress: ${progressValue}%`" 
              variant="secondary" 
              striped 
              animated 
              class="progress-demo"
            />
            <div class="progress-controls">
              <Button size="small" @click="decreaseProgress" variant="secondary">
                <OhVueIcon name="fa-minus" />
              </Button>
              <span class="progress-value-display">{{ progressValue }}%</span>
              <Button size="small" @click="increaseProgress">
                <OhVueIcon name="fa-plus" />
              </Button>
            </div>
          </Card>

          <Card :title="$t('components.tabs.layout.progress.examples.withDescriptions')" padding="normal">
            <Progress 
              :value="35" 
              :label="$t('components.tabs.layout.progress.examples.title1')" 
              :description="$t('components.tabs.layout.progress.examples.description1')" 
              class="progress-demo"
            />
            <Progress 
              :value="75" 
              :label="$t('components.tabs.layout.progress.examples.title2')" 
              :description="$t('components.tabs.layout.progress.examples.description2')" 
              variant="success"
              class="progress-demo"
            />
          </Card>
        </div>
      </div>
    </section>

    <section class="catalog-section">
      <h2><OhVueIcon name="bi-card-checklist" /> {{ $t('components.tabs.layout.lists.title') }}</h2>
      <p class="section-description">{{ $t('components.tabs.layout.lists.description') }}</p>
      
      <div class="component-demo">
        <div class="lists-grid">

          <Card :title="$t('components.tabs.layout.lists.examples.basic')" padding="normal">
            <List :items="basicListItems" />
          </Card>

          <Card :title="$t('components.tabs.layout.lists.examples.ordered')" padding="normal">
            <List :items="orderedListItems" :ordered="true" />
          </Card>

          <Card :title="$t('components.tabs.layout.lists.examples.clickable')" padding="normal">
            <List 
              :items="clickableListItems" 
              :clickable="true" 
              @item-click="handleListItemClick"
            />
          </Card>

          <Card :title="$t('components.tabs.layout.lists.examples.styled')" padding="normal">
            <List 
              :items="styledListItems" 
              :striped="true"
              :bordered="true"
              variant="primary"
            />
          </Card>

          <Card :title="$t('components.tabs.layout.lists.examples.customBullet')" padding="normal">
            <List 
              :items="customBulletListItems" 
              :custom-bullet="customBulletImage"
              :divided="true"
            />
          </Card>
        </div>
      </div>
      <div class="component-demo">
        <Card :title="$t('components.tabs.layout.lists.examples.withActions')" padding="normal">
          <List 
            :items="actionListItems" 
            :divided="true"
            @action-click="handleListActionClick"
          />
        </Card>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Loading from '@/components/ui/Loading.vue'
import List from '@/components/ui/List.vue'
import Progress from '@/components/ui/Progress.vue'

const { t } = useI18n()

const progressValue = ref(50)

const increaseProgress = () => {
  if (progressValue.value < 100) {
    progressValue.value += 10
  }
}

const decreaseProgress = () => {
  if (progressValue.value > 0) {
    progressValue.value -= 10
  }
}

const handleCardClick = () => {
  console.log('Card clicked!')
}

const handleListItemClick = (event) => {
  console.log('List item clicked:', event)
}

const handleListActionClick = (event) => {
  console.log('List action clicked:', event)
}

const basicListItems = computed(() => [
  { id: 1, text: t('components.tabs.layout.lists.items.basic.item1') },
  { id: 2, text: t('components.tabs.layout.lists.items.basic.item2'), description: t('components.tabs.layout.lists.items.basic.item2Description') },
  { id: 3, text: t('components.tabs.layout.lists.items.basic.item3'), meta: t('components.tabs.layout.lists.items.basic.item3Meta') },
  { id: 4, text: t('components.tabs.layout.lists.items.basic.item4'), icon: 'oi-check' }
])

const orderedListItems = computed(() => [
  { id: 1, text: t('components.tabs.layout.lists.items.ordered.item1') },
  { id: 2, text: t('components.tabs.layout.lists.items.ordered.item2'), description: t('components.tabs.layout.lists.items.ordered.item2Description') },
  { id: 3, text: t('components.tabs.layout.lists.items.ordered.item3') }
])

const clickableListItems = computed(() => [
  { id: 1, text: t('components.tabs.layout.lists.items.clickable.item1') },
  { id: 2, text: t('components.tabs.layout.lists.items.clickable.item2'), description: t('components.tabs.layout.lists.items.clickable.item2Description') },
  { id: 3, text: t('components.tabs.layout.lists.items.clickable.item3'), disabled: true },
  { id: 4, text: t('components.tabs.layout.lists.items.clickable.item4') }
])

const actionListItems = computed(() => [
  { 
    id: 1, 
    text: t('components.tabs.layout.lists.items.withActions.item1'), 
    description: t('components.tabs.layout.lists.items.withActions.item1Description'),
    actions: [
      { id: 'edit', label: t('components.tabs.layout.lists.actions.edit'), variant: 'secondary', icon: 'oi-pencil' },
      { id: 'delete', label: t('components.tabs.layout.lists.actions.delete'), variant: 'danger', icon: 'oi-ri-delete-back-2-line' }
    ]
  },
  { 
    id: 2, 
    text: t('components.tabs.layout.lists.items.withActions.item2'), 
    description: t('components.tabs.layout.lists.items.withActions.item2Description'),
    actions: [
      { id: 'view', label: t('components.tabs.layout.lists.actions.view'), variant: 'primary' },
      { id: 'share', label: t('components.tabs.layout.lists.actions.share'), variant: 'secondary' }
    ]
  }
])

const styledListItems = computed(() => [
  { id: 1, text: t('components.tabs.layout.lists.items.styled.item1'), description: t('components.tabs.layout.lists.items.styled.item1Description') },
  { id: 2, text: t('components.tabs.layout.lists.items.styled.item2'), description: t('components.tabs.layout.lists.items.styled.item2Description') },
  { id: 3, text: t('components.tabs.layout.lists.items.styled.item3'), description: t('components.tabs.layout.lists.items.styled.item3Description') }
])

const customBulletListItems = computed(() => [
  { id: 1, text: t('components.tabs.layout.lists.items.customBullet.item1') },
  { id: 2, text: t('components.tabs.layout.lists.items.customBullet.item2'), description: t('components.tabs.layout.lists.items.customBullet.item2Description') },
  { id: 3, text: t('components.tabs.layout.lists.items.customBullet.item3') }
])

const customBulletImage = '/src/assets/icons/bullet.gif'
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
  font-size: 1.75rem;
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

.loading-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.loading-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.loading-group h4 {
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
}

.loading-examples {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  padding: 1rem;
  background: var(--surface-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-primary);
}

.progress-demo {
  margin-bottom: 1rem;
}

.progress-demo:last-child {
  margin-bottom: 0;
}

.progress-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.progress-value-display {
  font-weight: 600;
  color: var(--text-primary);
  min-width: 3rem;
  text-align: center;
}

@media (max-width: 768px) {
  .catalog-section {
    padding: 1rem;
  }
  
  .cards-grid,
  .lists-grid,
  .progress-grid {
    grid-template-columns: 1fr;
  }
  
  .progress-controls {
    flex-direction: column;
    gap: 0.5rem;
  }

  .loading-examples {
    gap: 1rem;
  }
  
}
</style>