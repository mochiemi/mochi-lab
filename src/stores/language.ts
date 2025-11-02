import { defineStore } from 'pinia'
import i18n from '@/plugins/i18n'

type AppLocale = 'en-US' | 'pt-BR'

export const useLanguageStore = defineStore('language', {
  state: () => ({
    currentLanguage: 'en-US' as AppLocale
  }),

  actions: {
    initializeLanguage() {
      const saved = localStorage.getItem('user-language') as AppLocale | null
      if (saved && (saved === 'en-US' || saved === 'pt-BR')) {
        this.currentLanguage = saved
        i18n.global.locale.value = saved
      } else {
        const browserLang = navigator.language
        this.currentLanguage = browserLang.startsWith('pt') ? 'pt-BR' : 'en-US'
        i18n.global.locale.value = this.currentLanguage
      }
    },

    setLanguage(lang: AppLocale) {
      this.currentLanguage = lang
      i18n.global.locale.value = lang
      localStorage.setItem('user-language', lang)
    },

    toggleLanguage() {
      const newLang: AppLocale = this.currentLanguage === 'en-US' ? 'pt-BR' : 'en-US'
      this.setLanguage(newLang)
    }
  }
})