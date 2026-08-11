/**
 * Unified PDF render layer — single entry for App, stand-alone, and DEOS.
 * PURE RENDER ONLY.
 */

export { renderPdfDocument } from './renderPdfDocument.js';
export { renderHtml } from './renderHtml.js';
export {
  captureChartsAsImages,
  configureChartJsDefaults,
} from './captureChartsAsImages.js';
export { renderFallbackText } from './renderFallbackText.js';
export { savePdf } from './savePdf.js';
export {
  buildPdfFilename,
  sanitizeTitleForFilename,
  formatExportDate,
} from './buildPdfFilename.js';

export { renderPdfDocument as default } from './renderPdfDocument.js';
