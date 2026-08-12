/**
 * Global metadata injection for structured PDF HTML.
 * Accepts Focus-aware description / keywords / imageAlt from callers —
 * does not compute Focus itself.
 * Pure — niche-agnostic.
 */

import { escapeHtml } from './enforceHeadings.js';

/**
 * @typedef {{
 *   title?: string,
 *   description?: string,
 *   keywords?: string[] | string,
 *   imageAlt?: string,
 * }} StructureMetadata
 */

/**
 * Normalize keywords to a string array.
 * @param {string[]|string|undefined} keywords
 * @returns {string[]}
 */
function normalizeKeywords(keywords) {
  if (Array.isArray(keywords)) {
    return keywords.map((k) => String(k || '').trim()).filter(Boolean);
  }
  if (typeof keywords === 'string' && keywords.trim()) {
    return keywords.split(/[,;]/).map((k) => k.trim()).filter(Boolean);
  }
  return [];
}

/**
 * Build <head> meta tags from metadata fields.
 * @param {StructureMetadata} metadata
 * @returns {string}
 */
export function buildHeadMetadata(metadata = {}) {
  const title = String(metadata.title || 'My Operating Manual').trim();
  const description = String(metadata.description || '').trim();
  const keywords = normalizeKeywords(metadata.keywords);
  const imageAlt = String(metadata.imageAlt || '').trim();

  const tags = [
    `<meta charset="UTF-8" />`,
    `<title>${escapeHtml(title)}</title>`,
  ];

  if (description) {
    tags.push(`<meta name="description" content="${escapeHtml(description)}" />`);
  }
  if (keywords.length) {
    tags.push(`<meta name="keywords" content="${escapeHtml(keywords.join(', '))}" />`);
  }
  if (imageAlt) {
    tags.push(`<meta name="image-alt" content="${escapeHtml(imageAlt)}" />`);
  }

  return tags.join('\n');
}

/**
 * Optional visible metadata appendix (after body sections).
 * @param {StructureMetadata} metadata
 * @returns {string}
 */
export function buildMetadataBlock(metadata = {}) {
  const title = String(metadata.title || '').trim();
  const description = String(metadata.description || '').trim();
  const keywords = normalizeKeywords(metadata.keywords);
  const imageAlt = String(metadata.imageAlt || '').trim();

  if (!title && !description && !keywords.length && !imageAlt) return '';

  const parts = [
    '<section class="pdf-metadata" id="pdf-metadata">',
    '<h2 id="section-seo-metadata">SEO Metadata</h2>',
  ];

  if (title) parts.push(`<p><strong>Title:</strong> ${escapeHtml(title)}</p>`);
  if (description) parts.push(`<p><strong>Description:</strong> ${escapeHtml(description)}</p>`);
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

  parts.push('</section>');
  return parts.join('\n');
}

/**
 * Merge caller metadata over extracted defaults (caller / Focus-aware wins).
 * @param {StructureMetadata} base
 * @param {StructureMetadata} overlay
 * @returns {StructureMetadata}
 */
export function mergeMetadata(base = {}, overlay = {}) {
  const keywords = normalizeKeywords(overlay.keywords);
  const baseKeywords = normalizeKeywords(base.keywords);
  return {
    title: String(overlay.title || base.title || '').trim(),
    description: String(overlay.description || base.description || '').trim(),
    keywords: keywords.length ? keywords : baseKeywords,
    imageAlt: String(overlay.imageAlt || base.imageAlt || '').trim(),
  };
}

export default {
  buildHeadMetadata,
  buildMetadataBlock,
  mergeMetadata,
};
