import { useState } from 'react'
import { useAppState } from '../../context/AppStateContext.jsx'
import { Button } from '../../components/Buttons/index.jsx'
import logo from '../../assets/Teal Read Me Logo.png'
import './LandingPage.css'

export function LandingPage() {
  const { startInterview, authorName } = useAppState()
  const [name, setName] = useState(authorName || '')

  const handleStart = (event) => {
    event.preventDefault()
    startInterview(name.trim())
  }

  return (
    <section className="landing-page" aria-labelledby="landing-brand">
      <div className="landing-hero">
        <h1 className="landing-brand" id="landing-brand">
          My Operating Manual
        </h1>
        <p className="landing-headline">
          A 12-phase interview that turns how you work into a shareable guide.
        </p>
        <p className="landing-support">
          Capture values, communication preferences, decision style, and boundaries —
          then export a polished PDF your collaborators can actually use.
        </p>

        <form className="landing-form" onSubmit={handleStart}>
          <label className="landing-label" htmlFor="author-name">
            Your name (optional)
          </label>
          <div className="landing-form-controls">
            <input
              id="author-name"
              className="landing-input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Used on the cover of your manual"
              autoComplete="name"
            />
            <Button type="submit" variant="primary">
              Begin interview
            </Button>
          </div>
        </form>
      </div>

      <div className="landing-divider" aria-hidden="true" />

      <div className="landing-atmosphere">
        <div className="landing-atmosphere-inner">
          <div className="landing-cover-stack">
            <p className="landing-cover-label">PDF preview</p>
            <div className="landing-cover-preview" aria-hidden="true">
              <img
                className="landing-cover-preview-logo"
                src={logo}
                alt=""
                width={48}
                height={48}
                decoding="async"
              />
              <p className="landing-cover-preview-title">My Operating Manual</p>
            </div>
          </div>

          <p className="landing-atmosphere-copy">
            Write once. Align faster. Reduce the guessing that slows teams down.
          </p>
        </div>
      </div>
    </section>
  )
}

export default LandingPage
