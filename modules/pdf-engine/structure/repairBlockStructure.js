/**
 * Repair invalid HTML where block elements were wrapped inside <p>.
 * Ensures page-breaks and headings are standalone blocks for html2canvas/jsPDF.
 * Pure — niche-agnostic.
 */

import { PAGE_BREAK_HTML } from './enforcePageBreaks.js';

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Pull page-breaks and headings out of enclosing <p> tags.
 * @param {string} html
 * @returns {string}
 */
export function repairBlockStructure(html) {
  let out = String(html ?? '');

  // <p> ... <div class="page-break"></div> ... </p>  → unwrap blocks
  out = out.replace(
    /<p\b[^>]*>([\s\S]*?)<\/p\s*>/gi,
    (match, inner) => {
      const hasBreak = /class\s*=\s*["'][^"']*\bpage-break\b/i.test(inner)
        || /<div\s+class="page-break"/i.test(inner);
      const hasHeading = /<h[1-6]\b/i.test(inner);
      const hasSection = /<(?:section|nav|header|div)\b/i.test(inner);
      if (!hasBreak && !hasHeading && !hasSection) return match;

      const parts = [];
      const tokenRe = /(<div\b[^>]*class\s*=\s*["'][^"']*\bpage-break\b[^"']*["'][^>]*>\s*<\/div\s*>|<h[1-6]\b[^>]*>[\s\S]*?<\/h[1-6]\s*>|<(?:section|nav|header)\b[^>]*>[\s\S]*?<\/(?:section|nav|header)\s*>)/gi;
      let last = 0;
      let m;
      while ((m = tokenRe.exec(inner)) !== null) {
        const before = inner.slice(last, m.index).replace(/\s+/g, ' ').trim();
        if (before) parts.push(`<p>${before}</p>`);
        parts.push(m[0]);
        last = m.index + m[0].length;
      }
      const after = inner.slice(last).replace(/\s+/g, ' ').trim();
      if (after) parts.push(`<p>${after}</p>`);
      return parts.join('\n');
    }
  );

  out = out.replace(
    /<div\b[^>]*class\s*=\s*["'][^"']*\bpage-break\b[^"']*["'][^>]*>\s*<\/div\s*>/gi,
    PAGE_BREAK_HTML
  );

  out = out.replace(/<p\b[^>]*>\s*(<(?:h[1-6]|div)\b)/gi, '$1');
  out = out.replace(/(<\/(?:h[1-6]|div)\s*>)\s*<\/p\s*>/gi, '$1');

  const breakEsc = escapeRegex(PAGE_BREAK_HTML);
  out = out.replace(
    new RegExp(`${breakEsc}\\s*<p\\b[^>]*>\\s*(<h2\\b)`, 'gi'),
    `${PAGE_BREAK_HTML}\n$1`
  );

  return out;
}

export default repairBlockStructure;
