/**
 * Global structure orchestrator.
 * Accepts sanitized HTML (+ optional cover/metadata options) and returns
 * a full HTML document ready for the PDF renderer.
 *
 * Pipeline position: GENERATE → SANITIZE → STRUCTURE → RENDER
 * Pure assembly — niche-agnostic. Does not modify Focus or sanitize logic.
 */

import brandingConfig, { PDF_LOGO_PUBLIC_URL } from '../brandingConfig.js';
import { enforceHeadings, extractTitleAndBody, stripTags } from './enforceHeadings.js';
import { enforcePageBreaks, PAGE_BREAK_HTML } from './enforcePageBreaks.js';
import { repairBlockStructure } from './repairBlockStructure.js';
import { assignHeadingAnchors, buildTOC } from './buildTOC.js';
import { buildCover } from './buildCover.js';
import { insertCockpitGraphs } from './insertCockpitGraphs.js';
import { enforceMargins, getStructureCss } from './enforceMargins.js';
import {
  buildHeadMetadata,
  mergeMetadata,
} from './metadata.js';

const DEFAULT_LOGO = brandingConfig.logo || PDF_LOGO_PUBLIC_URL;

/**
 * Detect an authored cover block or cover image in sanitized HTML.
 * @param {string} html
 * @returns {{ coverHtml: string, coverImageUrl: string, remainder: string }}
 */
function extractExistingCover(html) {
  const source = String(html ?? '');

  const coverBlock = source.match(
    /<header\b[^>]*class\s*=\s*["'][^"']*\bpdf-cover\b[^"']*["'][^>]*>[\s\S]*?<\/header\s*>/i
  );
  if (coverBlock) {
    const remainder = source.replace(coverBlock[0], '').trim();
    return { coverHtml: coverBlock[0], coverImageUrl: '', remainder };
  }

  const coverImg = source.match(
    /<img\b[^>]*class\s*=\s*["'][^"']*\bpdf-cover-image\b[^"']*["'][^>]*>/i
  );
  if (coverImg) {
    const srcMatch = coverImg[0].match(/\bsrc\s*=\s*["']([^"']+)["']/i);
    const remainder = source.replace(coverImg[0], '').trim();
    return {
      coverHtml: '',
      coverImageUrl: srcMatch ? srcMatch[1] : '',
      remainder,
    };
  }

  return { coverHtml: '', coverImageUrl: '', remainder: source };
}

/**
 * @typedef {import('./metadata.js').StructureMetadata} StructureMetadata
 *
 * @typedef {{
 *   title?: string,
 *   subtitle?: string,
 *   generatedAt?: Date|string|number,
 *   brand?: string,
 *   author?: string,
 *   logoUrl?: string | null,
 *   coverImageUrl?: string,
 *   coverHtml?: string,
 *   niche?: string,
 *   nicheName?: string,
 *   nicheId?: string,
 *   metadata?: StructureMetadata,
 *   includeMetadataBlock?: boolean,
 *   includeLogo?: boolean,
 * }} StructureOptions
 *
 * @typedef {{
 *   html: string,
 *   schema: {
 *     title: string,
 *     subtitle: string,
 *     sections: Array<{ heading: string, body: string, id?: string }>,
 *     metadata: StructureMetadata,
 *     toc: Array<{ id: string, title: string }>,
 *   }
 * }} StructureResult
 */

/**
 * Best-effort pull of description/keywords from sanitized HTML SEO blocks.
 * @param {string} html
 * @returns {StructureMetadata}
 */
function extractLooseMetadata(html) {
  const source = String(html ?? '');
  const descriptionMatch = source.match(/Description:\s*<\/strong>\s*([^<]+)/i)
    || source.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  const keywordsMatch = source.match(/Keywords:\s*<\/strong>\s*([^<]+)/i)
    || source.match(/<meta\s+name=["']keywords["']\s+content=["']([^"']+)["']/i);
  const altMatch = source.match(/Image alt text:\s*<\/strong>\s*([^<]+)/i)
    || source.match(/<meta\s+name=["']image-alt["']\s+content=["']([^"']+)["']/i);
  const titleMatch = source.match(/<strong>Title:<\/strong>\s*([^<]+)/i);

  return {
    title: titleMatch ? stripTags(titleMatch[1]) : '',
    description: descriptionMatch ? stripTags(descriptionMatch[1]) : '',
    keywords: keywordsMatch
      ? stripTags(keywordsMatch[1]).split(/[,;]/).map((k) => k.trim()).filter(Boolean)
      : [],
    imageAlt: altMatch ? stripTags(altMatch[1]) : '',
  };
}

/**
 * Apply the global structure layer to sanitized content.
 * @param {string} sanitizedHtml
 * @param {StructureOptions} [options]
 * @returns {StructureResult}
 */
export function applyStructure(sanitizedHtml, options = {}) {
  const source = String(sanitizedHtml ?? '');
  const existing = extractExistingCover(source);
  const extracted = extractTitleAndBody(existing.remainder || source);

  const title = String(options.title || extracted.title || 'My Operating Manual').trim();
  const subtitle = String(options.subtitle || '').trim();
  const brand = String(options.brand || options.author || 'My Operating Manual').trim();
  const includeLogo = options.includeLogo !== false;
  const logoUrl = options.logoUrl === null
    ? ''
    : String(options.logoUrl || (includeLogo ? DEFAULT_LOGO : '')).trim();
  const coverImageUrl = String(
    options.coverImageUrl || existing.coverImageUrl || ''
  ).trim();
  const coverHtmlOpt = String(options.coverHtml || existing.coverHtml || '').trim();

  // Repair invalid <p>-wrapped blocks from upstream sanitize before structuring.
  let bodyHtml = repairBlockStructure(extracted.bodyHtml);
  bodyHtml = enforceHeadings(bodyHtml);
  bodyHtml = repairBlockStructure(bodyHtml);

  const looseMeta = extractLooseMetadata(source);
  const metadata = mergeMetadata(
    { ...looseMeta, title: looseMeta.title || title },
    options.metadata || {}
  );
  if (!metadata.title) metadata.title = title;

  // REMOVED: SEO Metadata block generation
  // Operating Manual PDFs store metadata in <head> tags only (not visible in body)

  // Static niche graphs: each section starts the image on a fresh page.
  const nicheOptions = {
    niche: options.niche || options.nicheName || options.nicheId || '',
    nicheName: options.nicheName || options.niche || '',
    nicheId: options.nicheId || '',
  };
  // Deprecated: insertAdvancedTipsGraph and insertRealWorldScenariosGraph removed
  // Operating Manual uses only inline SVG cockpit graphs
  bodyHtml = insertCockpitGraphs(bodyHtml);

  const anchored = assignHeadingAnchors(bodyHtml);
  bodyHtml = enforcePageBreaks(anchored.html);
  bodyHtml = repairBlockStructure(bodyHtml);

  // Re-assert standalone page-break + h2 pairs (never inside <p>).
  bodyHtml = bodyHtml.replace(
    /<p\b[^>]*>\s*(<div class="page-break"><\/div>)\s*(<h2\b[\s\S]*?<\/h2>)\s*<\/p>/gi,
    '$1\n$2'
  );
  bodyHtml = bodyHtml.replace(
    /<p\b[^>]*>\s*(<div class="page-break"><\/div>)\s*<\/p>\s*(<h2\b)/gi,
    '$1\n$2'
  );

  // Cover is Page 1 — never regenerate over an uploaded/authored cover.
  const coverHtml = buildCover({
    title,
    subtitle,
    brand,
    logoUrl: (coverHtmlOpt || coverImageUrl) ? '' : logoUrl,
    coverImageUrl,
    coverHtml: coverHtmlOpt,
    generatedAt: options.generatedAt,
    profilePhoto: options.profilePhoto || null,
  });

  // TOC is Page 2.
  const tocHtml = buildTOC(anchored.entries);

  const bodyParts = [];
  if (tocHtml) {
    bodyParts.push(tocHtml);
    bodyParts.push(PAGE_BREAK_HTML);
  }
  bodyParts.push(bodyHtml);

  const composed = [
    coverHtml,
    bodyParts.join('\n'),
  ].join('\n');

  const breakEsc = PAGE_BREAK_HTML.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  let cleaned = composed.replace(
    new RegExp(`${breakEsc}\\s*${breakEsc}`, 'gi'),
    PAGE_BREAK_HTML
  );
  cleaned = repairBlockStructure(cleaned);

  const margined = enforceMargins(cleaned);
  const headMeta = buildHeadMetadata(metadata);
  const css = getStructureCss();

  const html = [
    '<!DOCTYPE html>',
    '<html>',
    '<head>',
    headMeta,
    css,
    '</head>',
    '<body>',
    margined,
    '</body>',
    '</html>',
  ].join('\n');

  const schema = {
    title,
    subtitle,
    sections: anchored.entries.map((entry) => ({
      id: entry.id,
      heading: entry.title,
      body: '',
    })),
    metadata,
    toc: anchored.entries,
  };

  return { html, schema };
}

export default applyStructure;
