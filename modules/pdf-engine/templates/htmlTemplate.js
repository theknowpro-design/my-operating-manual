/**
 * Full HTML document assembly from structured PDF content schema.
 * Pure HTML concatenation — no jsPDF / CSS injection / rendering.
 */

import brandingConfig, { PDF_LOGO_PUBLIC_URL } from '../brandingConfig.js';
import { buildTitlePage } from './titlePage.js';
import { buildSections } from './sectionsTemplate.js';
import { buildCta } from './ctaTemplate.js';
import { buildFaq } from './faqTemplate.js';

/** Brand logo — Vite-resolved import, with public assets URL fallback. */
const PDF_LOGO_SRC = brandingConfig.logo || PDF_LOGO_PUBLIC_URL;

/**
 * @param {{
 *   title?: string,
 *   subtitle?: string,
 *   sections?: Array<{ heading?: string, body?: string }>,
 *   cta?: string,
 *   faq?: Array<{ question?: string, answer?: string }>,
 *   metadata?: {
 *     title?: string,
 *     description?: string,
 *     keywords?: string[],
 *     imageAlt?: string
 *   }
 * }} schema
 * @returns {string}
 */
export function buildHtmlDocument(schema = {}) {
  const titlePage = buildTitlePage(schema);
  const sections = buildSections(schema.sections || []);
  const cta = buildCta(schema.cta || '');
  const faq = buildFaq(schema.faq || []);
  // REMOVED: metadata is not rendered in Operating Manual body
  // Metadata (keywords, description, etc.) is stored in <head> tags only

  const content = [
    titlePage,
    sections,
    cta,
    faq,
  ].join('');

  return [
    '<div class="pdf-container">',
    '<header class="pdf-header">',
    `<img src="${PDF_LOGO_SRC}" alt="Read Me" class="pdf-logo pdf-logo--top-center" />`,
    '</header>',
    content,
    '</div>',
  ].join('');
}

export default buildHtmlDocument;
