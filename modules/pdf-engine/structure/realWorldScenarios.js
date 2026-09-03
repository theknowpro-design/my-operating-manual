/**
 * DEPRECATED: Real World Scenarios Graph System (Money Maker)
 * 
 * This file was used to insert niche income/progress graphs into Money Maker PDFs.
 * It is NOT used by the My Operating Manual system.
 * 
 * All functions have been disabled to prevent accidental use.
 * The file is kept for reference only.
 * 
 * For Operating Manual PDF generation, the system uses inline SVG cockpit graphs only.
 * @see insertCockpitGraphs.js
 */

// ❌ DISABLED: This function is no longer called by applyStructure
// It attempted to resolve and insert niche-specific monthly progress graphs.
// The graphs folder has been removed as part of Money Maker cleanup.

export function insertRealWorldScenariosGraph(html) {
  console.warn(
    '[DEPRECATED] insertRealWorldScenariosGraph() is disabled. ' +
    'The My Operating Manual system uses inline SVG graphics only. ' +
    'See insertCockpitGraphs() for PDF graphs.'
  );
  // Do not modify HTML - return as-is
  return html;
}

/**
 * @deprecated Niche graph support removed
 * @see insertCockpitGraphs.js
 */
export function insertRealWorldScenariosGraphRaw() {
  return '';
}
