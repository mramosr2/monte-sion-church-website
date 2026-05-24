import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, HeartHandshake, BookOpenText, HandHeart, X } from 'lucide-react'
import Container from '../components/Container.jsx'
import Section from '../components/Section.jsx'

/* ─── Pastor data ─────────────────────────────────────────────────────────── */
const PASTORS = [
  { name: 'Mario Ruben Rivera',  title: 'Pastor General',                        photo: './pastors/Mario.jpeg'  },
  { name: 'Josue Mazariegos',    title: 'Mision Monte Sion, Sioux City, Iowa',   photo: './pastors/Josue.jpeg'  },
  { name: 'Pastor Miguel Ramos', title: 'Mision Monte Sion LA',                  photo: './pastors/Miguel.jpg'  },
  { name: 'Heber Tian',          title: 'Mision Monte Sion, Phoenix, Arizona',   photo: './pastors/Heber.jpeg'  },
  { name: 'Dario Gonzalez',      title: 'Mision Monte Sion, South LA',           photo: './pastors/Dario.jpeg'  },
]

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function Home() {
  const { t } = useTranslation()
  const [activePastor, setActivePastor] = useState(null)

  return (
    <div>
      <Hero />

      {/* Welcome section */}
      <Section title={t('home.sectionWelcomeTitle')} eyebrow="what we do">
        <div className="grid gap-8 md:grid-cols-2 md:items-start">
          <div className="space-y-4">
            <p className="text-base font-semibold leading-relaxed text-slate-800">
              {t('home.sectionWelcomeBody')}
            </p>
            {Array.isArray(t('home.sectionWelcomeExtra', { returnObjects: true }))
              ? t('home.sectionWelcomeExtra', { returnObjects: true }).map((p, idx) => (
                  <p key={idx} className="text-base leading-relaxed text-slate-700">{p}</p>
                ))
              : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <InfoCard icon={HeartHandshake} title={t('home.sectionCards.worship')} />
            <InfoCard icon={BookOpenText}   title={t('home.sectionCards.word')}    />
            <InfoCard icon={HandHeart}      title={t('home.sectionCards.prayer')}  />
          </div>
        </div>
      </Section>

      {/* Activities + Pastors */}
      <Section title={t('home.activitiesTitle')} className="bg-gradient-to-b from-rose-50 to-white">
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

        {/* Pastors */}
        <div className="mt-10">
          <h3 className="font-display text-2xl font-bold text-slate-900 mb-6">
            {t('home.pastorsTitle')}
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {PASTORS.map((pastor) => (
              <PastorCard
                key={pastor.name}
                pastor={pastor}
                onClick={() => setActivePastor(pastor)}
              />
            ))}
          </div>
        </div>
      </Section>

      {activePastor && (
        <PastorModal pastor={activePastor} onClose={() => setActivePastor(null)} />
      )}
    </div>
  )
}

/* ─── Hero ────────────────────────────────────────────────────────────────── */
function Hero() {
  const { t } = useTranslation()

  return (
    <div className="relative min-h-[92vh] flex flex-col overflow-hidden">

      {/* Background photo */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('./church/IMG_0770.jpg')" }}
        aria-hidden="true"
      />

      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(10,15,30,0.62) 0%, rgba(10,15,30,0.78) 55%, rgba(10,15,30,0.92) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center">
        <Container className="py-20 md:py-28">
          <div className="max-w-2xl">

            <h1 className="font-display text-5xl font-bold tracking-tight text-white md:text-7xl leading-tight drop-shadow-lg">
              {t('brand')}
            </h1>

            <p className="mt-5 max-w-xl text-lg text-white/85 leading-relaxed drop-shadow">
              {t('home.heroSubtitle')}
            </p>

            <dl className="mt-8 grid gap-3 text-sm text-white/80">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-white/60" aria-hidden="true" />
                <div>
                  <dt className="font-semibold text-white">{t('home.addressLabel')}</dt>
                  <dd className="mt-0.5 space-y-0.5">
                    <div>9825 S Broadway</div>
                    <div>Los Angeles, CA 90003</div>
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-white/60" aria-hidden="true" />
                <div>
                  <dt className="font-semibold text-white">{t('home.phoneLabel')}</dt>
                  <dd>
                    <a className="hover:underline underline-offset-4" href="tel:+13104330310">
                      +1 (310) 433-0310
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-white/60" aria-hidden="true" />
                <div>
                  <dt className="font-semibold text-white">Email</dt>
                  <dd>
                    <a className="hover:underline underline-offset-4" href="mailto:MisionMonteSionLA@gmail.com">
                      MisionMonteSionLA@gmail.com
                    </a>
                  </dd>
                </div>
              </div>
            </dl>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/contacto"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-7 py-3 text-sm font-bold text-slate-900 shadow-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
              >
                {t('home.ctaPrimary')}
              </Link>
              <Link
                to="/donar"
                className="inline-flex items-center justify-center rounded-2xl border border-white/30 bg-white/10 backdrop-blur-sm px-7 py-3 text-sm font-bold text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
              >
                {t('home.ctaSecondary')}
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}

/* ─── InfoCard ────────────────────────────────────────────────────────────── */
function InfoCard({ icon: Icon, title }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <Icon className="h-5 w-5 text-slate-800" aria-hidden="true" />
      <div className="mt-3 text-sm font-bold text-slate-900">{title}</div>
    </div>
  )
}

/* ─── PastorCard ──────────────────────────────────────────────────────────── */
function PastorCard({ pastor, onClick }) {
  const { t } = useTranslation()
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-center gap-3 hover:shadow-lg hover:border-slate-300 hover:-translate-y-1 active:scale-95 transition-all duration-200 cursor-pointer w-full focus:outline-none focus:ring-2 focus:ring-slate-400"
      aria-label={pastor.name}
    >
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm flex-shrink-0 group-hover:border-slate-300 group-hover:shadow-md transition-all duration-200">
        <img
          src={pastor.photo}
          alt={pastor.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-900 leading-snug">{pastor.name}</p>
        <p className="mt-1 text-xs text-slate-500 leading-snug">{pastor.title}</p>
      </div>
      <span className="text-[10px] font-medium text-slate-400 group-hover:text-slate-600 transition-colors duration-200 tracking-wide uppercase">
        {t('home.viewPhoto')}
      </span>
    </button>
  )
}

/* ─── PastorModal ─────────────────────────────────────────────────────────── */
function PastorModal({ pastor, onClose }) {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const closeRef = useRef(null)

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => { closeRef.current?.focus() }, [])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  function handleClose() {
    setVisible(false)
    setTimeout(onClose, 280)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={pastor.name}
    >
      <div
        onClick={handleClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      />
      <div
        className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300"
        style={{
          opacity:   visible ? 1 : 0,
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.85) translateY(24px)',
        }}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
          aria-label={t('nav.close')}
        >
          <X className="h-4 w-4" />
        </button>
        <div className="relative w-full" style={{ aspectRatio: '3/4' }}>
          <img
            src={pastor.photo}
            alt={pastor.name}
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div
            className="absolute inset-x-0 bottom-0 px-6 pb-6 transition-all duration-500"
            style={{
              opacity:         visible ? 1 : 0,
              transform:       visible ? 'translateY(0)' : 'translateY(12px)',
              transitionDelay: '120ms',
            }}
          >
            <p className="font-display text-2xl font-bold text-white leading-tight drop-shadow">
              {pastor.name}
            </p>
            <p className="mt-1 text-sm font-medium text-white/80 drop-shadow">
              {pastor.title}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
