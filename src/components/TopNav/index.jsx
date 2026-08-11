import { useAppState } from '../../context/AppStateContext.jsx'
import LongFormClock from '../LongFormClock/index.jsx'
import ThemeToggle from '../ThemeToggle/index.jsx'
import logo from '../../assets/Teal Read Me Logo.png'
import './TopNav.css'

export function TopNav() {
  const { setView, isInterviewComplete } = useAppState()

  return (
    <header className="top-nav">
      <div className="top-nav-inner">
        <button
          type="button"
          className="top-nav-brand"
          onClick={() => setView('landing')}
          aria-label="Go to home"
        >
          <img
            className="top-nav-logo"
            src={logo}
            alt=""
            width={56}
            height={56}
            decoding="async"
          />
          <span className="top-nav-brand-text">
            <span className="top-nav-title">My Operating Manual</span>
            <span className="top-nav-tagline">
              {isInterviewComplete ? 'Your guide is ready' : 'How you work, written down'}
            </span>
          </span>
        </button>

        <div className="top-nav-center">
          <LongFormClock />
        </div>

        <div className="top-nav-actions">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

export default TopNav
