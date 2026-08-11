/**
 * Smoke checks for niche graph wiring (structure layer).
 */
import fs from 'fs';
import { ALL_NICHES } from '../../config/profitEngineCatalog.js';
import { resolveNicheGraphSrc, resolveNicheGraphEntry, normalizeNicheKey } from '../structure/resolveNicheGraph.js';
import { applyStructure } from '../structure/applyStructure.js';
import { sanitizeContent } from '../sanitize/index.js';

const checks = [];
function assert(name, cond, detail = '') {
  checks.push({ name, pass: Boolean(cond), detail: detail || (cond ? '' : 'failed') });
}

assert('normalize fitness', normalizeNicheKey('Fitness Coaching') === 'fitness-coaching');
assert(
  'resolve fitness entry',
  resolveNicheGraphEntry({ nicheName: 'Fitness Coaching' })?.filename === 'fitness-coaching-monthly-progress.png'
);
assert(
  'resolve affiliate',
  resolveNicheGraphSrc({ niche: 'affiliate marketing' }) === 'assets/graphs/affiliate-marketing-income-potential.png'
);
assert(
  'alias accounting',
  resolveNicheGraphSrc({ nicheName: 'Accounting' }) === 'assets/graphs/business-accounting-income-potential.png'
);
assert(
  'alias ml ops compact',
  resolveNicheGraphSrc({ nicheName: 'ML Ops' }) === 'assets/graphs/mlops-income-potential.png'
);
assert(
  'alias virtual assistance',
  resolveNicheGraphSrc({ nicheName: 'Virtual Assistance' }) === 'assets/graphs/virtual-assistants-income-potential.png'
);
assert(
  'fallback unknown',
  resolveNicheGraphSrc({ nicheName: 'Totally Unknown Niche' }) === 'assets/graphs/monthly-progress-graph.png'
);
assert(
  'income fallback',
  resolveNicheGraphSrc({}, 'income-potential') === 'assets/graphs/income-potential-graph.png'
);

const raw = [
  '<h1>T</h1>',
  '<h2>Advanced Tips for Better Results</h2>',
  '<p>Tip</p>',
  '<div class="output-section-income"><div class="income-chart-svg"><svg></svg></div></div>',
  '<h2>Real-World Examples or Scenarios</h2>',
  '<p>Scenario</p>',
  '<h2>Action Plan</h2>',
  '<p>Act</p>',
].join('');

const html = sanitizeContent(raw);
const { html: out } = applyStructure(html, {
  title: 'T',
  nicheName: 'Fitness Coaching',
  includeMetadataBlock: false,
});

assert('advanced uses niche png', out.includes('fitness-coaching-monthly-progress.png'));
assert(
  'both sections use niche png',
  (out.match(/fitness-coaching-monthly-progress\.png/g) || []).length === 2
);
assert('no canvas left', !/<canvas\b/i.test(out));
assert('no svg chart left', !/income-chart-svg/i.test(out));
assert('forced breaks present', (out.match(/class="page-break"/g) || []).length >= 2);
assert(
  'asset files exist',
  fs.existsSync('modules/pdf-engine/assets/graphs/fitness-coaching-monthly-progress.png')
    && fs.existsSync('modules/pdf-engine/assets/graphs/affiliate-marketing-income-potential.png')
);

const coverageMisses = ALL_NICHES.filter((name) => {
  const src = resolveNicheGraphSrc({ nicheName: name, niche: name });
  return /monthly-progress-graph|income-potential-graph/.test(src);
});
assert('ALL_NICHES graph coverage', coverageMisses.length === 0, coverageMisses.join(', '));

const multiNiches = [
  'Fitness Coaching',
  'Affiliate Marketing',
  'Accounting',
  'ML Ops',
  'Virtual Assistance',
  'Investing',
  'Prompt Engineering',
];
for (const niche of multiNiches) {
  const src = resolveNicheGraphSrc({ nicheName: niche });
  const filename = src.split('/').pop();
  const { html: structured } = applyStructure(html, {
    title: 'T',
    nicheName: niche,
    includeMetadataBlock: false,
  });
  assert(`structure embeds ${niche}`, structured.includes(filename), filename);
  assert(`asset on disk ${niche}`, fs.existsSync(`modules/pdf-engine/assets/graphs/${filename}`), filename);
}

const failed = checks.filter((c) => !c.pass);
console.log(JSON.stringify({
  passed: checks.filter((c) => c.pass).length,
  failed,
  allNiches: ALL_NICHES.length,
}, null, 2));
if (failed.length) process.exit(1);
