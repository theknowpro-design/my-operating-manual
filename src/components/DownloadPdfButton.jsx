import { useState } from 'react'
import { useAppState } from '../../context/AppStateContext.jsx'
import { Button } from '../Buttons/index.jsx'

/**
 * DownloadPdfButton
 * 
 * Exports the operating manual as a PDF and triggers download.
 * 
 * Uses the locked PDF engine entry point: generateOperatingManualPdf()
 * - Validates content before exporting (schema enforcement)
 * - Includes version metadata automatically
 * - Fails gracefully with clear error messages
 */
export function DownloadPdfButton({ className = '', variant = 'primary' }) {
  const { manualMarkdown, authorName } = useAppState()
  const [isExporting, setIsExporting] = useState(false)

  const handleDownloadPdf = async () => {
    if (!manualMarkdown?.trim()) {
      return
    }

    setIsExporting(true)

    try {
      const title = authorName?.trim()
        ? `${authorName.trim()}'s Operating Manual`
        : 'My Operating Manual'

      // Lazy-load PDF engine so failures cannot blank the app
      const { generateOperatingManualPdf } = await import(
        '../../../modules/pdf-engine/exportManager.js'
      )

      // Call locked entry point with operating manual content
      await generateOperatingManualPdf(manualMarkdown, {
        title,
        subtitle: 'Personal Operating Manual',
        author: authorName || 'My Operating Manual',
        generatedAt: new Date(),
      })
    } catch (error) {
      console.error('[DownloadPdfButton] PDF export failed:', error)
      alert('PDF export failed — see console for details')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button
      variant={variant}
      onClick={handleDownloadPdf}
      disabled={isExporting || !manualMarkdown?.trim()}
      className={className}
      aria-label="Download operating manual as PDF"
    >
      {isExporting ? 'Exporting…' : 'Export PDF'}
    </Button>
  )
}

export default DownloadPdfButton
