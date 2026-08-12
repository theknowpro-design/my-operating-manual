import { ThemeProvider } from './context/ThemeContext.jsx'
import { AppStateProvider, useAppState } from './context/AppStateContext.jsx'
import TopNav from './components/TopNav/index.jsx'
import LandingPage from './pages/LandingPage/index.jsx'
import GuidedInterview from './pages/GuidedInterview/index.jsx'
import OutputPage from './pages/OutputPage/index.jsx'
import PipelineFailedScreen from './components/PipelineFailedScreen.jsx'
import DevDocs from './pages/DevDocs/index.jsx'
import './styles/global.css'
import { useEffect, useRef } from 'react'

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
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppStateProvider>
        <AppViews />
      </AppStateProvider>
    </ThemeProvider>
  )
}
