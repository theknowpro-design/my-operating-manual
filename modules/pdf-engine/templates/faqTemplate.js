/**
 * FAQ HTML for the PDF template layer.
 * Pure HTML assembly — no jsPDF / rendering.
 */

import { escapeHtml, paragraphsToHtml } from './htmlUtils.js';
import { getPageBreak } from './pageBreaks.js';

/**
 * @param {Array<{ question?: string, answer?: string }>} faq
 * @returns {string}
 */
export function buildFaq(faq = []) {
  const items = Array.isArray(faq) ? faq : [];
  const usable = items.filter((item) => {
    const question = String(item?.question || '').trim();
    const answer = String(item?.answer || '').trim();
    return question && answer;
  });

  if (!usable.length) return '';

  const body = usable.map((item) => {
    const question = escapeHtml(item.question);
    const answer = paragraphsToHtml(item.answer);
    return [
      '<div class="faq-item">',
      `<h3>${question}</h3>`,
      answer,
      '</div>',
    ].join('');
  }).join('');

  return [
    '<div class="faq">',
    '<h2>FAQ</h2>',
    body,
    '</div>',
    getPageBreak(),
  ].join('');
}

export default buildFaq;
