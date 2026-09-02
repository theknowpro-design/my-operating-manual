import './Footer.css'

export function Footer() {
  return (
    <footer className="app-footer">
      <div className="app-footer-inner">
        <nav className="app-footer-links" aria-label="Legal and help links">
          <a href="/how-to-use" target="_blank" rel="noopener noreferrer">
            How to Use
          </a>
          <a href="/privacy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
          <a href="/terms" target="_blank" rel="noopener noreferrer">
            Terms of Use
          </a>
          <a href="/disclaimer" target="_blank" rel="noopener noreferrer">
            Disclaimer
          </a>
          <a href="/refund-policy" target="_blank" rel="noopener noreferrer">
            Refund Policy
          </a>
        </nav>
        <p className="app-footer-copyright">
          &copy; {new Date().getFullYear()}{' '}
          <a
            href="https://mindfulinternetpreneur.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mindful Internetpreneur
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer
