/**
 * PDF engine pipeline — public orchestrator API.
 *
 * Unified core for App + stand-alone (P3) + DEOS (P4):
 *   import { generatePdf } from './pdf-engine/pipeline/index.js'
 */

export { generatePdf } from './generatePdf.js';
export { pipelineConfig } from './pipelineConfig.js';

export { prepareStructuredContent, prepareContent } from './prepareContent.js';
export { extractSections, stripTags, dedupeSections } from './extractSections.js';
export { extractCTA } from './extractCTA.js';
export { extractFAQ } from './extractFAQ.js';
export { extractMetadata } from './extractMetadata.js';

export { generatePdf as default } from './generatePdf.js';
