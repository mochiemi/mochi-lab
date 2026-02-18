<template>
  <div class="tab-content">
    <!-- Alerts -->
    <section class="catalog-section">
      <h2><OhVueIcon name="oi-alert" /> {{ $t('components.tabs.feedback.alert.title') }}</h2>
      <p class="section-description">{{ $t('components.tabs.feedback.alert.description') }}</p>
      
      <div class="component-demo">
        <Alert type="info" dismissible @dismiss="showAlertDismissed = true">
            <OhVueIcon name="hi-information-circle" class="icon"/>
          <strong>{{ $t('components.tabs.feedback.alert.types.info') }}:</strong> {{ $t('components.tabs.feedback.alert.messages.info') }}
        </Alert>

        <Alert type="success" dismissible>
            <OhVueIcon name="oi-check" class="icon"/>
          <strong>{{ $t('components.tabs.feedback.alert.types.success') }}:</strong> {{ $t('components.tabs.feedback.alert.messages.success') }}
        </Alert>
        
        <Alert type="warning" dismissible>
            <OhVueIcon name="md-warning-round" class="icon"/>
          <strong>{{ $t('components.tabs.feedback.alert.types.warning') }}:</strong> {{ $t('components.tabs.feedback.alert.messages.warning') }}
        </Alert>
        
        <Alert type="error" dismissible>
            <OhVueIcon name="la-bug-solid" class="icon"/>
          <strong>{{ $t('components.tabs.feedback.alert.types.error') }}:</strong> {{ $t('components.tabs.feedback.alert.messages.error') }}
        </Alert>

        <Toast v-if="showAlertDismissed" type="success">
          {{ $t('components.tabs.feedback.alert.messages.dismissed') }}
        </Toast>
      </div>
    </section>

    <section class="catalog-section">
      <h2><OhVueIcon name="bi-info-square" /> {{ $t('components.tabs.feedback.toast.title') }}</h2>
      <p class="section-description">{{ $t('components.tabs.feedback.toast.description') }}</p>
      
      <div class="component-demo">
        <div class="toast-controls">
          <div class="control-group">
            <h4>{{ $t('components.tabs.feedback.toast.controls.topPositions') }}</h4>
            <div class="button-group">
              <Button @click="showToast('top-left', 'info')" variant="outline" size="sm">
                {{ $t('components.tabs.feedback.toast.positions.topLeft') }}
              </Button>
              <Button @click="showToast('top-center', 'success')" variant="outline" size="sm">
                {{ $t('components.tabs.feedback.toast.positions.topCenter') }}
              </Button>
              <Button @click="showToast('top-right', 'warning')" variant="outline" size="sm">
                {{ $t('components.tabs.feedback.toast.positions.topRight') }}
              </Button>
            </div>
          </div>
          
          <div class="control-group">
            <h4>{{ $t('components.tabs.feedback.toast.controls.bottomPositions') }}</h4>
            <div class="button-group">
              <Button @click="showToast('bottom-left', 'error')" variant="outline" size="sm">
                {{ $t('components.tabs.feedback.toast.positions.bottomLeft') }}
              </Button>
              <Button @click="showToast('bottom-center', 'info')" variant="outline" size="sm">
                {{ $t('components.tabs.feedback.toast.positions.bottomCenter') }}
              </Button>
              <Button @click="showToast('bottom-right', 'success')" variant="outline" size="sm">
                {{ $t('components.tabs.feedback.toast.positions.bottomRight') }}
              </Button>
            </div>
          </div>
          
          <div class="control-group">
            <h4>{{ $t('components.tabs.feedback.toast.controls.withActions') }}</h4>
            <div class="button-group">
              <Button @click="showCustomToast" variant="primary" size="sm">
                {{ $t('components.tabs.feedback.toast.controls.withIcon') }}
              </Button>
              <Button @click="showPersistentToast" variant="secondary" size="sm">
                {{ $t('components.tabs.feedback.toast.controls.noAutoClose') }}
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
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const showAlertDismissed = ref(false)

const toasts = ref([])
let toastId = 0

const showToast = (position, type) => {
  const id = toastId++
  
  const messages = {
    info: t('components.tabs.feedback.toast.messages.info'),
    success: t('components.tabs.feedback.toast.messages.success'),
    warning: t('components.tabs.feedback.toast.messages.warning'),
    error: t('components.tabs.feedback.toast.messages.error')
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
    message: t('components.tabs.feedback.toast.messages.custom'),
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
    message: t('components.tabs.feedback.toast.messages.persistent'),
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
  vertical-align: center;
}

@media (max-width: 768px) {

  .button-group {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>