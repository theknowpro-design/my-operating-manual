/**
 * HTML → PDF renderer via jsPDF.doc.html + html2canvas.
 * Lazy-imports libraries. Does not mutate htmlDocument.
 */

/**
 * Render a full HTML document string into a jsPDF instance.
 * @param {string} htmlDocument
 * @returns {Promise<object>} jsPDF instance (unsaved)
 */
export async function renderPdf(htmlDocument) {
  const { default: jsPDF } = await import('jspdf');
  const html2canvas = (await import('html2canvas')).default;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
  });

  const html = String(htmlDocument ?? '');

  await new Promise((resolve, reject) => {
    try {
      doc.html(html, {
        html2canvas: { scale: 2 },
        callback: (renderedDoc) => {
          resolve(renderedDoc || doc);
        },
      });
    } catch (error) {
      reject(error);
    }
  });

  return doc;
}

export default renderPdf;
