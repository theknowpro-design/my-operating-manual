/**
 * Global PDF structure layer — universal layout for all niches / clients.
 * Used by in-app generator and DEOS via the same applyStructure() API.
 */

export { applyStructure } from './applyStructure.js';
export { buildTOC, assignHeadingAnchors, slugifyHeading } from './buildTOC.js';
export { buildCover } from './buildCover.js';
export { enforceHeadings, extractTitleAndBody } from './enforceHeadings.js';
export { enforcePageBreaks, PAGE_BREAK_HTML } from './enforcePageBreaks.js';
export { repairBlockStructure } from './repairBlockStructure.js';
export { buildIncomeGraphSection, insertIncomeGraphBeforeActionPlan } from './buildIncomeGraph.js';
export { insertAdvancedTipsGraph } from './advancedTips.js';
export { insertRealWorldScenariosGraph } from './realWorldScenarios.js';
export { renderImageBlock } from './renderImageBlock.js';
export {
  resolveNicheGraphSrc,
  resolveNicheGraphEntry,
  normalizeNicheKey,
} from './resolveNicheGraph.js';
export { enforceMargins, getStructureCss } from './enforceMargins.js';
export {
  buildHeadMetadata,
  buildMetadataBlock,
  mergeMetadata,
} from './metadata.js';

export { applyStructure as default } from './applyStructure.js';
