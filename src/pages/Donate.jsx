import React from 'react'
import { useTranslation } from 'react-i18next'
import Section from '../components/Section.jsx'

export default function Donate() {
  const { t } = useTranslation()
  return (
    <div>
      <Section title={t('donate.title')} eyebrow="give">
        <p className="max-w-prose text-slate-700">{t('donate.subtitle')}</p>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-slate-700">{t('donate.body')}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <a
              href="#"
              className="rounded-2xl border border-slate-200 bg-slate-900 px-4 py-3 text-center text-sm font-bold text-white hover:bg-slate-800"
            >
              Donate (Placeholder)
            </a>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              Add giving methods: PayPal link, Zelle email/phone, check instructions, etc.
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
