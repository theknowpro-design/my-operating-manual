/**
 * Static monthly/niche graph placement for Advanced Tips.
 * Replaces dynamic income canvas/SVG and starts the graph on a fresh page.
 */

import { PAGE_BREAK_HTML } from './enforcePageBreaks.js';
import { renderImageBlock } from './renderImageBlock.js';
import { resolveNicheGraphSrc } from './resolveNicheGraph.js';

/**
 * @param {{ niche?: string, nicheName?: string, nicheId?: string }} [options]
 * @returns {string}
 */
function buildAdvancedTipsGraph(options = {}) {
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
    '<section class="pdf-monthly-progress-graph pdf-advanced-tips-graph">',
    image,
    '</section>',
  ].join('\n');
}

function removeDynamicGraph(html) {
  return String(html || '')
    .replace(
      /<div\b[^>]*class=["'][^"']*\boutput-section-income\b[^"']*["'][^>]*>\s*<div\b[^>]*class=["'][^"']*\bincome-chart-svg\b[^"']*["'][^>]*>[\s\S]*?<\/svg\s*>\s*<\/div\s*>\s*<\/div\s*>/gi,
      ''
    )
    .replace(
      /<div\b[^>]*class=["'][^"']*\boutput-section-income\b[^"']*["'][^>]*>[\s\S]*?<\/div\s*>/gi,
      ''
    )
    .replace(
      /(?:<div class="page-break"><\/div>\s*)?<section\b[^>]*class=["'][^"']*\bpdf-advanced-tips-graph\b[^"']*["'][^>]*>[\s\S]*?<\/section\s*>/gi,
      ''
    )
    .replace(/<canvas\b[^>]*>[\s\S]*?<\/canvas\s*>/gi, '')
    .replace(/<canvas\b[^>]*\/?>/gi, '');
}

/**
 * Add the niche (or fallback) graph at the end of Advanced Tips, before the next H2.
 * @param {string} html
 * @param {{ niche?: string, nicheName?: string, nicheId?: string }} [options]
 * @returns {string}
 */
export function insertAdvancedTipsGraph(html, options = {}) {
  const out = String(html ?? '');
  const heading = /<h2\b[^>]*>\s*Advanced Tips(?:\s+for Better Results)?\s*<\/h2\s*>/i.exec(out);
  if (!heading) return out;

  const bodyStart = heading.index + heading[0].length;
  const remainder = out.slice(bodyStart);
  const nextHeading = /(?:<div\b[^>]*class=["'][^"']*\bpage-break\b[^"']*["'][^>]*>\s*<\/div\s*>\s*)?<h2\b/i.exec(remainder);
  const bodyEnd = nextHeading ? bodyStart + nextHeading.index : out.length;
  const sectionBody = removeDynamicGraph(out.slice(bodyStart, bodyEnd)).trimEnd();

  return [
    out.slice(0, bodyStart),
    sectionBody,
    buildAdvancedTipsGraph(options),
    out.slice(bodyEnd),
  ].filter(Boolean).join('\n');
}

export default insertAdvancedTipsGraph;
