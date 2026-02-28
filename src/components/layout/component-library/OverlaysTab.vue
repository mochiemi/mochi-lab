<template>
  <div class="tab-content">
    <Modal
      v-model:show="showModal" 
      title="Modal de Demonstração"
      closable>
      <div class="modal-content">
        <p>Este é um modal básico com formulário de exemplo.</p>
        <div class="modal-form">
          <Input label="Nome" placeholder="Digite seu nome" />
          <Input type="email" label="E-mail" placeholder="Digite seu e-mail" />
        </div>
      </div>
      <template #footer>
        <div class="modal-footer">
          <Button variant="secondary" @click="showModal = false">Cancelar</Button>
          <Button @click="handleModalConfirm">Confirmar</Button>
        </div>
      </template>
    </Modal>

    <Modal v-model:show="showLargeModal" title="Modal Grande" size="lg" closable>
      <div class="modal-content">
        <h3>Conteúdo Expandido</h3>
        <p>Este modal possui tamanho grande e pode conter mais conteúdo.</p>
        <div class="content-grid">
          <Card title="Card 1" padding="normal">
            <p>Conteúdo do primeiro card dentro do modal.</p>
          </Card>
          <Card title="Card 2" padding="normal">
            <p>Conteúdo do segundo card dentro do modal.</p>
          </Card>
        </div>
      </div>
    </Modal>

    <section class="catalog-section">
      <h2><OhVueIcon name="bi-window" /> Modal</h2>
      <p class="section-description">Janelas modais para exibir conteúdo em foco com sobreposição.</p>
      
      <div class="component-demo">
        <div class="demo-controls">
          <Button @click="showModal = true">Modal Básico</Button>
          <Button @click="showLargeModal = true" variant="secondary">Modal Grande</Button>
        </div>
      </div>
    </section>

    <section class="catalog-section">
      <h2><OhVueIcon name="hi-information-circle" /> Tooltip</h2>
      <p class="section-description">Dicas contextuais que aparecem ao passar o mouse sobre elementos.</p>
      
      <div class="component-demo">
        <div class="tooltip-demo-grid">
          <Tooltip content="Tooltip na posição superior" position="top">
            <Button variant="outline">Superior</Button>
          </Tooltip>

          <Tooltip content="Tooltip na posição direita" position="right">
            <Button variant="outline">Direita</Button>
          </Tooltip>

          <Tooltip content="Tooltip na posição esquerda" position="left">
            <Button variant="outline">Esquerda</Button>
          </Tooltip>

          <Tooltip content="Tooltip na posição inferior" position="bottom">
            <Button variant="outline">Inferior</Button>
          </Tooltip>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { OhVueIcon } from 'oh-vue-icons'
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
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  padding: 2rem;
  background: var(--surface);
  border-radius: 8px;
  border: 1px solid var(--border);
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
    gap: 1rem;
  }
  
  .modal-footer {
    flex-direction: column;
  }
}
</style>