import { useRef, useState } from 'react'
import { useAppState } from '../../context/AppStateContext.jsx'
import { validateImage, fileToDataUrl } from '../../utils/validateRightTile.js'
import './RightTileImageUpload.css'

export function RightTileImageUpload() {
  const { setProfilePhoto } = useAppState()
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')
    const validation = validateImage(file)

    if (!validation.isValid) {
      setError(validation.error)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    try {
      const dataUrl = await fileToDataUrl(file)
      setProfilePhoto(dataUrl)
    } catch (_err) {
      setError('Failed to process image')
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="right-tile-image-upload">
      <label>Upload Image</label>
      <button
        className="right-tile-upload-button"
        onClick={handleClick}
        aria-label="Upload image"
        title="Click to upload JPG, PNG, or WebP (max 5MB)"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <span>Choose Image</span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        onChange={handleFileChange}
        aria-label="Image file input"
        className="right-tile-file-input"
      />
      <p className="right-tile-upload-hint">JPG, PNG, or WebP (max 5MB)</p>
      {error && <div className="right-tile-error">{error}</div>}
    </div>
  )
}

export default RightTileImageUpload
