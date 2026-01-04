import React from 'react'
import Container from './Container.jsx'

export default function Section({ title, eyebrow, children, className = "" }) {
  return (
    <section className={`py-16 ${className}`}>
      <Container>
        {eyebrow ? (
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{eyebrow}</p>
        ) : null}
        {title ? (
          <h2 className="mt-2 font-display text-3xl font-bold text-slate-900 md:text-4xl">{title}</h2>
        ) : null}
        <div className="mt-8">
          {children}
        </div>
      </Container>
    </section>
  )
}
