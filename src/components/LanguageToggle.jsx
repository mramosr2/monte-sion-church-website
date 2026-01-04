import React from 'react'
import { useTranslation } from 'react-i18next'

export default function LanguageToggle() {
  const { i18n } = useTranslation()
  const isEs = (i18n.language || 'es').startsWith('es')

  const toggle = async () => {
    await i18n.changeLanguage(isEs ? 'en' : 'es')
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white/90 shadow-sm hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30"
      aria-label={isEs ? 'Cambiar a inglés' : 'Switch to Spanish'}
    >
      <span className="sr-only">{isEs ? 'Idioma' : 'Language'}</span>
      <span>{isEs ? 'ES' : 'EN'}</span>
    </button>
  )
}
