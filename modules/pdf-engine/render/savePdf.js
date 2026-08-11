/**
 * Save a jsPDF instance to browser download.
 * Pure render helper — no niche / focus / sanitize / structure logic.
 */

/**
 * @param {object} doc jsPDF instance
 * @param {string} [filename]
 * @returns {void}
 */
export function savePdf(doc, filename = 'profit-engine.pdf') {
  if (!doc || typeof doc.save !== 'function') {
    throw new Error('savePdf requires a jsPDF instance');
  }
  doc.save(String(filename || 'profit-engine.pdf'));
}

export default savePdf;
