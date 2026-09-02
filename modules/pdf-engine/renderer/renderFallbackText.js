/**
 * Text-only PDF fallback when HTML rendering fails.
 * Uses layoutConfig for spacing. Does not mutate schema.
 */

import layoutConfig from '../layoutConfig.js';

const PT_PER_IN = 72;

/**
 * @param {string} value
 * @returns {number}
 */
function inchesToPoints(value) {
  const raw = String(value || '').trim().toLowerCase();
  if (raw.endsWith('in')) return Number.parseFloat(raw) * PT_PER_IN;
  if (raw.endsWith('pt')) return Number.parseFloat(raw);
  const numeric = Number.parseFloat(raw);
  return Number.isFinite(numeric) ? numeric : 0;
}

/**
 * Render a minimal text-only PDF from structured schema.
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
 * @returns {Promise<object>} jsPDF instance (unsaved)
 */
export async function renderFallbackText(schema = {}) {
  const { default: jsPDF } = await import('jspdf');

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
  });

  const margins = layoutConfig?.page?.margins || {};
  const left = inchesToPoints(margins.left || '1in');
  const right = inchesToPoints(margins.right || '1in');
  const top = inchesToPoints(margins.top || '0.75in');
  const bottom = inchesToPoints(margins.bottom || '0.75in');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const usableWidth = pageWidth - left - right;
  const sizes = layoutConfig?.typography?.sizes || { h1: 24, h2: 18, h3: 12, body: 9 };
  const lineHeight = layoutConfig?.typography?.lineHeight || 1.2;
  const paragraphSpacing = layoutConfig?.typography?.paragraphSpacing || 8;
  const sectionSpacing = layoutConfig?.typography?.sectionSpacing || 12;

  let y = top;

  const ensureSpace = (needed) => {
    const limit = pageHeight - bottom - 18;
    if (y + needed <= limit) return;
    doc.addPage();
    y = top;
  };

  const writeLines = (text, fontSize, bold = false) => {
    const content = String(text || '').trim();
    if (!content) return;
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(fontSize);
    doc.setTextColor(30, 30, 30);
    const lines = doc.splitTextToSize(content, usableWidth * 0.95);
    const blockHeight = lines.length * fontSize * lineHeight;
    ensureSpace(blockHeight + paragraphSpacing);
    doc.text(lines, left, y);
    y += blockHeight + paragraphSpacing;
  };

  writeLines(schema.title || 'Profit Engine Plan', sizes.h1 || 24, true);
  if (schema.subtitle) {
    writeLines(schema.subtitle, sizes.h3 || 12, false);
  }
  y += sectionSpacing;

  for (const section of schema.sections || []) {
    if (!section?.heading && !section?.body) continue;
    ensureSpace((sizes.h2 || 18) * lineHeight + paragraphSpacing);
    writeLines(section.heading || 'Section', sizes.h2 || 18, true);
    writeLines(section.body || '', sizes.body || 9, false);
    y += sectionSpacing * 0.5;
  }

  if (schema.cta) {
    doc.addPage();
    y = top;
    writeLines('Call to Action', sizes.h2 || 18, true);
    writeLines(schema.cta, sizes.body || 9, false);
  }

  if (Array.isArray(schema.faq) && schema.faq.length) {
    doc.addPage();
    y = top;
    writeLines('FAQ', sizes.h2 || 18, true);
    for (const item of schema.faq) {
      writeLines(item?.question || '', sizes.h3 || 12, true);
      writeLines(item?.answer || '', sizes.body || 9, false);
    }
  }

  // REMOVED: SEO Metadata rendering
  // Metadata is stored in <head> tags only, not rendered in document body
  return doc;
}

export default renderFallbackText;
