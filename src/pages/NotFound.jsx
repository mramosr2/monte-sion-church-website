import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <h1 className="font-display text-4xl font-bold text-slate-900">404</h1>
        <p className="mt-3 text-slate-700">Page not found.</p>
        <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800">
          Go home
        </Link>
      </div>
    </div>
  )
}
