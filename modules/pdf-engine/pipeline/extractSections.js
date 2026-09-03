/**
 * Parse sanitized HTML into heading + body section objects.
 * Pure — string in / array out. No DOM or PDF rendering.
 */

/**
 * @param {string} html
 * @returns {string}
 */
function decodeBasicEntities(html) {
  return String(html || '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

/**
 * @param {string} html
 * @returns {string}
 */
export function stripTags(html) {
  return decodeBasicEntities(String(html || '').replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * @param {string} text
 * @returns {string}
 */
function normalizeKey(text) {
  return stripTags(text).toLowerCase().replace(/\s+/g, ' ').trim();
}

/**
 * Split sanitized HTML into ordered blocks of { level, heading, bodyHtml }.
 * @param {string} html
 * @returns {Array<{ level: number, heading: string, bodyHtml: string, body: string }>}
 */
export function extractSections(html) {
  const source = String(html || '');
  const headingRe = /<(h[1-3])\b[^>]*>([\s\S]*?)<\/\1\s*>/gi;
  const matches = [...source.matchAll(headingRe)];

  if (!matches.length) {
    const body = stripTags(source);
    return body
      ? [{ level: 2, heading: 'Content', bodyHtml: source.trim(), body }]
      : [];
  }

  /** @type {Array<{ level: number, heading: string, bodyHtml: string, body: string }>} */
  const sections = [];

  for (let i = 0; i < matches.length; i += 1) {
    const match = matches[i];
    const level = Number(String(match[1]).slice(1));
    const heading = stripTags(match[2]);
    const start = (match.index || 0) + match[0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : source.length;
    const bodyHtml = source.slice(start, end).trim();
    const body = stripTags(bodyHtml);
    if (!heading && !body) continue;
    sections.push({
      level,
      heading: heading || 'Untitled',
      bodyHtml,
      body,
    });
  }

  return dedupeSections(sections);
}

/**
 * Drop repeated heading+body blocks (keep first occurrence).
 * @param {Array<{ heading: string, body: string, [key: string]: unknown }>} sections
 * @returns {Array<{ heading: string, body: string, [key: string]: unknown }>}
 */
export function dedupeSections(sections) {
  const seen = new Set();
  const out = [];
  for (const section of sections || []) {
    const key = `${normalizeKey(section.heading)}::${normalizeKey(section.body)}`;
    if (!key || key === '::' || seen.has(key)) continue;
    seen.add(key);
    out.push(section);
  }
  return out;
}

export default extractSections;
