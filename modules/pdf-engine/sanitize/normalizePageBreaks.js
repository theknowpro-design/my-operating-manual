/**
 * Normalize page-break markers into a single canonical div.
 * Pure — no DOM, jsPDF, or html2canvas.
 */

import { PAGE_BREAK_PLACEHOLDER } from './sanitizeHtml.js';

export const PAGE_BREAK_HTML = '<div class="page-break"></div>';

/**
 * Convert any page-break marker form into <div class="page-break"></div>.
 * Pulls breaks out of headings/paragraphs so they sit between sections.
 * @param {string} html
 * @returns {string}
 */
export function normalizePageBreaks(html) {
  let out = String(html ?? '');

  // Canonicalize known markers → placeholder.
  out = out.replace(/<!--\s*PageBreak\s*-->/gi, PAGE_BREAK_PLACEHOLDER);
  out = out.replace(
    /<div\b[^>]*class\s*=\s*["'][^"']*\bpage-break\b[^"']*["'][^>]*>\s*<\/div\s*>/gi,
    PAGE_BREAK_PLACEHOLDER
  );
  out = out.replace(/<hr\b[^>]*class\s*=\s*["'][^"']*\bpage-break\b[^"']*["'][^>]*\/?>/gi, PAGE_BREAK_PLACEHOLDER);
  out = out.replace(/\[\s*page\s*[-_ ]?\s*break\s*\]/gi, PAGE_BREAK_PLACEHOLDER);
  out = out.replace(/\bPAGE[_\s-]?BREAK\b/gi, PAGE_BREAK_PLACEHOLDER);

  // Collapse adjacent placeholders.
  out = out.replace(new RegExp(`(?:\\s*${PAGE_BREAK_PLACEHOLDER}\\s*){2,}`, 'g'), `\n${PAGE_BREAK_PLACEHOLDER}\n`);

  // Move placeholders out of heading / paragraph interiors.
  out = out.replace(
    new RegExp(`<(h[1-4]|p)\\b([^>]*)>([\\s\\S]*?)<\\/\\1\\s*>`, 'gi'),
    (match, tag, attrs, inner) => {
      if (!inner.includes(PAGE_BREAK_PLACEHOLDER)) return match;
      const cleaned = inner.replace(new RegExp(PAGE_BREAK_PLACEHOLDER, 'g'), ' ').replace(/\s+/g, ' ').trim();
      const open = `<${tag}${attrs}>`;
      const close = `</${tag}>`;
      if (!cleaned) return `\n${PAGE_BREAK_PLACEHOLDER}\n`;
      return `${open}${cleaned}${close}\n${PAGE_BREAK_PLACEHOLDER}\n`;
    }
  );

  // Emit canonical HTML.
  out = out.replace(new RegExp(PAGE_BREAK_PLACEHOLDER, 'g'), PAGE_BREAK_HTML);

  // Collapse duplicate canonical breaks.
  out = out.replace(
    /(?:\s*<div class="page-break"><\/div>\s*){2,}/gi,
    `\n${PAGE_BREAK_HTML}\n`
  );

  return out;
}

export default normalizePageBreaks;
