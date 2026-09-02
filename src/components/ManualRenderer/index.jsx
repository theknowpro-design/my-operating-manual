import { useMemo, useState, useEffect, useRef } from 'react'
import { marked } from 'marked'
import { sanitizeHtml } from '../../utils/sanitizeHtml.js'
import { slugify } from '../../utils/manualGenerator.js'
import './ManualRenderer.css'

marked.use({
  gfm: true,
  breaks: true,
  renderer: {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens)
      const id = slugify(text.replace(/<[^>]+>/g, ''))
      return `<h${depth} id="${id}" data-section-id="${id}">${text}</h${depth}>\n`
    },
  },
})

/**
 * Parse HTML to find H2 section boundaries.
 * Returns array of { id, h2Element, contentUntilNextH2 }
 */
function parseSectionsFromHtml(html) {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = html

  const sections = []
  let currentSection = null

  for (const child of wrapper.children) {
    if (child.tagName === 'H2') {
      if (currentSection) {
        sections.push(currentSection)
      }
      const id = child.getAttribute('data-section-id') || child.getAttribute('id') || `section-${sections.length}`
      currentSection = { id, content: [] }
    }

    if (currentSection) {
      currentSection.content.push(child.cloneNode(true))
    }
  }

  if (currentSection) {
    sections.push(currentSection)
  }

  return sections
}

export function ManualRenderer({ markdown, onExpandSection }) {
  const [expandedSections, setExpandedSections] = useState(new Set())
  const sectionsRef = useRef([])

  const html = useMemo(() => {
    if (!markdown?.trim()) return ''
    const raw = marked.parse(markdown)
    return sanitizeHtml(raw)
  }, [markdown])

  // Parse sections and set up default expanded state
  useEffect(() => {
    if (!html) return
    const sections = parseSectionsFromHtml(html)
    sectionsRef.current = sections
    // All sections start expanded
    setExpandedSections(new Set(sections.map(s => s.id)))
  }, [html])

  // Auto-expand section on deep link or scroll-spy
  useEffect(() => {
    if (onExpandSection) {
      const handleExpandRequest = (id) => {
        setExpandedSections(prev => new Set([...prev, id]))
      }
      window.__expandSection = handleExpandRequest
    }
  }, [onExpandSection])

  const toggleSection = (id) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  if (!html) {
    return (
      <article className="manual-renderer">
        <p className="manual-renderer-empty">
          Your operating manual will appear here once the interview is complete.
        </p>
      </article>
    )
  }

  const sections = sectionsRef.current

  return (
    <article className="manual-renderer">
      {sections.length === 0 ? (
        <div dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        sections.map(section => (
          <div
            key={section.id}
            className={`collapsible-section ${expandedSections.has(section.id) ? 'expanded' : 'collapsed'}`}
          >
            <button
              className="collapsible-header"
              onClick={() => toggleSection(section.id)}
              aria-expanded={expandedSections.has(section.id)}
              aria-controls={`content-${section.id}`}
            >
              <span className="collapsible-icon" />
              <span className="collapsible-heading">
                {section.content[0]?.textContent || ''}
              </span>
            </button>
            <div
              id={`content-${section.id}`}
              className="collapsible-content"
              role="region"
              aria-labelledby={`header-${section.id}`}
            >
              {section.content.map((node, idx) => (
                <div
                  key={idx}
                  dangerouslySetInnerHTML={{ __html: node.outerHTML }}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </article>
  )
}

export default ManualRenderer
