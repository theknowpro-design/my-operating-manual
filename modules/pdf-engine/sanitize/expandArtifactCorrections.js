export function expandArtifactCorrections(html) {
  const corrections = {
    'adiust': 'adjust',
    'VOU': 'you',
    'İS': 'is',
    'case study': 'case-study',
    'SO growth': 'so growth',
  };

  let output = html;
  for (const bad in corrections) {
    const good = corrections[bad];
    output = output.replace(new RegExp(bad, 'gi'), good);
  }
  return output;
}
