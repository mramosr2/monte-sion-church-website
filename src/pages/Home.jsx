import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, HeartHandshake, BookOpenText, HandHeart } from 'lucide-react'
import Container from '../components/Container.jsx'
import Section from '../components/Section.jsx'

export default function Home() {
  const { t } = useTranslation()

  return (
    <div>
      <Hero />

      <Section title={t('home.sectionWelcomeTitle')} eyebrow="what we do">
        <div className="grid gap-8 md:grid-cols-2 md:items-start">
          <div className="space-y-4">
            <p className="text-base leading-relaxed text-slate-700">
              {t('home.sectionWelcomeBody')}
            </p>

            {Array.isArray(t('home.sectionWelcomeExtra', { returnObjects: true }))
              ? t('home.sectionWelcomeExtra', { returnObjects: true }).map((p, idx) => (
                  <p key={idx} className="text-base leading-relaxed text-slate-700">
                    {p}
                  </p>
                ))
              : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <InfoCard icon={HeartHandshake} title={t('home.sectionCards.worship')} />
            <InfoCard icon={BookOpenText} title={t('home.sectionCards.word')} />
            <InfoCard icon={HandHeart} title={t('home.sectionCards.prayer')} />
          </div>
        </div>
      </Section>

      <Section title={t('home.activitiesTitle')} className="bg-gradient-to-b from-rose-50 to-white">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div
              className="aspect-[16/10] w-full rounded-2xl bg-gradient-to-br from-sky-100 to-emerald-50 border border-slate-100"
              aria-hidden="true"
            />
            <p className="mt-4 text-slate-700">{t('home.activitiesBody')}</p>

            <div className="mt-6">
              <Link
                to="/actividades"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-900 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                {t('common.learnMore')}
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-display text-2xl font-bold text-slate-900">
              {t('home.pastorsTitle')}
            </h3>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <PastorCard name="Mario R. Rivera" role="Pastor" />
              <PastorCard name="Josué Mazariegos" role="Pastor" />
              <PastorCard name="Miguel Ramos" role="Pastor" />
              <PastorCard name="Heber Tian" role="Pastor" />
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}

function Hero() {
  const { t } = useTranslation()

  return (
    // IMPORTANT: outer wrapper uses the same dark gradient so rounded corners never reveal white
    <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="relative overflow-hidden rounded-b-[2.5rem]">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 -z-10 opacity-25">
          <div className="h-full w-full bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.18),transparent_55%),radial-gradient(circle_at_80%_75%,rgba(255,255,255,0.14),transparent_55%)]" />
        </div>

        <Container className="py-16 md:py-20">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-6xl">
                {t('brand')}
              </h1>

              <p className="mt-4 max-w-prose text-white/80">
                {t('home.heroSubtitle')}
              </p>

              <dl className="mt-6 grid gap-3 text-sm text-white/80">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-white">{t('home.addressLabel')}</dt>
                    <dd className="mt-1 space-y-0.5">
                      <div>9825 S Broadway</div>
                      <div>Los Angeles, CA 90003</div>
                      <div>United States</div>
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-white">{t('home.phoneLabel')}</dt>
                    <dd>
                      <a className="hover:underline underline-offset-4" href="tel:+13104330310">
                        +1 (310) 433–0310
                      </a>
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-white">Email</dt>
                    <dd>
                      <a className="hover:underline underline-offset-4" href="mailto:info@misionmontesion.org">
                        MisionMonteSionLA@gmail.com
                      </a>
                    </dd>
                  </div>
                </div>
              </dl>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/contacto"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  {t('home.ctaPrimary')}
                </Link>

                <Link
                  to="/donar"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  {t('home.ctaSecondary')}
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm">
              <div
                className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-white/20 to-white/5 border border-white/10"
                aria-hidden="true"
              />
              <p className="mt-4 text-sm text-white/70">
                {t('home.heroImageTip')}
              </p>
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}

function InfoCard({ icon: Icon, title }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <Icon className="h-5 w-5 text-slate-800" aria-hidden="true" />
      <div className="mt-3 text-sm font-bold text-slate-900">{title}</div>
    </div>
  )
}

function PastorCard({ name, role }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="font-bold text-slate-900">{name}</div>
      <div className="mt-1 text-sm text-slate-700">{role}</div>
    </div>
  )
}
