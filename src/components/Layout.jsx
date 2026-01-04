import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from './NavBar.jsx'
import Footer from './Footer.jsx'
import ScrollWash from './ScrollWash.jsx'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollWash />
      <NavBar />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
