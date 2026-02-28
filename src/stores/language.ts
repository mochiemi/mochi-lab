import { defineStore } from 'pinia'
import i18n from '@/plugins/i18n'

export type AppLocale = 'pt-BR' | 'es' | 'en'

export const AVAILABLE_LANGUAGES: { code: AppLocale; label: string; flag: string }[] = [
  { code: 'pt-BR', label: 'PT', flag: '🇧🇷' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
  { code: 'en', label: 'EN', flag: '🇺🇸' }
]

export const useLanguageStore = defineStore('language', {
  state: () => ({
    currentLanguage: 'pt-BR' as AppLocale
  }),

  actions: {
    initializeLanguage() {
      const saved = localStorage.getItem('user-language') as AppLocale | null
      if (saved && AVAILABLE_LANGUAGES.some(lang => lang.code === saved)) {
        this.currentLanguage = saved
        i18n.global.locale.value = saved
      } else {
        const browserLang = navigator.language
        let detectedLang: AppLocale = 'pt-BR'

        if (browserLang.startsWith('es')) {
          detectedLang = 'es'
        } else if (browserLang.startsWith('en')) {
          detectedLang = 'en'
        }

        this.currentLanguage = detectedLang
        i18n.global.locale.value = detectedLang
      }
    },

    setLanguage(lang: AppLocale) {
      if (AVAILABLE_LANGUAGES.some(l => l.code === lang)) {
        this.currentLanguage = lang
        i18n.global.locale.value = lang
        localStorage.setItem('user-language', lang)
        
        return lang
      }
      return null
    },

    toggleLanguage() {
      const currentIndex = AVAILABLE_LANGUAGES.findIndex(lang => lang.code === this.currentLanguage)
      const nextIndex = (currentIndex + 1) % AVAILABLE_LANGUAGES.length
      const newLang = (AVAILABLE_LANGUAGES[nextIndex] as { code: AppLocale }).code 
      this.setLanguage(newLang)
      
      return newLang
    },

    getNextLanguage(): AppLocale {
      const currentIndex = AVAILABLE_LANGUAGES.findIndex(lang => lang.code === this.currentLanguage)
      const nextIndex = (currentIndex + 1) % AVAILABLE_LANGUAGES.length
      return (AVAILABLE_LANGUAGES[nextIndex] as { code: AppLocale }).code // <-- Type assertion
    }
  }
})