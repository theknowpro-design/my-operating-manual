/**
 * Call-to-Action HTML for the PDF template layer.
 * Pure HTML assembly — no jsPDF / rendering.
 */

import { paragraphsToHtml } from './htmlUtils.js';
import { getPageBreak } from './pageBreaks.js';

/**
 * @param {string} cta
 * @returns {string}
 */
export function buildCta(cta = '') {
  const text = String(cta || '').trim();
  if (!text) return '';

  return [
    '<div class="cta">',
    '<h2>Call to Action</h2>',
    paragraphsToHtml(text),
    '</div>',
    getPageBreak(),
  ].join('');
}

export default buildCta;
