import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n from './plugins/i18n'
import { OhVueIcon } from './plugins/icons'
import './assets/styles/global.css'

const app = createApp(App)

app.component('OhVueIcon', OhVueIcon)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')