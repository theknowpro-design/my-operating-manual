/**
 * Image Upload Modal for TipTap Editor
 * 
 * Allows users to:
 * - Select and validate image files
 * - Check dimensions and size
 * - Upload to external storage
 * - Return external URL for insertion
 */

import { useState } from 'react'
import CompressSuiteLink from '../common/CompressSuiteLink.jsx'
import './ImageUploadModal.css'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_DIMENSIONS = 3000
const COMPRESSION_WARNING_SIZE = 1 * 1024 * 1024 // 1MB for warning
const COMPRESSION_WARNING_DIMENSIONS = 2000

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp']

/**
 * Mock external URL storage
 * In production, this would upload to AWS S3, Cloudinary, etc.
 */
async function uploadToExternalStorage(file) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Create a mock external URL
  // In production, this would return the actual storage URL
  const fileName = `${Date.now()}-${file.name}`
  return `https://storage.example.com/images/${fileName}`
}

/**
 * Get image dimensions from file
 */
async function getImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        resolve({ width: img.width, height: img.height })
      }
      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }
      img.src = e.target.result
    }
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    reader.readAsDataURL(file)
  })
}

export function ImageUploadModal({ isOpen, onClose, onInsert, onCompress }) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [needsCompression, setNeedsCompression] = useState(false)
  const [fileInfo, setFileInfo] = useState(null)
  const [selectedImages, setSelectedImages] = useState([])

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError('')
    setNeedsCompression(false)

    // Validate file type
    const fileExt = file.name.split('.').pop().toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(fileExt) || !ALLOWED_TYPES.includes(file.type)) {
      setError('Invalid file type. Please upload JPG, PNG, or WebP.')
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum size is 5MB.`)
      return
    }

    // Get dimensions
    try {
      setLoading(true)
      const dimensions = await getImageDimensions(file)

      // Check dimensions
      if (dimensions.width > MAX_DIMENSIONS || dimensions.height > MAX_DIMENSIONS) {
        setError(`Image dimensions exceed maximum (${dimensions.width}×${dimensions.height}px). Maximum is 3000×3000px.`)
        return
      }

      // Check if compression recommended
      const shouldWarnAboutCompression =
        file.size > COMPRESSION_WARNING_SIZE ||
        dimensions.width > COMPRESSION_WARNING_DIMENSIONS ||
        dimensions.height > COMPRESSION_WARNING_DIMENSIONS

      setFileInfo({
        name: file.name,
        size: file.size,
        width: dimensions.width,
        height: dimensions.height,
      })
      setNeedsCompression(shouldWarnAboutCompression)
    } catch (err) {
      setError('Failed to validate image. Please try another file.')
      console.error('[ImageUploadModal]', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelected = (event) => {
    console.log('[ImageUpload] handleFileSelected fired, files:', event.target.files?.length)
    const file = event.target.files[0]
    if (!file) return

    // Enforce 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Maximum size is 5MB.')
      return
    }

    setError(null)

    const reader = new FileReader()
    reader.onload = () => {
      console.log('[ImageUpload] reader.result prefix:', reader.result ? reader.result.substring(0, 40) : 'undefined')
      setSelectedImages(prev => {
        const next = [...prev, reader.result]
        console.log('[ImageUpload] selectedImages after append:', next.length, 'total')
        return next
      })
      event.target.value = ""
    }
    reader.readAsDataURL(file)
  }

  const handleInsert = async () => {
    console.log('[ImageUpload] handleInsert triggered, selectedImages.length:', selectedImages.length)
    if (selectedImages.length === 0) return

    setLoading(true)
    try {
      console.log('[ImageUpload] onInsert called with', selectedImages.length, 'images')
      onInsert(selectedImages)
      setSelectedImages([])
      onClose()
    } catch (err) {
      setError('Failed to upload image. Please try again.')
      console.error('[ImageUploadModal]', err)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="image-upload-modal-overlay">
      <div
        className="image-upload-modal-backdrop"
        onClick={onClose}
      />
      <div
        className="image-upload-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="image-upload-modal-header">
          <h2 className="image-upload-modal-title">Insert Image</h2>
          <button
            className="image-upload-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="image-upload-modal-content">
          <CompressSuiteLink />
          <div className="image-upload-modal-input-wrapper">
            <label
              htmlFor="modal-file-input"
              className="image-upload-choose-button"
            >
              Choose Image
            </label>
          </div>

          <div className="image-upload-limit">
            Maximum file size: 5MB
          </div>

          {error && (
            <div className="image-upload-error">
              {error}
            </div>
          )}

          {fileInfo && (
            <div className="image-upload-modal-info">
              <p className="image-upload-modal-filename">{fileInfo.name}</p>
              <p className="image-upload-modal-details">
                {fileInfo.width}×{fileInfo.height}px • {(fileInfo.size / 1024).toFixed(1)}KB
              </p>
            </div>
          )}

          {needsCompression && fileInfo && (
            <div className="image-upload-modal-warning">
              <p className="image-upload-modal-warning-text">
                This image is fairly large. Consider compressing it for faster loading.
              </p>
              <button
                className="image-upload-modal-warning-button"
                onClick={() => {
                  onCompress(fileInfo)
                  onClose()
                }}
              >
                Open Compression Tool
              </button>
            </div>
          )}
        </div>

        <input
          id="modal-file-input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{
            position: "absolute",
            left: "-9999px",
            width: "1px",
            height: "1px",
            opacity: 0
          }}
          onChange={handleFileSelected}
        />

        <div className="image-upload-modal-footer">
          <button
            className="image-upload-modal-button is-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="image-upload-modal-button is-primary"
            onClick={handleInsert}
            disabled={selectedImages.length === 0 || loading}
          >
            {loading ? 'Uploading...' : 'Insert Image'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ImageUploadModal
