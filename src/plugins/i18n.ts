import { createI18n } from 'vue-i18n'
import enCommons from '@/locales/commons-en.json'
import ptBRCommons from '@/locales/commons-pt-BR.json'
import enInteractive from '@/locales/interactive-en.json'
import ptInteractive from '@/locales/interactive-pt-BR.json'


const messages = {
  'en': {
    ...enCommons,                   
    ...enInteractive,
  },
  'pt-BR': {
    ...ptBRCommons,               
    ...ptInteractive,
  }
}

export default createI18n({
  legacy: false,
  locale: 'pt-BR', 
  fallbackLocale: 'pt-BR',
  messages
})