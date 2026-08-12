/**
 * HTML Sanitization Utility
 * 
 * Prevents XSS attacks by sanitizing all HTML rendered via dangerouslySetInnerHTML.
 * Uses DOMPurify with a strict whitelist of safe tags and attributes.
 */

import DOMPurify from 'dompurify'

/**
 * Sanitization configuration: strict whitelist of safe tags
 * @type {object}
 */
const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 'code', 'pre',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'table', 'thead', 'tbody', 'tr', 'td', 'th',
    'blockquote', 'hr',
    'a', // Links allowed but href validated
  ],
  ALLOWED_ATTR: [
    'href', 'target', 'rel', // For links
    'id', 'class', // For styling/anchoring
    'colspan', 'rowspan', // For tables
  ],
  // Block all event handlers
  KEEP_CONTENT: true,
}

/**
 * Sanitize HTML to prevent XSS attacks.
 * 
 * @param {string} html - Raw HTML string
 * @returns {string} Sanitized HTML safe for dangerouslySetInnerHTML
 */
export function sanitizeHtml(html) {
  if (!html || typeof html !== 'string') {
    return ''
  }

  return DOMPurify.sanitize(html, SANITIZE_CONFIG)
}

export default sanitizeHtml
