/**
 * DEPRECATED: Build SEO metadata block — no longer used
 * Operating Manual PDFs store metadata in <head> tags only, not in document body.
 */

/**
 * @deprecated
 * @param {{
 *   title?: string,
 *   description?: string,
 *   keywords?: string[],
 *   imageAlt?: string
 * }} metadata
 * @returns {string}
 */
export function buildMetadata(metadata = {}) {
  // Deprecated: no longer renders metadata in PDF body
  return '';
}

export default buildMetadata;
