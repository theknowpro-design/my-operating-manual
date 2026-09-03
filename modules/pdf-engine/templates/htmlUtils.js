/**
 * Escape text for safe HTML template insertion.
 * Pure — no DOM.
 * @param {unknown} value
 * @returns {string}
 */
export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Wrap plain text paragraphs (split on blank lines) as <p> tags.
 * @param {string} text
 * @returns {string}
 */
export function paragraphsToHtml(text) {
  const blocks = String(text || '')
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (!blocks.length) {
    const single = String(text || '').trim();
    return single ? `<p>${escapeHtml(single)}</p>` : '';
  }

  return blocks
    .map((block) => `<p>${escapeHtml(block).replace(/\n/g, '<br />')}</p>`)
    .join('');
}
