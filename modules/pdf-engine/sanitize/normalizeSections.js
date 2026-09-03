/**
 * Normalize section boundaries for layout-safe PDF HTML.
 * Pure — no DOM, jsPDF, or html2canvas.
 */

import { PAGE_BREAK_HTML } from './normalizePageBreaks.js';

/**
 * Ensure sections follow a clean heading → paragraphs → page-break rhythm.
 * Removes broken section markers and duplicate trailing breaks.
 * @param {string} html
 * @returns {string}
 */
export function normalizeSections(html) {
  let out = String(html ?? '');

  // Canonical page-break.
  out = out.replace(
    /<div\b[^>]*class\s*=\s*["'][^"']*\bpage-break\b[^"']*["'][^>]*>\s*<\/div\s*>/gi,
    PAGE_BREAK_HTML
  );

  // Drop broken section markers from older extractors.
  out = out.replace(/<\/?section\b[^>]*>/gi, '\n');
  out = out.replace(/<\/?article\b[^>]*>/gi, '\n');
  out = out.replace(/\bdata-section\s*=\s*["'][^"']*["']/gi, '');

  // Split into blocks on headings and page-breaks while keeping them.
  const tokenRe =
    /(<(?:h[1-4])\b[^>]*>[\s\S]*?<\/h[1-4]\s*>|<div class="page-break"><\/div>)/gi;

  const chunks = [];
  let last = 0;
  let match;
  while ((match = tokenRe.exec(out)) !== null) {
    const before = out.slice(last, match.index).trim();
    if (before) chunks.push({ type: 'body', html: before });
    if (/^<h[1-4]\b/i.test(match[0])) {
      chunks.push({ type: 'heading', html: match[0] });
    } else {
      chunks.push({ type: 'break', html: PAGE_BREAK_HTML });
    }
    last = match.index + match[0].length;
  }
  const trailing = out.slice(last).trim();
  if (trailing) chunks.push({ type: 'body', html: trailing });

  // Rebuild: insert a page-break between heading-led sections when missing.
  const rebuilt = [];
  for (let i = 0; i < chunks.length; i += 1) {
    const chunk = chunks[i];
    const prev = rebuilt[rebuilt.length - 1];

    if (chunk.type === 'heading') {
      // Before a new heading (not the first), ensure a page-break separator.
      if (rebuilt.length && prev?.type !== 'break') {
        rebuilt.push({ type: 'break', html: PAGE_BREAK_HTML });
      }
      // Skip consecutive duplicate breaks already handled.
      rebuilt.push(chunk);
      continue;
    }

    if (chunk.type === 'break') {
      if (prev?.type === 'break') continue;
      // Do not lead the document with a page-break.
      if (!rebuilt.length) continue;
      rebuilt.push(chunk);
      continue;
    }

    rebuilt.push(chunk);
  }

  // Drop trailing page-break.
  while (rebuilt.length && rebuilt[rebuilt.length - 1].type === 'break') {
    rebuilt.pop();
  }

  out = rebuilt.map((c) => c.html).join('\n');

  // Collapse multiple blank lines between sections to a single newline.
  out = out.replace(/\n{3,}/g, '\n\n');

  // Ensure heading is followed by content or break cleanly (no glued tags).
  out = out.replace(/(<\/h[1-4]>)([^\s<])/gi, '$1\n$2');
  out = out.replace(/(<\/p>)(<h[1-4]\b)/gi, `$1\n${PAGE_BREAK_HTML}\n$2`);

  // Re-collapse accidental double breaks from the rule above.
  out = out.replace(
    new RegExp(`(?:\\s*${PAGE_BREAK_HTML.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*){2,}`, 'gi'),
    `\n${PAGE_BREAK_HTML}\n`
  );

  return out.trim();
}

export default normalizeSections;
