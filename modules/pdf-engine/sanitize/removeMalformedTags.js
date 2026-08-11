export function removeMalformedTags(html) {
  // Allowlist closing tags; only remove truly malformed tags
  return html.replace(/<(?!\/?(p|h1|h2|h3|h4|div|span|figure|strong|em|ul|ol|li|br)\b)[^>]+>/gi, '');
}
