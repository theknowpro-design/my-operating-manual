/**
 * Rebuild nicheGraphCatalog.js from niche-graph-manifest.json (no PNG regen).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '../assets/graphs');
const manifestPath = path.join(OUT_DIR, 'niche-graph-manifest.json');
const catalogPath = path.resolve(__dirname, '../structure/nicheGraphCatalog.js');

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[()/]/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

const raw = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const graphs = Array.isArray(raw.graphs) ? raw.graphs : [];

const byKey = {};
for (const entry of graphs) {
  const graphType =
    entry.graphType
    || (/-income-potential\.png$/i.test(entry.filename) ? 'income-potential' : 'monthly-progress');
  const compact = {
    niche: entry.niche,
    category: entry.category,
    filename: entry.filename,
    graphType,
  };
  byKey[slugify(entry.niche)] = compact;
  byKey[slugify(String(entry.filename).replace(/-(monthly-progress|income-potential)\.png$/i, ''))] = compact;
}

const catalogSource = [
  '/**',
  ' * Auto-generated niche graph catalog. Do not edit by hand.',
  ' * Regenerate via: node pdf-engine/scripts/generate-niche-graphs.mjs',
  ' * Or rebuild catalog only: node pdf-engine/scripts/rebuild-niche-graph-catalog.mjs',
  ' */',
  '',
  `export const nicheGraphCatalog = ${JSON.stringify({ count: graphs.length, byKey }, null, 2)};`,
  '',
  'export default nicheGraphCatalog;',
  '',
].join('\n');

fs.writeFileSync(catalogPath, catalogSource, 'utf8');
console.log(`Wrote ${catalogPath} (${graphs.length} graphs, ${Object.keys(byKey).length} keys)`);
