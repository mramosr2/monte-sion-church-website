import React from 'react'
import { useTranslation } from 'react-i18next'

// This button lets users switch between Spanish and English
// i18next stores the preference in localStorage so it sticks between visits
export default function LanguageToggle() {
  const { i18n } = useTranslation()

  // Check if the current language starts with 'es' (Spanish)
  // Default to Spanish since most of our users are Spanish speakers
  const isEs = (i18n.language || 'es').startsWith('es')

  // When clicked, flip to the other language
  const toggle = async () => {
    await i18n.changeLanguage(isEs ? 'en' : 'es')
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white/90 shadow-sm hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30"
      // aria-label tells screen readers what the button does in the current language
      aria-label={isEs ? 'Cambiar a inglés' : 'Switch to Spanish'}
    >
      {/* sr-only hides this text visually but screen readers still read it */}
      <span className="sr-only">{isEs ? 'Idioma' : 'Language'}</span>
      {/* Show the opposite language label so the user knows what they're switching TO */}
      <span>{isEs ? 'ES' : 'EN'}</span>
    </button>
  )
}
