/**
 * HTML to Markdown Conversion Utility
 * 
 * Converts TipTap HTML output back to markdown for storage.
 * Ensures markdown is compatible with ManualRenderer and PDF export.
 */

import TurndownService from 'turndown'

/**
 * Configure Turndown for our use case
 */
const turndownService = new TurndownService({
  headingStyle: 'atx',
  hr: '---',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
})

// Add custom rule for images (keep them as markdown)
turndownService.addRule('image', {
  filter: 'img',
  replacement: (content, node) => {
    const src = node.getAttribute('src') || ''
    const alt = node.getAttribute('alt') || ''
    return `![${alt}](${src})`
  },
})

/**
 * Convert HTML (from TipTap) to Markdown
 * @param {string} html - HTML from TipTap editor
 * @returns {string} Markdown string
 */
export function htmlToMarkdown(html) {
  if (!html || typeof html !== 'string') {
    return ''
  }

  try {
    return turndownService.turndown(html)
  } catch (err) {
    console.error('[htmlToMarkdown] Conversion failed:', err)
    return html
  }
}

export default htmlToMarkdown
