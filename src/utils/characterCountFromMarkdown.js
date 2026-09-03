/**
 * Character Counter Utility
 * 
 * Converts markdown to plain text and counts characters accurately.
 * Ignores markdown syntax characters (#, *, -, etc.)
 * Counts only actual content.
 */

/**
 * Strip markdown syntax and count plain text characters
 * @param {string} markdown - Markdown content
 * @returns {number} Character count of plain text
 */
export function characterCountFromMarkdown(markdown) {
  if (!markdown || typeof markdown !== 'string') {
    return 0
  }

  // Create a temporary div to parse HTML (since markdown was converted from HTML)
  const temp = document.createElement('div')
  
  // If it looks like HTML, use it directly. Otherwise, treat as plain text.
  const isHtml = /^\s*</.test(markdown)
  if (isHtml) {
    temp.innerHTML = markdown
  } else {
    temp.textContent = markdown
  }

  // Get plain text content
  const plainText = temp.textContent || temp.innerText || ''

  // Count characters, removing excessive whitespace
  // This gives us a more accurate character count for display purposes
  const trimmed = plainText
    .trim()
    .replace(/\s+/g, ' ') // Normalize whitespace

  return trimmed.length
}

/**
 * Get phase character limit
 * @param {number} phaseId - Phase ID (0-indexed)
 * @returns {number} Character limit for this phase
 */
export function getPhaseCharacterLimit(phaseId) {
  // Phase 12 (ID 11) has 10,000 characters, others have 5,000
  return phaseId === 11 ? 10000 : 5000
}

/**
 * Check if markdown exceeds phase limit
 * @param {string} markdown - Markdown content
 * @param {number} phaseId - Phase ID (0-indexed)
 * @returns {boolean} True if exceeds limit
 */
export function exceedsPhaseLimit(markdown, phaseId) {
  const count = characterCountFromMarkdown(markdown)
  const limit = getPhaseCharacterLimit(phaseId)
  return count > limit
}

/**
 * Get percentage of character limit used
 * @param {string} markdown - Markdown content
 * @param {number} phaseId - Phase ID (0-indexed)
 * @returns {number} Percentage (0-100+)
 */
export function getCharacterLimitPercentage(markdown, phaseId) {
  const count = characterCountFromMarkdown(markdown)
  const limit = getPhaseCharacterLimit(phaseId)
  return Math.round((count / limit) * 100)
}

export default {
  characterCountFromMarkdown,
  getPhaseCharacterLimit,
  exceedsPhaseLimit,
  getCharacterLimitPercentage,
}
