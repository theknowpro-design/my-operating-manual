/**
 * @deprecated Use `modules/pdf-engine/render` instead.
 * Compatibility shim — re-exports the unified render layer.
 */

export {
  renderPdfDocument,
  renderHtml,
  renderFallbackText,
  savePdf,
  buildPdfFilename,
} from '../render/index.js';

/** @deprecated Use renderHtml from pdf-engine/render */
export { renderHtml as renderPdf } from '../render/index.js';

/** @deprecated Cover is built by structure/buildCover — renderer no longer owns cover. */
export async function renderCoverPage() {
  console.warn('[deprecated] renderCoverPage: cover is produced by structure/buildCover via applyStructure');
  return null;
}

export { renderPdfDocument as default } from '../render/index.js';
