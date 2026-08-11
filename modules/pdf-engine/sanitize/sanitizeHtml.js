/**
 * Comment + page-marker cleanup for PDF-bound HTML.
 * Protects PageBreak markers; strips all other comments / page directives.
 * Pure — no DOM, jsPDF, or html2canvas.
 */

/** Internal placeholder so PageBreak survives comment stripping. */
export const PAGE_BREAK_PLACEHOLDER = '___PDF_PAGE_BREAK___';

/**
 * Strip malformed HTML comments and page directives.
 * Preserves PageBreak comments as PAGE_BREAK_PLACEHOLDER for later normalization.
 * @param {string} html
 * @returns {string}
 */
export function sanitizeHtml(html) {
  let out = String(html ?? '');

  // Protect real PageBreak comments before wiping other comments.
  out = out.replace(/<!--\s*PageBreak\s*-->/gi, PAGE_BREAK_PLACEHOLDER);

  // Also protect already-normalized break divs so comment cleanup cannot corrupt them.
  out = out.replace(
    /<div\b[^>]*class\s*=\s*["'][^"']*\bpage-break\b[^"']*["'][^>]*>\s*<\/div\s*>/gi,
    PAGE_BREAK_PLACEHOLDER
  );

  // Remove every remaining HTML comment (PageHeader, PageNumber, empty, etc.).
  out = out.replace(/<!--[\s\S]*?-->/g, '');

  // Unclosed / truncated comment openers.
  out = out.replace(/<!--[\s\S]*$/g, '');

  // Stray comment closers.
  out = out.replace(/-->/g, '');

  // Plain-text / attribute-style page directives that never became comments.
  out = out.replace(/\bPageHeader\s*=\s*"[^"]*"/gi, '');
  out = out.replace(/\bPageFooter\s*=\s*"[^"]*"/gi, '');
  out = out.replace(/\bPageNumber\s*=\s*"[^"]*"/gi, '');
  out = out.replace(/\bPageHeader\s*=\s*[-–—]+/gi, '');
  out = out.replace(/\bPageNumber\s*=\s*\d+/gi, '');

  // Residual <!-- or --> fragments.
  out = out.replace(/<!-{2,}/g, '');
  out = out.replace(/-{2,}>/g, '');

  return out;
}

export default sanitizeHtml;
