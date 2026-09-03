/**
 * Global TOC builder — H2 sections only, anchor-linked.
 * Pure — niche-agnostic.
 */

import { stripTags, escapeHtml } from './enforceHeadings.js';

/**
 * @typedef {{ id: string, title: string }} TocEntry
 */

/**
 * Slugify a heading into a stable anchor id.
 * @param {string} text
 * @param {number} index
 * @returns {string}
 */
export function slugifyHeading(text, index = 0) {
  const base = String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return base ? `section-${base}` : `section-${index + 1}`;
}

/**
 * Collect H2 entries and ensure each H2 has an id attribute.
 * @param {string} html
 * @returns {{ html: string, entries: TocEntry[] }}
 */
export function assignHeadingAnchors(html) {
  const entries = [];
  const used = new Set();

  const nextHtml = String(html ?? '').replace(
    /<h2(?:\s[^>]*)?>([\s\S]*?)<\/h2\s*>/gi,
    (_match, inner) => {
      const title = stripTags(inner);
      if (!title) return _match;

      let id = slugifyHeading(title, entries.length);
      if (used.has(id)) id = `${id}-${entries.length + 1}`;
      used.add(id);
      entries.push({ id, title });
      // class="h2" enables `.h2 { break-before: page; }` even when DOCX leaks classes
      return `<h2 id="${id}" class="h2">${inner}</h2>`;
    }
  );

  return { html: nextHtml, entries };
}

/**
 * Build TOC HTML from H2 entries (H2 only — never H1 or subsections).
 * TOC title is NOT an H2 so it cannot enter the TOC or steal heading rank.
 * @param {TocEntry[]} entries
 * @returns {string}
 */
export function buildTOC(entries = []) {
  const list = Array.isArray(entries) ? entries.filter((e) => e && e.id && e.title) : [];
  if (!list.length) return '';

  const items = list
    .map(
      (entry) =>
        `<li class="pdf-toc-item"><a class="pdf-toc-link" href="#${escapeHtml(entry.id)}">${escapeHtml(entry.title)}</a></li>`
    )
    .join('\n');

  // TOC is always Page 2 (cover ends with a page-break before this block).
  return [
    '<nav class="pdf-toc" id="pdf-toc" aria-label="Table of contents" data-pdf-page="toc">',
    '<p class="pdf-toc-title"><strong>Table of Contents</strong></p>',
    '<ol class="pdf-toc-list">',
    items,
    '</ol>',
    '</nav>',
  ].join('\n');
}

export default buildTOC;
