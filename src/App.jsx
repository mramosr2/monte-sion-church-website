import React, { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Activities from './pages/Activities.jsx'
import History from './pages/History.jsx'
import Contact from './pages/Contact.jsx'
import Churches from './pages/Churches.jsx'
import Food from './pages/Food.jsx'
import Donate from './pages/Donate.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  const { i18n } = useTranslation()

  useEffect(() => {
    document.documentElement.lang = i18n.language || 'es'
  }, [i18n.language])

  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/iglesias" element={<Churches />} />
          <Route path="/reparto" element={<Food />} />
          <Route path="/acerca" element={<About />} />
          <Route path="/actividades" element={<Activities />} />
          <Route path="/historia" element={<History />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/donar" element={<Donate />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
