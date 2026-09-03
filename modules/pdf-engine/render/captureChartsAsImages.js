/**
 * Replace canvas-based charts with Base64 <img> before PDF capture.
 * Supports Chart.js, ApexCharts, ECharts, and plain canvas fallback.
 * Ensures labels/axes are baked into the image (not lost to html2canvas).
 */

import layoutConfig from '../layoutConfig.js';

const CHART_FONT_FAMILY = 'Arial';
const CHART_FONT_SIZE = 12;
const CHART_TEXT_COLOR = '#000';
const chartLayout = layoutConfig.chart || {};
const CHART_MIN_HEIGHT = Number(chartLayout.minHeight) || 320;
const CHART_PADDING_TOP = Math.max(12, Number(chartLayout.paddingTop) || 12);
const CHART_PADDING_BOTTOM = Math.max(12, Number(chartLayout.paddingBottom) || 12);

/**
 * @param {unknown} value
 * @returns {Promise<void>}
 */
async function settle(value) {
  try {
    await value;
  } catch {
    // Chart update failures are non-fatal; fall through to capture.
  }
}

/**
 * Wait briefly so chart redraw / layout completes before capture.
 * @returns {Promise<void>}
 */
function settleFrame() {
  return new Promise((resolve) => {
    setTimeout(resolve, 100);
  });
}

/**
 * Wait until browser fonts are ready before Chart.js measures labels.
 * Headless Chromium otherwise can capture fallback/zero-width glyph metrics.
 * @returns {Promise<void>}
 */
async function waitForFonts() {
  if (typeof document === 'undefined' || !document.fonts?.ready) return;
  await settle(document.fonts.ready);
}

/**
 * Apply global Chart.js defaults before chart lookup/update.
 * Safe when Chart.js is not loaded (the app also supports SVG/static charts).
 * @returns {object|null}
 */
export function configureChartJsDefaults() {
  const Chart = typeof window !== 'undefined' ? window.Chart : null;
  if (!Chart?.defaults) return Chart || null;

  try {
    Chart.defaults.font = Chart.defaults.font || {};
    Chart.defaults.font.family = CHART_FONT_FAMILY;
    Chart.defaults.font.size = CHART_FONT_SIZE;
    Chart.defaults.color = CHART_TEXT_COLOR;
  } catch {
    // Some wrappers expose immutable defaults; per-chart options still apply.
  }

  return Chart;
}

/**
 * Add chart-safe container dimensions without hiding labels or axes.
 * Existing height is increased by 40px; repeated calls are idempotent.
 * @param {HTMLCanvasElement} canvas
 */
function prepareChartContainer(canvas) {
  if (!canvas) return;

  const container = canvas.closest?.(
    '.pdf-chart-container, .chart-container, .chart-wrapper, .pdf-income-graph'
  ) || canvas.parentElement;
  if (!container) return;

  container.style.overflow = 'visible';
  container.style.marginTop = container.style.marginTop.startsWith('-') ? '0' : container.style.marginTop;
  container.style.marginBottom = container.style.marginBottom.startsWith('-') ? '0' : container.style.marginBottom;
  container.style.paddingTop = `${CHART_PADDING_TOP}px`;
  container.style.paddingBottom = `${CHART_PADDING_BOTTOM}px`;
  container.style.boxSizing = 'border-box';

  if (container.dataset.pdfChartSized === 'true') return;

  const canvasHeight = canvas.getBoundingClientRect?.().height
    || Number(canvas.getAttribute('height'))
    || 0;
  const containerHeight = container.getBoundingClientRect?.().height || 0;
  const baseHeight = Math.max(canvasHeight, containerHeight, CHART_MIN_HEIGHT - 40);
  container.style.minHeight = `${Math.max(CHART_MIN_HEIGHT, Math.ceil(baseHeight + 40))}px`;
  container.dataset.pdfChartSized = 'true';
}

/**
 * Force black axis/data labels and safe layout padding for PDF capture.
 * @param {object} chart
 */
function configureChartJsInstance(chart) {
  if (!chart) return;

  const options = chart.options || (chart.options = {});
  const layout = options.layout || (options.layout = {});
  const padding = typeof layout.padding === 'number'
    ? {
      top: layout.padding,
      right: layout.padding,
      bottom: layout.padding,
      left: layout.padding,
    }
    : { ...(layout.padding || {}) };

  layout.padding = {
    ...padding,
    top: Math.max(CHART_PADDING_TOP, Number(padding.top) || 0),
    bottom: Math.max(CHART_PADDING_BOTTOM, Number(padding.bottom) || 0),
  };

  const scales = options.scales || (options.scales = {});
  for (const axisName of ['x', 'y']) {
    const axis = scales[axisName] || (scales[axisName] = {});
    const ticks = axis.ticks || (axis.ticks = {});
    ticks.color = CHART_TEXT_COLOR;
    ticks.font = {
      ...(ticks.font || {}),
      family: CHART_FONT_FAMILY,
      size: CHART_FONT_SIZE,
    };

    if (axis.title && typeof axis.title === 'object') {
      axis.title.color = CHART_TEXT_COLOR;
      axis.title.font = {
        ...(axis.title.font || {}),
        family: CHART_FONT_FAMILY,
        size: CHART_FONT_SIZE,
      };
    }
  }

  const plugins = options.plugins || (options.plugins = {});
  if (plugins.datalabels !== false) {
    const datalabels = (
      plugins.datalabels && typeof plugins.datalabels === 'object'
        ? plugins.datalabels
        : {}
    );
    datalabels.color = CHART_TEXT_COLOR;
    datalabels.font = {
      ...(datalabels.font || {}),
      family: CHART_FONT_FAMILY,
      size: CHART_FONT_SIZE,
    };
    plugins.datalabels = datalabels;
  }
}

/**
 * Resolve a Chart.js instance attached to a canvas.
 * @param {HTMLCanvasElement} canvas
 * @returns {object|null}
 */
function getChartJsInstance(canvas) {
  if (!canvas) return null;
  if (canvas.chart) return canvas.chart;
  if (typeof canvas.$chartjs !== 'undefined' && canvas.__chartjs__) {
    return canvas.__chartjs__;
  }
  const Chart = typeof window !== 'undefined' ? window.Chart : null;
  if (Chart?.getChart) {
    try {
      return Chart.getChart(canvas) || null;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Resolve an ApexCharts instance near a canvas.
 * @param {HTMLCanvasElement} canvas
 * @returns {object|null}
 */
function getApexInstance(canvas) {
  const host = canvas?.closest?.('.apexcharts-canvas, .apexcharts-container, [id]') || canvas?.parentElement;
  if (!host) return null;
  if (host._chart) return host._chart;
  if (host.__apexcharts__) return host.__apexcharts__;
  const ApexCharts = typeof window !== 'undefined' ? window.ApexCharts : null;
  if (ApexCharts?.exec && host.id) {
    // Instance may only be reachable via dataURI on the element chart ref.
  }
  return host.querySelector?.('.apexcharts-canvas')?._chart || null;
}

/**
 * Resolve an ECharts instance for a canvas / container.
 * @param {HTMLCanvasElement} canvas
 * @returns {object|null}
 */
function getEchartsInstance(canvas) {
  const echarts = typeof window !== 'undefined' ? window.echarts : null;
  if (!echarts?.getInstanceByDom) return null;
  const host = canvas?.parentElement || canvas;
  try {
    return echarts.getInstanceByDom(host) || echarts.getInstanceByDom(canvas) || null;
  } catch {
    return null;
  }
}

/**
 * Capture one chart canvas to a PNG/JPEG data URL.
 * @param {HTMLCanvasElement} canvas
 * @returns {Promise<string|null>}
 */
async function captureCanvasChart(canvas) {
  if (!canvas || typeof canvas.toDataURL !== 'function') return null;

  configureChartJsDefaults();
  await waitForFonts();
  prepareChartContainer(canvas);

  const chartJs = getChartJsInstance(canvas);
  if (chartJs) {
    configureChartJsInstance(chartJs);
    if (typeof chartJs.resize === 'function') await settle(chartJs.resize());
    if (typeof chartJs.update === 'function') await settle(chartJs.update());
    if (typeof chartJs.render === 'function') await settle(chartJs.render());
    await settleFrame();
    if (typeof chartJs.toBase64Image === 'function') {
      return chartJs.toBase64Image('image/png', 1);
    }
  }

  const apex = getApexInstance(canvas);
  if (apex && typeof apex.updateOptions === 'function') {
    await settle(apex.updateOptions({}, false, true));
  } else if (apex && typeof apex.update === 'function') {
    await settle(apex.update());
  }
  if (apex) {
    await settleFrame();
    if (typeof apex.dataURI === 'function') {
      const uri = await apex.dataURI({ type: 'png' });
      if (uri?.img) return uri.img;
    }
  }

  const echartsInst = getEchartsInstance(canvas);
  if (echartsInst) {
    if (typeof echartsInst.resize === 'function') echartsInst.resize();
    await settleFrame();
    if (typeof echartsInst.getDataURL === 'function') {
      return echartsInst.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });
    }
  }

  // Generic canvas fallback (after a short settle for any pending draw).
  await settleFrame();
  try {
    return canvas.toDataURL('image/png');
  } catch {
    return null;
  }
}

/**
 * Replace a canvas node with an <img> using the captured data URL.
 * @param {HTMLCanvasElement} canvas
 * @param {string} dataUrl
 */
function replaceCanvasWithImage(canvas, dataUrl) {
  const img = document.createElement('img');
  img.src = dataUrl;
  img.alt = canvas.getAttribute('aria-label') || canvas.getAttribute('alt') || 'Chart';
  img.className = `${canvas.className || ''} pdf-chart-image`.trim();
  img.style.maxWidth = '100%';
  img.style.height = 'auto';
  img.style.display = 'block';
  img.style.margin = '0 auto';
  const width = canvas.getAttribute('width') || canvas.style.width;
  const height = canvas.getAttribute('height') || canvas.style.height;
  if (width) img.style.width = typeof width === 'string' && width.includes('px') ? width : `${width}px`;
  if (height) img.dataset.chartHeight = String(height);
  canvas.replaceWith(img);
}

/**
 * Find and rasterize all chart canvases under a render root.
 * Also probes ApexCharts / ECharts hosts that may not expose a bare <canvas>.
 * @param {ParentNode} root
 * @returns {Promise<number>} number of charts replaced
 */
export async function captureChartsAsImages(root) {
  if (!root?.querySelectorAll) return 0;

  configureChartJsDefaults();
  await waitForFonts();

  let replaced = 0;
  const canvases = Array.from(root.querySelectorAll('canvas'));

  for (const canvas of canvases) {
    const dataUrl = await captureCanvasChart(canvas);
    if (!dataUrl) continue;
    replaceCanvasWithImage(canvas, dataUrl);
    replaced += 1;
  }

  // ApexCharts often mounts on a div; capture via dataURI when present.
  const apexHosts = Array.from(
    root.querySelectorAll('.apexcharts-canvas, [data-apexcharts], .apexcharts-container')
  );
  for (const host of apexHosts) {
    if (host.tagName === 'IMG' || host.querySelector?.('img.pdf-chart-image')) continue;
    const chart = host._chart || host.__apexcharts__ || host.querySelector?.('canvas')?._chart;
    if (!chart || typeof chart.dataURI !== 'function') continue;
    if (typeof chart.update === 'function') await settle(chart.update());
    await settleFrame();
    try {
      const uri = await chart.dataURI({ type: 'png' });
      if (!uri?.img) continue;
      const img = document.createElement('img');
      img.src = uri.img;
      img.alt = 'Chart';
      img.className = 'pdf-chart-image';
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.style.display = 'block';
      img.style.margin = '0 auto';
      host.replaceWith(img);
      replaced += 1;
    } catch {
      // ignore
    }
  }

  // ECharts hosts
  const echarts = typeof window !== 'undefined' ? window.echarts : null;
  if (echarts?.getInstanceByDom) {
    const hosts = Array.from(root.querySelectorAll('[data-echarts], .echarts, [_echarts_instance_]'));
    for (const host of hosts) {
      if (host.tagName === 'IMG') continue;
      let inst = null;
      try {
        inst = echarts.getInstanceByDom(host);
      } catch {
        inst = null;
      }
      if (!inst || typeof inst.getDataURL !== 'function') continue;
      await settleFrame();
      try {
        if (typeof inst.update === 'function') await settle(inst.update());
        await settleFrame();
        const dataUrl = inst.getDataURL({
          type: 'png',
          pixelRatio: 2,
          backgroundColor: '#ffffff',
        });
        if (!dataUrl) continue;
        const img = document.createElement('img');
        img.src = dataUrl;
        img.alt = 'Chart';
        img.className = 'pdf-chart-image';
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
        img.style.margin = '0 auto';
        host.replaceWith(img);
        replaced += 1;
      } catch {
        // ignore
      }
    }
  }

  return replaced;
}

export default captureChartsAsImages;
