import { ThemeProvider } from './context/ThemeContext.jsx'
import { AppStateProvider, useAppState } from './context/AppStateContext.jsx'
import TopNav from './components/TopNav/index.jsx'
import LandingPage from './pages/LandingPage/index.jsx'
import GuidedInterview from './pages/GuidedInterview/index.jsx'
import OutputPage from './pages/OutputPage/index.jsx'
import './styles/global.css'

function AppViews() {
  const { view } = useAppState()

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
