import { createI18n } from 'vue-i18n'
import fr from './locales/fr.json'
import eus from './locales/eus.json'

export default createI18n({
  legacy: false,
  locale: 'fr', // default language
  fallbackLocale: 'fr',
  messages: {
    fr,
    eus
  }
})
