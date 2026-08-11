/**
 * Profit Engine AI — unified PDF core public entry.
 *
 * App / stand-alone (P3) / DEOS (P4) should import from here or from
 * `./pipeline/index.js` / `./render/index.js` / `./structure/index.js`.
 *
 *   import { generatePdf } from './pdf-engine/index.js'
 *
 * Flow: GENERATE → SANITIZE → STRUCTURE → RENDER
 */

export { generatePdf } from './pipeline/generatePdf.js';
export { sanitizeContent } from './sanitize/index.js';
export { applyStructure } from './structure/index.js';
export { renderPdfDocument } from './render/renderPdfDocument.js';
export { buildPdfFilename } from './render/buildPdfFilename.js';

export { generatePdf as default } from './pipeline/generatePdf.js';
