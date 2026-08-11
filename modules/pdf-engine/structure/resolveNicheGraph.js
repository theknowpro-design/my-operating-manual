/**
 * Resolve niche → static graph asset path for PDF structure.
 * Falls back to generic monthly/income PNGs when no niche match exists.
 */

import nicheGraphCatalog from './nicheGraphCatalog.js';

/**
 * Catalog display-name → graph slug when generator labels diverge from ALL_NICHES.
 * Keep in sync with pdf-engine/scripts/generate-niche-graphs.mjs where practical.
 */
const NICHE_GRAPH_ALIASES = Object.freeze({
  accounting: 'business-accounting',
  'business-accounting': 'business-accounting',
  'ml-ops': 'mlops',
  mlops: 'mlops',
  'virtual-assistance': 'virtual-assistants',
  'virtual-assistant': 'virtual-assistants',
  'virtual-assistants': 'virtual-assistants',
});

/** @type {Record<string, { niche: string, category: string, filename: string, graphType: string }>} */
const COMPACT_KEY_INDEX = Object.create(null);
for (const [catalogKey, entry] of Object.entries(nicheGraphCatalog.byKey || {})) {
  COMPACT_KEY_INDEX[catalogKey.replace(/-/g, '')] = entry;
}

/**
 * @param {unknown} value
 * @returns {string}
 */
export function normalizeNicheKey(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[()/]/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

/**
 * @param {{ niche?: string, nicheName?: string, nicheId?: string }} [options]
 * @returns {string[]}
 */
function candidateKeys(options = {}) {
  return [options.nicheName, options.niche, options.nicheId]
    .map((value) => String(value || '').trim())
    .filter(Boolean);
}

/**
 * @param {string} key
 * @returns {{ niche: string, category: string, filename: string, graphType: string }|null}
 */
function lookupEntry(key) {
  const normalized = normalizeNicheKey(key);
  if (!normalized) return null;

  const byKey = nicheGraphCatalog.byKey || {};
  if (byKey[normalized]) return byKey[normalized];

  const aliased = NICHE_GRAPH_ALIASES[normalized];
  if (aliased && byKey[aliased]) return byKey[aliased];

  // Hyphen-insensitive: "ML Ops" → ml-ops ↔ mlops
  const compact = normalized.replace(/-/g, '');
  return (compact && COMPACT_KEY_INDEX[compact]) || null;
}

/**
 * Resolve the public asset path for a niche graph.
 * @param {{ niche?: string, nicheName?: string, nicheId?: string }} [options]
 * @param {'monthly-progress'|'income-potential'} [preferredFallback='monthly-progress']
 * @returns {string} structure-relative asset path (assets/graphs/...)
 */
export function resolveNicheGraphSrc(options = {}, preferredFallback = 'monthly-progress') {
  for (const key of candidateKeys(options)) {
    const entry = lookupEntry(key);
    if (entry?.filename) return `assets/graphs/${entry.filename}`;
  }

  return preferredFallback === 'income-potential'
    ? 'assets/graphs/income-potential-graph.png'
    : 'assets/graphs/monthly-progress-graph.png';
}

/**
 * @param {{ niche?: string, nicheName?: string, nicheId?: string }} [options]
 * @returns {{ niche: string, category: string, filename: string, graphType: string }|null}
 */
export function resolveNicheGraphEntry(options = {}) {
  for (const key of candidateKeys(options)) {
    const entry = lookupEntry(key);
    if (entry) return entry;
  }
  return null;
}

export default resolveNicheGraphSrc;
