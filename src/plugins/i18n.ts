import { createI18n } from 'vue-i18n'
import enCommons from '@/locales/commons-en.json'
import ptBRCommons from '@/locales/commons-pt-BR.json'
import enPokeQuiz from '@/locales/pokequiz-en.json'
import ptPokeQuiz from '@/locales/pokequiz-pt-BR.json'
import enComponents from '@/locales/components-en.json'
import ptComponents from '@/locales/components-pt-BR.json'
import enAbouts from '@/locales/abouts-en.json'
import ptAbouts from '@/locales/abouts-pt-BR.json'

const messages = {
  'en': {
    ...enCommons,                   
    ...enComponents,
    ...enAbouts,
    pokeQuiz: enPokeQuiz
  },
  'pt-BR': {
    ...ptBRCommons,               
    ...ptComponents,
    ...ptAbouts,
    pokeQuiz: ptPokeQuiz
  }
}

export default createI18n({
  legacy: false,
  locale: 'pt-BR', 
  fallbackLocale: 'pt-BR',
  messages
})