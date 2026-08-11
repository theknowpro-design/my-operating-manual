export function removeVerbFigures(html) {
  const verbs = [
    'Complete', 'Choose', 'Publish', 'Invite', 'Record',
    'Define', 'Draft', 'Start', 'Finish'
  ];

  return html.replace(/<figure>([\s\S]*?)<\/figure>/g, (match, content) => {
    const cleaned = content.trim();
    if (verbs.includes(cleaned)) return '';
    return match;
  });
}
