import { createI18n } from 'vue-i18n'
import enCommons from '@/locales/commons-en.json'
import ptBRCommons from '@/locales/commons-pt-BR.json'
import esCommons from '@/locales/commons-es.json'
import enInteractive from '@/locales/interactive-en.json'
import ptInteractive from '@/locales/interactive-pt-BR.json'
import esInteractive from '@/locales/interactive-es.json'
import enScientificCalculators from '@/locales/scientific-calculators-en.json'
import esScientificCalculators from '@/locales/scientific-calculators-es.json'
import ptScientificCalculators from '@/locales/scientific-calculators-pt-BR.json'

const messages = {
  'en': {
    ...enCommons,
    ...enInteractive,
    ...enScientificCalculators,
  },
  'pt-BR': {
    ...ptBRCommons,
    ...ptInteractive,
    ...ptScientificCalculators,
  },
  'es': {
    ...esCommons,
    ...esInteractive,
    ...esScientificCalculators,
  }
}

export default createI18n({
  legacy: false,
  locale: 'pt-BR',
  fallbackLocale: 'pt-BR',
  messages
})
