/**
 * Public PDF export API for My Operating Manual + legacy Money Maker shims.
 *
 * Preferred entry for this app:
 *   import { generatePDF } from '../../modules/pdf-engine/exportManager.js'
 *
 * Flow: markdown/HTML → SANITIZE → STRUCTURE → RENDER (always light-mode).
 */

import { marked } from 'marked';
import { generatePdf } from './pipeline/generatePdf.js';
import {
  buildPdfFilename,
  sanitizeTitleForFilename,
  formatExportDate,
} from './render/buildPdfFilename.js';
import brandingConfig from './brandingConfig.js';

export { buildPdfFilename, sanitizeTitleForFilename, formatExportDate };

/**
 * Convert Operating Manual markdown into light-mode HTML for the PDF pipeline.
 * @param {string} markdown
 * @returns {string}
 */
function markdownToLightHtml(markdown) {
  const body = marked.parse(String(markdown || ''), { gfm: true, breaks: true });
  return `
    <article class="operating-manual-pdf" data-theme="light" style="color:#2a2f3a;background:#ffffff;">
      ${body}
    </article>
  `;
}

/**
 * Generate a branded PDF from Operating Manual markdown (or HTML string).
 * Always uses light-mode styling via templates + branding + layoutConfig pipeline.
 *
 * @param {string} markdownOrHtml
 * @param {object} [options]
 * @returns {Promise<object|undefined>}
 */
export async function generatePDF(markdownOrHtml = '', options = {}) {
  const raw = String(markdownOrHtml || '');
  const looksLikeHtml = /^\s*</.test(raw);
  const html = looksLikeHtml ? raw : markdownToLightHtml(raw);
  const title = options.title || 'My Operating Manual';

  const generatedAt = options.generatedAt || new Date();

  return generatePdf(html, {
    brand: 'My Operating Manual',
    author: options.author || 'My Operating Manual',
    includeLogo: options.includeLogo !== false,
    includeMetadataBlock: options.includeMetadataBlock !== false,
    ...options,
    title,
    subtitle: options.subtitle || 'Personal Operating Manual',
    generatedAt,
    logoUrl: options.logoUrl || brandingConfig.logo,
    filename: options.filename || buildPdfFilename(title),
    metadata: {
      title,
      description: options.subtitle || 'Personal Operating Manual',
      keywords: ['operating manual', 'personal user guide', 'collaboration'],
      ...(options.metadata || {}),
    },
  });
}


/**
 * @deprecated Use generatePdf(rawHtml, options) from pdf-engine/pipeline
 */
export async function exportBrandedPdf(plan = {}, options = {}) {
  console.warn('[deprecated] exportBrandedPdf → generatePdf (unified pipeline)');
  const raw = resolveRawHtml(plan);
  const title = options.title || plan.title || plan.method?.title || 'Profit Engine Plan';
  return generatePdf(raw, {
    ...options,
    title,
    filename: options.filename || buildPdfFilename(title),
    subtitle: options.subtitle || plan.subtitle || '',
    metadata: options.metadata || plan.metadata,
  });
}

/**
 * @deprecated Use generatePdf
 */
export async function exportProfitEnginePdf(data = {}, options = {}) {
  return exportBrandedPdf(data, options);
}

/**
 * @deprecated Use generatePdf
 */
export async function generateBrandedPdf(plan = {}, options = {}) {
  return exportBrandedPdf(plan, options);
}

/**
 * @deprecated Use generatePdf
 */
export async function createPdfExport(plan = {}, options = {}) {
  return exportBrandedPdf(plan, options);
}

/**
 * @deprecated No longer maps via contentMapper
 */
export function injectExportMetadata(data = {}, options = {}) {
  console.warn('[deprecated] injectExportMetadata — pass metadata via generatePdf options');
  const timestamp = options.timestamp || new Date().toISOString();
  return {
    ...data,
    meta: {
      ...(data.meta || {}),
      exportedAt: timestamp,
      exportEngine: 'Profit Engine AI PDF Generator (unified)',
      ...(options.meta || {}),
    },
  };
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function resolveRawHtml(plan) {
  if (typeof plan === 'string') return plan;
  return (
    plan?.formatted?.longFormBodyHtml
    || plan?.formatted?.html
    || plan?.formatted?.document
    || plan?.formatted?.text
    || plan?.html
    || ''
  );
}

export default {
  generatePDF,
  exportBrandedPdf,
  exportProfitEnginePdf,
  generateBrandedPdf,
  createPdfExport,
  buildPdfFilename,
};

