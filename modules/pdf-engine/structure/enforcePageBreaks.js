/**
 * Global page-break enforcement for the PDF structure layer.
 * Auto page-break before every H2; preserves manual div.page-break markers.
 * Pure — niche-agnostic.
 */

export const PAGE_BREAK_HTML = '<div class="page-break"></div>';

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Canonicalize existing page-break markers.
 * @param {string} html
 * @returns {string}
 */
function canonicalizeBreaks(html) {
  return String(html ?? '').replace(
    /<div\b[^>]*class\s*=\s*["'][^"']*\bpage-break\b[^"']*["'][^>]*>\s*<\/div\s*>/gi,
    PAGE_BREAK_HTML
  );
}

/**
 * Insert an automatic page-break before every H2 (except when one already precedes it).
 * @param {string} html
 * @returns {string}
 */
export function enforcePageBreaks(html) {
  let out = canonicalizeBreaks(html);
  const breakRe = escapeRegex(PAGE_BREAK_HTML);

  out = out.replace(new RegExp(`(?:\\s*${breakRe}\\s*){2,}`, 'gi'), `\n${PAGE_BREAK_HTML}\n`);

  out = out.replace(/<h2\b/gi, (match, offset, full) => {
    const before = full.slice(Math.max(0, offset - 64), offset);
    if (before.includes('page-break')) return match;
    return `${PAGE_BREAK_HTML}\n${match}`;
  });

  out = out.replace(new RegExp(`^\\s*${breakRe}\\s*`, 'i'), '');
  out = out.replace(new RegExp(`(?:\\s*${breakRe}\\s*){2,}`, 'gi'), `\n${PAGE_BREAK_HTML}\n`);

  return out.trim();
}

export default enforcePageBreaks;
