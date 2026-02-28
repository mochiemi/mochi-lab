import { createI18n } from 'vue-i18n'
import enCommons from '@/locales/commons-en.json'
import ptBRCommons from '@/locales/commons-pt-BR.json'
import esCommons from '@/locales/commons-es.json'
import enInteractive from '@/locales/interactive-en.json'
import ptInteractive from '@/locales/interactive-pt-BR.json'
import esInteractive from '@/locales/interactive-es.json'

const messages = {
  'en': {
    ...enCommons,
    ...enInteractive,
  },
  'pt-BR': {
    ...ptBRCommons,
    ...ptInteractive,
  },
  'es': {
    ...esCommons,
    ...esInteractive,
  }
}

export default createI18n({
  legacy: false,
  locale: 'pt-BR',
  fallbackLocale: 'pt-BR',
  messages
})
