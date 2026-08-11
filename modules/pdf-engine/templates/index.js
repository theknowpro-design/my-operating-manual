/**
 * PDF template layer entry — HTML assembly + CSS injection string.
 * Pure string builders — no jsPDF / html2canvas / rendering.
 */

import { buildHtmlDocument } from './htmlTemplate.js';
import { getCss } from './cssTemplate.js';

/**
 * Build the full PDF HTML string from prepareStructuredContent() schema.
 * @param {object} schema
 * @returns {string}
 */
export function buildHtmlDocumentFromSchema(schema) {
  return buildHtmlDocument(schema);
}

/**
 * Build the final CSS <style> block for PDF HTML injection.
 * @returns {string}
 */
export function buildCss() {
  return getCss();
}

export { buildHtmlDocument } from './htmlTemplate.js';
export { getPageBreak } from './pageBreaks.js';
export { buildTitlePage } from './titlePage.js';
export { buildSections } from './sectionsTemplate.js';
export { buildCta } from './ctaTemplate.js';
export { buildFaq } from './faqTemplate.js';
export { buildMetadata } from './metadataTemplate.js';
export { getCss } from './cssTemplate.js';
export {
  layout,
  pageWidth,
  pagePadding,
  headingSpacing,
  paragraphSpacing,
  lineHeight,
  fontSizes,
} from './layout.css.js';
export {
  branding,
  accentColor,
  titleColor,
  headerColor,
  footerColor,
} from './branding.css.js';

export default buildHtmlDocument;
