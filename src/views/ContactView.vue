<template>
  <div class="contact-view">
    <div class="contact-container">
      <Card class="contact-header" :padding="'large'">
        <h1>{{ $t('abouts.contact.header.title') }}</h1>
        <p>{{ $t('abouts.contact.header.description') }}</p>
                    <p class="response-time">{{ $t('abouts.contact.header.interests.responseTime') }}</p>
      </Card>

      <div class="contact-content">
        <div class="contact-info">
          <Card class="contact-card" :clickable="true" @click="sendEmail">
            <div class="contact-icon">
              <OhVueIcon name="fa-regular-paper-plane" />
            </div>
            <h3>{{ $t('abouts.contact.header.contact.email.title') }}</h3>
            <a href="mailto:tiemi.suyama@gmail.com" class="contact-link">tiemi.suyama@gmail.com</a>
            <p>{{ $t('abouts.contact.header.contact.email.description') }}</p>
          </Card>

          <Card class="contact-card" :clickable="true" @click="openGithub">
            <div class="contact-icon">
              <OhVueIcon name="fa-github" />
            </div>
            <h3>{{ $t('abouts.contact.header.contact.github.title') }}</h3>
            <a href="https://github.com/mochiemi" target="_blank" class="contact-link">@mochiemi</a>
            <p>{{ $t('abouts.contact.header.contact.github.description') }}</p>
          </Card>

          <Card class="contact-card" :clickable="true" @click="openLinkedIn">
            <div class="contact-icon">
              <OhVueIcon name="fa-linkedin" />
            </div>
            <h3>{{ $t('abouts.contact.header.contact.linkedin.title') }}</h3>
            <a href="https://www.linkedin.com/in/tiemi-suyama/" target="_blank" class="contact-link">Tiemi Suyama</a>
            <p>{{ $t('abouts.contact.header.contact.linkedin.description') }}</p>
          </Card>
        </div>
  <Card class="contact-note" :padding="'large'">
          <Alert type="warning" dismissible>
            <OhVueIcon name="md-warning-round" class="alert-icon"/>
          <p class="alert-text">{{ $t('abouts.contact.form.warning') }}</p>
        </Alert>

        <h2>{{ $t('abouts.contact.form.title') }}</h2>
        <p class="form-description">{{ $t('abouts.contact.form.description') }}</p>
        
        <div class="form-grid">
          <Input
            v-model="form.name"
            :label="$t('abouts.contact.form.fields.name.label')"
            :placeholder="$t('abouts.contact.form.fields.name.placeholder')"
            class="form-input"
          />
          
          <Input
            v-model="form.email"
            type="email"
            :label="$t('abouts.contact.form.fields.email.label')"
            :placeholder="$t('abouts.contact.form.fields.email.placeholder')"
            class="form-input"
          />
        </div>
        
        <Textarea
          v-model="form.message"
            :label="$t('abouts.contact.form.fields.message.label')"
            :placeholder="$t('abouts.contact.form.fields.message.placeholder')"
            :rows="5"
            :maxlength="500"
            :show-counter="true"
            class="form-textarea"
        />
        
        <div class="form-actions">
          <Button 
            :variant="'primary'" 
            :size="'large'"
            :loading="sending"
            @click="sendMessage"
            class="send-button"
          >
            <OhVueIcon name="fa-regular-paper-plane" />
            {{ $t('abouts.contact.form.actions.send') }}
          </Button>
          
          <Button 
            :variant="'outline'" 
            @click="resetForm"
            class="reset-button"
          >
            {{ $t('abouts.contact.form.actions.reset') }}
          </Button>
        </div>
      </Card>
      </div>

    
    </div>
  </div>
</template>

<script setup>
import { ref} from 'vue'
import { useI18n } from 'vue-i18n'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Textarea from '@/components/ui/Textarea.vue'
import Button from '@/components/ui/Button.vue'
import Alert from '@/components/ui/Alert.vue'
import { OhVueIcon } from 'oh-vue-icons'

const { t } = useI18n()
const sending = ref(false)

const form = ref({
  name: '',
  email: '',
  message: ''
})

const sendEmail = () => {
  window.location.href = 'mailto:tiemi.suyama@gmail.com'
}

const openGithub = () => {
  window.open('https://github.com/mochiemi', '_blank')
}

const openLinkedIn = () => {
  window.open('https://www.linkedin.com/in/tiemi-suyama/', '_blank')
}

const sendMessage = async () => {
  if (!form.value.name || !form.value.email || !form.value.message) {
    alert(t('abouts.contact.form.validation.required'))
    return
  }

  sending.value = true

  setTimeout(() => {
    sending.value = false
    alert(t('abouts.contact.form.success'))
    resetForm()
  }, 2000)
}

const resetForm = () => {
  form.value = {
    name: '',
    email: '',
    message: ''
  }
}
</script>

<style scoped>
.contact-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.contact-header {
  text-align: center;
  background: var(--gradient-surface-1);
}

.contact-header h1 {
  margin-bottom: 1rem;
}

.contact-header p {
  font-size: 1.2rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.contact-card {
  text-align: center;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  background: var(--gradient-surface-2);
}

.contact-card:hover {
  transform: translateY(-5px);
  border-color: var(--primary);
  box-shadow: 0 8px 25px var(--shadow-hover);
}

.contact-card:hover .contact-icon {
  color: var(--accent);
  transform: scale(1.8) translateY(-2px);
}

.contact-icon {
  margin: 1rem;
  color: var(--clovergreen);
  transform: scale(1.5);
  transition: all 0.5s ease;
}

.contact-card h3 {
  color: var(--title-primary);
  margin-bottom: 1rem;
}

.contact-link {
  display: block;
  font-size: 1.1rem;
  color: var(--link-color);
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
}

.contact-link:hover {
  color: var(--link-hover);
  text-decoration: underline;
}

.contact-card p {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.5;
}

.response-time {
  font-style: italic;
  font-size: 1rem !important;
  color: var(--text-secondary);
  border-top: 1px solid var(--border);
  padding-top: 1rem;
  margin-top: 1rem;
}


.alert-icon {
  transform: scale(1.5);
  margin: 0.5rem 1rem;
}

.contact-form-section {
  background: var(--gradient-surface-1);
}

.contact-form-section h2 {
  color: var(--title-primary);
  text-align: center;
  margin-bottom: 1rem;
}

.form-description {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-input,
.form-textarea {
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.send-button,
.reset-button {
  min-width: 120px;
}

.send-button :deep(svg) {
  margin-right: 0.5rem;
}

@media (max-width: 768px) {
  .contact-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .contact-header h1 {
    font-size: 2rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .fun-fact-content {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .contact-container {
    padding: 1rem 0.5rem;
    gap: 1.5rem;
  }
  
  .contact-card {
    padding: 1.5rem;
  }
}
</style>