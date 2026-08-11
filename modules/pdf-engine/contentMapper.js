/**
 * @deprecated LEGACY — Phase P2 unified PDF core.
 *
 * Do NOT use for new App / DEOS / stand-alone generation.
 * Use instead:
 *   import { generatePdf } from '@/modules/pdf-engine/pipeline/index.js'
 *
 * Flow: GENERATE → SANITIZE → STRUCTURE → RENDER
 *
 * Content mapping for the business-plan schema is replaced by
 * structure/applyStructure + SECTION_DEFINITIONS long-form HTML.
 */

/**
 * Content Mapper — maps Money Maker App outputs or user-provided text
 * into business-class PDF section blocks.
 */

function asText(value) {
  if (value == null) return '';
  if (typeof value === 'string') return value.trim();
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item.trim() : String(item ?? '').trim()))
      .filter(Boolean)
      .join('\n');
  }
  if (typeof value === 'object') {
    return Object.entries(value)
      .map(([key, val]) => `${key}: ${asText(val)}`)
      .filter((line) => !line.endsWith(': '))
      .join('\n');
  }
  return String(value).trim();
}

function pick(data, ...keys) {
  if (!data || typeof data !== 'object') return '';
  for (const key of keys) {
    if (data[key] != null && String(data[key]).trim() !== '') {
      return asText(data[key]);
    }
  }
  return '';
}

function paragraphs(...blocks) {
  return blocks
    .map((block) => asText(block))
    .filter(Boolean)
    .join('\n\n');
}

function bulletList(items, fallbackLabel = 'Item') {
  if (!items) return '';
  const list = Array.isArray(items) ? items : [items];
  return list
    .map((item, index) => {
      const text = asText(item);
      if (!text) return '';
      return `• ${text.startsWith('•') ? text.slice(1).trim() : text}`;
    })
    .filter(Boolean)
    .join('\n') || `• ${fallbackLabel} details will appear once generation is complete.`;
}

/**
 * Resolve shared fields from Money Maker generation results or plain objects.
 * @param {object} data
 */
function resolveContext(data = {}) {
  const method = data.method || {};
  const formatted = data.formatted || {};
  const content = data.content && typeof data.content === 'object' ? data.content : {};
  const generationPayload = data.generationPayload && typeof data.generationPayload === 'object'
    ? data.generationPayload
    : {};
  const payloadNiche = generationPayload.niche || {};
  const payloadCategory = generationPayload.category || {};
  const payloadFocus = generationPayload.focus || {};

  return {
    raw: data,
    method: data.method || data,
    formatted,
    content,
    title: pick(data, 'title', 'exportTitle')
      || pick(method, 'title')
      || 'Profit Engine Plan',
    subtitle: pick(data, 'subtitle') || '',
    niche: pick(data, 'niche', 'nicheName')
      || pick(method, 'nicheDisplayName', 'nicheName')
      || pick(payloadNiche, 'label', 'name')
      || '',
    category: pick(data, 'category', 'categoryName')
      || pick(method, 'categoryDisplayName', 'categoryName')
      || pick(payloadCategory, 'label', 'name')
      || '',
    focus: pick(method, 'userGoal')
      || pick(data, 'goal', 'focus', 'customText')
      || pick(payloadFocus, 'customText')
      || '',
    offer: pick(method, 'offer') || pick(data, 'offer'),
    pricing: pick(method, 'pricing') || pick(content, 'pricingModel') || pick(data, 'pricing'),
    funnel: pick(method, 'funnel') || pick(data, 'funnel'),
    actionPlan: pick(content, 'actionPlan') || pick(method, 'actionPlan') || pick(data, 'actionPlan'),
    tools: pick(method, 'tools') || pick(data, 'tools'),
    expansion: pick(method, 'expansionPlan') || asText(data.expansion),
    profitEngine: pick(method, 'profitEngineOutput'),
    problem: pick(method, 'problem'),
    solution: pick(method, 'solution'),
    audience: pick(method, 'audienceStatement', 'audience'),
    bonus: pick(method, 'bonus'),
    profitPaths: method.profitPaths || data.profitPaths || null,
    longForm: formatted.longForm || data.longForm || null,
    plainText: pick(formatted, 'text', 'document') || pick(data, 'text'),
    sectionOverrides: content,
  };
}

/**
 * @param {object} data
 * @returns {string}
 */
export function mapExecutiveSummary(data) {
  const ctx = resolveContext(data);
  const override = pick(ctx.sectionOverrides, 'executiveSummary');
  if (override) return override;

  const longFormSummary = ctx.longForm?.sections?.executiveSummary?.text;
  if (longFormSummary) return asText(longFormSummary);

  return paragraphs(
    ctx.profitEngine,
    ctx.offer
      ? `Core offer: ${ctx.offer}`
      : 'This plan outlines a clear, practical path from idea to income in the selected niche and category.',
    ctx.focus ? `Focus: ${ctx.focus}` : '',
    [ctx.niche, ctx.category].filter(Boolean).length
      ? `Context: ${[ctx.niche, ctx.category].filter(Boolean).join(' · ')}`
      : ''
  );
}

function sectionOverride(data, key) {
  const ctx = resolveContext(data);
  return pick(ctx.sectionOverrides, key);
}

/**
 * @param {object} data
 * @returns {string}
 */
export function mapBusinessModel(data) {
  const override = sectionOverride(data, 'businessModel');
  if (override) return override;
  const ctx = resolveContext(data);
  return paragraphs(
    ctx.solution || 'A focused delivery model built around one clear customer outcome.',
    ctx.audience ? `Primary audience: ${ctx.audience}` : '',
    ctx.problem ? `Core problem addressed: ${ctx.problem}` : '',
    ctx.method?.methodStatement
      ? `Method: ${asText(ctx.method.methodStatement)}`
      : ''
  );
}

/**
 * @param {object} data
 * @returns {string}
 */
export function mapRevenueStreams(data) {
  const override = sectionOverride(data, 'revenueStreams');
  if (override) return override;
  const ctx = resolveContext(data);
  const paths = ctx.profitPaths;
  if (paths && typeof paths === 'object') {
    return paragraphs(
      paths.quickWin ? `Quick Win\n${asText(paths.quickWin)}` : '',
      paths.premium ? `Premium Path\n${asText(paths.premium)}` : '',
      paths.recurring ? `Recurring Revenue\n${asText(paths.recurring)}` : ''
    );
  }

  return paragraphs(
    ctx.offer ? `Primary revenue stream: ${ctx.offer}` : '',
    ctx.bonus ? `Supporting bonus/value add: ${ctx.bonus}` : '',
    'Additional streams can be layered once the first paid offer is delivering consistently.'
  );
}

/**
 * @param {object} data
 * @returns {string}
 */
export function mapGrowthStrategy(data) {
  const override = sectionOverride(data, 'growthStrategy');
  if (override) return override;
  const ctx = resolveContext(data);
  return paragraphs(
    ctx.expansion || 'Grow by repeating what works, documenting delivery, and expanding only after the core offer is stable.',
    ctx.funnel ? `Expansion support funnel: ${ctx.funnel}` : ''
  );
}

/**
 * @param {object} data
 * @returns {string}
 */
export function mapMarketingStrategy(data) {
  const override = sectionOverride(data, 'marketingStrategy');
  if (override) return override;
  const ctx = resolveContext(data);
  return paragraphs(
    ctx.funnel || 'Lead with a clear offer, one primary channel, and honest conversations with people who match the niche.',
    ctx.method?.channel ? `Primary distribution channel: ${asText(ctx.method.channel)}` : '',
    ctx.method?.hook ? `Opening hook: ${asText(ctx.method.hook)}` : ''
  );
}

/**
 * @param {object} data
 * @returns {string}
 */
export function mapPricingModel(data) {
  const override = sectionOverride(data, 'pricingModel');
  if (override) return override;
  const ctx = resolveContext(data);
  const range = ctx.method?.revenueRange || data.revenueRange;
  return paragraphs(
    ctx.pricing || 'Price for clarity and completion: start with a focused range that matches the deliverable.',
    range
      ? `Revenue framing: ${asText(range.base || range)}`
      : ctx.method?.revenueEstimate
        ? `Estimated early revenue framing: ${asText(ctx.method.revenueEstimate)}`
        : ''
  );
}

/**
 * @param {object} data
 * @returns {string}
 */
export function mapActionPlan(data) {
  const override = sectionOverride(data, 'actionPlan');
  if (override) return override;
  const ctx = resolveContext(data);
  if (ctx.actionPlan) return asText(ctx.actionPlan);

  const steps = ctx.method?.steps;
  if (Array.isArray(steps) && steps.length) {
    return steps
      .map((step, index) => {
        const title = asText(step.title) || `Step ${index + 1}`;
        const description = asText(step.description);
        return `${index + 1}. ${title}${description ? `\n${description}` : ''}`;
      })
      .join('\n\n');
  }

  return paragraphs(
    '1. Define one outcome and write a plain offer description.',
    '2. Build the minimum deliverable.',
    '3. Publish in one channel and invite five clarifying conversations.',
    '4. Deliver, collect feedback, and refine once before expanding.'
  );
}

/**
 * @param {object} data
 * @returns {string}
 */
export function mapOperationalNotes(data) {
  const override = sectionOverride(data, 'operationalNotes');
  if (override) return override;
  const ctx = resolveContext(data);
  return paragraphs(
    ctx.tools || 'Use simple, reliable tools you already know. Avoid adding systems until the first delivery cycle is complete.',
    ctx.method?.proTip ? `Pro tip: ${asText(ctx.method.proTip)}` : '',
    ctx.method?.successMetric
      ? `Success metric: ${asText(ctx.method.successMetric)}`
      : 'Success metric: complete one delivery cycle and gather specific buyer feedback.'
  );
}

/**
 * @param {object} data
 * @returns {string}
 */
export function mapDigitalVisibility(data) {
  const override = sectionOverride(data, 'digitalVisibility');
  if (override) return override;
  const ctx = resolveContext(data);
  const longFormSeo = ctx.longForm?.sections?.seo?.text;
  if (longFormSeo) return asText(longFormSeo);

  return paragraphs(
    ctx.funnel
      ? `Visibility path: ${ctx.funnel}`
      : 'Build calm digital visibility through one consistent channel, clear offer language, and useful proof of delivery.',
    ctx.method?.channel
      ? `Channel focus: ${asText(ctx.method.channel)}`
      : 'Prefer one owned or high-trust channel before expanding into multi-platform distribution.',
    'Publish practical artifacts (checklists, samples, short walkthroughs) that make the offer easy to understand.'
  );
}

/**
 * @param {object} data
 * @returns {string}
 */
export function mapMetadata(data) {
  const override = sectionOverride(data, 'metadata');
  if (override) return override;
  const ctx = resolveContext(data);
  const generatedAt = pick(data.meta, 'generatedAt')
    || pick(ctx.method, 'createdAt')
    || new Date().toISOString();
  const lines = [
    `Title: ${ctx.title}`,
    ctx.niche ? `Niche: ${ctx.niche}` : '',
    ctx.category ? `Category: ${ctx.category}` : '',
    ctx.focus ? `Focus: ${ctx.focus}` : '',
    `Generated: ${generatedAt}`,
    `Engine: Profit Engine AI PDF Generator`,
    pick(ctx.method, 'templateId', 'planTemplateId')
      ? `Template: ${pick(ctx.method, 'planTemplateId', 'templateId')}`
      : '',
  ];
  return lines.filter(Boolean).join('\n');
}

/**
 * Map optional appendices from generation output.
 * @param {object} data
 * @returns {string}
 */
export function mapAppendices(data) {
  const ctx = resolveContext(data);
  const extras = [];

  if (ctx.bonus) extras.push(`Bonus\n${ctx.bonus}`);
  if (ctx.method?.timeBlocks) {
    extras.push(
      `Time Blocks\n${bulletList(
        (ctx.method.timeBlocks || []).map(
          (block) => `${asText(block.label) || `${block.minutes} min`}: ${asText(block.action)}`
        )
      )}`
    );
  }
  if (data.appendices) extras.push(asText(data.appendices));

  return paragraphs(...extras);
}

/**
 * Build the full ordered content map for PDF rendering.
 * @param {object} data
 * @returns {{ title: string, subtitle: string, sections: Array<{ id: string, title: string, body: string }> }}
 */
export function mapAllSections(data = {}) {
  const ctx = resolveContext(data);
  const subtitleParts = [ctx.niche, ctx.category].filter(Boolean);

  return {
    title: ctx.title || 'Profit Engine Plan',
    subtitle: ctx.subtitle || subtitleParts.join(' · ') || 'Profit Engine AI Plan',
    focus: ctx.focus,
    sections: [
      { id: 'executiveSummary', title: 'Executive Summary', body: mapExecutiveSummary(data) },
      { id: 'businessModel', title: 'Business Model', body: mapBusinessModel(data) },
      { id: 'revenueStreams', title: 'Revenue Streams', body: mapRevenueStreams(data) },
      { id: 'growthStrategy', title: 'Growth Strategy', body: mapGrowthStrategy(data) },
      { id: 'marketingStrategy', title: 'Marketing Strategy', body: mapMarketingStrategy(data) },
      { id: 'pricingModel', title: 'Pricing Model', body: mapPricingModel(data) },
      { id: 'actionPlan', title: 'Action Plan', body: mapActionPlan(data) },
      { id: 'operationalNotes', title: 'Operational Notes', body: mapOperationalNotes(data) },
      { id: 'digitalVisibilityStrategy', title: 'Digital Visibility Strategy', body: mapDigitalVisibility(data) },
      { id: 'metadata', title: 'Metadata', body: mapMetadata(data) },
      { id: 'appendices', title: 'Appendices', body: mapAppendices(data) },
    ].filter((section) => section.body),
  };
}

export default {
  mapExecutiveSummary,
  mapBusinessModel,
  mapRevenueStreams,
  mapGrowthStrategy,
  mapMarketingStrategy,
  mapPricingModel,
  mapActionPlan,
  mapOperationalNotes,
  mapDigitalVisibility,
  mapMetadata,
  mapAppendices,
  mapAllSections,
};
