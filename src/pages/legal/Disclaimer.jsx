import './LegalPage.css'

export function Disclaimer() {
  return (
    <div className="legal-page">
      <div className="legal-page-inner">
        <h1 className="legal-page-title">Disclaimer</h1>

        <section className="legal-section">
          <h2>General Information Only</h2>
          <p>
            The content, prompts, and frameworks provided within My Operating Manual are
            for general informational and self-reflection purposes only. They do not
            constitute professional advice of any kind — including but not limited to
            career, psychological, legal, or organisational advice.
          </p>
        </section>

        <section className="legal-section">
          <h2>No Professional Relationship</h2>
          <p>
            Use of this application does not create a professional or advisory
            relationship between you and Mindful Internetpreneur. We recommend consulting
            qualified professionals for specific professional, legal, or therapeutic
            guidance.
          </p>
        </section>

        <section className="legal-section">
          <h2>Accuracy of Information</h2>
          <p>
            While we strive to provide useful prompts and structure, we make no
            representations or warranties as to the completeness, accuracy, or suitability
            of the content for your specific circumstances.
          </p>
        </section>

        <section className="legal-section">
          <h2>External Links</h2>
          <p>
            This application may include links to third-party websites such as
            CompressSuite. We are not responsible for the content, privacy practices, or
            accuracy of any third-party sites.
          </p>
        </section>

        <p className="legal-copyright">Copyright Mindful Internetpreneur.</p>
      </div>
    </div>
  )
}

export default Disclaimer
