import { createI18n } from 'vue-i18n'
import enCommons from '@/locales/commons-en.json'
import ptBRCommons from '@/locales/commons-pt-BR.json'
import enComponents from '@/locales/components-en.json'
import ptComponents from '@/locales/components-pt-BR.json'
import enAbouts from '@/locales/abouts-en.json'
import ptAbouts from '@/locales/abouts-pt-BR.json'

const messages = {
  'en': {
    ...enCommons,                   
    ...enComponents,
    ...enAbouts
  },
  'pt-BR': {
    ...ptBRCommons,               
    ...ptComponents,
    ...ptAbouts
  }
}

export default createI18n({
  legacy: false,
  locale: 'pt-BR', 
  fallbackLocale: 'pt-BR',
  messages
})