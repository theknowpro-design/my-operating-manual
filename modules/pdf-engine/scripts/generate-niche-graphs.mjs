/**
 * Generate niche-adaptive Income Potential / Monthly Progress graphs (480×320).
 * Run: node pdf-engine/scripts/generate-niche-graphs.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '../assets/graphs');

/** @type {Array<{ id: string, titlePrefix: string, xLabel: string, xTicks: number[], line: string, grid: string, niches: string[] }>} */
const CATEGORIES = [
  {
    id: 'ai',
    titlePrefix: 'Monthly Progress',
    xLabel: 'Month',
    xTicks: [1, 2, 3, 4],
    line: '#1E90FF',
    grid: '#B0B8C4',
    niches: [
      'AI agents',
      'AI automation',
      'AI business systems',
      'AI content systems',
      'AI data workflows',
      'AI integrations',
      'AI productivity',
      'AI tool mastery',
      'AI workflow design',
      'prompt engineering',
    ],
  },
  {
    id: 'business',
    titlePrefix: 'Income Potential',
    xLabel: 'Time',
    xTicks: [0, 1, 2, 3, 4],
    line: '#0D9488',
    grid: '#D1D5DB',
    niches: [
      'business accounting', // ALL_NICHES: "Accounting" (alias in resolveNicheGraph)
      'affiliate marketing',
      'agency building',
      'Amazon Associates',
      'Amazon FBA',
      'Amazon merch',
      'API integration services',
      'app building',
      'app flipping',
      'automation engineering',
      'blogging',
      'bookkeeping',
      'branding',
      'business systems',
      'career coaching',
      'cloud architecture',
      'coaching',
      'consulting',
      'content repurposing',
      'copywriting',
      'course creation',
      'curriculum design',
      'cybersecurity',
      'data engineering',
      'data labeling',
      'DevOps',
      'digital product stores',
      'domain flipping',
      'dropshipping',
      'Etsy shops',
      'freelancing',
      'HR consulting',
      'influencer marketing',
      'language teaching',
      'legal consulting',
      'marketing',
      'marketplace arbitrage',
      'microtasking',
      'MLOps', // ALL_NICHES: "ML Ops" (hyphen-insensitive resolve)
      'newsletter publishing',
      'online business flipping',
      'online research services',
      'outsourcing and delegation',
      'paid ads',
      'POD print on demand',
      'podcasting',
      'private label products',
      'project management',
      'recruiting',
      'resume writing',
      'SAAS',
      'sales and lead generation',
      'SEO',
      'Shopify stores',
      'skill coaching',
      'social media management',
      'social media strategy',
      'test prep',
      'tutoring',
      'UGC creation',
      'virtual assistants', // ALL_NICHES: "Virtual Assistance" (alias in resolveNicheGraph)
      'web development',
      'website building (no-code)',
      'website design UI/UX',
      'website flipping',
      'wholesale e-commerce',
      'YouTube',
    ],
  },
  {
    id: 'creative',
    titlePrefix: 'Monthly Progress',
    xLabel: 'Month',
    xTicks: [1, 2, 3, 4],
    line: '#7C3AED',
    grid: '#6B7280',
    niches: [
      '3D modeling',
      'animation',
      'brand identity systems',
      'crafting',
      'creative entrepreneurship',
      'digital art',
      'filmmaking',
      'Figma systems',
      'graphic design',
      'handmade goods',
      'iconography',
      'illustration',
      'motion graphics',
      'music production',
      'photography',
      'print design',
      'prototyping',
      'UI animation',
      'UX research',
      'videography',
      'writing and publishing',
    ],
  },
  {
    id: 'fitness',
    titlePrefix: 'Monthly Progress',
    xLabel: 'Month',
    xTicks: [1, 2, 3, 4],
    line: '#16A34A',
    grid: '#E5E7EB',
    niches: [
      'fitness coaching',
      'healthy aging',
      'holistic wellness',
      'mental health support',
      'mobility training',
      'nutrition coaching',
      'running',
      'sleep optimization',
      'strength training',
      'stress reduction',
      'weight loss',
      'yoga',
    ],
  },
  {
    id: 'lifestyle',
    titlePrefix: 'Monthly Progress',
    xLabel: 'Month',
    xTicks: [1, 2, 3, 4],
    line: '#EA580C',
    grid: '#E7E5E4',
    niches: [
      'food and recipes',
      'gardening',
      'hobbies',
      'home cooking',
      'home organization',
      'minimalism',
      'parenting',
      'personal style',
      'pet care',
      'relationships',
      'travel',
    ],
  },
  {
    id: 'money',
    titlePrefix: 'Income Potential',
    xLabel: 'Time',
    xTicks: [0, 1, 2, 3, 4],
    line: '#1E3A5F',
    grid: '#9CA3AF',
    niches: [
      'budgeting',
      'credit repair',
      'crypto',
      'debt reduction',
      'financial literacy',
      'investing',
      'passive income systems',
      'real estate investing',
      'retirement planning',
      'side hustles',
      'tax strategy',
      'trading',
      'wealth building',
    ],
  },
  {
    id: 'personal',
    titlePrefix: 'Monthly Progress',
    xLabel: 'Month',
    xTicks: [1, 2, 3, 4],
    line: '#CA8A04',
    grid: '#D6D3D1',
    niches: [
      'career growth',
      'confidence and communication',
      'emotional regulation',
      'focus and attention',
      'goal setting',
      'habit building',
      'language learning',
      'life coaching',
      'mindset',
      'organization',
      'productivity',
      'study skills',
      'time management',
    ],
  },
  {
    id: 'services',
    titlePrefix: 'Income Potential',
    xLabel: 'Time',
    xTicks: [0, 1, 2, 3, 4],
    line: '#78716C',
    grid: '#A8A29E',
    niches: [
      'automotive services',
      'cleaning services',
      'construction',
      'event planning',
      'handyman services',
      'home improvement and DIY',
      'hospitality',
      'landscaping',
      'local services',
      'outdoor services',
      'property management',
      'real estate',
    ],
  },
];

function slugify(niche) {
  return String(niche)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[()/]/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

function graphTypeFromPrefix(titlePrefix) {
  return titlePrefix === 'Income Potential' ? 'income-potential' : 'monthly-progress';
}

function titleCaseNiche(niche) {
  return String(niche)
    .split(/\s+/)
    .map((word) => {
      if (/^ui\/ux$/i.test(word)) return 'UI/UX';
      if (/^saas$/i.test(word)) return 'SaaS';
      if (/^pod$/i.test(word)) return 'POD';
      if (/^(ai|api|seo|mlops|devops|hr|ugc|3d|fba)$/i.test(word)) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

function buildJobs() {
  const jobs = [];
  for (const category of CATEGORIES) {
    for (const niche of category.niches) {
      const type = graphTypeFromPrefix(category.titlePrefix);
      const filename = `${slugify(niche)}-${type}.png`;
      jobs.push({
        filename,
        title: `${category.titlePrefix} - ${titleCaseNiche(niche)}`,
        xLabel: category.xLabel,
        xTicks: category.xTicks,
        line: category.line,
        grid: category.grid,
        niche,
        category: category.id,
        graphType: type,
      });
    }
  }
  return jobs;
}

const DRAW_GRAPH_FN = `function drawGraph(spec) {
  const W = 480, H = 320;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, W, H);

  const padL = 78, padR = 28, padT = 48, padB = 58;
  const plotX = padL, plotY = padT;
  const plotW = W - padL - padR, plotH = H - padT - padB;

  // Title (fit long niche names)
  ctx.fillStyle = '#111111';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  let titleSize = 16;
  ctx.font = 'bold ' + titleSize + 'px Arial, Helvetica, sans-serif';
  while (titleSize > 11 && ctx.measureText(spec.title).width > W - 24) {
    titleSize -= 1;
    ctx.font = 'bold ' + titleSize + 'px Arial, Helvetica, sans-serif';
  }
  ctx.fillText(spec.title, W / 2, 22);

  const yTicks = [
    { label: '$0', t: 0 },
    { label: '$500', t: 0.333 },
    { label: '$1,000', t: 0.666 },
    { label: '$2,000+', t: 1 },
  ];

  // Grid
  ctx.strokeStyle = spec.grid;
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  for (const yt of yTicks) {
    const y = plotY + plotH - yt.t * plotH;
    ctx.beginPath();
    ctx.moveTo(plotX, y);
    ctx.lineTo(plotX + plotW, y);
    ctx.stroke();
  }
  for (let i = 0; i < spec.xTicks.length; i++) {
    const x = plotX + (i / (spec.xTicks.length - 1)) * plotW;
    ctx.beginPath();
    ctx.moveTo(x, plotY);
    ctx.lineTo(x, plotY + plotH);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // Axes
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(plotX, plotY);
  ctx.lineTo(plotX, plotY + plotH);
  ctx.lineTo(plotX + plotW, plotY + plotH);
  ctx.stroke();

  // Y ticks + labels
  ctx.fillStyle = '#111111';
  ctx.font = '11px Arial, Helvetica, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (const yt of yTicks) {
    const y = plotY + plotH - yt.t * plotH;
    ctx.beginPath();
    ctx.moveTo(plotX - 5, y);
    ctx.lineTo(plotX, y);
    ctx.stroke();
    ctx.fillText(yt.label, plotX - 8, y);
  }

  // Y axis label
  ctx.save();
  ctx.translate(16, plotY + plotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.font = 'bold 12px Arial, Helvetica, sans-serif';
  ctx.fillText('Income', 0, 0);
  ctx.restore();

  // X ticks + labels
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.font = '11px Arial, Helvetica, sans-serif';
  for (let i = 0; i < spec.xTicks.length; i++) {
    const x = plotX + (i / (spec.xTicks.length - 1)) * plotW;
    ctx.beginPath();
    ctx.moveTo(x, plotY + plotH);
    ctx.lineTo(x, plotY + plotH + 5);
    ctx.stroke();
    ctx.fillText(String(spec.xTicks[i]), x, plotY + plotH + 8);
  }

  // X axis label
  ctx.font = 'bold 12px Arial, Helvetica, sans-serif';
  ctx.fillText(spec.xLabel, plotX + plotW / 2, H - 18);

  // Upward trend (slightly accelerating)
  const points = [];
  const n = spec.xTicks.length;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const value = Math.pow(t, 1.15);
    points.push({
      x: plotX + t * plotW,
      y: plotY + plotH - value * plotH,
    });
  }

  ctx.strokeStyle = spec.line;
  ctx.lineWidth = 3;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();

  // Endpoints
  ctx.fillStyle = spec.line;
  for (const p of [points[0], points[points.length - 1]]) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas.toDataURL('image/png').split(',')[1];
}`;

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const jobs = buildJobs();
  console.log(`Generating ${jobs.length} niche graphs → ${OUT_DIR}`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent('<!DOCTYPE html><html><body></body></html>');
  await page.addScriptTag({ content: DRAW_GRAPH_FN });

  const manifest = [];
  let done = 0;

  for (const job of jobs) {
    const b64 = await page.evaluate((spec) => drawGraph(spec), {
      title: job.title,
      xLabel: job.xLabel,
      xTicks: job.xTicks,
      line: job.line,
      grid: job.grid,
    });
    const outPath = path.join(OUT_DIR, job.filename);
    fs.writeFileSync(outPath, Buffer.from(b64, 'base64'));
    manifest.push({
      niche: job.niche,
      category: job.category,
      filename: job.filename,
      title: job.title,
      graphType: job.graphType,
      path: `assets/graphs/${job.filename}`,
    });
    done += 1;
    if (done % 25 === 0 || done === jobs.length) {
      console.log(`  ${done}/${jobs.length}`);
    }
  }

  await browser.close();

  const manifestPath = path.join(OUT_DIR, 'niche-graph-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify({ generatedAt: new Date().toISOString(), count: manifest.length, graphs: manifest }, null, 2));
  console.log(`Wrote manifest: ${manifestPath}`);

  // Compact JS catalog for runtime niche → filename resolution (Vite-safe).
  const byKey = {};
  for (const entry of manifest) {
    const compact = {
      niche: entry.niche,
      category: entry.category,
      filename: entry.filename,
      graphType: entry.graphType,
    };
    byKey[slugify(entry.niche)] = compact;
    byKey[slugify(entry.filename.replace(/-(monthly-progress|income-potential)\.png$/i, ''))] = compact;
  }
  const catalogPath = path.resolve(__dirname, '../structure/nicheGraphCatalog.js');
  const catalogSource = [
    '/**',
    ' * Auto-generated niche graph catalog. Do not edit by hand.',
    ' * Regenerate via: node pdf-engine/scripts/generate-niche-graphs.mjs',
    ' */',
    '',
    `export const nicheGraphCatalog = ${JSON.stringify({ count: manifest.length, byKey }, null, 2)};`,
    '',
    'export default nicheGraphCatalog;',
    '',
  ].join('\n');
  fs.writeFileSync(catalogPath, catalogSource);
  console.log(`Wrote catalog: ${catalogPath}`);
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
