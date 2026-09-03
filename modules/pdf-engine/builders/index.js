/**
 * PDF document builders layer entry.
 * Pure HTML assembly from structured schema — no rendering libraries.
 */

import { buildDocument } from './buildDocument.js';

/**
 * Build the complete HTML document string ready for the PDF renderer.
 * @param {object} schema
 * @returns {string}
 */
export function buildFullDocument(schema) {
  return buildDocument(schema);
}

export { buildDocument } from './buildDocument.js';
export { buildSections } from './buildSections.js';
export { buildCTA } from './buildCTA.js';
export { buildFAQ } from './buildFAQ.js';

export default buildFullDocument;
