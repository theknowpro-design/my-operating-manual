import { useState, useEffect } from 'react'
import { marked } from 'marked'
import { sanitizeHtml } from '../../utils/sanitizeHtml.js'
import { useAppState } from '../../context/AppStateContext.jsx'
import './DevDocs.css'

/**
 * DevDocs — Developer-Only Documentation Viewer
 * 
 * IMPORTANT: This component is ONLY loaded in development mode.
 * It is NOT included in production builds.
 * It is NOT accessible to end users.
 * 
 * Access via: /__devdocs or Ctrl+Shift+D in dev mode
 */

const DOCS = [
  {
    id: 'project-overview',
    name: 'Project Overview',
    file: 'PROJECT_OVERVIEW.md',
  },
  {
    id: 'pipeline',
    name: 'Pipeline (12 Phases)',
    file: 'PIPELINE.md',
  },
  {
    id: 'pdf-engine',
    name: 'PDF Engine',
    file: 'PDF_ENGINE.md',
  },
  {
    id: 'asset-policy',
    name: 'Asset Policy',
    file: 'ASSET_POLICY.md',
  },
  {
    id: 'versioning',
    name: 'Versioning',
    file: 'VERSIONING.md',
  },
  {
    id: 'readme',
    name: 'Docs Index (README)',
    file: 'README.md',
  },
]

/**
 * Error boundary for doc loading.
 */
function DocErrorBoundary({ error, onRetry }) {
  if (!error) return null
  return (
    <div className="dev-docs-error">
      <strong>Error loading documentation:</strong>
      <p>{String(error)}</p>
      <button onClick={onRetry} className="dev-docs-retry-btn">Retry</button>
    </div>
  )
}

export function DevDocs() {
  const { setView } = useAppState()
  const [selected, setSelected] = useState('project-overview')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load markdown content
  useEffect(() => {
    const loadDoc = async () => {
      setLoading(true)
      setError(null)

      try {
        const doc = DOCS.find((d) => d.id === selected)
        if (!doc) {
          throw new Error('Document not found')
        }

        // Fetch from public/docs (dev-only, not in production)
        const response = await fetch(`/docs/${doc.file}`)
        if (!response.ok) {
          throw new Error(`Failed to load ${doc.file} (HTTP ${response.status})`)
        }

        const markdown = await response.text()
        if (!markdown || typeof markdown !== 'string') {
          throw new Error(`Document is empty or invalid: ${doc.file}`)
        }

        const html = sanitizeHtml(marked.parse(markdown))
        setContent(html)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err)
        console.error('[DevDocs] Failed to load document:', errorMsg)
        setError(errorMsg)
        setContent('')
      } finally {
        setLoading(false)
      }
    }

    loadDoc()
  }, [selected])

  const currentDoc = DOCS.find((d) => d.id === selected)

  return (
    <div className="dev-docs">
      <div className="dev-docs-header">
        <h1>📚 Developer Documentation</h1>
        <p className="dev-docs-notice">⚠️ Dev mode only — Not available in production</p>
      </div>

      <div className="dev-docs-container">
        {/* Sidebar */}
        <aside className="dev-docs-sidebar">
          <nav className="dev-docs-nav">
            <h3>Docs</h3>
            {DOCS.map((doc) => (
              <button
                key={doc.id}
                className={`dev-docs-nav-item ${selected === doc.id ? 'is-active' : ''}`}
                onClick={() => setSelected(doc.id)}
                aria-current={selected === doc.id ? 'page' : undefined}
              >
                {doc.name}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="dev-docs-main">
          {currentDoc && (
            <header className="dev-docs-content-header">
              <h2>{currentDoc.name}</h2>
              <p className="dev-docs-filename">{currentDoc.file}</p>
            </header>
          )}

          {loading && <div className="dev-docs-loading">Loading…</div>}

          <DocErrorBoundary error={error} onRetry={() => setSelected(selected)} />

          {!loading && !error && (
            <article
              className="dev-docs-content markdown-content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </main>
      </div>

      {/* Close Button */}
      <button
        className="dev-docs-close"
        onClick={() => {
          // Dispatch Escape key to trigger App.jsx's Escape handler
          // which will restore the previous view via previousViewRef
          const event = new KeyboardEvent('keydown', {
            key: 'Escape',
            code: 'Escape',
            keyCode: 27,
            which: 27,
            bubbles: true,
          })
          window.dispatchEvent(event)
        }}
        aria-label="Close documentation viewer"
        title="Close (or press Escape)"
      >
        ✕
      </button>
    </div>
  )
}

export default DevDocs
