/**
 * @deprecated LEGACY — Phase P2 unified PDF core.
 * Use `generatePdf` from `./pipeline/index.js` instead.
 * This file is retained only for historical reference / emergency fallback.
 */

/**
 * Profit Engine AI PDF Engine
 * Load-time pure module: no jsPDF/html2canvas/DOM/asset work at import time.
 */

import layoutConfig from './layoutConfig.js';
import brandingConfig from './brandingConfig.js';
import { mapAllSections } from './contentMapper.js';

const PT_PER_IN = 72;

/**
 * Full-document HTML shell used by the PDF html() renderer.
 * Pure string template (no browser APIs).
 */
const pdfWrapper = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Profit Engine AI Export</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 40px;
      line-height: 1.6;
      color: #222;
    }
    h1, h2, h3 {
      margin-top: 32px;
    }
    hr {
      margin: 40px 0;
    }
  </style>
</head>
<body>
  {{CONTENT}}
</body>
</html>
`;

/**
 * Wait until the document is interactive/complete before loading browser PDF deps.
 * @returns {Promise<void>}
 */
async function whenDomReady() {
  if (typeof document === 'undefined') return;
  if (document.readyState === 'complete' || document.readyState === 'interactive') return;
  await new Promise((resolve) => {
    document.addEventListener('DOMContentLoaded', () => resolve(), { once: true });
  });
}

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
 * @param {string} value
 * @returns {string}
 */
function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Minimal plaintext → HTML conversion for export when only `.text` is available.
 * @param {string} text
 * @returns {string}
 */
function plainTextToHtml(text) {
  const blocks = String(text || '')
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
  if (!blocks.length) return '';
  return blocks
    .map((block) => `<p>${escapeHtml(block).replace(/\n/g, '<br />')}</p>`)
    .join('\n');
}

/**
 * Resolve formatted HTML body from a generation result.
 * @param {object} result
 * @returns {string}
 */
export function resolveFormattedHtml(result = {}) {
  const formatted = result.formatted || {};
  const textConvertedToHtml = formatted.textConvertedToHtml
    || (formatted.text ? plainTextToHtml(formatted.text) : '');

  return formatted.longFormBodyHtml
    || formatted.html
    || formatted.rawHtml
    || textConvertedToHtml
    || '';
}

/**
 * Wrap generation HTML in the built-in PDF HTML document shell.
 * @param {object} result
 * @returns {string}
 */
export function buildPdfHtmlDocument(result = {}) {
  const formattedHtml = resolveFormattedHtml(result);
  return pdfWrapper.replace('{{CONTENT}}', formattedHtml || '');
}

/**
 * Canonical browser URL for the PDF brand logo (Vite static asset dir).
 */
const PDF_LOGO_URL = brandingConfig.logo || '/modules/pdf-engine/assets/Teal%20Read%20Me%20Logo.png';

/**
 * Resolve logo URL for browser embedding.
 * Only call during PDF export (after hydration).
 * @param {string} [logoPath]
 * @returns {string}
 */
export function resolveLogoUrl(logoPath = brandingConfig.logo) {
  if (!logoPath) return PDF_LOGO_URL;
  if (typeof logoPath === 'string' && (logoPath.startsWith('/') || /^https?:\/\//i.test(logoPath) || logoPath.startsWith('data:'))) {
    return logoPath;
  }
  if (
    logoPath === brandingConfig.logo
    || logoPath === brandingConfig.logoFile
    || logoPath.endsWith('Teal Read Me Logo.png')
    || logoPath.includes('Teal%20Read%20Me%20Logo.png')
  ) {
    return PDF_LOGO_URL;
  }
  return PDF_LOGO_URL;
}

/**
 * Load an image as a data URL for jsPDF embedding.
 * @param {string} url
 * @returns {Promise<{ dataUrl: string, format: 'PNG'|'JPEG', width: number, height: number }|null>}
 */
async function loadImageAsset(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const blob = await response.blob();
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    const dimensions = await new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth || 1, height: img.naturalHeight || 1 });
      img.onerror = () => resolve({ width: 1, height: 1 });
      img.src = dataUrl;
    });

    const format = blob.type.includes('jpeg') || blob.type.includes('jpg') ? 'JPEG' : 'PNG';
    return { dataUrl, format, ...dimensions };
  } catch {
    return null;
  }
}

/**
 * @param {object} doc
 * @param {string} text
 * @param {number} maxWidth
 * @returns {string[]}
 */
function wrapText(doc, text, maxWidth) {
  return doc.splitTextToSize(String(text || ''), maxWidth);
}

/**
 * Create a configured jsPDF instance from layout config.
 * @param {typeof import('jspdf').default} JsPDFCtor
 * @param {object} [layout]
 * @returns {object}
 */
function createDocument(JsPDFCtor, layout = layoutConfig) {
  const size = layout?.page?.size === 'US Letter' ? 'letter' : 'letter';
  return new JsPDFCtor({
    orientation: 'portrait',
    unit: 'pt',
    format: size,
  });
}

/**
 * @param {object} doc
 * @param {object} layout
 * @param {object} branding
 * @param {number} pageNumber
 */
function drawFooter(doc, layout, branding, pageNumber) {
  const margins = layout.page.margins;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const bottom = inchesToPoints(margins.bottom);
  const left = inchesToPoints(margins.left);
  const right = inchesToPoints(margins.right);
  const [r, g, b] = hexToRgb(branding.accentColor);

  doc.setDrawColor(r, g, b);
  doc.setLineWidth(0.6);
  doc.line(left, pageHeight - bottom + 10, pageWidth - right, pageHeight - bottom + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(90, 90, 90);
  doc.text(branding.footerText || 'Generated by My Operating Manual', left, pageHeight - bottom + 24);

  doc.text(String(pageNumber), pageWidth - right, pageHeight - bottom + 24, { align: 'right' });

  return { left, usableWidth: pageWidth - left - right };
}

/**
 * Ensure enough vertical room; add a page when needed.
 * @returns {number} updated y
 */
function ensureSpace(doc, layout, branding, y, needed, state) {
  const pageHeight = doc.internal.pageSize.getHeight();
  const bottom = inchesToPoints(layout.page.margins.bottom);
  const limit = pageHeight - bottom - 18;
  if (y + needed <= limit) return y;

  drawFooter(doc, layout, branding, state.pageNumber);
  doc.addPage();
  state.pageNumber += 1;
  return inchesToPoints(layout.page.margins.top);
}

/**
 * Render a section heading + body with layout typography rules.
 */
function renderSection(doc, layout, branding, title, body, y, state) {
  const left = inchesToPoints(layout.page.margins.left);
  const right = inchesToPoints(layout.page.margins.right);
  const usableWidth = doc.internal.pageSize.getWidth() - left - right;
  const [r, g, b] = hexToRgb(branding.accentColor);
  const sizes = layout.typography.sizes;
  const lineHeight = layout.typography.lineHeight;
  const paragraphSpacing = layout.typography.paragraphSpacing;
  const sectionSpacing = layout.typography.sectionSpacing;

  y = ensureSpace(doc, layout, branding, y, sizes.h2 * lineHeight + paragraphSpacing, state);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(sizes.h2);
  doc.setTextColor(r, g, b);
  doc.text(title, left, y);
  y += sizes.h2 * lineHeight;

  doc.setDrawColor(r, g, b);
  doc.setLineWidth(1);
  doc.line(left, y - 4, left + Math.min(120, usableWidth * 0.35), y - 4);
  y += paragraphSpacing * 0.5;

  // Collapse whitespace so sparse generation text does not inflate page count.
  const blocks = String(body || '')
    .replace(/\r\n/g, '\n')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .split(/\n\s*\n/)
    .map((block) => block.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(sizes.body);
  doc.setTextColor(30, 30, 30);

  for (const block of blocks) {
    const lines = wrapText(doc, block, usableWidth * 0.95);
    const blockHeight = lines.length * sizes.body * lineHeight;
    y = ensureSpace(doc, layout, branding, y, blockHeight + paragraphSpacing, state);
    doc.text(lines, left, y);
    y += blockHeight + paragraphSpacing;
  }

  return y + sectionSpacing * 0.35;
}

/**
 * Render cover page with optional transparent logo.
 */
async function renderCoverPage(doc, layout, branding, content, logoAsset) {
  try {
    const left = inchesToPoints(layout.page.margins.left);
    const right = inchesToPoints(layout.page.margins.right);
    const top = inchesToPoints(layout.page.margins.top);
    const usableWidth = doc.internal.pageSize.getWidth() - left - right;
    const [r, g, b] = hexToRgb(branding.accentColor);
    const sizes = layout.typography.sizes;
    let y = top;

    const safeTitle = content?.title || 'My Operating Manual';
    const safeSubtitle = content?.subtitle || '';

    if (branding.includeLogoOnCover && logoAsset?.dataUrl) {
      try {
        const configuredWidth = Number(branding.logoWidth || branding.coverLogoWidth) || 120;
        const logoWidth = Math.min(configuredWidth, usableWidth * 0.55);
        const logoHeight = (logoAsset.height / Math.max(logoAsset.width, 1)) * logoWidth;
        const logoX = left + (usableWidth - logoWidth) / 2;
        doc.addImage(logoAsset.dataUrl, logoAsset.format, logoX, y, logoWidth, logoHeight);
        y += logoHeight + layout.typography.sectionSpacing;
      } catch (logoError) {
        console.error('Cover logo render failed:', logoError);
      }
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(sizes.h1);
    doc.setTextColor(r, g, b);
    const titleLines = wrapText(doc, safeTitle, usableWidth);
    doc.text(titleLines, left + usableWidth / 2, y, { align: 'center' });
    y += titleLines.length * sizes.h1 * layout.typography.lineHeight + 8;

    if (safeSubtitle) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(sizes.h3);
      doc.setTextColor(70, 70, 70);
      const subtitleLines = wrapText(doc, safeSubtitle, usableWidth);
      doc.text(subtitleLines, left + usableWidth / 2, y, { align: 'center' });
      y += subtitleLines.length * sizes.h3 * layout.typography.lineHeight + 10;
    }

    if (content?.focus) {
      doc.setFontSize(sizes.body);
      doc.setTextColor(90, 90, 90);
      const focusLines = wrapText(doc, `Focus: ${content.focus}`, usableWidth);
      doc.text(focusLines, left + usableWidth / 2, y, { align: 'center' });
      y += focusLines.length * sizes.body * layout.typography.lineHeight;
    }

    y += layout.typography.sectionSpacing;
    doc.setDrawColor(r, g, b);
    doc.setLineWidth(1.25);
    doc.line(left + usableWidth * 0.2, y, left + usableWidth * 0.8, y);

    y += layout.typography.sectionSpacing;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(sizes.body);
    doc.setTextColor(50, 50, 50);
    const intro = wrapText(
      doc,
      'A structured profit plan generated by Profit Engine AI — practical offers, revenue paths, and next steps without hype.',
      usableWidth * 0.9
    );
    doc.text(intro, left + usableWidth / 2, y, { align: 'center' });
  } catch (error) {
    console.error('Cover page render failed:', error);
  }
}

/**
 * Render a full HTML document string directly into a jsPDF instance.
 * @param {object} doc
 * @param {string} html
 * @param {object} layout
 * @param {Function} html2canvas
 * @returns {Promise<object>}
 */
async function renderHtmlDocument(doc, html, layout, html2canvas) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const left = inchesToPoints(layout?.page?.margins?.left || '1in');
  const right = inchesToPoints(layout?.page?.margins?.right || '1in');
  const top = inchesToPoints(layout?.page?.margins?.top || '0.75in');
  const usableWidth = Math.max(120, pageWidth - left - right);

  await doc.html(html, {
    x: left,
    y: top,
    width: usableWidth,
    windowWidth: 800,
    autoPaging: 'text',
    html2canvas: typeof html2canvas === 'function'
      ? html2canvas
      : {
          scale: 0.75,
          useCORS: true,
          logging: false,
        },
  });

  return doc;
}

/**
 * Legacy canvas-free path: cover + mapped sections via jsPDF text APIs.
 * @param {object} input
 * @param {typeof import('jspdf').default} JsPDFCtor
 */
async function generatePdfDocumentFromSections(input = {}, JsPDFCtor) {
  const layout = input.layout || layoutConfig;
  const branding = { ...brandingConfig, ...(input.branding || {}) };
  const result = input.data || input;
  const content = input.content || mapAllSections(result);
  const html = input.html || buildPdfHtmlDocument(result);

  content.title = content.title || 'My Operating Manual';
  content.subtitle = content.subtitle || '';

  const doc = createDocument(JsPDFCtor, layout);
  const logoUrl = resolveLogoUrl(branding.logo || brandingConfig.logo || PDF_LOGO_URL);
  let logoAsset = null;
  try {
    logoAsset = branding.includeLogoOnCover ? await loadImageAsset(logoUrl) : null;
  } catch (logoLoadError) {
    console.error('Logo load failed:', logoLoadError);
  }

  await renderCoverPage(doc, layout, branding, content, logoAsset);

  const state = { pageNumber: 1 };
  try {
    drawFooter(doc, layout, branding, state.pageNumber);
  } catch (footerError) {
    console.error('Footer render failed:', footerError);
  }

  doc.addPage();
  state.pageNumber += 1;
  let y = inchesToPoints(layout.page.margins.top);

  for (const section of content.sections || []) {
    if (!section?.body) continue;
    try {
      y = renderSection(doc, layout, branding, section.title, section.body, y, state);
    } catch (sectionError) {
      console.error(`Section render failed (${section.title}):`, sectionError);
    }
  }

  try {
    drawFooter(doc, layout, branding, state.pageNumber);
  } catch (footerError) {
    console.error('Final footer render failed:', footerError);
  }

  const arrayBuffer = doc.output('arraybuffer');
  return {
    bytes: new Uint8Array(arrayBuffer),
    doc,
    content,
    layout,
    branding,
    html,
  };
}

/**
 * Generate a PDF document from Money Maker data or mapped content.
 * Lazy-loads jsPDF + html2canvas only when export runs (after hydration).
 * @param {object} input
 */
export async function generatePdfDocument(input = {}) {
  await whenDomReady();

  const jsPDFModule = await import('jspdf');
  const jsPDF = jsPDFModule.default || jsPDFModule.jsPDF || jsPDFModule;
  const html2canvasModule = await import('html2canvas');
  const html2canvas = html2canvasModule.default || html2canvasModule;

  const layout = input.layout || layoutConfig;
  const branding = { ...brandingConfig, ...(input.branding || {}) };
  const result = input.data || input;
  const content = input.content || mapAllSections(result);

  content.title = content.title || 'My Operating Manual';
  content.subtitle = content.subtitle || '';
  branding.logo = branding.logo || PDF_LOGO_URL;

  const formattedHtml =
    result.formatted?.longFormBodyHtml ||
    result.formatted?.html ||
    result.formatted?.rawHtml ||
    result.formatted?.textConvertedToHtml ||
    mapAllSections(result).html ||
    '';

  const html = pdfWrapper.replace('{{CONTENT}}', formattedHtml || '');

  try {
    const doc = new jsPDF();
    await doc.html(html, {
      callback: () => {
        doc.save(input.filename || 'my-operating-manual.pdf');
      },
      html2canvas,
    });
    return true;
  } catch (htmlError) {
    console.error('HTML PDF render failed, falling back to section renderer:', htmlError);
    return generatePdfDocumentFromSections(
      { ...input, data: result, content, layout, branding, html },
      jsPDF
    );
  }
}

/**
 * Convenience helper: generate and return a Blob.
 * @param {object} input
 * @returns {Promise<Blob>}
 */
export async function generatePdfBlob(input = {}) {
  const rendered = await generatePdfDocument(input);
  if (rendered === true) {
    return new Blob([], { type: 'application/pdf' });
  }
  return new Blob([rendered?.bytes || []], { type: 'application/pdf' });
}

export {
  layoutConfig,
  brandingConfig,
  inchesToPoints,
  hexToRgb,
  pdfWrapper,
};

export default {
  generatePdfDocument,
  generatePdfBlob,
  resolveLogoUrl,
  buildPdfHtmlDocument,
  resolveFormattedHtml,
  layoutConfig,
  brandingConfig,
};
