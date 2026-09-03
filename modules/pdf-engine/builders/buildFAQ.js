/**
 * Build FAQ block HTML via the template layer.
 * Pure assembly — no rendering.
 */

import { buildFaq as renderFaq } from '../templates/faqTemplate.js';

/**
 * @param {Array<{ question?: string, answer?: string }>} faq
 * @returns {string}
 */
export function buildFAQ(faq = []) {
  return renderFaq(Array.isArray(faq) ? faq : []);
}

export default buildFAQ;
