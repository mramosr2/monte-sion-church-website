import React from 'react'
import { useTranslation } from 'react-i18next'
import Section from '../components/Section.jsx'

export default function History() {
  const { t } = useTranslation()

  const longRaw = t('history.longParagraphs', { returnObjects: true })
  const longParagraphs = Array.isArray(longRaw) ? longRaw : (typeof longRaw === 'string' ? [longRaw] : [])

  const longTitle = t('history.longTitle', { defaultValue: t('history.title') })

  return (
    <div>
      <Section title={t('history.title')} eyebrow={t('history.eyebrow', { defaultValue: 'timeline' })}>
        <p className="text-slate-700">{t('history.subtitle')}</p>

        <div className="mt-8 w-full rounded-3xl border border-slate-200/70 bg-white/75 p-6 shadow-sm backdrop-blur md:p-10">
          <h3 className="text-xl font-bold text-slate-900">{longTitle}</h3>

          {/* Full-width + 2-column on large screens so it fills the screen instead of hugging the left */}
          <div className="mt-5 columns-1 lg:columns-2 lg:gap-10">
            {longParagraphs.map((p, i) => (
              <p
                key={i}
                className="mb-5 break-inside-avoid text-base leading-relaxed text-slate-800"
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </Section>
    </div>
  )
}
