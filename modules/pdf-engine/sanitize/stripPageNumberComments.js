export function stripPageNumberComments(html) {
  // Strip PageNumber, PageFooter, PageHeader comments including alphabetic values
  return html.replace(/<!--\s*Page(Number|Footer|Header)\s*=\s*".*?"\s*-->/gi, '');
}
