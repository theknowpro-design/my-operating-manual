/**
 * Extract a single Call-to-Action string from sanitized HTML.
 * Pure — no DOM or PDF rendering.
 */

import { extractSections, stripTags } from './extractSections.js';

const CTA_HEADING_RE = /^(call\s*to\s*action|cta|next\s*step|get\s*started|take\s*action)\b/i;

/**
 * @param {string} html
 * @returns {string}
 */
export function extractCTA(html) {
  const sections = extractSections(html);
  const ctaSection = sections.find((section) => CTA_HEADING_RE.test(section.heading));
  if (ctaSection) {
    return normalizeCtaText(ctaSection.body || stripTags(ctaSection.bodyHtml));
  }

  const source = String(html || '');
  const marker = /<(h[1-3])\b[^>]*>\s*(?:call\s*to\s*action|cta|next\s*step)[^<]*<\/\1\s*>([\s\S]*?)(?=<(?:h[1-3])\b|$)/i;
  const match = source.match(marker);
  if (match?.[2]) {
    return normalizeCtaText(stripTags(match[2]));
  }

  return '';
}

/**
 * @param {string} text
 * @returns {string}
 */
function normalizeCtaText(text) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .trim();
}

export default extractCTA;
