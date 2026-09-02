import RightTileLinkDisplay from './RightTileLinkDisplay.jsx'
import RightTileImageUpload from './RightTileImageUpload.jsx'
import RightTileImagePreview from './RightTileImagePreview.jsx'
import './RightTile.css'

export function RightTile() {
  return (
    <aside className="right-tile" aria-label="Utility panel">
      <div className="right-tile-content">
        <h2 className="right-tile-title">Tools</h2>

        <section className="right-tile-section">
          <RightTileLinkDisplay />
        </section>

        <section className="right-tile-section">
          <RightTileImageUpload />
          <RightTileImagePreview />
        </section>
      </div>
    </aside>
  )
}

export default RightTile
