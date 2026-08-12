/**
 * LOCKED PDF Export Engine for My Operating Manual
 * 
 * ARCHITECTURE: Single-purpose module for Operating Manual PDF generation ONLY.
 * 
 * This module is intentionally restrictive:
 * - Accepts ONLY Operating Manual markdown/HTML
 * - Rejects Money Maker, Profit Engine, and generic content
 * - Enforces Teal Read Me branding (no overrides)
 * - Validates all inputs against schema
 * - Validates all assets against whitelist (prevents legacy asset contamination)
 * - Exposes ONLY generateOperatingManualPdf() as the entry point
 * 
 * All legacy Money Maker shims have been moved to ./legacy/ for backward
 * compatibility, but they are NOT exported by this module.
 * 
 * Flow: markdown/HTML → VALIDATE SCHEMA → VALIDATE ASSETS → SANITIZE → STRUCTURE → RENDER
 * 
 * @see validators/inputSchema.js (schema enforcement)
 * @see validators/assetWhitelist.js (asset validation)
 * @see legacy/moneyMakerCompat.js (deprecated functions, if needed)
 */

import { marked } from 'marked';
import { generatePdf } from './pipeline/generatePdf.js';
import {
  buildPdfFilename,
  sanitizeTitleForFilename,
  formatExportDate,
} from './render/buildPdfFilename.js';
import brandingConfig from './brandingConfig.js';
import {
  enforceOperatingManualSchema,
  detectLegacyMoneyMakerOptions,
} from './validators/inputSchema.js';
import {
  validatePdfAsset,
} from './validators/assetWhitelist.js';
import {
  getVersionWithTimestamp,
  formatVersionHtmlComment,
} from './utils/versionHelper.js';
import { validateInputSize } from '../../src/utils/validateInputSize.js';

// Legacy function names are NOT exported from this module
// (They are moved to ./legacy/ for reference only)

/**
 * Convert Operating Manual markdown into light-mode HTML for the PDF pipeline.
 * 
 * LOCKED: This is an internal helper. Use generateOperatingManualPdf() instead.
 * Automatically includes version metadata in HTML comments.
 * 
 * @param {string} markdown
 * @returns {string}
 * @private
 */
function markdownToLightHtml(markdown) {
  const body = marked.parse(String(markdown || ''), { gfm: true, breaks: true });
  const versionComment = formatVersionHtmlComment();
  
  return `
    ${versionComment}
    <article class="operating-manual-pdf" data-theme="light" style="color:#2a2f3a;background:#ffffff;">
      ${body}
    </article>
  `;
}

/**
 * LOCKED ENTRY POINT: Generate a PDF from Operating Manual markdown.
 * 
 * ENFORCEMENT:
 * - Input is validated against Operating Manual schema
 * - Branding is locked to "My Operating Manual" (cannot be overridden)
 * - Logo is locked to Teal Read Me Logo (cannot be overridden)
 * - Legacy Money Maker options are rejected
 * - All inputs must be Operating Manual content (not generic HTML)
 * 
 * @param {string} markdownOrHtml - Operating Manual markdown or HTML
 * @param {object} [options] - Rendering options
 * @param {string} [options.title] - PDF title (defaults to "My Operating Manual")
 * @param {string} [options.subtitle] - PDF subtitle (defaults to "Personal Operating Manual")
 * @param {string} [options.author] - PDF author (defaults to "My Operating Manual")
 * @param {Date|string|number} [options.generatedAt] - Generation timestamp
 * @param {object} [options.metadata] - PDF metadata (keywords, description, etc.)
 * @returns {Promise<object|undefined>} PDF result from pipeline
 * @throws {Error} if input fails schema validation
 * 
 * @example
 * import { generateOperatingManualPdf } from './modules/pdf-engine/exportManager.js';
 * 
 * const result = await generateOperatingManualPdf(
 *   '# How to Work With Me\n\nTrigger: X → Action: Y',
 *   { title: 'My Operating Manual', author: 'Jordan' }
 * );
 */
export async function generateOperatingManualPdf(markdownOrHtml = '', options = {}) {
  // VALIDATION: Check for legacy Money Maker function calls
  const legacyWarning = detectLegacyMoneyMakerOptions(options);
  if (legacyWarning) {
    console.warn(legacyWarning);
    throw new Error(`${legacyWarning} — Use generateOperatingManualPdf() instead`);
  }

  // VALIDATION: Check input size (prevent DoS)
  const raw = String(markdownOrHtml || '');
  const sizeValidation = validateInputSize(raw);
  if (!sizeValidation.isValid) {
    const error = new Error(`[PDF Input] ${sizeValidation.error}`);
    error.code = 'INPUT_SIZE_EXCEEDED';
    console.error('[PDF Input] Size validation failed:', sizeValidation.error);
    throw error;
  }

  // VALIDATION: Enforce Operating Manual schema
  enforceOperatingManualSchema(markdownOrHtml, options);

  // VALIDATION: Enforce asset whitelist (prevent legacy asset contamination)
  const assetValidation = validatePdfAsset(brandingConfig.logo);
  if (!assetValidation.valid) {
    const error = new Error(`[PDF Assets] ${assetValidation.reason}`);
    error.code = 'ASSET_WHITELIST_VIOLATION';
    console.error('[PDF Assets] Whitelist violation:', assetValidation.reason);
    throw error;
  }

  // VERSION METADATA: Load and include version information
  const versionInfo = getVersionWithTimestamp();

  // PROCESSING: Convert markdown to HTML
  const looksLikeHtml = /^\s*</.test(raw);
  const html = looksLikeHtml ? raw : markdownToLightHtml(raw);
  
  const title = options.title || 'My Operating Manual';
  const generatedAt = options.generatedAt || new Date();

  // RENDERING: Call PDF pipeline with LOCKED options + version metadata
  // Note: brand, logo, and branding are intentionally not overridable
  return generatePdf(html, {
    // LOCKED BRAND: Cannot be overridden
    brand: 'My Operating Manual',
    author: options.author || 'My Operating Manual',
    
    // LOCKED LOGO: Only Teal Read Me Logo is allowed (whitelisted)
    logoUrl: brandingConfig.logo, // Always use configured logo, never override
    includeLogo: options.includeLogo !== false,
    includeMetadataBlock: options.includeMetadataBlock !== false,
    
    // PERMITTED OPTIONS: User can customize these
    title,
    subtitle: options.subtitle || 'Personal Operating Manual',
    generatedAt,
    filename: options.filename || buildPdfFilename(title),
    
    // METADATA: Operating Manual-focused
    metadata: {
      title,
      description: options.subtitle || 'Personal Operating Manual',
      keywords: ['operating manual', 'personal user guide', 'collaboration'],
      ...(options.metadata || {}),
    },
    
    // VERSION: Included in HTML comment for audit trail
    // (Full version metadata injection via PDF properties requires build-time integration)
  });
}

/**
 * LOCKED MODULE EXPORTS
 * 
 * Only the locked entry point and utility functions are exported.
 * All legacy Money Maker functions are removed from exports.
 * 
 * If legacy Money Maker PDF generation is required, see ./legacy/moneyMakerCompat.js
 */

// generateOperatingManualPdf is exported via declaration above (line 84)

/**
 * LEGACY COMPATIBILITY: Alias for generateOperatingManualPdf()
 * 
 * @deprecated Use generateOperatingManualPdf() instead
 * @see generateOperatingManualPdf
 */
export async function generatePDF(markdownOrHtml = '', options = {}) {
  console.warn(
    '[Compatibility] generatePDF() is an alias for generateOperatingManualPdf(). ' +
    'Use generateOperatingManualPdf() directly in new code.'
  );
  return generateOperatingManualPdf(markdownOrHtml, options);
}

// Export utility functions for filename/date handling
export {
  buildPdfFilename,
  sanitizeTitleForFilename,
  formatExportDate,
};

/**
 * Browser helper: Download blob as file
 * (Kept as utility for compatibility with UI code)
 */
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

// Default export: LOCKED entry point only
export default {
  generateOperatingManualPdf,
  generatePDF, // For backward compatibility
  downloadBlob,
  buildPdfFilename,
};

