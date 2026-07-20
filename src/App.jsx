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

  // Keep the HTML lang attribute in sync with the current language
  // This is important for screen readers - they use it to know which language to read in
  useEffect(() => {
    document.documentElement.lang = i18n.language || 'es'
  }, [i18n.language])

  return (
    // HashRouter uses the # in the URL which works well with GitHub Pages static hosting
    // since the server doesn't need to handle different URL paths
    <HashRouter>
      <Routes>
        {/* Layout wraps every page so the navbar and footer don't have to be repeated */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          {/* Routes are in Spanish since the church's primary audience is Spanish speaking */}
          <Route path="/iglesias" element={<Churches />} />
          <Route path="/reparto" element={<Food />} />
          <Route path="/acerca" element={<About />} />
          <Route path="/actividades" element={<Activities />} />
          <Route path="/historia" element={<History />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/donar" element={<Donate />} />
          {/* Catch-all for any URL that doesn't match */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
