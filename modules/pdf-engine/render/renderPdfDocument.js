/**
 * Unified PDF renderer entry point.
 *
 * Consumes structured HTML + schema from applyStructure().
 * ONLY renders — no niche, focus, sanitize, or structure logic.
 *
 * Respects (as authored by structure/):
 * - @page { margin: 1in 0.75in; } via jsPDF insets
 * - div.page-break / h2 break-before (page-split renderer)
 * - TOC anchors → clickable internal PDF links
 * - cover page (image or H1) as Page 1
 * - chart canvases → Base64 images before capture
 *
 * Chrome rainbow fix: opaque per-page JPEG (no tall PNG + negative Y).
 */

import { renderHtml } from './renderHtml.js';
import { renderFallbackText } from './renderFallbackText.js';
import { savePdf } from './savePdf.js';

/**
 * Render and save a PDF from structured HTML.
 * @param {string} htmlDocument full HTML from applyStructure().html
 * @param {object} schema schema from applyStructure().schema (fallback + metadata)
 * @param {string} [filename]
 * @returns {Promise<object>} jsPDF instance after save
 */
export async function renderPdfDocument(htmlDocument, schema = {}, filename = 'my-operating-manual.pdf') {
  let doc;

  const htmlForRender = typeof htmlDocument === 'string'
    ? htmlDocument
    : (htmlDocument?.outerHTML
      || (htmlDocument != null ? JSON.stringify(htmlDocument, null, 2) : ''));
  console.log('RENDERER_HTML_START');
  console.log(htmlForRender);
  console.log('RENDERER_HTML_END');

  try {
    doc = await renderHtml(String(htmlDocument ?? ''));
  } catch (error) {
    console.error('[pdf-render] HTML render failed; using schema text fallback:', error);
    doc = await renderFallbackText(schema || {});
  }

  try {
    const meta = schema?.metadata || {};
    if (typeof doc.setProperties === 'function') {
      doc.setProperties({
        title: meta.title || schema?.title || 'My Operating Manual',
        subject: meta.description || schema?.subtitle || '',
        keywords: Array.isArray(meta.keywords) ? meta.keywords.join(', ') : String(meta.keywords || ''),
        creator: 'My Operating Manual',
        author: 'My Operating Manual',
      });
    }
  } catch {
    // Properties are best-effort only.
  }

  savePdf(doc, filename || 'my-operating-manual.pdf');
  return doc;
}

export default renderPdfDocument;
