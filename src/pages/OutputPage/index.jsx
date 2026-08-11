import { useAppState } from '../../context/AppStateContext.jsx'
import SidebarTOC from '../../components/SidebarTOC/index.jsx'
import ManualRenderer from '../../components/ManualRenderer/index.jsx'
import ActionBar from '../../components/ActionBar/index.jsx'
import './OutputPage.css'

export function OutputPage() {
  const { manualMarkdown, authorName } = useAppState()

  return (
    <section className="output-page" aria-labelledby="output-title">
      <header className="output-page-header">
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
      </div>

      <ActionBar />
    </section>
  )
}

export default OutputPage
