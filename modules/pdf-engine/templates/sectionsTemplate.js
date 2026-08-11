/**
 * Body sections HTML for the PDF template layer.
 * Pure HTML assembly — no jsPDF / rendering.
 */

import { escapeHtml, paragraphsToHtml } from './htmlUtils.js';
import { getPageBreak } from './pageBreaks.js';

/**
 * @param {Array<{ heading?: string, body?: string }>} sections
 * @returns {string}
 */
export function buildSections(sections = []) {
  const list = Array.isArray(sections) ? sections : [];
  const parts = [];

  list.forEach((section, index) => {
    const heading = String(section?.heading || '').trim();
    const body = String(section?.body || '').trim();
    if (!heading && !body) return;

    parts.push('<div class="section">');
    if (heading) parts.push(`<h2>${escapeHtml(heading)}</h2>`);
    if (body) parts.push(paragraphsToHtml(body));
    parts.push('</div>');

    if (index < list.length - 1) {
      parts.push(getPageBreak());
    }
  });

  if (parts.length) {
    parts.push(getPageBreak());
  }

  return parts.join('');
}

export default buildSections;
