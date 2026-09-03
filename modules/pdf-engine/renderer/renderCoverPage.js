/**
 * Optional cover page renderer using jsPDF text APIs.
 * Does not mutate the schema object.
 */

import brandingConfig from '../brandingConfig.js';
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
 * @param {string} hex
 * @returns {[number, number, number]}
 */
function hexToRgb(hex) {
  const normalized = String(hex || '#2A4B7C').replace('#', '');
  const full = normalized.length === 3
    ? normalized.split('').map((ch) => ch + ch).join('')
    : normalized.padEnd(6, '0').slice(0, 6);
  const int = Number.parseInt(full, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

/**
 * Render a simple title cover onto the current page of a jsPDF instance.
 * @param {object} doc jsPDF instance
 * @param {{ title?: string, subtitle?: string }} schema
 * @returns {object} updated jsPDF instance
 */
export function renderCoverPage(doc, schema = {}) {
  if (!doc) return doc;

  const margins = layoutConfig?.page?.margins || {};
  const left = inchesToPoints(margins.left || '1in');
  const right = inchesToPoints(margins.right || '1in');
  const top = inchesToPoints(margins.top || '0.75in');
  const pageWidth = doc.internal.pageSize.getWidth();
  const usableWidth = pageWidth - left - right;
  const sizes = layoutConfig?.typography?.sizes || { h1: 24, h3: 12, body: 9 };
  const [r, g, b] = hexToRgb(brandingConfig.accentColor);

  const title = String(schema?.title || 'Profit Engine Plan');
  const subtitle = String(schema?.subtitle || '');

  let y = top + 48;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(sizes.h1 || 24);
  doc.setTextColor(r, g, b);
  const titleLines = doc.splitTextToSize(title, usableWidth);
  doc.text(titleLines, left + usableWidth / 2, y, { align: 'center' });
  y += titleLines.length * (sizes.h1 || 24) * 1.2 + 12;

  if (subtitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(sizes.h3 || 12);
    doc.setTextColor(90, 90, 90);
    const subtitleLines = doc.splitTextToSize(subtitle, usableWidth * 0.9);
    doc.text(subtitleLines, left + usableWidth / 2, y, { align: 'center' });
    y += subtitleLines.length * (sizes.h3 || 12) * 1.2 + 16;
  }

  doc.setDrawColor(r, g, b);
  doc.setLineWidth(1);
  doc.line(left + usableWidth * 0.2, y, left + usableWidth * 0.8, y);

  return doc;
}

export default renderCoverPage;
