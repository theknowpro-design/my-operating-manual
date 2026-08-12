/**
 * Unified PDF generation orchestrator (global core).
 *
 * GENERATE → SANITIZE → STRUCTURE → RENDER
 *
 * Shared by:
 * - in-app generator (action-bar)
 * - future stand-alone generator (Phase P3)
 * - future DEOS module (Phase P4)
 *
 * No niche forks. No Focus logic here (Focus applies at generation content-level).
 */

import { sanitizeContent } from '../sanitize/index.js';
import { applyStructure } from '../structure/index.js';
import { renderPdfDocument } from '../render/renderPdfDocument.js';
import { buildPdfFilename } from '../render/buildPdfFilename.js';
import { pipelineConfig } from './pipelineConfig.js';

/**
 * @typedef {object} GeneratePdfOptions
 * @property {string} [filename]
 * @property {string} [title]
 * @property {string} [subtitle]
 * @property {Date|string|number} [generatedAt]
 * @property {string} [brand]
 * @property {string} [author]
 * @property {string|null} [logoUrl]
 * @property {string} [coverImageUrl] uploaded cover image — becomes Page 1 as-is
 * @property {string} [coverHtml] authored cover HTML — never regenerated
 * @property {string} [niche]
 * @property {string} [nicheName]
 * @property {string} [nicheId]
 * @property {boolean} [includeLogo]
 * @property {boolean} [includeMetadataBlock]
 * @property {{ title?: string, description?: string, keywords?: string[]|string, imageAlt?: string }} [metadata]
 */

/**
 * Run the unified PDF pipeline and save the file.
 * @param {string} raw generation HTML (Focus already applied upstream)
 * @param {GeneratePdfOptions|string} [options] options object, or legacy filename string
 * @returns {Promise<object|undefined>} jsPDF instance when available
 */
export async function generatePdf(raw, options = {}) {
  // Back-compat: generatePdf(raw, 'file.pdf') or generatePdf(raw, 'file.pdf', opts)
  let opts = options;
  if (typeof options === 'string') {
    opts = { filename: options };
  }

  const filename = opts.filename
    || buildPdfFilename(opts.title || opts.metadata?.title || 'My Operating Manual');

  const sanitized = sanitizeContent(String(raw ?? ''));
  const { html, schema } = applyStructure(sanitized, opts);

  try {
    return await renderPdfDocument(html, schema, filename);
  } catch (error) {
    if (pipelineConfig.fallbackOnError) {
      console.error('[pdf-pipeline] generatePdf error (fallback enabled):', error);
    }
    throw error;
  }
}

export default generatePdf;
