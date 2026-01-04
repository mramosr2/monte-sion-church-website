import React from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X, ChevronDown } from 'lucide-react'
import LanguageToggle from './LanguageToggle.jsx'
import logo from '../assets/logo-mision.png'

const linkBase =
  'rounded-lg text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-white/30'

const desktopLink = ({ isActive }) =>
  `${linkBase} px-3 py-2 ` +
  (isActive ? 'text-white bg-white/15' : 'text-white/80 hover:text-white hover:bg-white/10')

const desktopDonate = ({ isActive }) =>
  'ml-2 px-4 py-2 rounded-full text-sm font-bold transition border focus:outline-none focus:ring-2 focus:ring-white/30 ' +
  (isActive
    ? 'border-white/25 bg-white/15 text-white'
    : 'border-white/15 bg-white/10 text-white hover:bg-white/15')

export default function NavBar() {
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-40 relative">
      {/* Background only (can be clipped) */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.20),transparent_55%),radial-gradient(circle_at_75%_70%,rgba(255,255,255,0.15),transparent_50%)]" />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 shrink-0 rounded-full border border-white/15 bg-white/10 overflow-hidden grid place-items-center">
              <img src={logo} alt="" className="h-full w-full object-contain" />
            </div>

            <div className="leading-tight min-w-0">
              <div className="font-display text-base font-bold text-white truncate">
                {t('brand')}
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
            <NavLink to="/" className={desktopLink}>
              {t('nav.home')}
            </NavLink>
            <NavLink to="/iglesias" className={desktopLink}>
              {t('nav.churches')}
            </NavLink>
            <NavLink to="/reparto" className={desktopLink}>
              {t('nav.food')}
            </NavLink>
            <NavLink to="/acerca" className={desktopLink}>
              {t('nav.about')}
            </NavLink>
            <NavLink to="/contacto" className={desktopLink}>
              {t('nav.contact')}
            </NavLink>

            <MoreMenu />

            <NavLink to="/donar" className={desktopDonate}>
              {t('nav.donate')}
            </NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  )
}

/* ----------------------------- Desktop “More” ----------------------------- */

function MoreMenu() {
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)
  const btnRef = React.useRef(null)
  const menuRef = React.useRef(null)

  React.useEffect(() => {
    if (!open) return

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
        btnRef.current?.focus()
      }
    }

    const onPointerDown = (e) => {
      const btn = btnRef.current
      const menu = menuRef.current
      if (!btn || !menu) return
      if (btn.contains(e.target)) return
      if (menu.contains(e.target)) return
      setOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`${linkBase} px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 inline-flex items-center gap-1`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="more-menu"
      >
        {t('nav.more')}
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </button>

      {open && (
        <div
          ref={menuRef}
          id="more-menu"
          role="menu"
          className="absolute right-0 mt-2 z-50 w-52 overflow-hidden rounded-2xl border border-white/15 bg-slate-900/95 backdrop-blur shadow-xl"
        >
          <NavLink
            to="/actividades"
            role="menuitem"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              'block px-3 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-white/30 ' +
              (isActive ? 'text-white bg-white/15' : 'text-white/80 hover:text-white hover:bg-white/10')
            }
          >
            {t('nav.activities')}
          </NavLink>
          <NavLink
            to="/historia"
            role="menuitem"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              'block px-3 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-white/30 ' +
              (isActive ? 'text-white bg-white/15' : 'text-white/80 hover:text-white hover:bg-white/10')
            }
          >
            {t('nav.history')}
          </NavLink>
        </div>
      )}
    </div>
  )
}

/* ------------------------------- Mobile Menu ------------------------------ */

function MobileMenu() {
  const { t } = useTranslation()
  const location = useLocation()

  const [open, setOpen] = React.useState(false)
  const buttonRef = React.useRef(null)
  const panelRef = React.useRef(null)
  const firstLinkRef = React.useRef(null)

  const close = React.useCallback(() => {
    setOpen(false)
    requestAnimationFrame(() => buttonRef.current?.focus())
  }, [])

  const openMenu = React.useCallback(() => {
    setOpen(true)
    requestAnimationFrame(() => firstLinkRef.current?.focus())
  }, [])

  // Close menu on route change
  React.useEffect(() => {
    if (open) setOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  // Escape to close + focus trap
  React.useEffect(() => {
    if (!open) return

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }

      if (e.key === 'Tab') {
        const panel = panelRef.current
        if (!panel) return

        const focusables = panel.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        if (!focusables.length) return

        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        const active = document.activeElement

        if (e.shiftKey) {
          if (active === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (active === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, close])

  // Lock body scroll while open
  React.useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={open ? close : openMenu}
        className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 p-2.5 text-white shadow-sm hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30"
        aria-expanded={open}
        aria-controls="mobile-drawer"
        aria-label={open ? t('nav.close') : t('nav.menu')}
      >
        {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop (click to close) */}
          <button
            type="button"
            className="absolute inset-0 bg-black/45"
            onClick={close}
            aria-label={t('nav.close')}
          />

          {/* Drawer */}
          <div
            id="mobile-drawer"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={t('nav.menu')}
            className="absolute right-0 top-0 h-full w-full max-w-sm overflow-hidden border-l border-white/10 bg-slate-900/95 backdrop-blur shadow-2xl"
          >
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
            <div className="absolute inset-0 -z-10 opacity-20">
              <div className="h-full w-full bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.20),transparent_55%),radial-gradient(circle_at_75%_70%,rgba(255,255,255,0.15),transparent_50%)]" />
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-white font-display font-bold">{t('nav.menu')}</div>
                <button
                  type="button"
                  onClick={close}
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 p-2 text-white hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30"
                  aria-label={t('nav.close')}
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              {/* Primary CTA first */}
              <NavLink
                to="/donar"
                ref={firstLinkRef}
                onClick={close}
                className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-white px-4 py-3 text-base font-extrabold text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                {t('nav.donate')}
              </NavLink>

              <div className="mt-4 grid gap-2">
                <MobileLink to="/" onClick={close} label={t('nav.home')} />
                <MobileLink to="/iglesias" onClick={close} label={t('nav.churches')} />
                <MobileLink to="/reparto" onClick={close} label={t('nav.food')} />
                <MobileLink to="/acerca" onClick={close} label={t('nav.about')} />
                <MobileLink to="/actividades" onClick={close} label={t('nav.activities')} />
                <MobileLink to="/historia" onClick={close} label={t('nav.history')} />
                <MobileLink to="/contacto" onClick={close} label={t('nav.contact')} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MobileLink({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        'w-full rounded-2xl px-4 py-3 text-base font-semibold transition focus:outline-none focus:ring-2 focus:ring-white/30 ' +
        (isActive ? 'bg-white/15 text-white' : 'bg-white/5 text-white/85 hover:bg-white/10 hover:text-white')
      }
    >
      {label}
    </NavLink>
  )
}
