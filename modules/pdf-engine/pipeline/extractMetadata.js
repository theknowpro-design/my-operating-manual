/**
 * Extract SEO metadata fields from sanitized HTML.
 * Pure — no DOM or PDF rendering.
 */

import { extractSections, stripTags } from './extractSections.js';

const META_HEADING_RE = /^(metadata|seo|seo\s*metadata|digital\s*visibility(?:\s*strategy)?)\b/i;

/**
 * @param {string} html
 * @returns {{ title: string, description: string, keywords: string[], imageAlt: string }}
 */
export function extractMetadata(html) {
  const empty = {
    title: '',
    description: '',
    keywords: [],
    imageAlt: '',
  };

  const sections = extractSections(html);
  const metaSection = sections.find((section) => META_HEADING_RE.test(section.heading));
  const source = metaSection?.bodyHtml || String(html || '');
  const text = stripTags(source.replace(/<\/(?:p|div|li|h[1-3])\s*>/gi, '\n'));

  const title = matchField(text, [
    /^title\s*[:\-–—]\s*(.+)$/im,
    /^seo\s*title\s*[:\-–—]\s*(.+)$/im,
    /^meta\s*title\s*[:\-–—]\s*(.+)$/im,
  ]);
  const description = matchField(text, [
    /^description\s*[:\-–—]\s*(.+)$/im,
    /^seo\s*description\s*[:\-–—]\s*(.+)$/im,
    /^meta\s*description\s*[:\-–—]\s*(.+)$/im,
  ]);
  const keywordsRaw = matchField(text, [
    /^keywords?\s*[:\-–—]\s*(.+)$/im,
    /^seo\s*keywords?\s*[:\-–—]\s*(.+)$/im,
  ]);
  const imageAlt = matchField(text, [
    /^image\s*alt(?:\s*text)?\s*[:\-–—]\s*(.+)$/im,
    /^alt\s*text\s*[:\-–—]\s*(.+)$/im,
    /^og\s*image\s*alt\s*[:\-–—]\s*(.+)$/im,
  ]);

  return {
    title: normalizeSpace(title),
    description: normalizeSpace(description),
    keywords: parseKeywords(keywordsRaw),
    imageAlt: normalizeSpace(imageAlt),
  };
}

/**
 * @param {string} text
 * @param {RegExp[]} patterns
 * @returns {string}
 */
function matchField(text, patterns) {
  for (const pattern of patterns) {
    const match = String(text || '').match(pattern);
    if (match?.[1]) return match[1];
  }
  return '';
}

/**
 * @param {string} raw
 * @returns {string[]}
 */
function parseKeywords(raw) {
  if (!raw) return [];
  const parts = String(raw)
    .split(/[,;|]/)
    .map((part) => normalizeSpace(part))
    .filter(Boolean);
  const seen = new Set();
  const out = [];
  for (const part of parts) {
    const key = part.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(part);
  }
  return out;
}

/**
 * @param {string} text
 * @returns {string}
 */
function normalizeSpace(text) {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

export default extractMetadata;
