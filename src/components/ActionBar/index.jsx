import { useState } from 'react'
import { useAppState } from '../../context/AppStateContext.jsx'
import { Button } from '../Buttons/index.jsx'
import { exceedsPhaseLimit } from '../../utils/characterCountFromMarkdown.js'
import { TOTAL_PHASES } from '../../data/phases.js'
import './ActionBar.css'

export function ActionBar() {
  const {
    manualMarkdown,
    authorName,
    profilePhoto,
    responses,
    setView,
    resetInterview,
    regenerateManual,
  } = useAppState()

  const [status, setStatus] = useState({ tone: '', message: '' })
  const [exporting, setExporting] = useState(false)

  const flash = (tone, message, ms = 2400) => {
    setStatus({ tone, message })
    window.setTimeout(() => {
      setStatus((prev) => (prev.message === message ? { tone: '', message: '' } : prev))
    }, ms)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(manualMarkdown || '')
      flash('success', 'Copied markdown to clipboard')
    } catch {
      flash('error', 'Could not copy — try selecting the text')
    }
  }

  const handlePrint = () => {
    window.print()
    flash('success', 'Print dialog opened')
  }

  const handleExportPdf = async () => {
    if (!manualMarkdown?.trim()) {
      flash('error', 'Nothing to export yet')
      return
    }

    // Validate all phase character limits before exporting
    for (let phaseId = 0; phaseId < TOTAL_PHASES; phaseId++) {
      const phaseMarkdown = responses[phaseId] || ''
      if (exceedsPhaseLimit(phaseMarkdown, phaseId)) {
        const phaseNum = phaseId + 1
        flash('error', `Phase ${phaseNum} exceeds character limit. Please reduce content and try again.`)
        return
      }
    }

    setExporting(true)
    flash('busy', 'Generating PDF…', 8000)

    try {
      const title = authorName?.trim()
        ? `${authorName.trim()}'s Operating Manual`
        : 'My Operating Manual'

      // Lazy-load so PDF engine / logo asset failures cannot blank the whole app.
      // Uses LOCKED entry point to enforce schema validation and branding.
      const { generateOperatingManualPdf } = await import('../../../modules/pdf-engine/exportManager.js')
      await generateOperatingManualPdf(manualMarkdown, {
        title,
        subtitle: 'Personal Operating Manual',
        author: authorName || 'My Operating Manual',
        generatedAt: new Date(),
        profilePhoto: profilePhoto || null,
      })

      flash('success', 'PDF exported')
    } catch (error) {
      console.error('[ActionBar] PDF export failed:', error)
      flash('error', 'PDF export failed — see console for details')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="action-bar" role="toolbar" aria-label="Manual actions">
      <div
        className={`action-bar-status ${status.tone ? `is-${status.tone}` : ''}`}
        role="status"
        aria-live="polite"
      >
        {status.message}
      </div>

      <Button variant="secondary" onClick={handleCopy}>
        Copy
      </Button>
      <Button variant="secondary" onClick={handlePrint}>
        Print
      </Button>
      <Button
        variant="primary"
        onClick={handleExportPdf}
        disabled={exporting || !manualMarkdown?.trim()}
      >
        {exporting ? 'Exporting…' : 'Export PDF'}
      </Button>
      <Button
        variant="ghost"
        onClick={() => {
          regenerateManual()
          setView('interview')
        }}
      >
        Edit answers
      </Button>
      <Button variant="ghost" onClick={resetInterview}>
        Start over
      </Button>
    </div>
  )
}

export default ActionBar
