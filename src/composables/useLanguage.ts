import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

export function useLanguage() {
  const { locale } = useI18n()
  
  // Make currentLanguage computed from the i18n locale to ensure reactivity
  const currentLanguage = computed(() => locale.value)

  const availableLanguages = [
    { code: 'fr', name: 'Français', nativeName: 'Français' },
    { code: 'eus', name: 'Basque', nativeName: 'Euskara' }
  ]

  const currentLanguageInfo = computed(() => 
    availableLanguages.find(lang => lang.code === currentLanguage.value)
  )

  function switchLanguage(langCode: string) {
    if (['fr', 'eus'].includes(langCode)) {
      // Only update the i18n locale, currentLanguage will automatically update
      locale.value = langCode
      // Store in localStorage for persistence
      localStorage.setItem('preferred-language', langCode)
      // Update document language attribute for accessibility
      document.documentElement.lang = langCode
    }
  }

  function initializeLanguage() {
    const savedLanguage = localStorage.getItem('preferred-language')
    if (savedLanguage && ['fr', 'eus'].includes(savedLanguage)) {
      switchLanguage(savedLanguage)
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0]
      if (browserLang === 'eu') {
        switchLanguage('eus')
      } else {
        switchLanguage('fr') // Default to French
      }
    }
  }

  // Watch for language changes and update document attributes
  watch(currentLanguage, (newLang) => {
    document.documentElement.lang = newLang
  })

  return {
    currentLanguage,
    currentLanguageInfo,
    availableLanguages,
    switchLanguage,
    initializeLanguage
  }
}
