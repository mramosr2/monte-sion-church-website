import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

// Pull in the actual translation files
// These are just JSON objects with all the text for each language
import es from './locales/es/translation.json'
import en from './locales/en/translation.json'

i18n
  // Automatically detect the user's language from their browser or localStorage
  .use(LanguageDetector)
  // Wire i18next into React so we can use the useTranslation hook anywhere
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
    },
    // Default to Spanish if we can't detect a language
    // Most of the church community is Spanish-speaking
    fallbackLng: 'es',
    supportedLngs: ['es', 'en'],
    interpolation: {
      // React already handles XSS protection so we don't need i18next to escape values
      escapeValue: false,
    },
    detection: {
      // Check localStorage first, then the browser's language setting
      // This means if someone manually switches languages, their choice is remembered
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

export default i18n
