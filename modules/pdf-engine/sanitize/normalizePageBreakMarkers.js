export function normalizePageBreakMarkers(html) {
  // Normalize all PAGE_BREAK markers to a clean div.page-break
  return html
    .replace(/PAGE_BREAK/gi, '')
    .replace(/<div[^>]*class=["']page-break["'][^>]*>/gi, '<div class="page-break">');
}
