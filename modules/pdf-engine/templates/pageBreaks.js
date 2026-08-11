/**
 * Page-break marker for PDF HTML templates.
 * Pure string helper — no rendering.
 */

/**
 * @returns {string}
 */
export function getPageBreak() {
  return '<div class="page-break"></div>';
}

export default getPageBreak;
