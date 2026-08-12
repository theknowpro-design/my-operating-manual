/**
 * DEPRECATED: Income Graph Builder (Money Maker)
 * 
 * This module was used to build and insert income potential graphs for Money Maker PDFs.
 * It is NOT used by the My Operating Manual system.
 * 
 * All functions have been disabled to prevent accidental use.
 * The file is kept for reference only.
 * 
 * For Operating Manual PDF generation, the system uses inline SVG cockpit graphs only.
 * @see insertCockpitGraphs.js
 */

// ❌ DEPRECATED: These functions are no longer used
// They attempted to render income potential graphs using niche-specific PNG assets.
// The graphs folder has been removed as part of Money Maker cleanup.

/**
 * @deprecated Income graph rendering removed
 * @see insertCockpitGraphs.js
 */
export function buildIncomeGraphSection() {
  console.warn(
    '[DEPRECATED] buildIncomeGraphSection() is disabled. ' +
    'The My Operating Manual system uses inline SVG graphics only.'
  );
  return '';
}

/**
 * @deprecated Income graph insertion removed
 * @see insertCockpitGraphs.js
 */
export function insertIncomeGraphBeforeActionPlan(html) {
  console.warn(
    '[DEPRECATED] insertIncomeGraphBeforeActionPlan() is disabled. ' +
    'The My Operating Manual system uses inline SVG graphics only.'
  );
  return html;
}
