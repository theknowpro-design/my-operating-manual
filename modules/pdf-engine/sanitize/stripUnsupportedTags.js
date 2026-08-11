/**
 * Strip tags/structures that jsPDF html() cannot render cleanly.
 * Pure — no DOM, jsPDF, or html2canvas.
 */

const ALLOWED_TAGS = new Set([
  'h1',
  'h2',
  'h3',
  'h4',
  'p',
  'div',
  'span',
  'strong',
  'em',
  'b',
  'i',
  'ul',
  'ol',
  'li',
  'br',
]);

/** Tags whose entire subtree must be removed (not just unwrapped). */
const REMOVE_WITH_CONTENTS = new Set([
  'figure',
  'figcaption',
  'header',
  'footer',
  'nav',
  'aside',
  'script',
  'style',
  'iframe',
  'object',
  'embed',
  'svg',
  'canvas',
  'video',
  'audio',
  'noscript',
  'form',
  'button',
  'input',
  'textarea',
  'select',
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'td',
  'th',
  'img',
  'picture',
  'source',
]);

/**
 * Remove one paired tag and its contents (non-greedy, case-insensitive).
 * @param {string} html
 * @param {string} tag
 * @returns {string}
 */
function stripTagWithContents(html, tag) {
  const re = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}\\s*>`, 'gi');
  return html.replace(re, '');
}

/**
 * Unwrap or drop tags that are not in the allowlist.
 * Preserves page-break divs.
 * @param {string} html
 * @returns {string}
 */
export function stripUnsupportedTags(html) {
  let out = String(html ?? '');

  for (const tag of REMOVE_WITH_CONTENTS) {
    let prev;
    do {
      prev = out;
      out = stripTagWithContents(out, tag);
    } while (out !== prev);
    out = out.replace(new RegExp(`<${tag}\\b[^>]*\\/?>`, 'gi'), '');
  }

  // Unwrap any remaining non-allowed tags (keep inner text/HTML).
  // Keep <div class="page-break">…</div> intact.
  out = out.replace(/<\/?([a-zA-Z][\w:-]*)\b[^>]*>/g, (match, rawName) => {
    const name = String(rawName || '').toLowerCase();
    if (ALLOWED_TAGS.has(name)) return match;
    return '';
  });

  // Drop empty paragraphs/divs/spans/headings created by stripping.
  // Do not drop page-break divs (they are empty by design).
  out = out.replace(/<(p|span|li|h[1-4])\b[^>]*>\s*<\/\1\s*>/gi, '');
  out = out.replace(/<div\b(?![^>]*\bpage-break\b)[^>]*>\s*<\/div\s*>/gi, '');

  // Normalize <b>/<i> to strong/em for consistency.
  out = out.replace(/<b\b[^>]*>/gi, '<strong>').replace(/<\/b\s*>/gi, '</strong>');
  out = out.replace(/<i\b[^>]*>/gi, '<em>').replace(/<\/i\s*>/gi, '</em>');

  return out;
}

export default stripUnsupportedTags;
