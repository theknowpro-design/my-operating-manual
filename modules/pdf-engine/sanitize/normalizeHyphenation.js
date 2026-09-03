export function normalizeHyphenation(html) {
  return html
    .replace(/fill-\s*in-\s*the\s*-\s*blank/gi, 'fill-in-the-blank')
    .replace(/fill-\s*in-\s*the\s*blank/gi, 'fill-in-the-blank')
    .replace(/Mini-\s*Courses/gi, 'Mini-Courses')
    .replace(/one-\s+page/gi, 'one-page')
    .replace(/one-\s+page\s+reference/gi, 'one-page reference')
    .replace(/one-\s+page\s+sheet/gi, 'one-page sheet');
}
