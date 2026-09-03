/**
 * LEGACY MONEY MAKER PDF FUNCTIONS (Archived for Reference)
 * 
 * These functions have been REMOVED from exportManager.js as part of the
 * PDF engine refactoring to a locked, single-purpose module for Operating Manual only.
 * 
 * This file is provided for reference only. Do NOT import from this file.
 * Use generateOperatingManualPdf() from exportManager.js instead.
 * 
 * If Money Maker PDF generation is needed in the future, it should:
 * 1. Be implemented in a separate module (not in the Operating Manual engine)
 * 2. Have its own entry point and schema validation
 * 3. Never be mixed with Operating Manual PDF logic
 */

// Archived for reference - DO NOT USE

// /**
//  * @deprecated Use generateOperatingManualPdf() instead
//  */
// export async function exportBrandedPdf(plan = {}, options = {}) {
//   console.warn('[deprecated] exportBrandedPdf → generateOperatingManualPdf()');
//   // ... implementation would resolve plan.formatted.html
// }

// /**
//  * @deprecated Use generateOperatingManualPdf() instead
//  */
// export async function exportProfitEnginePdf(data = {}, options = {}) {
//   // ... implementation for Money Maker Profit Engine
// }

// /**
//  * @deprecated Use generateOperatingManualPdf() instead
//  */
// export async function generateBrandedPdf(plan = {}, options = {}) {
//   // ... implementation for generic branded PDFs
// }

// /**
//  * @deprecated Use generateOperatingManualPdf() instead
//  */
// export async function createPdfExport(plan = {}, options = {}) {
//   // ... implementation for plan export
// }

// /**
//  * @deprecated Use generateOperatingManualPdf() instead
//  */
// export function injectExportMetadata(data = {}, options = {}) {
//   // ... metadata injection for legacy systems
// }

/**
 * RATIONALE FOR REMOVAL
 * 
 * The PDF engine has been intentionally locked to prevent:
 * 
 * 1. **Brand Confusion**: Money Maker and Operating Manual have different
 *    branding, templates, and use cases. Mixing them causes confusion and
 *    maintenance burden.
 * 
 * 2. **Data Integrity**: Operating Manual PDFs contain personal working
 *    agreements. They must be generated ONLY from Operating Manual content
 *    that has passed validation.
 * 
 * 3. **Template Pollution**: Money Maker uses niche-specific graphs, income
 *    projections, and business model templates. Operating Manual uses
 *    trigger/action instructions and reciprocal commitments. Sharing templates
 *    causes feature creep and coupling.
 * 
 * 4. **Security**: By rejecting unknown content types, the module prevents
 *    accidental rendering of untrusted data or misuse of branding.
 * 
 * 5. **Maintenance**: A locked, single-purpose module is easier to test,
 *    audit, and maintain than a generic "render anything" PDF engine.
 * 
 * FUTURE APPROACH
 * 
 * If Money Maker PDF generation is needed, it should:
 * 
 * 1. Be a separate module: modules/pdf-engines/money-maker/
 * 2. Have its own schema validator for Profit Engine / niche data
 * 3. Have its own templates and branding configuration
 * 4. Have its own entry point: generateMoneyMakerPdf()
 * 5. Never import from the Operating Manual PDF engine
 * 6. Be invoked separately from Operating Manual logic
 * 
 * This approach keeps the two systems completely isolated and prevents
 * the kind of creep that led to the need for this refactoring.
 */
