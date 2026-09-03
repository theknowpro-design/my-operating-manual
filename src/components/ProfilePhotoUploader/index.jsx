import { useRef, useState } from 'react'
import { useAppState } from '../../context/AppStateContext.jsx'
import './ProfilePhotoUploader.css'

const MAX_FILE_SIZE = 1 * 1024 * 1024
const ALLOWED_TYPES = ['image/png', 'image/jpeg']

export function ProfilePhotoUploader() {
  const { profilePhoto, setProfilePhoto } = useAppState()
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const handleFileChange = async (e) => {
    setError('')
    const file = e.target.files?.[0]

    if (!file) return

    if (file.size > MAX_FILE_SIZE) {
      setError(`File is too large. Maximum size is 1MB (your file: ${(file.size / 1024 / 1024).toFixed(2)}MB)`)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Please upload a PNG or JPG image')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    try {
      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target?.result
        if (dataUrl && typeof dataUrl === 'string') {
          setProfilePhoto(dataUrl)
          setError('')
        }
      }
      reader.onerror = () => {
        setError('Failed to read file. Please try again.')
      }
      reader.readAsDataURL(file)
    } catch (err) {
      setError('An error occurred while uploading the photo.')
      console.error('[ProfilePhotoUploader]', err)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="profile-photo-uploader">
      <button
        className="profile-photo-button"
        onClick={handleClick}
        aria-label="Upload profile photo"
        title="Click to upload a profile photo (PNG or JPG, max 1MB)"
      >
        {profilePhoto ? (
          <img
            src={profilePhoto}
            alt="Profile photo"
            className="profile-photo-image"
          />
        ) : (
          <div className="profile-photo-placeholder">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="profile-photo-label">Upload Photo</span>
          </div>
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".png,.jpg,.jpeg"
        onChange={handleFileChange}
        aria-label="Profile photo file input"
        className="profile-photo-input"
      />

      {error && (
        <div className="profile-photo-error" role="alert">
          {error}
        </div>
      )}

      {profilePhoto && (
        <button
          className="profile-photo-remove"
          onClick={() => {
            setProfilePhoto(null)
            if (fileInputRef.current) fileInputRef.current.value = ''
            setError('')
          }}
          aria-label="Remove profile photo"
        >
          Remove
        </button>
      )}
    </div>
  )
}

export default ProfilePhotoUploader
