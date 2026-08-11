export function removePageTags(html) {
  // Remove any <Page...> tag safely
  return html.replace(/<Page[^>]*>/gi, '');
}
