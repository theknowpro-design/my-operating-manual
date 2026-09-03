import './LegalPage.css'

export function RefundPolicy() {
  return (
    <div className="legal-page">
      <div className="legal-page-inner">
        <h1 className="legal-page-title">Refund Policy</h1>

        <section className="legal-section">
          <h2>All Sales Are Final</h2>
          <p>
            All purchases of the Mindful Internetpreneur Operating Manual are final.
            Because this is a digital product that is delivered instantly at the time of
            purchase, no refunds, cancellations, or exchanges are offered.
          </p>
        </section>

        <section className="legal-section">
          <h2>By Completing Your Purchase, You Acknowledge and Agree That</h2>
          <ul>
            <li>You receive immediate access to the digital product.</li>
            <li>Digital products cannot be returned.</li>
            <li>All sales are final once payment is processed.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Technical Support</h2>
          <p>
            If you experience any technical issues accessing your purchase, support is
            available at:{' '}
            <a
              href="mailto:support@mindfulinternetpreneur.com"
              rel="noopener noreferrer"
            >
              support@mindfulinternetpreneur.com
            </a>
          </p>
        </section>

        <section className="legal-section">
          <h2>Payment Processing</h2>
          <p>
            Purchases are processed through Gumroad, a third-party payment platform. No
            personal information is shared between this application and Gumroad.
          </p>
        </section>

        <p className="legal-copyright">Copyright Mindful Internetpreneur.</p>
      </div>
    </div>
  )
}

export default RefundPolicy
