import { extractTocFromMarkdown } from '../../utils/manualGenerator.js'
import { smoothScrollToId } from '../../utils/scrollHelpers.js'
import './SidebarTOC.css'

export function SidebarTOC({ markdown }) {
  const toc = extractTocFromMarkdown(markdown)

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
                className={`sidebar-toc-link ${item.level === 3 ? 'is-h3' : ''}`}
                onClick={() => smoothScrollToId(item.id)}
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
