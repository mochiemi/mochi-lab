import { createI18n } from 'vue-i18n'
import enCommons from '@/locales/commons-en.json'
import ptBRCommons from '@/locales/commons-pt-BR.json'
import enInteractive from '@/locales/interactive-en.json'
import ptInteractive from '@/locales/interactive-pt-BR.json'
import enAbouts from '@/locales/abouts-en.json'
import ptAbouts from '@/locales/abouts-pt-BR.json'

const messages = {
  'en': {
    ...enCommons,                   
    ...enInteractive,
    ...enAbouts
  },
  'pt-BR': {
    ...ptBRCommons,               
    ...ptInteractive,
    ...ptAbouts
  }
}

export default createI18n({
  legacy: false,
  locale: 'pt-BR', 
  fallbackLocale: 'pt-BR',
  messages
})