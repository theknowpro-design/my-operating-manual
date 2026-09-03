/**
 * REMOVED: Flight Deck Graphs section generation
 * This module was generating the "Flight Deck Graphs" section (#15) from Money Maker.
 * Operating Manual PDFs contain only the 12 core sections + Quick Reference.
 * 
 * Legacy graphs (bar-chart, altitude, telemetry, NAV-RADAR) are no longer rendered.
 */

/**
 * NO-OP: insertCockpitGraphs is kept as a stub for backward compatibility.
 * It now does nothing (returns input unchanged).
 * @param {string} html
 * @returns {string}
 */
export function insertCockpitGraphs(html) {
  return String(html ?? '');
}
