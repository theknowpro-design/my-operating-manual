import './LegalPage.css'

export function HowToUse() {
  return (
    <div className="legal-page">
      <div className="legal-page-inner">
        <h1 className="legal-page-title">How to Use My Operating Manual</h1>

        <section className="legal-section">
          <h2>Overview</h2>
          <p>
            My Operating Manual is a 12-phase guided interview that helps you articulate
            how you work, communicate, and collaborate. The result is a personalised
            document — your Operating Manual — that you can share with colleagues,
            managers, and collaborators.
          </p>
        </section>

        <section className="legal-section">
          <h2>Getting Started</h2>
          <p>
            Enter your name on the home screen and click <strong>Begin interview</strong>.
            Your name will appear on the cover of your exported manual. It is entirely
            optional.
          </p>
        </section>

        <section className="legal-section">
          <h2>The 12 Phases</h2>
          <p>
            Work through each phase at your own pace. Every phase asks a focused question
            about one dimension of how you operate — from your values and strengths to
            your communication style and boundaries. Answer in your own words.
          </p>
          <p>
            The editor supports basic formatting: bold, italic, underline, headings,
            bullet lists, and numbered lists. A character counter tracks your input for
            each phase.
          </p>
        </section>

        <section className="legal-section">
          <h2>Optional Deepening Questions</h2>
          <p>
            Each phase includes optional follow-up questions. These are not required but
            add nuance and context to your manual. Complete as many or as few as you like.
          </p>
        </section>

        <section className="legal-section">
          <h2>Exporting Your Manual</h2>
          <p>Once you have completed all phases, you will be taken to the Results page. From there you can:</p>
          <ul>
            <li><strong>Copy</strong> — copies the raw markdown to your clipboard.</li>
            <li><strong>Print</strong> — opens your browser's print dialog.</li>
            <li>
              <strong>Export PDF</strong> — generates a formatted, branded PDF that
              downloads directly to your device.
            </li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Editing Your Answers</h2>
          <p>
            Use the <strong>Edit answers</strong> button on the Results page to return to
            the interview and revise any phase. Your progress is preserved for the
            duration of your browser session.
          </p>
        </section>

        <section className="legal-section">
          <h2>Privacy</h2>
          <p>
            All data is stored only in your current browser session. Nothing is sent to
            any server. Closing the tab or refreshing the page will clear your answers.
          </p>
        </section>

        <section className="legal-section">
          <h2>Tools Panel</h2>
          <p>
            The Tools panel on the Results page provides a quick link to{' '}
            <a
              href="https://compresssuite.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              CompressSuite
            </a>{' '}
            for image compression if needed during your workflow.
          </p>
        </section>

        <p className="legal-copyright">Copyright Mindful Internetpreneur.</p>
      </div>
    </div>
  )
}

export default HowToUse
