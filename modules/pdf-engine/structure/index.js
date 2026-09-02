/**
 * Global PDF structure layer — universal layout for all niches / clients.
 * Used by in-app generator and DEOS via the same applyStructure() API.
 * 
 * DEPRECATED EXPORTS REMOVED: Money Maker graph system functions are no longer exported.
 * The Operating Manual system uses only inline SVG cockpit graphs.
 * @see insertCockpitGraphs
 */

export { applyStructure } from './applyStructure.js';
export { buildTOC, assignHeadingAnchors, slugifyHeading } from './buildTOC.js';
export { buildCover } from './buildCover.js';
export { enforceHeadings, extractTitleAndBody } from './enforceHeadings.js';
export { enforcePageBreaks, PAGE_BREAK_HTML } from './enforcePageBreaks.js';
export { repairBlockStructure } from './repairBlockStructure.js';
export { renderImageBlock } from './renderImageBlock.js';
export { enforceMargins, getStructureCss } from './enforceMargins.js';
export {
  buildHeadMetadata,
  mergeMetadata,
} from './metadata.js';

export { applyStructure as default } from './applyStructure.js';
