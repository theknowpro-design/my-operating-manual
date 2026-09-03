import './LegalPage.css'

export function Privacy() {
  return (
    <div className="legal-page">
      <div className="legal-page-inner">
        <h1 className="legal-page-title">Privacy Policy</h1>

        <section className="legal-section">
          <h2>Data Collection</h2>
          <p>
            My Operating Manual does not collect, store, or transmit any personal data to
            external servers. All information you enter during the interview — including
            your name and responses — is stored only in your browser session and is never
            sent to any server.
          </p>
        </section>

        <section className="legal-section">
          <h2>Browser Storage</h2>
          <p>
            The application uses temporary browser memory (React state) to hold your
            responses during your session. This data is cleared automatically when you
            close the tab, refresh the page, or click "Start over."
          </p>
        </section>

        <section className="legal-section">
          <h2>Cookies and Local Storage</h2>
          <p>
            This application does not use tracking cookies. A single preference (light or
            dark theme) may be saved to <code>localStorage</code> on your device. No
            personal data is stored in this preference.
          </p>
        </section>

        <section className="legal-section">
          <h2>Third-Party Services</h2>
          <p>
            This application does not integrate with third-party analytics, advertising,
            or tracking services. Purchases of the Mindful Internetpreneur Operating
            Manual are processed through Gumroad, a third-party payment platform. No
            personal information is shared between this application and Gumroad.
          </p>
        </section>

        <section className="legal-section">
          <h2>PDF Export</h2>
          <p>
            The PDF export feature generates your document entirely within your browser
            using client-side libraries. The resulting file is downloaded directly to your
            device and is not uploaded to any server.
          </p>
        </section>

        <section className="legal-section">
          <h2>Contact</h2>
          <p>
            If you have questions about this Privacy Policy, please visit{' '}
            <a
              href="https://mindfulinternetpreneur.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mindful Internetpreneur
            </a>
            .
          </p>
        </section>

        <p className="legal-copyright">Copyright Mindful Internetpreneur.</p>
      </div>
    </div>
  )
}

export default Privacy
