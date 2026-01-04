import React from 'react'
import { useTranslation } from 'react-i18next'
import Section from '../components/Section.jsx'

export default function Churches() {
  const { t } = useTranslation()

  const cardsRaw = t('churches.cards', { returnObjects: true })
  const cards = Array.isArray(cardsRaw) ? cardsRaw : []

  return (
    <div>
      <Section title={t('churches.title')} eyebrow="iglesias">
        <p className="max-w-prose text-slate-700">{t('churches.subtitle')}</p>

        {cards.length > 0 ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c, i) => (
              <div key={i} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  {t('churches.featured')}
                </div>
                <div className="mt-2 font-display text-xl font-bold text-slate-900">{c.name}</div>
                <div className="mt-2 text-sm text-slate-700">{c.place}</div>
                <div className="mt-2 text-sm text-slate-600">{c.note}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="font-display text-xl font-bold text-slate-900">
              {t('churches.missingTitle')}
            </div>
            <p className="mt-2 text-slate-700">{t('churches.missingBody')}</p>
          </div>
        )}

        <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm text-slate-700">{t('churches.next')}</p>
        </div>
      </Section>
    </div>
  )
}
