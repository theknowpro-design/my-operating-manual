export function dedupeParagraphBlocks(html) {
  const blocks = html.split(/<\/p>/g).map(b => b.trim());
  const seen = new Set();

  const deduped = blocks.filter(block => {
    const key = block.replace(/\s+/g, ' ').toLowerCase();
    if (!key) return false;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return deduped.map(b => b + '</p>').join('\n');
}
