/**
 * Deprecated compatibility helpers for Income Potential graphs.
 * Active PDF structure uses advancedTips.js + realWorldScenarios.js instead.
 * Kept only for external callers that still import these names.
 */

import { renderImageBlock } from './renderImageBlock.js';
import { resolveNicheGraphSrc } from './resolveNicheGraph.js';

/**
 * @param {{ niche?: string, nicheName?: string, nicheId?: string }} [options]
 * @returns {string}
 */
export function buildIncomeGraphSection(options = {}) {
  const media = renderImageBlock({
    src: resolveNicheGraphSrc(options, 'income-potential'),
    alt: 'Income Potential graph showing income increasing over time',
    width: '100%',
    maxHeight: 216,
    minHeight: 240,
    maintainAspectRatio: true,
    preventPageBreak: true,
  });

  return [
    '<section class="pdf-income-graph">',
    media,
    '</section>',
  ].join('\n');
}

/**
 * @deprecated Use insertAdvancedTipsGraph / insertRealWorldScenariosGraph via applyStructure.
 * @param {string} html
 * @param {string|object} [sourceOrOptions]
 * @returns {string}
 */
export function insertIncomeGraphBeforeActionPlan(html, sourceOrOptions = '') {
  const options = sourceOrOptions && typeof sourceOrOptions === 'object'
    ? sourceOrOptions
    : {};
  const section = buildIncomeGraphSection(options);
  let out = String(html ?? '');

  const wrappedSectionRe = /(?:<div\b[^>]*class=["'][^"']*\bpage-break\b[^"']*["'][^>]*>\s*<\/div\s*>\s*)?<section\b[^>]*class=["'][^"']*\bpdf-income-graph\b[^"']*["'][^>]*>[\s\S]*?<\/section\s*>/i;
  out = out.replace(wrappedSectionRe, '');

  const headingRe = /<h2\b[^>]*>\s*Income Potential\s*<\/h2\s*>/i;
  const headingMatch = headingRe.exec(out);
  if (headingMatch) {
    const beforeHeading = out.slice(0, headingMatch.index);
    const precedingBreak = /<div\b[^>]*class=["'][^"']*\bpage-break\b[^"']*["'][^>]*>\s*<\/div\s*>\s*$/i.exec(beforeHeading);
    const start = precedingBreak
      ? headingMatch.index - precedingBreak[0].length
      : headingMatch.index;
    const remainder = out.slice(headingMatch.index + headingMatch[0].length);
    const nextSection = /(?:<div\b[^>]*class=["'][^"']*\bpage-break\b[^"']*["'][^>]*>\s*<\/div\s*>\s*)?<h2\b/i.exec(remainder);
    const end = nextSection
      ? headingMatch.index + headingMatch[0].length + nextSection.index
      : out.length;
    out = `${out.slice(0, start)}${out.slice(end)}`;
  }

  const actionPlanRe = /((?:<div class="page-break"><\/div>\s*)?<h2\b[^>]*>\s*Action Plan[\s\S]*?<\/h2>)/i;
  if (actionPlanRe.test(out)) {
    return out.replace(actionPlanRe, `${section}\n$1`);
  }

  if (/<h2\b[^>]*>\s*SEO Metadata\s*<\/h2>/i.test(out)) {
    return out.replace(
      /((?:<div class="page-break"><\/div>\s*)?<h2\b[^>]*>\s*SEO Metadata\s*<\/h2>)/i,
      `${section}\n$1`
    );
  }

  return `${out}\n${section}`;
}

export default buildIncomeGraphSection;
