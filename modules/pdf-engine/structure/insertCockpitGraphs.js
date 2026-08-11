/**
 * Insert printable cockpit-style progression graphs (bar / altitude / telemetry / NAV-RADAR)
 * into PDF structured HTML. Pure SVG — no external assets.
 */

import { PAGE_BREAK_HTML } from './enforcePageBreaks.js';

/**
 * @returns {string}
 */
export function buildCockpitGraphsSection() {
  return [
    PAGE_BREAK_HTML,
    '<section class="pdf-cockpit-graphs" aria-label="Cockpit progression graphs">',
    '<h2>Flight Deck Graphs</h2>',
    '<p class="pdf-cockpit-graphs-note">Altitude, telemetry, bar-chart, and NAV-RADAR progression snapshots for this plan.</p>',
    '<div class="pdf-cockpit-graph-row">',
    '<svg class="pdf-graph pdf-graph--bar-chart" viewBox="0 0 320 120" role="img" aria-label="bar-chart income progression">',
    '<title>bar-chart</title>',
    '<rect x="20" y="70" width="36" height="30" fill="#2ad4f0"/>',
    '<rect x="70" y="50" width="36" height="50" fill="#2ad4f0"/>',
    '<rect x="120" y="35" width="36" height="65" fill="#7ef0ff"/>',
    '<rect x="170" y="22" width="36" height="78" fill="#00ff6a"/>',
    '<rect x="220" y="12" width="36" height="88" fill="#00ff6a"/>',
    '<text x="20" y="112" font-size="10" fill="#334">bar-chart</text>',
    '</svg>',
    '<svg class="pdf-graph pdf-graph--altitude" viewBox="0 0 320 120" role="img" aria-label="altitude climb">',
    '<title>altitude</title>',
    '<polyline fill="none" stroke="#2ad4f0" stroke-width="3" points="10,100 60,85 110,70 160,48 210,30 270,18 310,12"/>',
    '<text x="20" y="112" font-size="10" fill="#334">altitude</text>',
    '</svg>',
    '</div>',
    '<div class="pdf-cockpit-graph-row">',
    '<svg class="pdf-graph pdf-graph--telemetry" viewBox="0 0 320 120" role="img" aria-label="telemetry rise">',
    '<title>telemetry</title>',
    '<path d="M10 90 C60 90, 80 40, 130 50 S200 20, 310 25" fill="none" stroke="#7ef0ff" stroke-width="3"/>',
    '<circle cx="310" cy="25" r="4" fill="#00ff6a"/>',
    '<text x="20" y="112" font-size="10" fill="#334">telemetry</text>',
    '</svg>',
    '<svg class="pdf-graph pdf-graph--nav-radar" viewBox="0 0 160 160" role="img" aria-label="NAV-RADAR sweep">',
    '<title>NAV-RADAR</title>',
    '<circle cx="80" cy="80" r="70" fill="none" stroke="#2ad4f0" stroke-opacity="0.35"/>',
    '<circle cx="80" cy="80" r="45" fill="none" stroke="#2ad4f0" stroke-opacity="0.35"/>',
    '<circle cx="80" cy="80" r="20" fill="none" stroke="#2ad4f0" stroke-opacity="0.35"/>',
    '<line x1="80" y1="80" x2="130" y2="40" stroke="#00ff6a" stroke-width="2"/>',
    '<text x="40" y="150" font-size="10" fill="#334">NAV-RADAR</text>',
    '</svg>',
    '</div>',
    '</section>',
  ].join('\n');
}

/**
 * Append cockpit graphs once (idempotent).
 * @param {string} html
 * @returns {string}
 */
export function insertCockpitGraphs(html) {
  const out = String(html ?? '');
  if (/pdf-cockpit-graphs|NAV-RADAR|pdf-graph--altitude/i.test(out)) return out;
  return `${out}\n${buildCockpitGraphsSection()}`;
}
