/**
 * Extract FAQ question/answer pairs from sanitized HTML.
 * Pure — no DOM or PDF rendering.
 */

import { extractSections, stripTags } from './extractSections.js';

const FAQ_HEADING_RE = /^(faqs?|frequently\s+asked\s+questions?)\b/i;
const QUESTION_LINE_RE = /^(.+\?)\s*$/;

/**
 * @param {string} html
 * @returns {Array<{ question: string, answer: string }>}
 */
export function extractFAQ(html) {
  const sections = extractSections(html);
  const faqSection = sections.find((section) => FAQ_HEADING_RE.test(section.heading));
  const sourceHtml = faqSection?.bodyHtml || String(html || '');
  const pairs = parseFaqPairs(sourceHtml);
  return dedupeFaq(pairs);
}

/**
 * @param {string} html
 * @returns {Array<{ question: string, answer: string }>}
 */
function parseFaqPairs(html) {
  const source = String(html || '');

  // Prefer explicit Q/A markup patterns.
  const strongPairs = [...source.matchAll(
    /<(?:p|div|li|strong|h[1-3])\b[^>]*>\s*(?:Q(?:uestion)?\s*[:.]?\s*)?([^<]{3,}\?)\s*<\/(?:p|div|li|strong|h[1-3])\s*>\s*<(?:p|div|li)\b[^>]*>([\s\S]*?)<\/(?:p|div|li)\s*>/gi
  )];

  if (strongPairs.length) {
    return strongPairs
      .map((match) => ({
        question: normalizeSpace(stripTags(match[1])),
        answer: normalizeSpace(stripTags(match[2])),
      }))
      .filter((pair) => pair.question && pair.answer);
  }

  // Fallback: plain-text lines where a question ends with "?" and following lines answer it.
  const text = stripTags(source.replace(/<\/(?:p|div|li|h[1-3])\s*>/gi, '\n'));
  const lines = text
    .split(/\n+/)
    .map((line) => normalizeSpace(line))
    .filter(Boolean);

  /** @type {Array<{ question: string, answer: string }>} */
  const pairs = [];
  let currentQuestion = '';
  let answerParts = [];

  const flush = () => {
    if (!currentQuestion) return;
    const answer = normalizeSpace(answerParts.join(' '));
    if (answer) pairs.push({ question: currentQuestion, answer });
    currentQuestion = '';
    answerParts = [];
  };

  for (const line of lines) {
    if (QUESTION_LINE_RE.test(line) || /^q(?:uestion)?\s*[:.]/i.test(line)) {
      flush();
      currentQuestion = normalizeSpace(line.replace(/^q(?:uestion)?\s*[:.]?\s*/i, ''));
      continue;
    }
    if (currentQuestion) {
      answerParts.push(line.replace(/^a(?:nswer)?\s*[:.]?\s*/i, ''));
    }
  }
  flush();

  return pairs;
}

/**
 * @param {Array<{ question: string, answer: string }>} pairs
 * @returns {Array<{ question: string, answer: string }>}
 */
function dedupeFaq(pairs) {
  const seen = new Set();
  const out = [];
  for (const pair of pairs || []) {
    const question = normalizeSpace(pair?.question);
    const answer = normalizeSpace(pair?.answer);
    if (!question || !answer) continue;
    const key = `${question.toLowerCase()}::${answer.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ question, answer });
  }
  return out;
}

/**
 * @param {string} text
 * @returns {string}
 */
function normalizeSpace(text) {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

export default extractFAQ;
