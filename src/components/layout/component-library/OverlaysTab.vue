<template>
  <div class="tab-content">
    <Modal
      v-model:show="showModal" 
      :title="$t('components.tabs.overlays.modal.title')"
      closable>
      <div class="modal-content">
        <p>{{ $t('components.tabs.overlays.modal.examples.modalContent') }}</p>
        <div class="modal-form">
          <Input :label="$t('components.tabs.overlays.modal.examples.name')" :placeholder="$t('components.tabs.overlays.modal.examples.enterName')" />
          <Input type="email" :label="$t('components.tabs.overlays.modal.examples.email')" :placeholder="$t('components.tabs.overlays.modal.examples.enterEmail')" />
        </div>
      </div>
      <template #footer>
        <div class="modal-footer">
          <Button variant="secondary" @click="showModal = false">{{ $t('components.tabs.layout.cards.examples.cancel') }}</Button>
          <Button @click="handleModalConfirm">{{ $t('components.tabs.overlays.modal.examples.confirm') }}</Button>
        </div>
      </template>
    </Modal>

    <Modal v-model:show="showLargeModal" :title="$t('components.tabs.overlays.modal.title') + ' ' + $t('components.tabs.overlays.modal.examples.large')" size="lg" closable>
      <div class="modal-content">
        <h3>{{ $t('components.tabs.overlays.modal.examples.expandedContent') }}</h3>
        <p>{{ $t('components.tabs.overlays.modal.examples.expandedContent') }}</p>
        <div class="content-grid">
          <Card :title="$t('components.tabs.overlays.modal.examples.card1')" padding="normal">
            <p>{{ $t('components.tabs.overlays.modal.examples.card1Content') }}</p>
          </Card>
          <Card :title="$t('components.tabs.overlays.modal.examples.card2')" padding="normal">
            <p>{{ $t('components.tabs.overlays.modal.examples.card2Content') }}</p>
          </Card>
        </div>
      </div>
    </Modal>

    <section class="catalog-section">
      <h2><OhVueIcon name="bi-window" /> {{ $t('components.tabs.overlays.modal.title') }}</h2>
      <p class="section-description">{{ $t('components.tabs.overlays.modal.description') }}</p>
      
      <div class="component-demo">
        <div class="demo-controls">
          <Button @click="showModal = true">{{ $t('components.tabs.overlays.modal.examples.basic') }}</Button>
          <Button @click="showLargeModal = true" variant="secondary">{{ $t('components.tabs.overlays.modal.examples.large') }}</Button>
        </div>
      </div>
    </section>

    <section class="catalog-section">
      <h2><OhVueIcon name="hi-information-circle" /> {{ $t('components.tabs.overlays.tooltip.title') }}</h2>
      <p class="section-description">{{ $t('components.tabs.overlays.tooltip.description') }}</p>
      
      <div class="component-demo">
        <div class="tooltip-demo-grid">
          <Tooltip :content="$t('components.tabs.overlays.tooltip.examples.topContent')" position="top">
            <Button variant="outline">{{ $t('components.tabs.overlays.tooltip.examples.top') }}</Button>
          </Tooltip>

          <Tooltip :content="$t('components.tabs.overlays.tooltip.examples.rightContent')" position="right">
            <Button variant="outline">{{ $t('components.tabs.overlays.tooltip.examples.right') }}</Button>
          </Tooltip>

          <Tooltip :content="$t('components.tabs.overlays.tooltip.examples.leftContent')" position="left">
            <Button variant="outline">{{ $t('components.tabs.overlays.tooltip.examples.left') }}</Button>
          </Tooltip>

          <Tooltip :content="$t('components.tabs.overlays.tooltip.examples.bottomContent')" position="bottom">
            <Button variant="outline">{{ $t('components.tabs.overlays.tooltip.examples.bottom') }}</Button>
          </Tooltip>
        </div>
      </div>
    </section>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import Modal from '@/components/ui/Modal.vue'
import Tooltip from '@/components/ui/Tooltip.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Card from '@/components/ui/Card.vue'


const showModal = ref(false)
const showLargeModal = ref(false)

const handleModalConfirm = () => {
  showModal.value = false
}
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

.demo-controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.modal-content {
  padding: 1rem 0;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.modal-footer {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.tooltip-demo-grid {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background: var(--surface);
  border-radius: 8px;
  border: 1px solid var(--border);
}

.tooltip-variants {
  margin-top: 2rem;
}

.tooltip-variants h3 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.demo-grid {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .catalog-section {
    padding: 1rem;
  }
  
  .demo-controls {
    flex-direction: column;
  }
  
  .tooltip-demo-grid {
    flex-direction: column;
    align-items: center;
  }
  
  .modal-footer {
    flex-direction: column;
  }
}
</style>