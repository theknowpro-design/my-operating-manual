/**
 * Global margin + structure CSS wrapper.
 * @page { margin: 1in 0.75in; } — top/bottom 1in, left/right 0.75in.
 * Pure — niche-agnostic.
 */

import brandingConfig from '../brandingConfig.js';
import layoutConfig from '../layoutConfig.js';

/**
 * Structure-layer CSS: margins, type scale, TOC, cover, page breaks.
 * No display:flex / overflow:hidden on parents (breaks CSS page breaks).
 * @returns {string}
 */
export function getStructureCss() {
  const coverLogoWidth = Number(brandingConfig.logoWidth || brandingConfig.coverLogoWidth) || 120;
  const coverPaddingTop = Number(layoutConfig.cover?.paddingTop) || 48;
  const coverPaddingBottom = Number(layoutConfig.cover?.paddingBottom) || 16;
  const coverImageMaxHeight = Number(layoutConfig.cover?.imageMaxHeight) || 786;
  const chartMinHeight = Number(layoutConfig.chart?.minHeight) || 260;
  const chartPaddingTop = Math.max(12, Number(layoutConfig.chart?.paddingTop) || 12);
  const chartPaddingBottom = Math.max(12, Number(layoutConfig.chart?.paddingBottom) || 12);
  const staticImageMaxHeight = Number(layoutConfig.chart?.staticImageMaxHeight) || 216;
  const staticImageMinHeight = Number(layoutConfig.chart?.staticImageMinHeight) || 240;

  return `<style>
/* Enforce printable margins; overrides inherited DOCX/HTML spacing */
@page {
  margin: 1in 0.75in;
}
html, body {
  margin: 0 !important;
  padding: 0 !important;
  background: #ffffff;
}
body {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #222222;
  box-sizing: border-box;
  /* Never flex/overflow-hidden — those defeat break-before:page */
  display: block;
  overflow: visible;
}
.pdf-structure {
  width: 100%;
  max-width: 6.5in; /* 8.5in - 0.75in - 0.75in */
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
  display: block;
  overflow: visible;
}
.pdf-page {
  display: block;
  overflow: visible;
  box-sizing: border-box;
  width: 100%;
  /* First line of content respects top margin via @page + render insets */
  padding: 0;
  margin: 0;
}
.pdf-cover {
  text-align: center;
  padding: ${coverPaddingTop}px 0 ${coverPaddingBottom}px;
  margin: 0;
  display: block;
  overflow: visible;
  box-sizing: border-box;
}
.pdf-cover-image-only {
  padding: 0 0 ${coverPaddingBottom}px;
  margin: 0;
}
.pdf-cover-image {
  width: 100%;
  max-width: 100%;
  max-height: ${coverImageMaxHeight}px;
  height: auto;
  object-fit: contain;
  display: block;
  margin: 0 auto;
}
.pdf-cover-logo-wrap,
.pdf-cover-logo-wrap--top-center {
  line-height: 0;
  text-align: center;
  display: block;
  margin: 0 auto 24px auto;
}
.pdf-cover-logo {
  width: ${coverLogoWidth}px;
  max-width: 100%;
  height: auto;
  object-fit: contain;
  display: block;
  margin: 0 auto;
}
.pdf-cover-title {
  font-size: 28px;
  font-weight: bold;
  line-height: 1.3;
  margin: 0 0 16px 0;
  text-align: center;
}
.pdf-cover-subtitle {
  font-size: 16px;
  line-height: 1.5;
  margin: 0 0 12px 0;
  color: #444444;
}
.pdf-cover-generated {
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 12px 0;
  color: #555555;
  text-align: center;
}
.pdf-cover-brand {
  font-size: 14px;
  margin: 24px 0 0 0;
  color: #555555;
}
.pdf-toc {
  margin: 0 0 24px 0;
  display: block;
  overflow: visible;
}
.pdf-toc-title {
  font-size: 22px;
  font-weight: bold;
  margin: 0 0 16px 0;
}
.pdf-toc-list {
  margin: 0;
  padding: 0 0 0 22px;
}
.pdf-toc-item {
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 8px 0;
}
.pdf-toc-link {
  color: #1a2f4a;
  text-decoration: underline;
  cursor: pointer;
}
h1 {
  font-size: 28px;
  font-weight: bold;
  line-height: 1.3;
  margin: 0 0 20px 0;
}
/* Every H2 starts on a new page (class + element for DOCX/HTML class leakage) */
h2,
.h2 {
  font-size: 22px;
  font-weight: bold;
  line-height: 1.35;
  margin: 0 0 15px 0;
  page-break-before: always;
  break-before: page;
  page-break-after: avoid;
  break-after: avoid-page;
  display: block;
  overflow: visible;
}
/* Cover / TOC first headings must not force an extra blank page */
.pdf-cover h1,
.pdf-toc-title {
  break-before: auto;
  page-break-before: auto;
}
p {
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 12px 0;
  orphans: 3;
  widows: 3;
}
.pdf-subsection {
  font-size: 17px;
  line-height: 1.4;
  margin: 18px 0 10px 0;
  page-break-after: avoid;
}
.pdf-subsection strong {
  font-size: 17px;
  font-weight: bold;
}
ul, ol {
  margin: 0 0 12px 0;
  padding: 0 0 0 22px;
}
li {
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 6px 0;
  orphans: 3;
  widows: 3;
}
.page-break {
  page-break-before: always;
  break-before: page;
  display: block;
  height: 0;
  margin: 0;
  padding: 0;
  border: 0;
  overflow: visible;
}
.pdf-income-graph,
.pdf-monthly-progress-graph {
  margin: 0;
  padding: 0;
  text-align: center;
  display: block;
  overflow: visible;
  box-sizing: border-box;
  page-break-inside: avoid;
  break-inside: avoid-page;
}
.pdf-chart-container,
.chart-container,
.chart-wrapper {
  min-height: ${chartMinHeight}px;
  padding-top: ${chartPaddingTop}px;
  padding-bottom: ${chartPaddingBottom}px;
  margin: 0 0 24px;
  overflow: visible !important;
  box-sizing: border-box;
  font-family: Arial, Helvetica, sans-serif;
  color: #000000;
}
.pdf-chart-container canvas,
.chart-container canvas,
.chart-wrapper canvas {
  display: block;
  max-width: 100%;
  margin: 0 auto;
}
.pdf-image-block {
  width: 100%;
  min-height: ${staticImageMinHeight}px;
  padding-top: ${chartPaddingTop}px;
  padding-bottom: ${chartPaddingBottom}px;
  margin: 0;
  overflow: visible;
  box-sizing: border-box;
  page-break-inside: avoid;
  break-inside: avoid-page;
}
.pdf-image-block-img {
  width: auto;
  max-width: 100%;
  max-height: ${staticImageMaxHeight}px;
  height: auto;
  margin: 0 auto;
  display: block;
  object-fit: contain;
}
.pdf-chart-image {
  width: 100%;
  max-width: 600px;
  height: auto;
  margin: 0 auto;
  display: block;
  overflow: visible;
}
.pdf-metadata {
  margin-top: 12px;
}
</style>`;
}

/**
 * Wrap body HTML in the global margin container.
 * @param {string} innerHtml
 * @returns {string}
 */
export function enforceMargins(innerHtml) {
  return `<div class="pdf-structure">\n${String(innerHtml ?? '').trim()}\n</div>`;
}

export default enforceMargins;
