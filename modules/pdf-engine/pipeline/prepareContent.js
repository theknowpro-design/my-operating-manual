/**
 * Assemble sanitized HTML into a structured PDF content schema.
 * Pure — no templating, jsPDF, or rendering.
 */

import { extractSections, stripTags, dedupeSections } from './extractSections.js';
import { extractCTA } from './extractCTA.js';
import { extractFAQ } from './extractFAQ.js';
import { extractMetadata } from './extractMetadata.js';

const CTA_HEADING_RE = /^(call\s*to\s*action|cta|next\s*step|get\s*started|take\s*action)\b/i;
const FAQ_HEADING_RE = /^(faqs?|frequently\s+asked\s+questions?)\b/i;
const META_HEADING_RE = /^(metadata|seo|seo\s*metadata|digital\s*visibility(?:\s*strategy)?)\b/i;

/**
 * @typedef {{ question: string, answer: string }} FaqItem
 * @typedef {{ title: string, description: string, keywords: string[], imageAlt: string }} Metadata
 * @typedef {{
 *   title: string,
 *   subtitle: string,
 *   sections: Array<{ heading: string, body: string }>,
 *   cta: string,
 *   faq: FaqItem[],
 *   metadata: Metadata,
 * }} StructuredContent
 */

/**
 * Build the structured PDF content schema from sanitized HTML.
 * Ordering: Title → Sections → CTA → FAQ → Metadata.
 * @param {string} rawHtml sanitized HTML string
 * @returns {StructuredContent}
 */
export function prepareContent(rawHtml) {
  const html = String(rawHtml || '');
  const parsed = extractSections(html);

  const titleSection = parsed.find((section) => section.level === 1) || null;
  const title = titleSection?.heading || firstLooseTitle(html) || '';

  const subtitle = titleSection
    ? firstParagraph(titleSection.bodyHtml)
    : '';

  const cta = extractCTA(html);
  const faq = extractFAQ(html);
  const metadata = extractMetadata(html);

  const bodySections = dedupeSections(
    parsed.filter((section) => {
      if (titleSection && section === titleSection) return false;
      if (CTA_HEADING_RE.test(section.heading)) return false;
      if (FAQ_HEADING_RE.test(section.heading)) return false;
      if (META_HEADING_RE.test(section.heading)) return false;
      // Drop the subtitle-only h1 body if it was promoted to subtitle.
      if (section.level === 1) return false;
      return Boolean(section.heading || section.body);
    })
  ).map((section) => ({
    heading: section.heading,
    body: section.body,
  }));

  return {
    title,
    subtitle,
    sections: bodySections,
    cta,
    faq,
    metadata,
  };
}

/**
 * @param {string} html
 * @returns {string}
 */
function firstLooseTitle(html) {
  const match = String(html || '').match(/<(h1)\b[^>]*>([\s\S]*?)<\/\1\s*>/i);
  return match ? stripTags(match[2]) : '';
}

/**
 * @param {string} bodyHtml
 * @returns {string}
 */
function firstParagraph(bodyHtml) {
  const match = String(bodyHtml || '').match(/<(p|div)\b[^>]*>([\s\S]*?)<\/\1\s*>/i);
  if (match) return stripTags(match[2]);
  const text = stripTags(bodyHtml);
  if (!text) return '';
  // Use only the first sentence-ish chunk as subtitle when no <p> exists.
  const cut = text.split(/(?<=\.)\s+/)[0] || text;
  return cut.length <= 180 ? cut : `${cut.slice(0, 177).trim()}...`;
}

/** Public alias used by generatePdf / pipeline index. */
export const prepareStructuredContent = prepareContent;

export default prepareContent;
