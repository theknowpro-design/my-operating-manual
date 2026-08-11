/**
 * Build SEO metadata block HTML via the template layer.
 * Pure assembly — no rendering. No trailing page-break.
 */

import { buildMetadata as renderMetadata } from '../templates/metadataTemplate.js';

/**
 * @param {{
 *   title?: string,
 *   description?: string,
 *   keywords?: string[],
 *   imageAlt?: string
 * }} metadata
 * @returns {string}
 */
export function buildMetadata(metadata = {}) {
  return renderMetadata(metadata || {});
}

export default buildMetadata;
