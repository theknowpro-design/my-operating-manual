/**
 * SEO metadata HTML for the PDF template layer.
 * Pure HTML assembly — no jsPDF / rendering. No trailing page-break.
 */

import { escapeHtml } from './htmlUtils.js';

/**
 * @param {{
 *   title?: string,
 *   description?: string,
 *   keywords?: string[],
 *   imageAlt?: string
 * }} metadata
 * @returns {string}
 */
export function buildMetadata(metadata = {}) {
  const title = String(metadata?.title || '').trim();
  const description = String(metadata?.description || '').trim();
  const keywords = Array.isArray(metadata?.keywords)
    ? metadata.keywords.map((item) => String(item || '').trim()).filter(Boolean)
    : [];
  const imageAlt = String(metadata?.imageAlt || '').trim();

  if (!title && !description && !keywords.length && !imageAlt) {
    return '';
  }

  const parts = [
    '<div class="metadata">',
    '<h2>SEO Metadata</h2>',
  ];

  if (title) {
    parts.push(`<p><strong>Title:</strong> ${escapeHtml(title)}</p>`);
  }
  if (description) {
    parts.push(`<p><strong>Description:</strong> ${escapeHtml(description)}</p>`);
  }
  if (keywords.length) {
    parts.push('<p><strong>Keywords:</strong></p>');
    parts.push('<ul>');
    for (const keyword of keywords) {
      parts.push(`<li>${escapeHtml(keyword)}</li>`);
    }
    parts.push('</ul>');
  }
  if (imageAlt) {
    parts.push(`<p><strong>Image alt text:</strong> ${escapeHtml(imageAlt)}</p>`);
  }

  parts.push('</div>');
  return parts.join('');
}

export default buildMetadata;
