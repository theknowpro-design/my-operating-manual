/**
 * Asset Whitelist Validator
 * 
 * Enforces a strict whitelist of approved assets to prevent contamination
 * from legacy Money Maker App assets or other unwanted files.
 * 
 * APPROVED ASSETS:
 * - Teal Read Me Logo.png — My Operating Manual branding
 * - hero.png — Optional hero image for landing
 * - react.svg — React logo (framework credit)
 * - vite.svg — Vite logo (build tool credit)
 * - favicon.svg — App favicon (any)
 * - icons.svg — Icon sprite (any)
 * 
 * All other image/video/media assets are REJECTED.
 */

/**
 * Official whitelist of approved assets.
 * 
 * Assets must match this list exactly (case-sensitive).
 * Path should be relative to asset directory root.
 * 
 * @type {Set<string>}
 */
const APPROVED_ASSETS = new Set([
  // Core branding
  'Teal Read Me Logo.png',

  // Landing page (optional)
  'hero.png',

  // Framework/tool credits
  'react.svg',
  'vite.svg',

  // App assets
  'favicon.svg',
  'icons.svg',
])

/**
 * Check if an asset is on the whitelist.
 * 
 * Supports:
 * - Direct filenames: 'Teal Read Me Logo.png'
 * - Percent-encoded URLs: 'Teal%20Read%20Me%20Logo.png'
 * - Vite hashed URLs: 'Teal Read Me Logo-ab12cd34.png' or 'Teal%20Read%20Me%20Logo-ab12cd34.png'
 * 
 * @param {string} filename - Asset filename or URL
 * @returns {boolean}
 */
export function isWhitelistedAsset(filename) {
  if (!filename || typeof filename !== 'string') {
    return false
  }
  
  let trimmed = filename.trim()
  
  // Decode percent-encoded URLs (Vite ?url imports often emit percent-encoded paths)
  try {
    trimmed = decodeURIComponent(trimmed)
  } catch {
    // If decoding fails, use original string
  }
  
  // Direct match first (fastest path)
  if (APPROVED_ASSETS.has(trimmed)) {
    return true
  }
  
  // Vite hashing support: extract base filename without hash
  // Example: 'Teal Read Me Logo-ab12cd34.png' → 'Teal Read Me Logo'
  // Hash pattern: -[a-f0-9]{8} before file extension
  const baseFilenameMatch = trimmed.match(/^(.+?)(?:-[a-f0-9]{8})?(\.[^.]+)$/)
  if (baseFilenameMatch) {
    const baseWithoutHash = baseFilenameMatch[1] + baseFilenameMatch[2]
    if (APPROVED_ASSETS.has(baseWithoutHash)) {
      return true
    }
  }
  
  return false
}

/**
 * Get the reason an asset was rejected.
 * 
 * @param {string} filename - Asset filename
 * @returns {string}
 */
export function getAssetRejectionReason(filename) {
  if (!filename) {
    return 'Asset filename is empty'
  }

  if (!isWhitelistedAsset(filename)) {
    return `Asset "${filename}" is not on the approved whitelist. Approved assets: ${Array.from(
      APPROVED_ASSETS
    )
      .map((a) => `"${a}"`)
      .join(', ')}`
  }

  return null
}

/**
 * Validate asset usage before PDF generation.
 * 
 * Used to prevent Money Maker graphs or other legacy assets
 * from being embedded in PDFs.
 * 
 * @param {string} logoUrl - Logo URL or path
 * @returns {{valid: boolean, reason?: string}}
 */
export function validatePdfAsset(logoUrl) {
  if (!logoUrl) {
    return {
      valid: false,
      reason: 'Logo URL is required for PDF generation',
    }
  }

  const logoUrl_str = String(logoUrl).trim()

  // Extract filename from various URL formats
  let filename = logoUrl_str

  // Handle query strings (Vite ?url)
  if (logoUrl_str.includes('?')) {
    filename = logoUrl_str.split('?')[0]
  }

  // Handle paths
  filename = filename.split('/').pop()

  // Check whitelist
  if (!isWhitelistedAsset(filename)) {
    return {
      valid: false,
      reason: getAssetRejectionReason(filename),
    }
  }

  return { valid: true }
}

/**
 * Get all approved asset filenames.
 * 
 * @returns {string[]}
 */
export function getApprovedAssets() {
  return Array.from(APPROVED_ASSETS).sort()
}

/**
 * Check for specific Money Maker assets (for migrations).
 * 
 * @param {string} filename
 * @returns {boolean}
 */
export function isLegacyMoneyMakerAsset(filename) {
  const legacyPatterns = [
    /income.*graph/i,
    /monthly.*progress/i,
    /niche.*graph/i,
    /cockpit/i,
    /profit.*engine/i,
    /money.*maker/i,
  ]
  return legacyPatterns.some((pattern) => pattern.test(filename))
}
