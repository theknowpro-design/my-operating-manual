export function removeNicheArtifacts(html) {
  const corrections = {
    'aans': 'gaps',
    'Mini-\\s*Courses': 'Mini-Courses',
  };

  let output = html;
  for (const bad in corrections) {
    const good = corrections[bad];
    output = output.replace(new RegExp(bad, 'gi'), good);
  }
  return output;
}
