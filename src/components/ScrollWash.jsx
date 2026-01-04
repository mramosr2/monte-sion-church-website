import { useEffect } from 'react'

export default function ScrollWash() {
  useEffect(() => {
    const mql = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (mql?.matches) return

    const root = document.documentElement

    const clamp01 = (v) => Math.min(1, Math.max(0, v))
    const docMax = () =>
      Math.max(1, document.documentElement.scrollHeight - window.innerHeight)

    let targetY = window.scrollY || 0
    let currentY = targetY
    let raf = 0

    const setVars = (p) => {
      const tau = Math.PI * 2
      const a = tau * p

      // Gentle, eye-pleasing drift (scroll-driven)
      const x1 = Math.sin(a * 0.9) * 6
      const y1 = Math.cos(a * 1.1) * 5

      const x2 = Math.cos(a * 0.8 + 1.2) * 7
      const y2 = Math.sin(a * 1.0 + 0.4) * 6

      const x3 = Math.sin(a * 0.7 + 2.2) * 5
      const y3 = Math.cos(a * 0.9 + 2.2) * 5

      root.style.setProperty('--wash-x1', `${x1}%`)
      root.style.setProperty('--wash-y1', `${y1}%`)
      root.style.setProperty('--wash-x2', `${x2}%`)
      root.style.setProperty('--wash-y2', `${y2}%`)
      root.style.setProperty('--wash-x3', `${x3}%`)
      root.style.setProperty('--wash-y3', `${y3}%`)
    }

    const tick = () => {
      raf = 0

      // Smooth easing so it glides instead of snapping
      currentY += (targetY - currentY) * 0.08
      const p = clamp01(currentY / docMax())
      setVars(p)

      // Keep animating until we “catch up”
      if (Math.abs(targetY - currentY) > 0.5) {
        raf = requestAnimationFrame(tick)
      }
    }

    const onScroll = () => {
      targetY = window.scrollY || 0
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const onResize = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)

    // Init
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return null
}
