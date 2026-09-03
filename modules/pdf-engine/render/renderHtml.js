/**
 * HTML → jsPDF conversion with true page breaks, margins, TOC links,
 * chart images, and Chrome-safe JPEG pages.
 *
 * Chrome rainbow/glitch root cause:
 *   Prior renderer painted one tall PNG and sliced it with negative Y offsets.
 *   Chrome's built-in viewer mis-decodes those clipped PNG XObjects (alpha /
 *   soft-mask + non-integer transforms → rainbow artifacts).
 * Fix:
 *   One opaque JPEG per page, integer coordinates, no tall-image Y slicing
 *   across page boundaries via addImage negative offsets.
 */

import { captureChartsAsImages } from './captureChartsAsImages.js';

/** Letter size in points; matches @page { margin: 1in 0.75in; } */
const PAGE_WIDTH_PT = 612; // 8.5in
const PAGE_HEIGHT_PT = 792; // 11in
const MARGIN_TOP_PT = 72; // 1in
const MARGIN_BOTTOM_PT = 72; // 1in
const MARGIN_LEFT_PT = 54; // 0.75in
const MARGIN_RIGHT_PT = 54; // 0.75in

const CONTENT_WIDTH_PT = PAGE_WIDTH_PT - MARGIN_LEFT_PT - MARGIN_RIGHT_PT; // 504
const CONTENT_HEIGHT_PT = PAGE_HEIGHT_PT - MARGIN_TOP_PT - MARGIN_BOTTOM_PT; // 648

/** CSS px width for content area at 96dpi (6.5in) */
const CONTENT_WIDTH_PX = 624;

/**
 * Wait for images inside a root element to load (or error).
 * @param {ParentNode} root
 * @returns {Promise<void>}
 */
function waitForImages(root) {
  const images = Array.from(root.querySelectorAll?.('img') || []);
  if (!images.length) return Promise.resolve();
  return Promise.all(
    images.map(
      (img) => new Promise((resolve) => {
        if (img.complete) {
          resolve();
          return;
        }
        img.onload = () => resolve();
        img.onerror = () => resolve();
      })
    )
  ).then(() => undefined);
}

/**
 * Split structured HTML into page chunks on div.page-break markers.
 * @param {string} bodyInner
 * @returns {string[]}
 */
function splitIntoPages(bodyInner) {
  const source = String(bodyInner ?? '');
  const parts = source.split(
    /<div\b[^>]*class\s*=\s*["'][^"']*\bpage-break\b[^"']*["'][^>]*>\s*<\/div\s*>/gi
  );
  return parts.map((p) => p.trim()).filter(Boolean);
}

/**
 * Convert canvas → opaque JPEG data URL (Chrome-safe; no alpha soft-mask).
 * @param {HTMLCanvasElement} canvas
 * @returns {string}
 */
function canvasToJpeg(canvas) {
  try {
    return canvas.toDataURL('image/jpeg', 0.92);
  } catch {
    return canvas.toDataURL('image/png');
  }
}

/**
 * Create a temporary off-screen page wrapper for html2canvas.
 * Parents must NOT use display:flex or overflow:hidden (defeats page breaks).
 * @param {string} styles
 * @param {string} pageHtml
 * @returns {HTMLDivElement}
 */
function createPageWrapper(styles, pageHtml) {
  const wrapper = document.createElement('div');
  wrapper.setAttribute('data-pdf-page-root', 'true');
  wrapper.className = 'pdf-page';
  wrapper.style.width = `${CONTENT_WIDTH_PX}px`;
  wrapper.style.maxWidth = `${CONTENT_WIDTH_PX}px`;
  wrapper.style.margin = '0';
  wrapper.style.padding = '0';
  wrapper.style.boxSizing = 'border-box';
  wrapper.style.background = '#ffffff';
  wrapper.style.color = '#222222';
  wrapper.style.fontFamily = 'Arial, Helvetica, sans-serif';
  wrapper.style.fontSize = '14px';
  wrapper.style.lineHeight = '1.6';
  wrapper.style.position = 'absolute';
  wrapper.style.left = '-10000px';
  wrapper.style.top = '0';
  wrapper.style.display = 'block';
  wrapper.style.overflow = 'visible';
  wrapper.innerHTML = `${styles}<div class="pdf-structure">${pageHtml}</div>`;
  document.body.appendChild(wrapper);
  return wrapper;
}

/**
 * Render a full HTML document string into a jsPDF instance (unsaved).
 * @param {string} htmlDocument
 * @returns {Promise<object>} jsPDF instance
 */
export async function renderHtml(htmlDocument) {
  const { default: jsPDF } = await import('jspdf');
  const html2canvas = (await import('html2canvas')).default;

  const html = String(htmlDocument ?? '');

  let bodyInner = html;
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) bodyInner = bodyMatch[1];

  // Unwrap .pdf-structure so printable margins are applied by jsPDF, not CSS padding.
  const structureMatch = bodyInner.match(
    /<div\b[^>]*class\s*=\s*["'][^"']*\bpdf-structure\b[^"']*["'][^>]*>([\s\S]*)<\/div\s*>\s*$/i
  );
  if (structureMatch) bodyInner = structureMatch[1];

  const styles = Array.from(html.matchAll(/<style[^>]*>[\s\S]*?<\/style>/gi))
    .map((m) => m[0])
    .join('\n');

  const pages = splitIntoPages(bodyInner);
  if (!pages.length) pages.push('<p></p>');

  const pdf = new jsPDF({
    unit: 'pt',
    format: 'letter',
    compress: true,
    orientation: 'portrait',
  });

  /** @type {Map<string, number>} */
  const headingPageMap = new Map();
  /** @type {Array<{ id: string, page: number, x: number, y: number, w: number, h: number }>} */
  const tocLinkBoxes = [];

  let pdfPageCount = 0;
  const scale = CONTENT_WIDTH_PT / CONTENT_WIDTH_PX;
  const pageHeightCssPx = CONTENT_HEIGHT_PT / scale;

  for (let i = 0; i < pages.length; i += 1) {
    const isCoverImagePage = i === 0
      && /pdf-cover-image-only|class=["'][^"']*\bpdf-cover-image\b/i.test(pages[i]);
    const wrapper = createPageWrapper(styles, pages[i]);

    try {
      await waitForImages(wrapper);
      // Chart.js / Apex / ECharts / canvas → Base64 <img> (labels baked in)
      await captureChartsAsImages(wrapper);
      await waitForImages(wrapper);

      const canvas = await html2canvas(wrapper, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: CONTENT_WIDTH_PX,
        width: CONTENT_WIDTH_PX,
        foreignObjectRendering: false,
      });

      const wrapperRect = wrapper.getBoundingClientRect();
      const cssHeight = canvas.height / 2;
      let offsetCss = 0;

      while (offsetCss < cssHeight - 0.5) {
        const sliceHeightCss = Math.min(pageHeightCssPx, cssHeight - offsetCss);
        const srcY = Math.round(offsetCss * 2);
        const srcH = Math.max(1, Math.round(sliceHeightCss * 2));

        // Fresh opaque canvas per PDF page (no shared tall PNG + negative Y).
        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = srcH;
        const ctx = sliceCanvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
        ctx.drawImage(
          canvas,
          0,
          srcY,
          canvas.width,
          srcH,
          0,
          0,
          sliceCanvas.width,
          srcH
        );

        const imgData = canvasToJpeg(sliceCanvas);

        // Cover image = Page 1 full-bleed; all other pages respect @page margins.
        const drawX = isCoverImagePage ? 0 : Math.round(MARGIN_LEFT_PT);
        const drawY = isCoverImagePage ? 0 : Math.round(MARGIN_TOP_PT);
        const drawW = isCoverImagePage
          ? Math.round(PAGE_WIDTH_PT)
          : Math.round(CONTENT_WIDTH_PT);
        const drawH = isCoverImagePage
          ? Math.round((srcH / canvas.width) * PAGE_WIDTH_PT)
          : Math.round((srcH / canvas.width) * CONTENT_WIDTH_PT);

        if (pdfPageCount > 0) pdf.addPage();
        pdfPageCount += 1;

        pdf.addImage(
          imgData,
          'JPEG',
          drawX,
          drawY,
          drawW,
          Math.min(drawH, isCoverImagePage ? PAGE_HEIGHT_PT : CONTENT_HEIGHT_PT),
          undefined,
          'FAST'
        );

        // Heading → PDF page map (for TOC internal links)
        wrapper.querySelectorAll('h2[id]').forEach((el) => {
          const id = el.getAttribute('id');
          if (!id || headingPageMap.has(id)) return;
          const rect = el.getBoundingClientRect();
          const topInPage = rect.top - wrapperRect.top;
          if (
            topInPage >= offsetCss - 1
            && topInPage < offsetCss + sliceHeightCss
          ) {
            headingPageMap.set(id, pdfPageCount);
          }
        });

        // TOC link hit-boxes (Page 2) → clickable annotations
        wrapper.querySelectorAll('a.pdf-toc-link[href^="#"]').forEach((el) => {
          const href = el.getAttribute('href') || '';
          const id = href.replace(/^#/, '');
          if (!id) return;
          const rect = el.getBoundingClientRect();
          const topInPage = rect.top - wrapperRect.top;
          if (
            topInPage >= offsetCss - 1
            && topInPage < offsetCss + sliceHeightCss
          ) {
            const x = Math.round(MARGIN_LEFT_PT + (rect.left - wrapperRect.left) * scale);
            const y = Math.round(MARGIN_TOP_PT + (topInPage - offsetCss) * scale);
            const w = Math.max(1, Math.round(rect.width * scale));
            const h = Math.max(1, Math.round(rect.height * scale));
            tocLinkBoxes.push({
              id, page: pdfPageCount, x, y, w, h,
            });
          }
        });

        offsetCss += sliceHeightCss;
      }
    } finally {
      wrapper.remove();
    }
  }

  // Clickable internal PDF links: each TOC entry jumps to its H2 page.
  tocLinkBoxes.forEach((box) => {
    const targetPage = headingPageMap.get(box.id);
    if (!targetPage || typeof pdf.link !== 'function') return;
    try {
      pdf.setPage(box.page);
      pdf.link(box.x, box.y, box.w, box.h, { pageNumber: targetPage });
    } catch (err) {
      console.warn('[pdf-render] TOC link annotation failed:', box.id, err);
    }
  });

  if (pdfPageCount > 0) pdf.setPage(1);
  return pdf;
}

export default renderHtml;
