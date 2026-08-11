/**
 * Title page HTML for the PDF template layer.
 * Pure HTML assembly — no jsPDF / rendering.
 */

import { formatGeneratedLabel } from '../../../src/utils/formatTimestamp.js';
import { escapeHtml } from './htmlUtils.js';
import { getPageBreak } from './pageBreaks.js';

/**
 * @param {{ title?: string, subtitle?: string, generatedAt?: Date|string|number }} schema
 * @returns {string}
 */
export function buildTitlePage(schema = {}) {
  const title = escapeHtml(schema.title || 'My Operating Manual');
  const subtitle = String(schema.subtitle || '').trim();
  const generatedLabel = formatGeneratedLabel(schema.generatedAt ?? new Date());

  const subtitleHtml = subtitle
    ? `<p class="subtitle">${escapeHtml(subtitle)}</p>`
    : '';

  return [
    '<div class="title-page">',
    `<h1>${title}</h1>`,
    subtitleHtml,
    `<p class="generated">${escapeHtml(generatedLabel)}</p>`,
    '</div>',
    getPageBreak(),
  ].filter(Boolean).join('');
}

export default buildTitlePage;
