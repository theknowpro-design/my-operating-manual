/**
 * Static monthly/niche graph placement for Real-World Examples / Scenarios.
 * The graph starts on a fresh page and remains an atomic image block.
 */

import { PAGE_BREAK_HTML } from './enforcePageBreaks.js';
import { renderImageBlock } from './renderImageBlock.js';
import { resolveNicheGraphSrc } from './resolveNicheGraph.js';

/**
 * @param {{ niche?: string, nicheName?: string, nicheId?: string }} [options]
 * @returns {string}
 */
function buildRealWorldScenariosGraph(options = {}) {
  const src = resolveNicheGraphSrc(options, 'monthly-progress');
  const image = renderImageBlock({
    src,
    alt: 'Monthly Progress graph showing income increasing over time',
    width: '100%',
    maxHeight: 216,
    minHeight: 240,
    maintainAspectRatio: true,
    preventPageBreak: true,
  });

  return [
    PAGE_BREAK_HTML,
    '<section class="pdf-monthly-progress-graph pdf-real-world-scenarios-graph">',
    image,
    '</section>',
  ].join('\n');
}

function removeExistingGraph(html) {
  return String(html || '')
    .replace(
      /(?:<div class="page-break"><\/div>\s*)?<section\b[^>]*class=["'][^"']*\b(?:pdf-real-world-scenarios-graph|pdf-income-graph)\b[^"']*["'][^>]*>[\s\S]*?<\/section\s*>/gi,
      ''
    )
    .replace(
      /<div\b[^>]*class=["'][^"']*\boutput-section-income\b[^"']*["'][^>]*>[\s\S]*?<\/div\s*>/gi,
      ''
    )
    .replace(/<canvas\b[^>]*>[\s\S]*?<\/canvas\s*>/gi, '')
    .replace(/<canvas\b[^>]*\/?>/gi, '');
}

/**
 * Add the niche (or fallback) graph at the end of Real-World Examples / Scenarios.
 * @param {string} html
 * @param {{ niche?: string, nicheName?: string, nicheId?: string }} [options]
 * @returns {string}
 */
export function insertRealWorldScenariosGraph(html, options = {}) {
  const out = String(html ?? '');
  const heading = /<h2\b[^>]*>\s*Real-World (?:Examples(?:\s+or Scenarios)?|Scenarios)\s*<\/h2\s*>/i.exec(out);
  if (!heading) return out;

  const bodyStart = heading.index + heading[0].length;
  const remainder = out.slice(bodyStart);
  const nextHeading = /(?:<div\b[^>]*class=["'][^"']*\bpage-break\b[^"']*["'][^>]*>\s*<\/div\s*>\s*)?<h2\b/i.exec(remainder);
  const bodyEnd = nextHeading ? bodyStart + nextHeading.index : out.length;
  const sectionBody = removeExistingGraph(out.slice(bodyStart, bodyEnd)).trimEnd();

  return [
    out.slice(0, bodyStart),
    sectionBody,
    buildRealWorldScenariosGraph(options),
    out.slice(bodyEnd),
  ].filter(Boolean).join('\n');
}

export default insertRealWorldScenariosGraph;
