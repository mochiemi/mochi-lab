import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n from './plugins/i18n'
import { OhVueIcon } from './plugins/icons'
import './assets/styles/variables.css'
import './assets/styles/fonts.css'
import './assets/styles/global.css'

const app = createApp(App)

app.config.errorHandler = (err, instance, info) => {
  if (err instanceof TypeError &&
      err.message.includes("can't access property 'parentNode', node is null")) {
    if (import.meta.env.DEV) {
      console.warn('Ignorando erro de transição do menu mobile:', err)
    }
    return
  }
  console.error(err)
}

app.component('OhVueIcon', OhVueIcon)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')
