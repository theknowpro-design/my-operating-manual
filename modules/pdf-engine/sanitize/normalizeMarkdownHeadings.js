export function normalizeMarkdownHeadings(html) {
  // Remove meaningless single-word headings and normalize stacked headings
  return html.replace(/<h[1-4]>\s*(blank|results)\s*<\/h[1-4]>/gi, '');
}
