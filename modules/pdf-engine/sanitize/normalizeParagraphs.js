export function normalizeParagraphs(html) {
  // Wrap loose text lines into <p> blocks where appropriate
  return html.replace(/(^|\n)([^\n<][^\n]*)/g, (m, prefix, line) => {
    if (/^\s*$/.test(line)) return m;
    if (/^<p>/.test(line) || /^<h[1-4]>/.test(line)) return m;
    return `${prefix}<p>${line.trim()}</p>`;
  });
}
