/**
 * Title page HTML for the PDF template layer.
 * Pure HTML assembly — no jsPDF / rendering.
 */

import { formatGeneratedLabel } from '../../../src/utils/formatTimestamp.js';
import { escapeHtml } from './htmlUtils.js';
import { getPageBreak } from './pageBreaks.js';

/**
 * @param {{ title?: string, subtitle?: string, generatedAt?: Date|string|number, profilePhoto?: string|null }} schema
 * @returns {string}
 */
export function buildTitlePage(schema = {}) {
  const title = escapeHtml(schema.title || 'My Operating Manual');
  const subtitle = String(schema.subtitle || '').trim();
  const generatedLabel = formatGeneratedLabel(schema.generatedAt ?? new Date());
  const profilePhoto = schema.profilePhoto || null;

  const subtitleHtml = subtitle
    ? `<p class="subtitle">${escapeHtml(subtitle)}</p>`
    : '';

  const profilePhotoHtml = profilePhoto
    ? `<div class="profile-photo-section"><img src="${profilePhoto}" alt="Profile photo" class="profile-photo" /></div>`
    : '';

  return [
    '<div class="title-page">',
    profilePhotoHtml,
    `<h1>${title}</h1>`,
    subtitleHtml,
    `<p class="generated">${escapeHtml(generatedLabel)}</p>`,
    '</div>',
    getPageBreak(),
  ].filter(Boolean).join('');
}

export default buildTitlePage;
