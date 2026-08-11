export function mergeHeadingSentences(html) {
  return html.replace(
    /<h2>([^<]+)<\/h2>\s*<p>([^<]+)<\/p>/g,
    (match, h2, p) => {
      if (p.trim().startsWith('—')) {
        const merged = p.trim().replace(/^—\s*/, '');
        return `<h2>${h2} — ${merged}</h2>`;
      }
      return match;
    }
  );
}
