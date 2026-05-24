import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import Section from '../components/Section.jsx'

/* ─── Event cards data ───────────────────────────────────────────────────── */
const EVENTS = [
  {
    id: 'food',
    image: './activities/Flyer_Distribucion.png',
    titleEs: 'Distribucion de Alimentos',
    titleEn: 'Food Distribution',
    detailEs: 'Miercoles 3 PM — 9825 S. Broadway, Los Angeles, CA 90003',
    detailEn: 'Wednesdays 3 PM — 9825 S. Broadway, Los Angeles, CA 90003',
    tagEs: 'Servicio comunitario',
    tagEn: 'Community Service',
    tagColor: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'bautizmos',
    image: './activities/Image_Clases_Bautizos.jpeg',
    titleEs: 'Clases de Bautizmos 2026',
    titleEn: 'Baptism Classes 2026',
    detailEs: '16 y 30 de Mayo · 27 de Junio · 11 de Julio — Bautizos: 12 de Julio',
    detailEn: 'May 16 & 30 · June 27 · July 11 — Baptisms: July 12',
    tagEs: 'Evento especial',
    tagEn: 'Special Event',
    tagColor: 'bg-teal-100 text-teal-800',
  },
]

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function Activities() {
  const { t, i18n } = useTranslation()
  const isEs = i18n.language?.startsWith('es')
  const [activeEvent, setActiveEvent] = useState(null)

  return (
    <Section title={t('activities.title')} eyebrow="community">
      <p className="max-w-prose text-slate-600">{t('activities.subtitle')}</p>

      {/* Video announcement */}
      <div className="mt-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 shadow-lg">
          <video
            src="./activities/Anuncios_Abril_2026.mov"
            controls
            playsInline
            className="w-full max-h-[520px] object-cover"
          />
        </div>
        <div className="mt-3 flex items-start gap-2">
          <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-white text-[10px] font-bold">
            &#9654;
          </span>
          <p className="text-sm text-slate-500 leading-snug">
            {isEs
              ? 'Lo que esta pasando en Mision Monte Sion — anuncios y eventos de la comunidad.'
              : "What's happening at Mision Monte Sion — community announcements and upcoming events."}
          </p>
        </div>
      </div>

      {/* Event cards */}
      <div className="mt-12">
        <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">
          {isEs ? 'Proximos Eventos' : 'Upcoming Events'}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {EVENTS.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isEs={isEs}
              onClick={() => setActiveEvent(event)}
            />
          ))}
        </div>
      </div>

      {activeEvent && (
        <EventModal
          event={activeEvent}
          isEs={isEs}
          onClose={() => setActiveEvent(null)}
        />
      )}
    </Section>
  )
}

/* ─── EventCard ──────────────────────────────────────────────────────────── */
function EventCard({ event, isEs, onClick }) {
  const title  = isEs ? event.titleEs  : event.titleEn
  const detail = isEs ? event.detailEs : event.detailEn
  const tag    = isEs ? event.tagEs    : event.tagEn

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 cursor-pointer text-left w-full focus:outline-none focus:ring-2 focus:ring-slate-400"
      aria-label={title}
    >
      <div className="relative overflow-hidden bg-slate-100" style={{ aspectRatio: '3/4' }}>
        <img
          src={event.image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <span className={`absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-bold shadow-sm ${event.tagColor}`}>
          {tag}
        </span>
        <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-sm px-3 py-1.5 text-[11px] font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          {isEs ? 'Ver' : 'Expand'}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-5 gap-2">
        <h3 className="font-display text-lg font-bold text-slate-900 leading-snug">
          {title}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed flex-1">
          {detail}
        </p>
      </div>
    </button>
  )
}

/* ─── EventModal ─────────────────────────────────────────────────────────── */
function EventModal({ event, isEs, onClose }) {
  const [visible, setVisible] = useState(false)
  const closeRef = useRef(null)

  const title  = isEs ? event.titleEs  : event.titleEn
  const detail = isEs ? event.detailEs : event.detailEn

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
      aria-label={title}
    >
      <div
        onClick={handleClose}
        className="absolute inset-0 bg-black/65 backdrop-blur-sm transition-opacity duration-300"
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
          aria-label={isEs ? 'Cerrar' : 'Close'}
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative w-full" style={{ aspectRatio: '3/4' }}>
          <img
            src={event.image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div
            className="absolute inset-x-0 bottom-0 px-5 pb-5 transition-all duration-500"
            style={{
              opacity:         visible ? 1 : 0,
              transform:       visible ? 'translateY(0)' : 'translateY(12px)',
              transitionDelay: '120ms',
            }}
          >
            <p className="font-display text-xl font-bold text-white leading-tight drop-shadow">
              {title}
            </p>
            <p className="mt-1 text-xs font-medium text-white/80 drop-shadow leading-snug">
              {detail}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
