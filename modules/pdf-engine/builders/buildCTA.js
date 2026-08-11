/**
 * Build CTA block HTML via the template layer.
 * Pure assembly — no rendering.
 */

import { buildCta as renderCta } from '../templates/ctaTemplate.js';

/**
 * @param {string} cta
 * @returns {string}
 */
export function buildCTA(cta = '') {
  return renderCta(String(cta || ''));
}

export default buildCTA;
