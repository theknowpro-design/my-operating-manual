/**
 * Global heading enforcement for the PDF structure layer.
 * H1 = cover title only; H2 = major sections; H3–H6 → bold subsections.
 * Pure — niche-agnostic, no Focus / sanitize / render logic.
 */

/**
 * Escape text for safe HTML insertion.
 * @param {unknown} value
 * @returns {string}
 */
function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Strip tags to plain text.
 * @param {string} html
 * @returns {string}
 */
function stripTags(html) {
  return String(html ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Convert subsection headings (h3–h6) into bold paragraph labels (not TOC entries).
 * @param {string} html
 * @returns {string}
 */
function demoteSubHeadings(html) {
  return String(html ?? '').replace(
    /<h([3-6])\b[^>]*>([\s\S]*?)<\/h\1\s*>/gi,
    (_match, _level, inner) => {
      const text = stripTags(inner);
      if (!text) return '';
      return `<p class="pdf-subsection"><strong>${escapeHtml(text)}</strong></p>`;
    }
  );
}

/**
 * Promote leftover h1 blocks in the body to h2 (cover owns the only h1).
 * @param {string} html
 * @returns {string}
 */
function promoteBodyH1ToH2(html) {
  return String(html ?? '').replace(
    /<h1\b[^>]*>([\s\S]*?)<\/h1\s*>/gi,
    (_match, inner) => `<h2>${inner}</h2>`
  );
}

/**
 * Ensure bare section title lines wrapped as non-h2 headings become h2
 * when they look like major section labels (already-tagged h2 preserved).
 * @param {string} html
 * @returns {string}
 */
export function enforceHeadings(html) {
  let out = String(html ?? '');

  // Subsections must never remain as heading ranks.
  out = demoteSubHeadings(out);

  // Body must not keep H1 — cover page owns H1 exclusively.
  out = promoteBodyH1ToH2(out);

  // Normalize h2 open tags (drop accidental classes that imply niche layout).
  out = out.replace(/<h2\b[^>]*>/gi, '<h2>');
  out = out.replace(/<\/h2\s*>/gi, '</h2>');

  return out;
}

/**
 * Pull the first document title from sanitized HTML.
 * Removes/ignores ALL DOCX/HTML content before the first H1 (cover owns H1).
 * Prefers an existing H1, else the first H2 (body kept intact when no H1).
 * @param {string} html
 * @returns {{ title: string, bodyHtml: string }}
 */
export function extractTitleAndBody(html) {
  const source = String(html ?? '');
  const h1 = source.match(/<h1\b[^>]*>([\s\S]*?)<\/h1\s*>/i);
  if (h1) {
    const title = stripTags(h1[1]);
    // Discard everything before the first H1 AND the H1 itself — cover is Page 1.
    const h1Index = source.search(/<h1\b/i);
    const afterH1 = source.slice(h1Index + h1[0].length).trim();
    return { title, bodyHtml: afterH1 };
  }

  const h2 = source.match(/<h2\b[^>]*>([\s\S]*?)<\/h2\s*>/i);
  if (h2) {
    return { title: stripTags(h2[1]), bodyHtml: source };
  }

  return { title: 'Profit Engine Plan', bodyHtml: source };
}

export { escapeHtml, stripTags };
export default enforceHeadings;
