import { useAppState } from '../../context/AppStateContext.jsx'
import './RightTileImagePreview.css'

export function RightTileImagePreview() {
  const { profilePhoto, setProfilePhoto } = useAppState()

  if (!profilePhoto) {
    return (
      <div className="right-tile-image-preview">
        <p className="right-tile-preview-empty">No image uploaded yet</p>
      </div>
    )
  }

  return (
    <div className="right-tile-image-preview">
      <img
        src={profilePhoto}
        alt="Profile photo preview"
        className="right-tile-preview-image"
      />
      <button
        className="right-tile-remove-button"
        onClick={() => setProfilePhoto(null)}
        aria-label="Remove profile photo"
        title="Remove profile photo"
      >
        Remove
      </button>
    </div>
  )
}

export default RightTileImagePreview
