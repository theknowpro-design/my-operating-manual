/**
 * Canonical long-form timestamp for UI header + PDF cover.
 * Format: {Month} {Day}, {Year} — {HH}:{MM}:{SS} {AM/PM}
 * Example: Generated August 11, 2026 — 12:37:00 PM
 *
 * Em dash is U+2014 with exactly one space on each side.
 */

/** Em dash (—), never hyphen (-) or en dash (–). */
const EM_DASH = '\u2014'

function toValidDate(input = new Date()) {
  const date = input instanceof Date ? input : new Date(input)
  return Number.isNaN(date.getTime()) ? new Date() : date
}

/**
 * Shared long-form timestamp used by the web header clock and PDF cover.
 * @param {Date|string|number} [input]
 * @returns {string}
 */
export function formatTimestamp(input = new Date()) {
  const date = toValidDate(input)
  const month = date.toLocaleDateString('en-US', { month: 'long' })
  const day = date.getDate()
  const year = date.getFullYear()
  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
  return `${month} ${day}, ${year} ${EM_DASH} ${time}`
}

/**
 * Prefixed label for manuals and PDF covers.
 * @param {Date|string|number} [input]
 * @returns {string}
 */
export function formatGeneratedLabel(input = new Date()) {
  return `Generated ${formatTimestamp(input)}`
}

export default formatTimestamp
