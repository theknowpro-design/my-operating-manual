/**
 * Global cover page builder.
 * Prefer an uploaded cover image as Page 1 (never regenerate over it).
 * Fallback: H1 title + optional subtitle/brand/logo + long-form generated timestamp.
 * Pure — niche-agnostic.
 */

import { formatGeneratedLabel } from '../../../src/utils/formatTimestamp.js';
import { escapeHtml } from './enforceHeadings.js';
import { PAGE_BREAK_HTML } from './enforcePageBreaks.js';

/**
 * @typedef {{
 *   title?: string,
 *   subtitle?: string,
 *   brand?: string,
 *   author?: string,
 *   logoUrl?: string,
 *   coverImageUrl?: string,
 *   coverHtml?: string,
 *   generatedAt?: Date|string|number,
 *   profilePhoto?: string|null,
 * }} CoverOptions
 */

/**
 * Build cover page HTML.
 * Uploaded cover image wins; existing coverHtml is passed through unchanged.
 * @param {CoverOptions} options
 * @returns {string}
 */
export function buildCover(options = {}) {
  // Do not regenerate or replace an already-authored cover.
  const existingCover = String(options.coverHtml || '').trim();
  if (existingCover) {
    const withBreak = /class\s*=\s*["'][^"']*\bpage-break\b/i.test(existingCover)
      ? existingCover
      : `${existingCover}\n${PAGE_BREAK_HTML}`;
    return withBreak;
  }

  const coverImageUrl = String(options.coverImageUrl || '').trim();
  if (coverImageUrl) {
    // Page 1 = uploaded cover image only (full-page, not a regenerated title block).
    return [
      '<header class="pdf-cover pdf-cover-image-only">',
      `<img class="pdf-cover-image" src="${escapeHtml(coverImageUrl)}" alt="Cover" />`,
      '</header>',
      PAGE_BREAK_HTML,
    ].join('\n');
  }

  const title = String(options.title || 'My Operating Manual').trim() || 'My Operating Manual';
  const subtitle = String(options.subtitle || '').trim();
  const brand = String(options.brand || options.author || '').trim();
  const logoUrl = String(options.logoUrl || '').trim();
  const profilePhoto = options.profilePhoto || null;
  const generatedLabel = formatGeneratedLabel(options.generatedAt ?? new Date());

  const parts = ['<header class="pdf-cover">'];

  if (profilePhoto) {
    parts.push(
      `<div class="pdf-cover-profile-photo"><img class="pdf-cover-profile-photo-img" src="${escapeHtml(profilePhoto)}" alt="Profile photo" /></div>`
    );
  } else if (logoUrl) {
    parts.push(
      `<div class="pdf-cover-logo-wrap pdf-cover-logo-wrap--top-center"><img class="pdf-cover-logo" src="${escapeHtml(logoUrl)}" alt="Read Me" /></div>`
    );
  }

  parts.push(`<h1 class="pdf-cover-title">${escapeHtml(title)}</h1>`);

  if (subtitle) {
    parts.push(`<p class="pdf-cover-subtitle">${escapeHtml(subtitle)}</p>`);
  }

  parts.push(
    `<p class="pdf-cover-generated">${escapeHtml(generatedLabel)}</p>`
  );

  if (brand) {
    parts.push(`<p class="pdf-cover-brand">${escapeHtml(brand)}</p>`);
  }

  parts.push('</header>');
  parts.push(PAGE_BREAK_HTML);

  return parts.join('\n');
}

export default buildCover;
