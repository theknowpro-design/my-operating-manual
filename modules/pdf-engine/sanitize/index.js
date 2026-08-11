/**
 * PDF content sanitization + normalization pipeline.
 * Pure HTML cleanup only — no rendering, jsPDF, or html2canvas.
 */

import { stripPageNumberComments } from './stripPageNumberComments.js';
import { removePageTags } from './removePageTags.js';
import { normalizePageBreakMarkers } from './normalizePageBreakMarkers.js';
import { removeSemanticPageMarkers } from './removeSemanticPageMarkers.js';
import { removeVerbFigures } from './removeVerbFigures.js';
import { removeFigures } from './removeFigures.js';
import { removeMalformedTags } from './removeMalformedTags.js';
import { normalizeMarkdownHeadings } from './normalizeMarkdownHeadings.js';
import { removeStrayArtifacts } from './removeStrayArtifacts.js';
import { removeNicheArtifacts } from './removeNicheArtifacts.js';
import { expandArtifactCorrections } from './expandArtifactCorrections.js';
import { normalizeHyphenation } from './normalizeHyphenation.js';
import { normalizeParagraphs } from './normalizeParagraphs.js';
import { dedupeParagraphBlocks } from './dedupeParagraphBlocks.js';
import { mergeHeadingSentences } from './mergeHeadingSentences.js';
import { normalizeWhitespace } from './normalizeWhitespace.js';

export function sanitizeContent(html) {
  let output = html;

  output = stripPageNumberComments(output);
  output = removePageTags(output);
  output = normalizePageBreakMarkers(output);
  output = removeSemanticPageMarkers(output);
  output = removeVerbFigures(output);
  output = removeFigures(output);
  output = removeMalformedTags(output);
  output = normalizeMarkdownHeadings(output);
  output = removeStrayArtifacts(output);
  output = removeNicheArtifacts(output);
  output = expandArtifactCorrections(output);
  output = normalizeHyphenation(output);
  output = normalizeParagraphs(output);
  output = dedupeParagraphBlocks(output);
  output = mergeHeadingSentences(output);
  output = normalizeWhitespace(output);

  return output;
}

export { stripPageNumberComments } from './stripPageNumberComments.js';
export { removePageTags } from './removePageTags.js';
export { normalizePageBreakMarkers } from './normalizePageBreakMarkers.js';
export { removeSemanticPageMarkers } from './removeSemanticPageMarkers.js';
export { removeVerbFigures } from './removeVerbFigures.js';
export { removeFigures } from './removeFigures.js';
export { removeMalformedTags } from './removeMalformedTags.js';
export { normalizeMarkdownHeadings } from './normalizeMarkdownHeadings.js';
export { removeStrayArtifacts } from './removeStrayArtifacts.js';
export { removeNicheArtifacts } from './removeNicheArtifacts.js';
export { expandArtifactCorrections } from './expandArtifactCorrections.js';
export { normalizeHyphenation } from './normalizeHyphenation.js';
export { normalizeParagraphs } from './normalizeParagraphs.js';
export { dedupeParagraphBlocks } from './dedupeParagraphBlocks.js';
export { mergeHeadingSentences } from './mergeHeadingSentences.js';
export { normalizeWhitespace } from './normalizeWhitespace.js';

export default sanitizeContent;
