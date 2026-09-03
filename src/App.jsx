import { ThemeProvider } from './context/ThemeContext.jsx'
import { AppStateProvider, useAppState } from './context/AppStateContext.jsx'
import TopNav from './components/TopNav/index.jsx'
import Footer from './components/Footer.jsx'
import LandingPage from './pages/LandingPage/index.jsx'
import GuidedInterview from './pages/GuidedInterview/index.jsx'
import OutputPage from './pages/OutputPage/index.jsx'
import PipelineFailedScreen from './components/PipelineFailedScreen.jsx'
import DevDocs from './pages/DevDocs/index.jsx'
import HowToUse from './pages/legal/HowToUse.jsx'
import Privacy from './pages/legal/Privacy.jsx'
import Terms from './pages/legal/Terms.jsx'
import Disclaimer from './pages/legal/Disclaimer.jsx'
import RefundPolicy from './pages/legal/RefundPolicy.jsx'
import './styles/global.css'
import { useState, useEffect, useRef } from 'react'
import AccessGate from './AccessGate.jsx'

// Pathname → component map for legal/help pages opened in new tabs.
// Vite SPA mode falls back to index.html for unknown paths, so these
// pages load the same bundle and this check renders the right component.
const LEGAL_ROUTES = {
  '/how-to-use': HowToUse,
  '/privacy': Privacy,
  '/terms': Terms,
  '/disclaimer': Disclaimer,
  '/refund-policy': RefundPolicy,
}

function AppViews() {
  const { view, error, setView } = useAppState()
  const previousViewRef = useRef('landing')

  // Track previous view for restoring when docs close
  useEffect(() => {
    if (view !== '__devdocs') {
      previousViewRef.current = view
    }
  }, [view])

  // Dev mode: Keyboard shortcut for docs (Ctrl+Shift+D) + URL routing
  useEffect(() => {
    if (!import.meta.env.DEV) return

    // Handle direct URL navigation to /__devdocs on mount and popstate
    const handleUrlRoute = () => {
      if (window.location.pathname === '/__devdocs') {
        setView('__devdocs')
      }
    }

    // Check on mount
    handleUrlRoute()
    window.addEventListener('popstate', handleUrlRoute)

    // Keyboard shortcut handler
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        setView('__devdocs')
      }
      // Escape to close docs and return to previous view
      if (e.key === 'Escape' && view === '__devdocs') {
        setView(previousViewRef.current || 'landing')
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    // Log docs availability on first mount
    if (view === 'landing') {
      console.log('[DevTools] Docs viewer available at /__devdocs (or press Ctrl+Shift+D)')
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('popstate', handleUrlRoute)
    }
  }, [view, setView])

  // Show error screen for unrecoverable errors
  if (error) {
    return <PipelineFailedScreen />
  }

  // Dev mode only: Documentation viewer
  if (view === '__devdocs' && import.meta.env.DEV) {
    return <DevDocs />
  }

  return (
    <div className="app-shell">
      <TopNav />
      <main className="app-main">
        {view === 'landing' ? <LandingPage /> : null}
        {view === 'interview' ? <GuidedInterview /> : null}
        {view === 'output' ? <OutputPage /> : null}
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  const [unlocked, setUnlocked] = useState(false)

  // Legal pages (opened in new tabs via footer) bypass the access gate.
  const pathname = window.location.pathname
  const LegalPage = LEGAL_ROUTES[pathname]
  if (LegalPage) {
    return <LegalPage />
  }

  if (!unlocked) {
    return <AccessGate onUnlock={() => setUnlocked(true)} />
  }

  return (
    <ThemeProvider>
      <AppStateProvider>
        <AppViews />
      </AppStateProvider>
    </ThemeProvider>
  )
}
