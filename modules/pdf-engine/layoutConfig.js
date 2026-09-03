/**
 * PDF layout rules — JS module (no JSON import / MIME issues).
 */

export const layoutConfig = {
  page: {
    size: 'US Letter',
    margins: {
      // Matches @page { margin: 1in 0.75in; } — top/bottom 1in, left/right 0.75in
      top: '1in',
      bottom: '1in',
      left: '0.75in',
      right: '0.75in',
    },
  },
  cover: {
    paddingTop: 48,
    paddingBottom: 16,
    imageMaxHeight: 786,
  },
  chart: {
    minHeight: 260,
    paddingTop: 12,
    paddingBottom: 12,
    staticImageMaxHeight: 216,
    staticImageMinHeight: 240,
  },
  typography: {
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    sizes: {
      h1: 24,
      h2: 22,
      h3: 12,
      body: 9,
    },
    lineHeight: 1.2,
    paragraphSpacing: 8,
    sectionSpacing: 12,
  },
  sections: [
    'Cover Page',
    'Executive Summary',
    'Business Model',
    'Revenue Streams',
    'Growth Strategy',
    'Marketing Strategy',
    'Pricing Model',
    'Action Plan',
    'Operational Notes',
    'Digital Visibility Strategy',
    'Metadata',
    'Appendices',
  ],
};

export default layoutConfig;
