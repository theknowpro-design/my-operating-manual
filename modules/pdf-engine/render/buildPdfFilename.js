/**
 * Filename helpers for the unified PDF core.
 * Pure — no rendering libraries.
 */

/**
 * Sanitize a title for safe filenames.
 * @param {string} title
 * @returns {string}
 */
export function sanitizeTitleForFilename(title) {
  const cleaned = String(title || 'ProfitPlan')
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 80);
  return cleaned || 'ProfitPlan';
}

/**
 * Format date segment as YYYY-MM-DD.
 * @param {Date|string|number} [date]
 * @returns {string}
 */
export function formatExportDate(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) {
    return formatExportDate(new Date());
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Build ProfitEngineAI_<Title>_<Date>.pdf
 * @param {string} [title]
 * @param {Date|string|number} [date]
 * @returns {string}
 */
export function buildPdfFilename(title, date = new Date()) {
  const safeTitle = sanitizeTitleForFilename(title);
  return `ProfitEngineAI_${safeTitle}_${formatExportDate(date)}.pdf`;
}

export default buildPdfFilename;
