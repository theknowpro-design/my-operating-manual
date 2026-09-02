import { useEffect, useState } from 'react'
import { extractTocFromMarkdown } from '../../utils/manualGenerator.js'
import { smoothScrollToId } from '../../utils/scrollHelpers.js'
import './SidebarTOC.css'

export function SidebarTOC({ markdown }) {
  const toc = extractTocFromMarkdown(markdown)
  const [activeId, setActiveId] = useState('')

  // Listen for hash changes to update active state
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (hash) {
        setActiveId(hash)
      }
    }

    // Set initial active ID from hash
    handleHashChange()

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return (
    <nav className="sidebar-toc" aria-label="Manual table of contents">
      <div className="sidebar-toc-title">Contents</div>
      {toc.length === 0 ? (
        <p className="sidebar-toc-empty">Sections appear after generation.</p>
      ) : (
        <ul className="sidebar-toc-list">
          {toc.map((item) => (
            <li key={`${item.id}-${item.title}`}>
              <button
                type="button"
                className={`sidebar-toc-link ${item.level === 3 ? 'is-h3' : ''} ${
                  activeId === item.id ? 'is-active' : ''
                }`}
                onClick={() => smoothScrollToId(item.id)}
                aria-current={activeId === item.id ? 'page' : undefined}
              >
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}

export default SidebarTOC
