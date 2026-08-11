export function removeStrayArtifacts(html) {
  let output = html;

  // Remove stray Unicode artifacts (soft hyphens, zero-width spaces, BOM, etc.)
  output = output
    .replace(/\u00AD/g, '')        // soft hyphen
    .replace(/\u200B/g, '')        // zero-width space
    .replace(/\u200C/g, '')        // zero-width non-joiner
    .replace(/\u200D/g, '')        // zero-width joiner
    .replace(/\uFEFF/g, '');       // BOM

  // Remove stray standalone punctuation or symbols on their own lines
  output = output.replace(/^\s*[-–—]+\s*$/gm, '');

  // Remove stray Markdown artifacts (isolated #, ##, ###, ####)
  output = output.replace(/^\s*#{1,4}\s*$/gm, '');

  // Remove stray hyphens/em-dashes between line breaks
  output = output.replace(/-\s*\n/g, '\n');
  output = output.replace(/—\s*\n/g, '\n');

  // Remove leftover broken hyphenation fragments
  output = output
    .replace(/\bMini-\s*\n\s*Courses\b/gi, 'Mini-Courses')
    .replace(/\bCourse-\s*\n\s*Creation\b/gi, 'Course Creation')
    .replace(/\bfill-\s*\n\s*in-\s*\n\s*the-\s*\n\s*blank\b/gi, 'fill-in-the-blank');

  // Remove stray periods or commas at line starts
  output = output.replace(/^\s*[.,]\s*/gm, '');

  // Remove stray "vour" OCR artifact (common misread of "your")
  output = output.replace(/\bvour\b/gi, 'your');

  // Remove stray "aans" OCR artifact if still present
  output = output.replace(/\baans\b/gi, 'gaps');

  // Remove stray duplicated whitespace clusters
  output = output.replace(/[ \t]{2,}/g, ' ');

  // Remove stray empty lines created by cleanup
  output = output.replace(/\n{3,}/g, '\n\n');

  return output;
}
