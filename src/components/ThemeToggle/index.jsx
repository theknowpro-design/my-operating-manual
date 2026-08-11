import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../../context/ThemeContext.jsx'
import './ThemeToggle.css'

export function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme()
  const [fxClass, setFxClass] = useState('')
  const [fxIcon, setFxIcon] = useState('')
  const tokenRef = useRef(0)

  useEffect(() => {
    if (!fxClass) return undefined
    const token = tokenRef.current
    const timer = window.setTimeout(() => {
      if (tokenRef.current === token) {
        setFxClass('')
        setFxIcon('')
      }
    }, 500)
    return () => window.clearTimeout(timer)
  }, [fxClass])

  const handleToggle = () => {
    const goingDark = !isDark
    tokenRef.current += 1
    setFxIcon(goingDark ? '🌙' : '☀️')
    setFxClass(goingDark ? 'is-moonset' : 'is-sunrise')
    toggleTheme()
  }

  return (
    <div className="theme-toggle-wrap">
      <span className={`theme-toggle-fx ${fxClass}`} aria-hidden="true">
        {fxIcon}
      </span>
      <button
        type="button"
        className={`theme-toggle ${isDark ? 'is-dark' : 'is-light'}`}
        onClick={handleToggle}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-pressed={isDark}
        title={`Theme: ${theme}`}
      >
        <span className="theme-toggle-track" aria-hidden="true">
          <span className="theme-icon theme-icon-sun">☀️</span>
          <span className="theme-toggle-thumb" />
          <span className="theme-icon theme-icon-moon">🌙</span>
        </span>
      </button>
    </div>
  )
}

export default ThemeToggle
