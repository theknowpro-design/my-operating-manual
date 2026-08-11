export function removeFigures(html) {
  // Remove remaining figures that are pure labels or category names
  return html.replace(/<figure>\s*(Course\s*Creation|Coaching|Mini-\s*Courses)\s*<\/figure>/gi, '');
}
