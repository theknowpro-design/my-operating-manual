/**
 * Build body sections HTML via the template layer.
 * Pure assembly — no rendering.
 */

import { buildSections as renderSections } from '../templates/sectionsTemplate.js';

/**
 * @param {Array<{ heading?: string, body?: string }>} sections
 * @returns {string}
 */
export function buildSections(sections = []) {
  return renderSections(Array.isArray(sections) ? sections : []);
}

export default buildSections;
