/**
 * Validation utilities for Right Tile features
 */

/**
 * Validate URL format (http/https only)
 * @param {string} url - The URL to validate
 * @returns {{isValid: boolean, error?: string}}
 */
export function validateLink(url) {
  if (!url || !url.trim()) {
    return { isValid: false, error: 'URL cannot be empty' }
  }

  try {
    const urlObj = new URL(url)
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { isValid: false, error: 'URL must start with http:// or https://' }
    }
    return { isValid: true }
  } catch (_err) {
    return { isValid: false, error: 'Invalid URL format' }
  }
}

/**
 * Validate image file
 * @param {File} file - The file to validate
 * @param {number} maxSizeInMB - Maximum file size in MB (default: 5)
 * @returns {{isValid: boolean, error?: string}}
 */
export function validateImage(file, maxSizeInMB = 5) {
  if (!file) {
    return { isValid: false, error: 'No file selected' }
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'File must be JPG, PNG, or WebP' }
  }

  const maxSizeInBytes = maxSizeInMB * 1024 * 1024
  if (file.size > maxSizeInBytes) {
    return { isValid: false, error: `File must be smaller than ${maxSizeInMB}MB` }
  }

  return { isValid: true }
}

/**
 * Convert file to data URL
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Data URL string
 */
export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
