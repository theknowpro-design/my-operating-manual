export function removeSemanticPageMarkers(html) {
  // Remove semantic page markers like "Month 12", "Month 1", etc.
  return html.replace(/\bMonth\s+\d+\b/gi, '');
}
