/**
 * Version Management for My Operating Manual
 * 
 * Provides version information and metadata for:
 * - PDF footers
 * - Markdown output headers
 * - HTML templates
 * - Audit trails
 */

/**
 * Load version metadata
 * 
 * NOTE: Currently returns hardcoded defaults. For proper version tracking in PDFs,
 * implement build-time injection via Vite plugin or environment variables.
 * 
 * version.json exists at modules/pdf-engine/version.json but cannot be loaded
 * at runtime (browser doesn't have fs access, Node.js requires complex ESM patterns).
 * 
 * @returns {object} Version object with system information
 */
export function loadVersionMetadata() {
  // Returns defaults; should be replaced with injected values at build time
  return getDefaultVersionMetadata();
}

/**
 * Get default version metadata if file not available
 * @private
 * @returns {object}
 */
function getDefaultVersionMetadata() {
  return {
    pdfEngineVersion: '1.0.0',
    pipelineVersion: '1.0.0',
    appVersion: '1.0.0',
    buildTimestamp: new Date().toISOString(),
    systemName: 'My Operating Manual',
    description: 'Operating Manual PDF generation system'
  };
}

/**
 * Get runtime metadata with current timestamp
 * @returns {object} Version metadata with runtime timestamp
 */
export function getVersionWithTimestamp() {
  const base = loadVersionMetadata();
  return {
    ...base,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Format version info for PDF footer
 * @returns {string}
 */
export function formatVersionFooter() {
  const version = getVersionWithTimestamp();
  return (
    `Operating Manual v${version.appVersion} | ` +
    `PDF Engine v${version.pdfEngineVersion} | ` +
    `Generated ${formatDateTime(version.generatedAt)}`
  );
}

/**
 * Format version info for markdown header
 * @returns {string}
 */
export function formatVersionHeader() {
  const version = getVersionWithTimestamp();
  return (
    `**Document Version:** ${version.appVersion}\n` +
    `**PDF Engine:** v${version.pdfEngineVersion}\n` +
    `**Generated:** ${formatDateTime(version.generatedAt)}`
  );
}

/**
 * Format version info for HTML comments
 * @returns {string}
 */
export function formatVersionHtmlComment() {
  const version = getVersionWithTimestamp();
  return (
    `<!-- My Operating Manual v${version.appVersion} | ` +
    `PDF Engine v${version.pdfEngineVersion} | ` +
    `Generated ${version.generatedAt} -->`
  );
}

/**
 * Format date/time in human-readable format
 * @private
 * @param {string|Date} date
 * @returns {string}
 */
function formatDateTime(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Get complete version information object
 * @returns {object}
 */
export function getCompleteVersionInfo() {
  return getVersionWithTimestamp();
}

/**
 * Get version string for logging
 * @returns {string}
 */
export function getVersionString() {
  const version = loadVersionMetadata();
  return `${version.systemName} v${version.appVersion} (PDF Engine v${version.pdfEngineVersion})`;
}

export default {
  loadVersionMetadata,
  getVersionWithTimestamp,
  formatVersionFooter,
  formatVersionHeader,
  formatVersionHtmlComment,
  getCompleteVersionInfo,
  getVersionString,
};
