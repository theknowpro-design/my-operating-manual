/**
 * Pure static-image block for structured PDF sections.
 * Keeps one labeled image atomic so the renderer cannot split it across pages.
 */

import { escapeHtml } from './enforceHeadings.js';

/**
 * @typedef {{
 *   src: string,
 *   alt?: string,
 *   width?: string,
 *   maxHeight?: number,
 *   minHeight?: number,
 *   maintainAspectRatio?: boolean,
 *   preventPageBreak?: boolean,
 * }} ImageBlockOptions
 */

/**
 * Resolve public PDF asset paths from structure-relative asset references.
 * @param {string} src
 * @returns {string}
 */
function resolveImageSrc(src) {
  const value = String(src || '').trim();
  if (value.startsWith('assets/')) return `/modules/pdf-engine/${value}`;
  return value;
}

/**
 * Render a static image and its unbreakable container.
 * @param {ImageBlockOptions} options
 * @returns {string}
 */
export function renderImageBlock(options) {
  const src = resolveImageSrc(options?.src);
  if (!src) return '';

  const width = String(options?.width || '100%');
  const maxHeight = Math.max(1, Number(options?.maxHeight) || 320);
  const minHeight = Math.max(1, Number(options?.minHeight) || 240);
  const maintainAspectRatio = options?.maintainAspectRatio !== false;
  const preventPageBreak = options?.preventPageBreak !== false;
  const breakStyle = preventPageBreak
    ? 'page-break-inside: avoid; break-inside: avoid;'
    : '';
  const imageSize = maintainAspectRatio
    ? `width: auto; max-width: ${escapeHtml(width)}; height: auto;`
    : `width: ${escapeHtml(width)};`;

  return [
    `<div class="pdf-image-block" data-page-break-inside="${preventPageBreak ? 'avoid' : 'auto'}" data-avoid-page-break="${preventPageBreak ? 'true' : 'false'}" style="${breakStyle} min-height: ${minHeight}px;">`,
    `<img class="pdf-image-block-img" src="${escapeHtml(src)}" alt="${escapeHtml(options?.alt || 'Static graph')}" style="${imageSize} max-height: ${maxHeight}px; object-fit: contain;" />`,
    '</div>',
  ].join('\n');
}

export default renderImageBlock;
