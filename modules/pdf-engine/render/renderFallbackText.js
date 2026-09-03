/**
 * Text-only PDF fallback when HTML rendering fails.
 * Pure renderer — consumes schema only (title, sections, toc, metadata).
 * No niche / focus / sanitize / structure logic.
 */

/** Structure-layer margins in points (40px top/bottom ≈ 30pt, 50px sides ≈ 37.5pt). */
const MARGIN_TOP = 30;
const MARGIN_BOTTOM = 30;
const MARGIN_LEFT = 38;
const MARGIN_RIGHT = 38;

/**
 * @param {object} schema from applyStructure()
 * @returns {Promise<object>} jsPDF instance (unsaved)
 */
export async function renderFallbackText(schema = {}) {
  const { default: jsPDF } = await import('jspdf');

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
  });

  const left = MARGIN_LEFT;
  const right = MARGIN_RIGHT;
  const top = MARGIN_TOP;
  const bottom = MARGIN_BOTTOM;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const usableWidth = pageWidth - left - right;

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
    const blockHeight = lines.length * fontSize * 1.6;
    ensureSpace(blockHeight + 12);
    doc.text(lines, left, y);
    y += blockHeight + 12;
  };

  // Cover
  writeLines(schema.title || 'Profit Engine Plan', 28, true);
  if (schema.subtitle) writeLines(schema.subtitle, 16, false);
  doc.addPage();
  y = top;

  // TOC (H2 only)
  const toc = Array.isArray(schema.toc) ? schema.toc : [];
  if (toc.length) {
    writeLines('Table of Contents', 22, true);
    for (const entry of toc) {
      writeLines(entry?.title || '', 14, false);
    }
    doc.addPage();
    y = top;
  }

  // Sections
  for (const section of schema.sections || []) {
    if (!section?.heading && !section?.body) continue;
    ensureSpace(40);
    if (y > top + 8) {
      doc.addPage();
      y = top;
    }
    writeLines(section.heading || 'Section', 22, true);
    writeLines(section.body || '', 14, false);
  }

  // REMOVED: SEO Metadata rendering
  // Metadata is stored in <head> tags only, not rendered in document body
  return doc;
}

export default renderFallbackText;
