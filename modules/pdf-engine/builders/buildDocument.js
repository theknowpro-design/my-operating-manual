/**
 * Assemble a full HTML document from structured PDF content schema.
 * Pure string assembly — no jsPDF / html2canvas / rendering.
 */

import { buildHtmlDocument, buildCss } from '../templates/index.js';

/**
 * Build the complete HTML document string ready for the PDF renderer.
 * @param {{
 *   title?: string,
 *   subtitle?: string,
 *   sections?: Array<{ heading?: string, body?: string }>,
 *   cta?: string,
 *   faq?: Array<{ question?: string, answer?: string }>,
 *   metadata?: object
 * }} schema
 * @returns {string}
 */
export function buildDocument(schema = {}) {
  const css = buildCss();
  // Use the HTML template so pdf-container, logo header, and page-breaks stay consistent.
  const bodyInner = buildHtmlDocument(schema);

  return [
    '<!DOCTYPE html>',
    '<html>',
    '<head>',
    '<meta charset="UTF-8" />',
    '<title>Profit Engine AI Export</title>',
    css,
    '</head>',
    '<body>',
    bodyInner,
    '</body>',
    '</html>',
  ].join('');
}

export default buildDocument;
