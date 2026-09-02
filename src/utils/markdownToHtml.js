/**
 * Markdown to HTML Conversion Utility
 * 
 * Converts stored markdown to HTML for TipTap editor initialization.
 * Uses marked parser for consistency with ManualRenderer.
 */

import { marked } from 'marked'

/**
 * Convert Markdown to HTML (for TipTap editor initialization)
 * @param {string} markdown - Markdown string
 * @returns {string} HTML string
 */
export function markdownToHtml(markdown) {
  if (!markdown || typeof markdown !== 'string') {
    return ''
  }

  try {
    return marked.parse(markdown, { gfm: true, breaks: true })
  } catch (err) {
    console.error('[markdownToHtml] Conversion failed:', err)
    return markdown
  }
}

export default markdownToHtml
