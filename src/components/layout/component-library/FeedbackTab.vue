<template>
  <div class="tab-content">
    <!-- Alerts -->
    <section class="catalog-section">
      <h2><OhVueIcon name="oi-alert" /> Alertas</h2>
      <p class="section-description">Componentes de alerta para exibir mensagens importantes, erros, avisos e confirmações.</p>
      
      <div class="component-demo">
        <Alert type="info" dismissible @dismiss="showAlertDismissed = true">
          <OhVueIcon name="hi-information-circle" class="icon"/>
          <strong>Informativo:</strong> Esta é uma mensagem informativa sobre o funcionamento do sistema.
        </Alert>

        <Alert type="success" dismissible>
          <OhVueIcon name="oi-check" class="icon"/>
          <strong>Sucesso:</strong> Operação realizada com sucesso!
        </Alert>
        
        <Alert type="warning" dismissible>
          <OhVueIcon name="md-warning-round" class="icon"/>
          <strong>Atenção:</strong> Esta ação não pode ser desfeita.
        </Alert>
        
        <Alert type="error" dismissible>
          <OhVueIcon name="la-bug-solid" class="icon"/>
          <strong>Erro:</strong> Ocorreu um erro ao processar sua solicitação.
        </Alert>

        <Toast v-if="showAlertDismissed" type="success">
          Alerta fechado com sucesso!
        </Toast>
      </div>
    </section>

    <section class="catalog-section">
      <h2><OhVueIcon name="bi-info-square" /> Toast Notifications</h2>
      <p class="section-description">Notificações temporárias que aparecem em diferentes posições da tela.</p>
      
      <div class="component-demo">
        <div class="toast-controls">
          <div class="control-group">
            <h4>Posições Superiores</h4>
            <div class="button-group">
              <Button @click="showToast('top-left', 'info')" variant="outline" size="sm">
                Topo Esquerdo
              </Button>
              <Button @click="showToast('top-center', 'success')" variant="outline" size="sm">
                Topo Centro
              </Button>
              <Button @click="showToast('top-right', 'warning')" variant="outline" size="sm">
                Topo Direito
              </Button>
            </div>
          </div>
          
          <div class="control-group">
            <h4>Posições Inferiores</h4>
            <div class="button-group">
              <Button @click="showToast('bottom-left', 'error')" variant="outline" size="sm">
                Inferior Esquerdo
              </Button>
              <Button @click="showToast('bottom-center', 'info')" variant="outline" size="sm">
                Inferior Centro
              </Button>
              <Button @click="showToast('bottom-right', 'success')" variant="outline" size="sm">
                Inferior Direito
              </Button>
            </div>
          </div>
          
          <div class="control-group">
            <h4>Com Ações</h4>
            <div class="button-group">
              <Button @click="showCustomToast" variant="primary" size="sm">
                Com Ícone Personalizado
              </Button>
              <Button @click="showPersistentToast" variant="secondary" size="sm">
                Sem Fechamento Automático
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Toast
      v-for="toast in toasts"
      :key="toast.id"
      :position="toast.position"
      :type="toast.type"
      :auto-close="toast.autoClose"
      :dismissible="toast.dismissible"
      v-model="toast.visible"
      @dismiss="removeToast(toast.id)"
    >
      <OhVueIcon v-if="toast.icon" :name="toast.icon" class="icon"/>
      {{ toast.message }}
    </Toast>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Alert from '@/components/ui/Alert.vue'
import Toast from '@/components/ui/Toast.vue'
import Button from '@/components/ui/Button.vue'
import { OhVueIcon } from 'oh-vue-icons'

const showAlertDismissed = ref(false)

const toasts = ref([])
let toastId = 0

const showToast = (position, type) => {
  const id = toastId++
  
  const messages = {
    info: 'Esta é uma mensagem informativa do sistema.',
    success: 'Operação realizada com sucesso!',
    warning: 'Atenção: Verifique os dados informados.',
    error: 'Erro ao processar a solicitação.'
  }
  
  const icons = {
    info: 'hi-information-circle',
    success: 'oi-check',
    warning: 'md-warning-round',
    error: 'la-bug-solid'
  }

  toasts.value.push({
    id,
    position,
    type,
    message: messages[type],
    icon: icons[type],
    autoClose: 5000,
    dismissible: true,
    visible: true
  })
}

const showCustomToast = () => {
  const id = toastId++
  toasts.value.push({
    id,
    position: 'top-right',
    type: 'success',
    message: 'Toast personalizado com ícone e tempo reduzido!',
    icon: 'oi-check',
    autoClose: 3000,
    dismissible: true,
    visible: true
  })
}

const showPersistentToast = () => {
  const id = toastId++
  toasts.value.push({
    id,
    position: 'bottom-center',
    type: 'info',
    message: 'Este toast permanece até ser fechado manualmente.',
    icon: 'hi-information-circle',
    autoClose: false,
    dismissible: true,
    visible: true
  })
}

const removeToast = (id) => {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
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

.toast-controls {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.control-group h4 {
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.button-group {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.icon {
  margin-right: 0.5rem;
  vertical-align: middle;
}

@media (max-width: 768px) {
  .catalog-section {
    padding: 1rem;
  }
  
  .button-group {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>