import './LegalPage.css'

export function Terms() {
  return (
    <div className="legal-page">
      <div className="legal-page-inner">
        <h1 className="legal-page-title">Terms of Use</h1>

        <section className="legal-section">
          <h2>Acceptance of Terms</h2>
          <p>
            By accessing and using My Operating Manual, you accept and agree to be bound
            by these Terms of Use. If you do not agree to these terms, please do not use
            the application.
          </p>
        </section>

        <section className="legal-section">
          <h2>Use of the Application</h2>
          <p>
            My Operating Manual is provided for personal and professional self-reflection
            and communication purposes. You may use the application to create, export,
            and share your personal operating manual.
          </p>
        </section>

        <section className="legal-section">
          <h2>Intellectual Property</h2>
          <p>
            The application, its design, structure, and branding are the property of
            Mindful Internetpreneur. The content you create within the application — your
            answers and exported document — remains your own.
          </p>
        </section>

        <section className="legal-section">
          <h2>No Warranty</h2>
          <p>
            This application is provided "as is" without warranty of any kind. We make no
            guarantees regarding the availability, accuracy, or fitness of the application
            for any particular purpose.
          </p>
        </section>

        <section className="legal-section">
          <h2>Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Mindful Internetpreneur shall not be
            liable for any indirect, incidental, or consequential damages arising from
            your use of this application.
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
          <h2>Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms of Use at any time. Continued use
            of the application following any changes constitutes your acceptance of the
            updated terms.
          </p>
        </section>

        <p className="legal-copyright">Copyright Mindful Internetpreneur.</p>
      </div>
    </div>
  )
}

export default Terms
