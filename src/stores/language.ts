import { defineStore } from 'pinia'
import i18n from '@/plugins/i18n'

type AppLocale = 'en' | 'pt-BR'

export const useLanguageStore = defineStore('language', {
  state: () => ({
    currentLanguage: 'en' as AppLocale
  }),

  actions: {
    initializeLanguage() {
      const saved = localStorage.getItem('user-language') as AppLocale | null
      if (saved && (saved === 'en' || saved === 'pt-BR')) {
        this.currentLanguage = saved
        i18n.global.locale.value = saved
      } else {
        const browserLang = navigator.language
        this.currentLanguage = browserLang.startsWith('pt') ? 'pt-BR' : 'en'
        i18n.global.locale.value = this.currentLanguage
      }
    },

    setLanguage(lang: AppLocale) {
      this.currentLanguage = lang
      i18n.global.locale.value = lang
      localStorage.setItem('user-language', lang)
    },

    toggleLanguage() {
      const newLang: AppLocale = this.currentLanguage === 'en' ? 'pt-BR' : 'en'
      this.setLanguage(newLang)
    }
  }
})