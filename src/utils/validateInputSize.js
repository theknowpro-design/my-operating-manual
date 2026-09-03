/**
 * Input Size Guard Utility
 * 
 * Prevents Denial of Service attacks by enforcing hard limits on input size.
 * Protects against browser memory spikes and pipeline freezes from massive inputs.
 */

/**
 * Maximum raw markdown size: 5MB
 * @type {number}
 */
export const MAX_MARKDOWN_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

/**
 * Maximum character count: 250,000
 * @type {number}
 */
export const MAX_MARKDOWN_CHARS = 250000

/**
 * Guard input size before processing
 * 
 * @param {string} markdown - Raw markdown input
 * @returns {object} { isValid: boolean, error?: string }
 */
export function validateInputSize(markdown) {
  if (!markdown || typeof markdown !== 'string') {
    return { isValid: true }
  }

  // Check character count
  const charCount = markdown.length
  if (charCount > MAX_MARKDOWN_CHARS) {
    return {
      isValid: false,
      error: `Input exceeds maximum length of ${MAX_MARKDOWN_CHARS.toLocaleString()} characters (received ${charCount.toLocaleString()})`,
    }
  }

  // Check byte size (UTF-8)
  const bytes = new TextEncoder().encode(markdown).length
  if (bytes > MAX_MARKDOWN_SIZE_BYTES) {
    const maxMB = (MAX_MARKDOWN_SIZE_BYTES / (1024 * 1024)).toFixed(1)
    const receivedMB = (bytes / (1024 * 1024)).toFixed(1)
    return {
      isValid: false,
      error: `Input size exceeds maximum of ${maxMB}MB (received ${receivedMB}MB)`,
    }
  }

  return { isValid: true }
}

export default validateInputSize
