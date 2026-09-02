import { useAppState } from '../../context/AppStateContext.jsx'
import SidebarTOC from '../../components/SidebarTOC/index.jsx'
import ManualRenderer from '../../components/ManualRenderer/index.jsx'
import ActionBar from '../../components/ActionBar/index.jsx'
import ScrollToTopButton from '../../components/ScrollToTopButton/index.jsx'
import RightTile from '../../components/RightTile/index.jsx'
import { useEffect, useState } from 'react'
import { scrollToHashOnLoad, setupScrollSpyHashUpdates } from '../../utils/scrollHelpers.js'
import { extractTocFromMarkdown } from '../../utils/manualGenerator.js'
import './OutputPage.css'

export function OutputPage() {
  const { manualMarkdown, authorName, profilePhoto } = useAppState()
  const [toc, setToc] = useState([])

  // Initialize deep-link navigation on mount
  useEffect(() => {
    // Extract TOC for scroll-spy
    const tocEntries = extractTocFromMarkdown(manualMarkdown)
    setToc(tocEntries)

    // Auto-scroll and expand section if hash present on initial load
    scrollToHashOnLoad()
    if (window.location.hash) {
      const id = window.location.hash.slice(1)
      if (window.__expandSection) {
        window.__expandSection(id)
      }
    }
  }, [manualMarkdown])

  // Set up automatic hash updates as user scrolls
  useEffect(() => {
    if (toc.length === 0) return
    const cleanup = setupScrollSpyHashUpdates(toc, (id) => {
      // Auto-expand section when it becomes active via scroll-spy
      if (window.__expandSection) {
        window.__expandSection(id)
      }
    })
    return cleanup
  }, [toc])

  return (
    <section className="output-page" aria-labelledby="output-title">
      <header className="output-page-header">
        {profilePhoto && (
          <img
            src={profilePhoto}
            alt="Profile photo"
            className="output-page-profile-photo"
          />
        )}
        <h1 className="output-page-title" id="output-title">
          {authorName ? `${authorName}'s Operating Manual` : 'Your Operating Manual'}
        </h1>
        <p className="output-page-subtitle">
          Review the generated guide, jump sections from the sidebar, then export a light-mode PDF.
        </p>
      </header>

      <div className="output-page-layout">
        <SidebarTOC markdown={manualMarkdown} />
        <ManualRenderer markdown={manualMarkdown} />
        <RightTile />
      </div>

      <ActionBar />
      <ScrollToTopButton />
    </section>
  )
}

export default OutputPage
