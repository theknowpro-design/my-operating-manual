/**
 * DEPRECATED: Niche Graph Resolution (Money Maker)
 * 
 * This module was used to resolve niche-specific income potential and monthly progress graphs.
 * It is NOT used by the My Operating Manual system.
 * 
 * All functions have been disabled to prevent accidental use.
 * The file is kept for reference only.
 * 
 * For Operating Manual PDF generation, the system uses inline SVG cockpit graphs only.
 * @see insertCockpitGraphs.js
 */

// ❌ DEPRECATED: These functions are no longer used
// They attempted to resolve PNG graph assets from the now-removed graphs folder.

/**
 * @deprecated Niche graph resolution removed
 */
export function resolveNicheGraphSrc(options, graphType) {
  console.warn(
    '[DEPRECATED] resolveNicheGraphSrc() is disabled. ' +
    'The My Operating Manual system uses inline SVG graphics only. ' +
    'Niche graphs folder has been permanently removed.'
  );
  return '';
}

/**
 * @deprecated Niche graph entry resolution removed
 */
export function resolveNicheGraphEntry(nicheKey) {
  console.warn(
    '[DEPRECATED] resolveNicheGraphEntry() is disabled. ' +
    'Niche graphs are not available in Operating Manual mode.'
  );
  return null;
}

/**
 * @deprecated Niche key normalization removed
 */
export function normalizeNicheKey(key) {
  console.warn(
    '[DEPRECATED] normalizeNicheKey() is disabled. ' +
    'Niche graphs are not available in Operating Manual mode.'
  );
  return key;
}
